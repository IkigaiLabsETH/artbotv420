/**
 * Enhanced Magritte Service Test Script
 * Tests the enhanced Magritte service with various bear portrait concepts
 */

import * as dotenv from 'dotenv';
import path from 'path';
import { AIService } from './services/ai';
import { ReplicateService } from './services/replicate';
import { EnhancedMagritteService } from './services/magritte/EnhancedMagritteService';
import { EnhancedLogger, LogLevel } from './utils/enhancedLogger';

// Load environment variables
dotenv.config();

// Test concepts for various bear portraits
const TEST_CONCEPTS = [
  "a distinguished bear portrait with bowler hat and pipe in Magritte style",
  "a philosophical bear portrait with an apple floating in front of face",
  "a bear portrait with day and night paradox in Magritte style",
  "a distinguished bear wearing a vintage aviator cap against blue sky",
  "a bear portrait with floating cloud in front of head in Magritte style",
];

// Series to use for the test
const TEST_SERIES = [
  "academic",
  "artistic",
  "mystical",
  "hipster",
  "classical"
];

// Check for required API key
if (!process.env.REPLICATE_API_KEY) {
  console.error('Error: REPLICATE_API_KEY environment variable is required.');
  console.error('Please create a .env file with your Replicate API key.');
  process.exit(1);
}

async function main() {
  EnhancedLogger.printHeader('ENHANCED MAGRITTE SERVICE TEST');
  
  try {
    // Initialize AI service
    const aiService = new AIService({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY
    });
    
    await aiService.initialize();
    EnhancedLogger.log('AI Service initialized', LogLevel.SUCCESS);
    
    // Initialize Replicate service
    const replicateService = new ReplicateService({
      apiKey: process.env.REPLICATE_API_KEY,
      defaultModel: 'black-forest-labs/flux-1.1-pro',
      defaultWidth: 1024,
      defaultHeight: 1024,
      defaultNumInferenceSteps: 28,
      defaultGuidanceScale: 3.0
    });
    
    await replicateService.initialize();
    EnhancedLogger.log('Replicate Service initialized', LogLevel.SUCCESS);
    
    // Create Enhanced Magritte Service
    const magritteService = new EnhancedMagritteService({
      aiService,
      replicateService,
      outputDir: path.join(process.cwd(), 'output', 'enhanced-test')
    });
    
    EnhancedLogger.log('Enhanced Magritte Service initialized', LogLevel.SUCCESS);
    
    // Test single generation or batch based on arguments
    const singleTest = process.argv.includes('--single');
    const testConcept = process.argv[2] && !process.argv[2].startsWith('--') 
      ? process.argv[2]
      : TEST_CONCEPTS[0];
    
    if (singleTest) {
      // Run single test
      EnhancedLogger.printSection('SINGLE PORTRAIT TEST');
      EnhancedLogger.log(`Concept: ${testConcept}`, LogLevel.INFO);
      
      const result = await magritteService.generateBearPortrait(testConcept, {
        series: TEST_SERIES[0],
        outputFilename: 'enhanced_single_test'
      });
      
      if (result.success && result.artwork) {
        EnhancedLogger.log(`Generated: ${result.artwork.title}`, LogLevel.SUCCESS);
        EnhancedLogger.log(`Character: ${result.artwork.character.name}, ${result.artwork.character.title}`, LogLevel.SUCCESS);
        EnhancedLogger.log(`Image URL: ${result.artwork.imageUrl}`, LogLevel.SUCCESS);
      } else {
        EnhancedLogger.log(`Generation failed: ${result.error?.message}`, LogLevel.ERROR);
      }
    } else {
      // Run batch test
      EnhancedLogger.printSection('BATCH PORTRAITS TEST');
      EnhancedLogger.log(`Testing ${TEST_CONCEPTS.length} concepts`, LogLevel.INFO);
      
      // Use only the first 3 concepts if not in full test mode
      const concepts = process.argv.includes('--full') 
        ? TEST_CONCEPTS 
        : TEST_CONCEPTS.slice(0, Math.min(3, TEST_CONCEPTS.length));
      
      const batchResults = await magritteService.generateBatch(concepts, {
        baseFilename: 'enhanced_batch_test'
      });
      
      EnhancedLogger.log(`Batch completed: ${batchResults.completed}/${concepts.length}`, LogLevel.SUCCESS);
      
      if (batchResults.completed > 0) {
        // Export the collection
        const exportDir = await magritteService.exportForNFT(
          batchResults.results,
          'Enhanced Magritte Bears'
        );
        
        EnhancedLogger.log(`Collection exported to: ${exportDir}`, LogLevel.SUCCESS);
      }
    }
  } catch (error) {
    EnhancedLogger.log(`Test failed: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
    console.error(error);
  }
}

// Run the test
main()
  .then(() => {
    EnhancedLogger.printSection('TEST COMPLETE');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 