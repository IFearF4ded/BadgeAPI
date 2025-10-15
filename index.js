const express = require('express');
const fetch = require('node-fetch'); // Import fetch
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const apiUrl = `https://badges.roblox.com/v1/users/${userId}/badges?limit=100&sortOrder=Asc`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch badges for user ${userId}` });
    }

    const data = await response.json();

    // Send the JSON data back to client
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
