/**
 * Style Integration Service
 * Ensures all style-related services and utilities are properly integrated 
 * in the art generation process
 */

import { v4 as uuidv4 } from 'uuid';
import { AIService } from '../ai';
import { LogLevel } from '../../utils/enhancedLogger';
import { AgentLogger } from '../../utils/agentLogger';

// Import all style-related services and utilities
import { MagritteStyleEvaluator } from './MagritteStyleEvaluator';
import { MagritteMetadataGenerator } from './MagritteMetadataGenerator';
import { EnhancedMagritteMetadataGenerator } from './EnhancedMagritteMetadataGenerator';
import { MagrittePromptEnhancer, enhanceBearPortraitPrompt } from './magrittePromptEnhancer';
import { EnhancedPromptGenerator } from './enhancedPromptGenerator';
import { EnhancedMagrittePromptService } from './enhancedMagrittePromptService';
import { BEAR_SERIES, getSeriesById, getRandomSeries } from './bearSeriesDefinitions';
import { magrittePatterns } from './magrittePatterns';
import { 
  magritteStyleElements, 
  getStyleElements,
  generateMagritteStyleBlock,
  generateMagritteNegativePrompt
} from './magritteStyleElements';
import { 
  magritteEmphasisElements,
  getRandomEmphasisElements,
  generateComprehensiveEmphasis, 
  generateCustomEmphasis 
} from './magritteEmphasisElements';
import { 
  MAGRITTE_TEMPLATES,
  selectTemplateForSeries, 
  selectRandomTemplate,
  getTemplateById
} from './magrittePromptTemplates';
// Import our new enhanced bear prompt generator
import { EnhancedBearPromptGenerator } from '../../generators/EnhancedBearPromptGenerator';

/**
 * Style Integration Service
 * Centralizes access to all style-related functionality
 */
export class StyleIntegrationService {
  private id: string;
  private aiService: AIService;
  
  // Style services
  private styleEvaluator: MagritteStyleEvaluator;
  private legacyMetadataGenerator: MagritteMetadataGenerator;
  private enhancedMetadataGenerator: EnhancedMagritteMetadataGenerator;
  private promptEnhancer: MagrittePromptEnhancer;
  private promptGenerator: EnhancedPromptGenerator;
  private promptService: EnhancedMagrittePromptService;
  private enhancedBearPromptGenerator: EnhancedBearPromptGenerator; // Add new generator
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.aiService = aiService;
    
    // Initialize all style services
    this.styleEvaluator = new MagritteStyleEvaluator();
    this.legacyMetadataGenerator = new MagritteMetadataGenerator();
    this.enhancedMetadataGenerator = new EnhancedMagritteMetadataGenerator();
    this.promptEnhancer = new MagrittePromptEnhancer();
    this.promptGenerator = new EnhancedPromptGenerator(aiService);
    this.promptService = new EnhancedMagrittePromptService(aiService);
    this.enhancedBearPromptGenerator = new EnhancedBearPromptGenerator(); // Initialize new generator
    
