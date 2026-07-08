from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Google Gemini Powered Learning Assistant backend API",
    version="1.0.0"
)

# Configure CORS
# In development, allowing all origins is convenient. In production, restrict this.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    """
    EduGenie Welcome Endpoint.
    """
    return {"message": "Welcome to EduGenie"}

@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring app status.
    """
    return {"status": "healthy"}
