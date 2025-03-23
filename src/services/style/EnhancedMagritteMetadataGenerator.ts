/**
 * Enhanced Magritte Metadata Generator
 * Produces rich, NFT-ready metadata for Magritte-style bear portraits
 */

import { v4 as uuidv4 } from 'uuid';
import { EnhancedLogger, LogLevel } from '../../utils/enhancedLogger';
import { magrittePatterns } from './magrittePatterns';
import { magritteStyleElements } from './magritteStyleElements';
import { CharacterIdentity } from '../../agents/types';

/**
 * Enhanced Magritte style metadata structure
 */
export interface EnhancedMagritteMetadata {
  // Artwork identification
  id: string;
  title: string;
  description: string;
  prompt: string;
  
  // Technical details
  style: string;
  imageUrl: string;
  createdAt: string;
  
  // Character information
  character: CharacterIdentity & {
    traits?: {
      occupation?: string;
      accessories?: string[];
      specialty?: string;
      artistic_influence?: string[];
    };
  };
  
  // Visual style elements
  visualElements: string[];
  styleAttributes: {
    surfaceQuality: string;
    edgeDefinition: string;
    colorApproach: string;
    compositionStyle: string;
  };
  
  // Conceptual elements
  paradox: string;
  philosophicalConcept: string;
  referencedWorks: string[];
  
  // NFT-specific metadata
  nftMetadata: {
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
    collection: {
      name: string;
      family: string;
      series: string;
    };
  };
}

/**
 * Enhanced Magritte Metadata Generator
 * For generating complete metadata for Magritte-style bear portraits
 */
export class EnhancedMagritteMetadataGenerator {
  private id: string;
  
  constructor() {
    this.id = uuidv4().substring(0, 8);
    EnhancedLogger.log(`EnhancedMagritteMetadataGenerator (${this.id}) initialized`);
  }
  
  /**
   * Generate enhanced metadata
   */
  async generateMetadata(
    prompt: string,
    character: CharacterIdentity,
    imageUrl: string,
    artDirection?: any
  ): Promise<EnhancedMagritteMetadata> {
    EnhancedLogger.log(`Generating enhanced Magritte metadata`, LogLevel.INFO);
    
    // Extract visual elements from prompt
    const visualElements = this.extractVisualElements(prompt, artDirection);
    
    // Generate title based on character
    const title = this.generateTitle(character);
    
    // Extract style attributes
    const styleAttributes = this.extractStyleAttributes(prompt);
    
    // Generate philosophical elements
    const { paradox, philosophicalConcept } = this.generatePhilosophicalElements(visualElements, character);
    
    // Identify referenced Magritte works
    const referencedWorks = this.identifyReferencedWorks(prompt, artDirection);
    
    // Create NFT attributes
    const nftAttributes = this.createNFTAttributes(character, visualElements, styleAttributes);
    
    // Generate description
    const description = this.generateDescription(character, visualElements, paradox);
    
    // Combine everything into complete metadata
    const metadata: EnhancedMagritteMetadata = {
      id: uuidv4(),
      title,
      description,
      prompt,
      style: 'bear_pfp',
      imageUrl,
      createdAt: new Date().toISOString(),
      
      character: {
        ...character,
        traits: {
          accessories: visualElements.filter(e => !e.includes('bear')),
          occupation: this.extractOccupation(character, prompt),
          specialty: this.extractSpecialty(character, prompt),
          artistic_influence: ['René Magritte', 'Belgian Surrealism']
        }
      },
      
      visualElements,
      styleAttributes,
      paradox,
      philosophicalConcept,
      referencedWorks,
      
      nftMetadata: {
        attributes: nftAttributes,
        collection: {
          name: 'Surrealist Bear Portraits',
          family: 'IKIGAI NFT Collection',
          series: 'Magritte-Style Bears'
        }
      }
    };
    
    EnhancedLogger.log(`Generated metadata for: ${title}`, LogLevel.SUCCESS);
    return metadata;
  }
  
