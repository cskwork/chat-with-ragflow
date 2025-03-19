SESSION MANAGEMENT
Create session with chat assistant
POST /api/v1/chats/{chat_id}/sessions

Creates a session with a chat assistant.

Request
Method: POST
URL: /api/v1/chats/{chat_id}/sessions
Headers:
'content-Type: application/json'
'Authorization: Bearer <YOUR_API_KEY>'
Body:
"name": string
"user_id": string (optional)
Request example
curl --request POST \
     --url http://{address}/api/v1/chats/{chat_id}/sessions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '
     {
          "name": "new session"
     }'
Request parameters
chat_id: (Path parameter)
The ID of the associated chat assistant.
"name": (Body parameter), string
The name of the chat session to create.
"user_id": (Body parameter), string
Optional user-defined ID.
Response
Success:

{
    "code": 0,
    "data": {
        "chat_id": "2ca4b22e878011ef88fe0242ac120005",
        "create_date": "Fri, 11 Oct 2024 08:46:14 GMT",
        "create_time": 1728636374571,
        "id": "4606b4ec87ad11efbc4f0242ac120006",
        "messages": [
            {
                "content": "Hi! I am your assistant，can I help you?",
                "role": "assistant"
            }
        ],
        "name": "new session",
        "update_date": "Fri, 11 Oct 2024 08:46:14 GMT",
        "update_time": 1728636374571
    }
}
Failure:

{
    "code": 102,
    "message": "Name cannot be empty."
}
Update chat assistant's session
PUT /api/v1/chats/{chat_id}/sessions/{session_id}

Updates a session of a specified chat assistant.

Request
Method: PUT
URL: /api/v1/chats/{chat_id}/sessions/{session_id}
Headers:
'content-Type: application/json'
'Authorization: Bearer <YOUR_API_KEY>'
Body:
"name: string
"user_id: string (optional)
Request example
curl --request PUT \
     --url http://{address}/api/v1/chats/{chat_id}/sessions/{session_id} \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '
     {
          "name": "<REVISED_SESSION_NAME_HERE>"
     }'
Request Parameter
chat_id: (Path parameter)
The ID of the associated chat assistant.
session_id: (Path parameter)
The ID of the session to update.
"name": (Body Parameter), string
The revised name of the session.
"user_id": (Body parameter), string
Optional user-defined ID.
Response
Success:

{
    "code": 0
}
Failure:

{
    "code": 102,
    "message": "Name cannot be empty."
}
List chat assistant's sessions
GET /api/v1/chats/{chat_id}/sessions?page={page}&page_size={page_size}&orderby={orderby}&desc={desc}&name={session_name}&id={session_id}

Lists sessions associated with a specified chat assistant.

Request
Method: GET
URL: /api/v1/chats/{chat_id}/sessions?page={page}&page_size={page_size}&orderby={orderby}&desc={desc}&name={session_name}&id={session_id}&user_id={user_id}
Headers:
'Authorization: Bearer <YOUR_API_KEY>'
Request example
curl --request GET \
     --url http://{address}/api/v1/chats/{chat_id}/sessions?page={page}&page_size={page_size}&orderby={orderby}&desc={desc}&name={session_name}&id={session_id} \
     --header 'Authorization: Bearer <YOUR_API_KEY>'
Request Parameters
chat_id: (Path parameter)
The ID of the associated chat assistant.
page: (Filter parameter), integer
Specifies the page on which the sessions will be displayed. Defaults to 1.
page_size: (Filter parameter), integer
The number of sessions on each page. Defaults to 30.
orderby: (Filter parameter), string
The field by which sessions should be sorted. Available options:
create_time (default)
update_time
desc: (Filter parameter), boolean
Indicates whether the retrieved sessions should be sorted in descending order. Defaults to true.
name: (Filter parameter) string
The name of the chat session to retrieve.
id: (Filter parameter), string
The ID of the chat session to retrieve.
user_id: (Filter parameter), string
The optional user-defined ID passed in when creating session.
Response
Success:

