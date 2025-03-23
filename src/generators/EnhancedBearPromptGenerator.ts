/**
 * EnhancedBearPromptGenerator
 * 
 * A more sophisticated generator for Magritte-style bear portrait prompts
 * with improved structure and more precise control over visual elements
 */

import { BEAR_SERIES } from '../services/style/bearSeriesDefinitions';
import { magrittePatterns } from '../services/style/magrittePatterns';
import { magritteStyleElements } from '../services/style/magritteStyleElements';
import { characterCategories } from '../config/characterCategoriesConfig';

/**
 * Interface for enhanced bear prompt structure
 */
export interface BearPortraitPrompt {
  // Primary visual elements
  headwear: string;             // Primary hat/headwear
  neckwear: string;             // Neck accessories (bow tie, cravat, collar)
  facialElement?: string;       // Optional face covering or feature (pipe, veil, mask)
  
  // Clothing and accessories  
  attire: string;               // Main clothing item
  accessory: string;            // Primary handheld or associated item
  secondaryAccessory?: string;  // Optional secondary object
  
  // Magritte-specific elements
  surrealistElement: string;    // Signature surrealist contradiction
  philosophicalConcept: string; // Underlying philosophical idea
  visualParadox: string;        // Visual impossibility
  
  // Technical elements
  compositionStyle: string;     // How the portrait is arranged
  lightingTechnique: string;    // Specific Magritte lighting approach
  backgroundElement: string;    // Setting or backdrop
  colorTreatment: string;       // Color palette approach
}

/**
 * Options for generating bear portrait prompts
 */
export interface EnhancedBearPromptOptions {
  forceBowlerHat?: boolean;     // Always use a bowler hat
  seriesId?: string;            // Use a specific bear series
  emphasis?: {
    philosophical?: boolean;    // Emphasize philosophical elements
    surrealist?: boolean;       // Emphasize surrealist elements
    technical?: boolean;        // Emphasize technical execution
  }
}

/**
 * Get a random element from an array
 */
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Enhanced generator for Magritte-style bear portrait prompts
 */
export class EnhancedBearPromptGenerator {
  // Arrays of visual elements
  private headwearOptions = [
    "bowler hat floating slightly above the head",
    "bowler hat with impossible shadow",
    "top hat with cloud interior",
    "philosophical cap with celestial symbols",
    "artist's beret tilted at a mathematically precise angle",
    "captain's hat with surreal insignia",
    "academic cap with night sky lining",
    "crown made of mathematical equations",
    "transparent hat revealing sky interior",
    "explorer's pith helmet with cloudy interior"
  ];

  private neckwearOptions = [
    "pristine white collar",
    "precisely knotted bow tie",
    "silk cravat with impossible folds",
    "formal necktie that transforms into another object",
    "mathematically perfect ascot",
    "high collar with cloud pattern interior",
    "formal collar with philosophical inscriptions",
    "neck ribbon floating slightly away from the neck",
    "precisely rendered medallion on ribbon",
    "scholarly neck scarf with surreal pattern"
  ];

  private facialElementOptions = [
    "face partially obscured by a floating apple",
    "pipe that contradicts its own existence",
    "perfectly rendered monocle reflecting an impossible scene",
    "face partially concealed by white fabric",
    "perfectly formed speech bubble containing silence",
    "visage split between day and night",
    "face with features arranged in philosophical contradiction",
    "expression that changes depending on viewing angle",
    "partial veil revealing another reality",
    "face partially merged with surroundings"
  ];

  private attireOptions = [
    "perfectly tailored charcoal suit",
    "formal waistcoat with impossible pocket",
    "elegant jacket with surreal lining",
    "academic robe flowing against gravity",
    "distinguished professional attire with metaphysical elements",
    "formal suit containing a window to another reality",
    "precisely rendered coat with philosophical patterns",
    "waistcoat with pocket revealing Belgian sky",
    "formal uniform with conceptually impossible buttons",
    "perfectly pressed suit with contradictory shadow"
  ];

  private accessoryOptions = [
    "ornate key that opens nothing",
    "perfectly balanced pipe that isn't a pipe",
    "book of impossible knowledge",
    "pocket watch showing contradictory time",
    "perfectly rendered quill pen writing in air",
    "telescope revealing a different reality",
    "immaculately detailed musical instrument",
    "philosophical scientific instrument",
    "precise compass pointing in impossible directions",
    "vintage camera capturing what isn't there"
  ];

  private secondaryAccessoryOptions = [
    "mirror reflecting a different scene",
    "meticulously rendered apple floating impossibly",
    "perfectly balanced chess piece",
    "bell with impossible acoustics",
    "rose that casts shadow of another object",
    "precise mathematical instrument measuring the immeasurable",
    "precisely rendered door opening to somewhere impossible",
    "floating fish with bird characteristics",
    "immaculate bird with cloud properties",
    "perfect sphere contradicting its own existence"
  ];

