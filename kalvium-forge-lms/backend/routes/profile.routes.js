const express = require('express');
const router = express.Router();
const db = require('../services/db.service');

// GET /api/profile/:id
// Returns full student profile: personal info + education details + enrolled courses
router.get('/:id', async (req, res) => {
    const studentId = parseInt(req.params.id, 10);

    if (isNaN(studentId)) {
        return res.status(400).json({ success: false, message: 'Invalid student ID.' });
    }

    try {
        // 1. Fetch core student info + education details via LEFT JOIN
        // (LEFT JOIN ensures students without an education_details row still return a profile)
        const profile = await db.get(
            `SELECT
                s.id,
                s.full_name,
                s.email,
                s.phone,
                s.date_of_birth,
                s.city,
                s.created_at,
                ed.tenth_board,
                ed.tenth_percentage,
                ed.twelfth_board,
                ed.twelfth_percentage
             FROM students s
             LEFT JOIN education_details ed ON ed.student_id = s.id
             WHERE s.id = ?`,
            [studentId]
        );

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }

        // 2. Fetch all course applications with course details via JOIN
        const applications = await db.all(
            `SELECT
                a.id            AS application_id,
                a.status,
                a.applied_at,
                a.reviewed_at,
                c.id            AS course_id,
                c.title         AS course_title,
                c.duration_months,
                c.fee
             FROM applications a
             INNER JOIN courses c ON c.id = a.course_id
             WHERE a.student_id = ?
             ORDER BY a.applied_at DESC`,
            [studentId]
        );

        // 3. Compile into a clean JSON object for the frontend
        return res.status(200).json({
            success: true,
            profile: {
                id:           profile.id,
                full_name:    profile.full_name,
                email:        profile.email,
                phone:        profile.phone,
                date_of_birth: profile.date_of_birth,
                city:         profile.city,
                member_since: profile.created_at,
                education: {
                    tenth_board:        profile.tenth_board,
                    tenth_percentage:   profile.tenth_percentage,
                    twelfth_board:      profile.twelfth_board,
                    twelfth_percentage: profile.twelfth_percentage
                },
                applications: applications.map(app => ({
                    application_id: app.application_id,
                    status:         app.status,
                    applied_at:     app.applied_at,
                    reviewed_at:    app.reviewed_at,
                    course: {
                        id:              app.course_id,
                        title:           app.course_title,
                        duration_months: app.duration_months,
                        fee:             app.fee
                    }
                }))
            }
        });

    } catch (err) {
        console.error('❌ Profile fetch error:', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


// PUT /api/profile/:id
// Updates personal info (phone, city) and education details for a student
router.put('/:id', async (req, res) => {
    const studentId = parseInt(req.params.id, 10);

    if (isNaN(studentId)) {
        return res.status(400).json({ success: false, message: 'Invalid student ID.' });
    }

    const {
        phone,
        city,
        date_of_birth,
        tenth_board,
        tenth_percentage,
        twelfth_board,
        twelfth_percentage
    } = req.body;

    try {
        // Update personal info on the students table (including date_of_birth)
        await db.run(
            `UPDATE students SET phone = ?, city = ?, date_of_birth = ? WHERE id = ?`,
            [phone ?? null, city ?? null, date_of_birth ?? null, studentId]
        );

        // Upsert education details — creates the row if it doesn't exist yet
        await db.run(
            `INSERT OR REPLACE INTO education_details
                (student_id, tenth_board, tenth_percentage, twelfth_board, twelfth_percentage)
             VALUES (?, ?, ?, ?, ?)`,
            [
                studentId,
                tenth_board    ?? null,
                tenth_percentage   != null ? parseFloat(tenth_percentage)   : null,
                twelfth_board  ?? null,
                twelfth_percentage != null ? parseFloat(twelfth_percentage) : null
            ]
        );

        return res.status(200).json({ success: true, message: 'Profile updated.' });

    } catch (err) {
        console.error('❌ Profile update error:', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// POST /api/profile/:id/course
// Manually adds a new course and links it to the student via an accepted application
router.post('/:id/course', async (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    if (isNaN(studentId)) {
        return res.status(400).json({ success: false, message: 'Invalid student ID.' });
    }

    const { course_name, duration, fee } = req.body;
    if (!course_name) {
        return res.status(400).json({ success: false, message: 'course_name is required.' });
    }

    try {
        // Insert a new course record
        await db.run(
            `INSERT INTO courses (title, duration_months, fee) VALUES (?, ?, ?)`,
            [course_name, parseInt(duration) || 0, parseFloat(fee) || 0]
        );

        // Retrieve the auto-generated course ID
        const row = await db.get(`SELECT last_insert_rowid() AS id`);
        const newCourseId = row.id;

        // Link student to the new course as accepted
        await db.run(
            `INSERT INTO applications (student_id, course_id, status) VALUES (?, ?, 'accepted')`,
            [studentId, newCourseId]
        );

        return res.status(201).json({ success: true, message: 'Course added.' });
    } catch (err) {
        console.error('❌ Course add error:', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// DELETE /api/profile/:id/course/:courseId
// Removes a course application for a student by course ID
router.delete('/:id/course/:courseId', async (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    const courseId  = parseInt(req.params.courseId, 10);

    if (isNaN(studentId) || isNaN(courseId)) {
        return res.status(400).json({ success: false, message: 'Invalid ID.' });
    }

    try {
        await db.run(
            `DELETE FROM applications WHERE student_id = ? AND course_id = ?`,
            [studentId, courseId]
        );
        return res.status(200).json({ success: true, message: 'Course removed.' });
    } catch (err) {
        console.error('❌ Course delete error:', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// PUT /api/profile/:id/course/:courseId/toggle
// Toggles the course application status between 'accepted' and 'COMPLETED'
router.put('/:id/course/:courseId/toggle', async (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    const courseId  = parseInt(req.params.courseId, 10);

    if (isNaN(studentId) || isNaN(courseId)) {
        return res.status(400).json({ success: false, message: 'Invalid ID.' });
    }

    try {
        await db.run(
            `UPDATE applications
             SET status = CASE WHEN status = 'accepted' THEN 'rejected' ELSE 'accepted' END
             WHERE student_id = ? AND course_id = ?`,
            [studentId, courseId]
        );
        return res.status(200).json({ success: true, message: 'Course status toggled.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
