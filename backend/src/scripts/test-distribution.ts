import { CC02Distributor } from '../agents/cc02-distributor';
import fs from 'fs';
import path from 'path';

async function verifyDistribution() {
  console.log('🚀 Starting Distribution Verification Protocol...');
  
  const distributor = new CC02Distributor();
  const testInput = 'AGENTICUM G5 — Neural Distribution Test for LinkedIn [CC-02]';
  
  console.log('📦 Dispatching test payload to CC-02...');
  const result = await distributor.execute(testInput);
  
  console.log(`✅ Result: ${result}`);
  
  // Verify file creation in vault
  const vaultPath = path.join(process.cwd(), 'data', 'vault');
  const files = fs.readdirSync(vaultPath);
  const liFiles = files.filter(f => f.startsWith('LI_POST_'));
  
  if (liFiles.length > 0) {
    console.log(`🎉 SUCCESS: Verifiable LinkedIn post found in vault: ${liFiles[liFiles.length - 1]}`);
  } else {
    console.error('❌ FAILURE: No LinkedIn post file found in vault.');
    process.exit(1);
  }

  process.exit(0);
}

verifyDistribution().catch(err => {
  console.error('💥 Verification crashed:', err);
  process.exit(1);
});
