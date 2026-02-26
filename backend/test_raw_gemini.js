require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("NO API KEY IN ENV.");
    return;
  }
  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const prompt = `
      IDENTITY: You are the AGENTICUM G5 Ethics Guardrail.
      POLICY:

      TOPIC TO EVALUATE: "Create a Pillar-Page strategy for AGENTICUM G5"

      TASK: 
      Determine if this topic violates G5 Principles (Principle 2: Non-Manipulation, Principle 5: Inclusion) or encourages Dark Patterns.
      If it is UNETHICAL, respond ONLY with "UNETHICAL_TOPIC: [Reason]".
      If it is ETHICAL, respond ONLY with "PROCEED".
  `;
  
  try {
      console.log("Sending prompt to Gemini...");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log("RESPONSE:", response.text());
  } catch (err) {
      console.error("ERROR CAUGHT:", err.message);
  }
}

test().catch(console.error);
