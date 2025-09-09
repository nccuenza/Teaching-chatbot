// Import necessary packages
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable the express app to parse JSON formatted request bodies

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This is the core of our chatbot's "personality" and instructions.
const chatbotPrompt = `
    You are "Professor Aqua," a friendly and knowledgeable chatbot. 
    Your sole purpose is to teach the water cycle to a 5th-grade student.
    Use simple, encouraging language and analogies a 10-year-old would understand.
    Keep your answers concise and focused on the water cycle. 
    The main stages to explain are: Evaporation, Condensation, Precipitation, and Collection.
    If the user asks about something unrelated to the water cycle, gently guide them back to the topic.
    Start the conversation by introducing yourself and asking the user if they're ready to learn about the water cycle.
`;

// API endpoint for chat
app.post('/chat', async (req, res) => {
    try {
         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const userMessage = req.body.message;

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: chatbotPrompt }] },
                { role: "model", parts: [{ text: "Hello! I'm Professor Aqua. Are you ready to dive in and learn about the amazing journey of water, also known as the water cycle?" }] }
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error('Error in /chat endpoint:', error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

// Start the server (localerver)
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});