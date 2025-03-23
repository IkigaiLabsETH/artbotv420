/**
 * Test Enhanced Refiner Agent
 * 
 * This script demonstrates the capabilities of the enhanced refiner agent
 * for prompt refinement and image generation
 */

import { AIService } from './services/ai/index';
import { ReplicateService } from './services/replicate/index';
import { RefinerAgentFactory, RefinerAgentType } from './agents/RefinerAgentFactory';
import { AgentLogger } from './utils/agentLogger';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Set up output directory
const OUTPUT_DIR = path.join(process.cwd(), 'output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Configure test parameters
const testPrompt = "a distinguished bear portrait in profile wearing a bowler hat and holding a pipe, the background shows a surreal window with sky, in the style of René Magritte";
const targetModel = "black-forest-labs/flux-1.1-pro";

/**
 * Test the refiner agent with different implementations
 */
async function testRefinerAgent() {
  try {
    AgentLogger.logHeader(`Testing Enhanced Refiner Agent`);
    
    // Initialize the AI service
    AgentLogger.log(`🧠 Initializing AI service`);
    const aiService = new AIService();
    await aiService.initialize();
    
    // Initialize the Replicate service
    AgentLogger.log(`🎨 Initializing Replicate service`);
    const replicateService = new ReplicateService();
    await replicateService.initialize();
    
    // Create an enhanced refiner agent
    AgentLogger.log(`🔧 Creating enhanced refiner agent`);
    const enhancedRefiner = RefinerAgentFactory.createRefinerAgent(
      RefinerAgentType.ENHANCED,
      aiService
    );
    await enhancedRefiner.initialize();
    
    // Create a standard refiner agent for comparison
    AgentLogger.log(`🔧 Creating standard refiner agent`);
    const standardRefiner = RefinerAgentFactory.createRefinerAgent(
      RefinerAgentType.STANDARD,
      aiService
    );
    await standardRefiner.initialize();
    
    // Test prompt refinement
    AgentLogger.logHeader(`Testing Prompt Refinement`);
    AgentLogger.log(`Original prompt: ${testPrompt}`);
    
    // Refine with standard refiner
    const standardRefinedPrompt = await standardRefiner.refinePrompt(testPrompt);
    AgentLogger.log(`\n🔍 Standard refined prompt: ${standardRefinedPrompt}`);
    
    // Refine with enhanced refiner
    const enhancedRefinedPrompt = await enhancedRefiner.refinePrompt(testPrompt);
    AgentLogger.log(`\n✨ Enhanced refined prompt: ${enhancedRefinedPrompt}`);
    
    // Test model optimization
    AgentLogger.logHeader(`Testing Model Optimization for ${targetModel}`);
    
    // Optimize with standard refiner
    const standardOptimizedPrompt = await standardRefiner.optimizeForModel(testPrompt, targetModel);
    AgentLogger.log(`\n🔍 Standard optimized prompt: ${standardOptimizedPrompt}`);
    
    // Optimize with enhanced refiner
    const enhancedOptimizedPrompt = await enhancedRefiner.optimizeForModel(testPrompt, targetModel);
    AgentLogger.log(`\n✨ Enhanced optimized prompt: ${enhancedOptimizedPrompt}`);
    
    // Test image generation using process
    AgentLogger.logHeader(`Testing Image Generation`);
    
    // Process with enhanced refiner to generate image
    const result = await enhancedRefiner.process({
      projectId: 'test-enhanced-refiner',
      prompt: testPrompt,
      task: {
        action: 'generate_image',
        model: targetModel
      },
      messages: []
    });
    
    if (result.success && result.output?.imageUrl) {
      AgentLogger.logSuccess(`Image generated: ${result.output.imageUrl}`);
      
      // Save the results to output directory
      const outputFile = path.join(OUTPUT_DIR, 'enhanced-refiner-result.json');
      fs.writeFileSync(outputFile, JSON.stringify(result.output, null, 2));
      
      AgentLogger.log(`💾 Results saved to ${outputFile}`);
      
      // Save image URL to a separate file
      const imageUrlFile = path.join(OUTPUT_DIR, 'enhanced-refiner-image.txt');
      fs.writeFileSync(imageUrlFile, result.output.imageUrl);
      
      AgentLogger.log(`🖼️ Image URL saved to ${imageUrlFile}`);
    } else {
      AgentLogger.logError('Image Generation', result.error?.message || 'Unknown error');
    }
    
    // Show comparison
    AgentLogger.logHeader(`Refiner Agent Comparison`);
    AgentLogger.log(`📌 Original prompt length: ${testPrompt.length} characters`);
    AgentLogger.log(`📌 Standard refined prompt length: ${standardRefinedPrompt.length} characters`);
    AgentLogger.log(`📌 Enhanced refined prompt length: ${enhancedRefinedPrompt.length} characters`);
    AgentLogger.log(`📌 Standard optimized prompt length: ${standardOptimizedPrompt.length} characters`);
    AgentLogger.log(`📌 Enhanced optimized prompt length: ${enhancedOptimizedPrompt.length} characters`);
    
  } catch (error) {
    AgentLogger.logError('Test', error instanceof Error ? error.message : String(error));
  }
}

// Run the test
testRefinerAgent().then(() => {
  AgentLogger.logSuccess(`Test completed`);
}).catch(error => {
  AgentLogger.logError('Test Runner', error instanceof Error ? error.message : String(error));
}); 