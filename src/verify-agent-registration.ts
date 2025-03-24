/**
 * Verify Agent Registration
 * A utility script to verify that all required agents are registered properly
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { ArtBotMultiAgentSystem } from './artbot-multiagent-system';
import { AgentRole } from './agents/types';
import { AIService } from './services/ai';
import { ReplicateService } from './services/replicate';
import { StyleIntegrationService } from './services/style/StyleIntegrationService';
import { EnhancedLogger } from './utils/enhancedLogger';
import { LogLevel } from './utils/agentLogger';

// Load environment variables
dotenv.config();

async function verifyAgentRegistration() {
  EnhancedLogger.printHeader('ArtBot Agent Registration Verification');
  
  try {
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
    
    // Create the multi-agent system with our enhanced automatic registration
    const system = new ArtBotMultiAgentSystem({
      aiService,
      replicateService,
      styleIntegrationService: styleService,
      outputDir: path.join(process.cwd(), 'output', 'verification')
    });
    
    // Initialize the system (this will trigger the automatic agent registration)
    await system.initialize();
    
    // Verify all required agents are registered
    EnhancedLogger.printSection('Agent Registration Status');
    
    // Define required agent roles
    const requiredRoles = [
      AgentRole.DIRECTOR,
      AgentRole.IDEATOR,
      AgentRole.STYLIST,
      AgentRole.REFINER,
      AgentRole.CRITIC,
      AgentRole.CHARACTER_GENERATOR,
      AgentRole.METADATA_GENERATOR
    ];
    
    // Check each required role
    let allRegistered = true;
    
    for (const role of requiredRoles) {
      const agent = system.getAgent(role);
      if (agent) {
        EnhancedLogger.log(`✅ ${role} agent is registered (ID: ${agent.id.substring(0, 8)})`, LogLevel.SUCCESS);
      } else {
        EnhancedLogger.log(`❌ ${role} agent is NOT registered!`, LogLevel.ERROR);
        allRegistered = false;
      }
    }
    
    // Log registered agents
    EnhancedLogger.printSection('All Registered Agents');
    system.getAllAgents().forEach(agent => {
      EnhancedLogger.log(`${agent.role} (${agent.id.substring(0, 8)})`, LogLevel.INFO);
    });
    
    // Final result
    if (allRegistered) {
      EnhancedLogger.printHeader('✅ VERIFICATION SUCCESSFUL');
      EnhancedLogger.log('All required agents are properly registered', LogLevel.SUCCESS);
      return true;
    } else {
      EnhancedLogger.printHeader('❌ VERIFICATION FAILED');
      EnhancedLogger.log('Some required agents are missing', LogLevel.ERROR);
      return false;
    }
  } catch (error) {
    EnhancedLogger.printHeader('❌ VERIFICATION ERROR');
    EnhancedLogger.log(`Error during verification: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
    return false;
  }
}

// Run the verification
verifyAgentRegistration()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 