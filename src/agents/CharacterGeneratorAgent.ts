/**
 * Character Generator Agent
 * Responsible for generating character identities
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, CharacterGeneratorAgent as ICharacterGeneratorAgent, MessageDirection, CharacterIdentity } from './types';
import { AgentLogger } from '../utils/agentLogger';
import { AIService } from '../services/ai/index';
import { CharacterGenerator } from '../generators/CharacterGenerator';
import { EnhancedCharacterGenerator, CharacterGenerationOptions } from '../generators/EnhancedCharacterGenerator';
import { SeriesType, getRandomCategory, getCategoryById } from '../config/characterCategoriesConfig';

/**
 * Character Generator Agent implementation
 */
export class CharacterGeneratorAgent implements ICharacterGeneratorAgent {
  id: string;
  role: AgentRole.CHARACTER_GENERATOR;
  status: AgentStatus;
  
  private characterGenerator: CharacterGenerator;
  private enhancedGenerator: EnhancedCharacterGenerator;
  private messages: AgentMessage[];
  private useEnhancedGenerator: boolean = true;
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.role = AgentRole.CHARACTER_GENERATOR;
    this.status = AgentStatus.IDLE;
    this.characterGenerator = new CharacterGenerator(aiService);
    this.enhancedGenerator = new EnhancedCharacterGenerator(aiService);
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
  async generateCharacter(concept: string, options?: CharacterGenerationOptions): Promise<CharacterIdentity> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Generate Character', `Generating character for concept: ${concept}`);
    
    try {
      let character: CharacterIdentity;
      
      // Use the enhanced generator if available
      if (this.useEnhancedGenerator) {
        // Construct a simplified prompt for the generator
        const simplifiedPrompt = this.simplifyConceptToPrompt(concept);
        
        AgentLogger.logAgentAction(this, 'Using Enhanced Generator', 
          `Category: ${options?.categoryId || 'auto-detect'}, Series: ${options?.seriesType || 'auto-detect'}`);
          
        character = await this.enhancedGenerator.generateCharacter(concept, simplifiedPrompt, options);
      } else {
        // Use the basic generator
        character = await this.characterGenerator.generateCharacter(concept);
      }
      
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
   * Simplify a concept into a prompt for character generation
   */
  private simplifyConceptToPrompt(concept: string): string {
    // Extract key elements from the concept
    const elements = [];
    
    // Check for profession keywords
    const professionKeywords = [
      'professor', 'doctor', 'artist', 'musician', 'writer', 'explorer',
      'diplomat', 'pilot', 'sailor', 'chef', 'barista', 'painter',
      'sculptor', 'philosopher', 'astronomer', 'botanist', 'alchemist',
      'inventor', 'conductor', 'ambassador'
    ];
    
    const conceptLower = concept.toLowerCase();
    for (const profession of professionKeywords) {
      if (conceptLower.includes(profession)) {
        elements.push(profession);
        break;
      }
    }
    
    // Check for clothing
    if (conceptLower.includes('wearing')) {
      const wearingMatch = concept.match(/wearing ([^,.]+)/i);
      if (wearingMatch && wearingMatch[1]) {
        elements.push(`wearing ${wearingMatch[1].trim()}`);
      }
    }
    
    // Check for accessories
    if (conceptLower.includes('with')) {
      const withMatch = concept.match(/with ([^,.]+)/i);
      if (withMatch && withMatch[1]) {
        elements.push(`with ${withMatch[1].trim()}`);
      }
    }
    
    // Construct a simplified prompt
    if (elements.length > 0) {
      return `A distinguished bear portrait featuring a ${elements.join(', ')}`;
    }
    
    // Return default if no elements found
    return "A distinguished bear portrait in Magritte's surrealist style";
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
        // Extract generation options from context
        const options: CharacterGenerationOptions = {
          allowAiEnhancement: true
        };
        
        // Check for category in task data
        if (context.task.categoryId) {
          options.categoryId = context.task.categoryId;
        }
        
        // Check for series in task data
        if (context.task.seriesType) {
          options.seriesType = context.task.seriesType as SeriesType;
        }
        
        // Generate a character
        const character = await this.generateCharacter(context.concept, options);
        
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
    
    // Process specific message types
    if (message.type === 'request' && message.content?.action === 'generate_character') {
      try {
        // Extract options from the message
        const options: CharacterGenerationOptions = {};
        
        if (message.content.categoryId) {
          options.categoryId = message.content.categoryId;
        }
        
        if (message.content.seriesType) {
          options.seriesType = message.content.seriesType as SeriesType;
        }
        
        if (message.content.allowAiEnhancement !== undefined) {
          options.allowAiEnhancement = message.content.allowAiEnhancement;
        }
        
        // Generate the character
        const character = await this.generateCharacter(message.content.concept, options);
        
        // Create a response message
        const responseMessage: AgentMessage = {
          id: uuidv4(),
          timestamp: new Date(),
          from: this.role,
          to: message.from,
          direction: MessageDirection.OUTGOING,
          type: 'response',
          content: { character }
        };
        
        // Log the response and add it to our list
        AgentLogger.logAgentMessage(responseMessage);
        this.messages.push(responseMessage);
        
        // Send the response (this would be handled by the message bus)
        // For now, we just log that we're ready to send
        AgentLogger.logAgentAction(this, 'Send Response', `Character generated: ${character.name}`);
      } catch (error) {
        // Log the error
        AgentLogger.logAgentAction(this, 'Error', `Failed to process message: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
} 