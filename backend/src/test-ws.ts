import WebSocket from 'ws';

// const URL = 'wss://genIUS-backend-697051612685.europe-west1.run.app';
const URL = 'ws://localhost:8080'; // Alternativ für lokales Testing

console.log(`🚀 Connecting to GenIUS Neural Fabric at ${URL}...`);

const ws = new WebSocket(URL);

ws.on('open', () => {
  console.log('✅ Connection established!');
  
  const testMessage = {
    type: 'start',
    input: 'Build a viral marketing campaign for a new luxury space hotel.'
  };

  console.log('📤 Sending test brief:', testMessage.input);
  ws.send(JSON.stringify(testMessage));
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  console.log('📥 Received from Neural Fabric:', JSON.stringify(message, null, 2));

  if (message.type === 'status' && message.agent && message.agent.state === 'done') {
    console.log('✨ SN-00 finalized the plan. Test successful!');
    ws.close();
  }
});

ws.on('error', (err) => {
  console.error('❌ WebSocket Error:', err);
});

ws.on('close', () => {
  console.log('🔌 Connection closed.');
  process.exit(0);
});
