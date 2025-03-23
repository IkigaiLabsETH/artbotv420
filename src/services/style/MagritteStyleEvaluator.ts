import { v4 as uuidv4 } from 'uuid';
import { AgentLogger } from '../../utils/agentLogger';

// Magritte-specific style metrics
export interface MagritteMetrics {
  metaphysicalDepth: {
    philosophicalResonance: number;  // How well it embodies Magritte's philosophical concepts
    conceptualComplexity: number;    // Depth of conceptual layering
    paradoxicalImpact: number;       // Effectiveness of visual paradoxes
  };
  technicalExecution: {
    objectPrecision: number;         // Precision of object rendering
    edgeControl: number;             // Cleanliness of edges
    perspectiveAccuracy: number;     // Accuracy of perspective
  };
  compositionBalance: {
    spatialHarmony: number;          // Balance of spatial elements
    objectPlacement: number;         // Strategic placement of objects
    scaleRelationships: number;      // Handling of scale relationships
  };
  symbolicPower: {
    objectSymbolism: number;         // Strength of symbolic relationships
    narrativeDepth: number;          // Depth of implied narrative
    metaphoricalResonance: number;   // Power of metaphorical connections
  };
}

/**
 * MagritteStyleEvaluator
 * Specialized evaluator for René Magritte's distinctive surrealist style
 */
export class MagritteStyleEvaluator {
  private id: string;
  
  // Default starting metrics that represent ideal Magritte style
  private defaultMetrics: MagritteMetrics = {
    metaphysicalDepth: {
      philosophicalResonance: 0.8,
      conceptualComplexity: 0.7,
      paradoxicalImpact: 0.8
    },
    technicalExecution: {
      objectPrecision: 0.9,  // Magritte's extreme precision with objects
      edgeControl: 0.9,      // Clean, precise edges
      perspectiveAccuracy: 0.8
    },
    compositionBalance: {
      spatialHarmony: 0.8,
      objectPlacement: 0.9,
      scaleRelationships: 0.8
    },
    symbolicPower: {
      objectSymbolism: 0.9,  // Strong symbolic meaning of objects
      narrativeDepth: 0.8,
      metaphoricalResonance: 0.9
    }
  };

  // Current metrics being used for evaluation
  private currentMetrics: MagritteMetrics;

  constructor() {
    this.id = uuidv4().substring(0, 8);
    this.currentMetrics = JSON.parse(JSON.stringify(this.defaultMetrics));
    
    AgentLogger.log(`MagritteStyleEvaluator (${this.id}) initialized`);
  }

  /**
   * Evaluate a prompt for Magritte style qualities
   */
  evaluatePrompt(prompt: string): { score: number; feedback: string[] } {
    AgentLogger.log(`Evaluating prompt for Magritte style: ${prompt.substring(0, 100)}...`);
    
    const metaphysicalScore = this.evaluateMetaphysicalDepth(prompt);
    const symbolicScore = this.evaluateSymbolicResonance(prompt);
    const paradoxicalScore = this.evaluateParadoxicalImpact(prompt);
    const atmosphericScore = this.evaluateAtmosphericMystery(prompt);
    const technicalScore = this.evaluateTechnicalPrecision(prompt);

    const overallScore = (
      metaphysicalScore * 0.25 +
      symbolicScore * 0.25 +
      paradoxicalScore * 0.2 +
      atmosphericScore * 0.15 +
      technicalScore * 0.15
    );

    // Generate feedback
    const feedback = this.generateFeedback(
      metaphysicalScore, 
      symbolicScore, 
      paradoxicalScore, 
      atmosphericScore, 
      technicalScore
    );

    AgentLogger.log(`Magritte style evaluation score: ${overallScore.toFixed(2)}`);
    
    return { score: overallScore, feedback };
  }

  /**
   * Enhance a prompt to better align with Magritte style
   */
  enhancePrompt(originalPrompt: string): string {
    AgentLogger.log(`Enhancing prompt for Magritte style: ${originalPrompt.substring(0, 100)}...`);
    
    const evaluation = this.evaluatePrompt(originalPrompt);
    
    // If score is already high, make minor enhancements
    if (evaluation.score > 0.8) {
      const enhancedPrompt = this.addMagritteRefinements(originalPrompt);
      AgentLogger.log(`Minor Magritte enhancements applied (score was already ${evaluation.score.toFixed(2)})`);
      return enhancedPrompt;
    }
    
    // Add specific Magritte style elements based on what's missing
    const enhancedPrompt = this.addMagritteElements(originalPrompt, evaluation.feedback);
    
    AgentLogger.log(`Major Magritte enhancements applied (original score: ${evaluation.score.toFixed(2)})`);
    AgentLogger.log(`Enhanced prompt: ${enhancedPrompt.substring(0, 100)}...`);
    
    return enhancedPrompt;
  }

