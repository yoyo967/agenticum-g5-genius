const WebSocket = require('ws');
const { GoogleAuth } = require('google-auth-library');

async function testWebSocket() {
  const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  try {
      console.log("Fetching Google Cloud Access Token...");
      const client = await auth.getClient();
      const accessToken = await client.getAccessToken();
      const token = accessToken.token;
      
      const project = 'online-marketing-manager';
      const location = 'europe-west1';
      // Use the stable model, not experimental, as it exists in Europe!
      const model = 'gemini-2.0-flash';

      const host = `${location}-aiplatform.googleapis.com`;
      const path = `/ws/google.cloud.aiplatform.v1beta1.LlmUtilityService/BidiGenerateContent`;
      const uri = `wss://${host}${path}`;

      console.log("Connecting Bidi WebSocket to:", uri);
      const ws = new WebSocket(uri, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

      ws.on('open', () => {
        console.log("WS OPENED - Auth Success!");
        ws.send(JSON.stringify({
          clientContent: {
            turns: [
               { role: 'user', parts: [{ text: "Hello Gemini, this is a raw websocket test." }] }
            ],
            turnComplete: true
          }
        }));
      });

      ws.on('message', (data) => {
        console.log("WS MESSAGE:", data.toString().substring(0, 300));
        ws.close();
      });

      ws.on('error', (err) => {
        console.error("WS ERROR:", err.message);
      });

      ws.on('unexpected-response', (request, response) => {
          console.error("WS REJECTED WITH STATUS:", response.statusCode);
      });
      
      ws.on('close', (code, reason) => {
          console.log(`WS CLOSED: ${code} - ${reason.toString()}`);
      });

  } catch (err) {
      console.error("Auth / Execution error:", err);
  }
}

testWebSocket();
