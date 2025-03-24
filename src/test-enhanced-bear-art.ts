/**
 * Test script to generate art using the enhanced bear prompt generator
 */

import { EnhancedBearPromptGenerator } from './generators/EnhancedBearPromptGenerator';
import { ArtBotMultiAgentSystem } from './artbot-multiagent-system';
import { AIService } from './services/ai';
import { ReplicateService } from './services/replicate';
import { StyleIntegrationService } from './services/style/StyleIntegrationService';
import * as fs from 'fs';
import * as path from 'path';
import { AgentLogger, LogLevel } from './utils/agentLogger';
import { AgentRole } from './agents/types';
// We no longer need to import specific agent implementations
// as they will be automatically registered

// Create enhanced prompt generator
const promptGenerator = new EnhancedBearPromptGenerator();

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  forceBowlerHat: args.includes('--bowler'),
  seriesId: args.find(arg => arg.startsWith('--series='))?.split('=')[1],
  outputDir: args.find(arg => arg.startsWith('--output='))?.split('=')[1] || 'output/enhanced-bear',
  count: parseInt(args.find(arg => arg.startsWith('--count='))?.split('=')[1] || '1'),
  replicateApiKey: process.env.REPLICATE_API_TOKEN || args.find(arg => arg.startsWith('--api-key='))?.split('=')[1],
  skipGeneration: args.includes('--skip-generation')
};

// Function to print formatted message
function printHeader(message: string) {
  console.log('\n' + '╭' + '─'.repeat(98) + '╮');
  console.log('│ ' + message.padEnd(97) + '│');
  console.log('╰' + '─'.repeat(98) + '╯');
}

// Main function
async function main() {
  printHeader('ENHANCED BEAR PORTRAIT ART GENERATOR');
  
  // Initialize services
  const aiService = new AIService();
  const replicateService = new ReplicateService({ 
    apiKey: options.replicateApiKey 
  });
  const styleService = new StyleIntegrationService(aiService);
  
  // Create multi-agent system
  const artBot = new ArtBotMultiAgentSystem({
    aiService,
    replicateService,
    styleIntegrationService: styleService,
    outputDir: options.outputDir
  });
  
  // Ensure output directory exists
  if (!fs.existsSync(options.outputDir)) {
    fs.mkdirSync(options.outputDir, { recursive: true });
  }
  
  // Initialize the system with automatic agent registration
  await artBot.initialize();
  
  // Log all registered agents
  console.log('\nRegistered Agents:');
  artBot.getAllAgents().forEach(agent => {
    console.log(`- ${agent.role} (${agent.id.substring(0, 8)})`);
  });
  
  // Generate prompt using our enhanced generator
  console.log('\nGenerating enhanced bear portrait prompt...');
  const prompt = promptGenerator.generatePortraitPrompt({
    forceBowlerHat: options.forceBowlerHat,
    seriesId: options.seriesId
  });
  
  // Log the generated prompt
  console.log('\n' + '═'.repeat(100));
  console.log('ENHANCED BEAR PORTRAIT PROMPT:');
  console.log('═'.repeat(100));
  console.log(prompt);
  console.log('═'.repeat(100));
  
  // Save the prompt to a file in the output directory
  const timestamp = Date.now();
  const promptFilename = `enhanced-bear-${timestamp}-prompt.txt`;
  const promptPath = path.join(options.outputDir, promptFilename);
  fs.writeFileSync(promptPath, prompt);
  console.log(`Prompt saved to: ${promptPath}`);
  
  // Skip image generation if requested
  if (options.skipGeneration) {
    console.log('\nSkipping image generation as requested.');
    return;
  }
  
  // Check if we have a Replicate API key
  if (!options.replicateApiKey) {
    console.log('\n⚠️ No Replicate API key provided. Skipping image generation.');
    console.log('To generate images, please provide a Replicate API key:');
    console.log('  - Set the REPLICATE_API_TOKEN environment variable');
    console.log('  - Or pass the --api-key=your_key argument');
    return;
  }
  
  // Generate artwork(s)
  for (let i = 0; i < options.count; i++) {
    const projectName = `Enhanced Bear Portrait ${timestamp}`;
    console.log(`\nGenerating artwork ${i+1}/${options.count}: ${projectName}`);
    
    // Run art generation project
    const result = await artBot.runArtProject({
      title: projectName,
      concept: prompt,
      style: 'bear_pfp',
      outputFilename: `enhanced-bear-${timestamp}`,
      useEnhancedBearGenerator: true,
      artDirection: {
        highQuality: true,
        modelParams: {
          inferenceSteps: 40,
          guidanceScale: 4.5
        }
      }
    });
    
    // Check result
    if (result.success) {
      console.log(`\n✅ Successfully generated artwork: ${result.imageUrl}`);
      console.log(`   Saved to: ${result.outputPath}`);
    } else {
      console.error(`\n❌ Error generating artwork: ${result.error}`);
    }
  }
  
  console.log('\n' + '═'.repeat(100));
  console.log(`Finished generating ${options.count} enhanced bear portrait artworks`);
  console.log('═'.repeat(100));
}

// Run the main function
main().catch(error => {
  console.error('Error executing test:', error);
}); 