  /**
   * Extract visual elements from the prompt
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
    
    // Add specific elements based on prompt keywords
    const elementKeywords = {
      "bowler hat": ["bowler", "hat", "fedora", "headwear"],
      "formal suit": ["suit", "formal", "attire", "clothing", "dressed"],
      "pipe": ["pipe", "smoking"],
      "apple": ["apple", "fruit"],
      "clouds": ["cloud", "sky"],
      "mirror": ["mirror", "reflection"],
      "window": ["window", "frame"],
      "surreal object": ["surreal", "paradox", "impossible"]
    };
    
    Object.entries(elementKeywords).forEach(([element, keywords]) => {
      if (keywords.some(keyword => promptLower.includes(keyword)) && !elements.includes(element)) {
        elements.push(element);
      }
    });
    
    // Add "bear" as it's a bear portrait
    if (!elements.includes("bear") && !elements.includes("distinguished bear")) {
      elements.push("distinguished bear");
    }
    
    // If we have fewer than 3 elements, add some typical ones
    if (elements.length < 3) {
      // Add some default Magritte elements that work well with bears
      const defaultElements = ["bowler hat", "blue sky background", "philosophical mood"];
      
      for (const element of defaultElements) {
        if (!elements.includes(element)) {
          elements.push(element);
          if (elements.length >= 4) break;
        }
      }
    }
    
    return elements;
  }
  
  /**
   * Generate a title based on character
   */
  private generateTitle(character: CharacterIdentity): string {
    // If character already has a title we like, use that
    if (character.name && character.title) {
      // Format like "The Philosopher's Bear" or "Sir Reginald's Contemplation"
      if (!character.title.startsWith("The ")) {
        return `${character.name.split(' ')[0]}'s ${character.title}`;
      }
      return `${character.title}`;
    }
    
    // Otherwise create a title from the name
    const nameParts = character.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    
    const titleFormats = [
      `The ${firstName}'s Contemplation`,
      `Portrait of ${character.name}`,
      `${lastName}'s Paradox`,
      `The Distinguished ${lastName}`,
      `${firstName}'s Philosophical Reflection`
    ];
    
    return titleFormats[Math.floor(Math.random() * titleFormats.length)];
  }
  
  /**
   * Extract style attributes from the prompt
   */
  private extractStyleAttributes(prompt: string): {
    surfaceQuality: string;
    edgeDefinition: string;
    colorApproach: string;
    compositionStyle: string;
  } {
    // Magritte's standard style attributes 
    return {
      surfaceQuality: "Smooth, matte finish with subtle visible brushwork",
      edgeDefinition: "Crystal-clear, precise boundaries between elements",
      colorApproach: "Clean, unmodulated color fields with subtle tonal transitions",
      compositionStyle: "Balanced, centered composition suitable for profile picture"
    };
  }
  
  /**
   * Generate philosophical elements
   */
  private generatePhilosophicalElements(
    visualElements: string[],
    character: CharacterIdentity
  ): {
    paradox: string;
    philosophicalConcept: string;
  } {
    // Paradox options
    const paradoxOptions = [
      "The juxtaposition of reality and representation",
      "The relationship between object and viewer",
      "The contradiction between appearance and essence",
      "The philosophical tension between image and meaning",
      "The surreal intersection of the familiar and the impossible"
    ];
    
    // Philosophical concept options
    const conceptOptions = [
      "Exploration of visual representation in relation to reality",
      "Questioning the boundaries between the real and the symbolic",
      "Challenging conventional perceptions through visual paradox",
      "Examining the relationship between observer and observed",
      "Investigating the nature of representation and meaning"
    ];
    
    // Select based on visual elements
    let paradoxIndex = 0;
    let conceptIndex = 0;
    
    // Adjust based on visual elements
    visualElements.forEach(element => {
      if (element.includes("mirror") || element.includes("reflection")) {
        paradoxIndex = 3;
        conceptIndex = 3;
      } else if (element.includes("cloud") || element.includes("sky")) {
        paradoxIndex = 4;
        conceptIndex = 2;
      } else if (element.includes("apple") || element.includes("fruit")) {
        paradoxIndex = 0;
        conceptIndex = 0;
      } else if (element.includes("pipe")) {
        paradoxIndex = 2;
        conceptIndex = 4;
      }
    });
    
    return {
      paradox: paradoxOptions[paradoxIndex],
      philosophicalConcept: conceptOptions[conceptIndex]
    };
  }
  
  /**
   * Identify referenced Magritte works
   */
  private identifyReferencedWorks(prompt: string, artDirection: any): string[] {
    const promptLower = prompt.toLowerCase();
    const referencedWorks: string[] = [];
    
    // Mapping of keywords to works
    const workMappings = {
      "son of man": "The Son of Man (1964)",
      "apple": "The Son of Man (1964)",
      "bowler hat": "The Son of Man (1964)",
      "pipe": "The Treachery of Images (1929)",
      "mirror": "Not to be Reproduced (1937)",
      "reflection": "Not to be Reproduced (1937)",
      "cloud": "The Empire of Light (1953-54)",
      "day and night": "The Empire of Light (1953-54)",
      "sky": "The Empire of Light (1953-54)",
      "window": "The Human Condition (1933)",
      "painting within": "The Human Condition (1933)",
      "large object": "Personal Values (1952)",
      "miniature": "Personal Values (1952)",
      "floating": "Golconda (1953)",
      "this is not": "The Treachery of Images (1929)"
    };
    
    // Check for keywords in prompt
    Object.entries(workMappings).forEach(([keyword, work]) => {
      if (promptLower.includes(keyword) && !referencedWorks.includes(work)) {
        referencedWorks.push(work);
      }
    });
    
    // Add from art direction if specified
    if (artDirection?.referenceWork && !referencedWorks.includes(artDirection.referenceWork)) {
      referencedWorks.push(artDirection.referenceWork);
    }
    
    // Always include at least one reference
    if (referencedWorks.length === 0) {
      referencedWorks.push("The Son of Man (1964)");
    }
    
    return referencedWorks;
  }
  
