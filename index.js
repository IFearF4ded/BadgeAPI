const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // parse JSON bodies

// Temporary in-memory storage for demo
let gameData = {};

// Endpoint for external URL to "send data"
app.get('/userid/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { score } = req.query; // optional extra data sent via query

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId parameter' });
    }

    try {
        // Store or update the data
        gameData[userId] = {
            score: score ? Number(score) : 0,
            timestamp: Date.now()
        };

        console.log(`Updated data for user ${userId}:`, gameData[userId]);

        res.json({
            userId,
            status: 'success',
            data: gameData[userId]
        });

    } catch (error) {
        console.error('Error updating game data:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Optional: endpoint Roblox game can poll to fetch all data
app.get('/getData', (req, res) => {
    res.json(gameData);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
