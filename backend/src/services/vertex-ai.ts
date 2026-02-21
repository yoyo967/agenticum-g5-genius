import { GoogleGenAI } from '@google/genai';
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
      model: 'gemini-2.0-flash-thinking-exp-01-21',
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
    this.logger.info(`Requesting Image Generation from Imagen 3: ${prompt.substring(0, 50)}...`);
    
    // Check if we have the key, otherwise fallback gracefully
    if (!process.env.GEMINI_API_KEY) {
       this.logger.warn('No GEMINI_API_KEY found, returning placeholder mock for DA-03.');
       return `https://storage.googleapis.com/online-marketing-manager-genius-assets/mock-${Date.now()}.png`;
    }

    try {
      // Use the official Google Gen AI SDK for cross-model support
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // Imagen 3 requires exactly the right model string
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
          // Return a data URI so it renders instantly in the React markdown
          return `data:image/jpeg;base64,${b64}`;
      } else {
          throw new Error('No image bytes returned from Imagen 3.');
      }
    } catch (error) {
       this.logger.error('Imagen 3 generation failed', error as Error);
       return `https://storage.googleapis.com/online-marketing-manager-genius-assets/mock-${Date.now()}.png`;
    }
  }
}
