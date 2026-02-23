import { SP01Strategist } from './agents/sp01-strategist';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function runTest() {
  const vaultPath = path.join(process.cwd(), 'data', 'vault');
  const testFile = path.join(vaultPath, 'test-policy.txt');
  
  if (!fs.existsSync(vaultPath)) fs.mkdirSync(vaultPath, { recursive: true });
  fs.writeFileSync(testFile, 'AGENTICUM G5 POLICY: All campaigns must use Obsidian and Gold as primary colors.');

  console.log('--- STARTING GROUNDING TEST ---');
  const strategist = new SP01Strategist();
  
  // This should trigger lookups in the vault AND live search
  const result = await strategist.execute('Design a campaign for a new luxury watch brand, ensuring compliance with AGENTICUM G5 Policy.');
  
  console.log('\n--- STRATEGY RESULT ---');
  console.log(result);
  console.log('\n--- TEST FINISHED ---');
}

runTest().catch(console.error);
