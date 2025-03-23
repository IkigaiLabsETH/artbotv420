/**
 * Magritte Prompt Templates
 * Collection of prompt templates based on René Magritte's famous works
 */

import { magrittePatterns } from './magrittePatterns';

export interface MagritteTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  weight: number; // Probability weight for selection
  referenceArtwork: string;
  suitableForSeries?: string[]; // Which series work best with this template
  contextualVariables: string[]; // Variables that need to be filled in the template
}

/**
 * Templates based on Magritte's most iconic works
 */
export const MAGRITTE_TEMPLATES: MagritteTemplate[] = [
  {
    id: "son_of_man",
    name: "Son of Man",
    description: "Face partially obscured by floating object",
    template: "A dignified bear portrait in profile, with {{accessory}} floating mysteriously in front of the face. The bear is {{character_description}} wearing {{clothing}}. Background features {{background}}. In René Magritte's pristine surrealist style with philosophical depth.",
    weight: 1.0,
    referenceArtwork: "The Son of Man (1964)",
    suitableForSeries: ["academic", "artistic", "classical", "craft", "hipster"],
    contextualVariables: ["accessory", "character_description", "clothing", "background"]
  },
  {
    id: "empire_of_light",
    name: "Empire of Light",
    description: "Paradoxical sky with day and night simultaneously",
    template: "A philosophical portrait of {{character_description}} beneath a paradoxical sky - daylight blue above with clouds, nighttime below. The bear wears {{clothing}} and holds {{accessory}} with Magritte's characteristic clean technique and dreamlike clarity.",
    weight: 0.9,
    referenceArtwork: "The Empire of Light (1953-54)",
    suitableForSeries: ["adventure", "mystical", "steampunk", "sustainable_future"],
    contextualVariables: ["character_description", "clothing", "accessory"]
  },
  {
    id: "personal_values",
    name: "Personal Values",
    description: "Objects of surreal scale in interior space",
    template: "In Magritte's surrealist style, a bear {{character_description}} in a room where {{accessory}} appears impossibly large, challenging perspective and reality. The bear wears {{clothing}} with {{accessory2}} nearby. With pristine execution and metaphysical mystery.",
    weight: 0.8,
    referenceArtwork: "Personal Values (1952)",
    suitableForSeries: ["hipster", "modern_maker", "urban_homesteading", "craft"],
    contextualVariables: ["character_description", "accessory", "clothing", "accessory2"]
  },
  {
    id: "time_transfixed",
    name: "Time Transfixed",
    description: "Object emerging from unexpected place",
    template: "A surrealist bear portrait showing {{character_description}} with {{accessory}} emerging from an unexpected place. The bear wears {{clothing}} and stands with {{pose}}. Featuring Magritte's pristine execution, conceptual depth, and dreamlike clarity.",
    weight: 0.7,
    referenceArtwork: "Time Transfixed (1938)",
    suitableForSeries: ["steampunk", "experimental_art", "performance_art", "digital_innovation"],
    contextualVariables: ["character_description", "accessory", "clothing", "pose"]
  },
  {
    id: "not_to_be_reproduced",
    name: "Not to be Reproduced",
    description: "Paradoxical reflection in mirror",
    template: "A distinguished bear {{character_description}} seen from behind looking at a mirror, but the reflection shows the back of the head again instead of the face. The bear wears {{clothing}} with {{accessory}} placed enigmatically in the scene. In Magritte's precise surrealist style.",
    weight: 0.75,
    referenceArtwork: "Not to be Reproduced (1937)",
    suitableForSeries: ["digital_innovation", "mystical", "academic", "experimental_art"],
    contextualVariables: ["character_description", "clothing", "accessory"]
  },
  {
    id: "treachery_of_images",
    name: "The Treachery of Images",
    description: "Object with philosophical text statement",
    template: "A meticulously detailed bear {{character_description}} with {{accessory}} prominently featured. Below appears text stating 'This is not a {{text_subject}}' in elegant script. The bear wears {{clothing}} against a plain {{background}}. Rendered in Magritte's precise painting style.",
    weight: 0.8,
    referenceArtwork: "The Treachery of Images (1929)",
    suitableForSeries: ["academic", "mystical", "digital_innovation", "experimental_art"],
    contextualVariables: ["character_description", "accessory", "text_subject", "clothing", "background"]
  },
  {
    id: "golconda",
    name: "Golconda",
    description: "Multiple floating figures in sky",
    template: "A surrealist scene with multiple identical bear figures wearing {{clothing}} and floating against a {{background}}. Each bear holds {{accessory}} and has the appearance of {{character_description}}. Depicted with Magritte's characteristic attention to detail and dreamlike atmosphere.",
    weight: 0.65,
    referenceArtwork: "Golconda (1953)",
    suitableForSeries: ["academic", "performance_art", "digital_innovation"],
    contextualVariables: ["clothing", "background", "accessory", "character_description"]
  },
  {
    id: "castle_of_pyrenees",
    name: "The Castle of the Pyrenees",
    description: "Impossible floating landmass",
    template: "A dignified bear {{character_description}} standing on a floating rock formation suspended impossibly above {{background}}. The bear wears {{clothing}} and holds {{accessory}}. Rendered with Magritte's precise technique and philosophical depth.",
    weight: 0.7,
    referenceArtwork: "The Castle of the Pyrenees (1959)",
    suitableForSeries: ["adventure", "mystical", "steampunk", "sustainable_future"],
    contextualVariables: ["character_description", "background", "clothing", "accessory"]
  },
  {
    id: "lovers",
    name: "The Lovers",
    description: "Figures with concealed faces",
    template: "A portrait of a distinguished bear {{character_description}} with face veiled in cloth, yet maintaining dignity and presence. Wearing {{clothing}} and holding {{accessory}} against {{background}}. Executed in Magritte's pristine surrealist style with philosophical depth.",
    weight: 0.6,
    referenceArtwork: "The Lovers (1928)",
    suitableForSeries: ["mystical", "performance_art", "experimental_art"],
    contextualVariables: ["character_description", "clothing", "accessory", "background"]
  },
  {
    id: "key_of_dreams",
    name: "The Key of Dreams",
    description: "Objects with incongruous labels",
    template: "A conceptual portrait featuring a bear {{character_description}} alongside several objects each labeled incorrectly. The bear wears {{clothing}} and holds {{accessory}} labeled as '{{mislabel}}'. Set against {{background}} in Magritte's distinctive surrealist style.",
    weight: 0.65,
    referenceArtwork: "The Key of Dreams (1930)",
    suitableForSeries: ["academic", "experimental_art", "digital_innovation"],
    contextualVariables: ["character_description", "clothing", "accessory", "mislabel", "background"]
  },
  {
    id: "human_condition",
    name: "The Human Condition",
    description: "Painting within painting that continues reality",
    template: "A bear {{character_description}} standing beside an easel with a painting that seamlessly continues the {{background}} behind it. The bear wears {{clothing}} and holds {{accessory}}. Created with Magritte's precise technique and philosophical questioning of representation.",
    weight: 0.7,
    referenceArtwork: "The Human Condition (1933)",
    suitableForSeries: ["artistic", "academic", "experimental_art"],
    contextualVariables: ["character_description", "background", "clothing", "accessory"]
  },
  {
    id: "threatened_assassin",
    name: "The Threatened Assassin",
    description: "Theatrical scene with mysterious narrative",
    template: "A theatrical portrait of a bear {{character_description}} in a surreal interior setting. The bear wears {{clothing}} and interacts with {{accessory}} while being observed by mysterious figures. Rendered in Magritte's precise style with enigmatic narrative quality.",
    weight: 0.55,
    referenceArtwork: "The Threatened Assassin (1926)",
    suitableForSeries: ["performance_art", "steampunk", "mystical"],
    contextualVariables: ["character_description", "clothing", "accessory"]
  },
  {
    id: "collective_invention",
    name: "Collective Invention",
    description: "Hybrid creature with reversed natural order",
    template: "A dignified portrait of a bear {{character_description}} with a surreal and philosophical twist - some element of nature reversed or transformed. The bear wears {{clothing}} and holds {{accessory}} against {{background}}. Painted with Magritte's precise technique and conceptual depth.",
    weight: 0.6,
    referenceArtwork: "Collective Invention (1935)",
    suitableForSeries: ["experimental_art", "mystical", "sustainable_future"],
    contextualVariables: ["character_description", "clothing", "accessory", "background"]
  },
  {
    id: "listening_room",
    name: "The Listening Room",
    description: "Object of impossible scale filling a room",
    template: "A bear {{character_description}} in a room dominated by an impossibly large {{accessory}} that fills the entire space. The bear wears {{clothing}} and maintains dignified composure despite the surreal situation. Created in Magritte's precise painting style with philosophical undertones.",
    weight: 0.65,
    referenceArtwork: "The Listening Room (1952)",
    suitableForSeries: ["classical", "experimental_art", "modern_maker"],
    contextualVariables: ["character_description", "accessory", "clothing"]
  },
  {
    id: "false_mirror",
    name: "The False Mirror",
    description: "Eye reflecting unexpected content",
    template: "A close portrait of a bear {{character_description}} with one eye prominently featured, reflecting {{background}} rather than surroundings. The bear wears {{clothing}} and has {{accessory}} nearby. Executed with Magritte's surrealist precision and conceptual depth.",
    weight: 0.6,
    referenceArtwork: "The False Mirror (1929)",
    suitableForSeries: ["mystical", "experimental_art", "digital_innovation"],
    contextualVariables: ["character_description", "background", "clothing", "accessory"]
  }
];

