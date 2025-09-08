// --- IMPORTANT ---
// When you deploy, change this URL to your live Render backend URL.
const API_URL = 'http://localhost:3000/chat';
// Example Deployed URL: 'https://water-cycle-chatbot.onrender.com/chat'

const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}

// Add the initial greeting from Professor Aqua
addMessage("Hello! I'm Professor Aqua. Are you ready to dive in and learn about the amazing journey of water?", 'bot');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();

    if (!userMessage) return;

    addMessage(userMessage, 'user');
    userInput.value = ''; // Clear the input field

    // Show a "typing..." indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot-message');
    typingIndicator.textContent = 'Professor Aqua is thinking...';
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();

        // Remove the "typing..." indicator and add the actual response
        chatBox.removeChild(typingIndicator);
        addMessage(data.reply, 'bot');

    } catch (error) {
        console.error('Error fetching bot reply:', error);
        chatBox.removeChild(typingIndicator);
        addMessage('Oops! I seem to be having some trouble connecting. Please try again.', 'bot');
    }
});