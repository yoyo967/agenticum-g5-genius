require('dotenv').config();
const { VertexAIService } = require('./src/services/vertex-ai');

async function test() {
  console.log("Starting diagnostic test of ArbiterGroundingAgent...");
  console.log("API Key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");

  const topic = "Create a Pillar-Page strategy for AGENTICUM G5";
  const guardPrompt = `
      IDENTITY: You are the AGENTICUM G5 Ethics Guardrail.
      POLICY:
      

      TOPIC TO EVALUATE: "${topic}"

      TASK: 
      Determine if this topic violates G5 Principles (Principle 2: Non-Manipulation, Principle 5: Inclusion) or encourages Dark Patterns.
      If it is UNETHICAL, respond ONLY with "UNETHICAL_TOPIC: [Reason]".
      If it is ETHICAL, respond ONLY with "PROCEED".
    `;

  const ai = VertexAIService.getInstance();
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
