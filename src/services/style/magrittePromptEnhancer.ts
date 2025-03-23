/**
 * Magritte Prompt Enhancer
 * Provides advanced functionality for generating Magritte-style prompts
 */

import { v4 as uuidv4 } from 'uuid';
import { magritteStyleElements } from './magritteStyleElements';
import { MAGRITTE_TEMPLATES } from './magrittePromptTemplates';
import { AgentLogger } from '../../utils/agentLogger';

/**
 * Magritte template type definition
 */
export interface MagritteTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  weight: number;
  referenceArtwork: string;
  suitableForSeries: string[];
  contextualVariables: string[];
}

/**
 * Interface for enhanced prompt output
 */
export interface EnhancedPromptResult {
  prompt: string;
  template: {
    id: string;
    name: string;
    referenceArtwork: string;
  };
  visualElements: string[];
  styleEmphasis: string[];
  templateWeight: number;
  paradox?: string;
  negativePrompt?: string[];
}

/**
 * MagrittePromptEnhancer
 * Enhances Magritte-style prompts with dynamic adaptation
 */
export class MagrittePromptEnhancer {
  private id: string;

  constructor() {
    this.id = uuidv4().substring(0, 8);
    AgentLogger.log(`MagrittePromptEnhancer (${this.id}) initialized`);
  }

  /**
   * Generate an enhanced Magritte-style prompt
   */
  async enhancePrompt(
    basePrompt: string,
    series?: string,
    artDirection?: any
  ): Promise<EnhancedPromptResult> {
    AgentLogger.log(`Enhancing Magritte prompt: ${basePrompt.substring(0, 50)}...`);
    
    // Extract key elements from the base prompt
    const elements = this.extractElementsFromPrompt(basePrompt);
    
    // Select an appropriate template based on series and elements
    const selectedTemplate = this.selectTemplate(series, elements);
    
    // Fill in the template with specific elements
    const filledTemplate = this.fillTemplate(selectedTemplate, elements, artDirection);
    
    // Determine the most appropriate visual elements to enhance
    const visualElements = this.selectVisualElements(elements, selectedTemplate.id);
    
    // Choose style emphasis elements based on the template
    const styleEmphasis = this.selectStyleEmphasis(selectedTemplate.id);
    
    // Create a paradox fitting the template
    const paradox = this.createParadox(selectedTemplate.id, elements);
    
    // Construct the final enhanced prompt
    const enhancedPrompt = this.constructFinalPrompt(
      filledTemplate, 
      visualElements, 
      styleEmphasis,
      paradox
    );
    
    // Generate appropriate negative prompt
    const negativePrompt = this.generateNegativePrompt(selectedTemplate.id, elements);
    
    return {
      prompt: enhancedPrompt,
      template: {
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        referenceArtwork: selectedTemplate.referenceArtwork
      },
      visualElements,
      styleEmphasis,
      templateWeight: selectedTemplate.weight,
      paradox,
      negativePrompt
    };
  }

