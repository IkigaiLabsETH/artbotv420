/**
 * BearConceptGenerator
 * 
 * Generates varied bear portrait concepts using random combinations of elements
 */

import { BEAR_SERIES } from '../services/style/bearSeriesDefinitions';
import { magrittePatterns } from '../services/style/magrittePatterns';
import { magritteStyleElements } from '../services/style/magritteStyleElements';
import { characterCategories } from '../config/characterCategoriesConfig';

/**
 * Interface for bear concept generation options
 */
export interface BearConceptOptions {
  useSeries?: boolean;
  useCategories?: boolean;
  useRandomCombinations?: boolean;
  forceBowlerHat?: boolean;
}

/**
 * Get a random element from an array
 */
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get multiple random elements from an array
 */
function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Main class for bear concept generation
 */
export class BearConceptGenerator {
  /**
   * Generate a random bear concept
   */
  generateBearConcept(options: BearConceptOptions = {}): string {
    const {
      useSeries = true,
      useCategories = true,
      useRandomCombinations = true,
      forceBowlerHat = false
    } = options;

    // Randomly select a generation strategy
    const strategies = [
      this.generateFromSeries.bind(this),
      this.generateFromCategories.bind(this),
      this.generateFromRandomCombination.bind(this)
    ];

    // Filter strategies based on options
    const enabledStrategies = strategies.filter((_, index) => {
      if (index === 0 && !useSeries) return false;
      if (index === 1 && !useCategories) return false;
      if (index === 2 && !useRandomCombinations) return false;
      return true;
    });

    // If no strategies are enabled, default to random combinations
    if (enabledStrategies.length === 0) {
      return this.generateFromRandomCombination(forceBowlerHat);
    }

    // Select a random strategy and generate concept
    const strategy = getRandomElement(enabledStrategies);
    return strategy(forceBowlerHat);
  }

  /**
   * Generate concept from bear series definitions
   */
  private generateFromSeries(forceBowlerHat: boolean): string {
    // Select a random series
    const series = getRandomElement(BEAR_SERIES);
    
    // Select random elements from the series
    const accessory = getRandomElement(series.accessories);
    const enhancer = getRandomElement(series.promptEnhancers);
    const magritteElement = getRandomElement(series.magritteElements);
    
    // Add bowler hat if forced
    const headwear = forceBowlerHat ? "bowler hat" : getRandomElement([
      "bowler hat",
      "top hat",
      "beret",
      "fedora",
      "cap"
    ]);
    
    // Select random color palette
    const colorPalette = getRandomElement([
      "Belgian sky blue with deep prussian shadow",
      "twilight hues with perfectly smooth transitions",
      "immaculate cerulean with pristine highlights",
      "classic Magritte color scheme",
      "perfectly balanced warm and cool tones"
    ]);
    
    // Add composition element
    const composition = getRandomElement([
      "perfectly centered portrait composition",
      "mathematically balanced profile view",
      "classic golden ratio arrangement",
      "formal exhibition-quality portrait",
      "museum-quality portrait composition"
    ]);
    
    // Add surface quality emphasis
    const surfaceQuality = getRandomElement([
      "with perfectly smooth matte finish",
      "with immaculate surface quality",
      "with invisible brushwork and pristine edges",
      "with flawless painterly execution",
      "with hyper-precise edge control"
    ]);
    
    // Generate concept with refined wording
    return `A distinguished bear portrait in the style of René Magritte, featuring a ${series.id.replace('_', ' ')} bear wearing a ${headwear} and ${accessory}, ${enhancer}, with ${magritteElement}, rendered with ${colorPalette}, ${composition}, ${surfaceQuality}`;
  }

  /**
   * Generate concept from character categories
   */
  private generateFromCategories(forceBowlerHat: boolean): string {
    // Select a random category
    const category = getRandomElement(characterCategories);
    
    // Select random elements from the category
    const accessory = getRandomElement(category.accessories);
    const clothing = getRandomElement(category.clothing);
    
    // Get headwear - use bowler hat if forced, otherwise random from category
    const headwear = forceBowlerHat ? "bowler hat" : getRandomElement(category.headwear);
    
    // Select a tool
    const tool = getRandomElement(category.tools);
    
    // Add a Magritte element
    const magritteElement = getRandomElement(magrittePatterns.visualElements);
    
    // Select a personality trait to inform the portrait
    const personalityTrait = getRandomElement(category.personalityTraits);
    
    // Add surface quality emphasis
    const surfaceQuality = getRandomElement([
      "with perfectly smooth matte finish characteristic of Magritte",
      "with immaculate surface quality and flawless edge definition",
      "with invisible brushwork and pristine painted surfaces",
      "with mathematically precise edge control and surface quality",
      "with museum-quality painterly execution"
    ]);
    
    // Add composition element
    const composition = getRandomElement([
      "against a Belgian sky blue background",
      "perfectly posed with mathematical balance and precision",
      "rendered in meticulous detail with optical precision",
      "composed with formal portrait arrangement and sourceless lighting",
      "with classical compositional balance and surrealist sensibility"
    ]);
    
    // Generate concept with improved wording for better results
    return `A distinguished bear portrait with a ${personalityTrait.toLowerCase()} expression, wearing a ${headwear} and carrying ${accessory}, dressed in ${clothing}, with ${tool} and ${magritteElement}, ${composition}, ${surfaceQuality}, in the style of René Magritte's pristine oil painting technique`;
  }

