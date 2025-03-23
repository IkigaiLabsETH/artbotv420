/**
 * Character Generator
 * Creates rich character identities based on concepts
 */

import { CharacterIdentity } from '../agents/types';
import { AIService } from '../services/ai/index';

export interface CharacterPromptElements {
  accessories: string[];
  clothing: string;
  profession: string;
  attributes: string[];
  style: string;
}

/**
 * Character Generator class
 * Responsible for generating rich character identities for NFT metadata
 */
export class CharacterGenerator {
  private aiService: AIService;

  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  /**
   * Generate a character from a concept
   */
  async generateCharacter(concept: string): Promise<CharacterIdentity> {
    // Extract elements from concept
    const elements = await this.analyzePrompt(concept);
    
    // Generate character components
    const name = await this.generateName(elements);
    const title = await this.generateTitle(elements);
    const personality = await this.derivePersonality(elements);
    const backstory = await this.createBackstory(elements);
    
    return {
      name,
      title,
      personality,
      backstory
    };
  }

  /**
   * Analyze a prompt to extract character elements
   */
  private async analyzePrompt(concept: string): Promise<CharacterPromptElements> {
    const prompt = `
    Analyze the following concept description and extract key elements for a character portrait:
    "${concept}"
    
    Please identify:
    1. Professional accessories (tools, equipment, instruments)
    2. Clothing/attire description
    3. Professional role or occupation
    4. Personal attributes or characteristics
    5. Artistic style or aesthetic
    
    Return the results in JSON format with these keys: accessories (array), clothing (string), profession (string), attributes (array), style (string)
    `;

    try {
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are a helpful assistant that analyzes art concepts and extracts character elements.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      });

      // Parse the JSON response
      const parsed = JSON.parse(response.content);
      
