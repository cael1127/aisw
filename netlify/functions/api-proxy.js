const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    
    // Determine which API key to use based on the endpoint or model type
    let apiKey;
    const endpoint = requestBody.endpoint || '';
    
    // Check if it's a local DeepSeek endpoint (no API key needed)
    if (endpoint.includes('localhost:8000')) {
      apiKey = 'local'; // No API key needed for local models
    } else {
      // For API endpoints, determine which key to use
      // You can add logic here to determine which API key based on model or other criteria
      // For now, we'll use QWEN_API_KEY as default, QWEN2_API_KEY as fallback
      apiKey = process.env.QWEN_API_KEY || process.env.QWEN2_API_KEY;
    }
    
    if (!apiKey || apiKey === 'local') {
      // For local models, we'll make a direct request without API key
      const targetUrl = requestBody.endpoint || 'http://localhost:8000/v1/chat/completions';
      
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: requestBody.model,
          messages: requestBody.messages,
          temperature: requestBody.temperature,
          max_tokens: requestBody.max_tokens,
          stream: false
        })
      });
      
      const data = await response.json();
      
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify(data)
      };
    }
    
    // For API endpoints, use the appropriate API key
    const targetUrl = requestBody.endpoint || 'https://api.deepseek.com/v1/chat/completions';
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    // Make the request to the actual API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: requestBody.model,
        messages: requestBody.messages,
        temperature: requestBody.temperature,
        max_tokens: requestBody.max_tokens,
        stream: false
      })
    });

    const data = await response.json();

    // Return the response
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error in API proxy:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
}; 