  /**
   * Generate a completely random combination
   */
  private generateFromRandomCombination(forceBowlerHat: boolean): string {
    // Create arrays of possible elements
    const primaryAccessories = [
      "bowler hat",
      "top hat",
      "beekeeping hat",
      "chef's toque",
      "captain's hat",
      "academic cap",
      "artist's beret",
      "conductor's cap",
      "explorer's pith helmet",
      "philosopher's cap"
    ];

    const secondaryAccessories = [
      "monocle",
      "pocket watch",
      "vintage camera",
      "magnifying glass",
      "smoking pipe",
      "quill pen",
      "fountain pen",
      "compass",
      "antique book",
      "telescope",
      "chess piece"
    ];

    const clothing = [
      "formal suit with bow tie",
      "elegant waistcoat with pocket square",
      "tweed jacket with elbow patches",
      "tailored blazer with silk handkerchief",
      "traditional academic gown",
      "conductor's uniform",
      "aristocratic hunting attire",
      "scholarly robes",
      "distinguished diplomatic uniform",
      "vintage three-piece suit"
    ];

    // Magritte-specific surrealist elements
    const magritteElements = [
      "a floating apple obscuring the face",
      "a Belgian sky blue background",
      "a floating bowler hat",
      "a bird that transforms into a leaf",
      "a window revealing a different time of day",
      "a crescent moon emerging from behind",
      "a mirror reflecting something unexpected",
      "a door opening to an impossible space",
      "objects suspended in mid-air",
      "shadows cast in impossible directions",
      "a pipe with the text 'Ceci n'est pas une pipe'",
      "a luminous bell floating in darkness",
      "a picture frame containing the continuation of the landscape behind it",
      "a twilight sky transitioning to night",
      "a silhouette filled with sky",
      "elements with contradictory scale relationships",
      "objects seamlessly merging into other forms",
      "architectural elements defying physics",
      "mathematically perfect surreal compositions"
    ];

    // Painting techniques specific to Magritte
    const paintingTechniques = [
      "perfectly smooth matte surfaces with invisible brushwork",
      "hyper-precise edge control with mathematically perfect transitions",
      "flawless painterly execution with museum-quality finish",
      "immaculate color fields with no visible brushstrokes",
      "pristine surface quality with sourceless illumination",
      "René Magritte's characteristic glass-like surface quality",
      "optical precision with phenomenal attention to detail",
      "perfect oil painting technique with zero impasto",
      "porcelain-like surface finish with crystalline clarity",
      "mathematically perfect gradations of tone and color"
    ];

    // Color palettes inspired by Magritte
    const colorPalettes = [
      "Belgian sky blue background with twilight grey transitions",
      "deep prussian blue with pristine white",
      "soft cerulean with precisely rendered clouds",
      "warm amber tones against cool neutral backdrop",
      "carefully controlled dusk lighting",
      "precise shadow rendering without defined light source"
    ];

    // Compositions inspired by Magritte
    const compositions = [
      "perfectly centered profile view",
      "formal portrait arrangement with philosophical intent",
      "classical composition with surrealist elements",
      "balanced asymmetry with perfect weight distribution",
      "precisely calculated negative space",
      "mathematically harmonious proportions",
      "golden ratio arrangement of visual elements"
    ];

    // Get headwear - use bowler hat if forced, otherwise random from primaryAccessories
    const headwear = forceBowlerHat ? "bowler hat" : getRandomElement(primaryAccessories);
    
    // Get other elements
    const accessory = getRandomElement(secondaryAccessories);
    const attire = getRandomElement(clothing);
    const magritteElement = getRandomElement(magritteElements);
    const colorPalette = getRandomElement(colorPalettes);
    const technique = getRandomElement(paintingTechniques);
    const composition = getRandomElement(compositions);
    
    // Generate concept with more precise Magritte technique description
    return `A distinguished bear portrait in the style of René Magritte, with mathematical precision and philosophical surrealism, featuring a bear wearing a ${headwear} and carrying ${accessory}, dressed in ${attire}, with ${magritteElement}, rendered using ${colorPalette}, with ${technique}, in ${composition}`;
  }

  /**
   * Generate multiple concepts
   */
  generateMultipleConcepts(count: number, options: BearConceptOptions = {}): string[] {
    const concepts: string[] = [];
    
    for (let i = 0; i < count; i++) {
      concepts.push(this.generateBearConcept(options));
    }
    
    return concepts;
  }
}

// Export a singleton instance for easy use
export const bearConceptGenerator = new BearConceptGenerator(); 