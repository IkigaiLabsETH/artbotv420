/**
 * Enhanced Magritte Prompt Service
 * Integrates the enhanced prompt generator with the art generation system
 */

import { AIService } from '../ai';
import { EnhancedPromptGenerator, GeneratedPrompt } from './enhancedPromptGenerator';
import { CharacterIdentity } from '../../agents/types';
import { BearSeriesDefinition } from './bearSeriesDefinitions';
import { MagritteTemplate } from './magrittePromptTemplates';

export interface EnhancedPromptResult {
  prompt: string;
  negativePrompt: string;
  characterIdentity: CharacterIdentity;
  conceptualProcess: string;
  seriesName: string;
  seriesEmoji: string;
  templateName: string;
  referenceArtwork: string;
  emphasisBlock: string;
  metadata: Record<string, any>;
  promptStructure: {
    prefix: string;
    body: string;
    suffix: string;
    emphasisBlock: string;
    styleBlock: string;
    colorInstructions: string;
    compositionInstructions: string;
  };
}

export interface MagritteEmphasisOptions {
  philosophical?: boolean;
  technical?: boolean;
  dreamlike?: boolean;
  traditional?: boolean;
  surreal?: boolean;
}

export interface EnhancedPromptOptions {
  seriesId?: string;
  templateId?: string;
  characterName?: string;
  additionalElements?: string[];
  emphasis?: MagritteEmphasisOptions | 'balanced' | 'philosophical' | 'technical' | 'dreamlike' | 'traditional' | 'surreal';
  preferredVisualElements?: string[];
  colorPalette?: string[];
}

/**
 * Enhanced Magritte Prompt Service
 * Connects the enhanced prompt generator to the art generation pipeline
 */
