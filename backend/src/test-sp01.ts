import { SP01Strategist } from './agents/sp01-strategist';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables for the standalone test
config({ path: join(__dirname, '../../.env') });
config({ path: join(__dirname, '../.env') });

async function runTest() {
  console.log('Initiating SP-01 Strategist Test...');
  try {
    const strategist = new SP01Strategist();
    
    // Listen for status updates
    strategist.onStatusUpdate = (status) => {
        console.log(`[SP-01 Status] ${status.state}: ${status.message} (${status.progress}%)`);
    };

    const result = await strategist.execute('Research latest advertising trends for Volkswagen EVs in Germany 2026');
    console.log('\n--- FINAL RESULT ---');
    console.log(result);
    console.log('--- END RESULT ---\n');
  } catch(e) {
    console.error('Test failed:', e);
  }
}

runTest();
