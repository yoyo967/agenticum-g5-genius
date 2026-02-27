import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// HINWEIS: Service Account JSON lokal ablegen für den Seed-Lauf
// Assuming standard relative path for backend firebase keys, please adjust if needed
import serviceAccount from '../../backend/service-account.json' assert { type: 'json' };

initializeApp({
  credential: cert(serviceAccount)
});

const PROJECT_ID = 'online-marketing-manager';
if (process.env.GCLOUD_PROJECT !== PROJECT_ID && 
    process.env.GOOGLE_CLOUD_PROJECT !== PROJECT_ID) {
  console.error(`[ABORT] Wrong project. Expected: ${PROJECT_ID}`);
  process.exit(1);
}

const db = getFirestore();

const seedData =[
  {
    title: "Humanoid Robotics: Market Penetration 2026",
    excerpt: "Analysis indicates a 340% surge in enterprise adoption of humanoid platforms. Perfect Twin validation achieved.",
    category: "Market Data",
    createdAt: Timestamp.now(),
    senateScore: 98.4,
    status: "approved",
    googleSearchQueries: ["humanoid robotics enterprise adoption 2026", "AI robotics market cap"],
    verifiedSources: ["https://techcrunch.com/robotics", "https://forbes.com/ai"]
  },
  {
    title: "Gemini 2.0 Flash: Latency Optimization",
    excerpt: "Swarm Protocol v3.0 successfully reduced WebSocket handshake latency to 42ms utilizing Gemini 2.0 Flash architecture.",
    category: "Intelligence",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 86400000)), // -1 Tag
    senateScore: 99.1,
    status: "approved",
    googleSearchQueries:["Gemini 2.0 Flash latency metrics", "WebSocket AI streaming"],
    verifiedSources: ["https://blog.google/technology/ai/"]
  },
  {
    title: "Counter-Strike Capability: Competitor Alpha",
    excerpt: "Columna Radar detected an aggressive pricing strategy from Competitor Alpha. Swarm initiated counter-narrative generation.",
    category: "Swarm Operations",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 172800000)), // -2 Tage
    senateScore: 94.7,
    status: "approved",
    googleSearchQueries: ["competitor alpha pricing changes 2026"],
    verifiedSources: ["https://competitor-alpha.com/pricing"]
  }
];

async function seed() {
  const collectionRef = db.collection('nexus_archives');
  for (const doc of seedData) {
    const added = await collectionRef.add(doc);
    console.log(`[SYS] Document injected: ${added.id}`);
  }
  console.log("[SYS] Nexus Archive Seed Complete.");
}

seed().catch(console.error);
