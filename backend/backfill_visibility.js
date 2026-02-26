const admin = require('firebase-admin');

const TARGET_PROJECT_ID = 'online-marketing-manager';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: TARGET_PROJECT_ID
});

const db = admin.firestore();

async function backfillVisibility() {
  console.log("=== FIRESTORE DATA MIGRATION: BACKFILL VISIBILITY ===");
  if (process.env.GCLOUD_PROJECT !== TARGET_PROJECT_ID && admin.app().options.projectId !== TARGET_PROJECT_ID) {
     console.error(`❌ ERROR: Safety Guard. You are attempting to run this against an unknown project. Expected: ${TARGET_PROJECT_ID}`);
     process.exit(1);
  }
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
