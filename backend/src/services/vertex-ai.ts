import { VertexAI, GenerativeModel } from '@google-cloud/vertexai';
import { Logger } from '../utils/logger';

export class VertexAIService {
  private vertexAI: VertexAI;
  private model: GenerativeModel;
  private logger: Logger;

  private static instance: VertexAIService;

  private constructor() {
    this.logger = new Logger('VertexAI');
    const project = process.env.GOOGLE_CLOUD_PROJECT || 'online-marketing-manager';
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'europe-west1';
    
    this.vertexAI = new VertexAI({ project, location });
    this.model = this.vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash-001',
    });
  }

  public static getInstance(): VertexAIService {
    if (!VertexAIService.instance) {
      VertexAIService.instance = new VertexAIService();
    }
    return VertexAIService.instance;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      this.logger.info(`Generating content for prompt: ${prompt.substring(0, 50)}...`);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.candidates?.[0].content.parts[0].text || '';
    } catch (error) {
      this.logger.error('Error generating content', error as Error);
      throw error;
    }
  }

  async generateImage(prompt: string): Promise<string> {
    // This will be implemented using the Imagen 3 endpoint on Vertex AI
    this.logger.info(`Requesting Image Generation: ${prompt.substring(0, 50)}...`);
    // Placeholder returning a mock GCS URL for now
    return `https://storage.googleapis.com/online-marketing-manager-genius-assets/mock-${Date.now()}.png`;
  }
}
