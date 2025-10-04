# Chat Server Setup

This is the backend server for the research assistant chatbot.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your OpenAI API key to `.env`:**
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

The chat server will run on `http://localhost:3001`

## API Endpoints

- `POST /api/chat` - Send chat messages
- `GET /health` - Health check