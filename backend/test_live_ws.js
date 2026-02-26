const WebSocket = require('ws');
require('dotenv').config();

async function testWebSocket() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
      console.log("No API Key");
      return;
  }

  const host = 'generativelanguage.googleapis.com';
  const path = '/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';
  const uri = `wss://${host}${path}?key=${apiKey}`;

  console.log("Connecting to:", uri.substring(0, 50) + "...");
  const ws = new WebSocket(uri);

  ws.on('open', () => {
    console.log("WS OPENED - THIS SHOULD NOT HAPPEN IF 403 IS FORCED.");
    ws.send(JSON.stringify({
      setup: {
        model: 'models/gemini-2.0-flash-exp'
      }
    }));
  });

  ws.on('message', (data) => {
    console.log("WS MESSAGE:", data.toString());
    ws.close();
  });

  ws.on('error', (err) => {
    console.error("WS ERROR:", err.message);
  });

  ws.on('unexpected-response', (request, response) => {
      console.error("WS REJECTED WITH STATUS:", response.statusCode);
      response.on('data', (chunk) => {
          console.error("REJECTION BODY:", chunk.toString());
      });
  });
  
  ws.on('close', (code, reason) => {
      console.log(`WS CLOSED: ${code} - ${reason.toString()}`);
  });
}

testWebSocket();
