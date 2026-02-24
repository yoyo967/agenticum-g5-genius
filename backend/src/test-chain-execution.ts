import { ChainManager } from './services/chain-manager';
import { SwarmProtocol, TaskState } from './types/swarm-protocol';
import * as dotenv from 'dotenv';
dotenv.config();

async function runTest() {
  const manager = ChainManager.getInstance();
  
  const protocol: SwarmProtocol = {
    id: 'test-graph-01',
    goal: 'Test parallel and sequential orchestration',
    status: 'active',
    createdAt: Date.now(),
    tasks: [
      {
        id: 't1',
        agentId: 'sp01',
        description: 'Generate marketing theme',
        state: TaskState.PENDING,
        dependencies: []
      },
      {
        id: 't2',
        agentId: 'cc06',
        description: 'Write copy based on T1 theme',
        state: TaskState.PENDING,
        dependencies: ['t1']
      },
      {
        id: 't3',
        agentId: 'da03',
        description: 'Design visual based on T1 theme',
        state: TaskState.PENDING,
        dependencies: ['t1']
      },
      {
        id: 't4',
        agentId: 'ra01',
        description: 'Audit T2 and T3 results',
        state: TaskState.PENDING,
        dependencies: ['t2', 't3']
      }
    ]
  };

  console.log('--- STARTING CHAIN EXECUTION TEST ---');
  await manager.executeProtocol(protocol);
  console.log('--- TEST FINISHED ---');
  
  protocol.tasks.forEach(t => {
    console.log(`[${t.id}] ${t.agentId}: ${t.state} (Dur: ${((t.endTime || 0) - (t.startTime || 0)) / 1000}s)`);
    if (t.error) console.error(`   Error: ${t.error}`);
  });
}

runTest().catch(console.error);
