/**
 * Enhanced Character Generator
 * Creates rich character identities based on concepts with Magritte-style theming
 */

import { v4 as uuidv4 } from 'uuid';
import { CharacterIdentity } from '../agents/types';
import { AIService } from '../services/ai/index';
import { AgentLogger } from '../utils/agentLogger';
import { 
  CategoryDefinition, 
  SeriesType, 
  getRandomCategory, 
  getCategoryById, 
  getRandomCategoryFromSeries 
} from '../config/characterCategoriesConfig';

/**
 * Character generation options
 */
export interface CharacterGenerationOptions {
  categoryId?: string;     // Specific category to use
  seriesType?: SeriesType; // Specific series to pick from
  allowAiEnhancement?: boolean; // Whether to use AI to enhance the character
  randomizationLevel?: number; // 0-1 how much randomization to apply
}

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
  async generateCharacter(concept: string, prompt: string, options?: CharacterGenerationOptions): Promise<CharacterIdentity> {
    try {
      // Select a category based on options or extract from the concept
      const category = await this.selectCategory(concept, options);
      
      // Extract elements from the prompt
      const elements = await this.extractElements(concept, prompt, category);
      
      // Generate the character components
      const name = this.generateName(elements, category);
      const title = this.generateTitle(elements, category);
      const personality = this.derivePersonality(elements, category);
      const backstory = await this.createBackstory(elements, name, title, category);
      const nickname = this.generateNickname(elements, title, category);
      
      // Generate specialized items based on category
      const occupation = this.deriveOccupation(category);
      const specialItems = this.selectSpecialItems(category);
      
      // Log the character creation
      AgentLogger.log(`Generated character: ${name}, ${title} (${category?.name || 'Custom category'})`);
      
      // Create rich character identity 
      const character: CharacterIdentity = {
        name,
        title,
        nickname,
        personality,
        backstory,
        occupation,
        specialItems,
        traits: {
          category: category?.id || 'custom',
          series: category?.series || 'general',
          attire: elements.clothing,
          accessories: elements.accessories
        }
      };
      
      // Enhance with AI if requested
      if (options?.allowAiEnhancement && this.aiService) {
        return await this.enhanceCharacterWithAI(character, concept);
      }
      
      return character;
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
   * Select a category based on options or concept content
   */
  private async selectCategory(concept: string, options?: CharacterGenerationOptions): Promise<CategoryDefinition | undefined> {
    // Define allowed series
    const allowedSeries = [SeriesType.ADVENTURE, SeriesType.ARTISTIC, SeriesType.HIPSTER];
    
    // If a specific category is requested, check if it's from allowed series
    if (options?.categoryId) {
      const category = getCategoryById(options.categoryId);
      if (category && allowedSeries.includes(category.series as SeriesType)) {
        return category;
      }
    }
    
    // If a series is specified, check if it's allowed
    if (options?.seriesType) {
      if (allowedSeries.includes(options.seriesType)) {
        return getRandomCategoryFromSeries(options.seriesType);
      } else {
        // If requested series isn't allowed, use a random allowed series instead
        const randomAllowedSeries = allowedSeries[Math.floor(Math.random() * allowedSeries.length)];
        return getRandomCategoryFromSeries(randomAllowedSeries);
      }
    }
    
    // Try to extract category from concept
    if (concept.includes('pfp_')) {
      const categoryMatches = concept.match(/bear_pfp_([a-z_]+)/i);
      if (categoryMatches && categoryMatches[1]) {
        const categoryId = `bear_pfp_${categoryMatches[1].toLowerCase()}`;
        const category = getCategoryById(categoryId);
        if (category && allowedSeries.includes(category.series as SeriesType)) {
          return category;
        }
      }
    }
    
    // Try to detect series or category based on keywords in the concept
    const conceptLower = concept.toLowerCase();
    
    // Check for series keywords - but only for allowed series
    const seriesKeywords: Record<SeriesType, string[]> = {
      [SeriesType.ADVENTURE]: ['pilot', 'explorer', 'adventure', 'journey', 'expedition', 'sailor', 'mountaineer', 'climber', 'diver'],
      [SeriesType.ARTISTIC]: ['artist', 'painter', 'sculptor', 'creative', 'artistic', 'designer', 'composer', 'musician'],
      [SeriesType.HIPSTER]: ['barista', 'artisanal', 'craft', 'vintage', 'coffee', 'vinyl', 'organic', 'sustainable'],
      [SeriesType.BLOCKCHAIN]: [], // Empty array since we don't want to match this series
      [SeriesType.SUSTAINABLE]: [] // Empty array since we don't want to match this series
    };
    
    // Check for series matches in allowed series
    for (const [series, keywords] of Object.entries(seriesKeywords)) {
      for (const keyword of keywords) {
        if (conceptLower.includes(keyword)) {
          return getRandomCategoryFromSeries(series as SeriesType);
        }
      }
    }
    
    // If no specific category or series was found, return a random category from allowed series
    const randomAllowedSeries = allowedSeries[Math.floor(Math.random() * allowedSeries.length)];
    return getRandomCategoryFromSeries(randomAllowedSeries);
  }
  
  /**
   * Extract character elements from concept and prompt with category guidance
   */
  private async extractElements(concept: string, prompt: string, category?: CategoryDefinition): Promise<any> {
    // Start with default elements
    const elements: any = {
      accessories: ["bowler hat"],
      clothing: "artistic attire",
      profession: null,
      attributes: ["distinguished", "dignified"],
      style: "magritte",
      setting: null,
      activity: null
    };
    
    // Apply category defaults if available
    if (category) {
      // Choose random items from each category list
      if (category.accessories.length > 0) {
        elements.accessories = [
          category.accessories[Math.floor(Math.random() * category.accessories.length)]
        ];
      }
      
      if (category.headwear.length > 0) {
        elements.accessories.push(
          category.headwear[Math.floor(Math.random() * category.headwear.length)]
        );
      }
      
      if (category.clothing.length > 0) {
        // Filter out any clothing with "suit" in the name
        const allowedClothing = category.clothing.filter(clothing => 
          !clothing.toLowerCase().includes('suit')
        );
        
        // Only proceed if we have clothing options after filtering
        if (allowedClothing.length > 0) {
          elements.clothing = allowedClothing[Math.floor(Math.random() * allowedClothing.length)];
        } else {
          // If no suitable clothing remains, use a default from the allowed series
          elements.clothing = "distinctive artistic attire";
        }
      }
      
      if (category.tools.length > 0) {
        elements.tools = [
          category.tools[Math.floor(Math.random() * category.tools.length)]
        ];
      }
      
      // Set profession based on category
      elements.profession = this.deriveOccupation(category);
      
      // Add personality traits from category
      if (category.personalityTraits.length > 0) {
        elements.attributes = [...new Set([
          ...elements.attributes,
          category.personalityTraits[Math.floor(Math.random() * category.personalityTraits.length)]
        ])];
      }
    }
    
    // Extract accessories from prompt
    const accessoryMatches = prompt.match(/with ([^,.]+)|holding ([^,.]+)|carries ([^,.]+)/ig);
    if (accessoryMatches) {
      elements.accessories = [
        ...elements.accessories,
        ...accessoryMatches.map((match: string) => {
          return match.replace(/with |holding |carries /ig, '').trim();
        })
      ];
      
      // Remove duplicates
      elements.accessories = [...new Set(elements.accessories)];
    }
    
    // Extract clothing from prompt
    const clothingMatch = prompt.match(/wearing ([^,.]+)/i);
    if (clothingMatch && clothingMatch[1]) {
      const extractedClothing = clothingMatch[1].trim();
      // Don't allow clothing with "suit" in the name
      if (!extractedClothing.toLowerCase().includes('suit')) {
        elements.clothing = extractedClothing;
      }
    }
    
    // Extract attributes from common dignified attributes
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
   * Generate a distinguished bear name using the category for influence
   */
  private generateName(elements: any, category?: CategoryDefinition): string {
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
    
    // Series-based name adjustments
    if (category) {
      // Use series-appropriate prefix
      switch (category.series) {
        case SeriesType.ADVENTURE:
          return `Captain ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
          
        case SeriesType.ARTISTIC:
          return `Maestro ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
          
        case SeriesType.HIPSTER:
          return `Monsieur ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
          
        // Other series will use the default name generation below
      }
    }
    
    // Profession-based naming adjustments
    if (elements.profession) {
      // Use profession-appropriate prefix
      if (elements.profession === "professor") {
        return `Professor ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
      } else if (elements.profession === "doctor") {
        return `Dr. ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
      } else if (elements.profession === "artist" || elements.profession === "composer") {
        return `Maestro ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
      }
    }
    
    // Regular full name
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const middle = middleNames[Math.floor(Math.random() * middleNames.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    
    return `${prefix} ${middle} ${surname}`;
  }
  
  /**
   * Generate a title based on character elements and category
   */
  private generateTitle(elements: any, category?: CategoryDefinition): string {
    // Title patterns
    const patterns = [
      "The %ADJECTIVE% %PROFESSION%",
      "The %PROFESSION% of %DOMAIN%",
      "The %ADJECTIVE% %DOMAIN% %SPECIALIST%",
      "Keeper of the %DOMAIN% %ARTIFACT%",
      "Master of %DOMAIN% %ARTIFACT%",
      "The Distinguished %PROFESSION%",
      "%DOMAIN% %SPECIALIST% Extraordinaire"
    ];
    
    // Get random pattern
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Category-based adjectives and domains
    let adjectives = elements.attributes.length > 0 
      ? elements.attributes 
      : ["Distinguished", "Contemplative", "Philosophical"];
    
    let domains = ["Surrealist", "Philosophical", "Metaphysical", "Conceptual", "Artistic"];
    
    // Customize based on category if available
    if (category) {
      // Use personality traits from category
      if (category.personalityTraits.length > 0) {
        adjectives = [...adjectives, ...category.personalityTraits];
      }
      
      // Customize domains based on series
      switch (category.series) {
        case SeriesType.ADVENTURE:
          domains = ["Expeditionary", "Exploratory", "Voyaging", "Pioneering", "Frontier"];
          break;
        case SeriesType.ARTISTIC:
          domains = ["Creative", "Artistic", "Expressive", "Aesthetic", "Visionary"];
          break;
        case SeriesType.HIPSTER:
          domains = ["Barista", "Artisanal", "Craft", "Vintage", "Coffee", "Vinyl", "Organic", "Sustainable"];
          break;
        // Default domains remain as ["Surrealist", "Philosophical", "Metaphysical", "Conceptual", "Artistic"]
      }
    }
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    const professions = elements.profession 
      ? [elements.profession.charAt(0).toUpperCase() + elements.profession.slice(1)] 
      : ["Philosopher", "Scholar", "Dignitary", "Thinker"];
      
    // Add profession from category if available
    if (category) {
      const occupation = this.deriveOccupation(category);
      if (occupation && !professions.includes(occupation)) {
        professions.push(occupation);
      }
    }
    
    const profession = professions[Math.floor(Math.random() * professions.length)];
    
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
   * Generate a nickname based on character elements and category
   */
  private generateNickname(elements: any, title: string, category?: CategoryDefinition): string {
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
    
    let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    let professions = elements.profession 
      ? [elements.profession.charAt(0).toUpperCase() + elements.profession.slice(1)] 
      : ["Philosopher", "Scholar", "Dignitary", "Thinker"];
    
    // Add category-based profession
    if (category) {
      const occupation = this.deriveOccupation(category);
      if (occupation && !professions.includes(occupation)) {
        professions.push(occupation);
      }
    }
    
    let profession = professions[Math.floor(Math.random() * professions.length)];
    
    // Get domains based on category
    let domains = ["Surrealist", "Philosophical", "Metaphysical", "Conceptual", "Artistic"];
    
    if (category) {
      // Customize domains based on series
      switch (category.series) {
        case SeriesType.ADVENTURE:
          domains = ["Adventurous", "Exploratory", "Voyaging", "Pioneering", "Intrepid"];
          break;
        case SeriesType.ARTISTIC:
          domains = ["Creative", "Artistic", "Expressive", "Visionary", "Inspired"];
          break;
        case SeriesType.HIPSTER:
          domains = ["Artisanal", "Vintage", "Organic", "Handcrafted", "Curated"];
          break;
      }
    }
    
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    // Get artifact based on category or elements
    let artifact = elements.accessories?.length > 0 
      ? elements.accessories[0].replace(/a |an |the /i, '') 
      : "Bowler";
      
    if (category?.tools.length) {
      artifact = category.tools[Math.floor(Math.random() * category.tools.length)];
    }
    
    // Replace placeholders
    return pattern
      .replace("%ADJECTIVE%", adjective)
      .replace("%PROFESSION%", profession)
      .replace("%DOMAIN%", domain)
      .replace("%ARTIFACT%", artifact);
  }
  
  /**
   * Derive personality traits based on elements and category
   */
  private derivePersonality(elements: any, category?: CategoryDefinition): string[] {
    // Get base personality traits
    const baseTraits = elements.attributes.length > 0 
      ? elements.attributes 
      : ["Distinguished", "Dignified", "Contemplative", "Precise", "Formal"];
    
    // Add category-specific traits if available
    if (category?.personalityTraits.length) {
      // Combine traits and remove duplicates
      return [...new Set([
        ...baseTraits,
        ...category.personalityTraits
      ])].slice(0, 5); // Limit to 5 traits
    }
    
    return baseTraits;
  }
  
  /**
   * Derive occupation from category
   */
  private deriveOccupation(category?: CategoryDefinition): string {
    if (!category) return '';
    
    // Convert category ID to occupation
    // Remove "bear_pfp_" prefix
    let occupation = category.id.replace('bear_pfp_', '');
    
    // Convert to title case
    occupation = occupation
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return occupation;
  }
  
  /**
   * Select special items based on the category
   */
  private selectSpecialItems(category?: CategoryDefinition): string[] {
    if (!category) return [];
    
    const items: string[] = [];
    
    // Add headwear
    if (category.headwear.length > 0) {
      items.push(category.headwear[Math.floor(Math.random() * category.headwear.length)]);
    }
    
    // Add accessories
    if (category.accessories.length > 0) {
      items.push(category.accessories[Math.floor(Math.random() * category.accessories.length)]);
    }
    
    // Add tools
    if (category.tools.length > 0) {
      items.push(category.tools[Math.floor(Math.random() * category.tools.length)]);
    }
    
    return items;
  }
  
  /**
   * Create a backstory for the character based on category
   */
  private async createBackstory(elements: any, name: string, title: string, category?: CategoryDefinition): Promise<string> {
    // If we don't have AI service, generate a simple backstory
    if (!this.aiService) {
      return this.generateSimpleBackstory(name, title, category);
    }
    
    try {
      // Create a rich backstory prompt
      const seriesDescription = category ? `from the ${category.series} series` : '';
      const categoryDescription = category ? `a ${category.name}` : '';
      
      let prompt = `
Create a brief, sophisticated backstory (2-3 sentences) for a character with these details:
- Name: ${name}
- Title: ${title}
- Profession: ${elements.profession || this.deriveOccupation(category) || 'Unknown'}
- Wearing: ${elements.clothing || 'artistic attire'}
- Accessories: ${elements.accessories?.join(', ') || 'various distinguished items'}
- Personality traits: ${elements.attributes?.join(', ') || 'distinguished, dignified'}
${category ? `- Category: ${categoryDescription} ${seriesDescription}` : ''}

Make the backstory sophisticated, dignified, and slightly mysterious, fitting for a distinguished bear portrait in René Magritte's surrealist style. 
Limit to 2-3 concise sentences that capture the essence of the character.
`;

      // Generate the backstory
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are a character backstory specialist who creates sophisticated, concise backstories for distinguished bear portraits.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      });
      
      return response.content.trim();
    } catch (error) {
      // Fall back to simple backstory
      return this.generateSimpleBackstory(name, title, category);
    }
  }
  
  /**
   * Generate a simple backstory without AI
   */
  private generateSimpleBackstory(name: string, title: string, category?: CategoryDefinition): string {
    const beginnings = [
      "Born into a family of noble bears,",
      "After years of dedicated study,",
      "Distinguished among peers from an early age,",
      "Having traveled the world in pursuit of knowledge,",
      "Following a remarkable discovery,"
    ];
    
    const middles = [
      "dedicated a lifetime to perfecting the art of",
      "became renowned for contributions to",
      "established a prestigious reputation in",
      "mastered the subtle complexities of",
      "revolutionized traditional approaches to"
    ];
    
    const endings = [
      "now serves as an authority on the subject.",
      "is sought after for expert consultation.",
      "continues to inspire admirers across the globe.",
      "maintains a dignified presence in distinguished circles.",
      "contemplates the philosophical implications of the work."
    ];
    
    // Select random parts or use category-specific content
    let beginning = beginnings[Math.floor(Math.random() * beginnings.length)];
    let middle = middles[Math.floor(Math.random() * middles.length)];
    let ending = endings[Math.floor(Math.random() * endings.length)];
    
    // Customize based on category if available
    if (category) {
      switch (category.series) {
        case SeriesType.ADVENTURE:
          beginning = "After numerous expeditions to uncharted territories,";
          middle = `became celebrated for ${this.deriveOccupation(category).toLowerCase()} achievements in`;
          ending = "continues to seek new horizons with distinguished bearing.";
          break;
          
        case SeriesType.ARTISTIC:
          beginning = "Trained in the classical traditions of art,";
          middle = `developed a distinctive approach to ${this.deriveOccupation(category).toLowerCase()}`;
          ending = "is renowned for creating works of profound metaphysical significance.";
          break;
          
        case SeriesType.HIPSTER:
          beginning = "After years of dedicated study and practice,";
          middle = `became renowned for expertise in artisanal ${this.deriveOccupation(category).toLowerCase()}`;
          ending = "continues to inspire admirers with authentic and mindful creations.";
          break;
      }
    }
    
    // Combine the parts
    return `${beginning} ${name} ${middle} ${this.deriveOccupation(category)?.toLowerCase() || title.toLowerCase()} and ${ending}`;
  }
  
  /**
   * Enhance a character with AI assistance
   */
  private async enhanceCharacterWithAI(character: CharacterIdentity, concept: string): Promise<CharacterIdentity> {
    if (!this.aiService) {
      return character;
    }
    
    try {
      const prompt = `
Enhance this character for a Magritte-style bear portrait:
${JSON.stringify(character, null, 2)}

Original concept: "${concept}"

Please provide subtle refinements to make this character more intriguing and distinctive, while maintaining the sophisticated, formal Magritte style.
Return the enhanced character as valid JSON without any additional text or commentary.
      `;
      
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are a character enhancement specialist who refines character details for distinguished bear portraits in René Magritte\'s surrealist style.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5
      });
      
      try {
        // Attempt to parse the response as JSON
        const enhancedCharacter = JSON.parse(response.content);
        return {
          ...character,
          ...enhancedCharacter
        };
      } catch (e) {
        // If parsing fails, return the original character
        return character;
      }
    } catch (error) {
      // Return the original character on error
      return character;
    }
  }
} 