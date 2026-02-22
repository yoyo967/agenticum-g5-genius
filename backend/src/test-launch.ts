import { PM07Manager } from './agents/pm07-manager';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '../.env') });

async function runLaunchTest() {
  console.log('--- Initiating Phase 8D Ecosystem Launch Test ---');
  const pm07 = new PM07Manager();

  try {
    console.log('\n[1/1] Triggering Ecosystem Launch via PM-07...');
    const report = await pm07.execute('LAUNCH CAMPAIGN test-pmax-001 WITH CONFIG: {"budget":250,"biddingStrategy":"MAXIMIZE_CONVERSIONS"}');
    
    console.log('\n--- LAUNCH REPORT ---');
    console.log(report);
    console.log('\n--- Ecosystem Launch Test Complete ---');
  } catch (e) {
    console.error('Launch test failed:', e);
  }
}

runLaunchTest();
