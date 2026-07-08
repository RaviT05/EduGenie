from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str = Field(..., description="Message input from the user", min_length=1)

class ExplainRequest(BaseModel):
    topic: str = Field(..., description="Topic or concept to simplify", min_length=1)
    level: str = Field("beginner", description="Audience difficulty level (child, beginner, college, expert)")

class QuizRequest(BaseModel):
    topic: str = Field(..., description="Topic to generate the quiz on", min_length=1)
    count: int = Field(3, description="Number of questions to generate", ge=1, le=10)

class SummarizeRequest(BaseModel):
    text: str = Field(..., description="Source text to summarize", min_length=10)
    style: str = Field("short", description="Length or style of summary (short, medium, detailed)")

class RoadmapRequest(BaseModel):
    subject: str = Field(..., description="Subject or learning goal", min_length=1)
    duration: str = Field("4-weeks", description="Duration allocated (4-weeks, 12-weeks, 6-months)")
