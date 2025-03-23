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
import { CriticAgent } from './agents/CriticAgent';
import { MetadataGeneratorAgent } from './agents/MetadataGeneratorAgent';
import { EnhancedBearPromptGenerator } from './generators/EnhancedBearPromptGenerator';
import { StyleIntegrationService } from './services/style/StyleIntegrationService';

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
  
  console.log('╭───────────────────────────────────────────╮');
  console.log('│ Enhanced Character Generation Options:     │');
  console.log('│ --default   Use the default concept        │');
  console.log('│ --bowler    Force bowler hat inclusion     │');
  console.log('│ --random    Use random element combinations│');
  console.log('│ --series=X  Specify series (ADVENTURE,     │');
  console.log('│             ARTISTIC, HIPSTER, etc.)       │');
  console.log('│ --category=X Specify category ID           │');
  console.log('│ --no-series Disable series-based generation│');
  console.log('│ --no-categories Disable category generation│');
  console.log('│ --legacy-prompt Use legacy prompt generator│');
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
      defaultNumInferenceSteps: 45,
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
      enhanceMagritte: process.argv.includes('--enhance') || true, // Enable enhanced Magritte mode by default
      highQuality: process.argv.includes('--hq') || true, // Enable high quality by default
      randomCombinations: process.argv.includes('--random'),
      useSeries: !process.argv.includes('--no-series'),
      useCategories: !process.argv.includes('--no-categories'),
      concept: process.argv.find(arg => arg.startsWith('--concept='))?.split('=')[1],
      series: process.argv.find(arg => arg.startsWith('--series='))?.split('=')[1],
      category: process.argv.find(arg => arg.startsWith('--category='))?.split('=')[1],
      useLegacyPrompt: process.argv.includes('--legacy-prompt')
    };
    
    // Generate concept based on options
    let concept;
    let useEnhancedGenerator = false;
    
    if (options.useDefault) {
      concept = 'a distinguished bear portrait with a bowler hat in the style of René Magritte, with perfect smooth matte finish, immaculate edge control, and pristine surface quality';
      console.log('Using default concept');
    } else if (options.concept) {
      concept = options.concept;
      console.log('Using provided concept');
    } else if (options.useLegacyPrompt) {
      // Use legacy bear concept generator
      console.log('Using legacy bear concept generator');
      const generationOptions = { 
        forceBowlerHat: options.forceBowlerHat,
        useSeries: options.useSeries,
        useCategories: options.useCategories,
        useRandomCombinations: options.randomCombinations || (!options.series && !options.category)
      };
      
      concept = bearConceptGenerator.generateBearConcept(generationOptions);
    } else {
      // Use our new enhanced bear prompt generator
      console.log('Using enhanced bear prompt generator');
      concept = enhancedPromptGenerator.generatePortraitPrompt({
        forceBowlerHat: options.forceBowlerHat,
        seriesId: options.series
      });
      
      // Flag for the multi-agent system to use enhanced generator via StyleIntegrationService
      useEnhancedGenerator = true;
    }
    
    console.log('╭───────────────────────────────────────────╮');
    console.log('│ Generated Prompt:                         │');
    console.log('╰───────────────────────────────────────────╯');
    console.log(concept);
    console.log('═'.repeat(80));
    
    // Define a test project with enhanced options
    const testProject = {
      title: 'Magritte Bear Portrait',
      description: 'A distinguished bear in Magritte surrealist style',
      concept,
      style: 'bear_pfp',
      outputFilename: `magritte_bear_${Date.now()}`,
      requirements: [
        'Generate museum-quality Magritte-style image',
        'Follow surrealist style guidelines with mathematical precision',
        'Create a visually compelling composition with philosophical elements',
        'Render with perfectly smooth matte finish and hyper-precise edge control',
        'Ensure proper compositional balance for profile use'
      ],
      // Pass character generation options
      characterOptions: {
        categoryId: options.category || undefined,
        seriesType: options.series || undefined,
        allowAiEnhancement: true
      },
      artDirection: {
        enhanceMagritte: true,
        focusOnSurfaceQuality: true,
        preferredColors: [
          'Belgian sky blue',
          'deep prussian blue',
          'rich mahogany brown', 
          'twilight purple'
        ],
        highQuality: true,
        modelParams: {
          inferenceSteps: 45,
          guidanceScale: 4.5,
          controlnet_conditioning_scale: 0.8,
          clip_skip: 2
        }
      },
      // Flag to use our enhanced bear generator
      useEnhancedBearGenerator: useEnhancedGenerator
    };
    
    console.log('╭───────────────────────────────────────────╮');
    console.log(`│ 🎨 Generating artwork                      │`);
    console.log(`│ 🖌️ Style: ${testProject.style.substring(0, 30).padEnd(30)} │`);
    if (options.enhanceMagritte) console.log('│ ✓ Enhanced Magritte Mode Enabled             │');
    if (options.highQuality) console.log('│ ✓ High Quality Mode Enabled                  │');
    if (useEnhancedGenerator) console.log('│ ✓ Enhanced Bear Generator Enabled            │');
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