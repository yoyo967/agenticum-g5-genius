import { VertexAIService } from './services/vertex-ai';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '../.env') });

async function runCreativeTest() {
  console.log('--- Initiating Phase 8C Creative Engine Test ---');
  const ai = VertexAIService.getInstance();

  try {
    console.log('\n[1/2] Testing Imagen 3 Image Generation...');
    const imageUrl = await ai.generateImage('A futuristic neural network core pulsates with neon cyan energy in a dark obsidian bento-grid laboratory');
    console.log('Image Result:', imageUrl.startsWith('data:image') ? 'Data URI (Success)' : imageUrl);

    console.log('\n[2/2] Testing Veo Video Generation Simulation...');
    const videoUrl = await ai.generateVideo('A cinematic 6s tracking shot through a digital synapse corridor, hyper-realistic, 8k');
    console.log('Video Result:', videoUrl);

    console.log('\n--- Creative Engine Test Complete ---');
  } catch (e) {
    console.error('Creative test failed:', e);
  }
}

runCreativeTest();
