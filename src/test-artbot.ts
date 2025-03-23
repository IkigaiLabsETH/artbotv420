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
import { bearConceptGenerator } from './generators/BearConceptGenerator';
import { EnhancedRefinerAgent } from './agents/EnhancedRefinerAgent';

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
  console.log('│         ArtBot Magritte Generator         │');
  console.log('╰───────────────────────────────────────────╯');
  
  try {
    // Create AI service
    const aiService = new AIService({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY
    });
    
    // Create Replicate service with optimized parameters
    const replicateService = new ReplicateService({
      apiKey: process.env.REPLICATE_API_KEY,
      defaultModel: 'black-forest-labs/flux-1.1-pro', 
      defaultWidth: 2048,
      defaultHeight: 2048,
      defaultNumInferenceSteps: 35,
      defaultGuidanceScale: 4.0
    });
    
    // Initialize services
    await aiService.initialize();
    await replicateService.initialize();
    
    // Create the multi-agent system
    const system = new ArtBotMultiAgentSystem({
      aiService, 
      replicateService,
      outputDir: path.join(process.cwd(), 'output', 'magritte-bears')
    });
    
    // Create and register the Ideator agent
    const ideatorAgent = new IdeatorAgent(aiService);
    system.registerAgent(ideatorAgent);
    
    // Create and register the Stylist agent
    const stylistAgent = new StylistAgent(aiService);
    system.registerAgent(stylistAgent);
    
    // Create and register the Enhanced Refiner agent instead of basic Refiner
    const refinerAgent = new EnhancedRefinerAgent(aiService);
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
    
    // Parse command line arguments for generation options
    const options = {
      useDefault: process.argv.includes('--default'),
      forceBowlerHat: process.argv.includes('--bowler'),
      enhanceMagritte: process.argv.includes('--enhance'),
      highQuality: process.argv.includes('--hq'),
      concept: process.argv.find(arg => arg.startsWith('--concept='))?.split('=')[1]
    };
    
    // Generate concept based on options
    const concept = options.useDefault 
      ? 'a distinguished bear portrait with a bowler hat in the style of René Magritte, with careful attention to surface quality and precise edge control'
      : options.concept || bearConceptGenerator.generateBearConcept({ 
          forceBowlerHat: options.forceBowlerHat
        });
    
    // Define a test project with enhanced options
    const testProject = {
      title: 'Magritte Bear Portrait',
      description: 'A distinguished bear in Magritte surrealist style',
      concept,
      style: 'bear_pfp',
      outputFilename: `magritte_bear_${Date.now()}`,
      requirements: [
        'Generate high-quality Magritte-style image',
        'Follow surrealist style guidelines',
        'Create a visually appealing composition with philosophical elements',
        'Maintain painterly precision and surface quality',
        'Ensure proper composition for profile use'
      ],
      artDirection: {
        enhanceMagritte: options.enhanceMagritte,
        focusOnSurfaceQuality: true,
        preferredColors: ['Belgian sky blue', 'deep prussian', 'rich mahogany'],
        highQuality: options.highQuality,
        modelParams: {
          inferenceSteps: options.highQuality ? 40 : 35,
          guidanceScale: options.highQuality ? 4.5 : 4.0
        }
      }
    };
    
    console.log('╭───────────────────────────────────────────╮');
    console.log(`│ 🎨 Generating: ${testProject.concept.substring(0, 25).padEnd(25)} │`);
    console.log(`│ 🖌️ Style: ${testProject.style.substring(0, 30).padEnd(30)} │`);
    if (options.enhanceMagritte) console.log('│ ✓ Enhanced Magritte Mode Enabled             │');
    if (options.highQuality) console.log('│ ✓ High Quality Mode Enabled                  │');
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