const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Check verified badge using Roblox API (not HTML)
app.get('/userid/:userId', async (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId parameter' });

  try {
    const url = `https://users.roblox.com/v1/users/${userId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch Roblox API data' });
    }

    const user = await response.json();
    const hasVerifiedBadge = user.hasVerifiedBadge === true;

    return res.json({
      userId,
      verified: hasVerifiedBadge
    });
  } catch (error) {
    console.error('Error checking verified badge:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
