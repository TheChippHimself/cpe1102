import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const store = getStore('dashboard');
  
  try {
    const updates = await req.json();
    let data = await store.get('data', { type: 'json' });
    
    if (!data) {
      data = {
        assignments: [],
        payments: [],
        examinations: [],
        passwords: {}
      };
    }

    // Merge updates
    if (updates.passwords) {
      if (!data.passwords) data.passwords = {};
      Object.assign(data.passwords, updates.passwords);
    }
    
    data.lastUpdated = new Date().toISOString();
    await store.setJSON('data', data);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const config = {
  path: "/api/update-data"
};