/**
 * Refiner Agent
 * Optimizes prompts for specific models and image generation services
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, RefinerAgent as IRefinerAgent, MessageDirection } from './types';
import { AgentLogger } from '../utils/agentLogger';
import { AIService } from '../services/ai/index';
import { defaultGenerationConfig } from '../config/generationConfig';
import { MagritteStyleEvaluator } from '../services/style/MagritteStyleEvaluator';
import { magrittePatterns } from '../services/style/magrittePatterns';

// Define the model optimization interface
interface ModelOptimization {
  name: string;
  strength: string;
  keywords: string[];
  avoidWords: string[];
  maxLength: number;
  parameterKeys: string[];
}

// Model-specific keywords and optimization info
const MODEL_OPTIMIZATIONS: Record<string, ModelOptimization> = {
  "black-forest-labs/flux-1.1-pro": {
    name: "Flux 1.1 Pro",
    strength: "Photorealistic images, consistent quality",
    keywords: ["photorealistic", "hyper-detailed", "cinematic lighting", "35mm film"],
    avoidWords: ["anime", "cartoon", "stylized", "sketch"],
    maxLength: 1800,
    parameterKeys: ["guidance_scale", "num_inference_steps", "negative_prompt"]
  },
  "adirik/flux-cinestill": {
    name: "Flux Cinestill",
    strength: "Cinematic film look, moody lighting",
    keywords: ["cinestill", "film grain", "shallow depth of field", "cinematic", "night photography"],
    avoidWords: ["digital", "sharp", "clean", "anime"],
    maxLength: 1500,
    parameterKeys: ["guidance_scale", "num_inference_steps", "negative_prompt"]
  },
  "stability-ai/stable-diffusion-3": {
    name: "Stable Diffusion 3",
    strength: "Versatile image generation, consistent composition",
    keywords: ["detailed", "coherent", "professional", "8k", "high resolution"],
    avoidWords: [],
    maxLength: 2000,
    parameterKeys: ["cfg_scale", "steps", "negative_prompt"]
  },
  "minimax/image-01": {
    name: "MiniMax image-01",
    strength: "Clean, accurate image generation",
    keywords: ["best quality", "detailed", "sharp", "detailed"],
    avoidWords: ["anime", "cartoon", "simple", "low quality"],
    maxLength: 1200,
    parameterKeys: ["guidance_scale", "num_inference_steps"]
  }
};

// Magritte-specific flux optimization
const MAGRITTE_FLUX_OPTIMIZATION: ModelOptimization = {
  name: "Magritte on Flux Pro",
  strength: "Magritte style surrealism with photorealistic quality",
  keywords: [
    "René Magritte style", 
    "Belgian surrealism", 
    "photorealistic painting", 
    "clean edges", 
    "smooth surfaces", 
    "philosophical surrealism",
    "precise painting technique"
  ],
  avoidWords: [
    "expressionistic", 
    "rough texture", 
    "heavy brushstrokes", 
    "impasto", 
    "sketchy", 
    "loose style",
    "abstract", 
    "cartoon",
    "anime"
  ],
  maxLength: 1800,
  parameterKeys: ["guidance_scale", "num_inference_steps", "negative_prompt"]
};

/**
 * Refiner Agent implementation
 */
export class RefinerAgent implements IRefinerAgent {
  id: string;
  role: AgentRole.REFINER;
  status: AgentStatus;
  
