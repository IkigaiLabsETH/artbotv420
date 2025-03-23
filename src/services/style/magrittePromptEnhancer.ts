/**
 * Magritte Prompt Enhancer
 * Provides advanced functionality for generating Magritte-style prompts
 */

import { v4 as uuidv4 } from 'uuid';
import { magritteStyleElements } from './magritteStyleElements';
import { MAGRITTE_TEMPLATES } from './magrittePromptTemplates';
import { AgentLogger } from '../../utils/agentLogger';
import { magrittePatterns } from './magrittePatterns';

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

/**
 * Enhanced options for bear portrait prompt generation
 */
export interface BearPortraitEnhancementOptions {
  techniqueLevel?: number; // 0-1 scale of technical sophistication
  philosophicalDepth?: number; // 0-1 scale of philosophical complexity
  metaArtisticLevel?: number; // 0-1 scale of self-referential art elements
  digitalAwareness?: boolean; // Include digital/NFT awareness
  collectionAwareness?: boolean; // Include collection cohesion elements
}

/**
 * Enhances a bear portrait prompt with Magritte-style elements
 */
export function enhanceBearPortraitPrompt(
  basePrompt: string, 
  options?: BearPortraitEnhancementOptions
): string {
  // Set default options
  const enhancementOptions: Required<BearPortraitEnhancementOptions> = {
    techniqueLevel: options?.techniqueLevel ?? 0.9,
    philosophicalDepth: options?.philosophicalDepth ?? 0.8,
    metaArtisticLevel: options?.metaArtisticLevel ?? 0.7,
    digitalAwareness: options?.digitalAwareness ?? false,
    collectionAwareness: options?.collectionAwareness ?? false
  };
  
  // Extract key elements from prompt
  const elements = extractBearElements(basePrompt);
  
  // Select technical enhancements based on technique level
  const technicalElements = selectBearTechnicalElements(enhancementOptions.techniqueLevel);
  
  // Select philosophical elements based on depth
  const philosophicalElements = selectBearPhilosophicalElements(enhancementOptions.philosophicalDepth);
  
  // Add meta-artistic elements if requested
  const metaArtisticElements = enhancementOptions.metaArtisticLevel > 0.5 ? 
    selectBearMetaArtisticElements(enhancementOptions.metaArtisticLevel) : [];
  
  // Add digital awareness elements if requested
  const digitalElements = enhancementOptions.digitalAwareness ? 
    selectBearDigitalElements() : [];
  
  // Add collection cohesion elements if requested
  const collectionElements = enhancementOptions.collectionAwareness ? 
    selectBearCollectionElements() : [];
  
  // Combine all elements into enhanced prompt
  const enhancedPrompt = constructEnhancedBearPrompt(
    basePrompt,
    elements,
    technicalElements,
    philosophicalElements,
    metaArtisticElements,
    digitalElements,
    collectionElements
  );
  
  return enhancedPrompt;
}

/**
 * Legacy version for backward compatibility
 */
export function enhanceBearPortraitPromptLegacy(basePrompt: string): string {
  // Extract what kind of bear character is being described
  const bearTypeMatch = basePrompt.match(/bear (with|wearing|holding|in) ([^,.]+)/i);
  const bearType = bearTypeMatch ? bearTypeMatch[2].trim() : "distinguished";

  // Determine if there's a specific profession or role
  const professionMatch = basePrompt.match(/(doctor|chef|artist|musician|scientist|professor|writer|explorer|farmer|architect)/i);
  const profession = professionMatch ? professionMatch[1].toLowerCase() : "";

  // Check for existing Magritte elements
  const hasExistingMagritte = containsAnyKeyword(basePrompt, [
    "magritte", "surreal", "surrealist", "belgian", "bowler hat", "apple", "clouds", "pipe"
  ]);

  // Select appropriate Magritte elements
  const magritteElements = selectMagritteElements(profession, bearType);

  // Format the enhanced prompt
  let enhancedPrompt = basePrompt;

  // Only add Magritte elements if they're not already present
  if (!hasExistingMagritte) {
    enhancedPrompt += ` ${magritteElements}`;
  }

  // Add technical painting instructions if not already present
  if (!basePrompt.includes("perfectly smooth") && !basePrompt.includes("matte finish")) {
    enhancedPrompt += ` Render with Magritte's signature perfectly smooth, matte finish, invisible brushwork, and hyper-precise edges.`;
  }

  return enhancedPrompt;
}

