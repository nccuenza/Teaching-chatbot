// server.js - Main server file
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

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

// Mock LLM function (replace with actual OpenAI/other LLM API)
async function generateTeachingResponse(question, gradeLevel, conversationHistory = []) {
  const config = GRADE_LEVELS[gradeLevel] || GRADE_LEVELS['6-8'];
  
  // This is a simplified mock - replace with actual LLM API call
  const prompt = `
    You are a friendly K-12 teaching assistant. 
    Grade Level: ${gradeLevel}
    Complexity: ${config.complexity}
    Max Response Length: ${config.maxWords} words
    Include examples: ${config.examples}
    
    Student Question: ${question}
    
    Provide an educational, age-appropriate response. Be encouraging and clear.
    ${config.examples ? 'Include simple examples when helpful.' : ''}
  `;

  // Mock response based on common topics
  const mockResponses = {
    science: "Science is all about asking questions and finding answers! When you drop a ball, it falls down because of gravity - a force that pulls things toward Earth. Try dropping different objects and see what happens!",
    math: "Math helps us solve problems every day! If you have 3 apples and eat 1, you have 2 left. That's subtraction: 3 - 1 = 2. Practice with objects around you!",
    history: "History tells us stories about people who lived long ago. They built amazing things like pyramids and castles, and their discoveries help us today!",
    default: "That's a great question! Learning happens when we're curious about the world around us. What specifically would you like to know more about?"
  };

  const topic = question.toLowerCase().includes('science') ? 'science' :
                question.toLowerCase().includes('math') ? 'math' :
                question.toLowerCase().includes('history') ? 'history' : 'default';

  return mockResponses[topic];
}

// Content filter for K-12 appropriateness
function isContentAppropriate(text) {
  const inappropriateWords = ['violence', 'weapon', 'drug']; // Add more as needed
  return !inappropriateWords.some(word => text.toLowerCase().includes(word));
}

// API Routes
app.post('/api/chat', async (req, res) => {
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

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Sorry, I had trouble understanding that. Please try again!' });
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
   npm install express cors dotenv

3. Create .env file:
   PORT=3000
   OPENAI_API_KEY=your_api_key_here

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