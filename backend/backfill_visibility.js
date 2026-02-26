const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'online-marketing-manager'
});

const db = admin.firestore();

async function backfillVisibility() {
  console.log("=== FIRESTORE DATA MIGRATION: BACKFILL VISIBILITY ===");
  const collectionsToMigrate = ['pillars', 'clusters'];
  
  for (const collName of collectionsToMigrate) {
    console.log(`\nMigrating Collection: [${collName}]`);
    const snapshot = await db.collection(collName).get();
    
    if (snapshot.empty) {
      console.log("  -> Empty, skipping.");
      continue;
    }
    
    const batch = db.batch();
    let updatedCount = 0;
    
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (!data.visibility || (data.visibility !== 'public' && data.visibility !== 'internal')) {
        batch.update(doc.ref, { visibility: 'public' });
        updatedCount++;
        console.log(`  [PATCH] Marked doc ${doc.id} as 'public'.`);
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`  -> Successfully backfilled ${updatedCount} documents.`);
    } else {
      console.log(`  -> No documents required backfilling. All compliant.`);
    }
  }
}

backfillVisibility().then(() => process.exit(0)).catch(err => {
  console.error("Migration Failed:", err);
  process.exit(1);
});
