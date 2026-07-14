import google.generativeai as genai
import json
import logging
import typing
from app.config import settings

logger = logging.getLogger(__name__)

# --- Structured Response Schemas ---

class ExplainResponse(typing.TypedDict):
    topic: str
    level: str
    explanation: str
    analogy: str
    points: list[str]

class Option(typing.TypedDict):
    key: str
    text: str
    correct: bool

class QuizQuestion(typing.TypedDict):
    id: int
    question: str
    options: list[Option]

class QuizResponse(typing.TypedDict):
    questions: list[QuizQuestion]

class SummaryResponse(typing.TypedDict):
    summary_intro: str
    summary_text: str
    bullets: list[str]

class RoadmapStep(typing.TypedDict):
    title: str
    duration: str
    desc: str
    resources: list[str]

class RoadmapResponse(typing.TypedDict):
    subject: str
    duration: str
    steps: list[RoadmapStep]


class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.configured = False
        
        # Verify key is configured
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                genai.configure(api_key=self.api_key)
                self.configured = True
            except Exception as e:
                logger.error(f"Error configuring Google Gemini SDK: {e}")

    def _get_model(self, response_schema=None):
        if not self.configured:
            raise ValueError(
                "Gemini API key is not configured. Please update the GEMINI_API_KEY variable "
                "in your backend/.env file with a valid Google Gemini API Key."
            )
            
        model_name = "gemini-2.0-flash"
        
        generation_config = {}
        if response_schema is not None:
            generation_config["response_mime_type"] = "application/json"
            generation_config["response_schema"] = response_schema
            
            return genai.GenerativeModel(
                model_name=model_name,
                generation_config=generation_config
            )
        else:
            return genai.GenerativeModel(model_name=model_name)

    def generate_chat(self, message: str) -> str:
        model = self._get_model(response_schema=None)
        prompt = (
            "You are EduGenie, a helpful, encouraging, and intelligent AI study tutor. "
            "Your goal is to explain concepts clearly, answer academic questions, and motivate students. "
            "You may use basic HTML tags like <strong>, <em>, and <code> to style your text. "
            "Keep your explanations concise but informative. Do not use markdown headers (like # or ##) in the chat bubble.\n\n"
            f"Student Question: {message}"
        )
        response = model.generate_content(prompt)
        return response.text.strip()

    def explain_concept(self, topic: str, level: str) -> dict:
        model = self._get_model(response_schema=ExplainResponse)
        prompt = (
            f"Explain the educational topic '{topic}' to a target audience of type '{level}'.\n"
            "Return a JSON object conforming exactly to the requested schema:\n"
            "1. 'topic': the name of the topic.\n"
            "2. 'level': a reader-friendly description of the level chosen (e.g. 'Explain Like I'm 5', 'High School Student', etc.).\n"
            "3. 'explanation': a paragraph explanation of the topic. You can use <strong> or <code> tags to format important key terms.\n"
            "4. 'analogy': an everyday simple analogy to help visualize the topic.\n"
            "5. 'points': an array of exactly 3 strings, representing the key core takeaways or concepts.\n"
        )
        response = model.generate_content(prompt)
        try:
            return json.loads(response.text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini explain JSON: {response.text}")
            raise ValueError(f"Failed to generate structured explanation: {e}")

    def generate_quiz(self, topic: str, count: int) -> dict:
        model = self._get_model(response_schema=QuizResponse)
        prompt = (
            f"Generate an educational multiple-choice quiz with exactly {count} questions about the topic '{topic}'.\n"
            "Return a JSON object conforming exactly to the requested schema. "
            "For each question, generate exactly 4 options (A, B, C, D) and specify the correct option."
        )
        response = model.generate_content(prompt)
        try:
            return json.loads(response.text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini quiz JSON: {response.text}")
            raise ValueError(f"Failed to generate structured quiz questions: {e}")

    def generate_summary(self, text: str, style: str) -> dict:
        model = self._get_model(response_schema=SummaryResponse)
        prompt = (
            f"Summarize the following text block using a style of type '{style}' (short, medium, or detailed).\n"
            "Return a JSON object conforming exactly to the requested schema. "
            f"Source Text:\n{text}"
        )
        response = model.generate_content(prompt)
        try:
            return json.loads(response.text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini summary JSON: {response.text}")
            raise ValueError(f"Failed to generate structured summary: {e}")

    def generate_roadmap(self, subject: str, duration: str) -> dict:
        model = self._get_model(response_schema=RoadmapResponse)
        prompt = (
            f"Generate a step-by-step learning roadmap curriculum to master the subject '{subject}' over a duration of '{duration}'.\n"
            "Return a JSON object conforming exactly to the requested schema. "
            "For each step, specify the title, duration (e.g. Weeks 1-2), a description, and exactly 2 resource reference titles."
        )
        response = model.generate_content(prompt)
        try:
            return json.loads(response.text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini roadmap JSON: {response.text}")
            raise ValueError(f"Failed to generate structured roadmap: {e}")
