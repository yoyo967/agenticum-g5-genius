import { VertexAIService } from './vertex-ai';
import { Logger } from '../utils/logger';
import { db, Collections } from './firestore';
import { GoogleGenAI } from '@google/genai';

export interface StoryboardShot {
  shotNumber: number;
  visualPrompt: string;
  audioDescription: string;
  durationSec: number;
  mood: string;
}

export interface CinematicAsset {
  id: string;
  topic: string;
  storyboard: StoryboardShot[];
  status: 'planning' | 'rendering' | 'complete';
  createdAt: string;
  clientId: string;
}

export class CinematicService {
  private logger = new Logger('CinematicService');
  private vertexAI = VertexAIService.getInstance();
  private static instance: CinematicService;

  private constructor() {}

  public static getInstance(): CinematicService {
    if (!CinematicService.instance) {
      CinematicService.instance = new CinematicService();
    }
    return CinematicService.instance;
  }

  /**
   * Generates a 5-shot storyboard for a given topic
   */
  public async forgeStoryboard(topic: string, clientId: string = 'default-client'): Promise<CinematicAsset> {
    this.logger.info(`Forging cinematic storyboard for topic: ${topic}`);

    const prompt = `
      IDENTITY: You are the GenIUS Cinematic Director.
      TASK: Create a detailed 5-shot storyboard for a high-end promotional video about: "${topic}".
      
      STRUCTURE:
      For each of the 5 shots, provide:
      1. Visual Prompt (for an image generator)
      2. Audio Description (Voiceover or Sound Effects)
      3. Duration in seconds
      4. Mood (e.g., Epic, Tech-Noir, Minimalist)
      
      OUTPUT FORMAT: JSON
      {
        "storyboard": [
          {
            "shotNumber": number,
            "visualPrompt": "string",
            "audioDescription": "string",
            "durationSec": number,
            "mood": "string"
          }
        ]
      }
    `;

    try {
      // Use the internal VertexAIService check for API keys or fallback
      const responseText = await this.vertexAI.generateContent(prompt);
      
      // Clean possible markdown backticks
      const cleanJson = responseText.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson);

      const cinematic: CinematicAsset = {
        id: `cinematic-${Date.now()}`,
        topic,
        storyboard: data.storyboard,
        status: 'complete', // Simulated rendering completes immediately for the demo
        createdAt: new Date().toISOString(),
        clientId
      };

      // Persist to Firestore
      await db.collection('cinematic_assets').doc(cinematic.id).set(cinematic);
      
      return cinematic;
    } catch (error) {
      this.logger.error('Cinematic Forge failed', error as Error);
      throw new Error('Cinematic Engine Failure: ' + (error as Error).message);
    }
  }

  public async getCinematicAssets(clientId: string): Promise<CinematicAsset[]> {
    const snapshot = await db.collection('cinematic_assets')
      .where('clientId', '==', clientId)
      .orderBy('createdAt', 'desc')
      .get();
      
    return snapshot.docs.map(doc => doc.data() as CinematicAsset);
  }
}

export const cinematicService = CinematicService.getInstance();
