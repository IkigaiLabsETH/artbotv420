/**
 * Character Generator Agent
 * Responsible for generating character identities
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, CharacterGeneratorAgent as ICharacterGeneratorAgent, MessageDirection, CharacterIdentity } from './types';
import { AgentLogger } from '../utils/agentLogger';
import { AIService } from '../services/ai/index';
import { CharacterGenerator } from '../generators/CharacterGenerator';

/**
 * Character Generator Agent implementation
 */
export class CharacterGeneratorAgent implements ICharacterGeneratorAgent {
  id: string;
  role: AgentRole.CHARACTER_GENERATOR;
  status: AgentStatus;
  
  private characterGenerator: CharacterGenerator;
  private messages: AgentMessage[];
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.role = AgentRole.CHARACTER_GENERATOR;
    this.status = AgentStatus.IDLE;
    this.characterGenerator = new CharacterGenerator(aiService);
    this.messages = [];
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Character Generator agent created');
  }
  
  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    AgentLogger.logAgentAction(this, 'Initialize', 'Character Generator agent initialized');
  }

  /**
   * Generate a character based on a concept
   */
  async generateCharacter(concept: string): Promise<CharacterIdentity> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Generate Character', `Generating character for concept: ${concept}`);
    
    try {
      // Generate the character using the character generator
      const character = await this.characterGenerator.generateCharacter(concept);
      
      AgentLogger.logAgentAction(this, 'Generate Character', `Generated character: ${character.name}, ${character.title}`);
      this.status = AgentStatus.SUCCESS;
      return character;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Generate Character Error', `Error: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return a default character if there's an error
      return {
        name: 'Distinguished Bear',
        title: 'The Untitled',
        personality: ['Mysterious', 'Distinguished'],
        backstory: 'A bear of unknown origin, wrapped in mystery.'
      };
    }
  }
  
  /**
   * Process a context
   */
  async process(context: AgentContext): Promise<AgentResult> {
    this.status = AgentStatus.BUSY;
    
    try {
      // Check if we have a concept to work with
      if (!context.concept) {
        throw new Error('No concept provided in context');
      }
      
      // Process based on task type
      if (context.task && context.task.action === 'generate_character') {
        // Generate a character
        const character = await this.generateCharacter(context.concept);
        
        // Create a result message
        const resultMessage: AgentMessage = {
          id: uuidv4(),
          timestamp: new Date(),
          from: this.role,
          to: AgentRole.DIRECTOR,
          direction: MessageDirection.OUTGOING,
          type: 'result',
          content: { character }
        };
        
        // Log the message and add it to our list
        AgentLogger.logAgentMessage(resultMessage);
        this.messages.push(resultMessage);
        
        // Return success
        this.status = AgentStatus.SUCCESS;
        return {
          success: true,
          output: { character },
          messages: [resultMessage]
        };
      }
      
      // If we don't know the task, return an error
      throw new Error(`Unknown task: ${context.task?.action}`);
    } catch (error) {
      this.status = AgentStatus.ERROR;
      
      // Create an error message
      const errorMessage: AgentMessage = {
        id: uuidv4(),
        timestamp: new Date(),
        from: this.role,
        to: AgentRole.DIRECTOR,
        direction: MessageDirection.OUTGOING,
        type: 'error',
        content: { error: error instanceof Error ? error.message : String(error) }
      };
      
      // Log the message and add it to our list
      AgentLogger.logAgentMessage(errorMessage);
      this.messages.push(errorMessage);
      
      // Return error
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        messages: [errorMessage]
      };
    }
  }
  
  /**
   * Handle a message from another agent
   */
  async handleMessage(message: AgentMessage): Promise<void> {
    // Add the message to our list
    this.messages.push(message);
    
    // Log the message
    AgentLogger.logAgentMessage(message);
  }
} 