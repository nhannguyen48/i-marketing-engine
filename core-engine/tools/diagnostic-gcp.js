const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

async function diagnostic() {
  const auth = new GoogleAuth({
    keyFile: 'clever-grid-405215-5bc54c24d2b8.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  
  try {
    const client = await auth.getClient();
    const project = await auth.getProjectId();
    console.log('[+] Project ID:', project);

    // Test 1: Check Bucket existence and metadata
    try {
      const bRes = await client.request({
        url: `https://storage.googleapis.com/storage/v1/b/nhan-tam-production`
      });
      console.log('[+] Bucket found! Location:', bRes.data.location);
    } catch(e) {
      console.log('[X] Bucket Error:', e.message);
    }

    // Test 2: Check current Operations
    try {
      const opRes = await client.request({
        url: `https://us-central1-aiplatform.googleapis.com/v1/projects/${project}/locations/us-central1/operations`
      });
      console.log('[+] Operations list fetched. Recent count:', opRes.data.operations ? opRes.data.operations.length : 0);
      if(opRes.data.operations) {
          opRes.data.operations.slice(0, 3).forEach(op => {
              console.log(`- ${op.name} | Done: ${op.done} | Error: ${op.error ? op.error.message : 'None'}`);
          });
      }
    } catch(e) {
      console.log('[X] Operations Error:', e.message);
    }
    
  } catch(err) {
    console.error('[FATAL]:', err.message);
  }
}

diagnostic();
