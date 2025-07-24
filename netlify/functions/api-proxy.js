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

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { message, apiType } = JSON.parse(event.body);
        
        if (!message) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        // Determine which API key to use
        let apiKey;
        if (apiType === 'qwen') {
            apiKey = process.env.QWEN_API_KEY;
        } else if (apiType === 'qwen2') {
            apiKey = process.env.QWEN2_API_KEY;
        } else {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Invalid API type' })
            };
        }

        if (!apiKey) {
            console.error(`API key not found for ${apiType}`);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: `API key not configured for ${apiType}. Please check your Netlify environment variables.` 
                })
            };
        }

        console.log(`Making API call with ${apiType} key`);

        // Make the API call to DeepSeek
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'qwen2.5-72b-instruct',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI assistant. Please provide clear, step-by-step explanations when appropriate.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 4000,
                stream: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: `API request failed: ${response.status} - ${errorText}` 
                })
            };
        }

        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                response: data.choices[0].message.content
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                error: `Internal server error: ${error.message}` 
            })
        };
    }
}; 