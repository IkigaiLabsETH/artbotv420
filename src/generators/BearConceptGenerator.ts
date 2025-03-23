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
      this.generateRandomCombination.bind(this)
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
      return this.generateRandomCombination(forceBowlerHat);
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
    
    // Generate concept
    return `A distinguished bear portrait in the style of René Magritte, featuring a ${series.id.replace('_', ' ')} bear wearing a ${headwear} and ${accessory}, ${enhancer}, with ${magritteElement}`;
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
    
    // Generate concept
    return `A distinguished bear portrait in profile wearing a ${headwear} and carrying ${accessory}, dressed in ${clothing}, with ${tool} and ${magritteElement}, in the style of René Magritte`;
  }

  /**
   * Generate a completely random combination
   */
  private generateRandomCombination(forceBowlerHat: boolean): string {
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
      "a cloudy blue sky background",
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

    // Color palettes inspired by Magritte
    const colorPalettes = [
      "Belgian sky blue with twilight grey transitions",
      "deep prussian blue with pristine white",
      "soft cerulean with precisely rendered clouds",
      "warm amber tones against cool neutral backdrop",
      "carefully controlled dusk lighting",
      "precise shadow rendering without defined light source"
    ];

    // Get headwear - use bowler hat if forced, otherwise random from primaryAccessories
    const headwear = forceBowlerHat ? "bowler hat" : getRandomElement(primaryAccessories);
    
    // Get other elements
    const accessory = getRandomElement(secondaryAccessories);
    const attire = getRandomElement(clothing);
    const magritteElement = getRandomElement(magritteElements);
    const colorPalette = getRandomElement(colorPalettes);
    
    // Generate concept with more precise Magritte technique description
    return `A distinguished bear portrait in the style of René Magritte, with mathematical precision and philosophical surrealism, featuring a bear wearing a ${headwear} and carrying ${accessory}, dressed in ${attire}, with ${magritteElement}, rendered using ${colorPalette}, with perfectly smooth matte paint application and precisely controlled edges`;
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