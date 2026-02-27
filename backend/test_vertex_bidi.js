const { VertexAI } = require('@google-cloud/vertexai');

async function testBidiStreaming() {
  const project = 'online-marketing-manager';
  const location = 'europe-west1';
  
  const vertexAI = new VertexAI({ project, location });
  const model = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  console.log("Connecting Bidi Stream to gemini-2.0-flash...");
  
  try {
    const chat = model.startChat({});
    console.log("Chat initialized.");
    
    // Test stream capability
    const result = await chat.sendMessageStream([{text: "Testing streaming connection in EU with stable model..."}]);
    for await (const chunk of result.stream) {
        if(chunk.candidates && chunk.candidates.length > 0) {
           console.log("CHUNK:", chunk.candidates[0].content.parts[0].text);
        }
    }

  } catch (err) {
      console.error("FAIL:", err.message);
  }
}

testBidiStreaming().catch(console.error);