    AgentLogger.log(`StyleIntegrationService (${this.id}) initialized with all style services`, LogLevel.INFO);
  }
  
  /**
   * Generate an enhanced prompt with all style enhancements applied
   */
  async generateEnhancedPrompt(concept: string, options: any = {}) {
    AgentLogger.log(`Generating comprehensive style prompt for: ${concept}`, LogLevel.INFO);
    
    // Get series information
    const seriesId = options.seriesId || (options.series ? options.series.id : null);
    const series = seriesId ? getSeriesById(seriesId) : getRandomSeries();
    
    // Check if this is a bear portrait request and we should use the enhanced generator
    const isBearPortrait = concept.toLowerCase().includes('bear') || 
                           (options.style === 'bear_pfp') || 
                           (options.useEnhancedBearGenerator === true);
    
    let finalPrompt = '';
    let enhancedPromptResult: any = {};
    
    if (isBearPortrait && options.useEnhancedBearGenerator !== false) {
      // Use our new enhanced bear portrait generator
      AgentLogger.log(`Using Enhanced Bear Portrait Generator for: ${concept}`, LogLevel.INFO);
      
      finalPrompt = this.enhancedBearPromptGenerator.generatePortraitPrompt({
        forceBowlerHat: options.forceBowlerHat,
        seriesId: seriesId,
        emphasis: options.emphasis
      });
      
      enhancedPromptResult = {
        prompt: finalPrompt,
        templateName: 'Enhanced Bear Portrait Template',
        negativePrompt: generateMagritteNegativePrompt(),
        series: series,
        usedEnhancedBearGenerator: true
      };
      
      AgentLogger.log(`Generated enhanced bear portrait prompt: ${finalPrompt.substring(0, 50)}...`, LogLevel.INFO);
    } else {
      // First, use the enhanced prompt service
      enhancedPromptResult = await this.promptService.generateEnhancedPrompt(concept, {
        seriesId: series?.id,
        templateId: options.templateId,
        characterName: options.characterName,
        additionalElements: options.additionalElements,
        emphasis: options.emphasis || 'balanced',
        preferredVisualElements: options.preferredVisualElements,
        colorPalette: options.colorPalette
      });
      
      // Then, evaluate and improve the prompt
      const evaluation = this.styleEvaluator.evaluatePrompt(enhancedPromptResult.prompt);
      
      // If the evaluation score is below threshold, further enhance
      finalPrompt = enhancedPromptResult.prompt;
      if (evaluation.score < 0.8) {
        // Apply additional prompt enhancer
        const enhancedResult = await this.promptEnhancer.enhancePrompt(
          finalPrompt,
          series?.id
        );
        finalPrompt = enhancedResult.prompt;
        
        // Apply specific bear portrait enhancements
        finalPrompt = enhanceBearPortraitPrompt(finalPrompt);
      }
      
      enhancedPromptResult = {
        ...enhancedPromptResult,
        prompt: finalPrompt,
        evaluation: evaluation
      };
    }
    
    return {
      ...enhancedPromptResult,
      series: series,
      // Include all integration results
      integrationInfo: {
        allStyleServicesUtilized: true,
        magritteEmphasis: generateComprehensiveEmphasis(),
        magritteStyleBlock: generateMagritteStyleBlock(),
        bearSeries: series,
        template: enhancedPromptResult.templateName,
        visualElements: getStyleElements('visualElements', 3),
        usedEnhancedBearGenerator: enhancedPromptResult.usedEnhancedBearGenerator || false
      }
    };
  }
  
  /**
   * Generate a bear portrait prompt using the enhanced generator
   */
  generateEnhancedBearPrompt(options: any = {}) {
    return this.enhancedBearPromptGenerator.generatePortraitPrompt({
      forceBowlerHat: options.forceBowlerHat,
      seriesId: options.seriesId,
      emphasis: options.emphasis
    });
  }
  
  /**
   * Generate comprehensive metadata using all available metadata generators
   */
  async generateComprehensiveMetadata(
    prompt: string, 
    characterInfo: any, 
    imageUrl: string, 
    artDirection: any = {}
  ) {
    // Generate legacy metadata
    const legacyMetadata = this.legacyMetadataGenerator.generateMagritteMetadata(prompt, artDirection);
    
    // Generate enhanced metadata
    const enhancedMetadata = await this.enhancedMetadataGenerator.generateMetadata(
      prompt, 
      characterInfo, 
      imageUrl, 
      artDirection
    );
    
    // Return comprehensive metadata
    return {
      ...enhancedMetadata,
      legacyMetadata,
      // Include technical details from all available sources
      technical: {
        styleElements: getStyleElements('styleEmphasis', 3),
        compositionGuidelines: getStyleElements('compositionGuidelines', 2),
        colorPalette: getStyleElements('colorPalette', 3),
        emphasisElements: getRandomEmphasisElements('philosophicalDepth', 2)
          .concat(getRandomEmphasisElements('pristineExecution', 2)),
        negativePrompt: generateMagritteNegativePrompt()
      }
    };
  }
  
  /**
   * Get all available style resources
   */
  getStyleResources() {
    return {
      bearSeries: BEAR_SERIES,
      magritteTemplates: MAGRITTE_TEMPLATES,
      styleEmphasisOptions: this.getEmphasisOptions(),
      visualElementOptions: getStyleElements('visualElements'),
      colorPaletteOptions: getStyleElements('colorPalette'),
      enhancedBearPromptGenerator: 'available'
    };
  }
  
  /**
   * Get available emphasis options
   */
  private getEmphasisOptions() {
    return this.promptService.getAvailableEmphasisOptions();
  }
} 