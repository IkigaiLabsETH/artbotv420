/**
 * Magritte Emphasis Elements
 * Focused elements for enhancing Magritte's distinctive philosophical and technical style
 */

/**
 * Enhanced emphasis elements for Magritte's style
 * Each category has a set of descriptions that can be incorporated into prompts
 */
export const magritteEmphasisElements = {
  /**
   * Philosophical depth and conceptual paradoxes
   * Magritte's work deeply explores philosophical questions about reality and perception
   */
  philosophicalDepth: [
    "a profound philosophical exploration of the relationship between appearance and reality",
    "a conceptual paradox that challenges our understanding of what we see versus what is",
    "a visual metaphor questioning the nature of representation itself",
    "a meditation on the arbitrary relationship between words and images",
    "an exploration of how meaning is constructed through visual perception",
    "a philosophical inquiry into the boundaries between real and imaginary",
    "an examination of how context creates meaning in unexpected ways",
    "a paradoxical juxtaposition that reveals truth through contradiction",
    "a contemplation on how reality is altered by perspective and framing",
    "a deliberate subversion of logical categories creating philosophical tension",
    "an interrogation of how symbols acquire and transmit meaning",
    "a visual puzzle that reveals the constructed nature of conventional reality"
  ],

  /**
   * Pristine technical execution
   * Magritte's paintings feature meticulous craftsmanship and technical precision
   */
  pristineExecution: [
    "executed with Magritte's signature pristine technical precision",
    "painted with meticulous attention to surface quality and finish",
    "rendered with flawless photographic precision yet distinctly painterly",
    "crafted with immaculate edges and exquisite detail",
    "presented with the polished perfection characteristic of Magritte",
    "depicted with immaculate technical control and deliberate brushwork",
    "illustrated with the clean, precise rendering Magritte is known for",
    "composed with mathematical precision and perfect balance",
    "realized with crystalline clarity and masterful technique",
    "finished with smooth, unblemished surfaces that hide all trace of the artist's hand",
    "achieved through controlled painting technique that appears effortless",
    "portrayed with sharp definition and precise tonal transitions"
  ],

  /**
   * Dreamlike clarity and metaphysical mystery
   * Magritte creates scenes with perfect clarity that nonetheless evoke mysterious dreamscapes
   */
  dreamlikeClarity: [
    "rendered with a dreamlike clarity that feels both familiar and impossible",
    "bathed in an inexplicable light that creates metaphysical mystery",
    "presented with hyper-real clarity that paradoxically feels otherworldly",
    "depicted in a luminous atmosphere that transcends physical space",
    "portrayed with a crystalline precision that evokes transcendent mystery",
    "shown with uncanny clarity that suggests a reality beyond our own",
    "illuminated with sourceless light creating a sense of metaphysical suspension",
    "exhibited with dreamlike stillness and supernatural calm",
    "captured in a moment of perfect silence and infinite possibility",
    "presented with an eerie precision that transforms the mundane into the mystical",
    "articulated with surgical precision yet emanating enigmatic presence",
    "illustrated in a suspended reality where time seems permanently paused"
  ],

  /**
   * Traditional painting techniques
   * Magritte employed classical oil painting methods with meticulous craftsmanship
   */
  traditionalTechniques: [
    "created using traditional oil painting techniques with Belgian precision",
    "crafted with classical glazing methods for subtle tonal transitions",
    "painted with the restrained palette characteristic of Belgian surrealism",
    "rendered through methodical layering of transparent oil colors",
    "executed with the controlled brushwork of academic painting tradition",
    "developed using time-honored techniques of representational painting",
    "constructed through traditional underpaintings and precise overpainting",
    "realized through careful application of traditional perspective and volume",
    "painted with conscientious adherence to established pictorial conventions",
    "composed with formal balance derived from classical composition principles",
    "crafted with the meticulous approach of 19th century academic technique",
    "built upon foundational methods of European oil painting tradition"
  ],

  /**
   * Surreal juxtapositions of everyday objects
   * Magritte's signature approach to surrealism involves unexpected combinations of ordinary things
   */
  surrealJuxtapositions: [
    "featuring everyday objects arranged in impossible and provocative relationships",
    "containing familiar items placed in unfamiliar contexts that defy logical explanation",
    "presenting ordinary objects that become extraordinary through unexpected placement",
    "showing mundane elements rendered surreal through mysterious connections",
    "displaying common objects whose scale, position, or function has been subverted",
    "revealing the strangeness of everyday things through deliberate misplacement",
    "incorporating familiar objects that become alien through paradoxical relationships",
    "transforming ordinary items into philosophical statements through surreal composition",
    "arranging commonplace elements in ways that challenge habitual perception",
    "juxtaposing recognizable objects in ways that reveal hidden metaphysical truths",
    "combining domestic objects in dreamlike configurations that question reality",
    "presenting everyday items in impossible scenarios that provoke philosophical questioning"
  ],
  
  /**
   * Combined emphasis - phrases that incorporate multiple key Magritte elements
   */
  combinedEmphasis: [
    "rendered with pristine technical execution that heightens the philosophical paradox",
    "featuring everyday objects arranged with dreamlike clarity and metaphysical resonance",
    "painted with traditional oil techniques that bring surreal juxtapositions into sharp focus",
    "presenting conceptual contradictions with photographic precision and academic technique",
    "combining the familiar and impossible with flawless painterly execution",
    "illustrating philosophical questions through precise arrangement of ordinary objects",
    "manifesting dreamlike mystery through pristine technical control and classical composition",
    "transforming reality through meticulous technique and provocative object relationships",
    "employing traditional painting methods to create scenes of conceptual impossibility",
    "balancing technical perfection with profound metaphysical mystery",
    "creating visual poetry with everyday objects rendered in meticulous detail",
    "challenging perception through perfectly executed paradoxes and symbolic arrangements"
  ]
};

