const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // Import cors

const app = express();
const PORT = process.env.PORT || 3001; // Or any port you prefer

app.use(cors()); // Enable CORS for all routes

app.get('/fetch-url', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required.' });
    }

    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        res.json({ contents: content });
    } catch (error) {
        console.error('Error fetching external URL:', error);
        res.status(500).json({ error: `Failed to fetch URL: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});