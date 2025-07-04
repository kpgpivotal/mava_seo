import React, { useState, useEffect } from 'react';

// Main App Component
const App = () => {
    const [url, setUrl] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [metaTags, setMetaTags] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to fetch HTML content from the provided URL
    const fetchHtml = async () => {
        setLoading(true);
        setError('');
        setHtmlContent('');
        setMetaTags({});

        try {
            // Using a proxy to bypass CORS issues for external URLs.
            // In a real-world scenario, you'd have a server-side proxy.
            // For this demonstration, we'll try to fetch directly,
            // but note that CORS will likely block external sites.
            // A more robust solution would involve a backend proxy.
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const content = data.contents;
            setHtmlContent(content);
            parseMetaTags(content);
        } catch (e) {
            console.error("Error fetching HTML:", e);
            setError(`Failed to fetch URL. Please ensure it's a valid URL and consider potential CORS restrictions: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Function to parse meta tags from HTML content
    const parseMetaTags = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tags = {};

        // Helper to get meta content by name or property
        const getMetaContent = (attribute, value) => {
            const element = doc.querySelector(`meta[${attribute}="${value}"]`);
            return element ? element.getAttribute('content') : '';
        };

        // Title Tag
        tags.title = doc.querySelector('title')?.textContent || '';

        // Meta Description
        tags.description = getMetaContent('name', 'description');

        // Canonical URL
        tags.canonical = doc.querySelector('link[rel="canonical"]')?.href || '';

        // Robots Meta Tag
        tags.robots = getMetaContent('name', 'robots');

        // Open Graph Tags (for Facebook, LinkedIn, etc.)
        tags.ogTitle = getMetaContent('property', 'og:title');
        tags.ogDescription = getMetaContent('property', 'og:description');
        tags.ogImage = getMetaContent('property', 'og:image');
        tags.ogUrl = getMetaContent('property', 'og:url');
        tags.ogType = getMetaContent('property', 'og:type');

        // Twitter Card Tags
        tags.twitterCard = getMetaContent('name', 'twitter:card');
        tags.twitterSite = getMetaContent('name', 'twitter:site');
        tags.twitterTitle = getMetaContent('name', 'twitter:title');
        tags.twitterDescription = getMetaContent('name', 'twitter:description');
        tags.twitterImage = getMetaContent('name', 'twitter:image');

        setMetaTags(tags);
    };

    // Function to provide SEO feedback
    const getSeoFeedback = (tags) => {
        const feedback = [];

        // Title Tag Feedback
        if (!tags.title) {
            feedback.push({ type: 'warning', message: 'Missing <title> tag. This is crucial for SEO.' });
        } else if (tags.title.length < 30) {
            feedback.push({ type: 'info', message: `Title is short (${tags.title.length} chars). Consider making it more descriptive (30-60 chars).` });
        } else if (tags.title.length > 60) {
            feedback.push({ type: 'warning', message: `Title is too long (${tags.title.length} chars). Aim for 30-60 characters to avoid truncation.` });
        } else {
            feedback.push({ type: 'success', message: `Title tag looks good (${tags.title.length} chars).` });
        }

        // Meta Description Feedback
        if (!tags.description) {
            feedback.push({ type: 'warning', message: 'Missing meta description. This helps search engines understand your page.' });
        } else if (tags.description.length < 50) {
            feedback.push({ type: 'info', message: `Meta description is short (${tags.description.length} chars). Aim for 50-160 characters.` });
        } else if (tags.description.length > 160) {
            feedback.push({ type: 'warning', message: `Meta description is too long (${tags.description.length} chars). Aim for 50-160 characters to avoid truncation.` });
        } else {
            feedback.push({ type: 'success', message: `Meta description looks good (${tags.description.length} chars).` });
        }

        // Canonical URL Feedback
        if (!tags.canonical) {
            feedback.push({ type: 'info', message: 'Canonical URL is missing. Consider adding one to prevent duplicate content issues.' });
        } else {
            feedback.push({ type: 'success', message: `Canonical URL present: ${tags.canonical}` });
        }

        // Open Graph Tags Feedback
        if (!tags.ogTitle || !tags.ogDescription || !tags.ogImage) {
            feedback.push({ type: 'warning', message: 'Missing one or more Open Graph tags (og:title, og:description, og:image). These are important for social media sharing.' });
        } else {
            feedback.push({ type: 'success', message: 'Open Graph tags are present.' });
        }

        // Twitter Card Tags Feedback
        if (!tags.twitterCard || !tags.twitterTitle || !tags.twitterDescription || !tags.twitterImage) {
            feedback.push({ type: 'warning', message: 'Missing one or more Twitter Card tags. These are important for Twitter sharing.' });
        } else {
            feedback.push({ type: 'success', message: 'Twitter Card tags are present.' });
        }

        return feedback;
    };

    const feedback = getSeoFeedback(metaTags);

    // Helper for placeholder images
    const getPlaceholderImage = (width, height, text = 'Image') =>
        `https://placehold.co/${width}x${height}/e0e0e0/333333?text=${encodeURIComponent(text)}`;

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            {/* Header */}
            <header className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">MAVA SEO Analyzer</h1>
                    <p className="text-lg text-gray-600">Analyze and optimize your website's meta tags.</p>
                </div>
                <div className="text-sm text-gray-500 text-center md:text-right">
                    <p><strong>MAVA Partners</strong></p>
                    <p>6001 W. Parmer, Ln Ste 370-199, Austin, TX 78727</p>
                    <p>Phone: +1 512 888 4257 | Email: sales@mavapartners.com</p>
                </div>
            </header>

            {/* URL Input Section */}
            <section className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Enter Website URL</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="url"
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                        placeholder="e.g., https://www.example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                fetchHtml();
                            }
                        }}
                    />
                    <button
                        onClick={fetchHtml}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !url}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </div>
                        ) : (
                            'Analyze SEO'
                        )}
                    </button>
                </div>
                {error && (
                    <p className="mt-4 text-red-600 text-sm p-3 bg-red-100 rounded-lg border border-red-200">
                        Error: {error}
                    </p>
                )}
            </section>

            {/* SEO Analysis Results */}
            {Object.keys(metaTags).length > 0 && (
                <section className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">SEO Analysis Results</h2>

                    {/* Feedback Section */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-600 mb-3">Feedback</h3>
                        <div className="space-y-2">
                            {feedback.map((item, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg flex items-center gap-3 ${
                                        item.type === 'success' ? 'bg-green-100 text-green-700' :
                                        item.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}
                                >
                                    {item.type === 'success' && <span className="text-green-500 text-xl">✔</span>}
                                    {item.type === 'warning' && <span className="text-yellow-500 text-xl">⚠️</span>}
                                    {item.type === 'info' && <span className="text-blue-500 text-xl">ℹ️</span>}
                                    <p className="text-sm">{item.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Extracted Meta Tags */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-600 mb-3">Extracted Meta Tags</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm break-words">
                            {Object.entries(metaTags).map(([key, value]) => (
                                <p key={key} className="mb-1">
                                    <strong className="text-indigo-600">{key}:</strong> {value || '<not found>'}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Google Search Preview */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-600 mb-3">Google Search Preview</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                            <a href={url || '#'} target="_blank" rel="noopener noreferrer" className="text-green-700 text-sm truncate block mb-1">
                                {url || 'https://www.example.com'}
                            </a>
                            <h4 className="text-blue-700 text-xl font-medium mb-1 hover:underline cursor-pointer">
                                {metaTags.title || 'Example Page Title - Default Site Name'}
                            </h4>
                            <p className="text-gray-600 text-sm">
                                {metaTags.description || 'This is a default meta description for your page. It should be compelling and summarize the content. Aim for 50-160 characters.'}
                            </p>
                        </div>
                    </div>

                    {/* Social Media Previews */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-3">Social Media Previews</h3>

                        {/* Open Graph (Facebook/LinkedIn) Preview */}
                        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                            <h4 className="text-lg font-medium text-gray-700 mb-2">Facebook / LinkedIn Preview (Open Graph)</h4>
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <img
                                    src={metaTags.ogImage || getPlaceholderImage(600, 315, 'Open Graph Image')}
                                    alt="Open Graph Preview"
                                    className="w-full h-auto object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(600, 315, 'Image Load Error'); }}
                                />
                                <div className="p-3 bg-gray-50">
                                    <p className="text-gray-500 text-xs uppercase mb-1">{url ? new URL(url).hostname : 'example.com'}</p>
                                    <h5 className="font-semibold text-gray-800 text-base mb-1">
                                        {metaTags.ogTitle || 'Default Open Graph Title'}
                                    </h5>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {metaTags.ogDescription || 'This is the default Open Graph description. It should be engaging and concise to encourage clicks on social media.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Twitter Card Preview */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                            <h4 className="text-lg font-medium text-gray-700 mb-2">Twitter Preview (Twitter Card)</h4>
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <img
                                    src={metaTags.twitterImage || getPlaceholderImage(500, 262, 'Twitter Card Image')}
                                    alt="Twitter Card Preview"
                                    className="w-full h-auto object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(500, 262, 'Image Load Error'); }}
                                />
                                <div className="p-3 bg-gray-50">
                                    <h5 className="font-semibold text-gray-800 text-base mb-1">
                                        {metaTags.twitterTitle || 'Default Twitter Card Title'}
                                    </h5>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {metaTags.twitterDescription || 'This is the default Twitter Card description. Keep it short and impactful for Twitter users.'}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">By @{metaTags.twitterSite?.replace('@', '') || 'MAVAPartners'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default App;
