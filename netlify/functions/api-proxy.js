const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { message, apiType } = JSON.parse(event.body);
        if (!message) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY not found in environment variables');
            return {
                statusCode: 500,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'API key not configured' })
            };
        }

        console.log('Making enhanced Gemini API call');

        // Enhanced system prompt for better AI performance
        const enhancedPrompt = `You are an exceptionally intelligent and helpful AI assistant powered by Google Gemini. You excel at:

**Core Capabilities:**
- Providing detailed, accurate, and well-researched answers
- Writing high-quality code in multiple programming languages
- Explaining complex concepts in simple, understandable terms
- Creative problem-solving and brainstorming
- Professional writing and content creation
- Technical analysis and troubleshooting

**Communication Style:**
- Be warm, friendly, and approachable while maintaining professionalism
- Use clear, concise language that's easy to understand
- Provide step-by-step explanations when appropriate
- Ask clarifying questions when needed
- Show enthusiasm and genuine interest in helping

**Response Quality:**
- Always provide comprehensive, well-structured answers
- Include relevant examples and analogies
- Cite sources when discussing facts or statistics
- Offer multiple perspectives when applicable
- Suggest follow-up questions or next steps

**Code and Technical Help:**
- Write clean, well-commented, production-ready code
- Explain the logic and reasoning behind solutions
- Suggest best practices and optimization opportunities
- Consider edge cases and error handling
- Provide testing strategies when relevant

**Current Context:**
The user is interacting with you through a chat interface. Previous messages provide context for the conversation. Always consider this context when formulating your response.

**User Message:** ${message}

Please provide a helpful, accurate, and engaging response that demonstrates your expertise and genuinely helps the user.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: enhancedPrompt }] }],
                generationConfig: { 
                    temperature: 0.7, 
                    maxOutputTokens: 4096,
                    topP: 0.9,
                    topK: 40
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        console.log('Gemini API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            return {
                statusCode: response.status,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: `API request failed: ${response.status} - ${errorText}` 
                })
            };
        }

        const data = await response.json();
        console.log('Gemini API response data:', JSON.stringify(data, null, 2));
        
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            console.error('No response text found in API response');
            return {
                statusCode: 500,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'No response generated from AI' })
            };
        }
        
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ response: responseText })
        };

    } catch (error) {
        console.error('Server error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Internal server error. Please try again later.' 
            })
        };
    }
}; 