/**
 * Select a template most appropriate for a specific bear series
 */
export function selectTemplateForSeries(seriesId: string): MagritteTemplate {
  // Filter templates suitable for this series
  const suitableTemplates = MAGRITTE_TEMPLATES.filter(t => 
    !t.suitableForSeries || t.suitableForSeries.includes(seriesId)
  );
  
  // If no suitable templates found, use all templates
  const templatePool = suitableTemplates.length > 0 ? suitableTemplates : MAGRITTE_TEMPLATES;
  
  // Weight-based random selection
  const totalWeight = templatePool.reduce((sum, t) => sum + t.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const template of templatePool) {
    random -= template.weight;
    if (random <= 0) return template;
  }
  
  // Fallback
  return MAGRITTE_TEMPLATES[0];
}

/**
 * Select a random template from all available options
 */
export function selectRandomTemplate(): MagritteTemplate {
  // Weight-based random selection
  const totalWeight = MAGRITTE_TEMPLATES.reduce((sum, t) => sum + t.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const template of MAGRITTE_TEMPLATES) {
    random -= template.weight;
    if (random <= 0) return template;
  }
  
  // Fallback
  return MAGRITTE_TEMPLATES[0];
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(id: string): MagritteTemplate | undefined {
  return MAGRITTE_TEMPLATES.find(template => template.id === id);
} 