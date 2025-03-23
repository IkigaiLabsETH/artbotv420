/**
 * Enhanced Prompt Generator
 * Advanced prompt generation system for Surrealist Bear Portraits
 */

import { AIService } from '../ai';
import { BearSeriesDefinition, getSeriesById, getRandomSeries } from './bearSeriesDefinitions';
import { MagritteTemplate, selectTemplateForSeries, selectRandomTemplate, getTemplateById } from './magrittePromptTemplates';
import { magrittePatterns } from './magrittePatterns';
import { 
  magritteEmphasisElements, 
  getRandomEmphasisElements, 
  generateComprehensiveEmphasis, 
  generateCustomEmphasis 
} from './magritteEmphasisElements';
import { 
  magritteStyleElements,
  getStyleElements,
  generateMagritteStyleBlock,
  generateMagritteNegativePrompt,
  generateColorInstructions,
  generateCompositionInstructions
} from './magritteStyleElements';
import { defaultGenerationConfig } from '../../config/generationConfig';
import { CharacterGenerator, CharacterPromptElements } from '../../generators/CharacterGenerator';

// Import types
import { CharacterIdentity } from '../../agents/types';

export interface PromptStyleParameters {
  technique: string[];
  composition: string[];
  lighting: string[];
  colorPalette: string[];
  surface: string[];
  philosophicalEmphasis: string[];
  technicalEmphasis: string[];
  dreamlikeEmphasis: string[];
  traditionalEmphasis: string[];
  surrealEmphasis: string[];
  combinedEmphasis: string;
  visualElements: string[];
  compositionGuidelines: string[];
  styleEmphasis: string[];
  referencedWorks: string[];
}

export interface GeneratedPrompt {
  // Core prompt elements
  prompt: string;
  negativePrompt: string;
  
  // Style information
  styleParameters: PromptStyleParameters;
  
  // Content information
  series: BearSeriesDefinition;
  template: MagritteTemplate;
  characterIdentity: CharacterIdentity;
  
  // Metadata
  conceptualProcess: string;
  referencedWorks: string[];
  promptStructure: {
    prefix: string;
    body: string;
    suffix: string;
    emphasisBlock: string;
    styleBlock: string;
    colorInstructions: string;
    compositionInstructions: string;
  };
  templateVariables: Record<string, string>;
}

/**
 * Enhanced Prompt Generator
 * Creates sophisticated prompts for Surrealist Bear Portraits
 */
