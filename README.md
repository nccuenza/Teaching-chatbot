K-12 Teaching Assistant Chatbot
This is a web-based AI chatbot designed to act as a friendly and knowledgeable teaching assistant for K-12 students. It uses the Google Gemini API to provide age-appropriate explanations on various subjects.

🚀 Live Demo
You can interact with the live version of the chatbot here:

https://teaching-chatbot-5i99.onrender.com/

✅ Project Status: Deployed
This application has been successfully deployed and is live on Render.

The chatbot connects to the Google Gemini API, serves the front-end, and is publicly accessible.

Features
AI-Powered Responses: Integrates with the Google Gemini API to generate dynamic, educational content.

Grade-Level Adaptability: Adjusts the complexity and length of its answers based on the selected grade level (K-2, 3-5, 6-8, 9-12).

Simple Web Interface: A clean and intuitive chat interface for easy interaction.

Node.js Backend: A robust server built with Express to handle API requests and serve the front-end.

Content Filtering: Includes a basic filter to keep conversations focused on appropriate educational topics.

Technology Stack
This project is built with the following core technologies:

Language Model (LLM): Google Gemini API

Backend: Node.js, Express.js

Frontend: HTML, CSS, vanilla JavaScript

Dependencies: dotenv for environment variables, cors for resource sharing.

Prerequisites
Before you can run this project locally, you need to have the following installed on your machine:

Node.js (which includes npm, the Node package manager). You can download it from the official website.

How to Run Locally
Follow these steps to get the chatbot running on your own computer.

1. Clone the Repository
First, get a copy of the project files. If you have Git installed, you can clone the repository:

git clone <your-github-repository-url>
cd <your-project-directory>



Alternatively, you can download the project files as a ZIP and extract them.

2. Install Dependencies
The project relies on several Node.js packages. Open a terminal in the project's root directory and run the following command to install them. This includes @google/generative-ai, express, and other necessary libraries.

npm install



3. Set Up Your Environment Variables
The application needs your unique Google Gemini API key to work.

In the project's root directory, create a new file named .env.

Copy the content of the .env.example file (or the block below) into your new .env file.

Replace your_gemini_api_key_here with your actual API key.

# .env file content
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here



How to get a Gemini API Key:

Visit Google AI Studio.

Sign in and create a new API key.

Copy the key and paste it into your .env file.

4. Start the Server
Once the dependencies are installed and your API key is set, you can start the server with this command:

npm start



You should see a message in your terminal indicating that the server is running:

🎓 K-12 Teaching Chatbot running on http://localhost:3000
📚 Ready to help students learn!



5. Open in Your Browser
Open your web browser and navigate to the following address:

http://localhost:3000

You should now be able to interact with your K-12 Teaching Assistant chatbot!
