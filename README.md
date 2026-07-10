# 🚀 EduGenie – Google Gemini Powered Learning Assistant

![Python](https://img.shields.io/badge/Python-3.x-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Framework-green)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![HTML5](https://img.shields.io/badge/HTML5-orange)
![CSS3](https://img.shields.io/badge/CSS3-blue)
![Google Gemini](https://img.shields.io/badge/Google-Gemini-red)
![License](https://img.shields.io/badge/License-Educational-lightgrey)

EduGenie is an interactive, AI-powered educational learning assistant designed to streamline study techniques, simplify academic topics, and optimize learning processes. By combining a lightweight modern client interface with a robust, async Python API, EduGenie leverages the **Google Gemini API** to act as a personal AI study companion.

EduGenie is built collaboratively as part of a software engineering internship project.

---

## 🎯 Why EduGenie?

EduGenie was developed to provide students with an AI-powered learning companion that simplifies studying, encourages self-assessment, and delivers personalized guidance. Instead of relying on multiple learning resources, students can use a single intelligent platform for asking questions, understanding concepts, generating quizzes, summarizing content, and creating personalized learning roadmaps. The goal is to make learning more interactive, efficient, and accessible through Artificial Intelligence.

---

## 📌 Project Overview

EduGenie is designed to help students with learning, understanding concepts, self-assessment, and personalized study planning using AI. Rather than parsing massive pages of textbook material or searching through disconnected study resources, students can use this platform to:
1. Simplify complex theories for different target audiences (ELI5 to expert).
2. Generate active-recall revision quizzes with automated grading.
3. Condense long essays or lecture chapters into structured highlights.
4. Construct timeline curriculums to guide them from absolute novice to professional mastery.
5. Converse with an AI tutor that has deep knowledge in academic subjects.

By structuring these features side-by-side inside a responsive dashboard, EduGenie optimizes study workflow, improves retention, and speeds up concept comprehension.

---

## 🌟 Key Features

* **🤖 AI Chat Assistant**: Interactive, contextual dialogue bubble feed with an AI tutor. Perfect for quick questions and explanations.
* **📘 Concept Explainer**: Input a concept and select a target audience difficulty level: *Explain Like I'm 5 (ELI5)*, *Beginner*, *Intermediate*, or *Advanced*.
* **📝 AI Quiz Generator**: Generate custom multiple-choice question sheets (MCQs) on any subject. Select the question count, play the quiz, and see instant score grading.
* **📄 Text Summarizer**: Paste lengthy documents and articles. Get short overview summaries, medium key concepts, or detailed analyses instantly.
* **🛣️ Personalized Learning Roadmap Generator**: Design custom curriculum milestones over 4 weeks, 12 weeks, or 6 months. Includes suggested study references.
* **⚡ FastAPI Backend**: High-performance asynchronous API layer with Pydantic type safety and automatically generated Swagger documentation.
* **🎨 Responsive Modern User Interface**: Clean navy/royal blue and white aesthetic featuring sticky headers, cards, responsive flexible columns, and mobile hamburger controls.
* **🔗 Google Gemini API Integration**: Powered by Google Gemini API to provide intelligent educational assistance and AI-generated responses.

---

## 🛠️ Tech Stack

| Technology | Role | Details |
| :--- | :--- | :--- |
| **HTML5** | Frontend Structure | Semantic document framework |
| **CSS3** | Styling & Aesthetics | Flexbox/Grid alignment, focus effects, keyframe animations, mobile breakpoints |
| **JavaScript (Vanilla)** | Client-Side Interaction | Async `fetch()` operations, dynamic DOM injection, spinner states, clipboard tools |
| **Python** | Backend Language | Core application logic, script tasks, compiler verification |
| **FastAPI** | Web API Framework | Fast routing, async endpoints, Pydantic data validation |
| **Google Gemini API** | AI Model Integration | Generative LLM logic with structured JSON schema targets |
| **SQLite** | Database Layer | Lightweight relational database templates for project tracking |
| **Git & GitHub** | Version Control | Code repository hosting, branching, and portfolio sharing |
| **JSON** | Data Format | Schema-compliant request/response data payloads |

---

## 📐 System Architecture

EduGenie follows a decoupled client-server architecture to ensure high responsiveness and modularity:

```text
┌───────────────────────────────────────┐
│      Frontend (HTML/CSS/JavaScript)   │
└──────────────────┬────────────────────┘
                   │ (1) Async HTTP POST Request
                   ▼
┌───────────────────────────────────────┐
│            FastAPI Backend            │
└──────────────────┬────────────────────┘
                   │ (2) Read Settings & Configure API
                   ▼
┌───────────────────────────────────────┐
│           Google Gemini API           │
└──────────────────┬────────────────────┘
                   │ (3) Return Generative JSON Output
                   ▼
┌───────────────────────────────────────┐
│              AI Response              │
└──────────────────┬────────────────────┘
                   │ (4) Schema-Validate & Parse Response
                   ▼
┌───────────────────────────────────────┐
│           Frontend Display            │
└───────────────────────────────────────┘
```

---

## 📂 Project Structure

The codebase is organized following clean-architecture package layouts:

```text
edugenie/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── assistant.py       # API endpoints (chat, explain, quiz, summarize, roadmap)
│   │   │   ├── auth.py            # Authentication endpoint placeholder
│   │   │   └── router.py          # Central router compiler
│   │   ├── crud/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py
│   │   │   └── user.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py
│   │   │   └── user.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py            # Pydantic validation schemas
│   │   │   └── user.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── gemini_service.py  # Gemini SDK integration and TypedDict schemas
│   │   ├── __init__.py
│   │   ├── config.py              # Configuration & Pydantic BaseSettings
│   │   ├── database.py            # SQLAlchemy database engine dependency
│   │   └── main.py                # FastAPI bootstrapper, CORS config, and root routes
│   ├── .env                       # Local environment variables (excluded from Git)
│   ├── .env.example               # Environmental configuration template
│   └── requirements.txt           # Python application dependencies
├── frontend/
│   ├── assets/
│   │   └── .gitkeep               # Media asset container
│   ├── css/
│   │   └── styles.css             # Main stylesheet & responsive layout definitions
│   ├── js/
│   │   └── app.js                 # Frontend routing, fetch requests, UI actions
│   └── index.html                 # Main dashboard application markup
├── .gitignore                     # Git tracking exclusions
└── README.md                      # Documentation (This file)
```

---

## ⚙️ Environment Variables

To run the application, configure your credentials in the backend directory. Create a `.env` file under `backend/` using these keys:

```ini
DATABASE_URL=sqlite:///./edugenie.db
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
SECRET_KEY=YOUR_SECRET_KEY
```

> [!WARNING]
> Keep your `.env` file secure. Never commit it or reveal your raw `GEMINI_API_KEY` in public GitHub repositories.

---

## 🚀 Installation & Setup

Follow these step-by-step instructions to get EduGenie running on your local machine:

### 1. Clone the Project
```bash
git clone https://github.com/<your-github-username>/EduGenie.git
cd edugenie
```

### 2. Configure Environment Variables
- Navigate into the `backend/` folder.
- Copy `.env.example` to a new file named `.env`.
- Open `.env` and fill in your custom `GEMINI_API_KEY`.

### 3. Setup Virtual Environment & Install Dependencies
```bash
cd backend
python -m venv .venv
```
- **Activate on Windows (PowerShell)**:
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
- **Activate on macOS/Linux**:
  ```bash
  source .venv/bin/activate
  ```
- **Install Packages**:
  ```bash
  pip install -r requirements.txt
  ```

### 4. Run the FastAPI Server
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- Open `http://127.0.0.1:8000/docs` in your browser to inspect the interactive Swagger API documentation.

### 5. Launch the Frontend
Since the frontend uses standard static vanilla assets:
- Open `frontend/index.html` directly in your browser.
- Alternatively, run it using a local server utility (such as the VS Code **Live Server** extension) to serve the page at `http://127.0.0.1:5500`.

---

## 📖 Usage Guide

* **AI Chat**: Type your question in the chat input at the top. Click **Send** to communicate with your AI Tutor.
* **Simplifying Concepts**: Scroll to the Explainer card, enter a topic like "Quantum Entanglement", select your target audience, and click **Simplify Concept**.
* **Revision Quizzes**: Under Quiz Generator, input a topic like "Organic Chemistry", select the question count, click **Generate**, pick answers, and hit **Check Answers**.
* **Summarization**: Paste text into the Summarizer box, select bullet format length, and click **Summarize**.
* **Timeline Roadmaps**: Under Roadmap Generator, input a career path or skill (e.g. "Data Science"), select duration, click **Generate Roadmap**, and view curriculum milestones.

---

## 🔮 Future Enhancements

We plan to implement the following features in upcoming development cycles:
* **User Authentication**: Secure signup and login for student profiles.
* **Chat History**: Save past conversations and roadmap progress to SQLite.
* **PDF Upload & Summarization**: Parse scanned textbook PDFs directly.
* **Voice Assistant**: Integrated text-to-speech feedback for studying on the go.
* **Multi-language Support**: Translate explanation outputs into regional languages.
* **Dark Mode Toggle**: Sleek palette toggle for comfortable night-time studying.
* **Cloud Database**: Transition SQLite connection to cloud PostgreSQL.
* **User Dashboard**: Visual progress trackers and retention indicators.
* **Progress Tracking**: Checkboxes on generated roadmaps to track finished milestones.

---

## 👨‍💻 Team Members

EduGenie was collaboratively developed as an internship project by:
* **Ravi Teja Devara**
* **Dunaboyina Jyoshna**

---

## 🌐 Live Demo

🚀 **Coming Soon**  
*(Deployed project URL will be linked here after staging configuration.)*

---

## 📄 License

This project was developed as part of an internship learning program and is intended for educational and portfolio purposes.

---

⭐ If you found this project helpful, consider giving it a star on GitHub.

Made   by Ravi Teja Devara & Dunaboyina Jyoshna
