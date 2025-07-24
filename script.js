class AIChat {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.initializeEventListeners();
        this.loadSettings();
        this.startSessionTimer();
        this.checkConnection();
        this.initializeAnimations();
    }

    initializeElements() {
        // Core elements
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.temperatureSlider = document.getElementById('temperature');
        this.tempValue = document.getElementById('tempValue');
        this.modelType = document.getElementById('modelType');
        this.modelSelect = document.getElementById('modelSelect');
        this.maxLength = document.getElementById('maxLength');
        this.apiEndpoint = document.getElementById('apiEndpoint');
        this.apiKey = document.getElementById('apiKey');
        this.charCount = document.getElementById('charCount');
        this.voiceInput = document.getElementById('voiceInput');
        this.modelBadge = document.getElementById('modelBadge');
        
        // Status and actions
        this.connectionStatus = document.getElementById('connectionStatus');
        this.clearChat = document.getElementById('clearChat');
        this.exportChat = document.getElementById('exportChat');
        this.shareChat = document.getElementById('shareChat');
        
        // Statistics
        this.messageCount = document.getElementById('messageCount');
        this.wordCount = document.getElementById('wordCount');
        this.sessionTime = document.getElementById('sessionTime');
        
        // Modals
        this.settingsModal = document.getElementById('settingsModal');
        this.shareModal = document.getElementById('shareModal');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.toastContainer = document.getElementById('toastContainer');
        
        // Theme and settings
        this.themeToggle = document.getElementById('themeToggle');
        this.settingsToggle = document.getElementById('settingsToggle');
    }

    initializeState() {
        this.isLoading = false;
        this.isRecording = false;
        this.messages = [];
        this.sessionStartTime = Date.now();
        this.stats = {
            messageCount: 0,
            wordCount: 0,
            totalTokens: 0
        };
        
        // Default settings
        this.settings = {
            modelType: 'deepseek',
            apiEndpoint: 'http://localhost:8000/v1/chat/completions',
            model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
            temperature: 0.6,
            maxLength: 32768,
            apiKey: '',
            theme: 'light',
            autoScroll: true,
            soundEnabled: false
        };

        // Model configurations
        this.modelConfigs = {
            deepseek: {
                endpoint: 'http://localhost:8000/v1/chat/completions',
                models: [
                    'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
                    'deepseek-ai/DeepSeek-R1-Distill-Llama-32B'
                ],
                defaultModel: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
                temperatureRange: { min: 0.5, max: 0.7, default: 0.6 }
            },
            qwen: {
                endpoint: 'https://api.deepseek.com/v1/chat/completions',
                models: [
                    'qwen2.5-72b-instruct',
                    'qwen2.5-32b-instruct',
                    'qwen2.5-14b-instruct',
                    'qwen2.5-7b-instruct',
                    'qwen2-72b-instruct',
                    'qwen2-32b-instruct',
                    'qwen2-14b-instruct',
                    'qwen2-7b-instruct'
                ],
                defaultModel: 'qwen2.5-72b-instruct',
                temperatureRange: { min: 0.1, max: 1.0, default: 0.7 },
                apiKey: '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'
            }
        };
    }

    initializeAnimations() {
        // Add entrance animations
        this.animateElementsOnLoad();
        
        // Add scroll animations
        this.initializeScrollAnimations();
        
        // Add hover effects
        this.initializeHoverEffects();
    }

    animateElementsOnLoad() {
        const elements = [
            '.header-main',
            '.header-actions',
            '.chat-container',
            '.sidebar'
        ];

        elements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }

    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.message, .quick-prompt, .stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    initializeHoverEffects() {
        // Add hover effects to interactive elements
        const hoverElements = document.querySelectorAll('.action-button, .quick-prompt, .stat-item');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    initializeEventListeners() {
        // Core functionality
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Input handling with enhanced UX
        this.userInput.addEventListener('input', () => {
            this.updateCharCount();
            this.animateInputField();
        });

        this.temperatureSlider.addEventListener('input', () => {
            this.updateTemperatureDisplay();
            this.animateTemperatureSlider();
        });

        this.modelType.addEventListener('change', () => this.switchModelType());
        this.modelSelect.addEventListener('change', () => this.updateModelBadge());

        // Voice input with enhanced feedback
        this.voiceInput.addEventListener('click', () => this.toggleVoiceInput());

        // Quick prompts with animations
        document.querySelectorAll('.quick-prompt').forEach(button => {
            button.addEventListener('click', (e) => {
                this.animateQuickPrompt(e.target);
                const prompt = button.getAttribute('data-prompt');
                this.userInput.value = prompt;
                this.userInput.focus();
            });
        });

        // Chat actions with enhanced feedback
        this.clearChat.addEventListener('click', () => this.clearChatHistory());
        this.exportChat.addEventListener('click', () => this.exportChatHistory());
        this.shareChat.addEventListener('click', () => this.showShareModal());

        // Theme and settings with smooth transitions
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.settingsToggle.addEventListener('click', () => this.showSettingsModal());

        // Modal controls with enhanced UX
        document.getElementById('closeSettings').addEventListener('click', () => this.hideSettingsModal());
        document.getElementById('closeShare').addEventListener('click', () => this.hideShareModal());

        // Settings form with real-time updates
        this.initializeSettingsForm();

        // Share options with animations
        document.querySelectorAll('.share-option').forEach(button => {
            button.addEventListener('click', (e) => {
                this.animateShareOption(e.target);
                const method = button.getAttribute('data-method');
                this.handleShare(method);
            });
        });

        // Auto-focus input with smooth transition
        setTimeout(() => {
            this.userInput.focus();
            this.animateInputFocus();
        }, 1000);
    }

    animateInputField() {
        const input = this.userInput;
        input.style.transform = 'scale(1.01)';
        setTimeout(() => {
            input.style.transform = 'scale(1)';
        }, 150);
    }

    animateTemperatureSlider() {
        const slider = this.temperatureSlider;
        slider.style.transform = 'scale(1.05)';
        setTimeout(() => {
            slider.style.transform = 'scale(1)';
        }, 200);
    }

    animateQuickPrompt(button) {
        button.style.transform = 'scale(0.95)';
        button.style.background = 'var(--success-gradient)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.background = '';
        }, 300);
    }

    animateShareOption(button) {
        button.style.transform = 'scale(0.95) rotate(5deg)';
        setTimeout(() => {
            button.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    }

    animateInputFocus() {
        const input = this.userInput;
        input.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
        setTimeout(() => {
            input.style.boxShadow = '';
        }, 1000);
    }

    initializeSettingsForm() {
        const settingsModelType = document.getElementById('settingsModelType');
        const settingsApiEndpoint = document.getElementById('settingsApiEndpoint');
        const settingsApiKey = document.getElementById('settingsApiKey');
        const autoScroll = document.getElementById('autoScroll');
        const soundEnabled = document.getElementById('soundEnabled');

        // Load current settings
        settingsModelType.value = this.settings.modelType;
        settingsApiEndpoint.value = this.settings.apiEndpoint;
        settingsApiKey.value = this.settings.apiKey;
        autoScroll.checked = this.settings.autoScroll;
        soundEnabled.checked = this.settings.soundEnabled;

        // Save settings on change with enhanced feedback
        settingsModelType.addEventListener('change', () => {
            this.settings.modelType = settingsModelType.value;
            this.switchModelType();
            this.saveSettings();
            this.showToast('Model type updated', 'success');
        });

        settingsApiEndpoint.addEventListener('change', () => {
            this.settings.apiEndpoint = settingsApiEndpoint.value;
            this.saveSettings();
            this.showToast('API endpoint updated', 'success');
        });

        settingsApiKey.addEventListener('change', () => {
            this.settings.apiKey = settingsApiKey.value;
            this.saveSettings();
            this.showToast('API key updated', 'success');
        });

        autoScroll.addEventListener('change', () => {
            this.settings.autoScroll = autoScroll.checked;
            this.saveSettings();
            this.showToast(`Auto-scroll ${autoScroll.checked ? 'enabled' : 'disabled'}`, 'info');
        });

        soundEnabled.addEventListener('change', () => {
            this.settings.soundEnabled = soundEnabled.checked;
            this.saveSettings();
            this.showToast(`Sound notifications ${soundEnabled.checked ? 'enabled' : 'disabled'}`, 'info');
        });

        // Settings actions with enhanced feedback
        document.getElementById('exportSettings').addEventListener('click', () => this.exportSettings());
        document.getElementById('importSettings').addEventListener('click', () => this.importSettings());
        document.getElementById('clearData').addEventListener('click', () => this.clearAllData());
    }

    switchModelType() {
        const modelType = this.settings.modelType;
        const config = this.modelConfigs[modelType];
        
        // Animate model switching
        this.animateModelSwitch();
        
        // Update API endpoint
        this.apiEndpoint.value = config.endpoint;
        this.settings.apiEndpoint = config.endpoint;
        
        // Update model options with animation
        this.animateModelOptions(config);
        
        // Update model setting
        this.settings.model = config.defaultModel;
        
        // Update temperature range with animation
        this.animateTemperatureRange(config.temperatureRange);
        
        // Update API key for Qwen
        if (modelType === 'qwen') {
            this.apiKey.value = config.apiKey;
            this.settings.apiKey = config.apiKey;
        }
        
        // Update UI
        this.updateTemperatureDisplay();
        this.updateModelBadge();
        
        this.showToast(`Switched to ${modelType.toUpperCase()} models`, 'success');
    }

    animateModelSwitch() {
        const modelSelect = this.modelSelect;
        modelSelect.style.transform = 'scale(0.95)';
        modelSelect.style.opacity = '0.7';
        
        setTimeout(() => {
            modelSelect.style.transform = 'scale(1)';
            modelSelect.style.opacity = '1';
        }, 300);
    }

    animateModelOptions(config) {
        const modelSelect = this.modelSelect;
        modelSelect.innerHTML = '';
        
        config.models.forEach((model, index) => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            if (model === config.defaultModel) {
                option.selected = true;
            }
            modelSelect.appendChild(option);
            
            // Animate each option appearance
            setTimeout(() => {
                option.style.opacity = '0';
                option.style.transform = 'translateY(-10px)';
                option.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    option.style.opacity = '1';
                    option.style.transform = 'translateY(0)';
                }, 50);
            }, index * 50);
        });
    }

    animateTemperatureRange(range) {
        const slider = this.temperatureSlider;
        slider.min = range.min;
        slider.max = range.max;
        slider.value = range.default;
        this.settings.temperature = range.default;
        
        // Animate slider change
        slider.style.transform = 'scale(1.1)';
        setTimeout(() => {
            slider.style.transform = 'scale(1)';
        }, 200);
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isLoading) return;

        // Add user message to chat with animation
        this.addMessage(message, 'user');
        this.userInput.value = '';
        this.updateCharCount();
        
        // Show enhanced loading indicator
        this.showEnhancedLoadingIndicator();
        this.setLoadingState(true);

        try {
            const requestBody = this.prepareRequest(message);
            const headers = this.prepareHeaders();
            
            const response = await fetch(this.settings.apiEndpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;
            
            // Remove loading indicator and add assistant response with animation
            this.hideEnhancedLoadingIndicator();
            this.addMessage(assistantMessage, 'assistant');

            // Update connection status with animation
            this.updateConnectionStatus('connected');

            // Play success sound if enabled
            if (this.settings.soundEnabled) {
                this.playNotificationSound('success');
            }

        } catch (error) {
            console.error('Error sending message:', error);
            this.hideEnhancedLoadingIndicator();
            this.addErrorMessage('Sorry, I encountered an error. Please check your API connection and try again.');
            this.updateConnectionStatus('error');
            
            // Play error sound if enabled
            if (this.settings.soundEnabled) {
                this.playNotificationSound('error');
            }
        } finally {
            this.setLoadingState(false);
        }
    }

    prepareRequest(message) {
        const isDeepSeek = this.settings.modelType === 'deepseek';
        
        const requestBody = {
            model: this.settings.model,
            messages: [
                {
                    role: "user",
                    content: isDeepSeek ? this.formatDeepSeekPrompt(message) : message
                }
            ],
            temperature: this.settings.temperature,
            max_tokens: this.settings.maxLength,
            stream: false
        };

        // Add system message for Qwen models
        if (!isDeepSeek) {
            requestBody.messages.unshift({
                role: "system",
                content: "You are a helpful AI assistant. Please provide clear, step-by-step explanations when appropriate."
            });
        }

        return requestBody;
    }

    prepareHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.settings.apiKey) {
            headers['Authorization'] = `Bearer ${this.settings.apiKey}`;
        }

        return headers;
    }

    formatDeepSeekPrompt(message) {
        // Following DeepSeek-R1-Distill guidelines
        let formattedMessage = message;
        
        // Check if it's a math problem
        const mathKeywords = ['solve', 'calculate', 'compute', 'find', 'what is', 'equation', 'percentage', 'percent', 'math', 'mathematical'];
        const isMathProblem = mathKeywords.some(keyword => 
            message.toLowerCase().includes(keyword)
        );
        
        if (isMathProblem) {
            formattedMessage = `Please reason step by step, and put your final answer within \\boxed{}.\n\n${message}`;
        }
        
        // Force thinking pattern for DeepSeek
        formattedMessage = `<think>\n${formattedMessage}`;
        
        return formattedMessage;
    }

    addMessage(content, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const icon = role === 'user' ? 'fas fa-user' : 'fas fa-robot';
        const messageContent = `
            <div class="message-content">
                <i class="${icon}"></i>
                <div class="message-text">${this.formatMessageContent(content)}</div>
            </div>
        `;
        
        messageDiv.innerHTML = messageContent;
        
        // Add entrance animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        this.chatMessages.appendChild(messageDiv);
        
        // Trigger animation
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 50);
        
        // Update statistics with animation
        this.updateStatistics(content, role);
        
        // Auto-scroll if enabled with smooth animation
        if (this.settings.autoScroll) {
            this.smoothScrollToBottom();
        }
    }

    addErrorMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message error';
        
        const messageContent = `
            <div class="message-content">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="message-text">${content}</div>
            </div>
        `;
        
        messageDiv.innerHTML = messageContent;
        
        // Add error animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(-20px)';
        
        this.chatMessages.appendChild(messageDiv);
        
        // Trigger error animation
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateX(0)';
        }, 50);
        
        this.scrollToBottom();
    }

    formatMessageContent(content) {
        return content
            .replace(/\n/g, '<br>')
            .replace(/\\boxed\{([^}]+)\}/g, '<span class="math-answer">\\boxed{$1}</span>')
            .replace(/<think>\n?/g, '<div class="thinking-prompt"><strong>Thinking:</strong></div>')
            .replace(/<\/think>/g, '');
    }

    updateStatistics(content, role) {
        this.stats.messageCount++;
        this.stats.wordCount += content.split(/\s+/).length;
        
        // Animate statistics update
        this.animateStatisticUpdate('messageCount', this.stats.messageCount);
        this.animateStatisticUpdate('wordCount', this.stats.wordCount);
        
        // Store message for export
        this.messages.push({
            role,
            content,
            timestamp: new Date().toISOString(),
            model: this.settings.model
        });
    }

    animateStatisticUpdate(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const oldValue = parseInt(element.textContent) || 0;
        const increment = (newValue - oldValue) / 10;
        let currentValue = oldValue;
        
        const animation = setInterval(() => {
            currentValue += increment;
            if ((increment > 0 && currentValue >= newValue) || 
                (increment < 0 && currentValue <= newValue)) {
                element.textContent = newValue;
                clearInterval(animation);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, 50);
    }

    updateCharCount() {
        const count = this.userInput.value.length;
        this.charCount.textContent = `${count}/4000`;
        
        // Animate character count color change
        if (count > 3500) {
            this.charCount.style.color = 'var(--error-color)';
            this.charCount.style.transform = 'scale(1.1)';
        } else if (count > 3000) {
            this.charCount.style.color = 'var(--warning-color)';
            this.charCount.style.transform = 'scale(1.05)';
        } else {
            this.charCount.style.color = 'var(--text-muted)';
            this.charCount.style.transform = 'scale(1)';
        }
        
        setTimeout(() => {
            this.charCount.style.transform = 'scale(1)';
        }, 200);
    }

    updateTemperatureDisplay() {
        const temp = this.temperatureSlider.value;
        this.tempValue.textContent = temp;
        this.settings.temperature = parseFloat(temp);
        this.saveSettings();
        
        // Animate temperature display
        this.tempValue.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.tempValue.style.transform = 'scale(1)';
        }, 200);
    }

    updateModelBadge() {
        const selectedModel = this.modelSelect.value;
        this.modelBadge.textContent = selectedModel.split('/').pop() || selectedModel;
        this.settings.model = selectedModel;
        this.saveSettings();
        
        // Animate model badge
        this.modelBadge.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
            this.modelBadge.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }

    updateConnectionStatus(status) {
        const statusElement = this.connectionStatus;
        statusElement.className = `status-indicator ${status}`;
        
        // Animate status change
        statusElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            statusElement.style.transform = 'scale(1)';
        }, 200);
        
        switch (status) {
            case 'connected':
                statusElement.innerHTML = '<i class="fas fa-circle"></i> Connected';
                break;
            case 'error':
                statusElement.innerHTML = '<i class="fas fa-circle"></i> Connection Error';
                break;
            default:
                statusElement.innerHTML = '<i class="fas fa-circle"></i> Connecting...';
        }
    }

    async checkConnection() {
        try {
            const endpoint = this.settings.apiEndpoint;
            const testUrl = endpoint.includes('deepseek.com') 
                ? 'https://api.deepseek.com/v1/models'
                : endpoint.replace('/chat/completions', '/models');
            
            const response = await fetch(testUrl, {
                headers: this.settings.apiKey ? { 'Authorization': `Bearer ${this.settings.apiKey}` } : {}
            });
            
            if (response.ok) {
                this.updateConnectionStatus('connected');
            } else {
                this.updateConnectionStatus('error');
            }
        } catch (error) {
            this.updateConnectionStatus('error');
        }
    }

    // Enhanced Voice Input
    async toggleVoiceInput() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showToast('Voice input is not supported in this browser', 'error');
            return;
        }

        if (this.isRecording) {
            this.stopVoiceRecording();
        } else {
            this.startVoiceRecording();
        }
    }

    startVoiceRecording() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isRecording = true;
            this.voiceInput.classList.add('recording');
            this.voiceInput.innerHTML = '<i class="fas fa-stop"></i>';
            
            // Animate recording state
            this.voiceInput.style.animation = 'pulse 1s ease-in-out infinite';
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.userInput.value = transcript;
            this.updateCharCount();
            
            // Animate successful transcription
            this.animateSuccessfulTranscription();
        };

        this.recognition.onerror = (event) => {
            this.showToast('Voice recognition error: ' + event.error, 'error');
            this.stopVoiceRecording();
        };

        this.recognition.onend = () => {
            this.stopVoiceRecording();
        };

        this.recognition.start();
    }

    stopVoiceRecording() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.isRecording = false;
        this.voiceInput.classList.remove('recording');
        this.voiceInput.innerHTML = '<i class="fas fa-microphone"></i>';
        this.voiceInput.style.animation = '';
    }

    animateSuccessfulTranscription() {
        const input = this.userInput;
        input.style.transform = 'scale(1.02)';
        input.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.3)';
        
        setTimeout(() => {
            input.style.transform = 'scale(1)';
            input.style.boxShadow = '';
        }, 500);
    }

    // Enhanced Theme Management
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Animate theme transition
        document.body.style.transition = 'all 0.3s ease';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.settings.theme = newTheme;
        this.saveSettings();
        
        // Update theme toggle icon with animation
        this.themeToggle.style.transform = 'rotate(180deg)';
        this.themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        setTimeout(() => {
            this.themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
        
        this.showToast(`Switched to ${newTheme} theme`, 'success');
    }

    // Enhanced Settings Management
    showSettingsModal() {
        this.settingsModal.classList.add('show');
        this.animateModalEntrance(this.settingsModal);
    }

    hideSettingsModal() {
        this.animateModalExit(this.settingsModal, () => {
            this.settingsModal.classList.remove('show');
        });
    }

    showShareModal() {
        this.shareModal.classList.add('show');
        this.animateModalEntrance(this.shareModal);
    }

    hideShareModal() {
        this.animateModalExit(this.shareModal, () => {
            this.shareModal.classList.remove('show');
        });
    }

    animateModalEntrance(modal) {
        const content = modal.querySelector('.modal-content');
        content.style.transform = 'scale(0.8) translateY(-50px)';
        content.style.opacity = '0';
        
        setTimeout(() => {
            content.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            content.style.transform = 'scale(1) translateY(0)';
            content.style.opacity = '1';
        }, 50);
    }

    animateModalExit(modal, callback) {
        const content = modal.querySelector('.modal-content');
        content.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        content.style.transform = 'scale(0.8) translateY(-50px)';
        content.style.opacity = '0';
        
        setTimeout(callback, 300);
    }

    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ai-chat-settings.json';
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Settings exported successfully', 'success');
    }

    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const importedSettings = JSON.parse(event.target.result);
                    this.settings = { ...this.settings, ...importedSettings };
                    this.saveSettings();
                    this.loadSettings();
                    this.showToast('Settings imported successfully', 'success');
                } catch (error) {
                    this.showToast('Invalid settings file', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    }

    // Enhanced Chat Management
    clearChatHistory() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            // Animate chat clearing
            this.animateChatClearing();
            
            setTimeout(() => {
                this.chatMessages.innerHTML = `
                    <div class="message system-message">
                        <div class="message-content">
                            <i class="fas fa-info-circle"></i>
                            <div class="message-text">
                                <p><strong>Chat cleared!</strong></p>
                                <p>I'm ready for a new conversation.</p>
                            </div>
                        </div>
                    </div>
                `;
                
                this.messages = [];
                this.stats.messageCount = 0;
                this.stats.wordCount = 0;
                this.updateStatistics();
                this.showToast('Chat history cleared', 'success');
            }, 300);
        }
    }

    animateChatClearing() {
        const messages = this.chatMessages.querySelectorAll('.message');
        messages.forEach((message, index) => {
            setTimeout(() => {
                message.style.transition = 'all 0.3s ease';
                message.style.opacity = '0';
                message.style.transform = 'translateX(-100px)';
            }, index * 50);
        });
    }

    exportChatHistory() {
        const chatData = {
            messages: this.messages,
            statistics: this.stats,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(chatData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-chat-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Chat exported successfully', 'success');
    }

    handleShare(method) {
        switch (method) {
            case 'copy':
                this.copyToClipboard();
                break;
            case 'download':
                this.exportChatHistory();
                break;
            case 'text':
                this.exportAsText();
                break;
        }
        this.hideShareModal();
    }

    copyToClipboard() {
        const chatText = this.messages.map(msg => 
            `${msg.role.toUpperCase()}: ${msg.content}`
        ).join('\n\n');
        
        navigator.clipboard.writeText(chatText).then(() => {
            this.showToast('Chat copied to clipboard', 'success');
        }).catch(() => {
            this.showToast('Failed to copy to clipboard', 'error');
        });
    }

    exportAsText() {
        const chatText = this.messages.map(msg => 
            `${msg.role.toUpperCase()}: ${msg.content}`
        ).join('\n\n');
        
        const dataBlob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Chat exported as text', 'success');
    }

    // Enhanced Loading and UI
    showEnhancedLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message assistant';
        loadingDiv.id = 'loadingIndicator';
        
        loadingDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-robot"></i>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        loadingDiv.style.opacity = '0';
        loadingDiv.style.transform = 'translateY(20px)';
        
        this.chatMessages.appendChild(loadingDiv);
        
        setTimeout(() => {
            loadingDiv.style.transition = 'all 0.4s ease';
            loadingDiv.style.opacity = '1';
            loadingDiv.style.transform = 'translateY(0)';
        }, 50);
        
        this.scrollToBottom();
    }

    hideEnhancedLoadingIndicator() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.transition = 'all 0.3s ease';
            loadingIndicator.style.opacity = '0';
            loadingIndicator.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                loadingIndicator.remove();
            }, 300);
        }
    }

    setLoadingState(loading) {
        this.isLoading = loading;
        this.sendButton.disabled = loading;
        this.userInput.disabled = loading;
        
        if (loading) {
            this.sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.sendButton.style.background = 'var(--warning-gradient)';
        } else {
            this.sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
            this.sendButton.style.background = 'var(--primary-gradient)';
        }
    }

    smoothScrollToBottom() {
        this.chatMessages.scrollTo({
            top: this.chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    // Enhanced Toast Notifications
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Add entrance animation
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        
        this.toastContainer.appendChild(toast);
        
        // Trigger entrance animation
        setTimeout(() => {
            toast.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        }, 50);
        
        // Auto-remove after 5 seconds with exit animation
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    getToastIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-triangle';
            case 'warning': return 'exclamation-circle';
            default: return 'info-circle';
        }
    }

    // Enhanced Session Timer
    startSessionTimer() {
        setInterval(() => {
            const elapsed = Date.now() - this.sessionStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            this.sessionTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Enhanced Settings Persistence
    saveSettings() {
        localStorage.setItem('ai-chat-settings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('ai-chat-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        // Apply settings with animations
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        this.temperatureSlider.value = this.settings.temperature;
        this.modelType.value = this.settings.modelType;
        this.apiEndpoint.value = this.settings.apiEndpoint;
        this.apiKey.value = this.settings.apiKey;
        
        // Update UI with animations
        this.updateTemperatureDisplay();
        this.updateModelBadge();
        this.themeToggle.innerHTML = this.settings.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // Enhanced Configuration methods
    setApiEndpoint(endpoint) {
        this.settings.apiEndpoint = endpoint;
        this.apiEndpoint.value = endpoint;
        this.saveSettings();
        this.showToast('API endpoint updated', 'success');
    }

    setModel(model) {
        this.settings.model = model;
        this.modelSelect.value = model;
        this.updateModelBadge();
        this.saveSettings();
        this.showToast('Model updated', 'success');
    }

    setTemperature(temp) {
        this.settings.temperature = temp;
        this.temperatureSlider.value = temp;
        this.updateTemperatureDisplay();
        this.saveSettings();
        this.showToast('Temperature updated', 'success');
    }

    setMaxLength(length) {
        this.settings.maxLength = length;
        this.maxLength.value = length;
        this.saveSettings();
        this.showToast('Max length updated', 'success');
    }

    // Sound notifications
    playNotificationSound(type) {
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Set frequency based on notification type
        const frequency = type === 'success' ? 800 : type === 'error' ? 400 : 600;
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Initialize the chat interface with enhanced loading
document.addEventListener('DOMContentLoaded', () => {
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('show');
    }
    
    // Initialize chat with delay for smooth loading
    setTimeout(() => {
        const chat = new AIChat();
        
        // Make chat instance globally available
        window.aiChat = chat;
        
        // Hide loading overlay with animation
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.classList.remove('show');
            }, 500);
        }
        
        // Console helpers
        console.log('🚀 AI Chat Interface initialized!');
        console.log('Available commands:');
        console.log('- window.aiChat.setApiEndpoint("your-endpoint")');
        console.log('- window.aiChat.setModel("model-name")');
        console.log('- window.aiChat.setTemperature(0.6)');
        console.log('- window.aiChat.setMaxLength(32768)');
    }, 1000);
});

// Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 