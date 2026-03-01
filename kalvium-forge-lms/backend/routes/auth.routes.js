const express = require('express');
const router = express.Router();
const db = require('../services/db.service');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate that both fields are provided
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required.'
        });
    }

    try {
        // Query the students table for a matching email
        const student = await db.get(
            'SELECT id, full_name, email, password FROM students WHERE email = ?',
            [email]
        );

        // Check if student exists
        if (!student) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Raw text comparison (no bcrypt for this boilerplate)
        if (student.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Credentials match — return success with user info
        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            user: {
                id: student.id,
                full_name: student.full_name
            }
        });

    } catch (err) {
        console.error('❌ Login error:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

module.exports = router;