  private aiService: AIService;
  private messages: AgentMessage[];
  private magritteEvaluator: MagritteStyleEvaluator;
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.role = AgentRole.REFINER;
    this.status = AgentStatus.IDLE;
    this.aiService = aiService;
    this.messages = [];
    this.magritteEvaluator = new MagritteStyleEvaluator();
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Refiner agent created with Magritte capabilities');
  }
  
  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    AgentLogger.logAgentAction(this, 'Initialize', 'Refiner agent initialized');
  }

  /**
   * Refine a prompt with optional feedback
   */
  async refinePrompt(prompt: string, feedback?: string): Promise<string> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Refine Prompt', 'Refining prompt');
    
    try {
      // Check if this is a Magritte-style prompt based on content
      const isMagritteStyle = this.isMagrittePrompt(prompt);
      
      if (isMagritteStyle) {
        AgentLogger.logAgentAction(this, 'Magritte Style', 'Detected Magritte-style prompt, applying specialized refinement');
        const refinedPrompt = this.refineMagrittePrompt(prompt, feedback);
        
        this.status = AgentStatus.SUCCESS;
        AgentLogger.logAgentAction(this, 'Prompt Refined', `Refined Magritte prompt: ${refinedPrompt.substring(0, 100)}...`);
        
        return refinedPrompt;
      }
      
      // Standard prompt refinement logic
      let refinedPrompt = prompt;
      
      // If feedback is provided, use it to improve the prompt
      if (feedback) {
        const aiPrompt = `
        Refine this image generation prompt based on the feedback:
        
        Original prompt: "${prompt}"
        
        Feedback: ${feedback}
        
        Improve the prompt to address the feedback while maintaining the original intent.
        Return ONLY the refined prompt, without explanation or meta-commentary.
        `;
        
        const response = await this.aiService.getCompletion({
          messages: [
            { role: 'system', content: 'You are an expert at refining image generation prompts to improve results. You make prompts more specific, detailed, and effective.' },
            { role: 'user', content: aiPrompt }
          ],
          temperature: 0.3
        });
        
        refinedPrompt = response.content.trim();
      } else {
        // General refinement without specific feedback
        const aiPrompt = `
        Enhance this image generation prompt to produce better results:
        
        Original prompt: "${prompt}"
        
        Improve the prompt by:
        1. Adding more specific details
        2. Clarifying ambiguous elements
        3. Adding relevant technical aspects (lighting, perspective, etc.)
        4. Ensuring the prompt is well-structured
        
        Return ONLY the refined prompt, without explanation or meta-commentary.
        `;
        
        const response = await this.aiService.getCompletion({
          messages: [
            { role: 'system', content: 'You are an expert at refining image generation prompts to improve results. You make prompts more specific, detailed, and effective.' },
            { role: 'user', content: aiPrompt }
          ],
          temperature: 0.3
        });
        
        refinedPrompt = response.content.trim();
      }
      
      this.status = AgentStatus.SUCCESS;
      AgentLogger.logAgentAction(this, 'Prompt Refined', `Refined prompt: ${refinedPrompt.substring(0, 100)}...`);
      
      return refinedPrompt;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Error', `Error refining prompt: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return the original prompt as fallback
      return prompt;
    }
  }
  
  /**
   * Optimize a prompt for a specific model
   */
  async optimizeForModel(prompt: string, model: string): Promise<string> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Optimize for Model', `Optimizing prompt for model: ${model}`);
    
    try {
      // Check if this is a Magritte-style prompt for special handling
      const isMagritteStyle = this.isMagrittePrompt(prompt);
      
      // Use Magritte-specific optimization for Flux if it's a Magritte prompt
      if (isMagritteStyle && model === "black-forest-labs/flux-1.1-pro") {
        AgentLogger.logAgentAction(this, 'Magritte Style', 'Applying specialized Magritte optimization for Flux model');
        
        const optimizedPrompt = await this.optimizeMagritteForFlux(prompt);
        
        this.status = AgentStatus.SUCCESS;
        AgentLogger.logAgentAction(this, 'Prompt Optimized', `Optimized Magritte prompt for ${model}`);
        
        return optimizedPrompt;
      }
      
      // Standard model optimization
      const optimization = MODEL_OPTIMIZATIONS[model];
      if (!optimization) {
        AgentLogger.logAgentAction(this, 'Unknown Model', `No optimization data for model: ${model}, using generic optimization`);
        return this.refinePrompt(prompt);
      }
      
      // Check prompt length
      if (prompt.length > optimization.maxLength) {
        const truncatedPrompt = prompt.substring(0, optimization.maxLength);
        AgentLogger.logAgentAction(this, 'Truncate Prompt', `Prompt was too long for ${model}, truncated to ${optimization.maxLength} characters`);
        prompt = truncatedPrompt;
      }
      
      // Add model-specific keywords if not already present
      let optimizedPrompt = prompt;
      optimization.keywords.forEach(keyword => {
        if (!optimizedPrompt.toLowerCase().includes(keyword.toLowerCase())) {
          optimizedPrompt += `, ${keyword}`;
        }
      });
      
      this.status = AgentStatus.SUCCESS;
      AgentLogger.logAgentAction(this, 'Prompt Optimized', `Optimized prompt for ${model}: ${optimizedPrompt.substring(0, 100)}...`);
      
      return optimizedPrompt;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Error', `Error optimizing prompt: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return the original prompt as fallback
      return prompt;
    }
  }
  
  /**
   * Check if a prompt is Magritte-style based on content
   */
  private isMagrittePrompt(prompt: string): boolean {
    const promptLower = prompt.toLowerCase();
    
    // Check for Magritte's name
    if (promptLower.includes('magritte') || promptLower.includes('rené magritte')) {
      return true;
    }
    
    // Check for Magritte's signature elements
    const magritteElementCount = magrittePatterns.visualElements.reduce((count, element) => {
      return count + (promptLower.includes(element.toLowerCase()) ? 1 : 0);
    }, 0);
    
    if (magritteElementCount >= 2) {
      return true;
    }
    
    // Check for Magritte's signature themes and paradoxes
    const magritteThemeCount = [
      ...magrittePatterns.conceptualThemes,
      ...magrittePatterns.paradoxes
    ].reduce((count, theme) => {
      return count + (promptLower.includes(theme.toLowerCase()) ? 1 : 0);
    }, 0);
    
    if (magritteThemeCount >= 1) {
      return true;
    }
    
    // Check for references to Magritte's famous works
    const magritteWorkCount = magrittePatterns.famousWorks.reduce((count, work) => {
      return count + (promptLower.includes(work.toLowerCase()) ? 1 : 0);
    }, 0);
    
    if (magritteWorkCount >= 1) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Refine a Magritte-style prompt
   */
  private refineMagrittePrompt(prompt: string, feedback?: string): string {
    // Use the MagritteStyleEvaluator to enhance the prompt
    let refinedPrompt = this.magritteEvaluator.enhancePrompt(prompt);
    
    // If feedback is provided, ensure it's incorporated
    if (feedback) {
      // Add feedback-specific enhancements
      if (feedback.toLowerCase().includes('more surreal')) {
        refinedPrompt += ', with surreal juxtapositions and paradoxical elements';
      }
      
      if (feedback.toLowerCase().includes('cleaner')) {
        refinedPrompt += ', with crystal-clear edges and perfectly smooth surfaces';
      }
      
      if (feedback.toLowerCase().includes('more philosophical')) {
        refinedPrompt += ', questioning the relationship between image and reality';
      }
    }
    
    return refinedPrompt;
  }
  
  /**
   * Optimize a Magritte-style prompt specifically for the Flux model
   */
  private async optimizeMagritteForFlux(prompt: string): Promise<string> {
    // Apply standard Magritte enhancement first
    let optimizedPrompt = this.magritteEvaluator.enhancePrompt(prompt);
    
    // Add Flux-specific Magritte keywords if not present
    MAGRITTE_FLUX_OPTIMIZATION.keywords.forEach(keyword => {
      if (!optimizedPrompt.toLowerCase().includes(keyword.toLowerCase())) {
        optimizedPrompt += `, ${keyword}`;
      }
    });
    
    // Ensure prompt doesn't exceed maximum length
    if (optimizedPrompt.length > MAGRITTE_FLUX_OPTIMIZATION.maxLength) {
      optimizedPrompt = optimizedPrompt.substring(0, MAGRITTE_FLUX_OPTIMIZATION.maxLength);
    }
    
    // Add Flux-specific technical parameters for Magritte style
    optimizedPrompt += ', 35mm film, perfect lighting, photorealistic quality';
    
    // Generate a negative prompt specifically for Magritte style on Flux
    const negativePrompt = await this.generateMagritteNegativePrompt();
    
    // Store the negative prompt in the agent's state for later use
    this.context = {
      ...this.context,
      negativePrompt
    };
    
    return optimizedPrompt;
  }
  
  /**
   * Generate a negative prompt for Magritte-style images
   */
  private async generateMagritteNegativePrompt(): Promise<string> {
    // Combine Magritte-specific avoidWords with default Flux avoidWords
    const avoidWords = [
      ...MAGRITTE_FLUX_OPTIMIZATION.avoidWords,
      ...MODEL_OPTIMIZATIONS["black-forest-labs/flux-1.1-pro"].avoidWords
    ];
    
    // Create a structured negative prompt
    const negativePrompt = [
      // Avoid non-Magritte styles
      "expressionist style, abstract art, cubism, impressionism, cartoon, anime, sketch, graffiti",
      
      // Avoid technical issues
      "blurry, grainy, noisy, low quality, low resolution, oversaturated, oversaturated colors",
      
      // Avoid wrong textures
      "rough texture, visible brushstrokes, impasto, sketchy lines, uneven surface",
      
      // Avoid wrong composition
      "cluttered composition, busy background, chaotic arrangement, asymmetric, unbalanced",
      
      // Avoid non-Magritte elements
      "unrealistic lighting, harsh shadows, text overlay, incorrect perspective"
    ].join(", ");
    
    return negativePrompt;
  }
  
  /**
   * Generate a negative prompt for a model
   */
  private async generateNegativePrompt(prompt: string, model: string): Promise<string> {
    const optimization = MODEL_OPTIMIZATIONS[model];
    if (!optimization) {
      return "low quality, blurry, pixelated, bad anatomy, deformed, unnatural";
    }
    
    try {
      const aiPrompt = `
      Create a negative prompt to avoid unwanted elements for this image generation:
      
      Prompt: "${prompt}"
      Model: ${optimization.name}
      
      Consider:
      1. Style elements to avoid
      2. Technical flaws to exclude
      3. Anatomical issues to prevent
      4. Composition problems to eliminate
      
      ${optimization.avoidWords.length > 0 ? `Be sure to include these problem areas: ${optimization.avoidWords.join(', ')}` : ''}
      
      Return ONLY the negative prompt as a comma-separated list without explanation or meta-commentary.
      `;
      
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are an expert at creating negative prompts for image generation models to avoid unwanted elements and improve results.' },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.3
      });
      
      return response.content.trim();
    } catch (error) {
      // Fallback negative prompt
      return `low quality, blurry, pixelated, ${optimization.avoidWords.join(', ')}`;
    }
  }
  
  /**
   * Suggest parameters for a model
   */
  private async suggestModelParameters(prompt: string, model: string): Promise<Record<string, any>> {
    const optimization = MODEL_OPTIMIZATIONS[model];
    const isMagritteStyle = this.isMagrittePrompt(prompt);
    
    // Magritte-specific parameters for Flux
    if (isMagritteStyle && model === "black-forest-labs/flux-1.1-pro") {
      return {
        guidance_scale: 3,
        num_inference_steps: 28,
        width: 2048,
        height: 2048
      };
    }
    
    // Default parameters for known models
    if (model === "black-forest-labs/flux-1.1-pro") {
      return {
        guidance_scale: 3,
        num_inference_steps: 28,
        width: 768,
        height: 768
      };
    }
    
    if (model === "adirik/flux-cinestill") {
      return {
        guidance_scale: 5,
        num_inference_steps: 30,
        width: 768,
        height: 768
      };
    }
    
    // Default parameters for unknown models
    return defaultGenerationConfig.default;
  }
  
  private context: Record<string, any> = {};
  
  /**
   * Process a request
   */
  async process(context: AgentContext): Promise<AgentResult> {
    this.status = AgentStatus.BUSY;
    this.context = context;
    
    try {
      AgentLogger.logAgentAction(this, 'Process', 'Processing refinement request');
      
      // Check what task we need to perform
      const task = context.task?.action || 'refine_prompt';
      
      let result;
      switch (task) {
        case 'refine_prompt':
          // Refine the prompt
          const refinedPrompt = await this.refinePrompt(
            context.prompt || context.concept || '',
            context.task?.feedback
          );
          
          result = {
            prompt: refinedPrompt
          };
          break;
          
        case 'optimize_for_model':
          // Optimize for a specific model
          const model = context.task?.model || "black-forest-labs/flux-1.1-pro";
          
          // Check if this is a Magritte-style prompt with art direction
          if (context.task?.artDirection && this.isMagrittePrompt(context.prompt || '')) {
            AgentLogger.logAgentAction(this, 'Magritte Art Direction', 
              'Processing with Magritte art direction data');
            
            // Use art direction to further enhance the prompt
            const artDirection = context.task.artDirection;
            let enhancedPrompt = context.prompt || '';
            
            // Add art direction elements if not already in the prompt
            if (artDirection.visualElement && 
                !enhancedPrompt.toLowerCase().includes(artDirection.visualElement.toLowerCase())) {
              enhancedPrompt += `, with ${artDirection.visualElement}`;
            }
            
            if (artDirection.composition && 
                !enhancedPrompt.toLowerCase().includes(artDirection.composition.toLowerCase())) {
              enhancedPrompt += `, ${artDirection.composition}`;
            }
            
            if (artDirection.technique && 
                !enhancedPrompt.toLowerCase().includes(artDirection.technique.toLowerCase())) {
              enhancedPrompt += `, ${artDirection.technique}`;
            }
            
            // Optimize the enhanced prompt
            const optimizedPrompt = await this.optimizeForModel(enhancedPrompt, model);
            
            // Generate negative prompt
            const negativePrompt = await this.generateMagritteNegativePrompt();
            
            // Suggest parameters
            const parameters = await this.suggestModelParameters(optimizedPrompt, model);
            
            result = {
              prompt: optimizedPrompt,
              negativePrompt,
              parameters
            };
          } else {
            // Standard optimization
            const optimizedPrompt = await this.optimizeForModel(context.prompt || '', model);
            
            // Generate negative prompt
            const negativePrompt = await this.generateNegativePrompt(optimizedPrompt, model);
            
            // Suggest parameters
            const parameters = await this.suggestModelParameters(optimizedPrompt, model);
            
            result = {
              prompt: optimizedPrompt,
              negativePrompt,
              parameters
            };
          }
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