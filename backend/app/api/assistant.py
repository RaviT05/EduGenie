from fastapi import APIRouter, HTTPException, status
from app.schemas.chat import (
    ChatRequest,
    ExplainRequest,
    QuizRequest,
    SummarizeRequest,
    RoadmapRequest
)
from app.services.gemini_service import GeminiService

router = APIRouter()
gemini_service = GeminiService()

def handle_gemini_exception(e: Exception):
    # ValueError is raised when API key is missing/placeholder or parsing fails
    if isinstance(e, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    # Generic API call failures (network issues, quota limitations, invalid key)
    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail=f"Google Gemini Service error: {str(e)}"
    )

# --- 1. AI Chat Endpoint ---
@router.post("/chat")
async def chat_endpoint(payload: ChatRequest):
    try:
        response_text = gemini_service.generate_chat(payload.message)
        return {"response": response_text}
    except Exception as e:
        handle_gemini_exception(e)

# --- 2. Concept Explainer Endpoint ---
@router.post("/explain")
async def explain_endpoint(payload: ExplainRequest):
    try:
        data = gemini_service.explain_concept(payload.topic, payload.level)
        return data
    except Exception as e:
        handle_gemini_exception(e)

# --- 3. Quiz Generator Endpoint ---
@router.post("/quiz")
async def quiz_endpoint(payload: QuizRequest):
    try:
        data = gemini_service.generate_quiz(payload.topic, payload.count)
        return data
    except Exception as e:
        handle_gemini_exception(e)

# --- 4. Text Summarizer Endpoint ---
@router.post("/summarize")
async def summarize_endpoint(payload: SummarizeRequest):
    try:
        data = gemini_service.generate_summary(payload.text, payload.style)
        return data
    except Exception as e:
        handle_gemini_exception(e)

# --- 5. Learning Roadmap Endpoint ---
@router.post("/roadmap")
async def roadmap_endpoint(payload: RoadmapRequest):
    try:
        data = gemini_service.generate_roadmap(payload.subject, payload.duration)
        return data
    except Exception as e:
        handle_gemini_exception(e)