{
    "code": 0,
    "data": [
        {
            "chat": "2ca4b22e878011ef88fe0242ac120005",
            "create_date": "Fri, 11 Oct 2024 08:46:43 GMT",
            "create_time": 1728636403974,
            "id": "578d541e87ad11ef96b90242ac120006",
            "messages": [
                {
                    "content": "Hi! I am your assistant，can I help you?",
                    "role": "assistant"
                }
            ],
            "name": "new session",
            "update_date": "Fri, 11 Oct 2024 08:46:43 GMT",
            "update_time": 1728636403974
        }
    ]
}
Failure:

{
    "code": 102,
    "message": "The session doesn't exist"
}
Delete chat assistant's sessions
DELETE /api/v1/chats/{chat_id}/sessions

Deletes sessions of a chat assistant by ID.

Request
Method: DELETE
URL: /api/v1/chats/{chat_id}/sessions
Headers:
'content-Type: application/json'
'Authorization: Bearer <YOUR_API_KEY>'
Body:
"ids": list[string]
Request example
curl --request DELETE \
     --url http://{address}/api/v1/chats/{chat_id}/sessions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '
     {
          "ids": ["test_1", "test_2"]
     }'
Request Parameters
chat_id: (Path parameter)
The ID of the associated chat assistant.
"ids": (Body Parameter), list[string]
The IDs of the sessions to delete. If it is not specified, all sessions associated with the specified chat assistant will be deleted.
Response
Success:

{
    "code": 0
}
Failure:

{
    "code": 102,
    "message": "The chat doesn't own the session"
}
Converse with chat assistant
POST /api/v1/chats/{chat_id}/completions

Asks a specified chat assistant a question to start an AI-powered conversation.

:::tip NOTE

In streaming mode, not all responses include a reference, as this depends on the system's judgement.
In streaming mode, the last message is an empty message:
data:
{
  "code": 0,
  "data": true
}
:::

Request
Method: POST
URL: /api/v1/chats/{chat_id}/completions
Headers:
'content-Type: application/json'
'Authorization: Bearer <YOUR_API_KEY>'
Body:
"question": string
"stream": boolean
"session_id": string (optional)
"user_id: string (optional)
Request example
curl --request POST \
     --url http://{address}/api/v1/chats/{chat_id}/completions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data-binary '
     {
     }'
curl --request POST \
     --url http://{address}/api/v1/chats/{chat_id}/completions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data-binary '
     {
          "question": "Who are you",
          "stream": true,
          "session_id":"9fa7691cb85c11ef9c5f0242ac120005"
     }'
Request Parameters
chat_id: (Path parameter)
The ID of the associated chat assistant.
"question": (Body Parameter), string, Required
The question to start an AI-powered conversation.
"stream": (Body Parameter), boolean
Indicates whether to output responses in a streaming way:
true: Enable streaming (default).
false: Disable streaming.
"session_id": (Body Parameter)
The ID of session. If it is not provided, a new session will be generated.
"user_id": (Body parameter), string
The optional user-defined ID. Valid only when no session_id is provided.
Response
Success without session_id:

data:{
    "code": 0,
    "message": "",
    "data": {
        "answer": "Hi! I'm your assistant, what can I do for you?",
        "reference": {},
        "audio_binary": null,
        "id": null,
        "session_id": "b01eed84b85611efa0e90242ac120005"
    }
}
data:{
    "code": 0,
    "message": "",
    "data": true
}
Success with session_id:

