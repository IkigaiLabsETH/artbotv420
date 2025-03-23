/**
 * Magritte Style Elements
 * Comprehensive collection of style parameters for authentic Magritte-style rendering
 */

/**
 * Comprehensive style elements for Magritte's distinctive approach
 * Includes technical aspects, visual elements, color palette, composition guidelines, references and avoidances
 */
export const magritteStyleElements = {
  /**
   * Style emphasis - technical aspects of Magritte's painting approach
   */
  styleEmphasis: [
    "precise Magritte-style oil painting",
    "perfect unmodulated paint surfaces",
    "traditional canvas texture",
    "crystal-clear execution",
    "philosophical surrealism",
    "metaphysical depth",
    "pristine technical rendering",
    "absolute flatness in paint",
    "perfect shadow execution",
    "mathematical precision",
    "mysterious atmospheric quality",
    "conceptual paradox",
    "pure painted forms",
    "traditional oil technique",
    "perfect color transitions"
  ],

  /**
   * Visual elements commonly found in Magritte's work
   */
  visualElements: [
    "floating bowler hats",
    "mysterious windows",
    "paradoxical doors",
    "perfect green apples",
    "pristine blue skies",
    "mathematically precise clouds",
    "impossible shadows",
    "metaphysical curtains",
    "surreal landscapes",
    "floating stones",
    "mysterious birds",
    "perfect mirrors",
    "philosophical pipes",
    "enigmatic figures",
    "traditional frames"
  ],

  /**
   * Precise color palette used in Magritte's paintings
   */
  colorPalette: [
    "Magritte sky blue (RGB: 135, 206, 235)",
    "deep shadow grey (RGB: 74, 74, 74)",
    "perfect apple green (RGB: 86, 130, 89)",
    "pristine cloud white (RGB: 245, 245, 245)",
    "rich earth brown (RGB: 139, 69, 19)",
    "stone grey (RGB: 128, 128, 128)",
    "deep night blue (RGB: 25, 25, 112)",
    "matte black (RGB: 28, 28, 28)",
    "pure canvas cream (RGB: 255, 253, 208)",
    "shadow blue (RGB: 68, 85, 90)",
    "pale sky (RGB: 176, 196, 222)",
    "deep foliage (RGB: 47, 79, 79)",
    "twilight purple (RGB: 78, 81, 128)",
    "morning grey (RGB: 169, 169, 169)",
    "horizon blue (RGB: 137, 207, 240)"
  ],

  /**
   * Specific composition guidelines that define Magritte's approach
   */
  compositionGuidelines: [
    "perfect central positioning",
    "mathematical balance",
    "mysterious depth through precise placement",
    "metaphysical arrangement of elements",
    "surreal scale relationships",
    "philosophical use of space",
    "object must fill 60-80% of frame",
    "precise horizon placement",
    "impossible shadows",
    "absolute symmetrical balance",
    "perfect square 1:1 aspect ratio",
    "traditional painting perspective",
    "pristine geometric arrangement",
    "careful negative space",
    "stark shadow patterns"
  ],

  /**
   * Mood and tone description for Magritte's work
   */
  moodAndTone: "Create scenes that embody the philosophical wonder of Magritte's surrealism through pure oil painting technique. Each piece should celebrate his precise, unmodulated paint application while maintaining the mysterious and contemplative nature of Belgian surrealism. The execution must demonstrate pristine technical precision while suggesting deeper metaphysical meanings through impossible arrangements and juxtapositions.",

  /**
   * Key Magritte works to reference for specific techniques
   */
  references: [
    "'The Son of Man' - for iconic composition",
    "'The Human Condition' - for paradoxical windows",
    "'The Dominion of Light' - for impossible lighting",
    "'Empire of Light' - for day/night paradox",
    "'The False Mirror' - for scale and mystery",
    "'Golconda' - for repeated elements",
    "'The Castle of the Pyrenees' - for floating objects",
    "'Personal Values' - for scale distortion",
    "'The Treachery of Images' - for philosophical depth",
    "'Time Transfixed' - for impossible locomotion"
  ],

  /**
   * Elements to avoid that would break Magritte's style
   */
  avoidElements: [
    "visible brushstrokes",
    "expressionist elements",
    "abstract forms",
    "bright unrealistic colors",
    "chaotic compositions",
    "heavy textures",
    "modern references",
    "digital effects",
    "photographic qualities",
    "contemporary objects",
    "non-traditional materials",
    "gestural painting",
    "impasto technique",
    "loose handling",
    "spontaneous effects"
  ],
  
  /**
   * RGB color values for precise color selection
   */
  rgbValues: {
    "sky_blue": { r: 135, g: 206, b: 235 },
    "shadow_grey": { r: 74, g: 74, b: 74 },
    "apple_green": { r: 86, g: 130, b: 89 },
    "cloud_white": { r: 245, g: 245, b: 245 },
    "earth_brown": { r: 139, g: 69, b: 19 },
    "stone_grey": { r: 128, g: 128, b: 128 },
    "night_blue": { r: 25, g: 25, b: 112 },
    "matte_black": { r: 28, g: 28, b: 28 },
    "canvas_cream": { r: 255, g: 253, b: 208 },
    "shadow_blue": { r: 68, g: 85, b: 90 },
    "pale_sky": { r: 176, g: 196, b: 222 },
    "deep_foliage": { r: 47, g: 79, b: 79 },
    "twilight_purple": { r: 78, g: 81, b: 128 },
    "morning_grey": { r: 169, g: 169, b: 169 },
    "horizon_blue": { r: 137, g: 207, b: 240 }
  }
};

/**
 * Get specific RGB color values for a Magritte palette color
 */
export function getRgbColor(colorName: keyof typeof magritteStyleElements.rgbValues): { r: number, g: number, b: number } {
  return magritteStyleElements.rgbValues[colorName] || magritteStyleElements.rgbValues.sky_blue;
}

/**
 * Get random elements from a specific style category
 */
export function getStyleElements(category: keyof typeof magritteStyleElements, count: number = 1): string[] {
  const elements = magritteStyleElements[category];
  if (!elements || !Array.isArray(elements) || elements.length === 0) {
    return [];
  }
  
  if (elements.length <= count) {
    return [...elements];
  }
  
  const shuffled = [...elements].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Generate a comprehensive style block incorporating multiple Magritte elements
 */
export function generateMagritteStyleBlock(): string {
  const technicalStyle = getStyleElements('styleEmphasis', 3).join(', ');
  const visualElements = getStyleElements('visualElements', 2).join(' and ');
  const colorDescription = getStyleElements('colorPalette', 3).join(', ');
  const composition = getStyleElements('compositionGuidelines', 2).join(', ');
  const reference = getStyleElements('references', 1)[0];
  
  return `The painting employs ${technicalStyle} with ${visualElements}. The palette features ${colorDescription}, composed with ${composition}. Referencing ${reference}. ${magritteStyleElements.moodAndTone}`;
}

/**
 * Generate a detailed negative prompt based on elements to avoid
 */
export function generateMagritteNegativePrompt(): string {
  return magritteStyleElements.avoidElements.join(', ');
}

/**
 * Generate color instructions for a Magritte painting
 */
export function generateColorInstructions(count: number = 3): string {
  const colors = getStyleElements('colorPalette', count);
  return `Use a precise Magritte palette featuring ${colors.join(', ')}.`;
}

/**
 * Generate composition instructions for a Magritte painting
 */
export function generateCompositionInstructions(count: number = 3): string {
  const compositions = getStyleElements('compositionGuidelines', count);
  return `Compose with ${compositions.join(', ')}.`;
} 