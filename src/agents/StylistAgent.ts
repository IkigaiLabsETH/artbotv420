/**
 * Stylist Agent
 * Responsible for applying artistic styles to prompts
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, StylistAgent as IStylistAgent, MessageDirection } from './types';
import { AgentLogger } from '../utils/agentLogger';
import { AIService } from '../services/ai/index';
import { StyleConfig, defaultGenerationConfig } from '../config/generationConfig';
import { MagritteStyleEvaluator } from '../services/style/MagritteStyleEvaluator';
import { enhanceBearPortraitPrompt } from '../services/style/magrittePromptEnhancer';

/**
 * Stylist Agent implementation
 */
export class StylistAgent implements IStylistAgent {
  id: string;
  role: AgentRole.STYLIST;
  status: AgentStatus;
  
  private aiService: AIService;
  private messages: AgentMessage[];
  private styles: Record<string, StyleConfig>;
  private magritteEvaluator: MagritteStyleEvaluator;
  private styleLibrary: any;
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.role = AgentRole.STYLIST;
    this.status = AgentStatus.IDLE;
    this.aiService = aiService;
    this.messages = [];
    this.styles = defaultGenerationConfig.styles;
    this.magritteEvaluator = new MagritteStyleEvaluator();
    this.initializeStyleLibrary();
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Stylist agent created with Magritte style capabilities');
  }
  
  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    AgentLogger.logAgentAction(this, 'Initialize', 'Stylist agent initialized');
  }

  /**
   * Initialize the enhanced style library with Magritte elements
   */
  private initializeStyleLibrary(): void {
    this.styleLibrary = {
      magritte: {
        core: {
          essence: 'Traditional oil painting techniques in Belgian surrealism',
          era: 'Classic Magritte surrealism (1926-1967)',
          influences: [
            'traditional oil painting',
            'Magritte\'s precise technique',
            'Belgian surrealism',
            'classical painting methods',
            'philosophical paradox'
          ]
        },
        visual: {
          composition: {
            primary: [
              'perfectly balanced surreal elements',
              'mathematically precise staging',
              'impossible object arrangements',
              'golden ratio compositions',
              'classical painting structure'
            ],
            secondary: [
              'precise object placement',
              'spatial paradoxes',
              'window illusions',
              'traditional depth techniques',
              'painterly perspective'
            ],
            framing: [
              'museum-quality oil painting',
              'traditional canvas proportions',
              'classical composition rules',
              'formal painting arrangement',
              'contemplative spacing'
            ]
          },
          lighting: {
            quality: [
              'day and night simultaneity',
              'mysterious atmospheric glow',
              'perfect shadow rendering',
              'subtle luminosity',
              'metaphysical light'
            ],
            technique: [
              'smooth shadow transitions',
              'perfect light modeling',
              'crystalline reflections',
              'traditional glazing effects',
              'unified illumination'
            ],
            effects: [
              'impossible lighting scenarios',
              'paradoxical shadows',
              'surreal atmospheric depth',
              'perfect highlight control',
              'subtle ambient occlusion'
            ]
          },
          color: {
            palettes: [
              ['cerulean sky blue', 'deep shadow grey', 'muted earth tones'],
              ['twilight purple', 'pristine cloud white', 'stone grey'],
              ['deep night blue', 'pale morning light', 'rich brown']
            ],
            characteristics: [
              'unmodulated color fields',
              'perfect transitions',
              'traditional matte surface',
              'classical color harmony',
              'subtle tonal variations'
            ],
            treatments: [
              'pure oil paint application',
              'perfect paint layering',
              'classical varnish finish',
              'pristine surface quality',
              'flawless color blending'
            ]
          }
        },
        elements: {
          symbols: [
            'floating bowler hats',
            'green apples',
            'billowing curtains',
            'mysterious birds',
            'paradoxical windows',
            'philosophical pipes',
            'floating stones',
            'enigmatic mirrors',
            'surreal doors',
            'metaphysical frames'
          ],
          settings: [
            'impossible landscapes',
            'surreal interiors',
            'metaphysical spaces',
            'paradoxical rooms',
            'mysterious horizons',
            'philosophical voids',
            'dreamlike environments',
            'contemplative settings',
            'infinite skies',
            'impossible architecture'
          ],
          objects: [
            'levitating objects',
            'transformed everyday items',
            'paradoxical elements',
            'mysterious artifacts',
            'philosophical props',
            'surreal furnishings',
            'impossible combinations',
            'metaphysical tools',
            'enigmatic instruments',
            'dreamlike accessories'
          ]
        },
        techniques: {
          painting: [
            'flawless oil application',
            'perfect edge control',
            'subtle surface texture',
            'unified light treatment',
            'crystalline detail rendering',
            'classical shadow modeling',
            'smooth color transitions',
            'traditional matte finish',
            'pristine canvas quality',
            'perfect paint layering'
          ],
          surrealism: [
            'impossible scale relationships',
            'perfect object displacement',
            'classical reality questioning',
            'traditional metaphysical approach',
            'pristine paradox rendering',
            'mysterious juxtapositions',
            'philosophical transformations',
            'dreamlike combinations',
            'surreal metamorphoses',
            'enigmatic arrangements'
          ],
          conceptual: [
            'philosophical questioning',
            'metaphysical poetry',
            'surreal narratives',
            'perfect paradox execution',
            'pristine concept realization',
            'mysterious symbolism',
            'contemplative depth',
            'dreamlike logic',
            'enigmatic meanings',
            'philosophical resonance'
          ]
        }
      }
    };
  }

  /**
   * Apply a style to a prompt
   */
  async applyStyle(prompt: string, style: string): Promise<string> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Apply Style', `Applying style "${style}" to prompt`);
    
    try {
      // Get the style configuration
      const styleConfig = this.styles[style] || this.styles[defaultGenerationConfig.defaultStyle];
      
      if (!styleConfig) {
        throw new Error(`Style "${style}" not found and no default style available`);
      }
      
      // Check if this is Magritte style and apply special handling
      if (style === 'magritte' || style === 'bear_pfp' || styleConfig.name.toLowerCase().includes('magritte')) {
        AgentLogger.logAgentAction(this, 'Magritte Style', 'Using specialized Magritte style evaluator');
        
        // First apply standard style prefix/suffix
        let styledPrompt = prompt;
        
        if (styleConfig.promptPrefix) {
          styledPrompt = `${styleConfig.promptPrefix}${styledPrompt}`;
        }
        
        if (styleConfig.promptSuffix) {
          styledPrompt = `${styledPrompt}${styleConfig.promptSuffix}`;
        }
        
        // Special handling for bear PFP portraits
        if (style === 'bear_pfp' || prompt.toLowerCase().includes('bear')) {
          AgentLogger.logAgentAction(this, 'Bear PFP Enhancement', 'Applying specialized bear portrait enhancement');
          styledPrompt = enhanceBearPortraitPrompt(styledPrompt);
        } else {
          // For other Magritte styles, use the general enhancer
          styledPrompt = this.enhanceMagrittePrompt(styledPrompt);
        }
        
        this.status = AgentStatus.SUCCESS;
        AgentLogger.logAgentAction(this, 'Magritte Style Applied', 
          `Applied Magritte style: ${styledPrompt.substring(0, 100)}...`);
        
        return styledPrompt;
      }
      
      // For non-Magritte styles, use the standard approach
      // Use the style's prefix and suffix if available
      let styledPrompt = prompt;
      
      if (styleConfig.promptPrefix) {
        styledPrompt = `${styleConfig.promptPrefix}${styledPrompt}`;
      }
      
      if (styleConfig.promptSuffix) {
        styledPrompt = `${styledPrompt}${styleConfig.promptSuffix}`;
      }
      
      // For more sophisticated styling, use the AI service
      if (styleConfig.styleEmphasis && styleConfig.styleEmphasis.length > 0) {
        const aiPrompt = `
        Modify this image generation prompt to emphasize the style of ${styleConfig.name}:
        "${prompt}"
        
        Incorporate these style elements:
        ${styleConfig.styleEmphasis.slice(0, 5).map(element => `- ${element}`).join('\n')}
        
        ${styleConfig.colorPalette && styleConfig.colorPalette.length > 0 ? 
          `Use this color palette:\n${styleConfig.colorPalette.slice(0, 5).map(color => `- ${color}`).join('\n')}` : ''}
        
        ${styleConfig.compositionGuidelines && styleConfig.compositionGuidelines.length > 0 ? 
          `Follow these composition guidelines:\n${styleConfig.compositionGuidelines.slice(0, 3).map(guideline => `- ${guideline}`).join('\n')}` : ''}
        
        Return ONLY the modified prompt, without explanation or meta-commentary.
        `;
        
        const response = await this.aiService.getCompletion({
          messages: [
            { role: 'system', content: `You are an art director specialized in the ${styleConfig.name} style. Your task is to modify prompts to emphasize this distinctive style.` },
            { role: 'user', content: aiPrompt }
          ],
          temperature: 0.4
        });
        
        styledPrompt = response.content.trim();
      }
      
      this.status = AgentStatus.SUCCESS;
      AgentLogger.logAgentAction(this, 'Style Applied', `Applied style "${style}": ${styledPrompt.substring(0, 100)}...`);
      
      return styledPrompt;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Error', `Error applying style: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return the original prompt as fallback
      return prompt;
    }
  }

  /**
   * Enhanced Magritte prompt method with style library elements
   */
  private enhanceMagrittePrompt(prompt: string): string {
    // First use the evaluator
    const evaluation = this.magritteEvaluator.evaluatePrompt(prompt);
    
    // If score is already high, make minor enhancements
    if (evaluation.score > 0.8) {
      return this.addMagritteRefinements(prompt);
    }
    
    // Add specific Magritte style elements from style library
    let enhancedPrompt = prompt;
    
    // Add composition elements
    const compositionElements = this.selectStyleElements(
      this.styleLibrary.magritte.visual.composition.primary, 1
    );
    if (compositionElements.length > 0) {
      enhancedPrompt += `, with ${compositionElements.join(' and ')}`;
    }
    
    // Add lighting elements
    const lightingElements = this.selectStyleElements(
      this.styleLibrary.magritte.visual.lighting.quality, 1
    );
    if (lightingElements.length > 0) {
      enhancedPrompt += `, featuring ${lightingElements.join(' and ')}`;
    }
    
    // Add color elements
    const colorPalette = this.selectRandomPalette(
      this.styleLibrary.magritte.visual.color.palettes
    );
    if (colorPalette.length > 0) {
      enhancedPrompt += `, in a palette of ${colorPalette.join(', ')}`;
    }
    
    // Add symbolic elements
    const symbols = this.selectStyleElements(
      this.styleLibrary.magritte.elements.symbols, 1
    );
    if (symbols.length > 0) {
      enhancedPrompt += `, with ${symbols.join(' and ')}`;
    }
    
    // Add technical aspects
    const techniques = this.selectStyleElements(
      this.styleLibrary.magritte.techniques.painting, 2
    );
    if (techniques.length > 0) {
      enhancedPrompt += `, rendered with ${techniques.join(' and ')}`;
    }
    
    // Add conceptual depth
    const concepts = this.selectStyleElements(
      this.styleLibrary.magritte.techniques.conceptual, 1
    );
    if (concepts.length > 0) {
      enhancedPrompt += `, expressing ${concepts.join(' and ')}`;
    }
    
    return enhancedPrompt;
  }
  
  /**
   * Add Magritte refinements to an already good prompt
   */
  private addMagritteRefinements(prompt: string): string {
    // Signature Magritte elements to potentially add
    const magritteElements = [
      ", with trademark Magritte precision and photorealistic rendering",
      ", featuring clean edges and perfect surfaces in the style of René Magritte",
      ", with the philosophical depth and conceptual clarity of Magritte's best works",
      ", painted with Magritte's characteristic atmospheric lighting and theatrical composition"
    ];
    
    // Add 1-2 refinements
    const numToAdd = 1 + Math.floor(Math.random() * 2);
    const selectedElements = new Set<string>();
    
    while (selectedElements.size < numToAdd) {
      const element = magritteElements[Math.floor(Math.random() * magritteElements.length)];
      selectedElements.add(element);
    }
    
    return prompt + Array.from(selectedElements).join("");
  }

  /**
   * Select random style elements from an array
   */
  private selectStyleElements(elements: string[], count: number): string[] {
    const numToSelect = Math.min(elements.length, count);
    const shuffled = [...elements].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numToSelect);
  }

  /**
   * Select a random color palette
   */
  private selectRandomPalette(palettes: string[][]): string[] {
    return palettes[Math.floor(Math.random() * palettes.length)];
  }
  
  /**
   * Suggest style enhancements for a prompt
   */
  async suggestStyleEnhancements(prompt: string, style: string): Promise<Record<string, any>> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Suggest Enhancements', `Suggesting style enhancements for "${style}" style`);
    
    try {
      // Special handling for Magritte style
      if (style === 'magritte' || style === 'bear_pfp' || style.toLowerCase().includes('magritte')) {
        AgentLogger.logAgentAction(this, 'Magritte Style', 'Using specialized Magritte style evaluator for suggestions');
        
        // Evaluate the prompt using the Magritte evaluator
        const evaluation = this.magritteEvaluator.evaluatePrompt(prompt);
        
        // Generate structure for the enhancement suggestions
        const enhancements = {
          visualElements: this.generateMagritteVisualElementSuggestions(evaluation),
          composition: this.generateMagritteCompositionSuggestions(evaluation),
          colorPalette: this.generateMagritteColorSuggestions(evaluation),
          lighting: this.generateMagritteLightingSuggestions(evaluation),
          technicalDetails: this.generateMagritteTechnicalSuggestions(evaluation),
          philosophicalConcepts: this.generateMagritteConceptSuggestions(evaluation)
        };
        
        this.status = AgentStatus.SUCCESS;
        AgentLogger.logAgentAction(this, 'Enhancements Suggested', `Suggested Magritte style enhancements`);
        
        return enhancements;
      }
      
      // Get the style configuration
      const styleConfig = this.styles[style] || this.styles[defaultGenerationConfig.defaultStyle];
      
      if (!styleConfig) {
        throw new Error(`Style "${style}" not found and no default style available`);
      }
      
      const aiPrompt = `
      Analyze this image generation prompt and suggest specific enhancements to better fit the ${styleConfig.name} style:
      "${prompt}"
      
      Provide suggestions for:
      1. Visual elements to add or emphasize
      2. Composition adjustments
      3. Color palette recommendations
      4. Lighting and mood adjustments
      5. Technical execution details
      
      Return your suggestions as a JSON object with these keys: visualElements, composition, colorPalette, lighting, technicalDetails.
      Each key should have an array of 3-5 specific suggestions as strings.
      `;
      
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: `You are an art director specialized in the ${styleConfig.name} style, providing structured guidance on style enhancement.` },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.5
      });
      
      // Parse the response as JSON
      const enhancements = JSON.parse(response.content.trim());
      
      this.status = AgentStatus.SUCCESS;
      AgentLogger.logAgentAction(this, 'Enhancements Suggested', `Suggested ${Object.keys(enhancements).length} enhancement categories`);
      
      return enhancements;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Error', `Error suggesting enhancements: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return basic fallback enhancements
      return {
        visualElements: ['Add symmetry', 'Include surreal elements', 'Incorporate paradoxical perspectives'],
        composition: ['Center the main subject', 'Use classical composition', 'Create visual balance'],
        colorPalette: ['Use muted colors', 'Include Belgian sky blue', 'Create subtle gradients'],
        lighting: ['Employ even, diffused lighting', 'Avoid harsh shadows', 'Use naturalistic illumination'],
        technicalDetails: ['Create smooth, unmodulated color fields', 'Maintain sharp edges', 'Use photorealistic rendering']
      };
    }
  }
  
  /**
   * Generate visual element suggestions for Magritte style
   */
  private generateMagritteVisualElementSuggestions(evaluation: { score: number; feedback: string[] }): string[] {
    return this.selectStyleElements(this.styleLibrary.magritte.elements.symbols, 3);
  }
  
  /**
   * Generate composition suggestions for Magritte style
   */
  private generateMagritteCompositionSuggestions(evaluation: { score: number; feedback: string[] }): string[] {
    return [
      ...this.selectStyleElements(this.styleLibrary.magritte.visual.composition.primary, 2),
      ...this.selectStyleElements(this.styleLibrary.magritte.visual.composition.secondary, 1)
    ];
  }
  
  /**
   * Generate color suggestions for Magritte style
   */
  private generateMagritteColorSuggestions(evaluation: { score: number; feedback: string[] }): string[] {
    const palette = this.selectRandomPalette(this.styleLibrary.magritte.visual.color.palettes);
    return [
      ...palette,
      ...this.selectStyleElements(this.styleLibrary.magritte.visual.color.characteristics, 2)
    ];
  }
  
  /**
   * Generate lighting suggestions for Magritte style
   */
  private generateMagritteLightingSuggestions(evaluation: { score: number; feedback: string[] }): string[] {
    return [
      ...this.selectStyleElements(this.styleLibrary.magritte.visual.lighting.quality, 2),
      ...this.selectStyleElements(this.styleLibrary.magritte.visual.lighting.technique, 1)
    ];
  }
  
  /**
   * Generate technical suggestions for Magritte style
   */
  private generateMagritteTechnicalSuggestions(evaluation: { score: number; feedback: string[] }): string[] {
    return this.selectStyleElements(this.styleLibrary.magritte.techniques.painting, 3);
  }
  
  /**
   * Generate conceptual suggestions for Magritte style
   */
  private generateMagritteConceptSuggestions(evaluation: { score: number; feedback: string[] }): string[] {
    return this.selectStyleElements(this.styleLibrary.magritte.techniques.conceptual, 3);
  }
  
  /**
   * Process a request
   */
  async process(context: AgentContext): Promise<AgentResult> {
    this.status = AgentStatus.BUSY;
    
    try {
      AgentLogger.logAgentAction(this, 'Process', 'Processing styling request');
      
      // Check what task we need to perform
      const task = context.task?.action || 'apply_style';
      const style = context.style || context.task?.style || defaultGenerationConfig.defaultStyle;
      
      let result;
      switch (task) {
        case 'apply_style':
          // Apply a style to the prompt
          const styledPrompt = await this.applyStyle(context.prompt || context.concept || '', style);
          
          result = {
            prompt: styledPrompt,
            style
          };
          break;
          
        case 'suggest_enhancements':
          // Suggest style enhancements
          const enhancements = await this.suggestStyleEnhancements(context.prompt || context.concept || '', style);
          
          result = {
            styleEnhancements: enhancements,
            style
          };
          break;
          
        default:
          throw new Error(`Unknown task: ${task}`);
      }
      
      // Update the context with the result
      const updatedContext = {
        ...context,
        ...result
      };
      
      this.status = AgentStatus.SUCCESS;
      
      // Create result message
      const resultMessage: AgentMessage = {
        id: uuidv4(),
        timestamp: new Date(),
        from: this.role,
        to: AgentRole.DIRECTOR,
        direction: MessageDirection.OUTGOING,
        type: 'result',
        content: result
      };
      
      // Add to messages
      this.messages.push(resultMessage);
      
      // Return the result
      return {
        success: true,
        output: updatedContext,
        messages: [resultMessage]
      };
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Error', `Error processing request: ${error instanceof Error ? error.message : String(error)}`);
      
      // Create error message
      const errorMessage: AgentMessage = {
        id: uuidv4(),
        timestamp: new Date(),
        from: this.role,
        to: AgentRole.DIRECTOR,
        direction: MessageDirection.OUTGOING,
        type: 'error',
        content: {
          error: error instanceof Error ? error.message : String(error)
        }
      };
      
      // Add to messages
      this.messages.push(errorMessage);
      
      // Return error result
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        messages: [errorMessage]
      };
    }
  }

  /**
   * Handle a message
   */
  async handleMessage(message: AgentMessage): Promise<void> {
    AgentLogger.logAgentMessage(message);
    
    // Add to message history
    this.messages.push(message);
  }
} 