  /**
   * Create NFT attributes
   */
  private createNFTAttributes(
    character: CharacterIdentity,
    visualElements: string[],
    styleAttributes: any
  ): Array<{ trait_type: string; value: string }> {
    const attributes: Array<{ trait_type: string; value: string }> = [];
    
    // Add character attributes
    attributes.push({ trait_type: "Character Name", value: character.name });
    attributes.push({ trait_type: "Title", value: character.title });
    
    // Add personality traits
    character.personality.forEach(trait => {
      attributes.push({ trait_type: "Personality", value: trait });
    });
    
    // Add visual elements
    visualElements.forEach(element => {
      if (element.includes("hat") || element.includes("cap")) {
        attributes.push({ trait_type: "Headwear", value: element });
      } else if (element.includes("background")) {
        attributes.push({ trait_type: "Background", value: element });
      } else if (!element.includes("bear")) {
        attributes.push({ trait_type: "Accessory", value: element });
      }
    });
    
    // Add style attributes
    attributes.push({ trait_type: "Style", value: "René Magritte Surrealism" });
    attributes.push({ trait_type: "Surface Quality", value: styleAttributes.surfaceQuality });
    
    // Add artistic influences
    attributes.push({ trait_type: "Artistic Influence", value: "Belgian Surrealism" });
    
    return attributes;
  }
  
  /**
   * Generate description
   */
  private generateDescription(
    character: CharacterIdentity,
    visualElements: string[],
    paradox: string
  ): string {
    // Create a rich description combining character and visual elements
    return `A surrealist portrait of ${character.name}, ${character.title.toLowerCase()}, rendered in the distinctive style of René Magritte. ${character.backstory.split('.')[0]}. The portrait features ${visualElements.slice(0, 3).join(', ')}, creating ${paradox.toLowerCase()}. Part of the Surrealist Bear Portraits collection.`;
  }
  
  /**
   * Extract occupation from character and prompt
   */
  private extractOccupation(character: CharacterIdentity, prompt: string): string {
    // Try to extract from character title
    if (character.title) {
      const titleLower = character.title.toLowerCase();
      
      // Common occupation words in titles
      const occupations = [
        "professor", "doctor", "curator", "philosopher", "artist", 
        "poet", "conductor", "composer", "writer", "scientist",
        "explorer", "antiquarian", "diplomat", "collector"
      ];
      
      for (const occupation of occupations) {
        if (titleLower.includes(occupation)) {
          return occupation.charAt(0).toUpperCase() + occupation.slice(1);
        }
      }
    }
    
    // If not found in title, check in prompt
    const promptLower = prompt.toLowerCase();
    const promptOccupations = [
      "professor", "doctor", "curator", "philosopher", "artist", 
      "poet", "conductor", "composer", "writer", "scientist"
    ];
    
    for (const occupation of promptOccupations) {
      if (promptLower.includes(occupation)) {
        return occupation.charAt(0).toUpperCase() + occupation.slice(1);
      }
    }
    
    // Default occupation
    return "Philosopher";
  }
  
  /**
   * Extract specialty from character and prompt
   */
  private extractSpecialty(character: CharacterIdentity, prompt: string): string {
    // Common specialties in Magritte-style portraits
    const specialties = [
      "Surrealist Philosophy",
      "Visual Metaphor",
      "Conceptual Art",
      "Philosophical Paradox",
      "Representational Theory",
      "Metaphysical Inquiry"
    ];
    
    // Select based on character personality
    if (character.personality) {
      if (character.personality.some(p => p.toLowerCase().includes("philosophical"))) {
        return "Philosophical Inquiry";
      } else if (character.personality.some(p => p.toLowerCase().includes("analytical"))) {
        return "Conceptual Analysis";
      } else if (character.personality.some(p => p.toLowerCase().includes("creative"))) {
        return "Artistic Innovation";
      }
    }
    
    // Otherwise random specialty
    return specialties[Math.floor(Math.random() * specialties.length)];
  }
} 