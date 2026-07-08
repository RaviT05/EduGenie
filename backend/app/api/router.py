from fastapi import APIRouter
from app.api import assistant

api_router = APIRouter()
api_router.include_router(assistant.router, prefix="/assistant", tags=["assistant"])
