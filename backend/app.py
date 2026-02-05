from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn
from openai_service import get_openai_completion
from a2ui_responses import get_a2ui_response
from llm_providers import llm_service

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


@app.get("/api/providers")
def get_providers():
    """
    Get available LLM providers and their models.
    
    Returns providers that have valid API keys configured.
    """
    providers = llm_service.get_available_providers()
    return JSONResponse(content={"providers": providers})


# A2UI Chat endpoint - returns structured A2UI responses
@app.post("/api/chat")
async def chat(request: Request):
    """
    Chat endpoint that returns A2UI protocol responses.
    
    Request body:
    - message: The user's message
    - provider: Optional LLM provider ID (openai, anthropic, gemini)
    - model: Optional model ID for the provider
    
    Returns:
    - text: Optional plain text response
    - a2ui: Optional A2UI protocol JSON for rich UI rendering
    """
    data = await request.json()
    message = data.get("message", "")
    provider_id = data.get("provider")
    model = data.get("model")
    
    if not message:
        return JSONResponse(
            content={"error": "Message is required"},
            status_code=400
        )
    
    # If provider is specified, use LLM service
    if provider_id and model:
        try:
            response = await llm_service.generate(message, provider_id, model)
            return JSONResponse(content=response)
        except Exception as e:
            print(f"LLM error: {e}")
            # Fall back to mock responses on error
            response = get_a2ui_response(message)
            response["_error"] = str(e)
            return JSONResponse(content=response)
    
    # Otherwise use mock/fallback responses
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