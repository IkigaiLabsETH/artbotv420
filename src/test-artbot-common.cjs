/**
 * Simple test script for ArtBot (CommonJS version)
 * This file is for testing purposes only
 */

// Load environment variables
require('dotenv').config();

// Import dependencies
const { ArtBotMultiAgentSystem } = require('../dist/artbot-multiagent-system');
const { AIService } = require('../dist/services/ai/index');
const { ReplicateService } = require('../dist/services/replicate/index');
const { AgentLogger, LogLevel } = require('../dist/utils/agentLogger');
const { AgentRole } = require('../dist/agents/types');
const { IdeatorAgent } = require('../dist/agents/IdeatorAgent');
const { StylistAgent } = require('../dist/agents/StylistAgent');
const { EnhancedRefinerAgent } = require('../dist/agents/EnhancedRefinerAgent');
const { CharacterGeneratorAgent } = require('../dist/agents/CharacterGeneratorAgent');
const { CriticAgent } = require('../dist/agents/CriticAgent');
const { MetadataGeneratorAgent } = require('../dist/agents/MetadataGeneratorAgent');
const path = require('path');

// Configure the logger
AgentLogger.setLogLevel(LogLevel.DEBUG);
AgentLogger.setEnableColors(true);

// Print welcome message
AgentLogger.logHeader('ArtBot Test');

// Check environment variables
if (!process.env.REPLICATE_API_KEY) {
  console.error('❌ REPLICATE_API_KEY environment variable is required');
  process.exit(1);
}

async function runTest() {
  try {
    AgentLogger.log('🔍 Starting ArtBot test...', LogLevel.INFO);

    // Initialize services
    const aiService = new AIService({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY,
    });
    
    await aiService.initialize();
    AgentLogger.log('✅ AI Service initialized', LogLevel.SUCCESS);
    
    const replicateService = new ReplicateService({
      apiKey: process.env.REPLICATE_API_KEY,
      defaultModel: 'black-forest-labs/flux-1.1-pro',
      defaultWidth: 1024,
      defaultHeight: 1024
    });
    
    await replicateService.initialize();
    AgentLogger.log('✅ Replicate Service initialized', LogLevel.SUCCESS);
    
    // Create the ArtBot system
    const artBotSystem = new ArtBotMultiAgentSystem({
      aiService,
      replicateService,
      outputDir: path.join(process.cwd(), 'output')
    });
    
    // Explicitly register all required agents
    AgentLogger.log('Registering agents...', LogLevel.INFO);
    
    // Create and register the Ideator agent
    const ideatorAgent = new IdeatorAgent(aiService);
    artBotSystem.registerAgent(ideatorAgent);
    AgentLogger.log(`Registered ${ideatorAgent.role} agent (${ideatorAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Create and register the Stylist agent
    const stylistAgent = new StylistAgent(aiService);
    artBotSystem.registerAgent(stylistAgent);
    AgentLogger.log(`Registered ${stylistAgent.role} agent (${stylistAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Create and register the Enhanced Refiner agent
    const refinerAgent = new EnhancedRefinerAgent(aiService);
    artBotSystem.registerAgent(refinerAgent);
    AgentLogger.log(`Registered ${refinerAgent.role} agent (${refinerAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Create and register the Character Generator agent
    const characterGeneratorAgent = new CharacterGeneratorAgent(aiService);
    artBotSystem.registerAgent(characterGeneratorAgent);
    AgentLogger.log(`Registered ${characterGeneratorAgent.role} agent (${characterGeneratorAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Create and register the Critic agent
    const criticAgent = new CriticAgent(aiService);
    artBotSystem.registerAgent(criticAgent);
    AgentLogger.log(`Registered ${criticAgent.role} agent (${criticAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Create and register the Metadata Generator agent
    const metadataGeneratorAgent = new MetadataGeneratorAgent(aiService);
    artBotSystem.registerAgent(metadataGeneratorAgent);
    AgentLogger.log(`Registered ${metadataGeneratorAgent.role} agent (${metadataGeneratorAgent.id.substring(0, 8)})`, LogLevel.INFO);
    
    // Initialize the system
    await artBotSystem.initialize();
    AgentLogger.log('✅ ArtBot system initialized', LogLevel.SUCCESS);
    
    // Log all registered agents
    AgentLogger.log('\nRegistered Agents:', LogLevel.INFO);
    artBotSystem.getAllAgents().forEach(agent => {
      AgentLogger.log(`- ${agent.role} (${agent.id.substring(0, 8)})`, LogLevel.INFO);
    });
    
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
    
    AgentLogger.log(`\n🎨 Generating art for: "${project.concept}"`, LogLevel.INFO);
    AgentLogger.log('This may take a few minutes...', LogLevel.INFO);
    
    // Run the project
    const result = await artBotSystem.runArtProject(project);
    
    // Check result
    if (result.success && result.artwork) {
      AgentLogger.log('\n✅ Art generation successful!', LogLevel.SUCCESS);
      AgentLogger.log(`📷 Image URL: ${result.artwork.imageUrl}`, LogLevel.INFO);
      AgentLogger.log(`📝 Output files:`, LogLevel.INFO);
      
      if (result.artwork.files) {
        AgentLogger.log(`   - Prompt: ${result.artwork.files.prompt}`, LogLevel.INFO);
        AgentLogger.log(`   - Image: ${result.artwork.files.image}`, LogLevel.INFO);
        AgentLogger.log(`   - Metadata: ${result.artwork.files.metadata}`, LogLevel.INFO);
      }
      
      if (result.artwork.character) {
        AgentLogger.log('\n👤 Character Information:', LogLevel.INFO);
        AgentLogger.log(`   - Name: ${result.artwork.character.name}`, LogLevel.INFO);
        AgentLogger.log(`   - Title: ${result.artwork.character.title}`, LogLevel.INFO);
        AgentLogger.log(`   - Personality: ${result.artwork.character.personality.join(', ')}`, LogLevel.INFO);
      }
    } else {
      AgentLogger.log('\n❌ Art generation failed:', LogLevel.ERROR);
      AgentLogger.log(result.error, LogLevel.ERROR);
    }
    
    AgentLogger.log('\n🏁 Test completed', LogLevel.INFO);
  } catch (error) {
    AgentLogger.log('❌ Test failed with error:', LogLevel.ERROR);
    AgentLogger.log(error.toString(), LogLevel.ERROR);
  }
}

// Run the test
runTest().catch(error => {
  AgentLogger.log('❌ Uncaught error in test:', LogLevel.ERROR);
  AgentLogger.log(error.toString(), LogLevel.ERROR);
}); 