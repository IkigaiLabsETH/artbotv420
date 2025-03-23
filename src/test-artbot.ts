/**
 * Test script for ArtBot
 * Run with: npm start
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { ArtBotMultiAgentSystem } from './artbot-multiagent-system';
import { ElizaLogger, LogLevel } from './utils/elizaLogger';
import { AIService } from './services/ai';
import { ReplicateService } from './services/replicate';
import { IdeatorAgent } from './agents/IdeatorAgent';
import { StylistAgent } from './agents/StylistAgent';
import { RefinerAgent } from './agents/RefinerAgent';
import { CharacterGeneratorAgent } from './agents/CharacterGeneratorAgent';
import { BearConceptGenerator } from './generators/BearConceptGenerator';
import { EnhancedRefinerAgent } from './agents/EnhancedRefinerAgent';
import { CriticAgent } from './agents/CriticAgent';
import { MetadataGeneratorAgent } from './agents/MetadataGeneratorAgent';
import { EnhancedBearPromptGenerator } from './generators/EnhancedBearPromptGenerator';
import { StyleIntegrationService } from './services/style/StyleIntegrationService';
import { AgentRole } from './agents/types';
import { AgentLogger } from './utils/agentLogger';
import { EnhancedLogger } from './utils/enhancedLogger';

// Load environment variables
dotenv.config();

// Check for required API key
if (!process.env.REPLICATE_API_KEY) {
  console.error('Error: REPLICATE_API_KEY environment variable is required.');
  console.error('Please create a .env file with your Replicate API key.');
  process.exit(1);
}

// Default concept for testing
const defaultConcept = "a distinguished bear portrait in profile wearing a surrealist bowler hat, formal attire, and a white collar with red tie, in the style of Rene Magritte's precise oil painting technique with solid sky blue background";

// Set up bear concept generator
const bearGenerator = new BearConceptGenerator();

/**
 * Parse command-line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options: Record<string, any> = {
    bowler: false,
    random: false,
    series: '',
    default: false,
    legacy: false,
    enhanceMagritte: false,
    output: '',
    highQuality: false,
    style: '',
    category: '',
    noSeries: false,
    noCategories: false
  };
  
  const remainingArgs = [];
  
  for (const arg of args) {
    if (arg === '--bowler') {
      options.bowler = true;
    } else if (arg === '--random') {
      options.random = true;
    } else if (arg.startsWith('--series=')) {
      options.series = arg.split('=')[1].trim();
    } else if (arg.startsWith('--category=')) {
      options.category = arg.split('=')[1].trim();
    } else if (arg === '--default') {
      options.default = true;
    } else if (arg === '--legacy-prompt') {
      options.legacy = true;
    } else if (arg === '--enhance-magritte') {
      options.enhanceMagritte = true;
    } else if (arg.startsWith('--output=')) {
      options.output = arg.split('=')[1].trim();
    } else if (arg === '--high-quality') {
      options.highQuality = true;
    } else if (arg.startsWith('--style=')) {
      options.style = arg.split('=')[1].trim();
    } else if (arg === '--no-series') {
      options.noSeries = true;
    } else if (arg === '--no-categories') {
      options.noCategories = true;
    } else {
      remainingArgs.push(arg);
    }
  }
  
  return { options, args: remainingArgs };
}

/**
 * Main function to run the test
 */
