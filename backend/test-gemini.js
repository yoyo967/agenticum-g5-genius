const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'AIza...' });

async function run() {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: 'Say hello world'
    });
    console.log("SUCCESS:", response.text);
  } catch (e) {
    console.error("ERROR:");
    console.error(e);
  }
}
run();
