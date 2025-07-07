const express = require('express');
const fetch = require('node-fetch'); // Required for Node.js to make fetch requests
const cors = require('cors');       // Middleware to enable CORS for your backend

const app = express();
const PORT = process.env.PORT || 3001; // Your backend will run on this port

// Enable CORS for your frontend. For production, specify your Netlify domain.
// Example for development: app.use(cors());
// Example for production: app.use(cors({ origin: 'https://mavaseo.netlify.app' }));
app.use(cors());

app.get('/fetch-url', async (req, res) => {
    const targetUrl = req.query.url; // Get the target URL from the query parameter

    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required.' });
    }

    try {
        // Your backend fetches the content from the external URL
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        const content = await response.text();
        res.json({ contents: content }); // Send the fetched content back to your frontend
    } catch (error) {
        console.error('Error fetching external URL:', error);
        res.status(500).json({ error: `Failed to fetch URL: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});