async function main() {
  // Initialize the logger with compact mode
  EnhancedLogger.setCompactMode(true);
  
  // Parse command-line arguments
  const { options, args } = parseArgs();
  
  // Print header
  EnhancedLogger.printHeader('ArtBot Magritte Generator');
  
  // Print options
  EnhancedLogger.printSection('Command Options');
  EnhancedLogger.log('--default   Use the default concept', LogLevel.INFO);
  EnhancedLogger.log('--bowler    Force bowler hat inclusion', LogLevel.INFO);
  EnhancedLogger.log('--random    Use random element combinations', LogLevel.INFO);
  EnhancedLogger.log('--series=X  Specify series (ADVENTURE, ARTISTIC, etc.)', LogLevel.INFO);
  EnhancedLogger.log('--category=X Specify category ID', LogLevel.INFO);
  EnhancedLogger.log('--no-series Disable series-based generation', LogLevel.INFO);
  EnhancedLogger.log('--no-categories Disable category generation', LogLevel.INFO);
  EnhancedLogger.log('--legacy-prompt Use legacy prompt generator', LogLevel.INFO);
  
  try {
    // Create AI service
    const aiService = new AIService({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY
    });
    
    // Create Replicate service with optimized parameters
    const replicateService = new ReplicateService({
      apiKey: process.env.REPLICATE_API_KEY,
      defaultModel: process.env.DEFAULT_MODEL || 'black-forest-labs/flux-1.1-pro', 
      defaultWidth: options.highQuality ? 768 : 512,
      defaultHeight: options.highQuality ? 768 : 512,
      defaultNumInferenceSteps: options.highQuality ? 45 : 28,
      defaultGuidanceScale: 4.5
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
    
    // Create and register the Critic agent
    const criticAgent = new CriticAgent(aiService);
    system.registerAgent(criticAgent);
    
    // Create and register the Metadata Generator agent
    const metadataGeneratorAgent = new MetadataGeneratorAgent(aiService);
    system.registerAgent(metadataGeneratorAgent);
    
    // Log registered agents
    EnhancedLogger.printSection('Registered Agents');
    system.getAllAgents().forEach(agent => {
      EnhancedLogger.log(`${agent.role} (${agent.id.substring(0, 8)})`, LogLevel.INFO);
    });
    
    // Initialize the system
    await system.initialize();
    
    // Flag to track if we're using the enhanced generator
    let useEnhancedGenerator = !options.legacy;
    
    // Check if a specific series was provided
    if (!options.series && !options.noSeries) {
      // Randomly pick a series
      const seriesIds = ['adventure', 'artistic', 'business', 'culinary', 'hipster', 'historical', 'magical', 'musical', 'royal', 'scientific'];
      options.series = seriesIds[Math.floor(Math.random() * seriesIds.length)];
      EnhancedLogger.log(`Automatically selected series: ${options.series.toUpperCase()}`, LogLevel.INFO);
    }
    
    // Generate concept
    let concept = '';
    if (options.default) {
      EnhancedLogger.log('Using default concept', LogLevel.INFO);
      concept = defaultConcept;
    } else if (args.length > 0) {
      EnhancedLogger.log('Using provided concept', LogLevel.INFO);
      concept = args.join(' ');
    } else if (options.legacy) {
      EnhancedLogger.log('Using legacy bear concept generator', LogLevel.INFO);
      concept = bearGenerator.generateBearConcept({
        forceBowlerHat: options.bowler,
        useSeries: !options.noSeries,
        useCategories: !options.noCategories,
        useRandomCombinations: options.random
      });
    } else {
      EnhancedLogger.log('Using enhanced bear prompt generator', LogLevel.INFO);
      
      // Use the styleService to generate an enhanced prompt
      const enhancedPrompt = await styleService.generateEnhancedPrompt(
        "distinguished bear portrait in profile wearing a bowler hat", 
        {
          seriesId: options.series,
          categoryId: options.category,
          includeBowlerHat: options.bowler,
          includeRandomElements: options.random,
          enhanceMagritteTechniques: options.enhanceMagritte
        }
      );
      
      // Use the enhanced prompt
      concept = enhancedPrompt.prompt;
    }
    
    // Display the generated concept
    EnhancedLogger.printSection('Generated Prompt');
    console.log(concept);
    console.log('═'.repeat(80));
    
    // Create a test project
    const testProject = {
      title: 'Magritte Bear',
      concept: concept,
      style: options.style || 'magritte',
      outputFilename: options.output || 'magritte-bear',
      artDirection: {
        visualElement: options.bowler ? 'bowler hat' : undefined,
        technique: options.highQuality ? 'highly detailed' : undefined
      },
      requirements: []
    };
    
    // Generate the artwork
    EnhancedLogger.printSection('Generating Artwork');
    EnhancedLogger.log(`Style: ${testProject.style.substring(0, 30)}`, LogLevel.INFO);
    if (options.enhanceMagritte) EnhancedLogger.log('Enhanced Magritte Mode Enabled', LogLevel.INFO);
    if (options.highQuality) EnhancedLogger.log('High Quality Mode Enabled', LogLevel.INFO);
    if (useEnhancedGenerator) EnhancedLogger.log('Enhanced Bear Generator Enabled', LogLevel.INFO);
    
    const result = await system.runArtProject(testProject);
    
    // Output the result
    EnhancedLogger.printSection('Generation Complete');
    EnhancedLogger.log(`Image: ${result.artwork.imageUrl}`, LogLevel.INFO);
    EnhancedLogger.log(`Saved to: ${result.artwork.files.image}`, LogLevel.INFO);
  } catch (error) {
    console.error('Error running test:', error);
  }
}

// Run the test
main().catch(console.error); 