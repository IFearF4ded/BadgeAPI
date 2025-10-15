const express = require('express');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON from incoming requests
app.use(express.json());

// Add logging for every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// POST route to receive Roblox userId and fetch badges
app.post('/', async (req, res) => {
  console.log('Request body:', req.body);

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in request body' });
  }

  try {
    const apiUrl = `https://badges.roblox.com/v1/users/${userId}/badges?limit=100&sortOrder=Asc`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch badges for user ${userId}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
