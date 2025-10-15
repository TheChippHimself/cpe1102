import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  if (req.method === 'OPTIONS') {
    return new Response('', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const store = getStore('dashboard');
  
  try {
    const body = await req.json();
    let data = await store.get('data', { type: 'json' }) || {};
    
    data.payments = body.payments;
    data.lastUpdated = new Date().toISOString();
    
    await store.setJSON('data', data);
    
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/update-payments"
};