data:{
    "code": 0,
    "data": {
        "answer": "I am an intelligent assistant designed to help answer questions by summarizing content from a",
        "reference": {},
        "audio_binary": null,
        "id": "a84c5dd4-97b4-4624-8c3b-974012c8000d",
        "session_id": "82b0ab2a9c1911ef9d870242ac120006"
    }
}
data:{
    "code": 0,
    "data": {
        "answer": "I am an intelligent assistant designed to help answer questions by summarizing content from a knowledge base. My responses are based on the information available in the knowledge base and",
        "reference": {},
        "audio_binary": null,
        "id": "a84c5dd4-97b4-4624-8c3b-974012c8000d",
        "session_id": "82b0ab2a9c1911ef9d870242ac120006"
    }
}
data:{
    "code": 0,
    "data": {
        "answer": "I am an intelligent assistant designed to help answer questions by summarizing content from a knowledge base. My responses are based on the information available in the knowledge base and any relevant chat history.",
        "reference": {},
        "audio_binary": null,
        "id": "a84c5dd4-97b4-4624-8c3b-974012c8000d",
        "session_id": "82b0ab2a9c1911ef9d870242ac120006"
    }
}
data:{
    "code": 0,
    "data": {
        "answer": "I am an intelligent assistant designed to help answer questions by summarizing content from a knowledge base ##0$$. My responses are based on the information available in the knowledge base and any relevant chat history.",
        "reference": {
            "total": 1,
            "chunks": [
                {
                    "id": "faf26c791128f2d5e821f822671063bd",
                    "content": "xxxxxxxx",
                    "document_id": "dd58f58e888511ef89c90242ac120006",
                    "document_name": "1.txt",
                    "dataset_id": "8e83e57a884611ef9d760242ac120006",
                    "image_id": "",
                    "similarity": 0.7,
                    "vector_similarity": 0.0,
                    "term_similarity": 1.0,
                    "positions": [
                        ""
                    ]
                }
            ],
            "doc_aggs": [
                {
                    "doc_name": "1.txt",
                    "doc_id": "dd58f58e888511ef89c90242ac120006",
                    "count": 1
                }
            ]
        },
        "prompt": "xxxxxxxxxxx",
        "id": "a84c5dd4-97b4-4624-8c3b-974012c8000d",
        "session_id": "82b0ab2a9c1911ef9d870242ac120006"
    }
}
data:{
    "code": 0,
    "data": true
}
Failure:

{
    "code": 102,
    "message": "Please input your question."
}
Create session with agent
POST /api/v1/agents/{agent_id}/sessions

Creates a session with an agent.

Request
Method: POST
URL: /api/v1/agents/{agent_id}/sessions?user_id={user_id}
Headers:
'content-Type: application/json' or 'multipart/form-data'
'Authorization: Bearer <YOUR_API_KEY>'
Body:
the required parameters:str
other parameters: The parameters specified in the Begin component.
Request example
If the Begin component in your agent does not take required parameters:

curl --request POST \
     --url http://{address}/api/v1/agents/{agent_id}/sessions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{
     }'
If the Begin component in your agent takes required parameters:

curl --request POST \
     --url http://{address}/api/v1/agents/{agent_id}/sessions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '{
            "lang":"Japanese",
            "file":"Who are you"
     }'
If the Begin component in your agent takes required file parameters:

curl --request POST \
     --url http://{address}/api/v1/agents/{agent_id}/sessions?user_id={user_id} \
     --header 'Content-Type: multipart/form-data' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --form '<FILE_KEY>=@./test1.png'    
Request parameters
agent_id: (Path parameter)
The ID of the associated agent.
user_id: (Filter parameter) The optional user-defined ID for parsing docs (especially images) when creating a session while uploading files.
Response
Success:

