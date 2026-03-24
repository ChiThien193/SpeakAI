# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import chat

app = FastAPI(
    title="AI Voice Chat API",
    description="Voice chat with TTS, STT, LLM and RAG",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "name": "AI Voice Chat API",
        "version": "1.0.0",
        "endpoints": {
            "text_chat": "POST /api/v1/chat/text",
            "voice_chat": "POST /api/v1/chat/voice",
            "voice_stream": "POST /api/v1/chat/voice-stream",
            "rag_add": "POST /api/v1/chat/rag/add",
            "rag_search": "GET /api/v1/chat/rag/search",
            "rag_collections": "GET /api/v1/chat/rag/collections"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}