export class EnhancedMagrittePromptService {
  private aiService: AIService;
  private promptGenerator: EnhancedPromptGenerator;
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.aiService = aiService;
    this.promptGenerator = new EnhancedPromptGenerator(aiService);
  }
  
  /**
   * Generate an enhanced prompt for a bear portrait
   */
  async generateEnhancedPrompt(
    concept: string,
    options: EnhancedPromptOptions = {}
  ): Promise<EnhancedPromptResult> {
    // Convert emphasis option to the appropriate format
    const emphasisPriorities = this.parseEmphasisOption(options.emphasis);
    
    // Use the enhanced prompt generator
    const result = await this.promptGenerator.generatePrompt(concept, {
      ...options,
      emphasisPriorities,
      preferredVisualElements: options.preferredVisualElements,
      colorPalette: options.colorPalette
    });
    
    // Convert to compatible format for art generation system
    return this.convertToPromptResult(result);
  }
  
  /**
   * Parse the emphasis option to get proper priorities
   */
  private parseEmphasisOption(emphasis?: MagritteEmphasisOptions | 'balanced' | 'philosophical' | 'technical' | 'dreamlike' | 'traditional' | 'surreal'): MagritteEmphasisOptions | undefined {
    if (!emphasis) {
      return undefined; // Use default balanced approach
    }
    
    // Handle string shortcuts
    if (typeof emphasis === 'string') {
      switch (emphasis) {
        case 'balanced':
          return {
            philosophical: true,
            technical: true,
            dreamlike: true,
            traditional: true,
            surreal: true
          };
        case 'philosophical':
          return {
            philosophical: true,
            technical: false,
            dreamlike: false,
            traditional: false,
            surreal: false
          };
        case 'technical':
          return {
            philosophical: false,
            technical: true,
            dreamlike: false,
            traditional: false,
            surreal: false
          };
        case 'dreamlike':
          return {
            philosophical: false,
            technical: false,
            dreamlike: true,
            traditional: false,
            surreal: false
          };
        case 'traditional':
          return {
            philosophical: false,
            technical: false,
            dreamlike: false,
            traditional: true,
            surreal: false
          };
        case 'surreal':
          return {
            philosophical: false,
            technical: false,
            dreamlike: false,
            traditional: false,
            surreal: true
          };
        default:
          return undefined;
      }
    }
    
    // Use the object directly
    return emphasis;
  }
  
  /**
   * Convert the enhanced generator result to a compatible format
   */
  private convertToPromptResult(generatedPrompt: GeneratedPrompt): EnhancedPromptResult {
    // Extract key metadata for the art generation system
    const metadata = {
      series: generatedPrompt.series.id,
      seriesName: generatedPrompt.series.name,
      template: generatedPrompt.template.id,
      templateName: generatedPrompt.template.name,
      referenceArtwork: generatedPrompt.template.referenceArtwork,
      styleParameters: generatedPrompt.styleParameters,
      characterTraits: generatedPrompt.characterIdentity.personality,
      magritteElements: generatedPrompt.series.magritteElements,
      promptStructure: generatedPrompt.promptStructure,
      templateVariables: generatedPrompt.templateVariables,
    };
    
    // Return in compatible format
    return {
      prompt: generatedPrompt.prompt,
      negativePrompt: generatedPrompt.negativePrompt,
      characterIdentity: generatedPrompt.characterIdentity,
      conceptualProcess: generatedPrompt.conceptualProcess,
      seriesName: generatedPrompt.series.name,
      seriesEmoji: generatedPrompt.series.emoji,
      templateName: generatedPrompt.template.name,
      referenceArtwork: generatedPrompt.template.referenceArtwork,
      emphasisBlock: generatedPrompt.promptStructure.emphasisBlock,
      promptStructure: generatedPrompt.promptStructure,
      metadata
    };
  }
  
  /**
   * Get a list of available series
   */
  getAvailableSeries(): { id: string; name: string; emoji: string; description: string }[] {
    // Import here to avoid circular references
    const { BEAR_SERIES } = require('./bearSeriesDefinitions');
    
    return BEAR_SERIES.map((series: BearSeriesDefinition) => ({
      id: series.id,
      name: series.name,
      emoji: series.emoji,
      description: series.description
    }));
  }
  
  /**
   * Get a list of available templates
   */
  getAvailableTemplates(): { id: string; name: string; description: string; referenceArtwork: string }[] {
    // Import here to avoid circular references
    const { MAGRITTE_TEMPLATES } = require('./magrittePromptTemplates');
    
    return MAGRITTE_TEMPLATES.map((template: MagritteTemplate) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      referenceArtwork: template.referenceArtwork
    }));
  }
  
  /**
   * Get available Magritte emphasis options
   */
  getAvailableEmphasisOptions(): {
    id: string;
    name: string;
    description: string;
  }[] {
    return [
      { 
        id: 'balanced', 
        name: 'Balanced Magritte Style', 
        description: 'Equal emphasis on all Magritte elements: philosophical depth, pristine execution, dreamlike clarity, traditional techniques, and surreal juxtapositions'
      },
      { 
        id: 'philosophical', 
        name: 'Philosophical Depth', 
        description: 'Emphasis on conceptual paradoxes and philosophical inquiry in Magritte\'s work'
      },
      { 
        id: 'technical', 
        name: 'Pristine Execution', 
        description: 'Emphasis on Magritte\'s meticulous technical precision and immaculate rendering'
      },
      { 
        id: 'dreamlike', 
        name: 'Dreamlike Clarity', 
        description: 'Emphasis on the paradoxical clarity and metaphysical mystery in Magritte\'s images'
      },
      { 
        id: 'traditional', 
        name: 'Traditional Techniques', 
        description: 'Emphasis on Magritte\'s use of classical oil painting methods and craftsmanship'
      },
      { 
        id: 'surreal', 
        name: 'Surreal Juxtapositions', 
        description: 'Emphasis on Magritte\'s signature approach to unexpectedly combining ordinary objects'
      }
    ];
  }
  
  /**
   * Get available visual elements
   */
  getAvailableVisualElements(): string[] {
    // Import here to avoid circular references
    const { magritteStyleElements } = require('./magritteStyleElements');
    return magritteStyleElements.visualElements;
  }
  
  /**
   * Get available color palette
   */
  getAvailableColorPalette(): string[] {
    // Import here to avoid circular references
    const { magritteStyleElements } = require('./magritteStyleElements');
    return magritteStyleElements.colorPalette;
  }
} 