{
    "code": 0,
    "data": {
        "agent_id": "b4a39922b76611efaa1a0242ac120006",
        "dsl": {
            "answer": [],
            "components": {
                "Answer:GreenReadersDrum": {
                    "downstream": [],
                    "obj": {
                        "component_name": "Answer",
                        "inputs": [],
                        "output": null,
                        "params": {}
                    },
                    "upstream": []
                },
                "begin": {
                    "downstream": [],
                    "obj": {
                        "component_name": "Begin",
                        "inputs": [],
                        "output": {},
                        "params": {}
                    },
                    "upstream": []
                }
            },
            "embed_id": "",
            "graph": {
                "edges": [],
                "nodes": [
                    {
                        "data": {
                            "label": "Begin",
                            "name": "begin"
                        },
                        "dragging": false,
                        "height": 44,
                        "id": "begin",
                        "position": {
                            "x": 53.25688640427177,
                            "y": 198.37155679786412
                        },
                        "positionAbsolute": {
                            "x": 53.25688640427177,
                            "y": 198.37155679786412
                        },
                        "selected": false,
                        "sourcePosition": "left",
                        "targetPosition": "right",
                        "type": "beginNode",
                        "width": 200
                    },
                    {
                        "data": {
                            "form": {},
                            "label": "Answer",
                            "name": "dialog_0"
                        },
                        "dragging": false,
                        "height": 44,
                        "id": "Answer:GreenReadersDrum",
                        "position": {
                            "x": 360.43473114516974,
                            "y": 207.29298425089348
                        },
                        "positionAbsolute": {
                            "x": 360.43473114516974,
                            "y": 207.29298425089348
                        },
                        "selected": false,
                        "sourcePosition": "right",
                        "targetPosition": "left",
                        "type": "logicNode",
                        "width": 200
                    }
                ]
            },
            "history": [],
            "messages": [],
            "path": [
                [
                    "begin"
                ],
                []
            ],
            "reference": []
        },
        "id": "2581031eb7a311efb5200242ac120005",
        "message": [
            {
                "content": "Hi! I'm your smart assistant. What can I do for you?",
                "role": "assistant"
            }
        ],
        "source": "agent",
        "user_id": "69736c5e723611efb51b0242ac120007"
    }
}
Failure:

{
    "code": 102,
    "message": "Agent not found."
}
Converse with agent
POST /api/v1/agents/{agent_id}/completions

Asks a specified agent a question to start an AI-powered conversation.

:::tip NOTE

In streaming mode, not all responses include a reference, as this depends on the system's judgement.
In streaming mode, the last message is an empty message:
data:
{
  "code": 0,
  "data": true
}
:::

Request
Method: POST
URL: /api/v1/agents/{agent_id}/completions
Headers:
'content-Type: application/json'
'Authorization: Bearer <YOUR_API_KEY>'
Body:
"question": string
"stream": boolean
"session_id": string
"user_id": string(optional)
"sync_dsl": boolean (optional)
other parameters: string
Request example
If the Begin component does not take parameters, the following code will create a session.

curl --request POST \
     --url http://{address}/api/v1/agents/{agent_id}/completions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data-binary '
     {
     }'
If the Begin component takes parameters, the following code will create a session.

curl --request POST \
     --url http://{address}/api/v1/agents/{agent_id}/completions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data-binary '
     {
          "lang":"English",
          "file":"How is the weather tomorrow?"
     }'
The following code will execute the completion process

curl --request POST \
     --url http://{address}/api/v1/agents/{agent_id}/completions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data-binary '
     {
          "question": "Hello",
          "stream": true,
          "session_id": "cb2f385cb86211efa36e0242ac120005"
     }'
Request Parameters
agent_id: (Path parameter), string
The ID of the associated agent.
"question": (Body Parameter), string, Required
The question to start an AI-powered conversation.
"stream": (Body Parameter), boolean
Indicates whether to output responses in a streaming way:
true: Enable streaming (default).
false: Disable streaming.
"session_id": (Body Parameter)
The ID of the session. If it is not provided, a new session will be generated.
"user_id": (Body parameter), string
The optional user-defined ID. Valid only when no session_id is provided.
"sync_dsl": (Body parameter), boolean Whether to synchronize the changes to existing sessions when an agent is modified, defaults to false.
Other parameters: (Body Parameter)
Parameters specified in the Begin component.
Response
success without session_id provided and with no parameters specified in the Begin component:

data:{
    "code": 0,
    "message": "",
    "data": {
        "answer": "Hi! I'm your smart assistant. What can I do for you?",
        "reference": {},
        "id": "31e6091d-88d4-441b-ac65-eae1c055be7b",
        "session_id": "2987ad3eb85f11efb2a70242ac120005"
    }
}
data:{
    "code": 0,
    "message": "",
    "data": true
}
Success without session_id provided and with parameters specified in the Begin component:

