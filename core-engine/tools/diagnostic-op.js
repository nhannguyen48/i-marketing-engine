const { GoogleAuth } = require('google-auth-library');

async function diagnostic() {
  const auth = new GoogleAuth({
    keyFile: 'clever-grid-405215-5bc54c24d2b8.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  
  const OP_ID = 'projects/clever-grid-405215/locations/us-central1/publishers/google/models/veo-3.1-generate-001/operations/369b0cf1-e1b7-4192-8a70-e3532139ca2e';

  try {
    const client = await auth.getClient();
    const headers = await client.getRequestHeaders();
    console.log('[+] Auth headers obtained.');

    // Test 1: Fetch SPECIFIC Operation
    try {
      const opRes = await client.request({
        url: `https://us-central1-aiplatform.googleapis.com/v1/${OP_ID}`,
        headers: { ...headers }
      });
      console.log('[+] Operation Status:', JSON.stringify(opRes.data));
    } catch(e) {
      console.log('[X] Operation Error:', e.message);
      if(e.response) console.log('Detail:', JSON.stringify(e.response.data));
    }
    
  } catch(err) {
    console.error('[FATAL]:', err.message);
  }
}

diagnostic();
