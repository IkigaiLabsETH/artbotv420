/**
 * Batch Generation CLI
 * 
 * Generates multiple artworks in a batch and then opens
 * the terminal preview interface for review.
 */

import { ArtBotMultiAgentSystem } from '../../artbot-multiagent-system';
import { AIService } from '../../services/ai';
import { ReplicateService } from '../../services/replicate';
import { IdeatorAgent } from '../../agents/IdeatorAgent';
import { StylistAgent } from '../../agents/StylistAgent';
import { EnhancedRefinerAgent } from '../../agents/EnhancedRefinerAgent';
import { CharacterGeneratorAgent } from '../../agents/CharacterGeneratorAgent';
import { CriticAgent } from '../../agents/CriticAgent';
import { MetadataGeneratorAgent } from '../../agents/MetadataGeneratorAgent';
import { StyleIntegrationService } from '../../services/style/StyleIntegrationService';
import { EnhancedBearPromptGenerator } from '../../generators/EnhancedBearPromptGenerator';
import { TerminalPreview } from './index';
import chalk from 'chalk';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Parse command-line arguments
const args = process.argv.slice(2);
const count = parseInt(args.find(arg => arg.startsWith('--count='))?.split('=')[1] || '3', 10);
const outputDir = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || path.join(process.cwd(), 'output', 'batch');
const seriesArg = args.find(arg => arg.startsWith('--series='))?.split('=')[1];
const autoPreview = !args.includes('--no-preview');
const series = seriesArg ? seriesArg.toLowerCase() : undefined;

/**
 * Initialize services and create the multi-agent system
 */
async function initializeSystem() {
  // Check for API keys
  if (!process.env.REPLICATE_API_KEY) {
    console.error(chalk.red('Error: REPLICATE_API_KEY environment variable is required.'));
    console.error(chalk.red('Please create a .env file with your Replicate API key.'));
    process.exit(1);
  }

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
    defaultNumInferenceSteps: 28,
    defaultGuidanceScale: 3
  });
  
  // Initialize services
  await aiService.initialize();
  await replicateService.initialize();
  
  // Create Style Integration Service
  const styleService = new StyleIntegrationService(aiService);
  
  // Create our enhanced prompt generator
  const enhancedPromptGenerator = new EnhancedBearPromptGenerator();
  
  // Create the multi-agent system
  const system = new ArtBotMultiAgentSystem({
    aiService, 
    replicateService,
    styleIntegrationService: styleService,
    outputDir
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
  
  // Create and register the Critic agent
  const criticAgent = new CriticAgent(aiService);
  system.registerAgent(criticAgent);
  
  // Create and register the Metadata Generator agent
  const metadataGeneratorAgent = new MetadataGeneratorAgent(aiService);
  system.registerAgent(metadataGeneratorAgent);
  
  // Initialize the system
  await system.initialize();

  return {
    system,
    enhancedPromptGenerator
  };
}

/**
 * Generate a batch of artworks
 */
async function generateBatch() {
  console.log(chalk.bold.magenta('\n╭───────────────────────────────────────────╮'));
  console.log(chalk.bold.magenta('│           BATCH GENERATION                │'));
  console.log(chalk.bold.magenta('╰───────────────────────────────────────────╯'));
  
  console.log(chalk.cyan(`\n✨ Generating ${count} artworks in batch mode`));
  if (series) console.log(chalk.cyan(`✨ Series: ${series.toUpperCase()}`));
  console.log(chalk.cyan(`✨ Output directory: ${outputDir}`));
  
  // Initialize the system
  const { system, enhancedPromptGenerator } = await initializeSystem();
  
  // Create a preview instance
  const preview = new TerminalPreview({
    outputDir,
    maxHistory: 100
  });
  
  // Generate the specified number of artworks
  const results = [];
  
  for (let i = 0; i < count; i++) {
    console.log(chalk.bold.cyan(`\n✨ Generating artwork ${i + 1} of ${count}`));
    
    // Generate a concept using our enhanced prompt generator
    const concept = enhancedPromptGenerator.generatePortraitPrompt({
      seriesId: series
    });
    
    console.log(chalk.yellow(`\n📝 Generated concept: ${concept.substring(0, 100)}...`));
    
    // Define the project
    const project = {
      title: `Magritte Bear Portrait - ${series ? series.charAt(0).toUpperCase() + series.slice(1) : 'Distinguished'} Series (${i + 1})`,
      description: `A ${series || 'distinguished'} bear in Magritte surrealist style`,
      concept,
      style: 'bear_pfp',
      outputFilename: `magritte_bear_${series || 'classic'}_${Date.now()}_${i}`,
      requirements: [
        'Generate museum-quality Magritte-style image',
        'Follow surrealist style guidelines with mathematical precision',
        'Create a visually compelling composition with philosophical elements',
        'Render with perfectly smooth matte finish and hyper-precise edge control'
      ],
      characterOptions: {
        seriesType: series || undefined,
        allowAiEnhancement: true
      },
      artDirection: {
        enhanceMagritte: true,
        focusOnSurfaceQuality: true,
        highQuality: true
      },
      useEnhancedBearGenerator: true
    };
    
    // Run the project
    console.log(chalk.cyan(`\n🎨 Generating artwork...`));
    
    try {
      const result = await system.runArtProject(project);
      
      if (result.success) {
        console.log(chalk.green(`\n✓ Generation complete: ${result.artwork.imageUrl}`));
        results.push(result);
        
        // Add to the preview system
        if (autoPreview) {
          await preview.addArtwork({
            prompt: result.artwork.prompt,
            imageUrl: result.artwork.imageUrl,
            metadata: {
              ...result.artwork.metadata,
              character: result.artwork.character,
              series: series
            }
          });
        }
      } else {
        console.error(chalk.red(`\n✗ Generation failed: ${result.error?.message || 'Unknown error'}`));
      }
    } catch (error) {
      console.error(chalk.red(`\n✗ Error generating artwork: ${error instanceof Error ? error.message : String(error)}`));
    }
  }
  
  // Show summary
  console.log(chalk.bold.green('\n╭───────────────────────────────────────────╮'));
  console.log(chalk.bold.green('│           GENERATION COMPLETE              │'));
  console.log(chalk.bold.green(`│ Generated: ${results.length}/${count} artworks           │`));
  console.log(chalk.bold.green('╰───────────────────────────────────────────╯'));
  
  // If auto-preview is enabled, start the preview interface
  if (autoPreview && results.length > 0) {
    console.log(chalk.cyan('\n✨ Starting preview interface...'));
    preview.start();
  } else {
    process.exit(0);
  }
}

// Run the batch generation
generateBatch().catch(error => {
  console.error(chalk.red(`\n✗ Error in batch generation: ${error instanceof Error ? error.message : String(error)}`));
  process.exit(1);
});
