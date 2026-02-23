import { VE01Director } from './agents/ve01-director';
import * as dotenv from 'dotenv';

dotenv.config();

async function runTest() {
  console.log('--- STARTING VIDEO SYNTHESIS TEST ---');
  const director = new VE01Director();
  
  const input = "Create a high-energy cinematic commercial for the AGENTICUM G5 OS, focusing on its speed, neural power, and the obsidian-gold aesthetic.";
  
  console.log(`Input: ${input}`);
  const result = await director.execute(input);
  
  console.log('\n--- SYNTHESIS RESULT ---');
  console.log(result);
  console.log('\n--- TEST FINISHED ---');
}

runTest().catch(console.error);
