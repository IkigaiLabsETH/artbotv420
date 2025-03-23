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
   * Identify potential series types from concept content
   */
  private identifySeriesFromConcept(concept: string): string | null {
    // Check for series-specific keywords
    const seriesKeywords: Record<string, string[]> = {
      'hipster': ['hipster', 'artisanal', 'sustainable', 'craft', 'brewing', 'urban', 'vintage', 'foraging'],
      'adventure': ['adventure', 'explorer', 'wilderness', 'expedition', 'navigation', 'diving', 'climbing', 'exploration'],
      'artistic': ['artistic', 'artist', 'creative', 'painting', 'sculpture', 'craft', 'composition', 'design'],
      'academic': ['academic', 'scholarly', 'professor', 'scientific', 'research', 'studied', 'intellectual', 'knowledge'],
      'steampunk': ['steampunk', 'mechanical', 'brass', 'victorian', 'gear', 'clockwork', 'contraption', 'invention']
    };
    
    // Check each series for keyword matches
    const conceptLower = concept.toLowerCase();
    const matches: Record<string, number> = {};
    
    for (const [series, keywords] of Object.entries(seriesKeywords)) {
      let matchCount = 0;
      for (const keyword of keywords) {
        if (conceptLower.includes(keyword)) {
          matchCount++;
        }
      }
      
      if (matchCount > 0) {
        matches[series] = matchCount;
      }
    }
    
    // Return the series with the most matches, if any
    if (Object.keys(matches).length > 0) {
      const seriesSorted = Object.entries(matches).sort((a, b) => b[1] - a[1]);
      return seriesSorted[0][0]; // Return the series with most matches
    }
    
    return null;
  }

  /**
   * Generate a creative idea based on a concept
   */
  async generateIdea(concept: string): Promise<string> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Generate Idea', `Generating idea for concept: ${concept}`);
    
    try {
      // Check if we can identify any series information from the concept
      const identifiedSeries = this.identifySeriesFromConcept(concept);
      if (identifiedSeries && !concept.toLowerCase().includes(identifiedSeries)) {
        AgentLogger.logAgentAction(this, 'Series Identified', `Detected ${identifiedSeries} series from concept content`);
        concept = `${concept} with ${identifiedSeries} series elements`;
      }
      
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
      
      // Check for series information in the context or project
      let seriesInfo = '';
      if (context.project && context.project.characterOptions && context.project.characterOptions.seriesType) {
        seriesInfo = context.project.characterOptions.seriesType;
        AgentLogger.logAgentAction(this, 'Series Detected', `Found series in context: ${seriesInfo}`);
      }
      
      // Incorporate series information into the concept if available
      let conceptToUse = context.concept;
      if (seriesInfo && !conceptToUse.toLowerCase().includes(seriesInfo.toLowerCase())) {
        conceptToUse = `${conceptToUse} with ${seriesInfo} series elements`;
        AgentLogger.logAgentAction(this, 'Enhance Concept', `Added series information: ${seriesInfo}`);
      }
      
      // Process based on task type
      if (context.task && (context.task.action === 'generate_idea' || context.task.action === 'enhance_prompt')) {
        // Generate an enhanced prompt
        const enhancedPrompt = await this.generateIdea(conceptToUse);
        
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
    
    // Check if the prompt contains specific series references
    const hasHipster = concept.toLowerCase().includes('hipster');
    const hasAdventure = concept.toLowerCase().includes('adventure');
    const hasArtistic = concept.toLowerCase().includes('artistic');
    
    // Add series-specific elements
    let seriesElement = '';
    if (hasHipster) {
      const hipsterElements = [
        'with artisanal craft tools and sustainable materials',
        'featuring specialized hipster brewing equipment',
        'with vintage record collection and analog audio devices',
        'carrying handcrafted foraging tools and botanical specimens',
        'adorned with carefully curated urban farming implements',
        'with an assortment of sustainable craft materials'
      ];
      seriesElement = hipsterElements[Math.floor(Math.random() * hipsterElements.length)];
    } else if (hasAdventure) {
      const adventureElements = [
        'with specialized exploration gear and navigational instruments',
        'equipped with vintage adventure tools and map-making implements',
        'featuring wilderness survival equipment and scientific tools',
        'with specialized diving apparatus and marine exploration tools',
        'outfitted with mountaineering equipment and measurement devices',
        'with cartography tools and geographical instruments'
      ];
      seriesElement = adventureElements[Math.floor(Math.random() * adventureElements.length)];
    } else if (hasArtistic) {
      const artisticElements = [
        'with specialized artist tools and creative implements',
        'featuring traditional painting supplies and color palette',
        'with sculpting tools and artistic materials',
        'carrying precision artistic instruments and crafting tools',
        'surrounded by creative materials and artistic implements',
        'with professional artistic equipment and media'
      ];
      seriesElement = artisticElements[Math.floor(Math.random() * artisticElements.length)];
    }
    
    // Magritte-specific artistic elements
    const magritteElements = [
      'against a perfectly rendered Belgian sky blue background',
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
    
    // Add Magritte element if needed
    const magritteElement = hasMagritteElement ? '' : 
      `, ${magritteElements[Math.floor(Math.random() * magritteElements.length)]}`;
    
    // Add series-specific element if found
    const seriesAddition = seriesElement ? `, ${seriesElement}` : '';
    
    return `${enhancedConcept}${magritteElement}${seriesAddition}, high quality artwork with painterly precision`;
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