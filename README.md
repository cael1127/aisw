# AI Chat Interface - DeepSeek & Qwen Models

A beautiful, modern, production-ready web interface for interacting with both DeepSeek-R1-Distill and Qwen models. This interface follows the official usage guidelines and provides an intuitive way to chat with multiple AI models.

## ✨ Features

- 🎨 **Modern UI**: Beautiful gradient design with glassmorphism effects and dark mode
- 🤖 **Multi-Model Support**: DeepSeek-R1-Distill and Qwen models in one interface
- ⚙️ **Proper Configuration**: Follows DeepSeek-R1-Distill usage guidelines
- 🧮 **Math Support**: Automatic \boxed{} formatting for mathematical answers
- 💭 **Thinking Patterns**: Enforces step-by-step reasoning
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **Quick Prompts**: Pre-built example prompts for different use cases
- 🎛️ **Temperature Control**: Adjustable temperature (0.1-1.0 range)
- 🔧 **Configurable**: Easy API endpoint and model configuration
- 🎤 **Voice Input**: Speech-to-text functionality
- 📊 **Statistics**: Real-time session statistics
- 💾 **Export/Import**: Chat history and settings management
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **PWA Support**: Installable as a web app
- 🔔 **Notifications**: Push notification support
- 📤 **Share Features**: Export chat as JSON, text, or copy to clipboard

## 🚀 Quick Deploy to Netlify

### Option 1: Deploy from GitHub

1. **Fork this repository** to your GitHub account
2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your forked repository
   - Deploy settings are already configured in `netlify.toml`

### Option 2: Deploy from Local Files

