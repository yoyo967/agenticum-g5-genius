import * as admin from 'firebase-admin';
import path from 'path';

// Check if already initialized to prevent errors
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

async function updateBlog() {
  const docRef = db.collection('pillars').doc('BncZt12M6j0D3X2XhEis');
  
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    console.log('Document not found');
    return;
  }
  
  let content = docSnap.data()?.content || '';
  
  // Inject images
  // Let's add the CEO image at the very top as a cover
  if (!content.includes('element-ceo.png')) {
      content = `![Agenticum Leadership](/element-ceo.png)\n\n` + content;
  }

  // Find a good place for the lab image, maybe before "Target Audience"
  if (!content.includes('element-lab.png') && content.includes('## Target Audience')) {
      content = content.replace('## Target Audience', `![Neural Void Laboratory](/element-lab.png)\n\n## Target Audience`);
  }

  // Find a place for Samurai image, maybe before "Core Concepts" or "SEO Strategy"
  if (!content.includes('element-samurai.png') && content.includes('## Core Concepts')) {
      content = content.replace('## Core Concepts', `![Cyberpunk OS Protocols](/element-samurai.png)\n\n## Core Concepts`);
  }

  // Sphere image
  if (!content.includes('element-sphere.png') && content.includes('## Sub-topics')) {
      content = content.replace('## Sub-topics', `![Quantum Logic Sphere](/element-sphere.png)\n\n## Sub-topics`);
  }

  await docRef.update({ content });
  console.log('Successfully updated blog BncZt12M6j0D3X2XhEis with images.');
  process.exit(0);
}

updateBlog().catch(console.error);
