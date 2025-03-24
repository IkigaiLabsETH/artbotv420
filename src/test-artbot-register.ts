/**
 * Test script for ArtBot with explicit agent registration
 * Ensures all agents are properly registered before running the art project
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { ArtBotMultiAgentSystem } from './artbot-multiagent-system';
import { AIService } from './services/ai';
import { ReplicateService } from './services/replicate';
import { IdeatorAgent } from './agents/IdeatorAgent';
import { StylistAgent } from './agents/StylistAgent';
import { EnhancedRefinerAgent } from './agents/EnhancedRefinerAgent';
import { CharacterGeneratorAgent } from './agents/CharacterGeneratorAgent';
import { CriticAgent } from './agents/CriticAgent';
import { MetadataGeneratorAgent } from './agents/MetadataGeneratorAgent';
import { StyleIntegrationService } from './services/style/StyleIntegrationService';
import { AgentLogger, LogLevel } from './utils/agentLogger';
import { AgentRole } from './agents/types';
import { EnhancedLogger } from './utils/enhancedLogger';

// Load environment variables
dotenv.config();

// Check for required API key
if (!process.env.REPLICATE_API_KEY) {
  console.error('Error: REPLICATE_API_KEY environment variable is required.');
  console.error('Please create a .env file with your Replicate API key.');
  process.exit(1);
}

/**
 * Main function to run the test
 */
async function main() {
  try {
    // Print header
    EnhancedLogger.printHeader('ArtBot Generator (Explicit Registration)');
    
    // Create AI service
    const aiService = new AIService({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY
    });
    
    // Create Replicate service
    const replicateService = new ReplicateService({
      apiKey: process.env.REPLICATE_API_KEY,
      defaultModel: process.env.DEFAULT_MODEL || 'black-forest-labs/flux-1.1-pro', 
      defaultWidth: 512,
      defaultHeight: 512,
      defaultNumInferenceSteps: 28,
      defaultGuidanceScale: 4.5
    });
    
    // Initialize services
    await aiService.initialize();
    await replicateService.initialize();
    
    // Create Style Integration Service
    const styleService = new StyleIntegrationService(aiService);
    
    // Create the multi-agent system
    const system = new ArtBotMultiAgentSystem({
      aiService, 
      replicateService,
      styleIntegrationService: styleService,
      outputDir: path.join(process.cwd(), 'output', 'test')
    });
    
    // Explicitly register all required agents
    EnhancedLogger.printSection('Registering Agents');
    
    // Create and register the Ideator agent
    const ideatorAgent = new IdeatorAgent(aiService);
    system.registerAgent(ideatorAgent);
    EnhancedLogger.log(`Registered ${ideatorAgent.role} agent (${ideatorAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Create and register the Stylist agent
    const stylistAgent = new StylistAgent(aiService);
    system.registerAgent(stylistAgent);
    EnhancedLogger.log(`Registered ${stylistAgent.role} agent (${stylistAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Create and register the Enhanced Refiner agent
    const refinerAgent = new EnhancedRefinerAgent(aiService);
    system.registerAgent(refinerAgent);
    EnhancedLogger.log(`Registered ${refinerAgent.role} agent (${refinerAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Create and register the Character Generator agent
    const characterGeneratorAgent = new CharacterGeneratorAgent(aiService);
    system.registerAgent(characterGeneratorAgent);
    EnhancedLogger.log(`Registered ${characterGeneratorAgent.role} agent (${characterGeneratorAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Create and register the Critic agent
    const criticAgent = new CriticAgent(aiService);
    system.registerAgent(criticAgent);
    EnhancedLogger.log(`Registered ${criticAgent.role} agent (${criticAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Create and register the Metadata Generator agent
    const metadataGeneratorAgent = new MetadataGeneratorAgent(aiService);
    system.registerAgent(metadataGeneratorAgent);
    EnhancedLogger.log(`Registered ${metadataGeneratorAgent.role} agent (${metadataGeneratorAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Initialize the system
    await system.initialize();
    
    // Log registered agents
    EnhancedLogger.printSection('Registered Agents');
    system.getAllAgents().forEach(agent => {
      EnhancedLogger.log(`${agent.role} (${agent.id.substring(0, 8)})`, LogLevel.INFO);
    });
    
    // Create a test project
    const testProject = {
      title: 'Test Bear Portrait',
      concept: 'a distinguished bear portrait in profile wearing a vintage aviator cap',
      style: 'bear_pfp',
      description: 'A test of the ArtBot system with explicit agent registration',
      requirements: [
        'Generate a high-quality bear portrait',
        'Use Magritte-inspired surrealist style',
        'Include distinguished bear features'
      ]
    };
    
    // Generate the artwork
    EnhancedLogger.printSection('Generating Artwork');
    EnhancedLogger.log(`Concept: ${testProject.concept}`, LogLevel.INFO);
    EnhancedLogger.log(`Style: ${testProject.style}`, LogLevel.INFO);
    EnhancedLogger.log('This may take a few minutes...', LogLevel.INFO);
    
    const result = await system.runArtProject(testProject);
    
    // Output the result
    if (result.success && result.artwork) {
      EnhancedLogger.printSection('Generation Complete');
      EnhancedLogger.log(`Image: ${result.artwork.imageUrl}`, LogLevel.SUCCESS);
      EnhancedLogger.log(`Saved to: ${result.artwork.files.image}`, LogLevel.SUCCESS);
      
      if (result.artwork.character) {
        EnhancedLogger.printSection('Character Information');
        EnhancedLogger.log(`Name: ${result.artwork.character.name}`, LogLevel.INFO);
        EnhancedLogger.log(`Title: ${result.artwork.character.title}`, LogLevel.INFO);
        EnhancedLogger.log(`Personality: ${result.artwork.character.personality.join(', ')}`, LogLevel.INFO);
      }
    } else {
      EnhancedLogger.printSection('Generation Failed');
      EnhancedLogger.log(result.error, LogLevel.ERROR);
    }
  } catch (error) {
    console.error('❌ Art generation failed:');
    console.error(error);
  }
}

// Run the main function
main(); 