data:{
    "code": 0,
    "message": "",
    "data": {
        "session_id": "eacb36a0bdff11ef97120242ac120006",
        "answer": "",
        "reference": [],
        "param": [
            {
                "key": "lang",
                "name": "Target Language",
                "optional": false,
                "type": "line",
                "value": "English"
            },
            {
                "key": "file",
                "name": "Files",
                "optional": false,
                "type": "file",
                "value": "How is the weather tomorrow?"
            },
            {
                "key": "hhyt",
                "name": "hhty",
                "optional": true,
                "type": "line"
            }
        ]
    }
}
data:
Success with parameters specified in the Begin component:

data:{
    "code": 0,
    "message": "",
    "data": {
        "answer": "How",
        "reference": {},
        "id": "0379ac4c-b26b-4a44-8b77-99cebf313fdf",
        "session_id": "4399c7d0b86311efac5b0242ac120005"
    }
}
data:{
    "code": 0,
    "message": "",
    "data": {
        "answer": "How is",
        "reference": {},
        "id": "0379ac4c-b26b-4a44-8b77-99cebf313fdf",
        "session_id": "4399c7d0b86311efac5b0242ac120005"
    }
}
data:{
    "code": 0,
    "message": "",
    "data": {
        "answer": "How is the",
        "reference": {},
        "id": "0379ac4c-b26b-4a44-8b77-99cebf313fdf",
        "session_id": "4399c7d0b86311efac5b0242ac120005"
    }
}
data:{
    "code": 0,
    "message": "",
    "data": {
        "answer": "How is the weather",
        "reference": {},
        "id": "0379ac4c-b26b-4a44-8b77-99cebf313fdf",
        "session_id": "4399c7d0b86311efac5b0242ac120005"
    }
}
data:{
    "code": 0,
    "message": "",
    "data": {
        "answer": "How is the weather tomorrow",
        "reference": {},
        "id": "0379ac4c-b26b-4a44-8b77-99cebf313fdf",
        "session_id": "4399c7d0b86311efac5b0242ac120005"
    }
}
data:{
    "code": 0,
    "message": "",
    "data": {
        "answer": "How is the weather tomorrow?",
        "reference": {},
        "id": "0379ac4c-b26b-4a44-8b77-99cebf313fdf",
        "session_id": "4399c7d0b86311efac5b0242ac120005"
    }
}
data:{
    "code": 0,
    "message": "",
    "data": {
        "answer": "How is the weather tomorrow?",
        "reference": {},
        "id": "0379ac4c-b26b-4a44-8b77-99cebf313fdf",
        "session_id": "4399c7d0b86311efac5b0242ac120005"
    }
}
data:{
    "code": 0,
    "message": "",
    "data": true
}
Failure:

{
    "code": 102,
    "message": "`question` is required."
}
List agent sessions
GET /api/v1/agents/{agent_id}/sessions?page={page}&page_size={page_size}&orderby={orderby}&desc={desc}&id={session_id}&user_id={user_id}&dsl={dsl}

Lists sessions associated with a specified agent.

Request
Method: GET
URL: /api/v1/agents/{agent_id}/sessions?page={page}&page_size={page_size}&orderby={orderby}&desc={desc}&id={session_id}
Headers:
'Authorization: Bearer <YOUR_API_KEY>'
Request example
curl --request GET \
     --url http://{address}/api/v1/agents/{agent_id}/sessions?page={page}&page_size={page_size}&orderby={orderby}&desc={desc}&id={session_id}&user_id={user_id} \
     --header 'Authorization: Bearer <YOUR_API_KEY>'
