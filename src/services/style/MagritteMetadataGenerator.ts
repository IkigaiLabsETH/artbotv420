import { v4 as uuidv4 } from 'uuid';
import { AgentLogger } from '../../utils/agentLogger';
import { magrittePatterns } from './magrittePatterns';

/**
 * Magritte style metadata structure
 */
export interface MagritteStyleMetadata {
  visualElements: string[];
  paradox: string;
  technicalExecution: {
    surfaceQuality: string;
    edgeDefinition: string;
    colorApproach: string;
  };
  philosophicalConcept: string;
  compositionStyle: string;
  referencedWorks?: string[];
}

/**
 * MagritteMetadataGenerator
 * Generates structured metadata for Magritte-style artworks
 */
export class MagritteMetadataGenerator {
  private id: string;
  
  constructor() {
    this.id = uuidv4().substring(0, 8);
    AgentLogger.log(`MagritteMetadataGenerator (${this.id}) initialized`);
  }
  
  /**
   * Generate comprehensive Magritte-style metadata from prompt and art direction
   */
  generateMagritteMetadata(prompt: string, artDirection: any): MagritteStyleMetadata {
    AgentLogger.log(`Generating Magritte metadata for prompt: ${prompt.substring(0, 100)}...`);
    
    // Extract Magritte elements from the prompt and art direction
    const visualElements = this.extractVisualElements(prompt, artDirection);
    const paradox = this.extractParadox(prompt, artDirection);
    const technicalExecution = this.extractTechnicalExecution(prompt, artDirection);
    const philosophicalConcept = this.extractPhilosophicalConcept(prompt, artDirection);
    const compositionStyle = this.extractCompositionStyle(prompt, artDirection);
    const referencedWorks = this.extractReferencedWorks(prompt, artDirection);
    
    const metadata: MagritteStyleMetadata = {
      visualElements,
      paradox,
      technicalExecution,
      philosophicalConcept,
      compositionStyle,
      referencedWorks: referencedWorks.length > 0 ? referencedWorks : undefined
    };
    
    AgentLogger.log(`Generated Magritte metadata with ${visualElements.length} visual elements`);
    
    return metadata;
  }
  
  /**
   * Extract visual elements from prompt and art direction
   */
  private extractVisualElements(prompt: string, artDirection: any): string[] {
    const elements: string[] = [];
    const promptLower = prompt.toLowerCase();
    
    // Add from art direction if available
    if (artDirection?.visualElement) {
      elements.push(artDirection.visualElement);
    }
    
    // Check for common Magritte elements in the prompt
    magrittePatterns.visualElements.forEach(element => {
      if (promptLower.includes(element.toLowerCase())) {
        elements.push(element);
      }
    });
    
    // Add "bear" as it's a bear portrait
    if (!elements.includes("bear") && !elements.includes("distinguished bear")) {
      elements.push("distinguished bear");
    }
    
    // If we have fewer than 2 elements, add some typical ones
    if (elements.length < 2) {
      // Add some default Magritte elements that work well with bears
      const defaultElements = ["bowler hat", "Belgian sky blue background"];
      
      for (const element of defaultElements) {
        if (!elements.includes(element)) {
          elements.push(element);
          if (elements.length >= 3) break;
        }
      }
    }
    
    return elements;
  }
  
  /**
   * Extract paradox from prompt and art direction
   */
  private extractParadox(prompt: string, artDirection: any): string {
    // Use provided paradox if available
    if (artDirection?.paradox) {
      return artDirection.paradox;
    }
    
    const promptLower = prompt.toLowerCase();
    
    // Check for paradoxes in the prompt
    for (const paradox of magrittePatterns.paradoxes) {
      if (promptLower.includes(paradox.toLowerCase())) {
        return paradox;
      }
    }
    
    // Default paradox if none found
    return "Object relationship paradox";
  }
  
  /**
   * Extract technical execution details from prompt and art direction
   */
  private extractTechnicalExecution(prompt: string, artDirection: any): { surfaceQuality: string; edgeDefinition: string; colorApproach: string; } {
    const promptLower = prompt.toLowerCase();
    
    // Surface quality
    let surfaceQuality = "Perfectly smooth, matte finish";
    for (const aspect of magrittePatterns.technicalAspects) {
      if (aspect.toLowerCase().includes("surface") && promptLower.includes(aspect.toLowerCase())) {
        surfaceQuality = aspect;
        break;
      }
    }
    
    // Edge definition
    let edgeDefinition = "Crystal-clear, precise boundaries";
    for (const aspect of magrittePatterns.technicalAspects) {
      if ((aspect.toLowerCase().includes("edge") || aspect.toLowerCase().includes("crisp")) && 
          promptLower.includes(aspect.toLowerCase())) {
        edgeDefinition = aspect;
        break;
      }
    }
    
    // Color approach
    let colorApproach = "Pure, unmodulated tones";
    if (artDirection?.colorApproach) {
      colorApproach = artDirection.colorApproach;
    } else {
      for (const color of magrittePatterns.colorPalettes) {
        if (promptLower.includes(color.toLowerCase())) {
          colorApproach = color;
          break;
        }
      }
    }
    
    return {
      surfaceQuality,
      edgeDefinition,
      colorApproach
    };
  }
  
  /**
   * Extract philosophical concept from prompt and art direction
   */
  private extractPhilosophicalConcept(prompt: string, artDirection: any): string {
    // Use provided theme if available
    if (artDirection?.theme) {
      return artDirection.theme;
    }
    
    const promptLower = prompt.toLowerCase();
    
    // Check for concepts in the prompt
    for (const concept of magrittePatterns.conceptualThemes) {
      if (promptLower.includes(concept.toLowerCase())) {
        return concept;
      }
    }
    
    // Default concept if none found
    return "Reality questioning";
  }
  
  /**
   * Extract composition style from prompt and art direction
   */
  private extractCompositionStyle(prompt: string, artDirection: any): string {
    // Use provided composition if available
    if (artDirection?.composition) {
      return artDirection.composition;
    }
    
    const promptLower = prompt.toLowerCase();
    
    // Check for compositions in the prompt
    for (const composition of magrittePatterns.compositions) {
      if (promptLower.includes(composition.toLowerCase())) {
        return composition;
      }
    }
    
    // Default composition if none found
    return "Clean, enigmatic arrangement";
  }
  
  /**
   * Extract referenced works from prompt and art direction
   */
  private extractReferencedWorks(prompt: string, artDirection: any): string[] {
    const works: string[] = [];
    const promptLower = prompt.toLowerCase();
    
    // Check for famous works references in the prompt
    for (const work of magrittePatterns.famousWorks) {
      const workLower = work.toLowerCase();
      
      // Look for the title or a shortened version
      if (promptLower.includes(workLower) || 
          (workLower.includes("(") && promptLower.includes(workLower.split("(")[0].trim().toLowerCase()))) {
        works.push(work);
      }
    }
    
    return works;
  }
} 