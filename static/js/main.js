document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatListEl = document.getElementById('chat-list');
    const sessionListEl = document.getElementById('session-list');
    const messagesEl = document.getElementById('messages');
    const userInputEl = document.getElementById('user-input');
    const sendButtonEl = document.getElementById('send-button');
    const createSessionBtnEl = document.getElementById('create-session-btn');
    const sessionNameInputEl = document.getElementById('session-name');
    const currentChatNameEl = document.getElementById('current-chat-name');
    const currentSessionNameEl = document.getElementById('current-session-name');
    
    // Templates
    const messageTemplate = document.getElementById('message-template');
    const chatItemTemplate = document.getElementById('chat-item-template');
    const sessionItemTemplate = document.getElementById('session-item-template');
    
    // State
    let currentState = {
        selectedChat: null,
        selectedSession: null,
        chats: [],
        sessions: []
    };

    // Fetch all available chat assistants
    async function fetchChats() {
        try {
            chatListEl.innerHTML = '<div class="loading">Loading chat assistants...</div>';
            const response = await fetch('/api/chats');
            const data = await response.json();
            
            if (data.code === 0 && Array.isArray(data.data)) {
                currentState.chats = data.data;
                renderChatList();
            } else {
                chatListEl.innerHTML = '<div class="error">Error loading chat assistants</div>';
                console.error('Error fetching chats:', data);
            }
        } catch (error) {
            chatListEl.innerHTML = '<div class="error">Error connecting to server</div>';
            console.error('Error fetching chats:', error);
        }
    }

    // Fetch sessions for a specific chat assistant
    async function fetchSessions(chatId) {
        try {
            sessionListEl.innerHTML = '<div class="loading">Loading sessions...</div>';
            const response = await fetch(`/api/chats/${chatId}/sessions`);
            const data = await response.json();
            
            if (data.code === 0 && Array.isArray(data.data)) {
                currentState.sessions = data.data;
                renderSessionList();
            } else {
                sessionListEl.innerHTML = '<div class="error">Error loading sessions</div>';
                console.error('Error fetching sessions:', data);
            }
        } catch (error) {
            sessionListEl.innerHTML = '<div class="error">Error connecting to server</div>';
            console.error('Error fetching sessions:', error);
        }
    }

    // Create a new session
    async function createSession(chatId, sessionName) {
        try {
            const response = await fetch(`/api/chats/${chatId}/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: sessionName
                })
            });
            
            const data = await response.json();
            if (data.code === 0) {
                // Refresh sessions
                fetchSessions(chatId);
                // Clear input
                sessionNameInputEl.value = '';
            } else {
                alert(`Error creating session: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating session:', error);
            alert('Failed to create session. Please try again.');
        }
    }

    // Delete a session
    async function deleteSession(chatId, sessionId) {
        if (!confirm('Are you sure you want to delete this session?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/chats/${chatId}/sessions`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ids: [sessionId]
                })
            });
            
            const data = await response.json();
            if (data.code === 0) {
                // If currently selected session is deleted
                if (currentState.selectedSession && currentState.selectedSession.id === sessionId) {
                    resetChatWindow();
                }
                
                // Refresh sessions
                fetchSessions(chatId);
            } else {
                alert(`Error deleting session: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting session:', error);
            alert('Failed to delete session. Please try again.');
        }
    }

    // Send a message to the chat session
    async function sendMessage(chatId, sessionId, message) {
        try {
            // Disable input while sending
            userInputEl.disabled = true;
            sendButtonEl.disabled = true;
            
            // Create and display user message
            displayMessage('user', message);
            
            // Create form data
            const formData = new FormData();
            formData.append('message', message);
            
            // Send request
            const response = await fetch(`/api/chats/${chatId}/sessions/${sessionId}/messages`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            if (data.code === 0 && data.data) {
                // Find assistant's response (should be the last message)
                const messages = data.data.messages || [];
                const lastAssistantMsg = messages
                    .filter(msg => msg.role === 'assistant')
                    .pop();
                
                if (lastAssistantMsg) {
                    displayMessage('assistant', lastAssistantMsg.content);
                } else {
                    displayMessage('assistant', 'Sorry, I did not receive a response.');
                }
            } else if (data.code === 100) {
                // This is a common error from RAG Flow API - usually 404 Not Found
                console.error('RAG Flow API error:', data.message);
                
                // Check if the session might be expired
                if (data.message && data.message.includes('404: Not Found')) {
                    displayMessage('assistant', 'The session may have expired. Try creating a new session or refreshing the page.');
                    
                    // Try refreshing sessions
                    if (currentState.selectedChat) {
                        fetchSessions(currentState.selectedChat.id);
                    }
                } else {
                    displayMessage('assistant', `Error from RAG Flow API: ${data.message || 'Unknown error'}`);
                }
            } else {
                displayMessage('assistant', 'Error: Failed to get response from the assistant.');
            }
            
            // Re-enable input
            userInputEl.disabled = false;
            sendButtonEl.disabled = false;
            userInputEl.focus();
            
        } catch (error) {
            console.error('Error sending message:', error);
            displayMessage('assistant', 'Error: Could not connect to the server.');
            userInputEl.disabled = false;
            sendButtonEl.disabled = false;
        }
    }

    // Render chat list
    function renderChatList() {
        chatListEl.innerHTML = '';
        
        if (currentState.chats.length === 0) {
            chatListEl.innerHTML = '<div class="no-chats">No chat assistants available</div>';
            return;
        }
        
        currentState.chats.forEach(chat => {
            const chatItem = chatItemTemplate.content.cloneNode(true);
            const chatItemEl = chatItem.querySelector('.chat-item');
            const chatNameEl = chatItem.querySelector('.chat-name');
            
            chatNameEl.textContent = chat.name || 'Unnamed Chat';
            
            // Highlight selected chat
            if (currentState.selectedChat && currentState.selectedChat.id === chat.id) {
                chatItemEl.classList.add('active');
            }
            
            // Add click event
            chatItemEl.addEventListener('click', () => {
                selectChat(chat);
            });
            
            // Add to DOM
            chatListEl.appendChild(chatItem);
        });
    }

    // Render session list
    function renderSessionList() {
        sessionListEl.innerHTML = '';
        
        if (!currentState.selectedChat) {
            sessionListEl.innerHTML = '<div class="no-sessions">Select a chat assistant to view sessions</div>';
            return;
        }
        
        if (currentState.sessions.length === 0) {
            sessionListEl.innerHTML = '<div class="no-sessions">No sessions available</div>';
            return;
        }
        
        currentState.sessions.forEach(session => {
            const sessionItem = sessionItemTemplate.content.cloneNode(true);
            const sessionItemEl = sessionItem.querySelector('.session-item');
            const sessionNameEl = sessionItem.querySelector('.session-name');
            const deleteButtonEl = sessionItem.querySelector('.delete-session-btn');
            
            sessionNameEl.textContent = session.name || 'Unnamed Session';
            
            // Highlight selected session
            if (currentState.selectedSession && currentState.selectedSession.id === session.id) {
                sessionItemEl.classList.add('active');
            }
            
            // Add click event
            sessionItemEl.addEventListener('click', (e) => {
                // Prevent triggering when clicking delete button
                if (e.target !== deleteButtonEl) {
                    selectSession(session);
                }
            });
            
            // Add delete event
            deleteButtonEl.addEventListener('click', () => {
                deleteSession(currentState.selectedChat.id, session.id);
            });
            
            // Add to DOM
            sessionListEl.appendChild(sessionItem);
        });
    }

    // Display a message in the chat window
    function displayMessage(role, content) {
        const messageClone = messageTemplate.content.cloneNode(true);
        const messageEl = messageClone.querySelector('.message');
        const contentEl = messageClone.querySelector('.message-content');
        const timeEl = messageClone.querySelector('.message-time');
        
        // Set message class based on role
        messageEl.classList.add(role);
        
        // Set content and time
        contentEl.textContent = content;
        timeEl.textContent = new Date().toLocaleTimeString();
        
        // Add to messages container
        messagesEl.appendChild(messageClone);
        
        // Scroll to bottom
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Select a chat assistant
    function selectChat(chat) {
        // Remove current chat state
        resetChatWindow();
        
        // Update current state
        currentState.selectedChat = chat;
        currentState.selectedSession = null;
        
        // Update UI
        currentChatNameEl.textContent = chat.name || 'Unnamed Chat';
        currentSessionNameEl.textContent = 'Select a Session';
        createSessionBtnEl.disabled = false;
        
        // Re-render chat list to highlight selected
        renderChatList();
        
        // Fetch sessions
        fetchSessions(chat.id);
    }

    // Select a session
    function selectSession(session) {
        currentState.selectedSession = session;
        
        // Update UI
        currentSessionNameEl.textContent = session.name || 'Unnamed Session';
        userInputEl.disabled = false;
        sendButtonEl.disabled = false;
        
        // Clear messages
        messagesEl.innerHTML = '';
        
        // Add welcome message if available
        if (session.messages && Array.isArray(session.messages)) {
            session.messages.forEach(msg => {
                displayMessage(msg.role, msg.content);
            });
        }
        
        // Re-render session list to highlight selected
        renderSessionList();
        
        // Focus input
        userInputEl.focus();
    }

    // Reset chat window state
    function resetChatWindow() {
        currentState.selectedSession = null;
        messagesEl.innerHTML = `
            <div class="welcome-message">
                <h3>Welcome to RAG Flow Chat Interface</h3>
                <p>Select a chat assistant and session to start chatting.</p>
            </div>
        `;
        currentSessionNameEl.textContent = 'Select a Session';
        userInputEl.disabled = true;
        sendButtonEl.disabled = true;
    }

    // Send button event listener
    sendButtonEl.addEventListener('click', () => {
        const message = userInputEl.value.trim();
        if (!message || !currentState.selectedChat || !currentState.selectedSession) {
            return;
        }
        
        sendMessage(currentState.selectedChat.id, currentState.selectedSession.id, message);
        userInputEl.value = '';
    });

    // Input key event listener (send on Enter)
    userInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButtonEl.click();
        }
    });

    // Create session button event listener
    createSessionBtnEl.addEventListener('click', () => {
        const sessionName = sessionNameInputEl.value.trim();
        if (!sessionName || !currentState.selectedChat) {
            return;
        }
        
        createSession(currentState.selectedChat.id, sessionName);
    });

    // Init - fetch chats on load
    fetchChats();
});
