const express = require('express');
const router = express.Router();

// POST /api/chat  — placeholder
router.post('/', async (req, res) => {
    res.status(200).json({ success: true, message: 'Chat route is working. Implement me!' });
});

module.exports = router;
