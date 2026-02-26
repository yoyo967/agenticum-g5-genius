const { VertexAI } = require('@google-cloud/vertexai');

async function test() {
  const project = 'online-marketing-manager';
  const location = 'europe-west1'; // Actually I should test both us-central1 and europe-west1
  
  const vertexAI = new VertexAI({ project, location: 'us-central1' });
  const model = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const prompt = "Determine if this topic violates G5 Principles: 'Create a Pillar-Page strategy for AGENTICUM G5'. If UNETHICAL, respond UNETHICAL_TOPIC. If ETHICAL, respond PROCEED.";

  try {
      console.log("Calling Vertex AI SDK (us-central1)...");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log("SUCCESS. Output:", response.candidates[0].content.parts[0].text);
  } catch (err) {
      console.error("FAIL in Vertex AI SDK:", err.message);
  }
}

test().catch(console.error);
