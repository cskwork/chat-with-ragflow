import os
from fastapi import FastAPI, Request, Form, HTTPException, Depends
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="RAG Flow Chat Service")

# Set up templates and static files
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# RAG Flow API configuration
RAG_FLOW_API_URL = os.getenv("RAG_FLOW_API_URL", "http://localhost:80")
API_KEY = os.getenv("RAG_FLOW_API_KEY", "")

# Pydantic models for request/response validation
class ChatMessage(BaseModel):
    role: str
    content: str

class SessionCreate(BaseModel):
    name: str
    user_id: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    chat_id: str
    session_id: str

class ChatResponse(BaseModel):
    chat_id: str
    session_id: str
    messages: List[ChatMessage]

# Helper function to make requests to RAG Flow API
def make_api_request(method, endpoint, data=None, params=None):
    url = f"{RAG_FLOW_API_URL}{endpoint}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    try:
        if method.lower() == "get":
            response = requests.get(url, headers=headers, params=params)
        elif method.lower() == "post":
            response = requests.post(url, headers=headers, json=data)
        elif method.lower() == "put":
            response = requests.put(url, headers=headers, json=data)
        elif method.lower() == "delete":
            response = requests.delete(url, headers=headers, json=data)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        # Log the raw response for debugging
        print(f"API Response ({endpoint}): {response.status_code}")
        print(f"Response content: {response.text[:500]}")
        
        # Check if response is successful
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"API Error ({endpoint}): {str(e)}")
        raise HTTPException(status_code=500, detail=f"RAG Flow API Error: {str(e)}")

# Routes
@app.get("/", response_class=HTMLResponse)
async def get_home_page(request: Request):
    """Render the home page"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/chats", response_class=JSONResponse)
async def list_chats():
    """List available chat assistants"""
    response = make_api_request("GET", "/api/v1/chats")
    return response

@app.post("/api/chats/{chat_id}/sessions", response_class=JSONResponse)
async def create_session(chat_id: str, session: SessionCreate):
    """Create a new chat session"""
    endpoint = f"/api/v1/chats/{chat_id}/sessions"
    response = make_api_request("POST", endpoint, data=session.dict())
    return response

@app.get("/api/chats/{chat_id}/sessions", response_class=JSONResponse)
async def list_sessions(chat_id: str, page: int = 1, page_size: int = 10):
    """List sessions for a specific chat assistant"""
    endpoint = f"/api/v1/chats/{chat_id}/sessions"
    params = {"page": page, "page_size": page_size}
    response = make_api_request("GET", endpoint, params=params)
    return response

@app.post("/api/chats/{chat_id}/sessions/{session_id}/messages", response_class=JSONResponse)
async def send_message(chat_id: str, session_id: str, message: str = Form(...)):
    """Send a message to chat session and get response"""
    try:
        print(f"Sending message to RAG Flow: chat_id={chat_id}, session_id={session_id}, message={message[:50]}")
        
        # Use the correct endpoint format based on the RAG Flow API documentation
        # POST /api/v1/chats/{chat_id}/completions with session_id in the body
        endpoint = f"/api/v1/chats/{chat_id}/completions"
        data = {
            "question": message,  # The API expects 'question', not 'content'
            "session_id": session_id,
            "stream": False  # We don't want streaming responses for this implementation
        }
        
        print(f"Using documented endpoint: {endpoint}")
        try:
            response = make_api_request("POST", endpoint, data=data)
            print(f"Response: {response}")
            
            # Check if response is successful
            if response.get('code') == 0 and response.get('data'):
                # Format the response to match what our frontend expects
                answer = response['data'].get('answer', '')
                
                # Create a properly formatted response for our frontend
                formatted_response = {
                    "code": 0,
                    "data": {
                        "messages": [
                            {"role": "user", "content": message},
                            {"role": "assistant", "content": answer}
                        ],
                        "session_id": session_id
                    }
                }
                
                print(f"Formatted response for frontend: {formatted_response}")
                return formatted_response
            else:
                print(f"API returned error code: {response.get('code')}")
                # Return a user-friendly error
                return JSONResponse(
                    content={
                        "code": 0,
                        "data": {
                            "messages": [
                                {"role": "assistant", "content": f"Error from RAG Flow API: {response.get('message', 'Unknown error')}"}
                            ]
                        }
                    },
                    status_code=200
                )
        except HTTPException as e:
            print(f"API request failed: {str(e)}")
            # Try creating a new session if the current one fails
            try:
                print("Current session might be invalid. Creating a new session...")
                session_create_endpoint = f"/api/v1/chats/{chat_id}/sessions"
                session_data = {"name": f"New Session {chat_id[:8]}"}
                session_response = make_api_request("POST", session_create_endpoint, data=session_data)
                
                if session_response.get('code') == 0 and session_response.get('data'):
                    new_session_id = session_response['data'].get('id')
                    print(f"Created new session with ID: {new_session_id}")
                    
                    # Try again with the new session
                    data["session_id"] = new_session_id
                    response = make_api_request("POST", endpoint, data=data)
                    
                    if response.get('code') == 0 and response.get('data'):
                        # Format the response for our frontend
                        answer = response['data'].get('answer', '')
                        formatted_response = {
                            "code": 0,
                            "data": {
                                "messages": [
                                    {"role": "user", "content": message},
                                    {"role": "assistant", "content": answer}
                                ],
                                "session_id": new_session_id
                            }
                        }
                        return formatted_response
            except Exception as session_error:
                print(f"Failed to create new session: {str(session_error)}")
            
            # If all attempts fail, return a friendly error
            return JSONResponse(
                content={
                    "code": 0,
                    "data": {
                        "messages": [
                            {"role": "assistant", "content": "I'm sorry, I couldn't process your message. The session may have expired. Please try creating a new session."}
                        ]
                    }
                },
                status_code=200
            )
    except Exception as e:
        print(f"Unexpected error in send_message: {str(e)}")
        # Return a client-friendly error response
        return JSONResponse(
            content={
                "code": 0,
                "data": {
                    "messages": [
                        {"role": "assistant", "content": f"An error occurred: {str(e)}"}
                    ]
                }
            },
            status_code=200
        )

@app.delete("/api/chats/{chat_id}/sessions", response_class=JSONResponse)
async def delete_sessions(chat_id: str, ids: List[str]):
    """Delete chat sessions"""
    endpoint = f"/api/v1/chats/{chat_id}/sessions"
    data = {"ids": ids}
    response = make_api_request("DELETE", endpoint, data=data)
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8081, reload=True)
