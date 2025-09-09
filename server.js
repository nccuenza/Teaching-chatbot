// server.js - Main server file
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
// +++ Add these two lines +++
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// +++++++++++++++++++++++++++++

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory storage for demo (use database in production)
let conversations = {};

// Grade level content difficulty mapping
const GRADE_LEVELS = {
  'k-2': { maxWords: 50, complexity: 'very simple', examples: true },
  '3-5': { maxWords: 100, complexity: 'simple', examples: true },
  '6-8': { maxWords: 150, complexity: 'moderate', examples: false },
  '9-12': { maxWords: 200, complexity: 'advanced', examples: false }
};

// Replace the entire old mock function with this new one
async function generateTeachingResponse(question, gradeLevel, conversationHistory = []) {
    const config = GRADE_LEVELS[gradeLevel] || GRADE_LEVELS['6-8'];
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Construct a more detailed prompt for the AI
    const prompt = `You are a friendly and encouraging K-12 teaching assistant for the water cycle.
Your student is in grade level: ${gradeLevel}.
Your response should be tailored to this level with a complexity of "${config.complexity}".
Keep the response under ${config.maxWords} words.
${config.examples ? 'Use simple, relatable examples.' : 'Do not use complex examples.'}
Previous conversation history is provided for context. Do not repeat answers.

History: ${JSON.stringify(conversationHistory)}
Student's Question: "${question}"

Provide an educational, age-appropriate response:`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Error generating response from Gemini:", error);
        return "I'm having a little trouble thinking right now. Please try asking me again in a moment!";
    }
}

// Content filter for K-12 appropriateness
function isContentAppropriate(text) {
  const inappropriateWords = ['violence', 'weapon', 'drug']; // Add more as needed
  return !inappropriateWords.some(word => text.toLowerCase().includes(word));
}

// API Routes
app.post('/api/chat', async (req, res) => {
  console.log('=== CHAT REQUEST RECEIVED ===');
  console.log('Message:', req.body.message);
  console.log('Grade Level:', req.body.gradeLevel);
  console.log('Session ID:', req.body.sessionId);
  console.log('=============================');
  try {
    const { message, gradeLevel = '6-8', sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Content filtering
    if (!isContentAppropriate(message)) {
      return res.json({
        response: "Let's focus on learning topics that are fun and educational! What subject would you like to explore?",
        isFiltered: true
      });
    }

    // Get or create conversation history
    if (!conversations[sessionId]) {
      conversations[sessionId] = [];
    }

    // Generate teaching response
    const response = await generateTeachingResponse(
      message, 
      gradeLevel, 
      conversations[sessionId]
    );

    // Store conversation
    conversations[sessionId].push({
      student: message,
      teacher: response,
      timestamp: new Date().toISOString(),
      gradeLevel
    });

    res.json({
      response,
      gradeLevel,
      timestamp: new Date().toISOString()
    });

// ... inside your app.post('/api/chat', ...) route
  } catch (error) {
    // Replace the old catch block with this one
    console.error('An error occurred in the /api/chat route:', error);
    res.status(500).json({ 
        error: 'Failed to generate a response from the AI model.',
        details: error.message 
    });
  }
});

// Get conversation history
app.get('/api/conversation/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = conversations[sessionId] || [];
  res.json({ history });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎓 K-12 Teaching Chatbot running on http://localhost:${PORT}`);
  console.log(`📚 Ready to help students learn!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Server shutting down...');
  process.exit(0);
});

/* 
=== SETUP INSTRUCTIONS ===

1. Initialize project:
   npm init -y

2. Install dependencies:
   npm install express cors dotenv @google/generative-ai

3. Create .env file:
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here

4. Create public/index.html (see next file)

5. Run server:
   npm start

=== FILE STRUCTURE ===
k12-teaching-bot/
├── server.js
├── package.json
├── .env
├── .gitignore
├── README.md
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── docs/
    └── API.md

=== PACKAGE.JSON SCRIPTS ===
Add to your package.json:
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}

=== GITIGNORE ===
node_modules/
.env
*.log
.DS_Store

=== NEXT STEPS ===
1. Replace mock LLM with real API (OpenAI, Anthropic, etc.)
2. Add database for persistent conversations
3. Implement user authentication
4. Add more sophisticated content filtering
5. Create subject-specific teaching modules
6. Add progress tracking for students
*/