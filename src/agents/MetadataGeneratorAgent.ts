/**
 * Metadata Generator Agent
 * Responsible for generating comprehensive metadata for artwork
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, MetadataGeneratorAgent as IMetadataGeneratorAgent, MessageDirection, CharacterIdentity } from './types';
import { AgentLogger, LogLevel } from '../utils/agentLogger';
import { AIService } from '../services/ai/index';
import { MagritteMetadataGenerator } from '../services/style/MagritteMetadataGenerator';

/**
 * Metadata Generator Agent implementation
 */
export class MetadataGeneratorAgent implements IMetadataGeneratorAgent {
  id: string;
  role: AgentRole.METADATA_GENERATOR;
  status: AgentStatus;
  
  private aiService: AIService;
  private messages: AgentMessage[];
  private magritteMetadataGenerator: MagritteMetadataGenerator;
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.role = AgentRole.METADATA_GENERATOR;
    this.status = AgentStatus.IDLE;
    this.aiService = aiService;
    this.messages = [];
    this.magritteMetadataGenerator = new MagritteMetadataGenerator();
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Metadata Generator agent created');
  }
  
  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    AgentLogger.logAgentAction(this, 'Initialize', 'Metadata Generator agent initialized');
  }

  /**
   * Generate metadata for a result
   */
  async generateMetadata(result: any, character: CharacterIdentity): Promise<Record<string, any>> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Generate Metadata', 'Generating comprehensive metadata');
    
    try {
      // Extract information
      const prompt = result.prompt || '';
      const style = result.style || 'magritte';
      const imageUrl = result.imageUrl || '';
      const artDirection = result.artDirection || {};
      
      // Create base metadata structure
      const baseMetadata = {
        name: character?.name || 'Untitled Artwork',
        description: character?.backstory || `A ${style} style artwork`,
        created: new Date().toISOString(),
        prompt,
        imageUrl,
        style,
        characterInfo: character || null
      };
      
      // For Magritte style, add specialized metadata
      if (style.toLowerCase().includes('magritte') || prompt.toLowerCase().includes('magritte')) {
        const magritteMetadata = this.magritteMetadataGenerator.generateMagritteMetadata(prompt, artDirection);
        
        // Merge with base metadata
        const enhancedMetadata = {
          ...baseMetadata,
          style: {
            primary: 'Surrealism',
            specific: 'René Magritte',
            elements: magritteMetadata.visualElements,
            paradox: magritteMetadata.paradox,
            technicalExecution: magritteMetadata.technicalExecution,
            philosophicalConcept: magritteMetadata.philosophicalConcept,
            composition: magritteMetadata.compositionStyle
          },
          nftAttributes: this.generateNFTAttributes(character, magritteMetadata)
        };
        
        this.status = AgentStatus.SUCCESS;
        return enhancedMetadata;
      }
      
      // If we have AI service, use it to generate rich metadata
      if (this.aiService) {
        const aiPrompt = `
        Generate comprehensive metadata for this artwork:
        
        Prompt: "${prompt}"
        Style: ${style}
        ${character ? `Character: ${character.name}, ${character.title}` : ''}
        ${character?.backstory ? `Character Backstory: ${character.backstory}` : ''}
        
        Create structured metadata with these sections:
        1. Visual Elements (key visual components)
        2. Technical Aspects (artistic techniques)
        3. Thematic Elements (concepts and themes)
        4. Emotional Impact (intended emotional response)
        5. NFT Attributes (traits for NFT platforms)
        
        Format your response as JSON.
        `;
        
        const response = await this.aiService.getCompletion({
          messages: [
            { role: 'system', content: 'You are an expert metadata curator for digital art and NFTs, specializing in creating rich, descriptive, and structured metadata.' },
            { role: 'user', content: aiPrompt }
          ],
          temperature: 0.4
        });
        
        // Try to parse the AI response
        try {
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const aiMetadata = JSON.parse(jsonMatch[0]);
            
            // Merge with base metadata
            const enhancedMetadata = {
              ...baseMetadata,
              ...aiMetadata,
              nftAttributes: this.generateNFTAttributes(character, aiMetadata)
            };
            
            this.status = AgentStatus.SUCCESS;
            return enhancedMetadata;
          }
        } catch (parseError) {
          AgentLogger.logAgentAction(this, 'Parse Error', `Failed to parse AI metadata: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
          // Continue with basic metadata
        }
      }
      
      // Basic metadata if AI failed or not available
      const basicMetadata = {
        ...baseMetadata,
        visualElements: this.extractVisualElements(prompt),
        technicalAspects: this.extractTechnicalAspects(prompt, style),
        thematicElements: character?.personality || ['Distinguished', 'Surreal'],
        nftAttributes: this.generateNFTAttributes(character)
      };
      
      this.status = AgentStatus.SUCCESS;
      return basicMetadata;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Metadata Error', `Error: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return minimal metadata
      return {
        name: character?.name || 'Untitled Artwork',
        description: character?.backstory || 'An artwork in Magritte style',
        created: new Date().toISOString()
      };
    }
  }
  
  /**
   * Generate NFT-compatible attributes
   */
  private generateNFTAttributes(character?: CharacterIdentity, additionalMetadata?: any): Array<{trait_type: string; value: string}> {
    const attributes = [];
    
    // Add character traits if available
    if (character) {
      // Add title
      if (character.title) {
        attributes.push({
          trait_type: 'Title',
          value: character.title
        });
      }
      
      // Add personality traits
      if (character.personality && character.personality.length > 0) {
        character.personality.forEach(trait => {
          attributes.push({
            trait_type: 'Personality',
            value: trait
          });
        });
      }
      
      // Add occupation
      if (character.occupation) {
        attributes.push({
          trait_type: 'Occupation',
          value: character.occupation
        });
      }
      
      // Add special items
      if (character.specialItems && character.specialItems.length > 0) {
        character.specialItems.forEach(item => {
          attributes.push({
            trait_type: 'Special Item',
            value: item
          });
        });
      }
    }
    
    // Add additional metadata traits if available
    if (additionalMetadata) {
      // Add visual elements
      if (additionalMetadata.visualElements && Array.isArray(additionalMetadata.visualElements)) {
        additionalMetadata.visualElements.slice(0, 3).forEach((element: string) => {
          attributes.push({
            trait_type: 'Visual Element',
            value: element
          });
        });
      }
      
      // Add technical execution
      if (additionalMetadata.technicalExecution) {
        attributes.push({
          trait_type: 'Technique',
          value: typeof additionalMetadata.technicalExecution === 'string' 
            ? additionalMetadata.technicalExecution 
            : Array.isArray(additionalMetadata.technicalExecution) 
              ? additionalMetadata.technicalExecution[0] 
              : 'Oil Painting Technique'
        });
      }
      
      // Add philosophical concept
      if (additionalMetadata.philosophicalConcept) {
        attributes.push({
          trait_type: 'Concept',
          value: typeof additionalMetadata.philosophicalConcept === 'string' 
            ? additionalMetadata.philosophicalConcept 
            : Array.isArray(additionalMetadata.philosophicalConcept) 
              ? additionalMetadata.philosophicalConcept[0] 
              : 'Surrealist Philosophy'
        });
      }
    }
    
    // Add default style attributes if none present
    if (!attributes.some(attr => attr.trait_type === 'Style')) {
      attributes.push({
        trait_type: 'Style',
        value: 'René Magritte Surrealism'
      });
    }
    
    return attributes;
  }
  
  /**
   * Extract visual elements from a prompt
   */
  private extractVisualElements(prompt: string): string[] {
    const elements = [];
    
    // Common visual elements to look for
    const visualKeywords = [
      'bowler hat', 'hat', 'apple', 'pipe', 'bird', 'suit', 
      'window', 'mirror', 'clouds', 'sky', 'portrait', 'bear'
    ];
    
    // Check for each element
    visualKeywords.forEach(keyword => {
      if (prompt.toLowerCase().includes(keyword.toLowerCase())) {
        elements.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });
    
    // If no elements found, add defaults
    if (elements.length === 0) {
      elements.push('Surreal Elements', 'Distinguished Portrait');
    }
    
    return elements;
  }
  
  /**
   * Extract technical aspects from a prompt and style
   */
  private extractTechnicalAspects(prompt: string, style: string): string[] {
    const aspects = [];
    
    // Magritte-specific technical aspects
    if (style.toLowerCase().includes('magritte')) {
      aspects.push('Smooth Surface Quality', 'Precise Edge Definition');
      
      // Additional aspects based on prompt content
      if (prompt.toLowerCase().includes('light') || prompt.toLowerCase().includes('lighting')) {
        aspects.push('Controlled Lighting');
      }
      
      if (prompt.toLowerCase().includes('detail') || prompt.toLowerCase().includes('detailed')) {
        aspects.push('Meticulous Detail');
      }
      
      if (prompt.toLowerCase().includes('composition')) {
        aspects.push('Balanced Composition');
      }
    } else {
      // Generic technical aspects
      aspects.push('Digital Rendering', 'AI Generated');
    }
    
    return aspects;
  }
  
  /**
   * Process a context
   */
  async process(context: AgentContext): Promise<AgentResult> {
    this.status = AgentStatus.BUSY;
    
    try {
      // Check what task we need to perform
      const task = context.task?.action || 'generate_metadata';
      
      if (task === 'generate_metadata') {
        // Extract what we need
        const result = context.previousResults || context;
        const character = context.character;
        
        // Generate metadata
        const metadata = await this.generateMetadata(result, character);
        
        // Create a result message
        const resultMessage: AgentMessage = {
          id: uuidv4(),
          timestamp: new Date(),
          from: this.role,
          to: AgentRole.DIRECTOR,
          direction: MessageDirection.OUTGOING,
          type: 'result',
          content: { metadata }
        };
        
        // Log the message and add it to our list
        AgentLogger.logAgentMessage(resultMessage);
        this.messages.push(resultMessage);
        
        // Return success
        this.status = AgentStatus.SUCCESS;
        return {
          success: true,
          output: { metadata },
          messages: [resultMessage]
        };
      }
      
      // If we don't know the task, return an error
      throw new Error(`Unknown task: ${task}`);
    } catch (error) {
      this.status = AgentStatus.ERROR;
      
      // Create an error message
      const errorMessage: AgentMessage = {
        id: uuidv4(),
        timestamp: new Date(),
        from: this.role,
        to: AgentRole.DIRECTOR,
        direction: MessageDirection.OUTGOING,
        type: 'error',
        content: { error: error instanceof Error ? error.message : String(error) }
      };
      
      // Log the message and add it to our list
      AgentLogger.logAgentMessage(errorMessage);
      this.messages.push(errorMessage);
      
      // Return error
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        messages: [errorMessage]
      };
    }
  }
  
  /**
   * Handle a message from another agent
   */
  async handleMessage(message: AgentMessage): Promise<void> {
    // Add the message to our list
    this.messages.push(message);
    
    // Log the message
    AgentLogger.logAgentMessage(message);
  }
} 