/**
 * Extract bear elements from prompt
 */
function extractBearElements(prompt: string): Record<string, string> {
  const elements: Record<string, string> = {
    bearType: 'distinguished',
    profession: '',
    accessory: '',
    clothing: '',
    setting: '',
  };
  
  // Extract bear type
  const bearTypeMatch = prompt.match(/bear (with|wearing|holding|in) ([^,.]+)/i);
  elements.bearType = bearTypeMatch ? bearTypeMatch[2].trim() : "distinguished";
  
  // Extract profession
  const professionMatch = prompt.match(/(doctor|chef|artist|musician|scientist|professor|writer|explorer|farmer|architect)/i);
  elements.profession = professionMatch ? professionMatch[1].toLowerCase() : "";
  
  // Extract accessory
  const accessoryMatch = prompt.match(/holding ([^,.]+)/i) || prompt.match(/with ([^,.]+)/i);
  elements.accessory = accessoryMatch ? accessoryMatch[1].trim() : "";
  
  // Extract clothing
  const clothingMatch = prompt.match(/wearing ([^,.]+)/i);
  elements.clothing = clothingMatch ? clothingMatch[1].trim() : "";
  
  // Extract setting
  const settingMatch = prompt.match(/in ([^,.]+)/i);
  elements.setting = settingMatch ? settingMatch[1].trim() : "";
  
  return elements;
}

/**
 * Select technical elements based on desired level
 */
function selectBearTechnicalElements(level: number): string[] {
  const basicElements = [
    "perfectly smooth Magritte matte finish",
    "invisible brushwork in flat areas",
    "hyper-precise edge definition"
  ];
  
  const advancedElements = [
    "microscopic smooth transitions between color fields",
    "porcelain-like perfection with zero brushwork",
    "dimensionless paint surface with infinite depth suggestion",
    "mathematical shadow deployment with perfect optical properties",
    "glass-like surface quality without reflectivity",
    "conservation-quality bear fur suggestion"
  ];
  
  // Select number of elements based on technique level
  const numAdvanced = Math.floor(level * 5);
  return [
    ...basicElements,
    ...advancedElements.slice(0, numAdvanced)
  ];
}

/**
 * Select philosophical elements based on desired depth
 */
function selectBearPhilosophicalElements(depth: number): string[] {
  const philosophicalElements = [
    "philosophical contemplation in bear's gaze",
    "subtle awareness of surreal surroundings",
    "paradoxical object juxtapositions suggesting meaning",
    "impossible lighting physics creating metaphysical atmosphere",
    "bear silhouette containing impossible interior landscape",
    "subtle ceci n'est pas un ours paradox in composition",
    "exploration of identity through impossible mirror reflection",
    "consciousness depicted through window-within-eye technique"
  ];
  
  // Select number of elements based on philosophical depth
  const numElements = Math.floor(depth * 4) + 1;
  return philosophicalElements.slice(0, numElements);
}

/**
 * Select meta-artistic elements
 */
function selectBearMetaArtisticElements(level: number): string[] {
  const metaArtisticElements = [
    "subtle acknowledgment of artistic nature within composition",
    "frame-within-frame suggesting meta-awareness",
    "veiled commentary on artistic objecthood",
    "subtle reference to viewing conditions",
    "painting-within-painting recursive technique",
    "bear's awareness of being portrayed",
    "commentary on art collecting practices"
  ];
  
  // Select number of elements based on meta-artistic level
  const numElements = Math.floor(level * 3) + 1;
  return metaArtisticElements.slice(0, numElements);
}

/**
 * Select digital awareness elements
 */
