// Chat Widget Logic
(function() {
    // 1. Inject Styles
    const style = document.createElement('style');
    style.innerHTML = `
        #dc-chat-widget {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            font-family: 'Poppins', sans-serif;
        }
        #dc-chat-btn {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #d4af37, #b8860b);
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
            color: #000;
            font-size: 24px;
        }
        #dc-chat-btn:hover {
            transform: scale(1.1);
        }
        #dc-chat-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: #111;
            border: 1px solid #333;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: translateY(20px);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
        }
        #dc-chat-window.active {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
        }
        .dc-chat-header {
            background: #000;
            padding: 15px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .dc-chat-header h3 {
            margin: 0;
            color: #d4af37;
            font-size: 16px;
            font-weight: 600;
        }
        .dc-chat-close {
            color: #666;
            cursor: pointer;
            font-size: 18px;
        }
        .dc-chat-close:hover { color: #fff; }
        .dc-chat-body {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #0d0d0d;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .dc-msg {
            max-width: 80%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
            position: relative;
            word-wrap: break-word;
        }
        .dc-msg.user {
            align-self: flex-end;
            background: #333;
            color: #fff;
            border-bottom-right-radius: 2px;
        }
        .dc-msg.admin {
            align-self: flex-start;
            background: #d4af37;
            color: #000;
            border-top-left-radius: 2px;
        }
        .dc-msg-time {
            display: block;
            font-size: 10px;
            margin-top: 4px;
            opacity: 0.7;
            text-align: right;
        }
        .dc-chat-footer {
            padding: 15px;
            background: #000;
            border-top: 1px solid #333;
        }
        .dc-chat-form {
            display: flex;
            gap: 10px;
        }
        #dc-chat-input {
            flex: 1;
            background: #1a1a1a;
            border: 1px solid #333;
            color: #fff;
            padding: 10px;
            border-radius: 6px;
            outline: none;
            font-family: inherit;
        }
        #dc-chat-input:focus {
            border-color: #d4af37;
        }
        #dc-chat-submit {
            background: #d4af37;
            color: #000;
            border: none;
            padding: 0 15px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
        #dc-chat-submit:hover {
            background: #fff;
        }
        /* Scrollbar */
        .dc-chat-body::-webkit-scrollbar { width: 6px; }
        .dc-chat-body::-webkit-scrollbar-track { background: #000; }
        .dc-chat-body::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML
    const widget = document.createElement('div');
    widget.id = 'dc-chat-widget';
    widget.innerHTML = `
        <div id="dc-chat-window">
            <div class="dc-chat-header">
                <h3>Dialcraft Support</h3>
                <span class="dc-chat-close" onclick="toggleChat()">&times;</span>
            </div>
            <div class="dc-chat-body" id="dc-chat-body">
                <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
                    Welcome to Dialcraft Concierge.<br>How may we assist you today?
                </div>
            </div>
            <div class="dc-chat-footer">
                <form class="dc-chat-form" onsubmit="sendUserMessage(event)">
                    <input type="text" id="dc-chat-input" placeholder="Type a message..." required autocomplete="off">
                    <button type="submit" id="dc-chat-submit"><i class="fas fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
        <div id="dc-chat-btn" onclick="toggleChat()">
            <i class="fas fa-comment-dots"></i>
        </div>
    `;
    document.body.appendChild(widget);

    // 3. Logic
    window.toggleChat = function() {
        document.getElementById('dc-chat-window').classList.toggle('active');
        scrollToBottom();
    };

    function getUserId() {
        const user = JSON.parse(localStorage.getItem('dialcraft_user'));
        if (user && user.email) return user.email;
        
        let guestId = localStorage.getItem('dialcraft_guest_id');
        if (!guestId) {
            guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('dialcraft_guest_id', guestId);
        }
        return guestId;
    }

    const userId = getUserId();
    const chatBody = document.getElementById('dc-chat-body');

    window.sendUserMessage = function(e) {
        e.preventDefault();
        const input = document.getElementById('dc-chat-input');
        const text = input.value.trim();
        if (!text) return;

        let allMessages = JSON.parse(localStorage.getItem('dialcraft_messages')) || {};
        if (!allMessages[userId]) allMessages[userId] = [];

        allMessages[userId].push({
            sender: 'user',
            text: text,
            timestamp: Date.now()
        });

        localStorage.setItem('dialcraft_messages', JSON.stringify(allMessages));
        input.value = '';
        renderMessages();
    };

    function renderMessages() {
        const allMessages = JSON.parse(localStorage.getItem('dialcraft_messages')) || {};
        const msgs = allMessages[userId] || [];
        
        if (msgs.length === 0) return;

        chatBody.innerHTML = msgs.map(msg => `
            <div class="dc-msg ${msg.sender}">
                ${msg.text}
                <span class="dc-msg-time">${new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        `).join('');
        
        scrollToBottom();
    }

    function scrollToBottom() {
        setTimeout(() => chatBody.scrollTop = chatBody.scrollHeight, 50);
    }

    // Poll for changes
    setInterval(renderMessages, 3000);
    
    // Initial render
    renderMessages();
})();
