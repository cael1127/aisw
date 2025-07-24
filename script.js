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
        
        // New elements for enhanced features
        this.fileInput = document.getElementById('fileInput');
        this.fileUploadBtn = document.getElementById('fileUpload');
        this.voiceBtn = document.getElementById('voiceBtn');
        this.voiceInputBtn = document.getElementById('voiceInput');
        this.imageGenBtn = document.getElementById('imageGen');
        this.inputStats = document.getElementById('inputStats');
        
        // Advanced features
        this.modelSelect = document.getElementById('modelSelect');
        this.codeExecBtn = document.getElementById('codeExec');
        this.settingsBtn = document.getElementById('settings');
        this.collabBtn = document.getElementById('collabBtn');
        this.codeBtn = document.getElementById('codeBtn');
        this.dataBtn = document.getElementById('dataBtn');
        this.aiStatus = document.getElementById('aiStatus');
        
        // Modal elements
        this.voiceModal = document.getElementById('voiceModal');
        this.imageModal = document.getElementById('imageModal');
        this.codeModal = document.getElementById('codeModal');
        this.settingsModal = document.getElementById('settingsModal');
        this.collabModal = document.getElementById('collabModal');
        
        // Voice elements
        this.closeVoiceModal = document.getElementById('closeVoiceModal');
        this.startVoiceBtn = document.getElementById('startVoice');
        this.stopVoiceBtn = document.getElementById('stopVoice');
        this.voiceStatus = document.getElementById('voiceStatus');
        this.voiceTranscript = document.getElementById('voiceTranscript');
        
        // Image elements
        this.closeImageModal = document.getElementById('closeImageModal');
        this.imagePrompt = document.getElementById('imagePrompt');
        this.imageStyle = document.getElementById('imageStyle');
        this.imageSize = document.getElementById('imageSize');
        this.generateImageBtn = document.getElementById('generateImage');
        this.imageResult = document.getElementById('imageResult');
        
        // Code execution elements
        this.closeCodeModal = document.getElementById('closeCodeModal');
        this.codeLanguage = document.getElementById('codeLanguage');
        this.codeInput = document.getElementById('codeInput');
        this.runCodeBtn = document.getElementById('runCode');
        this.formatCodeBtn = document.getElementById('formatCode');
        this.clearCodeBtn = document.getElementById('clearCode');
        this.outputContent = document.getElementById('outputContent');
        this.clearOutputBtn = document.getElementById('clearOutput');
        
        // Settings elements
        this.closeSettingsModal = document.getElementById('closeSettingsModal');
        this.defaultModel = document.getElementById('defaultModel');
        this.responseLength = document.getElementById('responseLength');
        this.creativityLevel = document.getElementById('creativityLevel');
        this.creativityValue = document.getElementById('creativityValue');
        this.themeSelect = document.getElementById('themeSelect');
        this.fontSize = document.getElementById('fontSize');
        this.autoSave = document.getElementById('autoSave');
        this.voiceEnabled = document.getElementById('voiceEnabled');
        this.codeExecution = document.getElementById('codeExecution');
        
        // Collaboration elements
        this.closeCollabModal = document.getElementById('closeCollabModal');
        this.createSessionBtn = document.getElementById('createSession');
        this.sessionCode = document.getElementById('sessionCode');
        this.joinSessionBtn = document.getElementById('joinSession');
        this.sessionsList = document.getElementById('sessionsList');
        
        // Voice recognition setup
        this.recognition = null;
        this.isRecording = false;
        this.setupVoiceRecognition();
        
        // Advanced features setup
        this.currentModel = 'gemini';
        this.settings = this.loadSettings();
        this.collaborationSessions = [];
        this.setupAdvancedFeatures();
    }

    setupAdvancedFeatures() {
        // Initialize settings
        this.applySettings();
        
        // Setup AI status
        this.updateAIStatus();
        
        // Setup collaboration
        this.setupCollaboration();
        
        // Setup code execution
        this.setupCodeExecution();
    }

    loadSettings() {
        const defaultSettings = {
            defaultModel: 'gemini',
            responseLength: 'medium',
            creativityLevel: 70,
            theme: 'dark',
            fontSize: 'medium',
            autoSave: true,
            voiceEnabled: true,
            codeExecution: true
        };
        
        const saved = localStorage.getItem('aiChatSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('aiChatSettings', JSON.stringify(this.settings));
    }

    applySettings() {
        // Apply theme
        document.body.className = this.settings.theme;
        
        // Apply font size
        document.body.style.fontSize = this.settings.fontSize === 'small' ? '14px' : 
                                     this.settings.fontSize === 'large' ? '18px' : '16px';
        
        // Update UI elements
        if (this.defaultModel) this.defaultModel.value = this.settings.defaultModel;
        if (this.responseLength) this.responseLength.value = this.settings.responseLength;
        if (this.creativityLevel) this.creativityLevel.value = this.settings.creativityLevel;
        if (this.creativityValue) this.creativityValue.textContent = this.settings.creativityLevel + '%';
        if (this.themeSelect) this.themeSelect.value = this.settings.theme;
        if (this.fontSize) this.fontSize.value = this.settings.fontSize;
        if (this.autoSave) this.autoSave.checked = this.settings.autoSave;
        if (this.voiceEnabled) this.voiceEnabled.checked = this.settings.voiceEnabled;
        if (this.codeExecution) this.codeExecution.checked = this.settings.codeExecution;
    }

    updateAIStatus() {
        if (this.aiStatus) {
            this.aiStatus.style.background = '#19c37d';
            this.aiStatus.style.animation = 'pulse 2s infinite';
        }
    }

    setupCollaboration() {
        // Simulate real-time collaboration
        this.collaborationSessions = [
            { id: 'session1', name: 'Project Alpha', participants: 3, lastActive: Date.now() - 300000 },
            { id: 'session2', name: 'Code Review', participants: 2, lastActive: Date.now() - 600000 }
        ];
        this.updateSessionsList();
    }

    updateSessionsList() {
        if (this.sessionsList) {
            if (this.collaborationSessions.length === 0) {
                this.sessionsList.innerHTML = '<p class="no-sessions">No active sessions</p>';
            } else {
                this.sessionsList.innerHTML = this.collaborationSessions.map(session => `
                    <div class="session-item">
                        <div class="session-info">
                            <div class="session-name">${session.name}</div>
                            <div class="session-details">${session.participants} participants</div>
                        </div>
                        <button class="join-session-btn" onclick="chatApp.joinSession('${session.id}')">
                            Join
                        </button>
                    </div>
                `).join('');
            }
        }
    }

    setupCodeExecution() {
        // Setup code execution environment
        this.codeSandbox = {
            javascript: (code) => {
                try {
                    const result = eval(code);
                    return { success: true, result: result };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },
            html: (code) => {
                return { success: true, result: code };
            },
            css: (code) => {
                return { success: true, result: code };
            },
            python: (code) => {
                // Simulate Python execution
                return { success: true, result: 'Python execution simulated: ' + code };
            },
            sql: (code) => {
                // Simulate SQL execution
                return { success: true, result: 'SQL query executed: ' + code };
            },
            bash: (code) => {
                // Simulate bash execution
                return { success: true, result: 'Bash command executed: ' + code };
            }
        };
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
            this.updateInputStats();
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

        // Model selection
        if (this.modelSelect) {
            this.modelSelect.addEventListener('change', (e) => {
                this.currentModel = e.target.value;
                this.updateModelDisplay();
            });
        }

        // Advanced feature buttons
        if (this.codeExecBtn) {
            this.codeExecBtn.addEventListener('click', () => this.openCodeModal());
        }
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', () => this.openSettingsModal());
        }
        if (this.collabBtn) {
            this.collabBtn.addEventListener('click', () => this.openCollabModal());
        }
        if (this.codeBtn) {
            this.codeBtn.addEventListener('click', () => this.openCodeModal());
        }
        if (this.dataBtn) {
            this.dataBtn.addEventListener('click', () => this.openDataAnalysis());
        }

        // File upload functionality
        if (this.fileUploadBtn) {
            this.fileUploadBtn.addEventListener('click', () => this.fileInput.click());
        }
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Voice input functionality
        if (this.voiceBtn) {
            this.voiceBtn.addEventListener('click', () => this.openVoiceModal());
        }
        if (this.voiceInputBtn) {
            this.voiceInputBtn.addEventListener('click', () => this.openVoiceModal());
        }

        // Image generation functionality
        if (this.imageGenBtn) {
            this.imageGenBtn.addEventListener('click', () => this.openImageModal());
        }

        // Modal controls
        this.setupModalControls();

        // Code execution controls
        this.setupCodeControls();

        // Settings controls
        this.setupSettingsControls();

        // Collaboration controls
        this.setupCollaborationControls();

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !this.sidebar.contains(e.target) && 
                !this.sidebarToggle.contains(e.target)) {
                this.closeSidebar();
            }
        });

        // Drag and drop for files
        this.setupDragAndDrop();
    }

    setupModalControls() {
        const modals = [
            { modal: this.voiceModal, close: this.closeVoiceModal },
            { modal: this.imageModal, close: this.closeImageModal },
            { modal: this.codeModal, close: this.closeCodeModal },
            { modal: this.settingsModal, close: this.closeSettingsModal },
            { modal: this.collabModal, close: this.closeCollabModal }
        ];

        modals.forEach(({ modal, close }) => {
            if (close) {
                close.addEventListener('click', () => this.closeModal(modal));
            }
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
    }

    setupCodeControls() {
        if (this.runCodeBtn) {
            this.runCodeBtn.addEventListener('click', () => this.executeCode());
        }
        if (this.formatCodeBtn) {
            this.formatCodeBtn.addEventListener('click', () => this.formatCode());
        }
        if (this.clearCodeBtn) {
            this.clearCodeBtn.addEventListener('click', () => this.clearCode());
        }
        if (this.clearOutputBtn) {
            this.clearOutputBtn.addEventListener('click', () => this.clearOutput());
        }
    }

    setupSettingsControls() {
        const settingsElements = [
            { element: this.defaultModel, setting: 'defaultModel' },
            { element: this.responseLength, setting: 'responseLength' },
            { element: this.themeSelect, setting: 'theme' },
            { element: this.fontSize, setting: 'fontSize' },
            { element: this.autoSave, setting: 'autoSave', type: 'checkbox' },
            { element: this.voiceEnabled, setting: 'voiceEnabled', type: 'checkbox' },
            { element: this.codeExecution, setting: 'codeExecution', type: 'checkbox' }
        ];

        settingsElements.forEach(({ element, setting, type }) => {
            if (element) {
                element.addEventListener('change', (e) => {
                    if (type === 'checkbox') {
                        this.settings[setting] = e.target.checked;
                    } else {
                        this.settings[setting] = e.target.value;
                    }
                    this.saveSettings();
                    this.applySettings();
                });
            }
        });

        if (this.creativityLevel) {
            this.creativityLevel.addEventListener('input', (e) => {
                this.settings.creativityLevel = parseInt(e.target.value);
                this.creativityValue.textContent = e.target.value + '%';
                this.saveSettings();
            });
        }
    }

    setupCollaborationControls() {
        if (this.createSessionBtn) {
            this.createSessionBtn.addEventListener('click', () => this.createCollaborationSession());
        }
        if (this.joinSessionBtn) {
            this.joinSessionBtn.addEventListener('click', () => this.joinCollaborationSession());
        }
    }

    openCodeModal() {
        this.codeModal.classList.add('show');
        this.codeInput.focus();
    }

    closeCodeModal() {
        this.codeModal.classList.remove('show');
    }

    openSettingsModal() {
        this.settingsModal.classList.add('show');
    }

    closeSettingsModal() {
        this.settingsModal.classList.remove('show');
    }

    openCollabModal() {
        this.collabModal.classList.add('show');
        this.updateSessionsList();
    }

    closeCollabModal() {
        this.collabModal.classList.remove('show');
    }

    closeModal(modal) {
        modal.classList.remove('show');
    }

    closeAllModals() {
        const modals = [this.voiceModal, this.imageModal, this.codeModal, this.settingsModal, this.collabModal];
        modals.forEach(modal => {
            if (modal) modal.classList.remove('show');
        });
        this.stopRecording();
    }

    executeCode() {
        const code = this.codeInput.value.trim();
        const language = this.codeLanguage.value;
        
        if (!code) {
            alert('Please enter some code to execute.');
            return;
        }
        
        this.runCodeBtn.disabled = true;
        this.runCodeBtn.innerHTML = '<span class="loading"></span> Running...';
        
        setTimeout(() => {
            const result = this.codeSandbox[language](code);
            
            const output = result.success ? 
                `✅ Execution successful:\n${result.result}` : 
                `❌ Execution failed:\n${result.error}`;
            
            this.outputContent.textContent = output;
            this.runCodeBtn.disabled = false;
            this.runCodeBtn.innerHTML = '<i class="fas fa-play"></i> Run Code';
        }, 1000);
    }

    formatCode() {
        const code = this.codeInput.value.trim();
        if (!code) return;
        
        // Simple code formatting (in a real app, you'd use a proper formatter)
        const formatted = code
            .replace(/\s+/g, ' ')
            .replace(/\s*{\s*/g, ' {\n    ')
            .replace(/\s*}\s*/g, '\n}\n')
            .replace(/\s*;\s*/g, ';\n    ');
        
        this.codeInput.value = formatted;
    }

    clearCode() {
        this.codeInput.value = '';
    }

    clearOutput() {
        this.outputContent.textContent = '';
    }

    createCollaborationSession() {
        const sessionId = 'session_' + Date.now();
        const sessionName = 'Session ' + (this.collaborationSessions.length + 1);
        
        this.collaborationSessions.push({
            id: sessionId,
            name: sessionName,
            participants: 1,
            lastActive: Date.now()
        });
        
        this.updateSessionsList();
        alert(`Session created! Session ID: ${sessionId}`);
    }

    joinCollaborationSession() {
        const sessionCode = this.sessionCode.value.trim();
        if (!sessionCode) {
            alert('Please enter a session code.');
            return;
        }
        
        // Simulate joining a session
        alert(`Joined session: ${sessionCode}`);
        this.closeCollabModal();
    }

    joinSession(sessionId) {
        alert(`Joining session: ${sessionId}`);
        this.closeCollabModal();
    }

    openDataAnalysis() {
        // Simulate data analysis feature
        const dataPrompt = "Please analyze the following data and provide insights:\n\n";
        this.userInput.value = dataPrompt;
        this.userInput.focus();
    }

    updateModelDisplay() {
        const modelNames = {
            'gemini': 'Gemini 1.5 Flash',
            'gpt4': 'GPT-4',
            'claude': 'Claude',
            'custom': 'Custom Model'
        };
        
        // Update any UI elements that show the current model
        console.log(`Switched to: ${modelNames[this.currentModel]}`);
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isRecording = true;
                this.startVoiceBtn.classList.add('recording');
                this.stopVoiceBtn.disabled = false;
                this.startVoiceBtn.disabled = true;
                this.voiceStatus.innerHTML = '<i class="fas fa-microphone"></i><p>Listening...</p>';
            };
            
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                this.voiceTranscript.textContent = finalTranscript + interimTranscript;
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopRecording();
            };
            
            this.recognition.onend = () => {
                this.stopRecording();
            };
        }
    }

    stopRecording() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.isRecording = false;
        this.startVoiceBtn.classList.remove('recording');
        this.stopVoiceBtn.disabled = true;
        this.startVoiceBtn.disabled = false;
        this.voiceStatus.innerHTML = '<i class="fas fa-microphone-slash"></i><p>Click the microphone to start recording</p>';
    }

    // Enhanced message display with timestamps
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
        
        // Create message header with timestamp
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        
        const authorSpan = document.createElement('span');
        authorSpan.className = 'message-author';
        authorSpan.textContent = type === 'user' ? 'You' : 'AI Assistant';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = new Date().toLocaleTimeString();
        
        headerDiv.appendChild(authorSpan);
        headerDiv.appendChild(timeSpan);
        
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
        
        if (shouldSave) {
            this.messages.push({ type, content, timestamp: Date.now() });
        }
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

    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert(`File ${file.name} is too large. Maximum size is 10MB.`);
                return;
            }
            
            this.processFile(file);
        });
    }

    handleFileUpload(event) {
        const files = event.target.files;
        this.handleFiles(files);
        event.target.value = ''; // Reset input
    }

    processFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const fileInfo = `📁 **File Uploaded:** ${file.name} (${this.formatFileSize(file.size)})\n\n`;
            
            // Add file content to input
            this.userInput.value = fileInfo + content;
            this.autoResizeTextarea();
            this.updateInputStats();
            
            // Show file preview
            this.showFilePreview(file);
        };
        
        if (file.type.startsWith('text/') || file.type === 'application/pdf') {
            reader.readAsText(file);
        } else if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showFilePreview(file) {
        const preview = document.createElement('div');
        preview.className = 'file-preview';
        preview.innerHTML = `
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${this.formatFileSize(file.size)}</div>
            </div>
            <button class="remove-file" onclick="this.parentElement.remove()">×</button>
        `;
        
        // Insert before input field
        this.userInput.parentElement.parentElement.insertBefore(preview, this.userInput.parentElement);
    }

    updateInputStats() {
        const text = this.userInput.value;
        const charCount = text.length;
        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        
        this.inputStats.textContent = `${charCount} characters, ${wordCount} words`;
    }

    openVoiceModal() {
        this.voiceModal.classList.add('show');
        this.voiceTranscript.textContent = '';
    }

    closeVoiceModal() {
        this.voiceModal.classList.remove('show');
        this.stopRecording();
    }

    openImageModal() {
        this.imageModal.classList.add('show');
    }

    closeImageModal() {
        this.imageModal.classList.remove('show');
    }

    startVoiceRecording() {
        if (this.recognition) {
            this.recognition.start();
        } else {
            alert('Speech recognition is not supported in your browser.');
        }
    }

    stopVoiceRecording() {
        this.stopRecording();
        const transcript = this.voiceTranscript.textContent;
        if (transcript.trim()) {
            this.userInput.value = transcript;
            this.autoResizeTextarea();
            this.updateInputStats();
            this.closeVoiceModal();
        }
    }

    async generateImage() {
        const prompt = this.imagePrompt.value.trim();
        const style = this.imageStyle.value;
        const size = this.imageSize.value;
        
        if (!prompt) {
            alert('Please enter a description for the image.');
            return;
        }
        
        this.generateImageBtn.disabled = true;
        this.generateImageBtn.innerHTML = '<span class="loading"></span> Generating...';
        
        try {
            // This would integrate with an image generation API
            // For now, we'll simulate the process
            await this.simulateImageGeneration(prompt, style, size);
        } catch (error) {
            console.error('Image generation error:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            this.generateImageBtn.disabled = false;
            this.generateImageBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Image';
        }
    }

    async simulateImageGeneration(prompt, style, size) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // For demo purposes, show a placeholder
        this.imageResult.innerHTML = `
            <div style="color: #8e8ea0; padding: 2rem;">
                <i class="fas fa-image" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p><strong>Generated Image:</strong></p>
                <p>Prompt: "${prompt}"</p>
                <p>Style: ${style}</p>
                <p>Size: ${size}</p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">
                    This is a simulation. In a real implementation, this would show the actual generated image.
                </p>
            </div>
        `;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
}); 