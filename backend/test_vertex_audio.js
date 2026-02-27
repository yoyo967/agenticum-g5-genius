const { VertexAI } = require('@google-cloud/vertexai');

async function testAudioTranscription() {
  const project = 'online-marketing-manager';
  const location = 'europe-west1';
  
  const vertexAI = new VertexAI({ project, location });
  const model = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  console.log("Testing Vertex AI Audio capability with gemini-2.0-flash...");
  
  try {
    // Generate a dummy silent PCM16 buffer for testing
    // 16000 Hz, 1 sec = 32000 bytes
    const dummyBuffer = Buffer.alloc(32000, 0);
    const base64Audio = dummyBuffer.toString('base64');
    
    console.log("Sending dummy audio chunk (audio/pcm)...");
    const request = {
       contents: [
         {
           role: 'user',
           parts: [
              {
                inlineData: {
                  mimeType: 'audio/pcm;rate=16000', 
                  data: base64Audio
                }
              },
              { text: "Accurately transcribe the audio." }
           ]
         }
       ]
    };
    
    const result = await model.generateContent(request);
    console.log("Response:", JSON.stringify(result.response, null, 2));

  } catch (err) {
      console.error("FAIL:", err.message);
  }
}

testAudioTranscription().catch(console.error);
