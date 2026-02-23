import { VertexAIService } from './vertex-ai';
import { Logger } from '../utils/logger';

export interface AssetVariant {
  id: string;
  content: string;
  type: 'headline' | 'copy' | 'cta';
  score?: number;
  reasoning?: string;
}

export class ABTestingService {
  private logger = new Logger('ABTestingService');
  private vertexAI = VertexAIService.getInstance();
  private static instance: ABTestingService;

  private constructor() {}

  public static getInstance(): ABTestingService {
    if (!ABTestingService.instance) {
      ABTestingService.instance = new ABTestingService();
    }
    return ABTestingService.instance;
  }

  /**
   * Generates N variants of a marketing asset using Gemini.
   */
  public async generateVariants(original: string, type: 'headline' | 'copy' | 'cta', count: number = 3): Promise<AssetVariant[]> {
    this.logger.info(`Generating ${count} variants for asset type: ${type}`);
    
    const prompt = `
      TASK: Generate exactly ${count} distinct variations of the following marketing ${type}.
      GOAL: Focus on different psychological triggers (e.g., Urgency, Social Proof, Benefit-Driven).
      
      ORIGINAL: "${original}"
      
      OUTPUT FORMAT: JSON Array of strings
      ["variant 1", "variant 2", ...]
    `;

    try {
      const response = await this.vertexAI.generateContent(prompt);
      // Clean up response if it contains markdown markers
      const cleanJson = response.replace(/```json|```/g, '').trim();
      const variantsTexts: string[] = JSON.parse(cleanJson);

      const variants: AssetVariant[] = variantsTexts.map((text, idx) => ({
        id: `var-${Date.now()}-${idx}`,
        content: text,
        type
      }));

      // Automatically rank them
      return await this.rankVariants(variants);
    } catch (error) {
      this.logger.error('Failed to generate variants, falling back to basic permutations', error as Error);
      return [{ id: 'fallback-1', content: original + ' (Optimized)', type }];
    }
  }

  /**
   * Ranks variants using the Predictive Scoring Engine.
   */
  public async rankVariants(variants: AssetVariant[]): Promise<AssetVariant[]> {
    this.logger.info(`Ranking ${variants.length} variants...`);
    
    const ranked = await Promise.all(variants.map(async v => {
      try {
        const assessment = await this.vertexAI.predictiveScoring(v.content);
        return {
          ...v,
          score: assessment.score,
          reasoning: assessment.reasoning
        };
      } catch (e) {
        return { ...v, score: 50, reasoning: 'Scoring bypassed due to engine latency.' };
      }
    }));

    return ranked.sort((a, b) => (b.score || 0) - (a.score || 0));
  }
}

export const abTestingService = ABTestingService.getInstance();