function selectBearDigitalElements(): string[] {
  return [
    "subtle digital existence awareness",
    "blockchain visual metaphors rendered in Magritte's style",
    "NFT-specific paradoxes in classical painting technique",
    "digital ownership symbolism through traditional painting elements"
  ];
}

/**
 * Select collection cohesion elements
 */
function selectBearCollectionElements(): string[] {
  return [
    "subtle visual connections to larger bear universe",
    "shared symbolic vocabulary with collection",
    "color palette connecting to broader collection narrative",
    "symbolic elements creating visual language across portraits"
  ];
}

/**
 * Construct enhanced bear portrait prompt
 */
function constructEnhancedBearPrompt(
  basePrompt: string,
  elements: Record<string, string>,
  technicalElements: string[],
  philosophicalElements: string[],
  metaArtisticElements: string[],
  digitalElements: string[],
  collectionElements: string[]
): string {
  // Start with the base prompt
  let enhancedPrompt = basePrompt;
  
  // Add Magritte style elements if not already present
  if (!basePrompt.includes("Magritte") && !basePrompt.includes("surrealist")) {
    enhancedPrompt += ` Rendered in René Magritte's distinctive surrealist painting style.`;
  }
  
  // Add technical elements
  enhancedPrompt += ` Technical aspects: ${technicalElements.join(", ")}.`;
  
  // Add philosophical elements if any
  if (philosophicalElements.length > 0) {
    enhancedPrompt += ` Philosophical dimension: ${philosophicalElements.join(", ")}.`;
  }
  
  // Add meta-artistic elements if any
  if (metaArtisticElements.length > 0) {
    enhancedPrompt += ` Meta-artistic elements: ${metaArtisticElements.join(", ")}.`;
  }
  
  // Add digital elements if any
  if (digitalElements.length > 0) {
    enhancedPrompt += ` Digital awareness: ${digitalElements.join(", ")}.`;
  }
  
  // Add collection elements if any
  if (collectionElements.length > 0) {
    enhancedPrompt += ` Collection cohesion: ${collectionElements.join(", ")}.`;
  }
  
  return enhancedPrompt;
}

/**
 * Select appropriate Magritte elements based on profession and bear type
 */
function selectMagritteElements(profession: string, bearType: string): string {
  // Professional-specific Magritte elements
  const professionElements: Record<string, string> = {
    "doctor": "with a stethoscope that transforms into surreal birds",
    "chef": "with kitchen tools floating impossibly above a blue sky",
    "artist": "with paintbrushes that cast impossible shadows",
    "musician": "with musical instruments that emit visible sound waves",
    "scientist": "with laboratory equipment containing miniature cosmos",
    "professor": "with books that open to reveal infinite spaces",
    "writer": "with papers floating like Magritte's clouds",
    "explorer": "with maps showing impossible geographies",
    "farmer": "with agricultural tools growing like Magritte's trees",
    "architect": "with buildings floating like Magritte's Castle of the Pyrenees"
  };

  // Bear type influences
  const bearTypeInfluences: Record<string, string> = {
    "distinguished": "in formal attire with bowler hat in Magritte's Son of Man style",
    "elegant": "with refined posture against Magritte's blue sky and white clouds",
    "philosophical": "contemplating a pipe in the style of The Treachery of Images",
    "artistic": "with creative objects arranged like Personal Values",
    "professional": "in business attire with surreal elements from The Ready-Made Bouquet"
  };

  // Select elements based on profession and bear type
  let elements = "";
  
  // Add profession-specific elements if available
  if (profession && professionElements[profession]) {
    elements += professionElements[profession];
  } else {
    // Default Magritte element if no profession match
    elements += "with symbolic objects arranged in impossible juxtapositions";
  }
  
  // Add bear type influences if available
  if (bearTypeInfluences[bearType]) {
    elements += ` ${bearTypeInfluences[bearType]}`;
  } else {
    // Default bear type influence
    elements += " in Magritte's signature surrealist style";
  }
  
  return elements;
}

/**
 * Check if text contains any of the specified keywords
 */
function containsAnyKeyword(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * Select a random element from an array
 */
function selectRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
} 