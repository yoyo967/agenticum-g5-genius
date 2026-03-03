
const admin = require('firebase-admin');

// Initialize with default credentials
if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: 'online-marketing-manager'
  });
}

const db = admin.firestore();

async function cleanup() {
  console.log('--- Cleaning up Senate Docket ---');
  
  const snapshot = await db.collection('senate_docket')
    .where('verdict', '==', 'REJECTED')
    .get();

  if (snapshot.empty) {
    console.log('No rejected cases found.');
    return;
  }

  const deletePromises = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    // Keywords for test data
    const isTest = 
      /Agenticum G5/i.test(data.title || '') || 
      /test/i.test(data.title || '') || 
      /lorem ipsum/i.test(data.payload || '') ||
      (data.title && data.title.includes('Audit:') === false);

    if (isTest) {
      console.log(`Deleting test case: ${doc.id} - ${data.title}`);
      deletePromises.push(doc.ref.delete());
    } else {
      console.log(`Keeping real case: ${doc.id} - ${data.title}`);
    }
  });

  await Promise.all(deletePromises);
  console.log(`Deleted ${deletePromises.length} test cases.`);
}

cleanup().catch(console.error);
