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
      "brass telescope",
      "scientific instrument",
      "leather-bound journal",
      "antique map",
      "botanical guidebook",
      "astronomical chart"
    ];

    const neckwear = [
      "silk bow tie",
      "formal cravat",
      "elegant tie",
      "scientific society medal",
      "academic stole",
      "diplomatic corps badge",
      "artistic medallion",
      "explorer's compass",
      "vintage measuring tape"
    ];

    const clothing = [
      "formal suit",
      "academic robes",
      "artist's smock",
      "explorer's jacket",
      "chef's uniform",
      "vintage waistcoat",
      "conductor's tailcoat",
      "diplomat's dress coat",
      "naturalist's field attire",
      "philosopher's dress coat"
    ];

    const additionalElements = [
      "floating green apple",
      "mysterious cloudy sky background",
      "surreal window showing an impossible landscape",
      "paradoxical shadows",
      "metaphysical objects in the background",
      "trompe l'oeil effect",
      "philosophical visual paradox",
      "enigmatic reflections in mirrors",
      "impossibly balanced objects",
      "Belgian sky blue background"
    ];

    // Create a combination of elements
    const primary = forceBowlerHat ? "bowler hat" : getRandomElement(primaryAccessories);
    const secondary = getRandomElement(secondaryAccessories);
    const neck = getRandomElement(neckwear);
    const cloth = getRandomElement(clothing);
    const additional = getRandomElement(additionalElements);

    // Generate concept
    return `A distinguished bear portrait in profile wearing a ${primary}, ${secondary}, and ${neck}, dressed in a ${cloth}, with ${additional}, painted in Magritte's precise style against a Belgian sky blue background`;
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