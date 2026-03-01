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
        // 1. Fetch core student info + education details via INNER JOIN
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
             INNER JOIN education_details ed ON ed.student_id = s.id
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

module.exports = router;
