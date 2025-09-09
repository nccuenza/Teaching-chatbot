// test-gemini.js - Test your Gemini API connection
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  try {
    console.log('🧪 Testing Gemini API connection...');
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in .env file');
      return;
    }
    
    console.log('✅ API key found in environment');
    console.log('🔑 Key starts with:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Test simple prompt
    console.log('📡 Sending test prompt to Gemini...');
    const prompt = "Explain what water is in simple terms for a 5-year-old.";
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('✅ SUCCESS! Gemini responded:');
    console.log('📝 Response:', response);
    
  } catch (error) {
    console.error('❌ ERROR testing Gemini API:');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('🔧 Fix: Check your API key in .env file');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.error('🔧 Fix: Make sure Gemini API is enabled for your Google account');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      console.error('🔧 Fix: You may have exceeded your API quota');
    }
  }
}

testGeminiAPI();

// Instructions:
// 1. Save this as 'test-gemini.js' in your project folder
// 2. Run: node test-gemini.js
// 3. This will test if your Gemini API key works