  /**
   * Extract key elements from the base prompt
   */
  private extractElementsFromPrompt(prompt: string): Record<string, string> {
    const elements: Record<string, string> = {
      character_description: 'distinguished',
      clothing: 'formal attire',
      accessory: 'bowler hat',
      background: 'plain surrealist background',
      pose: 'dignified pose'
    };
    
    // Extract character description
    const characterMatch = prompt.match(/distinguished|dignified|elegant|formal|philosophical|contemplative/i);
    if (characterMatch) {
      elements.character_description = characterMatch[0].toLowerCase();
    }
    
    // Extract clothing
    const clothingMatch = prompt.match(/wearing ([^,.]+)/i);
    if (clothingMatch && clothingMatch[1]) {
      elements.clothing = clothingMatch[1].trim();
    }
    
    // Extract accessory
    const accessoryMatches = [
      /with ([^,.]+)/i,
      /holding ([^,.]+)/i,
      /carries ([^,.]+)/i
    ];
    
    for (const pattern of accessoryMatches) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        elements.accessory = match[1].trim();
        break;
      }
    }
    
    // Extract background
    const backgroundMatch = prompt.match(/(?:against|with|in|on) ([^,.]+) background/i);
    if (backgroundMatch && backgroundMatch[1]) {
      elements.background = backgroundMatch[1].trim() + ' background';
    }
    
    return elements;
  }

  /**
   * Select the most appropriate template
   */
  private selectTemplate(series?: string, elements?: Record<string, string>) {
    // Filter templates by series if provided
    let eligibleTemplates = [...MAGRITTE_TEMPLATES];
    
    if (series) {
      eligibleTemplates = eligibleTemplates.filter(template => 
        template.suitableForSeries && template.suitableForSeries.includes(series)
      );
      
      // If no templates match the series, fall back to all templates
      if (eligibleTemplates.length === 0) {
        eligibleTemplates = [...MAGRITTE_TEMPLATES];
      }
    }
    
    // Calculate template scores based on element matches
    const scoredTemplates = eligibleTemplates.map(template => {
      let score = template.weight * 10; // Base score from template weight
      
      // Boost score if elements match template variables
      if (elements) {
        template.contextualVariables.forEach(variable => {
          if (elements[variable]) {
            score += 2;
          }
        });
      }
      
      return {
        template,
        score
      };
    });
    
    // Sort by score and select the highest
    scoredTemplates.sort((a, b) => b.score - a.score);
    
    // Add some randomness - 30% chance to pick the second best template if available
    if (scoredTemplates.length > 1 && Math.random() < 0.3) {
      return scoredTemplates[1].template;
    }
    
    return scoredTemplates[0].template;
  }

  /**
   * Fill the template with specific elements
   */
  private fillTemplate(
    template: typeof MAGRITTE_TEMPLATES[0], 
    elements: Record<string, string>,
    artDirection?: any
  ): string {
    let filledTemplate = template.template;
    
    // Replace each contextual variable with its value
    template.contextualVariables.forEach(variable => {
      // Use art direction override if available
      const override = artDirection?.[variable];
      const value = override || elements[variable] || this.getDefaultForVariable(variable, template.id);
      
      // Replace all instances of the variable
      const variablePattern = new RegExp(`{{${variable}}}`, 'g');
      filledTemplate = filledTemplate.replace(variablePattern, value);
    });
    
    // Add additional art direction elements if they exist and aren't already used
    if (artDirection?.additionalElements) {
      filledTemplate += ` ${artDirection.additionalElements}`;
    }
    
    return filledTemplate;
  }

  /**
   * Get default value for a template variable
   */
  private getDefaultForVariable(variable: string, templateId: string): string {
    const defaults: Record<string, Record<string, string>> = {
      "son_of_man": {
        "accessory": "a green apple",
        "character_description": "philosophical bear",
        "clothing": "a formal suit with a red tie",
        "background": "blue sky with fluffy white clouds"
      },
      "empire_of_light": {
        "character_description": "contemplative bear",
        "clothing": "a formal dark suit",
        "accessory": "a vintage lamp"
      },
      "personal_values": {
        "character_description": "intellectual bear",
        "accessory": "a giant comb",
        "clothing": "a formal suit",
        "accessory2": "an oversized wine glass"
      },
      "default": {
        "accessory": "a bowler hat",
        "character_description": "distinguished bear",
        "clothing": "formal attire with a white collar",
        "background": "Magritte's characteristic blue sky",
        "pose": "dignified stance",
        "accessory2": "a pipe",
        "text_subject": "bear",
        "mislabel": "forest"
      }
    };
    
    // Return template-specific default if available
    if (defaults[templateId]?.[variable]) {
      return defaults[templateId][variable];
    }
    
    // Return general default
    return defaults.default[variable] || "distinguished element";
  }

  /**
   * Select the most appropriate visual elements
   */
  private selectVisualElements(elements: Record<string, string>, templateId: string): string[] {
    // Base elements always included
    const visualElements = ["distinguished bear"];
    
    // Add clothing if present
    if (elements.clothing && !visualElements.includes(elements.clothing)) {
      visualElements.push(elements.clothing);
    }
    
    // Add accessory if present
    if (elements.accessory && !visualElements.includes(elements.accessory)) {
      visualElements.push(elements.accessory);
    }
    
    // Add template-specific elements
    const templateSpecificElements: Record<string, string[]> = {
      "son_of_man": ["floating object", "philosophical depth"],
      "empire_of_light": ["paradoxical sky", "day and night simultaneously"],
      "personal_values": ["surreal scale", "oversized objects"],
      "time_transfixed": ["object emerging from unexpected place"],
      "treachery_of_images": ["philosophical text", "elegant script"],
      "golconda": ["multiple floating figures", "identical repetition"],
      "false_mirror": ["reflective eye", "sky within eye"]
    };
    
    // Add 1-2 template specific elements
    const specificElements = templateSpecificElements[templateId] || [];
    for (let i = 0; i < Math.min(2, specificElements.length); i++) {
      visualElements.push(specificElements[i]);
    }
    
    // Add 1-2 random Magritte elements if we have fewer than 5 elements
    const magritteElements = [...magritteStyleElements.visualElements];
    while (visualElements.length < 5 && magritteElements.length > 0) {
      // Get random element
      const randomIndex = Math.floor(Math.random() * magritteElements.length);
      const element = magritteElements.splice(randomIndex, 1)[0];
      
      // Add if not already included
      if (!visualElements.some(existing => element.includes(existing) || existing.includes(element))) {
        visualElements.push(element);
      }
    }
    
    return visualElements;
  }

  /**
   * Select style emphasis elements based on template
   */
  private selectStyleEmphasis(templateId: string): string[] {
    // Base styles always included
    const styles = [
      "precise Magritte-style oil painting",
      "perfect unmodulated paint surfaces",
      "crystal-clear execution"
    ];
    
    // Template-specific style emphasis
    const templateStyles: Record<string, string[]> = {
      "son_of_man": ["philosophical depth", "perfect matte finish"],
      "empire_of_light": ["mysterious atmospheric quality", "paradoxical lighting"],
      "personal_values": ["surreal scale relationships", "perfect household objects"],
      "treachery_of_images": ["conceptual depth", "philosophical representation"],
      "golconda": ["repetition with variation", "atmospheric perspective"],
      "false_mirror": ["poetic visual metaphor", "meaningful reflection"]
    };
    
    // Add template-specific styles
    const specificStyles = templateStyles[templateId] || [];
    for (let i = 0; i < Math.min(2, specificStyles.length); i++) {
      styles.push(specificStyles[i]);
    }
    
    // Add 1-2 random style emphasis elements
    const allStyleEmphasis = [...magritteStyleElements.styleEmphasis];
    while (styles.length < 6 && allStyleEmphasis.length > 0) {
      // Get random element
      const randomIndex = Math.floor(Math.random() * allStyleEmphasis.length);
      const element = allStyleEmphasis.splice(randomIndex, 1)[0];
      
      // Add if not already included
      if (!styles.some(existing => element.includes(existing) || existing.includes(element))) {
        styles.push(element);
      }
    }
    
    return styles;
  }

  /**
   * Create a paradox fitting the template
   */
  private createParadox(templateId: string, elements: Record<string, string>): string {
    const paradoxes: Record<string, string[]> = {
      "son_of_man": [
        "The bear's face is partially obscured by a floating {{accessory}} that hovers impossibly in mid-air",
        "A {{accessory}} floats mysteriously in front of the bear's face, creating an enigmatic obstruction"
      ],
      "empire_of_light": [
        "The sky above shows daylight while the ground below is illuminated as night",
        "Paradoxical lighting with daylight sky above contrasting with nighttime below"
      ],
      "personal_values": [
        "Objects appear at impossible scale, with {{accessory}} dominating the room at an absurd size",
        "The {{accessory}} appears impossibly large, challenging our perception of scale and reality"
      ],
      "time_transfixed": [
        "A {{accessory}} emerges from an unexpected place, defying physical laws",
        "Reality is disrupted as {{accessory}} appears from a location that defies logic"
      ],
      "not_to_be_reproduced": [
        "The bear looks at a mirror, but the reflection shows the back of the head again instead of the face",
        "A mirror reveals the impossible - showing the same view of the bear's back instead of a reflection"
      ],
      "treachery_of_images": [
        "Below the bear appears text stating 'This is not a {{text_subject}}' in elegant script",
        "The image challenges representation with text stating 'This is not a {{text_subject}}'"
      ],
      "default": [
        "Elements of the scene challenge reality in the distinctive Magritte surrealist tradition",
        "The familiar becomes unfamiliar through surreal juxtaposition in classic Magritte style",
        "The composition creates philosophical tension between reality and representation"
      ]
    };
    
    // Get paradoxes for this template or use defaults
    const templateParadoxes = paradoxes[templateId] || paradoxes.default;
    
    // Select a random paradox
    let paradox = templateParadoxes[Math.floor(Math.random() * templateParadoxes.length)];
    
    // Replace variables in the paradox
    Object.entries(elements).forEach(([key, value]) => {
      const pattern = new RegExp(`{{${key}}}`, 'g');
      paradox = paradox.replace(pattern, value);
    });
    
    return paradox;
  }

  /**
   * Construct the final enhanced prompt
   */
  private constructFinalPrompt(
    filledTemplate: string,
    visualElements: string[],
    styleEmphasis: string[],
    paradox?: string
  ): string {
    // Add paradox if not already present in the template
    let enhancedPrompt = filledTemplate;
    if (paradox && !filledTemplate.includes(paradox)) {
      enhancedPrompt += `. ${paradox}`;
    }
    
    // Create style section
    const styleSection = `\n\nRender with René Magritte's distinctive artistic elements:
- ${styleEmphasis.slice(0, 3).join('\n- ')}
- Traditional oil painting technique with flat, unmodulated surfaces
- Philosophical depth through visual paradox
- Perfect composition with balanced elements`;
    
    // Add style section
    enhancedPrompt += styleSection;
    
    // Ensure bear portrait specific details are included
    enhancedPrompt += `\n\nThis should be a distinguished bear portrait suitable for profile picture use, perfectly centered and rendered with flawless Magritte technique.`;
    
    return enhancedPrompt;
  }

  /**
   * Generate appropriate negative prompt
   */
  private generateNegativePrompt(templateId: string, elements: Record<string, string>): string[] {
    // Base negative prompt elements
    const negative = [
      "photorealistic", "hyperrealistic", "camera photo", "photograph", "DSLR", 
      "3D rendering", "CGI", "digital art", "cartoon", "illustration",
      "rough texture", "heavy impasto", "visible brushstrokes", "expressionistic",
      "full body shot", "landscape format", "busy backgrounds", "natural wilderness",
      "casual style", "modern clothing", "cute", "childish", "anime", "cartoon bear"
    ];
    
    // Template-specific negative elements
    const templateNegatives: Record<string, string[]> = {
      "son_of_man": ["face fully visible", "empty sky", "realistic apple", "realistic fruit"],
      "empire_of_light": ["consistent lighting", "realistic sky", "astronomical accuracy", "logical lighting"],
      "personal_values": ["realistic scale", "proportional objects", "logical sizes", "realistic room"],
      "golconda": ["varied figures", "random arrangement", "different clothing", "individual characteristics"],
      "false_mirror": ["anatomically correct eye", "realistic eye", "medical illustration", "ophthalmology"]
    };
    
    // Add template-specific negatives
    const specificNegatives = templateNegatives[templateId] || [];
    for (const item of specificNegatives) {
      if (!negative.includes(item)) {
        negative.push(item);
      }
    }
    
    // Add negative aspects that contradict the visual elements
    if (elements.accessory) {
      negative.push(`without ${elements.accessory}`, `missing ${elements.accessory}`);
    }
    
    if (elements.clothing) {
      negative.push(`without ${elements.clothing}`, `missing attire`);
    }
    
    return negative;
  }
} 