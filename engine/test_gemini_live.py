import asyncio
import time
import os
from google import genai

# Fetch API Key from env
API_KEY = os.environ.get("GEMINI_API_KEY")

async def test_latency():
    if not API_KEY:
        print("Error: GEMINI_API_KEY not found in environment.")
        return

    print("--- GenIUS G5: Gemini Live Latency Benchmark ---")
    client = genai.Client(api_key=API_KEY, http_options={'api_version': 'v1alpha'})
    
    try:
        start = time.time()
        # Connect to the live model
        async with client.aio.live.connect(model="gemini-2.0-flash-exp") as session:
            # Send a small probe content
            await session.send("ping", end_of_turn=True)
            
            async for response in session.receive():
                if response.text:
                    latency = (time.time() - start) * 1000
                    print(f"TTFT (Time To First Token): {latency:.0f}ms")
                    
                    if latency < 800:
                        print("STATUS: ✅ PERFORMANCE OPTIMAL (< 800ms)")
                    else:
                        print("STATUS: ⚠️ LATENCY ABOVE THRESHOLD (> 800ms)")
                        print("ADVISORY: Reduce audio chunk size to 512 bytes or check regional routing.")
                    break
    except Exception as e:
        print(f"Benchmark Failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_latency())
