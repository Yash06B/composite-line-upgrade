console.log("Composite Line Upgrade App Loaded");

// Add interaction to buttons for demo purposes
document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

/* Chat Widget Logic */
document.addEventListener('DOMContentLoaded', () => {
    // Check if chat widget already exists to prevent duplicates
    if (document.getElementById('chat-toggle')) return;

    // 1. Create and Inject HTML
    const chatWidget = document.createElement('div');
    chatWidget.innerHTML = `
        <div class="chat-widget-btn" id="chat-toggle">
            <span class="material-icons-outlined" style="font-size: 32px;">chat</span>
        </div>
        <div class="chat-window" id="chat-window">
            <div class="chat-header">
                <h3>Nebular Assistant</h3>
                <div class="chat-minimize" id="chat-minimize">
                    <span class="material-icons-outlined" style="font-size: 18px;">expand_more</span>
                </div>
            </div>
            <div class="chat-body" id="chat-body">
                <div class="chat-message">
                    <div class="chat-avatar">AI</div>
                    <div class="message-card">
                        <p>Hello! How can I help you with the composite line upgrade today?</p>
                        <div class="template-questions">
                            <button class="q-pill" onclick="window.fillObj('What is the timeline?')">What is the timeline?</button>
                            <button class="q-pill" onclick="window.fillObj('Show me the budget breakdown')">Show me the budget breakdown</button>
                            <button class="q-pill" onclick="window.fillObj('Who are the key stakeholders?')">Who are the key stakeholders?</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" class="chat-input" placeholder="Type your question..." id="chat-input">
            </div>
        </div>
    `;
    document.body.appendChild(chatWidget);

    // 2. Add Logic
    const toggleBtn = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const minimizeBtn = document.getElementById('chat-minimize');
    const chatInput = document.getElementById('chat-input');

    function toggleChat() {
        chatWindow.classList.toggle('open');
        const icon = toggleBtn.querySelector('span');
        // Toggle icon between 'chat' and 'close'
        if (chatWindow.classList.contains('open')) {
            icon.textContent = 'close';
        } else {
            icon.textContent = 'chat';
        }
    }

    toggleBtn.addEventListener('click', toggleChat);
    minimizeBtn.addEventListener('click', toggleChat);

    // Global function for pills (attached to window for inline onclick)
    window.fillObj = function (text) {
        chatInput.value = text;
        chatInput.focus();
        handleUserMessage(text);
    };

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage(chatInput.value);
        }
    });

    async function handleUserMessage(msg) {
        if (!msg.trim()) return;

        // Add User Message
        addMessage(msg, 'user');
        chatInput.value = '';

        // Add Loading Indicator
        const loadingId = addMessage('Thinking...', 'ai', true);

        // Get API Key from config
        const apiKey = typeof CONFIG !== 'undefined' ? CONFIG.GROQ_API_KEY : "YOUR_GROQ_API_KEY";

        try {
            if (apiKey === "YOUR_GROQ_API_KEY") {
                throw new Error("Missing API Key");
            }

            // Call Groq API
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "You are a helpful project assistant for the 'Composite Line Upgrade' project. Answer concisely." },
                        { role: "user", content: msg }
                    ],
                    model: "llama3-8b-8192",
                    temperature: 0.7,
                    max_tokens: 1024,
                    stream: false
                })
            });

            if (!response.ok) throw new Error(`Groq API Error: ${response.statusText}`);

            const data = await response.json();
            const aiText = data.choices[0].message.content;

            // Remove Loading & content update
            updateMessage(loadingId, aiText);

        } catch (error) {
            console.warn("Groq connection failed:", error);

            let errorMessage = "";
            if (error.message === "Missing API Key") {
                errorMessage = "<br><em style='font-size:0.8em; color:#ef4444;'>Error: Please add your Groq API Key in config.js</em>";
            } else {
                errorMessage = "<br><em style='font-size:0.8em; color:#94a3b8;'>(Offline Mode - API unavailable)</em>";
            }

            // Fallback to static logic
            const fallbackResponse = getStaticResponse(msg);
            updateMessage(loadingId, fallbackResponse + errorMessage, true);
        }
    }

    function addMessage(text, sender, isLoading = false) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message');
        msgDiv.style.flexDirection = sender === 'user' ? 'row-reverse' : 'row';
        const msgId = 'msg-' + Date.now();
        msgDiv.id = msgId;

        const content = `
            <div class="chat-avatar" style="${sender === 'user' ? 'background:var(--accent-teal); color:white;' : ''}">
                ${sender === 'user' ? 'ME' : 'AI'}
            </div>
            <div class="message-card" style="${sender === 'user' ? 'background:#eff6ff; border-color:#dbeafe;' : ''}">
                <p></p>
            </div>
        `;
        msgDiv.innerHTML = content;

        // Use textContent for safety (unless it's the loading state which we control)
        msgDiv.querySelector('p').textContent = text;

        document.getElementById('chat-body').appendChild(msgDiv);

        const chatBody = document.getElementById('chat-body');
        chatBody.scrollTop = chatBody.scrollHeight;

        return msgId;
    }

    function updateMessage(msgId, newText, allowHtml = false) {
        const msgDiv = document.getElementById(msgId);
        if (msgDiv) {
            if (allowHtml) {
                msgDiv.querySelector('.message-card p').innerHTML = newText;
            } else {
                msgDiv.querySelector('.message-card p').innerText = newText;
            }
        }
    }

    function getStaticResponse(input) {
        const lower = input.toLowerCase();
        if (lower.includes('timeline') || lower.includes('schedule')) return "The project timeline is currently on track. Phase 1 completes next Friday.";
        if (lower.includes('budget') || lower.includes('cost')) return "The current budget utilization is 45%. We are within the allocated limits.";
        if (lower.includes('stakeholder')) return "Key stakeholders include the Engineering Lead, Product Manager, and Safety Compliance Officer.";
        return "I can help with timelines, budgets, and stakeholder information.";
    }

    // Toast Notification Logic
    window.showToast = function (message) {
        // Remove existing toast if any
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <span class="material-icons-outlined toast-icon">check_circle</span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Animate In
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove after 3s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    };
});
