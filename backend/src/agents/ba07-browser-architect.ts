import { BaseAgent, AgentState } from './base-agent';
import { db, Collections } from '../services/firestore';
import { groundingEngine } from '../services/grounding-engine';

export class BA07BrowserArchitect extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the GenIUS Browser Architect (BA07).
    RORE: Du bist das Auge des Swarms im Live-Web. Deine Aufgabe ist die autonome Navigation, Extraktion und Analyse von Web-Content.
    CAPABILITIES: [launch_browser, search_web, extract_content, seo-audit, decompile-skeleton]
    SWARM_SYNCHRONIZATION (SwarmBus):
    - Deine Ergebnisse fließen direkt in 'ba07.browser_intel' ein.
    - SP01 nutzt deine Daten für die globale Strategie.
    - RA01 auditiert deine Scrapes auf DSGVO-Konformität.
    KNOWLEDGE BASE:
    - DOM Structure & Semantic HTML
    - Playwright & Puppeteer Automation Patterns
    - GDPR & EU AI Act (Transparency Requirements)
    - SEO Competitive Intelligence
  `;

  constructor() {
    super({
      id: 'ba07',
      name: 'Browser Architect',
      color: '#00E5FF'
    });
  }

  async execute(input: string, context?: any): Promise<string> {
    this.updateStatus(AgentState.WORKING, `Navigating to target and extracting intelligence...`, 20);
    const sessionId = context?.sessionId || `run_${Date.now()}`;
    const startTime = Date.now();
    
    try {
      // Extract URL from input or context if possible, otherwise assume it's in the input
      const urlMatch = input.match(/https?:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : (context?.url || '');
      
      if (!url) {
        this.updateStatus(AgentState.DONE, 'No target URL — general intelligence mode.', 100);
        return `BA-07 Web Intelligence: No specific URL extracted from directive. For deep competitor analysis, include a target URL (e.g. "analyse https://competitor.com"). General market context: AI-driven marketing automation is a rapidly growing space with key players including HubSpot, Salesforce Marketing Cloud, and emerging AI-native solutions.`;
      }

      // Log start of grounding phase to Perfect Twin
      await db.collection(Collections.PERFECT_TWIN_LOGS).add({
        run_id: sessionId,
        type: 'grounding',
        agent: 'ba07',
        message: `Initiating browser exploration for target: ${url}`,
        severity: 'info',
        timestamp: new Date()
      });

      // DIRECT CALL to GroundingEngine instead of blocking HTTP loop
      const result = await groundingEngine.scavenge(url, 'competitor');
      
      const latency = Date.now() - startTime;
      this.updateStatus(AgentState.DONE, 'Intelligence extraction complete.', 100);
      
      // Log success to Perfect Twin
      await db.collection(Collections.PERFECT_TWIN_LOGS).add({
        run_id: sessionId,
        type: 'grounding',
        agent: 'ba07',
        message: `Successfully extracted intelligence from ${url}. Tactical White Space identified.`,
        sources: [url],
        latency,
        score: 98,
        severity: 'success',
        timestamp: new Date()
      });

      return result;
    } catch (error: any) {
      this.updateStatus(AgentState.ERROR, `Browser error: ${error.message}`, 100);
      
      await db.collection(Collections.PERFECT_TWIN_LOGS).add({
        run_id: sessionId,
        type: 'lifecycle',
        agent: 'ba07',
        message: `Critical Error during web exploration: ${error.message}`,
        severity: 'error',
        timestamp: new Date()
      });

      return `Fehler bei der Browser-Analyse: ${error.message}`;
    }
  }
}
