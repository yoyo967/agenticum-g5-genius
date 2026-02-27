const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore({ projectId: 'online-marketing-manager' });

async function run() {
  console.log('Injecting test document into Live Production Firestore...');
  const ref = await db.collection('campaigns').add({
     brand: 'AGENTICUM NUCLEUS',
     objective: 'Diagnostic Telemetry Ping',
     status: 'running',
     createdAt: new Date(),
     agents: ['sn00', 'ra01'],
     budget: 500000
  });
  console.log('Success! ID:', ref.id);
  
  await db.collection('senate_docket').add({
      taskId: 'diag-01',
      campaignId: ref.id,
      content: 'Testing connection to SwarmAnalytics',
      verdict: 'PENDING',
      timestamp: new Date()
  });
}

run().catch(console.error);
