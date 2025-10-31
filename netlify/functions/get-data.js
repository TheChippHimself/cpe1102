import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const store = getStore('dashboard');
  
  try {
    let data = await store.get('data', { type: 'json' });
    
    // Initialize with default data if doesn't exist
    if (!data) {
      data = {
        assignments: [
          {
            id: 1,
            course: "CHEM 101",
            title: "Pass the PPT and Manual on your Gclassrooms (Blue folder for Hard Copy)",
            date: "October 20, 2025"
          },
          {
            id: 2,
            course: "RPH",
            title: "Final Project (Groupings)",
            date: "October 20, 2025"
          },
          {
            id: 3,
            course: "Art App.",
            title: "Painting, Sculpture, Documentation, Narrative, and Drawing",
            date: "October 20, 2025"
          },
          {
            id: 4,
            course: "ComProg.",
            title: "Activity 2.1",
            date: "October 20, 2025"
          },
          {
            id: 5,
            course: "MATH101",
            title: "Problem Set 2",
            date: "October 20, 2025"
          },
          {
            id: 6,
            course: "CHEM 101",
            title: "Notes in recent topics",
            date: "None Stated"
          },
          {
            id: 7,
            course: "CHEM 101",
            title: "Case Study for Finalized Topics",
            date: "None Stated"
          },
          {
            id: 8,
            course: "ENGG 101",
            title: "Brainstorming (Groupings)",
            date: "None Stated"
          }
        ],
        payments: [
          {
            id: 1,
            type: "CURSOR",
            amount: 100,
            date: "November 5, 2025"
          },
          {
            id: 2,
            type: "COE",
            amount: 20,
            date: "None Stated"
          },
          {
            id: 3,
            type: "SSC",
            amount: 45,
            date: "November 7, 2025"
          }
        ],
        examinations: [],
        passwords: {},
        lastUpdated: new Date().toISOString()
      };
      await store.setJSON('data', data);
    }

    // Ensure passwords object exists
    if (!data.passwords) {
      data.passwords = {};
      await store.setJSON('data', data);
    }
    
    return new Response(JSON.stringify(data), {
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
  path: "/api/get-data"
};