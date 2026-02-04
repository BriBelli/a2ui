from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn
from openai_service import get_openai_completion
from a2ui_responses import get_a2ui_response

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000", "http://localhost:5174"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api")
def home():
    return JSONResponse(content={"message": "Welcome to the A2UI Python Backend!"})


# A2UI Chat endpoint - returns structured A2UI responses
@app.post("/api/chat")
async def chat(request: Request):
    """
    Chat endpoint that returns A2UI protocol responses.
    
    The frontend sends a message, and this endpoint returns:
    - text: Optional plain text response
    - a2ui: Optional A2UI protocol JSON for rich UI rendering
    """
    data = await request.json()
    message = data.get("message", "")
    
    if not message:
        return JSONResponse(
            content={"error": "Message is required"},
            status_code=400
        )
    
    # Get A2UI response (may use AI or mock data)
    response = get_a2ui_response(message)
    return JSONResponse(content=response)


# Legacy OpenAI completion endpoint
@app.post("/api/openai")
async def openai_completion(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    result = get_openai_completion(prompt)
    if "error" in result:
        return JSONResponse(content={"error": result["error"]}, status_code=result["status_code"])
    return JSONResponse(content={"response": result["response"]}, status_code=result["status_code"])

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)