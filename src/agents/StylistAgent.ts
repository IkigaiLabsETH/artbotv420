/**
 * Stylist Agent
 * Responsible for applying artistic styles to prompts
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, StylistAgent as IStylistAgent, MessageDirection } from './types';
import { AgentLogger } from '../utils/agentLogger';
import { AIService } from '../services/ai/index';
import { StyleConfig, defaultGenerationConfig } from '../config/generationConfig';

/**
 * Stylist Agent implementation
 */
export class StylistAgent implements IStylistAgent {
  id: string;
  role: AgentRole.STYLIST;
  status: AgentStatus;
  
  private aiService: AIService;
  private messages: AgentMessage[];
  private styles: Record<string, StyleConfig>;
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.role = AgentRole.STYLIST;
    this.status = AgentStatus.IDLE;
    this.aiService = aiService;
    this.messages = [];
    this.styles = defaultGenerationConfig.styles;
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Stylist agent created');
  }
  
  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    AgentLogger.logAgentAction(this, 'Initialize', 'Stylist agent initialized');
  }

  /**
   * Apply a style to a prompt
   */
  async applyStyle(prompt: string, style: string): Promise<string> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Apply Style', `Applying style "${style}" to prompt`);
    
    try {
      // Get the style configuration
      const styleConfig = this.styles[style] || this.styles[defaultGenerationConfig.defaultStyle];
      
      if (!styleConfig) {
        throw new Error(`Style "${style}" not found and no default style available`);
      }
      
      // Use the style's prefix and suffix if available
      let styledPrompt = prompt;
      
      if (styleConfig.promptPrefix) {
        styledPrompt = `${styleConfig.promptPrefix}${styledPrompt}`;
      }
      
      if (styleConfig.promptSuffix) {
        styledPrompt = `${styledPrompt}${styleConfig.promptSuffix}`;
      }
      
      // For more sophisticated styling, use the AI service
      if (styleConfig.styleEmphasis && styleConfig.styleEmphasis.length > 0) {
        const aiPrompt = `
        Modify this image generation prompt to emphasize the style of ${styleConfig.name}:
        "${prompt}"
        
        Incorporate these style elements:
        ${styleConfig.styleEmphasis.slice(0, 5).map(element => `- ${element}`).join('\n')}
        
        ${styleConfig.colorPalette && styleConfig.colorPalette.length > 0 ? 
          `Use this color palette:\n${styleConfig.colorPalette.slice(0, 5).map(color => `- ${color}`).join('\n')}` : ''}
        
        ${styleConfig.compositionGuidelines && styleConfig.compositionGuidelines.length > 0 ? 
          `Follow these composition guidelines:\n${styleConfig.compositionGuidelines.slice(0, 3).map(guideline => `- ${guideline}`).join('\n')}` : ''}
        
        Return ONLY the modified prompt, without explanation or meta-commentary.
        `;
        
        const response = await this.aiService.getCompletion({
          messages: [
            { role: 'system', content: `You are an art director specialized in the ${styleConfig.name} style. Your task is to modify prompts to emphasize this distinctive style.` },
            { role: 'user', content: aiPrompt }
          ],
          temperature: 0.4
        });
        
        styledPrompt = response.content.trim();
      }
      
      this.status = AgentStatus.SUCCESS;
      AgentLogger.logAgentAction(this, 'Style Applied', `Applied style "${style}": ${styledPrompt.substring(0, 100)}...`);
      
      return styledPrompt;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Error', `Error applying style: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return the original prompt as fallback
      return prompt;
    }
  }
  
  /**
   * Suggest style enhancements for a prompt
   */
  async suggestStyleEnhancements(prompt: string, style: string): Promise<Record<string, any>> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Suggest Enhancements', `Suggesting style enhancements for "${style}" style`);
    
    try {
      // Get the style configuration
      const styleConfig = this.styles[style] || this.styles[defaultGenerationConfig.defaultStyle];
      
      if (!styleConfig) {
        throw new Error(`Style "${style}" not found and no default style available`);
      }
      
      const aiPrompt = `
      Analyze this image generation prompt and suggest specific enhancements to better fit the ${styleConfig.name} style:
      "${prompt}"
      
      Provide suggestions for:
      1. Visual elements to add or emphasize
      2. Composition adjustments
      3. Color palette recommendations
      4. Lighting and mood adjustments
      5. Technical execution details
      
      Return your suggestions as a JSON object with these keys: visualElements, composition, colorPalette, lighting, technicalDetails.
      Each key should have an array of 3-5 specific suggestions as strings.
      `;
      
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: `You are an art director specialized in the ${styleConfig.name} style, providing structured guidance on style enhancement.` },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.5
      });
      
      // Parse the response as JSON
      const enhancements = JSON.parse(response.content.trim());
      
      this.status = AgentStatus.SUCCESS;
      AgentLogger.logAgentAction(this, 'Enhancements Suggested', `Suggested ${Object.keys(enhancements).length} enhancement categories`);
      
      return enhancements;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Error', `Error suggesting enhancements: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return basic fallback enhancements
      return {
        visualElements: ['Add symmetry', 'Include surreal elements', 'Incorporate paradoxical perspectives'],
        composition: ['Center the main subject', 'Use classical composition', 'Create visual balance'],
        colorPalette: ['Use muted colors', 'Include Belgian sky blue', 'Create subtle gradients'],
        lighting: ['Employ even, diffused lighting', 'Avoid harsh shadows', 'Use naturalistic illumination'],
        technicalDetails: ['Create smooth, unmodulated color fields', 'Maintain sharp edges', 'Use photorealistic rendering']
      };
    }
  }
  
  /**
   * Process a request
   */
  async process(context: AgentContext): Promise<AgentResult> {
    this.status = AgentStatus.BUSY;
    
    try {
      AgentLogger.logAgentAction(this, 'Process', 'Processing styling request');
      
      // Check what task we need to perform
      const task = context.task?.action || 'apply_style';
      const style = context.style || context.task?.style || defaultGenerationConfig.defaultStyle;
      
      let result;
      switch (task) {
        case 'apply_style':
          // Apply a style to the prompt
          const styledPrompt = await this.applyStyle(context.prompt || context.concept || '', style);
          
          result = {
            prompt: styledPrompt,
            style
          };
          break;
          
        case 'suggest_enhancements':
          // Suggest style enhancements
          const enhancements = await this.suggestStyleEnhancements(context.prompt || context.concept || '', style);
          
          result = {
            styleEnhancements: enhancements,
            style
          };
          break;
          
        default:
          throw new Error(`Unknown task: ${task}`);
      }
      
      // Update the context with the result
      const updatedContext = {
        ...context,
        ...result
      };
      
      this.status = AgentStatus.SUCCESS;
      
      // Create result message
      const resultMessage: AgentMessage = {
        id: uuidv4(),
        timestamp: new Date(),
        from: this.role,
        to: AgentRole.DIRECTOR,
        direction: MessageDirection.OUTGOING,
        type: 'result',
        content: result
      };
      
      // Add to messages
      this.messages.push(resultMessage);
      
      // Return the result
      return {
        success: true,
        output: updatedContext,
        messages: [resultMessage]
      };
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Error', `Error processing request: ${error instanceof Error ? error.message : String(error)}`);
      
      // Create error message
      const errorMessage: AgentMessage = {
        id: uuidv4(),
        timestamp: new Date(),
        from: this.role,
        to: AgentRole.DIRECTOR,
        direction: MessageDirection.OUTGOING,
        type: 'error',
        content: {
          error: error instanceof Error ? error.message : String(error)
        }
      };
      
      // Add to messages
      this.messages.push(errorMessage);
      
      // Return error result
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        messages: [errorMessage]
      };
    }
  }
  
  /**
   * Handle a message
   */
  async handleMessage(message: AgentMessage): Promise<void> {
    AgentLogger.logAgentMessage(message);
    
    // Add to message history
    this.messages.push(message);
  }
} 