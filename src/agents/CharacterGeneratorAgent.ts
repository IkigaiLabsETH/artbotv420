/**
 * Character Generator Agent
 * Responsible for generating character identities
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, CharacterGeneratorAgent as ICharacterGeneratorAgent, MessageDirection, CharacterIdentity } from './types';
import { AgentLogger, LogLevel } from '../utils/agentLogger';
import { AIService } from '../services/ai/index';
import { CharacterGenerator } from '../generators/CharacterGenerator';
import { EnhancedCharacterGenerator, CharacterGenerationOptions } from '../generators/EnhancedCharacterGenerator';
import { SeriesType, getRandomCategory, getCategoryById } from '../config/characterCategoriesConfig';

/**
 * Extended options for enhanced character generation
 */
export interface EnhancedCharacterOptions extends CharacterGenerationOptions {
  philosophicalDepth?: number; // 0-1 scale for philosophical complexity
  metaArtisticAwareness?: boolean; // Include meta-artistic elements
  collectionCohesion?: boolean; // Include collection narrative connections
  digitalIdentity?: boolean; // Include digital existence elements
}

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
  private useEnhancedGenerator: boolean = true; // Always use enhanced generator by default
  
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
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Character Generator agent created with Enhanced Generator enabled');
  }
  
  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    AgentLogger.logAgentAction(this, 'Initialize', 'Character Generator agent initialized, using EnhancedCharacterGenerator');
  }

  /**
   * Generate a character based on a concept
   */
  async generateCharacter(concept: string, options?: EnhancedCharacterOptions): Promise<CharacterIdentity> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Generate Character', `Generating character for concept: ${concept}`);
    
    try {
      let character: CharacterIdentity;
      
      // Check if we have category or series options
      const hasCategoryOptions = options?.categoryId || options?.seriesType;
      if (hasCategoryOptions) {
        AgentLogger.logAgentAction(this, 'Character Options', 
          `Using specific category/series: ${options?.categoryId || 'None'} / ${options?.seriesType || 'None'}`);
      }
      
      // Check for enhanced options
      const hasEnhancedOptions = options?.philosophicalDepth !== undefined || 
                                 options?.metaArtisticAwareness || 
                                 options?.collectionCohesion || 
                                 options?.digitalIdentity;
      
      if (hasEnhancedOptions) {
        AgentLogger.logAgentAction(this, 'Enhanced Character Options', 
          `Using enhanced options: Philosophical depth: ${options?.philosophicalDepth || 0}, ` +
          `Meta-artistic: ${options?.metaArtisticAwareness || false}, ` +
          `Collection cohesion: ${options?.collectionCohesion || false}, ` +
          `Digital identity: ${options?.digitalIdentity || false}`);
      }
      
      // Use the enhanced generator if available (default)
      if (this.useEnhancedGenerator) {
        // Construct a simplified prompt for the generator
        const simplifiedPrompt = this.simplifyConceptToPrompt(concept);
        
        AgentLogger.logAgentAction(this, 'Using Enhanced Generator', 
          `Category: ${options?.categoryId || 'auto-detect'}, Series: ${options?.seriesType || 'auto-detect'}`);
          
        // Pass the enhanced options to the enhanced generator
        character = await this.enhancedGenerator.generateCharacter(
          concept, 
          simplifiedPrompt, 
          this.applyEnhancedOptions(options)
        );
        
        // Apply additional meta-artistic elements if needed
        if (hasEnhancedOptions) {
          character = await this.enrichCharacterWithMetaArtisticElements(character, options);
        }
        
        // Log the character details
        AgentLogger.log('┌─── Character Generated ───────────────────┐', LogLevel.INFO);
        AgentLogger.log(`│ Name: ${character.name}`, LogLevel.INFO);
        AgentLogger.log(`│ Title: ${character.title}`, LogLevel.INFO);
        if (character.nickname) AgentLogger.log(`│ Nickname: ${character.nickname}`, LogLevel.INFO);
        AgentLogger.log(`│ Personality: ${character.personality.join(', ')}`, LogLevel.INFO);
        
        // Log meta-artistic elements if present
        if (character.metaArtisticElements) {
          AgentLogger.log(`│ Meta-artistic Elements: ${character.metaArtisticElements.join(', ')}`, LogLevel.INFO);
        }
        if (character.collectionConnections) {
          AgentLogger.log(`│ Collection Connections: ${character.collectionConnections.join(', ')}`, LogLevel.INFO);
        }
        
        AgentLogger.log('└────────────────────────────────────────────┘', LogLevel.INFO);
      } else {
        // Use the basic generator (fallback only)
        AgentLogger.logAgentAction(this, 'Using Basic Generator', 'Fallback to basic character generation');
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
   * Apply enhanced options with defaults
   */
  private applyEnhancedOptions(options?: EnhancedCharacterOptions): CharacterGenerationOptions {
    // Create a basic options object with standard properties
    const baseOptions: CharacterGenerationOptions = {
      categoryId: options?.categoryId,
      seriesType: options?.seriesType,
      // Always enable AI enhancement for meta-artistic features
      allowAiEnhancement: true,
      // Add some randomization if not specified
      randomizationLevel: options?.randomizationLevel || 0.3
    };
    
    return baseOptions;
  }
  
  /**
   * Enrich a character with meta-artistic elements
   */
  private async enrichCharacterWithMetaArtisticElements(
    character: CharacterIdentity, 
    options?: EnhancedCharacterOptions
  ): Promise<CharacterIdentity> {
    if (!options) return character;
    
    const enrichedCharacter = { ...character };
    
    // Add meta-artistic elements
    if (options.metaArtisticAwareness) {
      enrichedCharacter.metaArtisticElements = [
        "Awareness of existing within an artistic portrait",
        "Subtle fourth-wall acknowledgment in character description",
        "Self-reflective nature about artistic representation"
      ];
    }
    
    // Add digital identity elements
    if (options.digitalIdentity) {
      enrichedCharacter.digitalIdentity = [
        "Existence across physical and digital realms",
        "Awareness of digital representation in blockchain space",
        "Connection to digital art history lineage"
      ];
    }
    
    // Add collection cohesion elements
    if (options.collectionCohesion) {
      enrichedCharacter.collectionConnections = [
        "Shared narrative universe with other bear portraits",
        "Recurring symbolic elements connecting to the collection",
        "Complementary character traits to other bears in collection"
      ];
    }
    
    // Add philosophical depth
    if (options.philosophicalDepth && options.philosophicalDepth > 0.7) {
      // If personality doesn't already include philosophical traits, add them
      const philosophicalTraits = ['Contemplative', 'Philosophical', 'Introspective', 'Profound'];
      enrichedCharacter.personality = [
        ...character.personality,
        ...philosophicalTraits.filter(trait => !character.personality.includes(trait)).slice(0, 2)
      ];
      
      // Enhance backstory with philosophical dimension
      if (!enrichedCharacter.backstory.includes('philosophical') && !enrichedCharacter.backstory.includes('contemplat')) {
        enrichedCharacter.backstory += ' This distinguished bear contemplates the nature of existence while bridging traditional art history and contemporary digital representation.';
      }
    }
    
    return enrichedCharacter;
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
        const options: EnhancedCharacterOptions = {
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
        const options: EnhancedCharacterOptions = {};
        
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