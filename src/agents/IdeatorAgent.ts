/**
 * Ideator Agent
 * Responsible for generating creative ideas and enhancing prompts
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, IdeatorAgent as IIdeatorAgent, MessageDirection } from './types';
import { AgentLogger } from '../utils/agentLogger';
import { AIService } from '../services/ai/index';

/**
 * Ideator Agent implementation
 */
export class IdeatorAgent implements IIdeatorAgent {
  id: string;
  role: AgentRole.IDEATOR;
  status: AgentStatus;
  
  private aiService: AIService;
  private messages: AgentMessage[];
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.role = AgentRole.IDEATOR;
    this.status = AgentStatus.IDLE;
    this.aiService = aiService;
    this.messages = [];
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Ideator agent created');
  }
  
  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    AgentLogger.logAgentAction(this, 'Initialize', 'Ideator agent initialized');
  }

  /**
   * Generate a creative idea based on a concept
   */
  async generateIdea(concept: string): Promise<string> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Generate Idea', `Generating idea for concept: ${concept}`);
    
    try {
      // If we have an AI service, use it to generate an idea
      if (this.aiService) {
        const enhancedPrompt = await this.aiService.generateCreativeExploration(concept, {
          depth: 'moderate',
          perspective: 'visual',
          temperature: 0.7
        });
        AgentLogger.logAgentAction(this, 'Generate Idea', 'Successfully generated idea with AI service');
        this.status = AgentStatus.SUCCESS;
        return enhancedPrompt;
      }
      
      // Otherwise, use a simple enhancement
      const enhancedPrompt = this.enhancePromptLocally(concept);
      this.status = AgentStatus.SUCCESS;
      return enhancedPrompt;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Generate Idea Error', `Error: ${error instanceof Error ? error.message : String(error)}`);
      return concept; // Return the original concept if there's an error
    }
  }
  
  /**
   * Enhance a prompt with additional details
   */
  async enhancePrompt(concept: string): Promise<string> {
    return this.generateIdea(concept);
  }
  
  /**
   * Suggest variations of a concept
   */
  async suggestVariations(concept: string, count: number): Promise<string[]> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Suggest Variations', `Generating ${count} variations for concept: ${concept}`);
    
    try {
      // If we have an AI service, use it to generate variations
      if (this.aiService) {
        const prompt = `Generate ${count} creative variations of the following art concept. 
Each variation should be different but maintain the core essence.
Present each variation on a new line with a number.

Original concept: "${concept}"

Variations:`;

        const result = await this.aiService.generateText(prompt, {
          temperature: 0.8,
          maxTokens: 500
        });
        
        // Parse the result to extract variations
        const lines = result.split('\n').filter(line => line.trim().length > 0);
        const variations: string[] = [];
        
        for (const line of lines) {
          // Try to extract numbered variations (e.g., "1. variation text")
          const match = line.match(/^\d+\.\s+(.+)$/);
          if (match && match[1]) {
            variations.push(match[1]);
          }
        }
        
        // If we couldn't extract variations, use the whole result as one variation
        if (variations.length === 0) {
          variations.push(result);
        }
        
        // Ensure we have at least one variation
        if (variations.length === 0) {
          variations.push(concept);
        }
        
        // Limit to requested count
        const finalVariations = variations.slice(0, count);
        
        AgentLogger.logAgentAction(this, 'Suggest Variations', `Successfully generated ${finalVariations.length} variations`);
        this.status = AgentStatus.SUCCESS;
        return finalVariations;
      }
      
      // Otherwise, use simple variations
      const variations = this.generateSimpleVariations(concept, count);
      this.status = AgentStatus.SUCCESS;
      return variations;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Suggest Variations Error', `Error: ${error instanceof Error ? error.message : String(error)}`);
      return [concept]; // Return the original concept if there's an error
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
      if (context.task && context.task.action === 'generate_idea') {
        // Generate an enhanced prompt
        const enhancedPrompt = await this.generateIdea(context.concept);
        
        // Create a result message
        const resultMessage: AgentMessage = {
          id: uuidv4(),
          timestamp: new Date(),
          from: this.role,
          to: AgentRole.DIRECTOR,
          direction: MessageDirection.OUTGOING,
          type: 'result',
          content: { prompt: enhancedPrompt }
        };
        
        // Log the message and add it to our list
        AgentLogger.logAgentMessage(resultMessage);
        this.messages.push(resultMessage);
        
        // Return success
        this.status = AgentStatus.SUCCESS;
        return {
          success: true,
          output: { prompt: enhancedPrompt },
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
  
  /**
   * Local prompt enhancement without AI service
   */
  private enhancePromptLocally(concept: string): string {
    // Add more specific Magritte style elements and details to the concept
    const enhancedConcept = concept
      .replace(/portrait/i, 'meticulously detailed portrait with precise painterly technique')
      .replace(/bear/i, 'distinguished bear with perfectly rendered fur texture')
      .replace(/style of/i, 'authentic painterly style of')
      .replace(/René Magritte/i, 'René Magritte, with his signature smooth oil technique, unmodulated color fields, and philosophical surrealism');
    
    // Add Magritte-specific artistic elements if they're not already included
    const magritteElements = [
      'against a perfectly rendered sky blue background',
      'with carefully balanced surreal elements',
      'featuring clean, precise edges and smooth paint application',
      'with mathematically perfect composition',
      'using Magritte\'s characteristic smooth, matte finish technique',
      'employing subtle tonal transitions with minimal texture'
    ];
    
    // Check if any Magritte elements are already present
    let hasMagritteElement = magritteElements.some(element => 
      enhancedConcept.toLowerCase().includes(element.toLowerCase().substring(0, 20))
    );
    
    // Add a random Magritte element if none are present
    if (!hasMagritteElement) {
      const randomElement = magritteElements[Math.floor(Math.random() * magritteElements.length)];
      return `${enhancedConcept}, ${randomElement}, high quality artwork with painterly precision`;
    }
    
    return `${enhancedConcept}, high quality artwork with painterly precision`;
  }
  
  /**
   * Generate simple variations of a concept
   */
  private generateSimpleVariations(concept: string, count: number): string[] {
    const variations: string[] = [];
    
    // Add the original concept
    variations.push(concept);
    
    // Add some variations based on simple rules
    const modifiers = [
      'with soft lighting',
      'with dramatic lighting',
      'with a neutral expression',
      'with a thoughtful expression',
      'with a dignified stance',
      'set against a plain background',
      'set against a surreal landscape',
      'with symbolic elements',
      'with metaphorical elements',
      'in hyper-realistic detail'
    ];
    
    // Add variations until we reach the requested count
    for (let i = 0; i < count - 1 && i < modifiers.length; i++) {
      variations.push(`${concept}, ${modifiers[i]}`);
    }
    
    return variations.slice(0, count);
  }
} 