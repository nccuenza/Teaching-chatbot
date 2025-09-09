document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const chatWindow = document.getElementById('chat-window');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const gradeLevelSelect = document.getElementById('grade-level-select');

    // Generate a simple unique session ID for the conversation
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    /**
     * Appends a message to the chat window.
     * @param {string} text - The message content.
     * @param {string} sender - 'user' or 'bot'.
     */
    const appendMessage = (text, sender) => {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message', `${sender}-message`);

        const messageText = document.createElement('span');
        messageText.classList.add('message-text');
        messageText.textContent = text;
        
        messageWrapper.appendChild(messageText);
        chatWindow.appendChild(messageWrapper);

        // Scroll to the latest message
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    /**
     * Handles sending the user's message to the server.
     */
    const sendMessage = async () => {
        const messageText = messageInput.value.trim();
        const gradeLevel = gradeLevelSelect.value;

        if (!messageText) {
            return; // Don't send empty messages
        }

        // Display user's message immediately
        appendMessage(messageText, 'user');
        messageInput.value = '';
        messageInput.focus();

        try {
            // Send the message to the backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    gradeLevel: gradeLevel,
                    sessionId: sessionId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Display the bot's response
            appendMessage(data.response, 'bot');

        } catch (error) {
            console.error('Error sending message:', error);
            appendMessage('Oops! Something went wrong. Please try again.', 'bot');
        }
    };

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevents new line in input
            sendMessage();
        }
    });
});