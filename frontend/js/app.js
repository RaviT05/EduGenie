// ==========================================================================
// EduGenie JavaScript - Backend Integration Layer (Phase 4)
// ==========================================================================

const API_BASE = "http://127.0.0.1:8000/api/v1/assistant";

document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Navigation & Active Link Highlighting ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header');

    window.addEventListener('scroll', () => {
        // Sticky class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSection = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= (secTop - 120)) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // --- Mobile Responsive Hamburger Menu ---
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when clicking link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // --- Loading UI Helper ---
    function showLoading(containerId, loadingMessage = "Consulting EduGenie AI...") {
        const container = document.getElementById(containerId);
        container.classList.remove('hidden');
        container.innerHTML = `
            <div class="spinner-container">
                <div class="spinner"></div>
                <div class="loading-text">${loadingMessage}</div>
            </div>
        `;
    }

    // --- Error UI Helper ---
    function showError(containerId, errorMsg) {
        const container = document.getElementById(containerId);
        container.classList.remove('hidden');
        container.innerHTML = `
            <div style="padding: 20px; border-radius: 8px; background-color: #f8d7da; border: 1.5px solid #f5c2c7; color: #842029; display: flex; align-items: flex-start; gap: 12px;">
                <i class="fa-solid fa-circle-exclamation" style="font-size: 1.5rem; margin-top: 2px;"></i>
                <div>
                    <h5 style="margin-bottom: 5px; font-weight: 700;">API Connection Failed</h5>
                    <p style="font-size: 0.9rem; line-height: 1.4;">${errorMsg}</p>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // MODULE 1: AI Chatbot Logic (FastAPI Integrated)
    // ==========================================================================
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = chatInput.value.trim();
        if (!question) return;

        // 1. Add User Message
        appendMessage(question, 'user');
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 2. Append temporary bot loading bubble
        const loadBubble = document.createElement('div');
        loadBubble.className = 'chat-bubble bot chat-loading-bubble';
        const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        loadBubble.innerHTML = `
            <div class="bubble-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="bubble-content" style="display: flex; align-items: center; gap: 10px; padding: 12px 20px;">
                <div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
                <span style="font-size: 0.85rem; color: var(--text-secondary);">EduGenie thinking...</span>
            </div>
        `;
        chatMessages.appendChild(loadBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // 3. Request FastAPI backend
            const response = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: question })
            });

            if (!response.ok) {
                const errDetail = await response.json().catch(() => ({ detail: "HTTP server error status code " + response.status }));
                throw new Error(errDetail.detail || "Server error occurred");
            }

            const data = await response.json();
            
            // Remove loading bubble and append actual bot message
            loadBubble.remove();
            appendMessage(data.response, 'bot');
        } catch (err) {
            loadBubble.remove();
            appendMessage(
                `<span style="color: #dc3545;"><i class="fa-solid fa-circle-exclamation"></i> <strong>Error:</strong> ${err.message}. Ensure backend is running.</span>`, 
                'bot'
            );
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    function appendMessage(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        
        const avatarIcon = sender === 'bot' ? 'fa-robot' : 'fa-user';
        const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        bubble.innerHTML = `
            <div class="bubble-avatar"><i class="fa-solid ${avatarIcon}"></i></div>
            <div class="bubble-content">
                <p>${text}</p>
                <span class="bubble-time">${formattedTime}</span>
            </div>
        `;
        chatMessages.appendChild(bubble);
    }

    // ==========================================================================
    // MODULE 2: Concept Explainer Logic (FastAPI Integrated)
    // ==========================================================================
    const explainForm = document.getElementById('explainForm');
    const explainTopic = document.getElementById('explainTopic');
    const explainLevel = document.getElementById('explainLevel');
    const explainOutputPanel = document.getElementById('explainOutputPanel');
    const explainResultText = document.getElementById('explainResultText');

    explainForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const topic = explainTopic.value.trim();
        const level = explainLevel.value;

        // Show the panel first, then show loading inside the content area
        explainOutputPanel.classList.remove('hidden');
        showLoading('explainResultText', `Consulting FastAPI to simplify "${topic}"...`);

        try {
            const response = await fetch(`${API_BASE}/explain`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic, level: level })
            });

            if (!response.ok) {
                const errDetail = await response.json().catch(() => ({ detail: "HTTP server error " + response.status }));
                throw new Error(errDetail.detail || "Server error occurred");
            }

            const data = await response.json();
            
            // Format HTML Output
            let pointsHtml = "";
            data.points.forEach(pt => {
                pointsHtml += `<li>${pt}</li>`;
            });

            explainResultText.innerHTML = `
                <div class="explanation-rich">
                    <h3>${data.topic} <span class="roadmap-node-duration">${data.level}</span></h3>
                    <p>${data.explanation}</p>
                    <div class="explanation-analogy">
                        <strong>💡 Everyday Analogy:</strong>
                        <p>${data.analogy}</p>
                    </div>
                    <h4>Key Core Concepts:</h4>
                    <ul class="explanation-points">
                        ${pointsHtml}
                    </ul>
                </div>
            `;
        } catch (err) {
            showError('explainResultText', err.message + ". Please confirm your FastAPI Uvicorn backend is running locally on port 8000.");
        }
    });

    // ==========================================================================
    // MODULE 3: AI Quiz Generator Logic (FastAPI Integrated)
    // ==========================================================================
    const quizForm = document.getElementById('quizForm');
    const quizTopic = document.getElementById('quizTopic');
    const quizNum = document.getElementById('quizNum');
    const quizOutputPanel = document.getElementById('quizOutputPanel');
    const quizContainer = document.getElementById('quizContainer');
    const quizCheckBtn = document.getElementById('quizCheckBtn');
    const quizScoreBox = document.getElementById('quizScoreBox');

    let currentQuizData = [];

    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const topic = quizTopic.value.trim();
        const count = parseInt(quizNum.value);

        // Show the panel first, then show loading inside the quiz container
        quizOutputPanel.classList.remove('hidden');
        showLoading('quizContainer', `Requesting ${count}-question quiz on "${topic}" from FastAPI...`);
        quizCheckBtn.classList.remove('hidden');
        quizScoreBox.classList.add('hidden');

        try {
            const response = await fetch(`${API_BASE}/quiz`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic, count: count })
            });

            if (!response.ok) {
                const errDetail = await response.json().catch(() => ({ detail: "HTTP error status " + response.status }));
                throw new Error(errDetail.detail || "Server error occurred");
            }

            const data = await response.json();
            currentQuizData = data.questions;
            
            // Render quiz UI
            renderQuiz(currentQuizData);
        } catch (err) {
            showError('quizContainer', err.message + ". Ensure FastAPI backend server is active and CORS is correctly allowed.");
            quizCheckBtn.classList.add('hidden');
        }
    });

    function renderQuiz(questions) {
        quizContainer.innerHTML = '';
        questions.forEach((q, idx) => {
            const card = document.createElement('div');
            card.className = 'quiz-question-card';
            card.dataset.qId = q.id;

            let optionsHtml = '';
            q.options.forEach(opt => {
                optionsHtml += `
                    <label class="quiz-option-label" data-key="${opt.key}">
                        <input type="radio" name="question_${q.id}" value="${opt.key}" style="display:none;">
                        <span><strong>${opt.key}.</strong> ${opt.text}</span>
                    </label>
                `;
            });

            card.innerHTML = `
                <div class="question-text">${idx + 1}. ${q.question}</div>
                <div class="quiz-options">
                    ${optionsHtml}
                </div>
            `;
            quizContainer.appendChild(card);

            // Option selection click behavior
            const labels = card.querySelectorAll('.quiz-option-label');
            labels.forEach(label => {
                label.addEventListener('click', () => {
                    labels.forEach(l => l.classList.remove('selected'));
                    label.classList.add('selected');
                    label.querySelector('input').checked = true;
                });
            });
        });
    }

    quizCheckBtn.addEventListener('click', () => {
        let score = 0;
        const total = currentQuizData.length;

        currentQuizData.forEach(q => {
            const card = quizContainer.querySelector(`.quiz-question-card[data-q-id="${q.id}"]`);
            const selectedLabel = card.querySelector('.quiz-option-label.selected');
            const selectedVal = selectedLabel ? selectedLabel.dataset.key : null;
            
            const options = card.querySelectorAll('.quiz-option-label');
            options.forEach(label => {
                const optKey = label.dataset.key;
                const originalOpt = q.options.find(o => o.key === optKey);
                
                if (originalOpt.correct) {
                    label.classList.add('correct');
                } else if (selectedVal === optKey) {
                    label.classList.add('incorrect');
                }
            });

            if (selectedVal) {
                const correctOpt = q.options.find(o => o.correct);
                if (correctOpt.key === selectedVal) {
                    score++;
                }
            }
        });

        // Show Score
        quizScoreBox.classList.remove('hidden');
        quizScoreBox.innerHTML = `Score: ${score} / ${total} (${Math.round((score / total) * 100)}%)`;
        quizCheckBtn.classList.add('hidden');
    });

    // ==========================================================================
    // MODULE 4: Text Summarizer Logic (FastAPI Integrated)
    // ==========================================================================
    const summaryForm = document.getElementById('summaryForm');
    const summaryText = document.getElementById('summaryText');
    const summaryLength = document.getElementById('summaryLength');
    const summaryOutputPanel = document.getElementById('summaryOutputPanel');
    const summaryResultText = document.getElementById('summaryResultText');

    summaryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = summaryText.value.trim();
        const style = summaryLength.value;

        // Show the panel first, then show loading inside the content area
        summaryOutputPanel.classList.remove('hidden');
        showLoading('summaryResultText', "Transmitting paragraphs to FastAPI summarizing engine...");

        try {
            const response = await fetch(`${API_BASE}/summarize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text, style: style })
            });

            if (!response.ok) {
                const errDetail = await response.json().catch(() => ({ detail: "HTTP code status " + response.status }));
                throw new Error(errDetail.detail || "Server error occurred");
            }

            const data = await response.json();
            
            let bulletHtml = "";
            data.bullets.forEach(b => {
                bulletHtml += `<li>${b}</li>`;
            });

            summaryResultText.innerHTML = `
                <p>${data.summary_intro}</p><br>
                <p>${data.summary_text}</p><br>
                <ul class="summary-bullets">
                    ${bulletHtml}
                </ul>
            `;
        } catch (err) {
            showError('summaryResultText', err.message + ". Check your text word length or make sure the backend endpoint is up.");
        }
    });

    // ==========================================================================
    // MODULE 5: Learning Roadmap Logic (FastAPI Integrated)
    // ==========================================================================
    const roadmapForm = document.getElementById('roadmapForm');
    const roadmapSubject = document.getElementById('roadmapSubject');
    const roadmapDuration = document.getElementById('roadmapDuration');
    const roadmapOutputPanel = document.getElementById('roadmapOutputPanel');
    const roadmapTimeline = document.getElementById('roadmapTimeline');

    roadmapForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const goal = roadmapSubject.value.trim();
        const duration = roadmapDuration.value;

        // Show the panel first, then show loading inside the timeline container
        roadmapOutputPanel.classList.remove('hidden');
        showLoading('roadmapTimeline', `Requesting syllabus roadmaps on "${goal}"...`);

        try {
            const response = await fetch(`${API_BASE}/roadmap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject: goal, duration: duration })
            });

            if (!response.ok) {
                const errDetail = await response.json().catch(() => ({ detail: "HTTP server status code " + response.status }));
                throw new Error(errDetail.detail || "Server error occurred");
            }

            const data = await response.json();
            
            // Format Timeline Nodes
            let timelineHtml = "";
            data.steps.forEach(step => {
                let resLinks = "";
                step.resources.forEach(r => {
                    resLinks += `<a href="#" onclick="alert('Resources are ready for local study!')"><i class="fa-solid fa-square-arrow-up-right"></i> ${r}</a>`;
                });

                timelineHtml += `
                    <div class="roadmap-node">
                        <div class="roadmap-marker"></div>
                        <div class="roadmap-node-content">
                            <h3>
                                <span>${step.title}</span>
                                <span class="roadmap-node-duration">${step.duration}</span>
                            </h3>
                            <p class="roadmap-node-desc">${step.desc}</p>
                            <div class="roadmap-node-resources">
                                <h5>📚 Curated Study Resources:</h5>
                                <ul>
                                    ${resLinks}
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            });

            roadmapTimeline.innerHTML = timelineHtml;
        } catch (err) {
            showError('roadmapTimeline', err.message + ". Confirm that FastAPI server router can serve /roadmap POST requests.");
        }
    });
});

// --- Copy to Clipboard Global Helper ---
function copyContent(elementId) {
    const textEl = document.getElementById(elementId);
    if (!textEl) return;
    
    const textToCopy = textEl.innerText;
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            const btn = document.querySelector(`[onclick="copyContent('${elementId}')"]`);
            if (btn) {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
                btn.style.backgroundColor = '#d1e7dd';
                btn.style.color = '#0f5132';
                
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 2000);
            }
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert("Failed to copy text. Please select and copy manually.");
        });
}