  /**
   * Evaluate metaphysical depth of a prompt
   */
  private evaluateMetaphysicalDepth(prompt: string): number {
    const metaphysicalKeywords = [
      'philosophical', 'metaphysical', 'reality', 'truth',
      'existence', 'perception', 'representation', 'question',
      'this is not', 'ceci n\'est pas', 'illusion', 'deception'
    ];
    
    return this.calculateKeywordScore(prompt, metaphysicalKeywords);
  }

  /**
   * Evaluate symbolic resonance of a prompt
   */
  private evaluateSymbolicResonance(prompt: string): number {
    const symbolicKeywords = [
      'symbolic', 'meaning', 'representation', 'object',
      'relationship', 'resonance', 'connection', 'pipe', 'hat',
      'apple', 'bowler hat', 'businessman', 'suit'
    ];
    
    return this.calculateKeywordScore(prompt, symbolicKeywords);
  }

  /**
   * Evaluate paradoxical impact of a prompt
   */
  private evaluateParadoxicalImpact(prompt: string): number {
    const paradoxicalKeywords = [
      'paradox', 'impossible', 'contradiction', 'juxtaposition',
      'surreal', 'displacement', 'transformation', 'this is not',
      'floating', 'suspended', 'illogical', 'incongruous'
    ];
    
    return this.calculateKeywordScore(prompt, paradoxicalKeywords);
  }

  /**
   * Evaluate atmospheric mystery of a prompt
   */
  private evaluateAtmosphericMystery(prompt: string): number {
    const atmosphericKeywords = [
      'mysterious', 'atmosphere', 'enigmatic', 'ethereal',
      'dreamlike', 'poetic', 'ambiguous', 'sky', 'clouds',
      'blue sky', 'night sky', 'twilight', 'serene'
    ];
    
    return this.calculateKeywordScore(prompt, atmosphericKeywords);
  }

  /**
   * Evaluate technical precision aspects
   */
  private evaluateTechnicalPrecision(prompt: string): number {
    const technicalKeywords = [
      'precise', 'clear', 'detailed', 'clean edges', 'photorealistic',
      'meticulous', 'perfect', 'smooth', 'controlled', 'deliberate',
      'matte finish', 'clean surface', 'unmodulated', 'flat color'
    ];
    
    return this.calculateKeywordScore(prompt, technicalKeywords);
  }

  /**
   * Calculate keyword-based score
   */
  private calculateKeywordScore(text: string, keywords: string[]): number {
    const textLower = text.toLowerCase();
    const matches = keywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    );
    
    return Math.min(1, matches.length / (keywords.length * 0.5));
  }

  /**
   * Generate feedback based on scores
   */
  private generateFeedback(
    metaphysical: number, 
    symbolic: number, 
    paradoxical: number, 
    atmospheric: number, 
    technical: number
  ): string[] {
    const feedback: string[] = [];
    
    if (metaphysical < 0.6) {
      feedback.push("Add more philosophical questioning of reality");
    }
    
    if (symbolic < 0.6) {
      feedback.push("Include more symbolic objects with deeper meanings");
    }
    
    if (paradoxical < 0.6) {
      feedback.push("Incorporate visual paradoxes or contradictions");
    }
    
    if (atmospheric < 0.6) {
      feedback.push("Add more mysterious or ethereal atmosphere");
    }
    
    if (technical < 0.6) {
      feedback.push("Emphasize precise, clean rendering with perfect edges");
    }
    
    return feedback;
  }

  /**
   * Add Magritte elements to enhance a prompt
   */
  private addMagritteElements(prompt: string, feedback: string[]): string {
    let enhancedPrompt = prompt;
    
    // Apply specific enhancements based on feedback
    feedback.forEach(feedbackItem => {
      if (feedbackItem.includes("philosophical")) {
        enhancedPrompt += ", questioning the nature of reality and representation";
      }
      
      if (feedbackItem.includes("symbolic")) {
        enhancedPrompt += ", featuring symbolic objects like bowler hats, green apples, or pipes";
      }
      
      if (feedbackItem.includes("paradoxes")) {
        enhancedPrompt += ", with surreal juxtapositions and visual paradoxes";
      }
      
      if (feedbackItem.includes("atmosphere")) {
        enhancedPrompt += ", with dreamlike atmospheric elements and serene skies";
      }
      
      if (feedbackItem.includes("precise")) {
        enhancedPrompt += ", rendered with Magritte's characteristic precision, clean edges, and flawless surfaces";
      }
    });
    
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
} 