import { VertexAIService } from './src/services/vertex-ai';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log("Starting VertexAIService fallback test...");
  const ai = VertexAIService.getInstance();
  
  const guardPrompt = `
      IDENTITY: You are the AGENTICUM G5 Ethics Guardrail.
      POLICY:
      TOPIC TO EVALUATE: "Create a Pillar-Page strategy for AGENTICUM G5"
      TASK: 
      Determine if this topic violates G5 Principles...
      If it is UNETHICAL, respond ONLY with "UNETHICAL_TOPIC: [Reason]".
      If it is ETHICAL, respond ONLY with "PROCEED".
  `;
  try {
      console.log("Calling generateContent...");
      const result = await ai.generateContent(guardPrompt);
      console.log("SUCCESS. Output:", result);
  } catch (err) {
      console.error("FAIL in generateContent:", err.message);
      console.error(err);
  }
}

test().catch(console.error);
