const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/userid/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }

  const baseUrl = `https://badges.roblox.com/v1/users/${userId}/badges?limit=100&sortOrder=Asc`;
  let nextPageCursor = null;
  let allBadges = [];

  try {
    do {
      const url = nextPageCursor ? `${baseUrl}&cursor=${nextPageCursor}` : baseUrl;

      const response = await fetch(url);
      if (!response.ok) {
        return res.status(response.status).json({ error: `Failed to fetch badges for user ${userId}` });
      }

      const json = await response.json();

      if (Array.isArray(json.data)) {
        allBadges.push(...json.data);
      }

      nextPageCursor = json.nextPageCursor;
    } while (nextPageCursor);

    res.json({
      userId: userId,
      badgeCount: allBadges.length,
      data: allBadges
    });

  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