Request Parameters
agent_id: (Path parameter)
The ID of the associated agent.
page: (Filter parameter), integer
Specifies the page on which the sessions will be displayed. Defaults to 1.
page_size: (Filter parameter), integer
The number of sessions on each page. Defaults to 30.
orderby: (Filter parameter), string
The field by which sessions should be sorted. Available options:
create_time (default)
update_time
desc: (Filter parameter), boolean
Indicates whether the retrieved sessions should be sorted in descending order. Defaults to true.
id: (Filter parameter), string
The ID of the agent session to retrieve.
user_id: (Filter parameter), string
The optional user-defined ID passed in when creating session.
dsl: (Filter parameter), boolean
Indicates whether to include the dsl field of the sessions in the response. Defaults to true.
Response
Success:

{
    "code": 0,
    "data": [{
        "agent_id": "e9e2b9c2b2f911ef801d0242ac120006",
        "dsl": {
            "answer": [],
            "components": {
                "Answer:OrangeTermsBurn": {
                    "downstream": [],
                    "obj": {
                        "component_name": "Answer",
                        "params": {}
                    },
                    "upstream": []
                },
                "Generate:SocialYearsRemain": {
                    "downstream": [],
                    "obj": {
                        "component_name": "Generate",
                        "params": {
                            "cite": true,
                            "frequency_penalty": 0.7,
                            "llm_id": "gpt-4o___OpenAI-API@OpenAI-API-Compatible",
                            "max_tokens": 256,
                            "message_history_window_size": 12,
                            "parameters": [],
                            "presence_penalty": 0.4,
                            "prompt": "Please summarize the following paragraph. Pay attention to the numbers and do not make things up. The paragraph is as follows:\n{input}\nThis is what you need to summarize.",
                            "temperature": 0.1,
                            "top_p": 0.3
                        }
                    },
                    "upstream": []
                },
                "begin": {
                    "downstream": [],
                    "obj": {
                        "component_name": "Begin",
                        "params": {}
                    },
                    "upstream": []
                }
            },
            "graph": {
                "edges": [],
                "nodes": [
                    {
                        "data": {
                            "label": "Begin",
                            "name": "begin"
                        },
                        "height": 44,
                        "id": "begin",
                        "position": {
                            "x": 50,
                            "y": 200
                        },
                        "sourcePosition": "left",
                        "targetPosition": "right",
                        "type": "beginNode",
                        "width": 200
                    },
                    {
                        "data": {
                            "form": {
                                "cite": true,
                                "frequencyPenaltyEnabled": true,
                                "frequency_penalty": 0.7,
                                "llm_id": "gpt-4o___OpenAI-API@OpenAI-API-Compatible",
                                "maxTokensEnabled": true,
                                "max_tokens": 256,
                                "message_history_window_size": 12,
                                "parameters": [],
                                "presencePenaltyEnabled": true,
                                "presence_penalty": 0.4,
                                "prompt": "Please summarize the following paragraph. Pay attention to the numbers and do not make things up. The paragraph is as follows:\n{input}\nThis is what you need to summarize.",
                                "temperature": 0.1,
                                "temperatureEnabled": true,
                                "topPEnabled": true,
                                "top_p": 0.3
                            },
                            "label": "Generate",
                            "name": "Generate Answer_0"
                        },
                        "dragging": false,
                        "height": 105,
                        "id": "Generate:SocialYearsRemain",
                        "position": {
                            "x": 561.3457829707513,
                            "y": 178.7211182312641
                        },
                        "positionAbsolute": {
                            "x": 561.3457829707513,
                            "y": 178.7211182312641
                        },
                        "selected": true,
                        "sourcePosition": "right",
                        "targetPosition": "left",
                        "type": "generateNode",
                        "width": 200
                    },
                    {
                        "data": {
                            "form": {},
                            "label": "Answer",
                            "name": "Dialogue_0"
                        },
                        "height": 44,
                        "id": "Answer:OrangeTermsBurn",
                        "position": {
                            "x": 317.2368194777658,
                            "y": 218.30635555445093
                        },
                        "sourcePosition": "right",
                        "targetPosition": "left",
                        "type": "logicNode",
                        "width": 200
                    }
                ]
            },
            "history": [],
            "messages": [],
            "path": [],
            "reference": []
        },
        "id": "792dde22b2fa11ef97550242ac120006",
        "message": [
            {
                "content": "Hi! I'm your smart assistant. What can I do for you?",
                "role": "assistant"
            }
        ],
        "source": "agent",
        "user_id": ""
    }]
}
Failure:

