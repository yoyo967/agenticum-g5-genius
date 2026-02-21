import { Router, Request, Response } from 'express';
import { SP01Strategist } from '../agents/sp01-strategist';
import { CC06Director } from '../agents/cc06-director';
import { DA03Architect } from '../agents/da03-architect';
import { RA01Auditor } from '../agents/ra01-auditor';
import { SN00Orchestrator } from '../agents/sn00-orchestrator';

const router = Router();

router.post('/deploy', async (req: Request, res: Response) => {
  try {
    const { nodes, edges } = req.body;
    
    if (!nodes || !edges) {
      return res.status(400).json({ error: 'Missing nodes or edges payload.' });
    }

    // Acknowledge deployment
    res.json({ status: 'success', message: 'Workflow graph compiled and dispatched to Swarm Cluster.' });

    // Background Execution Engine
    // 1. Find trigger node
    const triggerNode = nodes.find((n: any) => n.type === 'triggerNode');
    if (!triggerNode) {
       console.log('[Workflow Engine] Error: No Trigger Node found in graph.');
       return;
    }

    let currentNodeId = triggerNode.id;
    let accumulatedContext = triggerNode.data.config || 'Initial workflow trigger.';

    console.log(`[Workflow Engine] Initiating execution path from Trigger: ${triggerNode.data.title}`);

    // Traverse the path
    while (true) {
       const outgoingEdge = edges.find((e: any) => e.source === currentNodeId);
       if (!outgoingEdge) {
          console.log('[Workflow Engine] Reached end of workflow graph.');
          break; // End of chain
       }

       const nextNode = nodes.find((n: any) => n.id === outgoingEdge.target);
       if (!nextNode) break;

       console.log(`[Workflow Engine] Executing Node: ${nextNode.data.title} (${nextNode.type})`);

       if (nextNode.type === 'agentNode') {
          const agentId = nextNode.data.agentId;
          const directive = nextNode.data.config;
          const prompt = `CONTEXT:\n${accumulatedContext}\n\nDIRECTIVE:\n${directive}`;

          let response = '';
          try {
             switch (agentId) {
               case 'sn-00':
                 response = await new SN00Orchestrator().execute(prompt);
                 break;
               case 'sp-01':
                 response = await new SP01Strategist().execute(prompt);
                 break;
               case 'cc-06':
                 response = await new CC06Director().execute(prompt);
                 break;
               case 'da-03':
                 response = await new DA03Architect().execute(prompt);
                 break;
               case 'ra-01':
                 response = await new RA01Auditor().execute(prompt);
                 break;
               default:
                 console.log(`[Workflow Engine] Unknown agent ID: ${agentId}`);
                 response = accumulatedContext; // pass through
             }
             accumulatedContext = response; // Feed output to next agent
          } catch (e) {
             console.error(`[Workflow Engine] Agent ${agentId} execution failed:`, e);
             accumulatedContext += `\n[Agent ${agentId} Failed]`;
          }
       } else if (nextNode.type === 'actionNode') {
          // Action nodes represent system tasks (save to vault, email, etc)
          // For demo purposes, we log the action and complete the workflow
          console.log(`[Workflow Action] Performing output action: ${nextNode.data.config}`);
          // Send payload telemetry for visual map
          accumulatedContext += `\n[ACTION EXECUTED: ${nextNode.data.config}]`;
       }

       currentNodeId = nextNode.id;
    }

    console.log('[Workflow Engine] Graph execution totally complete.');

  } catch (err) {
    console.error('Workflow Deployment Error:', err);
  }
});

export default router;
