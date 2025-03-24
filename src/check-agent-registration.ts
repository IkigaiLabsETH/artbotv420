/**
 * Agent Registration Checker
 * Ensures all required agents are registered with the multi-agent system
 */

import { ArtBotMultiAgentSystem } from './artbot-multiagent-system';
import { AgentRole } from './agents/types';
import { AIService } from './services/ai';
import { ReplicateService } from './services/replicate';
import { IdeatorAgent } from './agents/IdeatorAgent';
import { StylistAgent } from './agents/StylistAgent';
import { EnhancedRefinerAgent } from './agents/EnhancedRefinerAgent';
import { CharacterGeneratorAgent } from './agents/CharacterGeneratorAgent';
import { CriticAgent } from './agents/CriticAgent';
import { MetadataGeneratorAgent } from './agents/MetadataGeneratorAgent';
import { StyleIntegrationService } from './services/style/StyleIntegrationService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config();

async function checkAgentRegistration() {
  console.log('Starting agent registration check...');
  
  // Create services
  const aiService = new AIService({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY
  });
  
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
    outputDir: path.join(process.cwd(), 'output', 'magritte-bears')
  });
  
  // Create and register all required agents
  const requiredAgents = [
    { role: AgentRole.IDEATOR, agent: new IdeatorAgent(aiService) },
    { role: AgentRole.STYLIST, agent: new StylistAgent(aiService) },
    { role: AgentRole.REFINER, agent: new EnhancedRefinerAgent(aiService) },
    { role: AgentRole.CHARACTER_GENERATOR, agent: new CharacterGeneratorAgent(aiService) },
    { role: AgentRole.CRITIC, agent: new CriticAgent(aiService) },
    { role: AgentRole.METADATA_GENERATOR, agent: new MetadataGeneratorAgent(aiService) }
  ];
  
  // Register all agents
  for (const { role, agent } of requiredAgents) {
    console.log(`Registering ${role} agent...`);
    system.registerAgent(agent);
  }
  
  // Verify all agents are registered
  console.log('\nVerifying agent registration:');
  
  // Director is registered automatically by the system
  const allRoles = [
    AgentRole.DIRECTOR,
    ...requiredAgents.map(({ role }) => role)
  ];
  
  let allRegistered = true;
  
  for (const role of allRoles) {
    const agent = system.getAgent(role);
    if (agent) {
      console.log(`✅ ${role} agent is registered (ID: ${agent.id.substring(0, 8)})`);
    } else {
      console.log(`❌ ${role} agent is NOT registered!`);
      allRegistered = false;
    }
  }
  
  if (allRegistered) {
    console.log('\n✅ All required agents are successfully registered!');
  } else {
    console.log('\n❌ Some agents are missing. Please check the registration process.');
  }
  
  return allRegistered;
}

// Run the check function
checkAgentRegistration()
  .then(success => {
    if (success) {
      console.log('Agent registration check completed successfully.');
    } else {
      console.error('Agent registration check failed. Some agents are missing.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error during agent registration check:', error);
    process.exit(1);
  }); 