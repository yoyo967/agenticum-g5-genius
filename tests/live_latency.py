import asyncio
import websockets
import json
import time
import sys

# WSS endpoint for the Core Backend (Agenticum Node.js API)
WS_URL = "wss://agenticum-backend-697051612685.europe-west1.run.app/api/v1/genius/ws"

async def test_live_latency():
    print(f"[*] Connecting to GenIUS Live Event Fabric: {WS_URL}")
    start_time = time.time()
    
    try:
        async with websockets.connect(WS_URL) as websocket:
            connect_time = time.time() - start_time
            print(f"[+] Connected in {connect_time:.3f}s")
            
            # Simulate a voice command or text input to trigger Gemini Live
            payload = {
                "type": "client_message",
                "client_id": "latency_tester",
                "content": "SN-00, verify the Swarm latency. Go."
            }
            
            print(f"[*] Sending payload: {payload['content']}")
            send_time = time.time()
            await websocket.send(json.dumps(payload))
            
            # Wait for first response token
            print("[*] Waiting for TTFT (Time To First Token)...")
            response_json = await websocket.recv()
            
            ttft = time.time() - send_time
            print(f"[+] First Token Received!")
            print(f"    --> TTFT: {ttft:.3f} seconds")
            
            try:
                data = json.loads(response_json)
                print(f"[*] Parsed Response Role: {data.get('role', 'N/A')}")
                print(f"[*] Parsed Text Length: {len(data.get('text', ''))}")
            except:
                print(f"[*] Raw Response: {response_json[:100]}...")
            
    except Exception as e:
        print(f"[-] Connection failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(test_live_latency())
