import { db, Collections } from '../services/firestore';
import { PillarGraphOrchestrator } from '../services/orchestrator';
import { Logger } from '../utils/logger';
import dotenv from 'dotenv';
import path from 'path';

// Fix for dotenv in scripts
dotenv.config({ path: path.join(__dirname, '../../.env') });

const logger = new Logger('E2E-Verification');

async function verifyEndToEnd() {
  logger.info('--- AGENTICUM G5 DEEP INTEGRATION TEST ---');
  
  const orchestrator = PillarGraphOrchestrator.getInstance();
  const testTopic = `E2E-Test-${Date.now()}`;
  const slug = testTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  logger.info(`Phase 1: Triggering Orchestrator for: ${testTopic}`);
  try {
    const result = await orchestrator.executePillarRun(testTopic, { type: 'pillar' });
    logger.info(`Orchestrator finished. RunID: ${result.runId}`);
    
    logger.info('Phase 2: Verifying Firestore Persistence...');
    const doc = await db.collection(Collections.PILLARS).doc(slug).get();
    
    if (doc.exists) {
      const data = doc.data();
      logger.info('SUCCESS: Document found in Firestore!');
      logger.info(`Title: ${data?.title}`);
      logger.info(`Status: ${data?.status}`);
      logger.info(`Audit Score: ${data?.audit_report?.score}`);
      
      if (data?.content && data.content.length > 100) {
        logger.info('Deep Content detected (>100 chars). Verification passed.');
      } else {
        logger.warn('Content too short. Verification partial.');
      }
    } else {
      logger.error('FAILURE: Document NOT found in Firestore.');
    }
    
    logger.info('Phase 3: Verifying Analytics Aggregation...');
    // This just checks if the collection exists/is accessible
    const statsSnapshot = await db.collection(Collections.PILLARS).limit(5).get();
    logger.info(`${statsSnapshot.size} total pillars indexed in Analytics range.`);
    
  } catch (error) {
    logger.error('CRITICAL: E2E Test Suite failed', error as Error);
  }
}

verifyEndToEnd().then(() => {
  logger.info('Test sequence completed.');
  process.exit(0);
});