  private surrealistElementOptions = [
    "indoor and outdoor space merge impossibly",
    "objects float in defiance of gravity",
    "scale relationships contradict physical laws",
    "day and night exist simultaneously",
    "solid objects behave like liquid",
    "reflections show different realities",
    "clouds form inside mundane objects",
    "interior space opens to exterior impossibly", 
    "objects transform into other objects mid-existence",
    "elements from different realities coexist"
  ];

  private philosophicalConceptOptions = [
    "the tension between perception and reality",
    "the arbitrary relationship between words and objects",
    "the impossible nature of representational art",
    "the contradiction between being and seeming",
    "the uncertain boundary between image and reality",
    "the philosophical problem of naming and meaning",
    "the surreal nature of everyday existence",
    "the impossibility of truly seeing what is there",
    "the philosophical question of identity and representation",
    "the paradoxical relationship between art and reality"
  ];

  private visualParadoxOptions = [
    "shadow falling in opposite direction to light source",
    "reflection showing what isn't there",
    "impossible continuation of space beyond boundaries",
    "object containing what should contain it",
    "objects with contradictory properties existing simultaneously",
    "window showing different time or weather than surroundings",
    "scale relationships that defy logical understanding",
    "transparent opacity and opaque transparency",
    "objects simultaneously present and absent",
    "spaces that are both interior and exterior"
  ];

  private compositionStyleOptions = [
    "perfect golden ratio alignment with classical balance",
    "mathematically precise arrangement of pictorial elements",
    "formal compositional structure with surreal interruptions",
    "balanced asymmetry that challenges perceptual expectations",
    "perfectly centered subject with philosophical framing",
    "meticulously calculated negative space relationships",
    "theatrical staging with metaphysical implications",
    "perspectival precision that defies spatial logic",
    "harmonious proportion with conceptual discord",
    "precise formal arrangement that questions its own structure"
  ];

  private lightingTechniqueOptions = [
    "sourceless illumination with pristine edge definition",
    "perfectly controlled light with philosophical shadow",
    "even illumination with conceptually impossible shadows",
    "subtle theatrical lighting with metaphysical implications",
    "daylight and evening light coexisting impossibly",
    "light revealing what shouldn't be visible",
    "precise chiaroscuro with contradictory sources",
    "illumination that defies its own source",
    "light with properties of solid matter",
    "shadowless rendering with perfect edge definition"
  ];

  private backgroundElementOptions = [
    "a Belgian sky transitioning from day to night",
    "a perfectly rendered cloudy sky with impossible clarity",
    "an evening sky with mathematically perfect clouds",
    "a wall with window revealing contradictory exterior",
    "architectural elements defying physical laws",
    "perfectly rendered ocean with sky properties",
    "meticulously painted forest with philosophical implications",
    "interior space that seems to continue infinitely",
    "precisely rendered landscape with surreal elements",
    "dreamlike architectural space with perfect execution"
  ];

  private colorTreatmentOptions = [
    "mathematically precise color relationships with cerulean blue and deep prussian shadow",
    "perfectly calibrated Magritte palette with philosophical color harmony",
    "flawlessly executed color fields with impossible transitions",
    "meticulously controlled subtle tonal variations with perfect edges",
    "pristine color rendering with conceptual temperature contradictions",
    "perfectly balanced complementary colors with surreal implications",
    "immaculate cool palette with precise warmth accents",
    "scientifically calculated color relationships with metaphysical intent",
    "perfectly rendered color fields with optical precision",
    "muted tones with conceptually significant color accents"
  ];

  /**
   * Generate a complete bear portrait prompt with enhanced structure
   */
  generatePortraitPrompt(options: EnhancedBearPromptOptions = {}): string {
    // Get prompt elements
    const promptElements = this.generatePromptElements(options);
    
    // Construct the prompt using the new structure
    return this.constructPrompt(promptElements);
  }

