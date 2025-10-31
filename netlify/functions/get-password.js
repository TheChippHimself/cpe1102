const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const email = event.queryStringParameters?.email;
    
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    const store = getStore('dashboard');
    const data = await store.get('data', { type: 'json' });

    // Check if password exists
    if (data && data.passwords && data.passwords[email]) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ password: data.passwords[email] })
      };
    }
    
    // Return default password (SR code)
    const srCode = email.split('@')[0];
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ password: srCode })
    };
    
  } catch (error) {
    console.error('Error getting password:', error);
    
    // Fallback to SR code
    try {
      const email = event.queryStringParameters?.email;
      const srCode = email ? email.split('@')[0] : null;
      if (srCode) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ password: srCode })
        };
      }
    } catch (e) {}
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};