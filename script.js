class ChatApp {
    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.messagesContainer = document.getElementById('messages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.apiSelector = document.getElementById('apiSelector');
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage('user', message);
        this.userInput.value = '';

        // Show typing indicator
        this.showTyping();

        try {
            const response = await this.callAPI(message);
            this.hideTyping();
            this.addMessage('assistant', response);
        } catch (error) {
            this.hideTyping();
            this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
            console.error('API Error:', error);
        }
    }

    async callAPI(message) {
        const selectedAPI = this.apiSelector.value;
        
        const response = await fetch('/.netlify/functions/api-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                apiType: selectedAPI
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return data.response || 'No response received';
    }

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);
        
        this.scrollToBottom();
    }

    showTyping() {
        this.isLoading = true;
        this.sendButton.disabled = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing';
        typingDiv.id = 'typing-indicator';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = '<span></span><span></span><span></span>';
        
        typingDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(typingDiv);
        
        this.scrollToBottom();
    }

    hideTyping() {
        this.isLoading = false;
        this.sendButton.disabled = false;
        
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
}); 