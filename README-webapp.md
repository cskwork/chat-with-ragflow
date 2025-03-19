# RAG Flow Chat Web Service

A simple web service to interact with the RAG Flow API for chatbot communication.

## Features

- Unified web interface for RAG Flow API
- Browse and select chat assistants
- Create, manage, and delete chat sessions
- Real-time chat with selected assistant
- Responsive design for desktop and mobile

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/chat-with-ragflow.git
   cd chat-with-ragflow
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Configure the environment:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file to set your RAG Flow API URL and API key

## Usage

1. Start the application:
   ```
   python app.py
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8081
   ```

3. Using the interface:
   - Select a chat assistant from the left sidebar
   - Create a new session or select an existing one
   - Start chatting in the main window
   - Delete sessions as needed

## API Endpoints

The web service provides the following backend API endpoints:

- `GET /api/chats` - List available chat assistants
- `POST /api/chats/{chat_id}/sessions` - Create a new session
- `GET /api/chats/{chat_id}/sessions` - List sessions for a chat assistant
- `POST /api/chats/{chat_id}/sessions/{session_id}/messages` - Send a message to a session
- `DELETE /api/chats/{chat_id}/sessions` - Delete chat sessions

## Technologies Used

- **Backend**: FastAPI, Python, Requests
- **Frontend**: HTML, CSS, JavaScript
- **Dependencies**: See requirements.txt

## Environment Variables

- `RAG_FLOW_API_URL` - Base URL for the RAG Flow API
- `RAG_FLOW_API_KEY` - API key for authentication

## License

This project is available under the MIT License.
