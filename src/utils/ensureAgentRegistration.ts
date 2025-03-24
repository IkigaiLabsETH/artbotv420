/**
 * Ensure Agent Registration
 * 
 * Utility functions to ensure all required agents are registered with the multi-agent system
 */

import { ArtBotMultiAgentSystem } from '../artbot-multiagent-system';
import { Agent, AgentRole } from '../agents/types';
import { AIService } from '../services/ai';
import { IdeatorAgent } from '../agents/IdeatorAgent';
import { StylistAgent } from '../agents/StylistAgent';
import { EnhancedRefinerAgent } from '../agents/EnhancedRefinerAgent';
import { CharacterGeneratorAgent } from '../agents/CharacterGeneratorAgent';
import { CriticAgent } from '../agents/CriticAgent';
import { MetadataGeneratorAgent } from '../agents/MetadataGeneratorAgent';
import { AgentLogger, LogLevel } from './agentLogger';

/**
 * Ensure all required agents are registered with the multi-agent system
 * 
 * @param system The multi-agent system to check and register agents with
 * @param aiService The AI service to use for creating agents
 * @returns True if all agents are registered, false otherwise
 */
export function ensureRequiredAgentsRegistered(
  system: ArtBotMultiAgentSystem, 
  aiService: AIService
): boolean {
  // Check if agents are already registered
  const missingAgentRoles = getMissingAgentRoles(system);
  
  if (missingAgentRoles.length === 0) {
    AgentLogger.log('All required agents are already registered', LogLevel.INFO);
    return true;
  }
  
  // Register missing agents
  AgentLogger.log(`Registering missing agents: ${missingAgentRoles.join(', ')}`, LogLevel.INFO);
  
  for (const role of missingAgentRoles) {
    const agent = createAgentByRole(role, aiService);
    if (agent) {
      system.registerAgent(agent);
      AgentLogger.log(`Registered ${role} agent (${agent.id.substring(0, 8)})`, LogLevel.INFO);
    } else {
      AgentLogger.log(`Failed to create agent for role: ${role}`, LogLevel.ERROR);
      return false;
    }
  }
  
  // Verify all agents are now registered
  const stillMissingRoles = getMissingAgentRoles(system);
  if (stillMissingRoles.length > 0) {
    AgentLogger.log(`Failed to register all required agents. Still missing: ${stillMissingRoles.join(', ')}`, LogLevel.ERROR);
    return false;
  }
  
  AgentLogger.log('Successfully registered all required agents', LogLevel.INFO);
  return true;
}

/**
 * Get a list of agent roles that are required but not registered
 */
function getMissingAgentRoles(system: ArtBotMultiAgentSystem): AgentRole[] {
  const requiredRoles = [
    AgentRole.DIRECTOR,  // Should be registered by the system automatically
    AgentRole.IDEATOR,
    AgentRole.STYLIST,
    AgentRole.REFINER,
    AgentRole.CHARACTER_GENERATOR,
    AgentRole.CRITIC,
    AgentRole.METADATA_GENERATOR
  ];
  
  return requiredRoles.filter(role => !system.getAgent(role));
}

/**
 * Create an agent instance for a given role
 */
function createAgentByRole(role: AgentRole, aiService: AIService): Agent | null {
  switch (role) {
    case AgentRole.IDEATOR:
      return new IdeatorAgent(aiService);
    case AgentRole.STYLIST:
      return new StylistAgent(aiService);
    case AgentRole.REFINER:
      return new EnhancedRefinerAgent(aiService);
    case AgentRole.CHARACTER_GENERATOR:
      return new CharacterGeneratorAgent(aiService);
    case AgentRole.CRITIC:
      return new CriticAgent(aiService);
    case AgentRole.METADATA_GENERATOR:
      return new MetadataGeneratorAgent(aiService);
    default:
      AgentLogger.log(`No implementation available for agent role: ${role}`, LogLevel.ERROR);
      return null;
  }
} 