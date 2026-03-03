const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../services/db.service');

const JWT_SECRET = process.env.JWT_SECRET || 'kalvium_forge_secret_key';
const SALT_ROUNDS = 10;

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required.'
        });
    }

    try {
        const student = await db.get(
            'SELECT id, full_name, email, password FROM students WHERE email = ?',
            [email]
        );

        if (!student) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Secure bcrypt comparison — never compares plain text
        const passwordMatch = await bcrypt.compare(password, student.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Sign a JWT valid for 7 days
        const token = jwt.sign(
            { id: student.id, full_name: student.full_name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            token,
            student: {
                id: student.id,
                full_name: student.full_name
            }
        });

    } catch (err) {
        console.error('❌ Login error:', err.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST: Register a new student
router.post('/register', async (req, res) => {
    const { full_name, email, password, phone, date_of_birth, city } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
    }

    try {
        const existingUser = await db.all('SELECT id FROM students WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ error: "Email already in use." });
        }

        // Hash the password before storing — never store plain text
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const insertQuery = `
            INSERT INTO students (full_name, email, password, phone, date_of_birth, city) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [full_name, email, hashedPassword, phone || '', date_of_birth || '', city || ''];

        await db.run(insertQuery, params);

        // Auto-create a blank education_details row so profile JOIN never fails
        const newStudent = await db.get('SELECT id FROM students WHERE email = ?', [email]);
        if (newStudent) {
            await db.run(
                `INSERT OR IGNORE INTO education_details (student_id, tenth_board, tenth_percentage, twelfth_board, twelfth_percentage)
                 VALUES (?, '', 0, '', 0)`,
                [newStudent.id]
            );
        }

        res.status(201).json({ success: true, message: "Student registered successfully." });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Failed to register student." });
    }
});

module.exports = router;
