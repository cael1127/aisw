class ChatApp {
    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.conversationId = this.generateConversationId();
        this.conversations = {};
        this.initializeElements();
        this.initializeEventListeners();
        this.loadAllConversations();
        this.loadConversationHistory();
        this.renderConversationsList();
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
        this.newChatBtn = document.getElementById('newChatBtn');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.sidebar = document.getElementById('sidebar');
        this.conversationsList = document.getElementById('conversationsList');
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

        // New chat button
        if (this.newChatBtn) {
            this.newChatBtn.addEventListener('click', () => this.createNewChat());
        }

        // Sidebar toggle
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !this.sidebar.contains(e.target) && 
                !this.sidebarToggle.contains(e.target)) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
    }

    closeSidebar() {
        this.sidebar.classList.remove('open');
    }

    createNewChat() {
        // Save current conversation
        this.saveConversationHistory();
        
        // Create new conversation
        this.conversationId = this.generateConversationId();
        this.messages = [];
        
        // Clear messages display
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
        
        // Update conversations list
        this.renderConversationsList();
        this.closeSidebar();
    }

    switchConversation(conversationId) {
        // Save current conversation
        this.saveConversationHistory();
        
        // Load selected conversation
        this.conversationId = conversationId;
        this.loadConversationHistory();
        
        // Update UI
        this.renderConversationsList();
        this.closeSidebar();
    }

    deleteConversation(conversationId, event) {
        event.stopPropagation();
        
        if (confirm('Are you sure you want to delete this conversation?')) {
            // Remove from storage
            const conversations = this.getStoredConversations();
            delete conversations[conversationId];
            localStorage.setItem('ai_chat_conversations', JSON.stringify(conversations));
            
            // If deleting current conversation, create new one
            if (conversationId === this.conversationId) {
                this.createNewChat();
            } else {
                // Just update the list
                this.renderConversationsList();
            }
        }
    }

    renderConversationsList() {
        this.conversationsList.innerHTML = '';
        
        const conversations = this.getStoredConversations();
        const sortedConversations = Object.values(conversations)
            .sort((a, b) => b.timestamp - a.timestamp);
        
        sortedConversations.forEach(conversation => {
            const conversationItem = document.createElement('div');
            conversationItem.className = `conversation-item ${conversation.id === this.conversationId ? 'active' : ''}`;
            conversationItem.addEventListener('click', () => this.switchConversation(conversation.id));
            
            const title = document.createElement('div');
            title.className = 'conversation-title';
            title.textContent = conversation.title || 'New Conversation';
            
            const date = document.createElement('div');
            date.className = 'conversation-date';
            date.textContent = this.formatDate(conversation.timestamp);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', (e) => this.deleteConversation(conversation.id, e));
            
            conversationItem.appendChild(title);
            conversationItem.appendChild(date);
            conversationItem.appendChild(deleteBtn);
            
            this.conversationsList.appendChild(conversationItem);
        });
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 24 * 60 * 60 * 1000) { // Less than 24 hours
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diff < 7 * 24 * 60 * 60 * 1000) { // Less than 7 days
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }

    loadAllConversations() {
        this.conversations = this.getStoredConversations();
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
        
        // Keep only last 20 conversations to prevent storage bloat
        const conversationIds = Object.keys(conversations);
        if (conversationIds.length > 20) {
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
        } else {
            this.messages = [];
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

    autoResizeTextarea() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = Math.min(this.userInput.scrollHeight, 200) + 'px';
    }

    // Enhanced message display function with better formatting
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
        
        // Create message text with enhanced formatting
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        
        // Enhanced formatting with better code detection and markdown
        const formattedContent = this.enhanceMessageFormatting(content);
        textDiv.innerHTML = formattedContent;
        
        // Assemble message
        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(textDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.messagesContainer.appendChild(messageDiv);
        
        this.scrollToBottom();
        
        // Add subtle animation for new messages
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        setTimeout(() => {
            messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    // Enhanced message formatting function
    enhanceMessageFormatting(content) {
        return content
            // Bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic text
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Code blocks (```code```)
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="code-block"><code class="language-$1">$2</code></pre>')
            // Inline code (`code`)
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
            // Headers (# Header)
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // Lists
            .replace(/^\* (.*$)/gm, '<li>$1</li>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            // Wrap lists in ul tags
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
            // Line breaks
            .replace(/\n/g, '<br>')
            // Links [text](url)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            // Clean up multiple line breaks
            .replace(/<br><br><br>/g, '<br><br>');
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isLoading) return;

        // Add user message to memory
        this.messages.push({ type: 'user', content: message, timestamp: Date.now() });
        this.displayMessage('user', message);
        this.saveConversationHistory();
        this.renderConversationsList(); // Update sidebar

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
            this.renderConversationsList(); // Update sidebar
        } catch (error) {
            this.hideTyping();
            const errorMessage = 'Sorry, I encountered an error. Please try again.';
            this.messages.push({ type: 'assistant', content: errorMessage, timestamp: Date.now() });
            this.displayMessage('assistant', errorMessage);
            this.saveConversationHistory();
            this.renderConversationsList(); // Update sidebar
            console.error('API Error:', error);
        }
    }

    async callAPI(message) {
        // Build enhanced context from recent messages (last 15 messages for better context)
        const recentMessages = this.messages.slice(-15);
        const context = recentMessages.map(msg => 
            `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');
        
        // Add conversation metadata for better AI understanding
        const conversationMetadata = `
Conversation Context:
- Total messages: ${this.messages.length}
- Current conversation ID: ${this.conversationId}
- User's message count: ${this.messages.filter(m => m.type === 'user').length}
- AI's response count: ${this.messages.filter(m => m.type === 'assistant').length}
        `.trim();
        
        const fullMessage = context ? 
            `${conversationMetadata}\n\nPrevious Conversation:\n${context}\n\nCurrent User Message: ${message}` : 
            `${conversationMetadata}\n\nUser Message: ${message}`;

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
            this.renderConversationsList();
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