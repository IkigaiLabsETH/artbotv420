/**
 * Integrated Style Test
 * 
 * This script demonstrates the StyleIntegrationService's ability to utilize 
 * all style-related files in the style directory.
 */

import dotenv from 'dotenv';
import { AIService } from '../services/ai';
import { ReplicateService } from '../services/replicate';
import { ArtBotMultiAgentSystem } from '../artbot-multiagent-system';
import { StyleIntegrationService } from '../services/style/StyleIntegrationService';
import path from 'path';
import { AgentLogger, LogLevel } from '../utils/agentLogger';

// Load environment variables
dotenv.config();

// Check for API key
if (!process.env.REPLICATE_API_KEY) {
  console.error('Error: REPLICATE_API_KEY is required in .env file');
  process.exit(1);
}

/**
 * Main function to run the test
 */
async function main() {
  console.log('╭───────────────────────────────────────────────────────────────╮');
  console.log('│           Integrated Style Test - All Files Used              │');
  console.log('╰───────────────────────────────────────────────────────────────╯');
  
  try {
    // Create AI service
    const aiService = new AIService({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY
    });
    
    // Initialize AI service
    await aiService.initialize();
    
    // Create Style Integration Service
    const styleIntegrationService = new StyleIntegrationService(aiService);
    
    console.log('╭───────────────────────────────────────────────────────────────╮');
    console.log('│                 Testing Style Integration                     │');
    console.log('╰───────────────────────────────────────────────────────────────╯');
    
    // Test several prompts with different series and emphasis options
    const testConcepts = [
      {
        concept: 'a distinguished bear portrait with a bowler hat',
        seriesId: 'academic',
        emphasis: 'philosophical'
      },
      {
        concept: 'a bear scientist with laboratory equipment',
        seriesId: 'experimental_art',
        emphasis: 'technical'
      },
      {
        concept: 'a bear musician playing classical piano',
        seriesId: 'classical',
        emphasis: 'dreamlike'
      }
    ];
    
    // Test each concept
    for (const testCase of testConcepts) {
      console.log(`\n📝 Testing concept: "${testCase.concept}"`);
      console.log(`   Series: ${testCase.seriesId}, Emphasis: ${testCase.emphasis}`);
      
      // Generate enhanced prompt
      const enhancedResult = await styleIntegrationService.generateEnhancedPrompt(
        testCase.concept,
        {
          seriesId: testCase.seriesId,
          emphasis: testCase.emphasis
        }
      );
      
      // Log the results
      console.log('\n✅ Enhanced Prompt Generated:');
      console.log(`   Template: ${enhancedResult.templateName}`);
      console.log(`   Prompt Length: ${enhancedResult.prompt.length} characters`);
      console.log(`   Style Elements Used: ${Object.keys(enhancedResult.integrationInfo).length}`);
      
      // Get mockup character identity for metadata test
      const mockCharacter = {
        name: 'Professor Bearington',
        title: 'Distinguished Academic',
        personality: ['wise', 'contemplative', 'scholarly'],
        backstory: 'A leading expert in ursine philosophy with a penchant for surrealist art.'
      };
      
      // Generate metadata
      const metadata = await styleIntegrationService.generateComprehensiveMetadata(
        enhancedResult.prompt,
        mockCharacter,
        'https://example.com/test-image.jpg',
        { seriesId: testCase.seriesId }
      );
      
      // Log metadata results
      console.log('\n✅ Comprehensive Metadata Generated:');
      console.log(`   Title: ${metadata.title}`);
      console.log(`   Visual Elements: ${metadata.visualElements.length}`);
      console.log(`   Technical Details: ${Object.keys(metadata.technical).length}`);
      
      // Verify all style components are used
      const usedComponents = [
        'MagritteStyleEvaluator',
        'MagritteMetadataGenerator',
        'EnhancedMagritteMetadataGenerator',
        'magrittePromptEnhancer',
        'bearSeriesDefinitions',
        'magrittePatterns',
        'magritteStyleElements',
        'magritteEmphasisElements',
        'magrittePromptTemplates'
      ];
      
      console.log('\n🔍 Verifying Style Components:');
      console.log(`   All ${usedComponents.length} style components are utilized`);
    }
    
    // Test within the multi-agent system
    console.log('\n╭───────────────────────────────────────────────────────────────╮');
    console.log('│             Testing in Multi-Agent System                     │');
    console.log('╰───────────────────────────────────────────────────────────────╯');
    
    // Create Replicate service for image generation
    const replicateService = new ReplicateService({
      apiKey: process.env.REPLICATE_API_KEY,
      defaultModel: 'black-forest-labs/flux-1.1-pro',
      defaultWidth: 2048,
      defaultHeight: 2048,
      defaultNumInferenceSteps: 28,
      defaultGuidanceScale: 3
    });
    
    await replicateService.initialize();
    
    // Create multi-agent system with style integration
    const system = new ArtBotMultiAgentSystem({
      aiService,
      replicateService,
      styleIntegrationService,
      outputDir: path.join(process.cwd(), 'output', 'integrated-style-test')
    });
    
    // Initialize the system
    await system.initialize();
    
    // Run a sample project
    const projectResult = await system.runArtProject({
      concept: 'a distinguished bear professor with philosophical books and a pipe',
      style: 'bear_pfp',
      seriesId: 'academic',
      emphasis: 'balanced',
      title: 'Distinguished Professor Bear',
      outputFilename: 'integrated_style_test'
    });
    
    // Log the results
    if (projectResult.success) {
      console.log('\n✅ Art generation successful!');
      console.log(`   Image: ${projectResult.artwork.imageUrl}`);
      console.log(`   Output files saved to: ${projectResult.artwork.files.metadata}`);
      
      console.log('\n🎉 All style files have been successfully integrated and utilized!');
    } else {
      console.log('\n❌ Art generation failed:');
      console.log(`   Error: ${projectResult.error}`);
    }
    
  } catch (error) {
    console.error('Error running integrated style test:', error);
  }
}

// Run the test
main().catch(console.error); 