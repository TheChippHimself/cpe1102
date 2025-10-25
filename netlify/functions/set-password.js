import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers
      });
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('Error setting password:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers
    });
  }
};

export const config = {
  path: "/api/set-password"
};