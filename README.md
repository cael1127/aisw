# AI Chat Interface - DeepSeek & Qwen Models

A professional, modern AI chat interface supporting DeepSeek-R1-Distill and Qwen models with beautiful animations, glassmorphism design, and secure API handling.

## 🚀 Features

- **Multi-Model Support**: DeepSeek-R1-Distill and Qwen models
- **Professional Design**: Glassmorphism effects with smooth animations
- **Secure API Handling**: Serverless functions for secure API key management
- **PWA Ready**: Progressive Web App capabilities
- **Responsive Design**: Works on all devices
- **Dark/Light Theme**: Toggle between themes
- **Voice Input**: Speech-to-text functionality
- **Export/Import**: Chat history and settings management
- **Real-time Statistics**: Message and word counters
- **Sound Notifications**: Optional audio feedback

## 🔧 Setup Instructions

### 1. Deploy to Netlify

1. **Connect Repository**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository: `cael1127/aisw`

2. **Set Environment Variables**:
   - In your Netlify dashboard, go to **Site settings** → **Environment variables**
   - Add the following variables:
     ```
     DEEPSEEK_API_KEY=your_deepseek_api_key_here
     QWEN_API_KEY=your_qwen_api_key_here
     ```

3. **Deploy**:
   - Netlify will automatically deploy your site
   - Your AI chat interface will be live!

### 2. Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/cael1127/aisw.git
   cd aisw
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   QWEN_API_KEY=your_qwen_api_key_here
   ```

4. **Run locally**:
   ```bash
   npm run dev
   ```

## 🔐 Security Features

- **No Hardcoded API Keys**: All API keys are stored securely in environment variables
- **Serverless Functions**: API calls are proxied through secure Netlify functions
- **CORS Protection**: Proper CORS headers for security
- **Input Validation**: All user inputs are validated

## 🎨 Design Features

### Professional UI Elements:
- **Glassmorphism Effects**: Beautiful frosted glass backgrounds
- **Smooth Animations**: Entrance, hover, and transition animations
- **Gradient Design**: Professional color gradients throughout
- **Responsive Layout**: Adapts to all screen sizes
- **Dark/Light Theme**: Seamless theme switching

### Interactive Elements:
- **Animated Buttons**: Hover effects and loading states
- **Typing Indicators**: Professional loading animations
- **Toast Notifications**: Animated feedback messages
- **Voice Input**: Visual recording feedback
- **Statistics Counters**: Animated number displays

## 📱 PWA Features

- **Installable**: Can be installed as a native app
- **Offline Support**: Service worker for offline functionality
- **App Manifest**: Native app-like experience
- **Push Notifications**: Ready for notification support

## 🔧 Configuration

### Model Settings

#### DeepSeek Models (Local/Server)
- **Endpoint**: `http://localhost:8000/v1/chat/completions`
- **Models**: DeepSeek-R1-Distill-Qwen-32B, DeepSeek-R1-Distill-Llama-32B
- **Temperature**: 0.5-0.7 (recommended: 0.6)
- **Features**: Step-by-step reasoning, mathematical problem solving

#### Qwen Models (DeepSeek API)
- **Endpoint**: `https://api.deepseek.com/v1/chat/completions`
- **Models**: Qwen2.5-72B, Qwen2.5-32B, Qwen2.5-14B, Qwen2.5-7B, Qwen2-72B, Qwen2-32B, Qwen2-14B, Qwen2-7B
- **Temperature**: 0.1-1.0 (recommended: 0.7)
- **Features**: Advanced Qwen model capabilities with system prompts

### Usage Guidelines

#### DeepSeek Models:
- **No System Prompts**: DeepSeek models don't require system prompts
- **Thinking Patterns**: Use `<think>` tags for step-by-step reasoning
- **Math Problems**: Use `\boxed{}` format for final answers
- **Temperature**: Keep between 0.5-0.7 for best results

#### Qwen Models:
- **System Prompts**: Include helpful system messages
- **Temperature**: Flexible range from 0.1-1.0
- **Step-by-step**: Models naturally provide detailed explanations

## 🚀 Deployment

### Netlify Deployment

1. **Automatic Deployment**:
   - Connect your GitHub repository to Netlify
   - Netlify will automatically deploy on every push to main branch

2. **Environment Variables**:
   ```
   DEEPSEEK_API_KEY=sk-or-v1-your-deepseek-key
   QWEN_API_KEY=sk-or-v1-your-qwen-key
   ```

3. **Custom Domain** (Optional):
   - Add custom domain in Netlify settings
   - SSL certificate is automatically configured

### Manual Deployment

1. **Build and Deploy**:
   ```bash
   npm run deploy
   ```

2. **Environment Setup**:
   - Set environment variables in Netlify dashboard
   - No build step required - static files are served directly

## 🔧 Troubleshooting

### Common Issues:

1. **API Connection Errors**:
   - Check environment variables are set correctly
   - Verify API keys are valid and have proper permissions
   - Check Netlify function logs for errors

2. **Model Loading Issues**:
   - Ensure correct model names are selected
   - Check API endpoint configuration
   - Verify model availability in your API plan

3. **Performance Issues**:
   - Check browser console for errors
   - Verify network connectivity
   - Clear browser cache if needed

### Debug Commands:

```javascript
// Check current settings
console.log(window.aiChat.settings);

// Test API connection
window.aiChat.checkConnection();

// Update API endpoint
window.aiChat.setApiEndpoint('your-endpoint');

// Change model
window.aiChat.setModel('model-name');
```

## 📊 Performance

- **Fast Loading**: Optimized assets and lazy loading
- **Smooth Animations**: 60fps animations with hardware acceleration
- **Responsive Design**: Optimized for all device sizes
- **PWA Ready**: App-like performance with service worker

## 🔒 Security

- **No Client-Side API Keys**: All API calls go through secure serverless functions
- **Input Sanitization**: All user inputs are properly sanitized
- **CORS Protection**: Proper CORS headers for security
- **HTTPS Only**: All connections use secure protocols

## 📈 Analytics

The interface includes built-in statistics:
- **Message Count**: Total messages in session
- **Word Count**: Total words processed
- **Session Time**: Active session duration
- **Model Usage**: Which models are being used

## 🎯 Future Enhancements

- **Streaming Responses**: Real-time message streaming
- **File Upload**: Support for document analysis
- **Multi-language**: Internationalization support
- **Advanced Analytics**: Detailed usage statistics
- **Plugin System**: Extensible architecture

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review Netlify function logs
- Verify environment variable configuration
- Test with different models and settings

---

**Ready to deploy?** Your professional AI chat interface is now secure and ready for production! 🚀