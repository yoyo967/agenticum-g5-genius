import { DiscoveryEngineService } from '../services/discovery-engine';
import { SP01Strategist } from '../agents/sp01-strategist';
import { autopilotService } from '../services/cron';
import { Logger } from '../utils/logger';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const logger = new Logger('Intelligence-Verification');

async function runVerification() {
  logger.info('--- AGENTICUM G5 INTELLIGENCE AUDIT ---');

  // 1. Test DiscoveryEngine Multi-File RAG
  logger.info('Test 1: Multi-File RAG Scanning...');
  const discovery = DiscoveryEngineService.getInstance();
  
  // Searching for "Bauhaus" which should be in DA03_DESIGN_THEORY.md
  const ragResult = await discovery.searchKnowledge('Bauhaus design principles');
  if (ragResult.includes('[SOURCE: DA03_DESIGN_THEORY.md]') || ragResult.includes('Bauhaus')) {
    logger.info('SUCCESS: RAG successfully identified relevant document in Vault.');
  } else {
    logger.warn('FAILURE: RAG did not find Bauhaus in Vault. Check if DA03_DESIGN_THEORY.md exists in data/vault.');
  }

  // 2. Test Agent Synergy (SP-01 with RAG)
  logger.info('Test 2: SP-01 Strategist Grounding...');
  const sp01 = new SP01Strategist();
  try {
    const strategy = await sp01.execute('Autonomous Marketing Swarms for Hackathons');
    if (strategy.includes('STRATEGIC MASTER BRIEF') && strategy.includes('SOURCE')) {
      logger.info('SUCCESS: SP-01 produced a grounded strategy with sources.');
    } else {
      logger.warn('PARTIAL: SP-01 executed, but sources or strategy structure might be missing.');
    }
  } catch (e) {
    logger.error('FAILURE: SP-01 execution failed', e as Error);
  }

  // 3. Test Autopilot Initialization
  logger.info('Test 3: Autopilot mission status...');
  const activeTasks = autopilotService.getActiveTasks();
  if (activeTasks.length > 0) {
    logger.info(`SUCCESS: Autopilot has ${activeTasks.length} active mission sequences.`);
  } else {
    logger.warn('FAILURE: Autopilot has no active tasks scheduled.');
  }
}

runVerification().then(() => {
  logger.info('Intelligence Verification Completed.');
  process.exit(0);
});