/**
 * Get random elements from a specific emphasis category
 */
export function getRandomEmphasisElements(category: keyof typeof magritteEmphasisElements, count: number = 1): string[] {
  const elements = magritteEmphasisElements[category];
  if (!elements || elements.length === 0) {
    return [];
  }
  
  if (elements.length <= count) {
    return [...elements];
  }
  
  const shuffled = [...elements].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get a random combined emphasis phrase
 */
export function getRandomCombinedEmphasis(): string {
  const combinedElements = magritteEmphasisElements.combinedEmphasis;
  return combinedElements[Math.floor(Math.random() * combinedElements.length)];
}

/**
 * Generate a comprehensive Magritte emphasis string
 * Incorporates elements from all five key areas
 */
export function generateComprehensiveEmphasis(): string {
  const philosophical = getRandomEmphasisElements('philosophicalDepth', 1)[0];
  const technical = getRandomEmphasisElements('pristineExecution', 1)[0];
  const dreamlike = getRandomEmphasisElements('dreamlikeClarity', 1)[0];
  const traditional = getRandomEmphasisElements('traditionalTechniques', 1)[0];
  const surreal = getRandomEmphasisElements('surrealJuxtapositions', 1)[0];
  const combined = getRandomCombinedEmphasis();
  
  return `The composition features ${surreal}. The artwork is ${philosophical}, ${technical}, and ${dreamlike}. ${traditional}. ${combined}.`;
}

/**
 * Generate an emphasis string focused on specific aspects
 * Allows customization of which elements to prioritize
 */
export function generateCustomEmphasis(priorities: {
  philosophical?: boolean;
  technical?: boolean;
  dreamlike?: boolean;
  traditional?: boolean;
  surreal?: boolean;
  combined?: boolean;
} = {}): string {
  const elements: string[] = [];
  
  // Add elements based on priorities
  if (priorities.philosophical !== false) {
    elements.push(getRandomEmphasisElements('philosophicalDepth', 1)[0]);
  }
  
  if (priorities.technical !== false) {
    elements.push(getRandomEmphasisElements('pristineExecution', 1)[0]);
  }
  
  if (priorities.dreamlike !== false) {
    elements.push(getRandomEmphasisElements('dreamlikeClarity', 1)[0]);
  }
  
  if (priorities.traditional !== false) {
    elements.push(getRandomEmphasisElements('traditionalTechniques', 1)[0]);
  }
  
  if (priorities.surreal !== false) {
    elements.push(getRandomEmphasisElements('surrealJuxtapositions', 1)[0]);
  }
  
  if (priorities.combined !== false) {
    elements.push(getRandomCombinedEmphasis());
  }
  
  // Join all elements into a coherent paragraph
  return elements.join('. ') + '.';
}