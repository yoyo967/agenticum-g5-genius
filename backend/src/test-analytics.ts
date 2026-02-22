import { analyticsService } from './services/analytics';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '../.env') });

async function runAnalyticsTest() {
  console.log('--- Initiating Phase 8E Analytics & Telemetry Test ---');

  try {
    console.log('\n[1/2] Fetching Agency Throughput Data...');
    const throughput = await analyticsService.getThroughputData();
    console.table(throughput);

    console.log('\n[2/2] Fetching Global Swarm Stats...');
    const stats = await analyticsService.getSwarmStats();
    console.log('Stats:', stats);

    console.log('\n--- Analytics Test Complete ---');
  } catch (e) {
    console.error('Analytics test failed:', e);
  }
}

runAnalyticsTest();
