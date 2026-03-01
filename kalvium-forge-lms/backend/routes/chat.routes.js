const express = require('express');
const router = express.Router();
const { askAgent } = require('../services/agent.service');

router.post('/', async (req, res) => {
    const { message, studentId } = req.body;

    // SECURE: Strictly require both message AND studentId
    if (!message || !studentId) {
        return res.status(400).json({ error: "Both message and valid studentId are required." });
    }

    try {
        console.log(`💬 User (student ${studentId}): ${message}`);

        const result = await askAgent(message, studentId);
        console.log(`🤖 Agent: ${result.reply}`);

        res.json({ 
            success: true,
            reply: result.reply,
            databaseUpdated: result.databaseUpdated
        });

    } catch (error) {
        console.error("❌ Agent Error:", error);
        res.status(500).json({ error: "Failed to process the request." });
    }
});

module.exports = router;