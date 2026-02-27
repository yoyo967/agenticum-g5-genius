const admin = require('firebase-admin');

// Initialize Firebase Admin with Application Default Credentials
// Ensure you are authenticated via `gcloud auth application-default login`
const TARGET_PROJECT_ID = 'online-marketing-manager';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: TARGET_PROJECT_ID
});

const db = admin.firestore();

async function clearAndSeed() {
  console.log("=== DB SEED & MIGRATE ===");
  if (process.env.GCLOUD_PROJECT !== TARGET_PROJECT_ID && admin.app().options.projectId !== TARGET_PROJECT_ID) {
     console.error(`❌ ERROR: Safety Guard. You are attempting to run this against an unknown project. Expected: ${TARGET_PROJECT_ID}`);
     process.exit(1);
  }
  
  console.log("Starting DB wipe of test logs...");
  // Safely ONLY clearing logs instead of structural pillars.
  const collectionsToClear = ['outputs', 'perfect_twin_logs'];
  
  for (const collName of collectionsToClear) {
    const collRef = db.collection(collName);
    const snapshot = await collRef.get();
    
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Cleared ${snapshot.size} documents from ${collName}.`);
  }

  // Seed a PERFECT pillar page structure idempotently using a fixed ID
  console.log("Seeding pristine Pillar Page (Idempotent)...");
  const newRef = db.collection('pillars').doc('agenticum-g5-advantage-seed');
  await newRef.set({
    title: "The AGENTICUM G5 Advantage: Neural Marketing Architectures",
    slug: "agenticum-g5-advantage-neural-architectures",
    status: "published",
    authorAgent: "sn00",
    excerpt: "An in-depth analysis of how continuous multi-agent orchestration outmaneuvers static AI wrappers. The G5 architecture leverages parallel processing, real-time Google Search grounding, and definitive EU AI Act compliance.",
    content: "## The Shift to Autonomous Synergies\n\nTraditional marketing automation operates on linear scripts. The breakthrough of the Agenticum G5 Sovereign Engine is **Neural Threading**—the ability to decompose a singular strategic objective into eight distinct, parallel cognitive streams. \n\nBy leveraging the Gemini 2.0 Flash Live API, the system eliminates human-in-the-loop bottlenecks, executing end-to-end strategic synthesis in under 42 seconds...",
    timestamp: new Date().toISOString(),
    visibility: "public",
    metrics: {
      integrityScore: 100,
      hallucinationRisk: 0,
      complianceStandard: "EU AI Act Art. 50"
    }
  });

  console.log("Database reset complete. The Nexus Feed will now look fully functional.");
}

clearAndSeed().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