      return {
        accessories: Array.isArray(parsed.accessories) ? parsed.accessories : [],
        clothing: typeof parsed.clothing === 'string' ? parsed.clothing : '',
        profession: typeof parsed.profession === 'string' ? parsed.profession : '',
        attributes: Array.isArray(parsed.attributes) ? parsed.attributes : [],
        style: typeof parsed.style === 'string' ? parsed.style : '',
      };
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      // Return default elements if analysis fails
      return {
        accessories: [],
        clothing: concept.includes('wearing') ? concept.split('wearing')[1]?.split(',')[0]?.trim() || '' : '',
        profession: '',
        attributes: ['distinguished', 'noble', 'dignified'],
        style: 'Magritte surrealist'
      };
    }
  }

  /**
   * Generate a character name
   */
  private async generateName(elements: CharacterPromptElements): Promise<string> {
    const prompt = `
    Create a distinguished name for a bear character with these characteristics:
    - Profession: ${elements.profession || 'Unknown profession'}
    - Wearing: ${elements.clothing}
    - Accessories: ${elements.accessories.join(', ')}
    - Attributes: ${elements.attributes.join(', ')}
    
    The name should have:
    1. A proper first name (dignified and sophisticated)
    2. An optional middle name or initial
    3. A proper last name (possibly with a pun related to bears or their profession)
    4. Optional title or suffix (if appropriate)
    
    Return ONLY the name, without explanation.
    `;

    try {
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are a character naming specialist who creates dignified names for bear portraits.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        maxTokens: 40
      });

      // Clean up the response
      return response.content.trim().replace(/^"(.*)"$/, '$1');
    } catch (error) {
      console.error('Error generating name:', error);
      // Generate a fallback name
      const professionWord = elements.profession ? elements.profession.split(' ')[0] : '';
      return `Professor ${professionWord || 'Bearington'} III`;
    }
  }

  /**
   * Generate a character title
   */
  private async generateTitle(elements: CharacterPromptElements): Promise<string> {
    const prompt = `
    Create a distinguished title for a bear character with these characteristics:
    - Profession: ${elements.profession || 'Unknown profession'}
    - Wearing: ${elements.clothing}
    - Accessories: ${elements.accessories.join(', ')}
    - Attributes: ${elements.attributes.join(', ')}
    
    The title should be in the format "The [Adjective] [Profession]" and reflect the character's role or specialty.
    Examples: "The Botanical Explorer", "The Distinguished Archivist", "The Seafaring Cartographer"
    
    Return ONLY the title, without explanation.
    `;

    try {
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are a character title specialist who creates dignified titles for bear portraits.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        maxTokens: 20
      });

      // Clean up the response
      return response.content.trim().replace(/^"(.*)"$/, '$1');
    } catch (error) {
      console.error('Error generating title:', error);
      // Generate a fallback title
      const attribute = elements.attributes[0] || 'Distinguished';
      const profession = elements.profession || 'Bear';
      return `The ${attribute.charAt(0).toUpperCase() + attribute.slice(1)} ${profession.charAt(0).toUpperCase() + profession.slice(1)}`;
    }
  }

  /**
   * Derive personality traits
   */
  private async derivePersonality(elements: CharacterPromptElements): Promise<string[]> {
    const prompt = `
    Derive 4-5 personality traits for a bear character with these characteristics:
    - Profession: ${elements.profession || 'Unknown profession'}
    - Wearing: ${elements.clothing}
    - Accessories: ${elements.accessories.join(', ')}
    - Attributes: ${elements.attributes.join(', ')}
    
    The traits should be distinguished, sophisticated qualities that reflect the character's professional role and appearance.
    Examples: "Meticulous", "Contemplative", "Erudite", "Patient", "Perceptive"
    
    Return the traits as a simple JSON array of strings like: ["Trait1", "Trait2", "Trait3", "Trait4"]
    `;

    try {
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are a character trait specialist who creates personality profiles for bear portraits. Return responses as plain JSON arrays without markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6
      });

      // Extract JSON from the response, handling potential markdown code blocks
      let jsonContent = response.content.trim();
      
      // Check if the response is wrapped in markdown code blocks
      const jsonRegex = /```(?:json)?\s*(\[[\s\S]*?\])\s*```/;
      const match = jsonContent.match(jsonRegex);
      
      if (match && match[1]) {
        // Extract the JSON part from the code block
        jsonContent = match[1];
      } else {
        // Try to find array brackets if not in code block
        const arrayMatch = jsonContent.match(/\[([\s\S]*?)\]/);
        if (arrayMatch && arrayMatch[0]) {
          jsonContent = arrayMatch[0];
        }
      }
      
      // Parse the extracted JSON
      const traits = JSON.parse(jsonContent);
      
      if (Array.isArray(traits)) {
        return traits.slice(0, 5);
      } else if (traits && typeof traits === 'object' && Array.isArray(traits.traits)) {
        return traits.traits.slice(0, 5);
      }
      
      throw new Error('Invalid trait format');
    } catch (error) {
      console.error('Error deriving personality:', error);
      // Return default traits
      return ['Distinguished', 'Dignified', 'Contemplative', 'Precise'];
    }
  }

  /**
   * Create a backstory for the character
   */
  private async createBackstory(elements: CharacterPromptElements): Promise<string> {
    const prompt = `
    Create a brief, sophisticated backstory for a bear character with these characteristics:
    - Profession: ${elements.profession || 'Unknown profession'}
    - Wearing: ${elements.clothing}
    - Accessories: ${elements.accessories.join(', ')}
    - Attributes: ${elements.attributes.join(', ')}
    
    The backstory should:
    1. Be 2-3 sentences only
    2. Explain how they came to their profession
    3. Mention a notable achievement
    4. Tie in their distinctive style or appearance
    5. Have a slightly surrealist or philosophical quality (Magritte-inspired)
    
    Return ONLY the backstory text, without introduction or explanation.
    `;

    try {
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are a literary character writer who creates sophisticated backstories for surrealist bear portraits.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        maxTokens: 150
      });

      // Clean up the response
      return response.content.trim().replace(/^"(.*)"$/, '$1');
    } catch (error) {
      console.error('Error creating backstory:', error);
      // Generate a fallback backstory
      const profession = elements.profession || 'distinguished bear';
      return `Born into a family of noble bears, this ${profession} discovered their calling during a particularly vivid dream of floating objects and impossible spaces. Now they dedicate their time to perfecting their craft, while occasionally contemplating the true nature of reality.`;
    }
  }
} 