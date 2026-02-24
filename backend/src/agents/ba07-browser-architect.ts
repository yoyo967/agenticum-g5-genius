import { BaseAgent, AgentState } from './base-agent';
import axios from 'axios';

export class BA07BrowserArchitect extends BaseAgent {
  private engineUrl: string;
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
      color: '#FBBC04'
    });
    this.engineUrl = process.env.ENGINE_URL || process.env.BACKEND_URL || 'https://agenticum-backend-697051612685.europe-west1.run.app';
  }

  async execute(input: string, context?: any): Promise<string> {
    this.updateStatus(AgentState.WORKING, `Navigating to target and extracting intelligence...`, 20);
    
    try {
      // Extract URL from input or context if possible, otherwise assume it's in the input
      const urlMatch = input.match(/https?:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : (context?.url || '');
      
      if (!url) {
        throw new Error('No target URL provided for BA-07 Browser Architect.');
      }

      const response = await axios.post(`${this.engineUrl}/browser-action/`, {
        url: url,
        task: `${this.DIRECTIVES}\n\nUSER_TARGET_TASK: ${input}`,
        dsgvo_scope: true,
        triggered_by: 'sn00'
      });

      const data = response.data;

      if (data.status === 'blocked_by_senate') {
        this.updateStatus(AgentState.ERROR, 'Action blocked by Security Senate (GDPR)', 100);
        return `⚠️ BLOCKIERT: RA-01 Senate hat den Zugriff auf ${url} verweigert (DSGVO Verstoß).`;
      }

      this.updateStatus(AgentState.DONE, 'Intelligence extraction complete.', 100);
      
      return JSON.stringify(data.sp01_intel_feed, null, 2);
    } catch (error: any) {
      this.updateStatus(AgentState.ERROR, `Browser error: ${error.message}`, 100);
      return `Fehler bei der Browser-Analyse: ${error.message}`;
    }
  }
}