1. **Download the files** to your computer
2. **Drag and drop** the folder to [netlify.com](https://netlify.com)
3. **Your site is live!** 🎉

### Option 3: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## 🛠️ Setup Instructions

### 1. Configure Models

The interface supports two types of models:

#### DeepSeek Models (Local/Server)
- **Endpoint**: Your local vLLM or SGLang server
- **Models**: DeepSeek-R1-Distill-Qwen-32B, DeepSeek-R1-Distill-Llama-32B
- **Features**: Step-by-step thinking, math problem solving with \boxed{} format

#### Qwen Models (DeepSeek API)
- **Endpoint**: DeepSeek API (pre-configured)
- **Models**: Qwen2.5-72B, Qwen2.5-32B, Qwen2.5-14B, Qwen2.5-7B, Qwen2-72B, Qwen2-32B, Qwen2-14B, Qwen2-7B
- **API Key**: Pre-configured with your provided key
- **Features**: Advanced Qwen model capabilities with system prompts

### 2. Start Using the Interface

1. **Open the deployed website**
2. **Select your preferred model type** in the sidebar:
   - Choose "DeepSeek Models" for local/server models
   - Choose "Qwen Models" for DeepSeek API
3. **Configure API endpoint** (for DeepSeek models)
4. **Start chatting!**

## 📁 File Structure

```
├── index.html              # Main HTML file
├── styles.css              # Modern CSS with dark mode
├── script.js               # Enhanced JavaScript functionality
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker for PWA
├── netlify.toml           # Netlify configuration
├── README.md               # This file
└── DeepSeek-R1-Distill-Usage-Guide.md  # Detailed usage guide
```

## 🎯 Features in Detail

### 🤖 Multi-Model Support
- **DeepSeek Models**: Local/server-based models with thinking patterns
- **Qwen Models**: DeepSeek API models with system prompts
- **Easy Switching**: Toggle between model types seamlessly
- **Model-Specific Features**: Each model type has optimized settings

### 🌙 Dark Mode
- Toggle between light and dark themes
- Automatic theme persistence
- Smooth transitions between themes

### 🎤 Voice Input
- Click the microphone button to start voice recording
- Automatic speech-to-text conversion
- Works in modern browsers with speech recognition support

### 📊 Statistics Panel
- **Message Count**: Total messages in current session
- **Word Count**: Total words exchanged
- **Session Time**: Real-time session duration

### 💾 Export/Import Features
- **Export Chat**: Download as JSON or text
- **Export Settings**: Save your configuration
- **Import Settings**: Load saved configurations
- **Share Chat**: Copy to clipboard or download

### 🔧 Settings Management
- **Model Configuration**: Switch between DeepSeek and Qwen models
- **API Configuration**: Endpoint and API key settings
- **Interface Options**: Auto-scroll, sound notifications
- **Data Management**: Export/import settings, clear all data

### 📱 PWA Features
- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Cached resources for offline use
- **Push Notifications**: Receive notifications (if implemented)
- **App-like Experience**: Full-screen mode, native feel

## 🎨 UI Components

### Quick Prompts
- **Math Problem**: Example with \boxed{} formatting
- **Explain Concept**: Step-by-step explanations
- **Creative Writing**: Story generation with thinking process
- **Analysis**: Pros and cons analysis
- **Code Example**: Programming explanations
- **Comparison**: Compare and contrast topics

### Message Formatting
- **User messages**: Green background with user icon
- **Assistant messages**: Blue background with robot icon
- **Math answers**: Highlighted with gradient background
- **Thinking prompts**: Special formatting for reasoning steps
- **Error messages**: Red background for API errors

### Responsive Design
- **Desktop**: Full-featured interface with sidebar
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with stacked layout

## 🔧 Configuration

### Model Settings
```javascript
// Switch to Qwen models
window.aiChat.settings.modelType = 'qwen';

// Switch to DeepSeek models
window.aiChat.settings.modelType = 'deepseek';

// Change API endpoint (for DeepSeek)
window.aiChat.setApiEndpoint("http://your-server:8000/v1/chat/completions");

// Change model
window.aiChat.setModel("qwen2.5-72b-instruct");

// Adjust temperature
window.aiChat.setTemperature(0.7);

// Set max length
window.aiChat.setMaxLength(32768);
```

### Environment Variables
The interface supports environment variables for configuration:

```bash
# Optional: Set default API endpoint
REACT_APP_DEFAULT_API_ENDPOINT=http://localhost:8000/v1/chat/completions

# Optional: Set default model
REACT_APP_DEFAULT_MODEL=deepseek-ai/DeepSeek-R1-Distill-Qwen-32B
```

## 🚀 Performance Optimizations

### Built-in Optimizations
- **Lazy Loading**: Resources loaded on demand
- **Caching**: Service worker caches for offline use
- **Compression**: Optimized assets for fast loading
- **CDN**: External resources from CDN for speed

### Netlify Optimizations
- **Automatic HTTPS**: SSL certificates included
- **Global CDN**: Content delivered from edge locations
- **Compression**: Automatic gzip compression
- **Caching**: Optimized cache headers

## 🔒 Security Features

### Built-in Security
- **CORS Headers**: Proper cross-origin resource sharing
- **Content Security Policy**: XSS protection
- **HTTPS Only**: Secure connections enforced
- **Input Validation**: Client-side validation

### API Security
- **API Key Support**: Secure API key storage
- **Request Validation**: Proper request formatting
- **Error Handling**: Graceful error management

## 📱 Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Error**: 
   - Check if your model server is running (for DeepSeek)
   - Verify the API endpoint in settings
   - Ensure CORS is enabled on your server

2. **Qwen API Errors**:
   - Check if your API key is valid
   - Verify you have sufficient credits
   - Check DeepSeek service status

3. **Voice Input Not Working**:
   - Check browser permissions for microphone
   - Ensure HTTPS is enabled (required for voice input)
   - Try a different browser

4. **Settings Not Saving**:
   - Check browser localStorage support
   - Clear browser cache and try again
   - Check browser console for errors

### Debug Mode

Open browser console to see detailed logs:
```javascript
// Check current configuration
console.log(window.aiChat);

// Test DeepSeek API connection
fetch('http://localhost:8000/v1/models')
  .then(response => response.json())
  .then(data => console.log('Available models:', data));

// Test Qwen API connection
fetch('https://api.deepseek.com/v1/models', {
  headers: { 'Authorization': 'Bearer your-api-key' }
})
  .then(response => response.json())
  .then(data => console.log('Available models:', data));
```

## 🎯 Usage Guidelines

The interface automatically follows best practices for each model type:

### DeepSeek Models
- **Temperature**: 0.5-0.7 (0.6 recommended)
- **No system prompts**: All instructions in user prompts
- **Math problems**: Automatic \boxed{} formatting
- **Thinking patterns**: Forces step-by-step reasoning

### Qwen Models
- **Temperature**: 0.1-1.0 (0.7 recommended)
- **System prompts**: Automatic helpful assistant prompt
- **Standard formatting**: Regular Qwen response format
- **Flexible settings**: Full temperature range available

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

### Development Setup

1. **Clone the repository**
2. **Open `index.html` in a browser**
3. **Make changes and test locally**
4. **Deploy to Netlify for testing**

## 📞 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the usage guide
- **Community**: Join AI/ML communities for help

---

**Note**: This interface supports both DeepSeek-R1-Distill and Qwen models with optimized settings for each. The Qwen API key is pre-configured for immediate use.

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Test with your model server (DeepSeek)
- [ ] Test Qwen API connectivity
- [ ] Configure API endpoints
- [ ] Test voice input functionality
- [ ] Verify dark mode toggle
- [ ] Test export/import features
- [ ] Check mobile responsiveness
- [ ] Verify PWA installation
- [ ] Test offline functionality
- [ ] Test model switching

Your AI Chat Interface is now ready for production with both DeepSeek and Qwen models! 🎉 #   a i s w  
 