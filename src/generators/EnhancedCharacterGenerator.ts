/**
 * Enhanced Character Generator
 * Creates rich character identities based on concepts with Magritte-style theming
 */

import { v4 as uuidv4 } from 'uuid';
import { CharacterIdentity } from '../agents/types';
import { AIService } from '../services/ai/index';
import { AgentLogger } from '../utils/agentLogger';

/**
 * Enhanced Character Generator
 * Creates distinguished bear characters with rich personalities and backgrounds
 */
export class EnhancedCharacterGenerator {
  private id: string;
  private aiService: AIService;
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.aiService = aiService;
    AgentLogger.log(`EnhancedCharacterGenerator (${this.id}) initialized`);
  }
  
  /**
   * Generate a character from a concept and prompt
   */
  async generateCharacter(concept: string, prompt: string): Promise<CharacterIdentity> {
    try {
      // Extract elements from the prompt
      const elements = await this.extractElements(concept, prompt);
      
      // Generate the character components
      const name = this.generateName(elements);
      const title = this.generateTitle(elements);
      const personality = this.derivePersonality(elements);
      const backstory = await this.createBackstory(elements, name, title);
      const nickname = this.generateNickname(elements, title);
      
      // Log the character creation
      AgentLogger.log(`Generated character: ${name}, ${title}`);
      
      return {
        name,
        title,
        nickname,
        personality,
        backstory
      };
    } catch (error) {
      AgentLogger.log(`Error generating character: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return a default character
      return {
        name: "Sir Bartholomew Bearington",
        title: "The Distinguished Dignitary",
        personality: ["Dignified", "Philosophical", "Contemplative", "Precise", "Formal"],
        backstory: "A bear of mystery and distinction, known for philosophical contemplation."
      };
    }
  }
  
  /**
   * Extract character elements from concept and prompt
   */
  private async extractElements(concept: string, prompt: string): Promise<any> {
    // Default elements
    const elements: any = {
      accessories: ["bowler hat"],
      clothing: "formal suit",
      profession: null,
      attributes: ["distinguished", "dignified"],
      style: "magritte",
      setting: null,
      activity: null
    };
    
    // Extract accessories
    const accessoryMatches = prompt.match(/with ([^,.]+)|holding ([^,.]+)|carries ([^,.]+)/ig);
    if (accessoryMatches) {
      elements.accessories = accessoryMatches.map((match: string) => {
        return match.replace(/with |holding |carries /ig, '').trim();
      });
    }
    
    // Extract clothing
    const clothingMatch = prompt.match(/wearing ([^,.]+)/i);
    if (clothingMatch && clothingMatch[1]) {
      elements.clothing = clothingMatch[1].trim();
    }
    
    // Extract profession from common professions
    const professions = [
      "professor", "doctor", "curator", "philosopher", "artist", "poet",
      "conductor", "composer", "writer", "scientist", "explorer", "antiquarian",
      "diplomat", "collector", "scholar", "historian", "librarian", "astronomer"
    ];
    
    for (const profession of professions) {
      if (concept.toLowerCase().includes(profession) || prompt.toLowerCase().includes(profession)) {
        elements.profession = profession;
        break;
      }
    }
    
    // Extract attributes
    const attributeMatches = [
      "distinguished", "dignified", "elegant", "formal", "philosophical", 
      "contemplative", "mysterious", "enigmatic", "surreal", "paradoxical"
    ];
    
    for (const attribute of attributeMatches) {
      if (concept.toLowerCase().includes(attribute) || prompt.toLowerCase().includes(attribute)) {
        if (!elements.attributes.includes(attribute)) {
          elements.attributes.push(attribute);
        }
      }
    }
    
    return elements;
  }
  
  /**
   * Generate a distinguished bear name
   */
  private generateName(elements: any): string {
    // Name components
    const prefixes = [
      "Sir", "Professor", "Dr.", "Baron", "Archduke", "Captain", "Ambassador", 
      "Viscount", "Chancellor", "Maestro", "The Honorable", "Monsieur", "Lord"
    ];
    
    const middleNames = [
      "Augustus", "Bartholomew", "Winston", "Theodore", "Reginald", "Humphrey", 
      "Ignatius", "Maximilian", "Cornelius", "Ferdinand", "Montgomery", "Percival"
    ];
    
    const surnames = [
      "von Bearington", "Bearington", "Grizzlesworth", "Ursula", "Bearnard", 
      "Pawsley", "Bearenstein", "von Fuzzwick", "Bearcourt", "Honeypaws", 
      "Ambrose", "Oakley", "Pemberton", "Fitzursa", "Bramblebrook"
    ];
    
    // Select random components
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const middle = middleNames[Math.floor(Math.random() * middleNames.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    
    // Profession-based naming adjustments
    if (elements.profession) {
      // Use profession-appropriate prefix
      if (elements.profession === "professor") {
        return `Professor ${middle} ${surname}`;
      } else if (elements.profession === "doctor") {
        return `Dr. ${middle} ${surname}`;
      } else if (elements.profession === "artist" || elements.profession === "composer") {
        return `Maestro ${middle} ${surname}`;
      }
    }
    
    // Regular full name
    return `${prefix} ${middle} ${surname}`;
  }
  
  /**
   * Generate a title based on character elements
   */
  private generateTitle(elements: any): string {
    // Title patterns
    const patterns = [
      "The %ADJECTIVE% %PROFESSION%",
      "The %PROFESSION% of %DOMAIN%",
      "The %ADJECTIVE% %DOMAIN% %SPECIALIST%",
      "Keeper of the %DOMAIN% %ARTIFACT%",
      "Master of %DOMAIN% %ARTIFACT%"
    ];
    
    // Get random pattern
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Generate components
    const adjectives = elements.attributes.length > 0 
      ? elements.attributes 
      : ["Distinguished", "Contemplative", "Philosophical"];
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    const professions = elements.profession 
      ? [elements.profession.charAt(0).toUpperCase() + elements.profession.slice(1)] 
      : ["Philosopher", "Scholar", "Dignitary", "Thinker"];
    
    const profession = professions[Math.floor(Math.random() * professions.length)];
    
    const domains = ["Surrealist", "Philosophical", "Metaphysical", "Conceptual", "Artistic"];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    const specialists = ["Specialist", "Expert", "Authority", "Virtuoso"];
    const specialist = specialists[Math.floor(Math.random() * specialists.length)];
    
    const artifacts = elements.accessories?.length > 0 
      ? elements.accessories[0].replace(/a |an |the /i, '') 
      : ["Pipe", "Hat", "Bowler", "Apple", "Reflection"].join();
    
    // Replace placeholders
    return pattern
      .replace("%ADJECTIVE%", adjective)
      .replace("%PROFESSION%", profession)
      .replace("%DOMAIN%", domain)
      .replace("%SPECIALIST%", specialist)
      .replace("%ARTIFACT%", artifacts);
  }
  
  /**
   * Generate a nickname based on character elements
   */
  private generateNickname(elements: any, title: string): string {
    // 50% chance to not have a nickname
    if (Math.random() < 0.5) {
      return "";
    }
    
    // Nickname patterns
    const patterns = [
      "The %ADJECTIVE% One",
      "The %DOMAIN% Bear",
      "%PROFESSION% Extraordinaire",
      "The %ARTIFACT% Bearer",
      "%ADJECTIVE% Bear"
    ];
    
    // Get random pattern
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Generate components
    const adjectives = elements.attributes.length > 0 
      ? elements.attributes 
      : ["Distinguished", "Contemplative", "Philosophical"];
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    const professions = elements.profession 
      ? [elements.profession.charAt(0).toUpperCase() + elements.profession.slice(1)] 
      : ["Philosopher", "Scholar", "Dignitary", "Thinker"];
    
    const profession = professions[Math.floor(Math.random() * professions.length)];
    
    const domains = ["Surrealist", "Philosophical", "Metaphysical", "Conceptual", "Artistic"];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    const artifact = elements.accessories?.length > 0 
      ? elements.accessories[0].replace(/a |an |the /i, '') 
      : "Bowler";
    
    // Replace placeholders
    return pattern
      .replace("%ADJECTIVE%", adjective)
      .replace("%PROFESSION%", profession)
      .replace("%DOMAIN%", domain)
      .replace("%ARTIFACT%", artifact);
  }
  
  /**
   * Derive personality traits from character elements
   */
  private derivePersonality(elements: any): string[] {
    // Base traits for all distinguished bears
    const baseTraits = ["Dignified", "Refined"];
    
    // Add additional traits based on elements
    const traits = [...baseTraits];
    
    // Add traits based on attributes
    if (elements.attributes.includes("philosophical")) {
      traits.push("Philosophical");
      traits.push("Contemplative");
    }
    
    if (elements.attributes.includes("mysterious") || elements.attributes.includes("enigmatic")) {
      traits.push("Mysterious");
      traits.push("Enigmatic");
    }
    
    if (elements.attributes.includes("surreal") || elements.attributes.includes("paradoxical")) {
      traits.push("Unconventional");
      traits.push("Innovative");
    }
    
    // Add traits based on profession
    if (elements.profession === "professor" || elements.profession === "scholar") {
      traits.push("Scholarly");
      traits.push("Analytical");
    } else if (elements.profession === "artist" || elements.profession === "composer") {
      traits.push("Creative");
      traits.push("Expressive");
    } else if (elements.profession === "philosopher") {
      traits.push("Profound");
      traits.push("Reflective");
    }
    
    // Select 5 traits
    const selectedTraits: string[] = [];
    const availableTraits = [...new Set(traits)]; // Remove duplicates
    
    for (let i = 0; i < Math.min(5, availableTraits.length); i++) {
      const index = Math.floor(Math.random() * availableTraits.length);
      selectedTraits.push(availableTraits[index]);
      availableTraits.splice(index, 1);
    }
    
    // Ensure we have exactly 5 traits
    while (selectedTraits.length < 5) {
      const extras = ["Poised", "Cultured", "Sagacious", "Meticulous", "Observant"];
      for (const trait of extras) {
        if (!selectedTraits.includes(trait)) {
          selectedTraits.push(trait);
          if (selectedTraits.length >= 5) break;
        }
      }
    }
    
    return selectedTraits;
  }
  
  /**
   * Create a backstory based on character elements
   */
  private async createBackstory(elements: any, name: string, title: string): Promise<string> {
    try {
      // If we have AI service, generate a creative backstory
      if (this.aiService && typeof this.aiService.generateText === 'function') {
        // Create a prompt for the backstory
        const backstoryPrompt = `
        Create a short, philosophical backstory (3-4 sentences max) for a distinguished bear character with the following details:
        - Name: ${name}
        - Title: ${title}
        - Profession: ${elements.profession || "Distinguished dignitary"}
        - Accessories: ${elements.accessories?.join(', ') || "bowler hat"}
        - Clothing: ${elements.clothing || "formal attire"}
        - Characteristics: ${elements.attributes?.join(', ') || "distinguished, dignified"}
        
        The backstory should have the philosophical depth and paradoxical quality of René Magritte's surrealist paintings.
        Focus on the character's distinguished nature and intellectual pursuits.
        Must be exactly 3-4 sentences, concise and elegant.
        `;
        
        const backstory = await this.aiService.generateText(backstoryPrompt);
        if (backstory && backstory.length > 0) {
          return backstory;
        }
      }
      
      // If AI service is not available or fails, create a template-based backstory
      const firstName = name.split(' ')[1];
      
      // Templates for backstory
      const templates = [
        `Born into a distinguished family of intellectual bears, ${firstName} gained renown for ${elements.profession ? `expertise in ${elements.profession}` : "philosophical insights"}. ${firstName}'s work with ${elements.accessories ? elements.accessories[0] : "symbolic objects"} has challenged conventional perspectives on reality and representation. Now, as ${title.toLowerCase()}, ${firstName} continues to explore the boundaries between the tangible and the metaphysical through rigorous contemplation.`,
        
        `${firstName} rose to prominence through a series of ${elements.profession ? `groundbreaking contributions to ${elements.profession}` : "philosophical treatises"} that questioned the nature of reality. Always seen with ${elements.accessories ? elements.accessories[0] : "symbolic accessories"}, ${firstName} embodies the paradoxical relationship between appearance and essence. The distinguished bear's work continues to influence thinkers across multiple disciplines.`,
        
        `After years of contemplative study, ${firstName} developed a unique approach to ${elements.profession || "philosophical inquiry"} that merges rigorous analysis with surrealist perspectives. Recognizable by ${elements.accessories ? elements.accessories[0] : "a distinctive bowler hat"}, ${firstName} challenges observers to reconsider the boundaries of perception. ${firstName}'s treatises on representation and reality have earned both acclaim and puzzlement from fellow scholars.`
      ];
      
      // Select a random template
      return templates[Math.floor(Math.random() * templates.length)];
    } catch (error) {
      // Fallback backstory
      return `A distinguished bear of profound intellect and philosophical insight. Known for contemplative exploration of metaphysical concepts and a keen eye for surrealist juxtaposition.`;
    }
  }
} 