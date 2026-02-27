const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore({ projectId: 'online-marketing-manager' });

async function run() {
  console.log('Fetching recent lifecycle logs from Live Production Firestore...');
  const logs = await db.collection('perfect_twin_logs')
      .where('type', '==', 'lifecycle')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();
  
  logs.docs.forEach(doc => {
      const data = doc.data();
      console.log(`[${data.timestamp.toDate().toISOString()}] ${data.agent} - ${data.severity}: ${data.message}`);
  });
}

run().catch(console.error);
