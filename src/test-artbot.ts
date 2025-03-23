/**
 * Test script for ArtBot
 * Run with: npm start
 */

import * as dotenv from 'dotenv';
import path from 'path';
import { ArtBotMultiAgentSystem } from './artbot-multiagent-system';
import { ElizaLogger, LogLevel } from './utils/elizaLogger';
import { AIService } from './services/ai';
import { ReplicateService } from './services/replicate';
import { IdeatorAgent } from './agents/IdeatorAgent';
import { StylistAgent } from './agents/StylistAgent';
import { RefinerAgent } from './agents/RefinerAgent';
import { CharacterGeneratorAgent } from './agents/CharacterGeneratorAgent';

// Load environment variables
dotenv.config();

// Check for required API key
if (!process.env.REPLICATE_API_KEY) {
  console.error('Error: REPLICATE_API_KEY environment variable is required.');
  console.error('Please create a .env file with your Replicate API key.');
  process.exit(1);
}

async function main() {
  console.log('╭───────────────────────────────────────────╮');
  console.log('│           ArtBot Test Script              │');
  console.log('╰───────────────────────────────────────────╯');
  
  try {
    // Create AI service
    const aiService = new AIService({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY
    });
    
    // Create Replicate service
    const replicateService = new ReplicateService({
      apiKey: process.env.REPLICATE_API_KEY,
      defaultModel: 'black-forest-labs/flux-1.1-pro', 
      defaultWidth: 1024,
      defaultHeight: 1024,
      defaultNumInferenceSteps: 28,
      defaultGuidanceScale: 3.0
    });
    
    // Initialize services
    await aiService.initialize();
    await replicateService.initialize();
    
    // Create the multi-agent system
    const system = new ArtBotMultiAgentSystem({
      aiService, 
      replicateService,
      outputDir: path.join(process.cwd(), 'output', 'test')
    });
    
    // Create and register the Ideator agent
    const ideatorAgent = new IdeatorAgent(aiService);
    system.registerAgent(ideatorAgent);
    
    // Create and register the Stylist agent
    const stylistAgent = new StylistAgent(aiService);
    system.registerAgent(stylistAgent);
    
    // Create and register the Refiner agent
    const refinerAgent = new RefinerAgent(aiService);
    system.registerAgent(refinerAgent);
    
    // Create and register the Character Generator agent
    const characterGeneratorAgent = new CharacterGeneratorAgent(aiService);
    system.registerAgent(characterGeneratorAgent);
    
    // Log registered agents
    console.log('╭───────────────────────────────────────────╮');
    console.log('│ Registered Agents:                        │');
    system.getAllAgents().forEach(agent => {
      console.log(`│ - ${agent.role} (${agent.id})                 │`);
    });
    console.log('╰───────────────────────────────────────────╯');
    
    // Initialize the system
    await system.initialize();
    
    // Define a test project
    const testProject = {
      title: 'Test Bear Portrait',
      description: 'A test of the ArtBot multi-agent system',
      concept: process.argv[2] || 'a distinguished bear portrait with a bowler hat in the style of René Magritte',
      style: 'bear_pfp',
      outputFilename: 'test_bear',
      requirements: [
        'Generate high-quality image',
        'Follow style guidelines',
        'Create a visually appealing composition'
      ]
    };
    
    console.log('╭───────────────────────────────────────────╮');
    console.log(`│ 🎨 Generating: ${testProject.concept.substring(0, 25).padEnd(25)} │`);
    console.log(`│ 🖌️ Style: ${testProject.style.substring(0, 30).padEnd(30)} │`);
    console.log('╰───────────────────────────────────────────╯');
    
    // Run the project
    const result = await system.runArtProject(testProject);
    
    // Check the result
    if (result.success) {
      console.log('╭───────────────────────────────────────────╮');
      console.log('│ ✓ Generation Complete                     │');
      console.log(`│ 🖼️ Image: ${result.artwork.imageUrl}            │`);
      console.log(`│ 📁 Saved to: ${result.artwork.files.image}      │`);
      console.log('╰───────────────────────────────────────────╯');
    } else {
      console.error('╭───────────────────────────────────────────╮');
      console.error('│ ✗ Generation Failed                       │');
      console.error(`│ Error: ${result.error?.message || 'Unknown error'} │`);
      console.error('╰───────────────────────────────────────────╯');
    }
  } catch (error) {
    console.error('Error running test:', error);
  }
}

// Run the test
main().catch(console.error); 