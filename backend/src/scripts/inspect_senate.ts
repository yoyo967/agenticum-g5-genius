
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: 'online-marketing-manager'
  });
}

const db = admin.firestore();

async function inspect() {
  console.log('--- Scanning Senate Docket for Rejected Items ---');
  const snapshot = await db.collection('senate_docket').get();
  if (snapshot.empty) {
    console.log('Collection senate_docket is empty.');
    return;
  }

  let rejectedCount = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    const isRejected = 
      data.verdict === 'REJECTED' || 
      data.status === 'rejected' || 
      data.status === 'REJECTED' ||
      data.verdict === 'VETOED';

    if (isRejected) {
      console.log(`Found Rejected: ${doc.id} - Field: ${data.verdict ? 'verdict' : 'status'}`);
      rejectedCount++;
    }
  });

  console.log(`Total rejected items found: ${rejectedCount}`);
}

inspect().catch(console.error);