export class EnhancedPromptGenerator {
  private aiService: AIService;
  private characterGenerator: CharacterGenerator;
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.aiService = aiService;
    this.characterGenerator = new CharacterGenerator(aiService);
  }
  
  /**
   * Generate a comprehensive prompt for a bear portrait
   */
  async generatePrompt(
    concept: string,
    options: {
      seriesId?: string;
      templateId?: string;
      characterName?: string;
      additionalElements?: string[];
      emphasisPriorities?: {
        philosophical?: boolean;
        technical?: boolean;
        dreamlike?: boolean;
        traditional?: boolean;
        surreal?: boolean;
      };
      colorPalette?: string[];
      preferredVisualElements?: string[];
    } = {}
  ): Promise<GeneratedPrompt> {
    // 1. Select series - either specified or random
    const series = options.seriesId ? getSeriesById(options.seriesId) : getRandomSeries();
    if (!series) {
      throw new Error(`Series with ID ${options.seriesId} not found`);
    }
    
    // 2. Select appropriate template - either specified or based on series
    const template = options.templateId 
      ? getTemplateById(options.templateId) || selectTemplateForSeries(series.id)
      : selectTemplateForSeries(series.id);
      
    // 3. Extract elements from concept
    const promptElements = await this.analyzePromptConcept(concept, series);
    
    // 4. Generate character identity
    const characterIdentity = await this.generateCharacterIdentity(
      concept, 
      series, 
      options.characterName,
      promptElements
    );
    
    // 5. Create character description
    const characterDescription = this.createCharacterDescription(characterIdentity, series, promptElements);
    
    // 6. Select visual elements from series definition and Magritte patterns
    const visualElements = this.selectVisualElements(series, promptElements, options.preferredVisualElements);
    
    // 7. Select style parameters with enhanced emphasis
    const styleParameters = this.selectStyleParameters(options.emphasisPriorities, options.colorPalette);
    
    // 8. Fill in template variables
    const templateVariables = this.fillTemplateVariables(
      template, 
      characterDescription, 
      visualElements, 
      styleParameters,
      promptElements,
      options.additionalElements || []
    );
    
    // 9. Generate prompt body
    const promptBody = this.applyTemplateWithVariables(template.template, templateVariables);
    
    // 10. Create Magritte emphasis block
    const emphasisBlock = this.createEmphasisBlock(styleParameters, options.emphasisPriorities);
    
    // 11. Create enhanced style block
    const styleBlock = generateMagritteStyleBlock();
    
    // 12. Generate color instructions
    const colorInstructions = generateColorInstructions(3);
    
    // 13. Generate composition instructions
    const compositionInstructions = generateCompositionInstructions(2);
    
    // 14. Get conceptual process
    const conceptualProcess = await this.generateConceptualProcess(
      promptBody,
      series,
      template,
      characterIdentity
    );
    
    // 15. Create negative prompt with enhanced avoidance elements
    const negativePrompt = this.generateNegativePrompt(series);
    
    // 16. Build final prompt structure
    const promptPrefix = defaultGenerationConfig.styles.magritte.promptPrefix || '';
    const promptSuffix = defaultGenerationConfig.styles.magritte.promptSuffix || '';
    
    // 17. Combine all elements for the final prompt
    const finalPrompt = `${promptPrefix}${promptBody}. ${emphasisBlock} ${styleBlock} ${colorInstructions} ${compositionInstructions}${promptSuffix}`;
    
    // 18. Return complete result
    return {
      prompt: finalPrompt,
      negativePrompt,
      styleParameters,
      series,
      template,
      characterIdentity,
      conceptualProcess,
      referencedWorks: [...styleParameters.referencedWorks],
      promptStructure: {
        prefix: promptPrefix,
        body: promptBody,
        suffix: promptSuffix,
        emphasisBlock,
        styleBlock,
        colorInstructions,
        compositionInstructions
      },
      templateVariables
    };
  }
  
  /**
   * Create a dedicated emphasis block focusing on the key Magritte elements
   */
  private createEmphasisBlock(
    styleParameters: PromptStyleParameters,
    priorities?: {
      philosophical?: boolean;
      technical?: boolean;
      dreamlike?: boolean;
      traditional?: boolean;
      surreal?: boolean;
    }
  ): string {
    // If no specific priorities, use a comprehensive emphasis
    if (!priorities) {
      return generateComprehensiveEmphasis();
    }
    
    // Otherwise, generate custom emphasis based on priorities
    return generateCustomEmphasis({
      philosophical: priorities.philosophical,
      technical: priorities.technical,
      dreamlike: priorities.dreamlike,
      traditional: priorities.traditional,
      surreal: priorities.surreal,
      combined: true // Always include a combined element for coherence
    });
  }
  
  /**
   * Analyze the prompt concept to extract relevant elements
   */
  private async analyzePromptConcept(
    concept: string, 
    series: BearSeriesDefinition
  ): Promise<CharacterPromptElements> {
    try {
      const prompt = `
      Analyze the following concept for a surrealist bear portrait in René Magritte's style:
      "${concept}"
      
      This portrait belongs to the ${series.name} (${series.emoji}).
      Key elements of this series include: ${series.keyElements.join(', ')}
      Common accessories: ${series.accessories.join(', ')}
      
      Please identify:
      1. Professional accessories (tools, equipment, instruments)
      2. Clothing/attire description
      3. Professional role or occupation
      4. Personal attributes or characteristics
      5. Artistic style or aesthetic
      
      Return the results in JSON format with these keys: accessories (array), clothing (string), profession (string), attributes (array), style (string)
      `;

      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You analyze art concepts and extract character elements for portrait generation.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      });

      try {
        const parsed = JSON.parse(response.content);
        
        return {
          accessories: Array.isArray(parsed.accessories) ? parsed.accessories : [],
          clothing: typeof parsed.clothing === 'string' ? parsed.clothing : '',
          profession: typeof parsed.profession === 'string' ? parsed.profession : '',
          attributes: Array.isArray(parsed.attributes) ? parsed.attributes : [],
          style: typeof parsed.style === 'string' ? parsed.style : '',
        };
      } catch (parseError) {
        console.warn('Error parsing AI response as JSON:', parseError);
        // Extract key elements from text response as fallback
        const accessories = this.extractFromResponse(response.content, 'accessories', 'tools', 'equipment');
        const clothing = this.extractFromResponse(response.content, 'clothing', 'attire', 'wearing');
        const profession = this.extractFromResponse(response.content, 'profession', 'role', 'occupation');
        const attributes = this.extractFromResponse(response.content, 'attributes', 'characteristics', 'qualities');
        
        return {
          accessories: accessories.split(',').map(a => a.trim()).filter(a => a),
          clothing: clothing || 'formal attire',
          profession: profession || series.name.replace(' Series', ' Professional'),
          attributes: attributes.split(',').map(a => a.trim()).filter(a => a),
          style: 'Magritte surrealist style'
        };
      }
    } catch (error) {
      console.error('Error analyzing prompt concept:', error);
      
      // Fallback to basic extraction from concept
      return {
        accessories: series.accessories.slice(0, 2),
        clothing: concept.includes('wearing') ? concept.split('wearing')[1]?.split(',')[0]?.trim() || 'formal attire' : 'formal attire',
        profession: series.name.replace(' Series', ' Professional'),
        attributes: series.characterTraits.slice(0, 3),
        style: 'Magritte surrealist'
      };
    }
  }
  
  /**
   * Simple helper to extract content from AI response when JSON parsing fails
   */
  private extractFromResponse(text: string, ...keywords: string[]): string {
    const lines = text.split('\n');
    for (const line of lines) {
      for (const keyword of keywords) {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
          // Try to extract content after colon
          const colonParts = line.split(':');
          if (colonParts.length > 1) {
            return colonParts[1].trim();
          }
          // Try to extract content between quotes
          const matches = line.match(/"([^"]*)"/);
          if (matches && matches.length > 1) {
            return matches[1];
          }
        }
      }
    }
    return '';
  }
  
  /**
   * Generate a character identity
   */
  private async generateCharacterIdentity(
    concept: string,
    series: BearSeriesDefinition,
    characterName?: string,
    promptElements?: CharacterPromptElements
  ): Promise<CharacterIdentity> {
    // If we have prompt elements, use them to influence character generation
    if (promptElements) {
      // If character name is provided, use that as the base for generation
      if (characterName) {
        // Generate with character name
        return this.characterGenerator.generateCharacter(`${characterName}, ${promptElements.profession}, ${concept}`);
      } else {
        // Generate based on prompt elements
        return this.characterGenerator.generateCharacter(
          `A distinguished bear who is a ${promptElements.profession}, ${promptElements.attributes.join(', ')}, wearing ${promptElements.clothing}, with ${promptElements.accessories.join(', ')}, ${concept}`
        );
      }
    }
    
    // Without prompt elements, use series information
    return this.characterGenerator.generateCharacter(
      `A distinguished bear from the ${series.name} (${series.emoji}), with traits: ${series.characterTraits.slice(0, 3).join(', ')}, ${concept}`
    );
  }
  
  /**
   * Create a descriptive character description
   */
  private createCharacterDescription(
    identity: CharacterIdentity, 
    series: BearSeriesDefinition,
    elements?: CharacterPromptElements
  ): string {
    // Combine character traits from identity and series
    const traits = identity.personality.slice(0, 2).join(' and ');
    
    // Get profession either from identity title or elements
    const profession = identity.title || 
      (elements?.profession ? elements.profession : series.name.replace(' Series', ' Professional'));
    
    // Generate description
    return `${traits} ${profession}`;
  }
  
  /**
   * Select visual elements for the prompt
   */
  private selectVisualElements(
    series: BearSeriesDefinition,
    elements?: CharacterPromptElements,
    preferredVisualElements?: string[]
  ): {
    accessories: string[];
    clothing: string;
    background: string;
    magritteElements: string[];
  } {
    // Select accessories - prioritize from prompt elements if available
    const accessories = elements?.accessories && elements.accessories.length > 0 
      ? elements.accessories
      : this.getRandomElements(series.accessories, 2);
      
    // Select clothing - use from prompt elements if available
    const clothing = elements?.clothing && elements.clothing.length > 0
      ? elements.clothing
      : "formal distinguished attire";
      
    // Select Magritte-specific visual elements - first from preferred, then from new styleElements, then original patterns
    const visualElementPool = [
      ...(preferredVisualElements || []),
      ...getStyleElements('visualElements', 3),
      ...series.magritteElements,
      ...magrittePatterns.visualElements
    ];
    
    const magritteElements = this.getRandomElements(visualElementPool, 2);
    
    // Select background options - use enhanced versions
    const backgroundOptions = [
      "Belgian sky blue background",
      "Belgian sky blue background with mathematically precise clouds",
      "Belgian sky blue with pristine clarity",
      "Belgian sky blue with twilight grey transitions",
      "perfectly flat Belgian sky blue",
      "immaculate Belgian sky blue background",
      "day-night paradox sky from Empire of Light",
      "pristine Belgian sky with perfect symmetry"
    ];
    
    return {
      accessories,
      clothing,
      background: this.getRandomElement(backgroundOptions),
      magritteElements
    };
  }
  
  /**
   * Select style parameters with enhanced emphasis on Magritte's key elements
   */
  private selectStyleParameters(
    emphasisPriorities?: {
      philosophical?: boolean;
      technical?: boolean;
      dreamlike?: boolean;
      traditional?: boolean;
      surreal?: boolean;
    },
    preferredColors?: string[]
  ): PromptStyleParameters {
    // Get base style parameters
    const baseParameters = {
      technique: this.getRandomElements(magrittePatterns.technicalAspects, 2),
      composition: this.getRandomElements(magrittePatterns.compositions, 2),
      lighting: [
        "uniform lighting without obvious source",
        "perfectly balanced light and shadow",
        "surrealist illumination with philosophical depth"
      ],
      colorPalette: preferredColors || this.getRandomElements(getStyleElements('colorPalette', 5), 3),
      surface: [
        "perfectly smooth painting surface",
        "matte finish with minimal brushwork",
        "precise yet painterly edges"
      ]
    };
    
    // Add enhanced emphasis elements
    return {
      ...baseParameters,
      philosophicalEmphasis: getRandomEmphasisElements('philosophicalDepth', 2),
      technicalEmphasis: getRandomEmphasisElements('pristineExecution', 2),
      dreamlikeEmphasis: getRandomEmphasisElements('dreamlikeClarity', 2),
      traditionalEmphasis: getRandomEmphasisElements('traditionalTechniques', 2),
      surrealEmphasis: getRandomEmphasisElements('surrealJuxtapositions', 2),
      combinedEmphasis: getRandomEmphasisElements('combinedEmphasis', 1)[0],
      // Add new style parameters from magritteStyleElements
      visualElements: getStyleElements('visualElements', 3),
      compositionGuidelines: getStyleElements('compositionGuidelines', 3),
      styleEmphasis: getStyleElements('styleEmphasis', 3),
      referencedWorks: getStyleElements('references', 2)
    };
  }
  
  /**
   * Fill in variables for the template
   */
  private fillTemplateVariables(
    template: MagritteTemplate,
    characterDescription: string,
    visualElements: {
      accessories: string[];
      clothing: string;
      background: string;
      magritteElements: string[];
    },
    styleParameters: PromptStyleParameters,
    promptElements?: CharacterPromptElements,
    additionalElements: string[] = []
  ): Record<string, string> {
    const variables: Record<string, string> = {};
    
    // Basic variables that all templates might use
    variables.character_description = characterDescription;
    variables.clothing = visualElements.clothing;
    variables.background = visualElements.background;
    
    // Accessories - ensure we have enough
    const allAccessories = [
      ...visualElements.accessories,
      ...this.getRandomElements(magrittePatterns.visualElements, 3),
      ...(promptElements?.accessories || []),
      ...additionalElements
    ];
    
    variables.accessory = allAccessories[0] || "distinctive professional implement";
    variables.accessory2 = allAccessories[1] || "signature tool of the profession";
    
    // Add specific variables for certain templates
    if (template.id === "treachery_of_images") {
      variables.text_subject = visualElements.accessories[0] || "bear";
    }
    
    if (template.id === "key_of_dreams") {
      const objects = ["pipe", "apple", "bowler hat", "umbrella", "key"];
      variables.mislabel = this.getRandomElement(objects);
    }
    
    // For templates that need a pose
    variables.pose = this.getRandomElement([
      "dignified posture",
      "philosophical stance",
      "contemplative position",
      "professional bearing",
      "distinguished demeanor"
    ]);
    
    // Add style parameters to enhance the template
    variables.technique = this.getRandomElement(styleParameters.styleEmphasis);
    variables.composition = this.getRandomElement(styleParameters.compositionGuidelines);
    
    // Add philosophical emphasis
    variables.philosophical_emphasis = this.getRandomElement(styleParameters.philosophicalEmphasis);
    
    // Add technical emphasis
    variables.technical_emphasis = this.getRandomElement(styleParameters.technicalEmphasis);
    
    // Add magritte visual elements
    variables.magritte_element = this.getRandomElement(styleParameters.visualElements);
    
    // Add referenced work
    variables.reference_work = this.getRandomElement(styleParameters.referencedWorks);
    
    return variables;
  }
  
  /**
   * Apply variables to template string
   */
  private applyTemplateWithVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    
    // Replace all variables in the template
    for (const [key, value] of Object.entries(variables)) {
      const pattern = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(pattern, value);
    }
    
    // Check for any remaining variables and provide defaults
    const remainingVars = result.match(/{{[^}]+}}/g);
    if (remainingVars) {
      for (const variable of remainingVars) {
        const varName = variable.replace(/[{}]/g, '');
        result = result.replace(variable, `unspecified ${varName}`);
      }
    }
    
    return result;
  }
  
  /**
   * Generate conceptual process description
   */
  private async generateConceptualProcess(
    promptBody: string,
    series: BearSeriesDefinition,
    template: MagritteTemplate,
    character: CharacterIdentity
  ): Promise<string> {
    try {
      const prompt = `
      As René Magritte, explain your creative process for this surrealist bear portrait:
      "${promptBody}"
      
      This bear belongs to the ${series.name} and is named ${character.name}.
      The composition is inspired by your work "${template.referenceArtwork}".
      
      Provide a brief conceptual explanation of:
      1. The philosophical meaning behind the image
      2. The surrealist techniques employed
      3. The paradoxes or contradictions present
      4. The relationship between the bear's profession and the surrealist elements
      5. How the painting achieves dreamlike clarity and metaphysical mystery
      6. The traditional painting techniques used to create the surreal effect
      
      Emphasize the pristine technical execution, philosophical depth, traditional painting methods, dreamlike clarity, and surreal juxtapositions that characterize your work.
      
      Keep the response concise and insightful, under 250 words.
      `;

      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are René Magritte explaining your artistic process and philosophical thinking.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        maxTokens: 350
      });

      return response.content.trim();
    } catch (error) {
      console.error('Error generating conceptual process:', error);
      return `A philosophical exploration of ${series.name.toLowerCase()} through the surrealist lens of René Magritte. The portrait challenges our perception of reality through visual paradox and meticulous execution.`;
    }
  }
  
  /**
   * Generate negative prompt with enhanced anti-patterns
   */
  private generateNegativePrompt(series: BearSeriesDefinition): string {
    // Base negative prompts from config
    const baseNegativePrompts = defaultGenerationConfig.styles.magritte.negativePrompt || [];
    
    // Series-specific elements to avoid
    const seriesSpecificNegatives = [
      "cartoon bear", "cute bear", "teddy bear", "realistic bear", "wild animal",
      "full body shot", "non-magritte style", "impressionistic", "cubist", "action pose",
      "casual clothing", "modern accessories", "informal setting", "smiling bear", "growling bear"
    ];
    
    // Enhanced anti-Magritte style elements from the new style elements
    const enhancedAntiMagritteElements = generateMagritteNegativePrompt().split(', ');
    
    // Combine all negative elements
    return [...baseNegativePrompts, ...seriesSpecificNegatives, ...enhancedAntiMagritteElements].join(', ');
  }
  
  /**
   * Helper function to get random elements from an array
   */
  private getRandomElements<T>(array: T[], count: number): T[] {
    if (!array || array.length === 0) return [];
    if (array.length <= count) return [...array];
    
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  
  /**
   * Helper function to get a random element from an array
   */
  private getRandomElement<T>(array: T[]): T {
    if (!array || array.length === 0) throw new Error('Cannot select from empty array');
    return array[Math.floor(Math.random() * array.length)];
  }
} 