  /**
   * Generate elements for the portrait prompt
   */
  private generatePromptElements(options: EnhancedBearPromptOptions = {}): BearPortraitPrompt {
    const { forceBowlerHat = false, seriesId, emphasis } = options;
    
    // Get series-specific elements if requested
    let seriesElements: Partial<BearPortraitPrompt> = {};
    if (seriesId) {
      seriesElements = this.getSeriesSpecificElements(seriesId);
    }
    
    // Determine headwear - force bowler hat if requested
    const headwear = forceBowlerHat 
      ? "bowler hat floating slightly above the head"
      : seriesElements.headwear || getRandomElement(this.headwearOptions);
    
    // Create the prompt elements
    const promptElements: BearPortraitPrompt = {
      // Primary visual elements
      headwear,
      neckwear: seriesElements.neckwear || getRandomElement(this.neckwearOptions),
      facialElement: seriesElements.facialElement || getRandomElement(this.facialElementOptions),
      
      // Clothing and accessories
      attire: seriesElements.attire || getRandomElement(this.attireOptions),
      accessory: seriesElements.accessory || getRandomElement(this.accessoryOptions),
      secondaryAccessory: seriesElements.secondaryAccessory || getRandomElement(this.secondaryAccessoryOptions),
      
      // Magritte-specific elements
      surrealistElement: seriesElements.surrealistElement || getRandomElement(this.surrealistElementOptions),
      philosophicalConcept: seriesElements.philosophicalConcept || getRandomElement(this.philosophicalConceptOptions),
      visualParadox: seriesElements.visualParadox || getRandomElement(this.visualParadoxOptions),
      
      // Technical elements
      compositionStyle: seriesElements.compositionStyle || getRandomElement(this.compositionStyleOptions),
      lightingTechnique: seriesElements.lightingTechnique || getRandomElement(this.lightingTechniqueOptions),
      backgroundElement: seriesElements.backgroundElement || getRandomElement(this.backgroundElementOptions),
      colorTreatment: seriesElements.colorTreatment || getRandomElement(this.colorTreatmentOptions)
    };
    
    return promptElements;
  }

  /**
   * Get series-specific elements based on series ID
   */
  private getSeriesSpecificElements(seriesId: string): Partial<BearPortraitPrompt> {
    // Find the series
    const series = BEAR_SERIES.find(s => s.id === seriesId);
    if (!series) {
      return {};
    }
    
    // Get multiple accessories from the series
    const accessories = series.accessories.sort(() => Math.random() - 0.5).slice(0, 2);
    const primaryAccessory = accessories[0];
    const secondaryAccessory = accessories[1];
    
    // Extract series-specific elements
    const magritteElement = getRandomElement(series.magritteElements);
    const enhancer = getRandomElement(series.promptEnhancers);
    const trait = getRandomElement(series.characterTraits);
    
    // Create series-specific attire
    const seriesName = series.name.replace(' Series', '');
    const attireOptions = [
      `distinctive ${seriesName.toLowerCase()} attire with unique professional details`,
      `specialized ${seriesName.toLowerCase()} clothing with characteristic elements`,
      `unique ${seriesName.toLowerCase()} outfit with professional implements`,
      `${trait} ${seriesName.toLowerCase()} professional wear`
    ];
    
    // Generate a head accessory appropriate for the series
    const headwearOptions = [
      `professional ${seriesName.toLowerCase()} headwear`,
      `distinctive ${seriesName.toLowerCase()} cap`,
      `specialized ${seriesName.toLowerCase()} head protection`,
      `unique ${seriesName.toLowerCase()} headpiece`
    ];
    
    // Map series elements to prompt structure with much more series-specific details
    return {
      accessory: primaryAccessory,
      secondaryAccessory: secondaryAccessory,
      attire: getRandomElement(attireOptions),
      headwear: getRandomElement(headwearOptions),
      surrealistElement: enhancer,
      visualParadox: magritteElement,
      backgroundElement: `an environment reflecting ${seriesName.toLowerCase()} themes against a Belgian sky blue background`,
      philosophicalConcept: `the essence of ${series.conceptualThemes[Math.floor(Math.random() * series.conceptualThemes.length)]}`
    };
  }

  /**
   * Construct the final prompt from elements
   */
  private constructPrompt(elements: BearPortraitPrompt): string {
    // Visual elements section
    const visualSection = `A distinguished bear portrait in perfect profile wearing a ${elements.headwear}, ${elements.neckwear}${
      elements.facialElement ? `, with ${elements.facialElement}` : ''
    }, dressed in a ${elements.attire}, carrying ${elements.accessory}${
      elements.secondaryAccessory ? ` and accompanied by ${elements.secondaryAccessory}` : ''
    }`;
    
    // Surrealist concept section
    const conceptSection = `where ${elements.surrealistElement} creates a ${elements.visualParadox}, representing ${elements.philosophicalConcept}`;
    
    // Technical execution section
    const technicalSection = `rendered with ${elements.colorTreatment} against ${elements.backgroundElement}, with ${elements.lightingTechnique}, in ${elements.compositionStyle}`;
    
    // Combine all elements into final prompt with Magritte styling
    return `${visualSection}, ${conceptSection}, ${technicalSection}, painted in René Magritte's pristine surrealist style with immaculate surface quality, mathematically precise edges, and Belgian oil painting technique.`;
  }

  /**
   * Generate multiple portrait prompts
   */
  generateMultiplePrompts(count: number, options: EnhancedBearPromptOptions = {}): string[] {
    const prompts: string[] = [];
    for (let i = 0; i < count; i++) {
      prompts.push(this.generatePortraitPrompt(options));
    }
    return prompts;
  }
} 