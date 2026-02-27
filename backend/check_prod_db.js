const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'online-marketing-manager'
});

const db = admin.firestore();

async function checkProdDb() {
  console.log("=== FIRESTORE PROD DATA CHECK ===");
  const collectionsToCheck = ['pillars', 'clusters'];
  
  for (const collName of collectionsToCheck) {
    console.log(`\nCollection: [${collName}]`);
    const snapshot = await db.collection(collName).get();
    
    if (snapshot.empty) {
      console.log("  -> Empty");
      continue;
    }
    
    let publicCount = 0;
    let nonPublicCount = 0;
    
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const vis = data.visibility;
      if (vis === 'public') {
        publicCount++;
      } else {
        nonPublicCount++;
        console.warn(`  [WARNING] Non-public doc found! ID: ${doc.id} | visibility: ${vis} | title: ${data.title}`);
      }
    });
    
    console.log(`  -> Total Docs: ${snapshot.size}`);
    console.log(`  -> Public: ${publicCount}`);
    console.log(`  -> Non-Public/Missing Field: ${nonPublicCount}`);
  }
}

checkProdDb().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
