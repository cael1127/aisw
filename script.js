class ChatApp {
    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.initializeElements();
        this.initializeEventListeners();
        this.checkForOldContent();
    }

    checkForOldContent() {
        // Simple check for old content without forcing reloads
        const messagesContainer = document.getElementById('messages');
        if (!messagesContainer) {
            console.log('Messages container not found');
            return;
        }

        // Check if we're showing the old welcome message
        const welcomeMessage = messagesContainer.querySelector('.message-content p');
        if (welcomeMessage && welcomeMessage.textContent.includes('Choose an API above')) {
            console.log('Old welcome message detected - please refresh the page');
            return;
        }

        // Check if old API selector options exist
        const apiSelector = document.getElementById('apiSelector');
        if (apiSelector) {
            const options = Array.from(apiSelector.options).map(opt => opt.value);
            if (options.includes('qwen') || options.includes('qwen2')) {
                console.log('Old API options detected - please refresh the page');
                return;
            }
        }
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
        const response = await fetch('/.netlify/functions/api-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                apiType: 'gemini'
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
        
        // Format the content with proper line breaks
        const formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
            .replace(/\n/g, '<br>') // Line breaks
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Handle any remaining bold
        
        contentDiv.innerHTML = formattedContent;
        
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