{
    "code": 102,
    "message": "You don't own the agent ccd2f856b12311ef94ca0242ac1200052."
}
Delete agent's sessions
DELETE /api/v1/agents/{agent_id}/sessions

Deletes sessions of a agent by ID.

Request
Method: DELETE
URL: /api/v1/agents/{agent_id}/sessions
Headers:
'content-Type: application/json'
'Authorization: Bearer <YOUR_API_KEY>'
Body:
"ids": list[string]
Request example
curl --request DELETE \
     --url http://{address}/api/v1/agents/{agent_id}/sessions \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <YOUR_API_KEY>' \
     --data '
     {
          "ids": ["test_1", "test_2"]
     }'
Request Parameters
agent_id: (Path parameter)
The ID of the associated agent.
"ids": (Body Parameter), list[string]
The IDs of the sessions to delete. If it is not specified, all sessions associated with the specified agent will be deleted.
Response
Success:

{
    "code": 0
}
Failure:

{
    "code": 102,
    "message": "The agent doesn't own the session cbd31e52f73911ef93b232903b842af6"
}
AGENT MANAGEMENT
List agents
GET /api/v1/agents?page={page}&page_size={page_size}&orderby={orderby}&desc={desc}&name={agent_name}&id={agent_id}

Lists agents.

Request
Method: GET
URL: /api/v1/agents?page={page}&page_size={page_size}&orderby={orderby}&desc={desc}&name={agent_name}&id={agent_id}
Headers:
'Authorization: Bearer <YOUR_API_KEY>'
Request example
curl --request GET \
     --url http://{address}/api/v1/agents?page={page}&page_size={page_size}&orderby={orderby}&desc={desc}&name={agent_name}&id={agent_id} \
     --header 'Authorization: Bearer <YOUR_API_KEY>'
Request parameters
page: (Filter parameter), integer
Specifies the page on which the agents will be displayed. Defaults to 1.
page_size: (Filter parameter), integer
The number of agents on each page. Defaults to 30.
orderby: (Filter parameter), string
The attribute by which the results are sorted. Available options:
create_time (default)
update_time
desc: (Filter parameter), boolean
Indicates whether the retrieved agents should be sorted in descending order. Defaults to true.
id: (Filter parameter), string
The ID of the agent to retrieve.
name: (Filter parameter), string
The name of the agent to retrieve.
Response
Success:

{
    "code": 0,
    "data": [
        {
            "avatar": null,
            "canvas_type": null,
            "create_date": "Thu, 05 Dec 2024 19:10:36 GMT",
            "create_time": 1733397036424,
            "description": null,
            "dsl": {
                "answer": [],
                "components": {
                    "begin": {
                        "downstream": [],
                        "obj": {
                            "component_name": "Begin",
                            "params": {}
                        },
                        "upstream": []
                    }
                },
                "graph": {
                    "edges": [],
                    "nodes": [
                        {
                            "data": {
                                "label": "Begin",
                                "name": "begin"
                            },
                            "height": 44,
                            "id": "begin",
                            "position": {
                                "x": 50,
                                "y": 200
                            },
                            "sourcePosition": "left",
                            "targetPosition": "right",
                            "type": "beginNode",
                            "width": 200
                        }
                    ]
                },
                "history": [],
                "messages": [],
                "path": [],
                "reference": []
            },
            "id": "8d9ca0e2b2f911ef9ca20242ac120006",
            "title": "123465",
            "update_date": "Thu, 05 Dec 2024 19:10:56 GMT",
            "update_time": 1733397056801,
            "user_id": "69736c5e723611efb51b0242ac120007"
        }
    ]
}
Failure:

{
    "code": 102,
    "message": "The agent doesn't exist."
}