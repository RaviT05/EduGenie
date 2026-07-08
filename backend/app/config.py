from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "EduGenie"
    API_V1_STR: str = "/api/v1"
    
    # Database configuration
    DATABASE_URL: str = "sqlite:///./edugenie.db"
    
    # Security
    SECRET_KEY: str = "supersecretkey"  # In production, this should be a random string
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Gemini API Configuration
    GEMINI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
