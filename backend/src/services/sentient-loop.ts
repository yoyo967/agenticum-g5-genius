import { Logger } from '../utils/logger';
import { ChainManager } from './chain-manager';
import { RA01Auditor } from '../agents/ra01-auditor';
import { eventFabric } from './event-fabric';

export interface LoopResult {
  finalOutput: string;
  iterations: number;
  score: number;
  verdict: 'APPROVED' | 'REJECTED';
  history: string[];
}

export class SentientLoopService {
  private logger: Logger;
  private static instance: SentientLoopService;
  private auditor: RA01Auditor;

  private constructor() {
    this.logger = new Logger('SentientLoop');
    this.auditor = new RA01Auditor();
  }

  public static getInstance(): SentientLoopService {
    if (!SentientLoopService.instance) {
      SentientLoopService.instance = new SentientLoopService();
    }
    return SentientLoopService.instance;
  }

  /**
   * Orchestrates a feedback loop for an agent's output.
   * TargetAgentId: The ID of the agent producing the initial content.
   * Input: The original prompt/goal.
   * MaxIterations: Maximum self-correction cycles.
   * TargetScore: Minimum GenIUS Score to consider 'Optimized'.
   */
  public async refine(
    targetAgentId: string,
    input: string,
    maxIterations: number = 3,
    targetScore: number = 75
  ): Promise<LoopResult> {
    this.logger.info(`Starting Sentient Loop for [${targetAgentId}] - Target Score: ${targetScore}`);
    
    const chainManager = ChainManager.getInstance();
    const agent = chainManager.getAgent(targetAgentId);
    
    if (!agent) {
      throw new Error(`Agent [${targetAgentId}] not found.`);
    }

    let currentOutput = '';
    let currentScore = 0;
    let currentVerdict: 'APPROVED' | 'REJECTED' = 'REJECTED';
    let iterations = 0;
    const history: string[] = [];

    // Initial Execution
    currentOutput = await agent.execute(input);
    history.push(currentOutput);

    while (iterations < maxIterations) {
      iterations++;
      this.logger.info(`Loop Iteration ${iterations}/${maxIterations} for [${targetAgentId}]`);
      
      eventFabric.broadcast({
        type: 'swarm-calibration',
        data: {
          agentId: targetAgentId,
          iteration: iterations,
          status: 'evaluating'
        }
      });

      // Audit current output
      const auditReport = await this.auditor.execute(currentOutput);
      
      // Parse score and verdict from report
      // In a real system, RA01 would return structured data. 
      // For now, we extract from the string or use the predictive endpoint directly.
      const scoreMatch = auditReport.match(/GenIUS SCORE: (\d+)/);
      currentScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      currentVerdict = auditReport.includes('APPROVED') ? 'APPROVED' : 'REJECTED';

      this.logger.info(`Iteration ${iterations} Result: Score ${currentScore}, Verdict: ${currentVerdict}`);

      if (currentVerdict === 'APPROVED' && currentScore >= targetScore) {
        this.logger.info(`Target quality met in iteration ${iterations}. Terminating loop.`);
        break;
      }

      if (iterations < maxIterations) {
        this.logger.info(`Refining output based on Senate critique...`);
        
        eventFabric.broadcast({
          type: 'swarm-calibration',
          data: {
            agentId: targetAgentId,
            iteration: iterations,
            status: 'refining',
            critique: auditReport
          }
        });

        const refinementPrompt = `
          YOUR PREVIOUS OUTPUT:
          "${currentOutput}"
          
          SENATE CRITIQUE:
          ${auditReport}
          
          TASK: Refine your output to address ALL concerns raised by the Senate. 
          Focus on increasing the GenIUS SCORE and achieving an APPROVED verdict.
          Maintain the original intent: "${input}"
        `;

        currentOutput = await agent.execute(refinementPrompt);
        history.push(currentOutput);
      }
    }

    return {
      finalOutput: currentOutput,
      iterations,
      score: currentScore,
      verdict: currentVerdict,
      history
    };
  }
}
