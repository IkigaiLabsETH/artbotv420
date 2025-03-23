/**
 * RefinerAgentFactory
 * Factory for creating RefinerAgent instances
 */

import { AIService } from '../services/ai/index';
import { RefinerAgent as IRefinerAgent, AgentRole } from './types';
import { RefinerAgent } from './RefinerAgent';
import { EnhancedRefinerAgent } from './EnhancedRefinerAgent';

export enum RefinerAgentType {
  STANDARD = 'standard',
  ENHANCED = 'enhanced'
}

export class RefinerAgentFactory {
  /**
   * Create a new RefinerAgent instance
   */
  static createRefinerAgent(
    type: RefinerAgentType = RefinerAgentType.ENHANCED,
    aiService: AIService
  ): IRefinerAgent {
    switch (type) {
      case RefinerAgentType.ENHANCED:
        return new EnhancedRefinerAgent(aiService);
      case RefinerAgentType.STANDARD:
        return new RefinerAgent(aiService);
      default:
        // Default to enhanced refiner
        return new EnhancedRefinerAgent(aiService);
    }
  }
  
  /**
   * Check if an agent is a refiner agent
   */
  static isRefinerAgent(agent: any): boolean {
    return agent && agent.role === AgentRole.REFINER;
  }
} 