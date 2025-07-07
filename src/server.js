const express = require('express');
const fetch = require('node-fetch'); // For making HTTP requests in Node.js
const cors = require('cors');       // To allow your frontend to talk to this backend

const app = express();
const PORT = process.env.PORT || 3001; // Or any port you prefer

// Enable CORS for all origins (for development, restrict in production)
app.use(cors());

app.get('/fetch-url', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required.' });
    }

    try {
        const response = await fetch(targetUrl); // Backend fetches the external URL
        if (!response.ok) {
            // It's good practice to pass through the status if the target returns an error
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        const content = await response.text();
        res.json({ contents: content }); // Send the fetched content back to the frontend
    } catch (error) {
        console.error('Error fetching external URL:', error);
        res.status(500).json({ error: `Failed to fetch URL: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});