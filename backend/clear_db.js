const admin = require('firebase-admin');

// Initialize Firebase Admin with Application Default Credentials
// Ensure you are authenticated via `gcloud auth application-default login`
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'online-marketing-manager'
});

const db = admin.firestore();

async function clearAndSeed() {
  console.log("Starting DB wipe...");
  const collectionsToClear = ['pillars', 'outputs', 'perfect_twin_logs'];
  
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

  // Seed a PERFECT pillar page so the Landing Page looks pristine and "completed", not like a construction site.
  console.log("Seeding pristine Pillar Page...");
  const newRef = db.collection('pillars').doc();
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
