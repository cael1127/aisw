class ChatApp {
    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.conversationId = this.generateConversationId();
        this.initializeElements();
        this.initializeEventListeners();
        this.loadConversationHistory();
        this.checkForOldContent();
    }

    generateConversationId() {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
        this.clearChatButton = document.getElementById('clearChat');
        this.exportChatButton = document.getElementById('exportChat');
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.userInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });

        // Conversation controls
        if (this.clearChatButton) {
            this.clearChatButton.addEventListener('click', () => this.clearCurrentConversation());
        }
        if (this.exportChatButton) {
            this.exportChatButton.addEventListener('click', () => this.exportConversation());
        }
    }

    autoResizeTextarea() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = Math.min(this.userInput.scrollHeight, 200) + 'px';
    }

    // Memory Management Functions
    saveConversationHistory() {
        const conversationData = {
            id: this.conversationId,
            timestamp: Date.now(),
            messages: this.messages,
            title: this.generateConversationTitle()
        };

        // Save to localStorage
        const conversations = this.getStoredConversations();
        conversations[this.conversationId] = conversationData;
        
        // Keep only last 10 conversations to prevent storage bloat
        const conversationIds = Object.keys(conversations);
        if (conversationIds.length > 10) {
            const oldestId = conversationIds.sort((a, b) => 
                conversations[a].timestamp - conversations[b].timestamp
            )[0];
            delete conversations[oldestId];
        }

        localStorage.setItem('ai_chat_conversations', JSON.stringify(conversations));
    }

    loadConversationHistory() {
        const conversations = this.getStoredConversations();
        const currentConversation = conversations[this.conversationId];
        
        if (currentConversation && currentConversation.messages.length > 0) {
            this.messages = currentConversation.messages;
            this.displayStoredMessages();
        }
    }

    getStoredConversations() {
        try {
            const stored = localStorage.getItem('ai_chat_conversations');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading conversations:', error);
            return {};
        }
    }

    displayStoredMessages() {
        // Clear existing messages
        this.messagesContainer.innerHTML = '';
        
        // Display all stored messages
        this.messages.forEach(msg => {
            this.displayMessage(msg.type, msg.content, false); // false = don't save again
        });
    }

    generateConversationTitle() {
        // Generate a title based on the first user message
        const firstUserMessage = this.messages.find(msg => msg.type === 'user');
        if (firstUserMessage) {
            const content = firstUserMessage.content;
            return content.length > 50 ? content.substring(0, 50) + '...' : content;
        }
        return 'New Conversation';
    }

    // Enhanced message display function
    displayMessage(type, content, shouldSave = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        // Create avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (type === 'user') {
            avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
        } else {
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        }
        
        // Create message content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Create message header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        
        const authorSpan = document.createElement('span');
        authorSpan.className = 'message-author';
        authorSpan.textContent = type === 'user' ? 'You' : 'AI Assistant';
        
        headerDiv.appendChild(authorSpan);
        
        // Create message text
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        
        // Format the content with proper line breaks
        const formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
            .replace(/\n/g, '<br>') // Line breaks
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Handle any remaining bold
        
        textDiv.innerHTML = formattedContent;
        
        // Assemble message
        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(textDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.messagesContainer.appendChild(messageDiv);
        
        this.scrollToBottom();
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isLoading) return;

        // Add user message to memory
        this.messages.push({ type: 'user', content: message, timestamp: Date.now() });
        this.displayMessage('user', message);
        this.saveConversationHistory();

        this.userInput.value = '';
        this.autoResizeTextarea();

        // Show typing indicator
        this.showTyping();

        try {
            const response = await this.callAPI(message);
            this.hideTyping();
            
            // Add AI response to memory
            this.messages.push({ type: 'assistant', content: response, timestamp: Date.now() });
            this.displayMessage('assistant', response);
            this.saveConversationHistory();
        } catch (error) {
            this.hideTyping();
            const errorMessage = 'Sorry, I encountered an error. Please try again.';
            this.messages.push({ type: 'assistant', content: errorMessage, timestamp: Date.now() });
            this.displayMessage('assistant', errorMessage);
            this.saveConversationHistory();
            console.error('API Error:', error);
        }
    }

    async callAPI(message) {
        // Build context from recent messages (last 10 messages for context)
        const recentMessages = this.messages.slice(-10);
        const context = recentMessages.map(msg => 
            `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');
        
        const fullMessage = context ? `${context}\n\nUser: ${message}` : message;

        const response = await fetch('/.netlify/functions/api-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: fullMessage,
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

    showTyping() {
        this.isLoading = true;
        this.sendButton.disabled = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing';
        typingDiv.id = 'typing-indicator';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        
        const authorSpan = document.createElement('span');
        authorSpan.className = 'message-author';
        authorSpan.textContent = 'AI Assistant';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.innerHTML = '<span></span><span></span><span></span>';
        
        headerDiv.appendChild(authorSpan);
        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(textDiv);
        
        typingDiv.appendChild(avatarDiv);
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

    // Memory utility functions
    clearCurrentConversation() {
        if (confirm('Are you sure you want to clear this conversation?')) {
            this.messages = [];
            this.conversationId = this.generateConversationId();
            this.messagesContainer.innerHTML = `
                <div class="message system">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-header">
                            <span class="message-author">AI Assistant</span>
                        </div>
                        <div class="message-text">
                            <p>Hello! I'm your AI assistant powered by Google Gemini. How can I help you today?</p>
                        </div>
                    </div>
                </div>
            `;
            this.saveConversationHistory();
        }
    }

    exportConversation() {
        const conversationText = this.messages.map(msg => 
            `${msg.type === 'user' ? 'You' : 'AI Assistant'}: ${msg.content}`
        ).join('\n\n');
        
        const blob = new Blob([conversationText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
}); 