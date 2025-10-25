import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  // Handle CORS preflight
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { email, password } = body;
    
    console.log('Received password change request for:', email);
    
    if (!email || !password) {
      return new Response(JSON.stringify({ 
        error: 'Email and password are required',
        received: { email: !!email, password: !!password }
      }), {
        status: 400,
        headers
      });
    }

    // Get the store
    const store = getStore('dashboard');
    
    // Get existing data
    let data = await store.get('data', { type: 'json' });
    
    console.log('Current data exists:', !!data);
    
    // Initialize if no data exists
    if (!data) {
      data = {
        assignments: [],
        payments: [],
        examinations: [],
        passwords: {}
      };
    }

    // Ensure passwords object exists
    if (!data.passwords) {
      data.passwords = {};
    }

    // Update the password
    data.passwords[email] = password;
    data.lastUpdated = new Date().toISOString();

    console.log('Saving password for:', email);
    
    // Save back to store
    await store.setJSON('data', data);

    console.log('Password saved successfully');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Password updated successfully'
    }), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('Error in set-password function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers
    });
  }
};

export const config = {
  path: "/api/set-password"
};