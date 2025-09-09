// Import necessary packages
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory storage for demo (a database is recommended for production)
let conversations = {};

// Grade level content difficulty mapping
const GRADE_LEVELS = {
  'k-2': { maxWords: 50, complexity: 'very simple', examples: true },
  '3-5': { maxWords: 100, complexity: 'simple', examples: true },
  '6-8': { maxWords: 150, complexity: 'moderate', examples: false },
  '9-12': { maxWords: 200, complexity: 'advanced', examples: false }
};

/**
 * Generates a teaching response from the Gemini API based on the user's question and grade level.
 * @param {string} question The student's question.
 * @param {string} gradeLevel The selected grade level.
 * @param {Array} conversationHistory The history of the current conversation.
 * @returns {Promise<string>} The AI-generated response.
 */
async function generateTeachingResponse(question, gradeLevel, conversationHistory = []) {
    const config = GRADE_LEVELS[gradeLevel] || GRADE_LEVELS['6-8'];
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Construct a detailed prompt for the AI
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

/**
 * A simple content filter for K-12 appropriateness.
 * @param {string} text The text to check.
 * @returns {boolean} True if the content is appropriate, otherwise false.
 */
function isContentAppropriate(text) {
  const inappropriateWords = ['violence', 'weapon', 'drug', 'porn']; // Add more words as needed
  return !inappropriateWords.some(word => text.toLowerCase().includes(word));
}

// --- API Routes ---

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, gradeLevel = '6-8', sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

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

    const response = await generateTeachingResponse(
      message,
      gradeLevel,
      conversations[sessionId]
    );

    // Store the conversation turn
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
    console.error('An error occurred in the /api/chat route:', error);
    res.status(500).json({
        error: 'Failed to generate a response from the AI model.',
        details: error.message
    });
  }
});

// Endpoint to get conversation history
app.get('/api/conversation/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = conversations[sessionId] || [];
  res.json({ history });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🎓 K-12 Teaching Chatbot running on http://localhost:${PORT}`);
  console.log(`📚 Ready to help students learn!`);
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('Server shutting down...');
  process.exit(0);
});

