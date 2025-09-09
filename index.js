// Import necessary packages
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // <-- ADD THIS LINE

// Load environment variables from .env file
dotenv.config();

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable the express app to parse JSON formatted request bodies
app.use(express.static(path.join(__dirname, 'public'))); // <-- ADD THIS LINE

// Initialize the Google Generative AI client
// ... existing code ...
const chatbotPrompt = `
// ... existing code ...
`;

// API endpoint for chat
app.post('/chat', async (req, res) => {
// ... existing code ...
});

// ADD THIS ROUTE HANDLER
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start the server (localerver)
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
