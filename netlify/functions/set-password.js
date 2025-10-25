const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);
    
    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    const store = getStore('dashboard');
    let data = await store.get('data', { type: 'json' });
    
    if (!data) {
      data = {
        assignments: [],
        payments: [],
        examinations: [],
        passwords: {}
      };
    }

    if (!data.passwords) {
      data.passwords = {};
    }

    data.passwords[email] = password;
    data.lastUpdated = new Date().toISOString();

    await store.setJSON('data', data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
    
  } catch (error) {
    console.error('Error setting password:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};