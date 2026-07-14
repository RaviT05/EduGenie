from google import genai
from google.genai import types
import json
import logging
from pydantic import BaseModel, Field
from app.config import settings

logger = logging.getLogger(__name__)

# --- Structured Response Schemas (Pydantic Models for google-genai) ---

class ExplainResponseModel(BaseModel):
    topic: str
    level: str
    explanation: str
    analogy: str
    points: list[str]

class OptionModel(BaseModel):
    key: str
    text: str
    correct: bool

class QuizQuestionModel(BaseModel):
    id: int
    question: str
    options: list[OptionModel]

class QuizResponseModel(BaseModel):
    questions: list[QuizQuestionModel]

class SummaryResponseModel(BaseModel):
    summary_intro: str
    summary_text: str
    bullets: list[str]

class RoadmapStepModel(BaseModel):
    title: str
    duration: str
    desc: str
    resources: list[str]

class RoadmapResponseModel(BaseModel):
    subject: str
    duration: str
    steps: list[RoadmapStepModel]


class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.configured = False
        
        # Verify key is configured
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                # Initialize the Client
                self.client = genai.Client(api_key=self.api_key)
                self.configured = True
            except Exception as e:
                logger.error(f"Error configuring Google Gemini Client: {e}")

    def _get_client(self):
        if not self.configured:
            raise ValueError(
                "Gemini API key is not configured. Please update the GEMINI_API_KEY variable "
                "in your backend/.env file with a valid Google Gemini API Key."
            )
        return self.client

    def generate_chat(self, message: str) -> str:
        client = self._get_client()
        prompt = (
            "You are EduGenie, a helpful, encouraging, and intelligent AI study tutor. "
            "Your goal is to explain concepts clearly, answer academic questions, and motivate students. "
            "You may use basic HTML tags like <strong>, <em>, and <code> to style your text. "
            "Keep your explanations concise but informative. Do not use markdown headers (like # or ##) in the chat bubble.\n\n"
            f"Student Question: {message}"
        )
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )
        return response.text.strip()

    def explain_concept(self, topic: str, level: str) -> dict:
        client = self._get_client()
        prompt = (
            f"Explain the educational topic '{topic}' to a target audience of type '{level}'.\n"
            "Provide the explanation text, everyday analogy, and key takeaways points."
        )
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ExplainResponseModel
            )
        )
        try:
            return json.loads(response.text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini explain JSON: {response.text}")
            raise ValueError(f"Failed to generate structured explanation: {e}")

    def generate_quiz(self, topic: str, count: int) -> dict:
        client = self._get_client()
        prompt = (
            f"Generate an educational multiple-choice quiz with exactly {count} questions about the topic '{topic}'.\n"
            "For each question, generate exactly 4 options (A, B, C, D) and specify the correct option."
        )
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=QuizResponseModel
            )
        )
        try:
            return json.loads(response.text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini quiz JSON: {response.text}")
            raise ValueError(f"Failed to generate structured quiz questions: {e}")

    def generate_summary(self, text: str, style: str) -> dict:
        client = self._get_client()
        prompt = (
            f"Summarize the following text block using a style of type '{style}' (short, medium, or detailed).\n"
            f"Source Text:\n{text}"
        )
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=SummaryResponseModel
            )
        )
        try:
            return json.loads(response.text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini summary JSON: {response.text}")
            raise ValueError(f"Failed to generate structured summary: {e}")

    def generate_roadmap(self, subject: str, duration: str) -> dict:
        client = self._get_client()
        prompt = (
            f"Generate a step-by-step learning roadmap curriculum to master the subject '{subject}' over a duration of '{duration}'.\n"
            "For each step, specify the title, duration (e.g. Weeks 1-2), a description, and exactly 2 resource reference titles."
        )
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=RoadmapResponseModel
            )
        )
        try:
            return json.loads(response.text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini roadmap JSON: {response.text}")
            raise ValueError(f"Failed to generate structured roadmap: {e}")
