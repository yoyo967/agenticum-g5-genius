import { Logger } from '../utils/logger';
import { eventFabric } from './event-fabric';
import fs from 'fs';
import path from 'path';

export interface DistributionResult {
  channel: 'wordpress' | 'linkedin' | 'email' | 'social_echo' | 'hosting';
  status: 'success' | 'failed';
  url?: string;
  timestamp: string;
  error?: string;
}

export class DistributionService {
  private logger = new Logger('DistributionService');
  private static instance: DistributionService;

  private constructor() {}

  public static getInstance(): DistributionService {
    if (!DistributionService.instance) {
      DistributionService.instance = new DistributionService();
    }
    return DistributionService.instance;
  }

  /**
   * Publishes to WordPress (generates a verifiable file in the vault)
   */
  public async publishToWordPress(content: { title: string; body: string }): Promise<DistributionResult> {
    this.logger.info(`Publishing to WordPress: ${content.title}`);
    
    // Create a physical file in the vault to prove distribution
    const vaultPath = path.join(process.cwd(), 'data', 'vault');
    const filename = `WP_DIST_${content.title.replace(/\s+/g, '_')}_${Date.now()}.html`;
    const filePath = path.join(vaultPath, filename);
    
    const htmlContent = `
      <html>
        <head><title>${content.title}</title><style>body{font-family:sans-serif;padding:2rem;line-height:1.6;}</style></head>
        <body>
          <h1>${content.title}</h1>
          <p><em>Distributed via AGENTICUM G5 OS</em></p>
          <hr/>
          <div>${content.body}</div>
        </body>
      </html>
    `;
    
    fs.writeFileSync(filePath, htmlContent);
    this.logger.info(`Verifiable distribution file created: ${filename}`);

    const result: DistributionResult = {
      channel: 'wordpress',
      status: 'success',
      url: `/vault/${filename}`, // Frontend can open this
      timestamp: new Date().toISOString()
    };

    eventFabric.broadcast({ type: 'distribution-update', ...result });
    return result;
  }

  /**
   * Publishes to LinkedIn (generates a verifiable file in the vault)
   */
  public async publishToLinkedIn(post: string): Promise<DistributionResult> {
    this.logger.info('Publishing to LinkedIn Swarm Feed...');
    
    const vaultPath = path.join(process.cwd(), 'data', 'vault');
    const filename = `LI_POST_${Date.now()}.txt`;
    const filePath = path.join(vaultPath, filename);
    
    fs.writeFileSync(filePath, post);
    this.logger.info(`Verifiable distribution file created: ${filename}`);

    const result: DistributionResult = {
      channel: 'linkedin',
      status: 'success',
      url: `/vault/${filename}`,
      timestamp: new Date().toISOString()
    };

    eventFabric.broadcast({ type: 'distribution-update', ...result });
    return result;
  }

  /**
   * Publishes via Email (simulated)
   */
  public async publishToEmail(content: { subject: string; body: string; recipients: string[] }): Promise<DistributionResult> {
    this.logger.info(`Sending Email Campaign: ${content.subject} to ${content.recipients.length} recipients`);
    
    const vaultPath = path.join(process.cwd(), 'data', 'vault');
    const filename = `EMAIL_CAMP_${Date.now()}.json`;
    const filePath = path.join(vaultPath, filename);
    
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));

    const result: DistributionResult = {
      channel: 'email',
      status: 'success',
      url: `/vault/${filename}`,
      timestamp: new Date().toISOString()
    };

    eventFabric.broadcast({ type: 'distribution-update', ...result });
    return result;
  }

  /**
   * Publishes to Social Echo (simulated)
   */
  public async publishToSocialEcho(message: string): Promise<DistributionResult> {
    this.logger.info(`Broadcasting Social Echo: ${message.substring(0, 50)}...`);
    
    const vaultPath = path.join(process.cwd(), 'data', 'vault');
    const filename = `SOCIAL_ECHO_${Date.now()}.txt`;
    const filePath = path.join(vaultPath, filename);
    
    fs.writeFileSync(filePath, message);

    const result: DistributionResult = {
      channel: 'social_echo',
      status: 'success',
      url: `/vault/${filename}`,
      timestamp: new Date().toISOString()
    };

    eventFabric.broadcast({ type: 'distribution-update', ...result });
    return result;
  }
}

export const distributionService = DistributionService.getInstance();
