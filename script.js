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

    function handleUserMessage(msg) {
        if (!msg.trim()) return;

        // Add User Message
        addMessage(msg, 'user');
        chatInput.value = '';

        // Simulate AI Thinking
        setTimeout(() => {
            const response = getBotResponse(msg);
            addMessage(response, 'ai');
        }, 600);
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message');
        msgDiv.style.flexDirection = sender === 'user' ? 'row-reverse' : 'row';

        const content = `
            <div class="chat-avatar" style="${sender === 'user' ? 'background:var(--accent-teal); color:white;' : ''}">
                ${sender === 'user' ? 'ME' : 'AI'}
            </div>
            <div class="message-card" style="${sender === 'user' ? 'background:#eff6ff; border-color:#dbeafe;' : ''}">
                <p>${text}</p>
            </div>
        `;
        msgDiv.innerHTML = content;
        document.getElementById('chat-body').appendChild(msgDiv);

        // Auto-scroll to bottom
        const chatBody = document.getElementById('chat-body');
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function getBotResponse(input) {
        const lower = input.toLowerCase();
        if (lower.includes('timeline') || lower.includes('schedule')) {
            return "The project timeline is currently on track. Phase 1 completes next Friday.";
        }
        if (lower.includes('budget') || lower.includes('cost')) {
            return "The current budget utilization is 45%. We are within the allocated limits.";
        }
        if (lower.includes('stakeholder') || lower.includes('who')) {
            return "Key stakeholders include the Engineering Lead, Product Manager, and Safety Compliance Officer.";
        }
        if (lower.includes('hello') || lower.includes('hi')) {
            return "Hello! I'm here to assist with project details.";
        }
        return "I can help with timelines, budgets, and stakeholder information. Please ask specifically about those.";
    }
});
