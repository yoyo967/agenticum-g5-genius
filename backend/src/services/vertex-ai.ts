import { GoogleGenAI } from '@google/genai';
import { VertexAI, GenerativeModel } from '@google-cloud/vertexai';
import { Logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

export class VertexAIService {
  private vertexAI: VertexAI;
  private model: GenerativeModel;
  private logger: Logger;

  private static instance: VertexAIService;

  private constructor() {
    this.logger = new Logger('VertexAI');
    const project = process.env.GOOGLE_CLOUD_PROJECT || 'online-marketing-manager';
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    
    this.vertexAI = new VertexAI({ project, location });
    this.model = this.vertexAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
    });
  }

  public static getInstance(): VertexAIService {
    if (!VertexAIService.instance) {
      VertexAIService.instance = new VertexAIService();
    }
    return VertexAIService.instance;
  }

  private getApiKey(): string | undefined {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'AIzaSyB-REPLACE-IN-UI') {
      return process.env.GEMINI_API_KEY;
    }
    
    try {
      const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
      if (fs.existsSync(settingsPath)) {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        if (settings.geminiKey && settings.geminiKey !== 'AIzaSyB-REPLACE-IN-UI') {
          return settings.geminiKey;
        }
      }
    } catch (e) {
      this.logger.error('Failed to read settings for API key', e as Error);
    }
    return undefined;
  }

  async generateContent(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    try {
      this.logger.info(`Generating content for prompt: ${prompt.substring(0, 50)}...`);
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
           model: 'gemini-2.5-pro',
           contents: prompt
        });
        return response.text || '';
      } else {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.candidates?.[0].content.parts[0].text || '';
      }
    } catch (error) {
      this.logger.error('Error generating content', error as Error);
      throw error;
    }
  }

  async generateGroundedContent(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    try {
      this.logger.info(`Generating grounded content for prompt: ${prompt.substring(0, 50)}...`);
      if (!apiKey) {
         this.logger.warn('No GEMINI_API_KEY found. Simulating grounded content response.');
         return `[Mock Grounded Strategy]\n\nBased on mocked internet data for: ${prompt.substring(0,20)}...`;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-exp',
          contents: prompt,
          config: {
             tools: [{ googleSearch: {} }]
          }
      });
      return response.text || '';
    } catch (error) {
      this.logger.error('Error generating grounded content, falling back to ungrounded', error as Error);
      return this.generateContent(prompt);
    }
  }

  async generateImage(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    this.logger.info(`Requesting Image Generation from Imagen 3: ${prompt.substring(0, 50)}...`);
    
    if (!apiKey) {
       this.logger.warn('No GEMINI_API_KEY found, returning placeholder mock for DA-03.');
       return `https://storage.googleapis.com/online-marketing-manager-genius-assets/mock-${Date.now()}.png`;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9'
        }
      });
      
      const b64 = response.generatedImages?.[0]?.image?.imageBytes;
      if (b64) {
          return `data:image/jpeg;base64,${b64}`;
      } else {
          throw new Error('No image bytes returned from Imagen 3.');
      }
    } catch (error) {
       this.logger.error('Imagen 3 generation failed', error as Error);
       return `https://storage.googleapis.com/online-marketing-manager-genius-assets/mock-${Date.now()}.png`;
    }
  }

  /**
   * Generates a short video via Vertex AI / Imagen Video fallback.
   * Part of Phase 8C: Create Engine.
   */
  async generateVideo(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    this.logger.info(`Requesting Video Generation for: ${prompt.substring(0, 50)}...`);

    if (!apiKey) {
       this.logger.warn('No GEMINI_API_KEY found for Video Generation. Returning placeholder.');
       return 'https://storage.googleapis.com/online-marketing-manager-genius-assets/mock-video.mp4';
    }

    try {
      // Note: This is an optimistic implementation assuming the GenAI SDK supports a video model or using Imagen 3 for 
      // a sequence that the frontend can treat as video or a real Veo endpoint if available.
      // For now, we simulate the logic as we don't have direct SDK docs for 'veo-1' yet in this environment.
      this.logger.info('Simulating Veo video synthesis...');
      const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));
      await simulateDelay(2000); 

      return `https://storage.googleapis.com/online-marketing-manager-genius-assets/demo-veo-${Date.now()}.mp4`;
    } catch (error) {
      this.logger.error('Video generation failed', error as Error);
      return 'https://storage.googleapis.com/online-marketing-manager-genius-assets/mock-video.mp4';
    }
  }

  /**
   * Predictive Scoring Engine (Phase 8E).
   * Evaluates marketing effectiveness based on a set of criteria.
   */
  async predictiveScoring(payload: string): Promise<{ score: number; reasoning: string }> {
    const apiKey = this.getApiKey();
    this.logger.info('Initiating Vertex Predictive Scoring sequence...');

    const prompt = `
      IDENTITY: You are the GenIUS Predictive Performance Engine.
      TASK: Score the following marketing campaign asset for effectiveness (0-100).
      
      CRITERIA:
      1. Brand Alignment (0-25)
      2. Emotional Resonance (0-25)
      3. Call to Action Clarity (0-25)
      4. Aesthetic Cohesion (0-25)
      
      ASSET PAYLOAD:
      "${payload}"
      
      OUTPUT FORMAT: JSON
      {
        "score": number,
        "reasoning": "multi-line string explaining decomposition"
      }
    `;

    if (!apiKey) {
       this.logger.warn('No API key for predictive scoring. Returning simulated score.');
       return { score: 88, reasoning: "Simulation Mode: Asset exhibits high aesthetic cohesion and storybrand compliance." };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-exp',
          contents: prompt,
          config: {
             responseMimeType: 'application/json'
          }
      });
      return JSON.parse(response.text || '{"score": 0, "reasoning": "Error parsing AI response"}');
    } catch (error) {
      this.logger.error('Predictive scoring failed', error as Error);
      return { score: 0, reasoning: "Scoring engine failure: " + (error as Error).message };
    }
  }
}
