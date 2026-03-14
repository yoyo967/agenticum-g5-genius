import { BaseAgent, AgentState } from './base-agent';
import { distributionService } from '../services/distribution';
import { roiEngine } from '../services/roi-engine';
import { eventFabric } from '../services/event-fabric';

export class CC02Distributor extends BaseAgent {
  constructor() {
    super({
      id: 'cc02',
      name: 'Global Distributor',
      color: '#FBBC04'
    });
  }

  async execute(input: string, context?: any): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Analyzing distribution payload...', 10);
    
    const channel = this.determineChannel(input);
    this.updateStatus(AgentState.WORKING, `Activating ${channel.toUpperCase()} Protocol...`, 40);

    let resultMsg = '';
    try {
      if (channel === 'linkedin' || input.includes('CC-02')) {
        const res = await distributionService.publishToLinkedIn(input);
        resultMsg = `LinkedIn Post synchronized: ${res.url}`;
      } else if (channel === 'email' || input.includes('CC-03')) {
        const { SettingsService } = require('../services/settings');
        const settings = SettingsService.getCachedSettings?.() || {};
        const recipients = settings.notificationEmail
          ? [settings.notificationEmail]
          : [];
        if (recipients.length === 0) {
          resultMsg = 'Email skipped — no recipient configured in Settings.';
        } else {
          const res = await distributionService.publishToEmail({
            subject: 'G5 Swarm Intelligence Dispatch',
            body: input,
            recipients
          });
          resultMsg = `Email Campaign dispatched: ${res.url}`;
        }
      } else if (channel === 'wordpress' || input.includes('CC-04')) {
        const res = await distributionService.publishToWordPress({
          title: 'G5 Sentience Update',
          body: input
        });
        resultMsg = `Native Blog published: ${res.url}`;
      } else {
        const res = await distributionService.publishToSocialEcho(input);
        resultMsg = `Social Echo broadcasted: ${res.url}`;
      }

      // Record ROI Impact
      roiEngine.recordDistributionEvent(channel);
      
      this.updateStatus(AgentState.DONE, `Distribution successful via ${channel}.`, 100);
      return `[CC-02 SUCCESS] ${resultMsg}`;
    } catch (error) {
      this.updateStatus(AgentState.ERROR, `Distribution failed: ${(error as Error).message}`, 0);
      return `[CC-02 ERROR] ${(error as Error).message}`;
    }
  }

  private determineChannel(input: string): string {
    const text = input.toLowerCase();
    if (text.includes('linkedin') || text.includes('cc-02')) return 'linkedin';
    if (text.includes('email') || text.includes('cc-03')) return 'email';
    if (text.includes('blog') || text.includes('wordpress') || text.includes('cc-04')) return 'wordpress';
    return 'social_echo';
  }
}
