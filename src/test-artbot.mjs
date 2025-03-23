/**
 * Simple test script for ArtBot
 * This file is for testing purposes only
 */

import dotenv from 'dotenv';
import { ArtBotMultiAgentSystem } from '../dist/artbot-multiagent-system.js';
import { AIService } from './services/ai/index.js';
import { ReplicateService } from './services/replicate/index.js';
import { AgentLogger, LogLevel } from '../dist/utils/agentLogger.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Configure the logger to show more detailed information
AgentLogger.configure({
  enabled: true,
  logToConsole: true,
  level: LogLevel.DEBUG,
  colorize: true,
  showTimestamp: true
});

// Check environment variables
if (!process.env.REPLICATE_API_KEY) {
  console.error('❌ REPLICATE_API_KEY environment variable is required');
  process.exit(1);
}

async function runTest() {
  try {
    console.log('🔍 Starting ArtBot test...');

    // Initialize services
    const aiService = new AIService({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY,
    });
    
    await aiService.initialize();
    console.log('✅ AI Service initialized');
    
    const replicateService = new ReplicateService({
      apiKey: process.env.REPLICATE_API_KEY,
      defaultModel: 'black-forest-labs/flux-1.1-pro',
      defaultWidth: 1024,
      defaultHeight: 1024
    });
    
    await replicateService.initialize();
    console.log('✅ Replicate Service initialized');
    
    // Create the ArtBot system
    const artBotSystem = new ArtBotMultiAgentSystem({
      aiService,
      replicateService,
      outputDir: path.join(process.cwd(), 'output')
    });
    
    // Initialize the system
    await artBotSystem.initialize();
    console.log('✅ ArtBot system initialized');
    
    // Create a project
    const project = {
      title: 'Test Bear Portrait',
      concept: 'a distinguished bear portrait in profile wearing a vintage aviator cap',
      style: 'bear_pfp',
      description: 'A test of the refactored ArtBot system',
      requirements: [
        'Generate a high-quality bear portrait',
        'Use Magritte-inspired surrealist style',
        'Include distinguished bear features'
      ]
    };
    
    console.log(`\n🎨 Generating art for: "${project.concept}"`);
    console.log('This may take a few minutes...');
    
    // Run the project
    const result = await artBotSystem.runArtProject(project);
    
    // Check result
    if (result.success && result.artwork) {
      console.log('\n✅ Art generation successful!');
      console.log(`📷 Image URL: ${result.artwork.imageUrl}`);
      console.log(`📝 Output files:`);
      
      if (result.artwork.files) {
        console.log(`   - Prompt: ${result.artwork.files.prompt}`);
        console.log(`   - Image: ${result.artwork.files.image}`);
        console.log(`   - Metadata: ${result.artwork.files.metadata}`);
      }
      
      if (result.artwork.character) {
        console.log('\n👤 Character Information:');
        console.log(`   - Name: ${result.artwork.character.name}`);
        console.log(`   - Title: ${result.artwork.character.title}`);
        console.log(`   - Personality: ${result.artwork.character.personality.join(', ')}`);
      }
    } else {
      console.error('\n❌ Art generation failed:');
      console.error(result.error);
    }
    
    console.log('\n🏁 Test completed');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
runTest().catch(console.error); 