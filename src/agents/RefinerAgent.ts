/**
 * Refiner Agent
 * Optimizes prompts for specific models and image generation services
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, RefinerAgent as IRefinerAgent, MessageDirection } from './types';
import { AgentLogger } from '../utils/agentLogger';
import { AIService } from '../services/ai/index';
import { defaultGenerationConfig } from '../config/generationConfig';

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
    avoidWords: ["lowres", "blurry", "distorted"],
    maxLength: 1500,
    parameterKeys: ["guidance_scale", "negative_prompt"]
  }
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
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.role = AgentRole.REFINER;
    this.status = AgentStatus.IDLE;
    this.aiService = aiService;
    this.messages = [];
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Refiner agent created');
  }
  
  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    AgentLogger.logAgentAction(this, 'Initialize', 'Refiner agent initialized');
  }

  /**
   * Refine a prompt based on feedback
   */
  async refinePrompt(prompt: string, feedback?: string): Promise<string> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Refine Prompt', `Refining prompt based on feedback: ${feedback?.substring(0, 50) || 'none'}`);
    
    try {
      const hasFeedback = feedback && feedback.trim().length > 0;
      
      const aiPrompt = `
      ${hasFeedback ? 
        `Refine this image generation prompt based on the provided feedback:` :
        `Review and improve this image generation prompt to make it more effective for AI image generation:`}
      
      PROMPT:
      "${prompt}"
      
      ${hasFeedback ? `FEEDBACK:\n${feedback}` : ''}
      
      Make these improvements:
      1. Clarify visual details and composition
      2. Add more specific artistic direction
      3. Remove any contradictory or confusing elements
      4. Ensure the language is precise and descriptive
      5. Maintain the overall concept and style
      
      ${hasFeedback ? 'Address ALL issues mentioned in the feedback.' : ''}
      
      Return ONLY the refined prompt, without explanation or meta-commentary.
      `;
      
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are a prompt engineering expert who specializes in refining prompts for AI image generation.' },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.4
      });
      
      const refinedPrompt = response.content.trim();
      
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
      // Get model optimization info
      const modelInfo = MODEL_OPTIMIZATIONS[model] || {
        name: "Generic Model",
        strength: "General image generation",
        keywords: ["detailed", "high quality"],
        avoidWords: [],
        maxLength: 2000
      };
      
      const aiPrompt = `
      Optimize this image generation prompt specifically for the ${modelInfo.name} model:
      "${prompt}"
      
      Model specialties: ${modelInfo.strength}
      
      Your optimizations should:
      1. Add some of these recommended keywords for the model: ${modelInfo.keywords.join(', ')}
      2. Remove any of these words that don't work well: ${modelInfo.avoidWords.join(', ')}
      3. Ensure the prompt is clear and aligned with the model's strengths
      4. Keep the prompt under ${modelInfo.maxLength} characters
      5. Maintain the original concept, style, and artistic intent
      
      Return ONLY the optimized prompt, without explanation or meta-commentary.
      `;
      
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: `You are an expert in optimizing prompts for the ${modelInfo.name} image generation model.` },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.3
      });
      
      const optimizedPrompt = response.content.trim();
      
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
   * Generate a negative prompt for a specific model
   */
  private async generateNegativePrompt(prompt: string, model: string): Promise<string> {
    try {
      const modelInfo = MODEL_OPTIMIZATIONS[model] || {
        name: "Generic Model",
        avoidWords: []
      };
      
      const aiPrompt = `
      Create an effective negative prompt to avoid unwanted elements for this image generation:
      "${prompt}"
      
      The negative prompt should:
      1. List artifacts and quality issues to avoid (blur, pixelation, etc.)
      2. Mention stylistic elements that should NOT appear
      3. Specify unwanted compositions or elements
      4. Address potential model weaknesses for this type of image
      5. Be comprehensive but not contradictory to the main prompt
      
      Return ONLY the negative prompt as a comma-separated list without explanation.
      `;
      
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are a prompt engineering expert who specializes in creating effective negative prompts for AI image generation.' },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.4
      });
      
      return response.content.trim();
    } catch (error) {
      AgentLogger.logAgentAction(this, 'Error', `Error generating negative prompt: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return a default negative prompt
      return "blurry, pixelated, low quality, low resolution, oversaturated, distorted, deformed, disfigured, ugly, amateur, unprofessional";
    }
  }
  
  /**
   * Suggest optimal parameters for a specific model
   */
  private async suggestModelParameters(prompt: string, model: string): Promise<Record<string, any>> {
    try {
      const modelInfo = MODEL_OPTIMIZATIONS[model] || {
        parameterKeys: ["guidance_scale", "num_inference_steps"]
      };
      
      // Create default parameters based on model
      const defaultParams: Record<string, any> = {};
      
      if (modelInfo.parameterKeys.includes("guidance_scale") || modelInfo.parameterKeys.includes("cfg_scale")) {
        const key = modelInfo.parameterKeys.includes("guidance_scale") ? "guidance_scale" : "cfg_scale";
        defaultParams[key] = 7.5;
      }
      
      if (modelInfo.parameterKeys.includes("num_inference_steps") || modelInfo.parameterKeys.includes("steps")) {
        const key = modelInfo.parameterKeys.includes("num_inference_steps") ? "num_inference_steps" : "steps";
        defaultParams[key] = 30;
      }
      
      if (modelInfo.parameterKeys.includes("negative_prompt")) {
        defaultParams["negative_prompt"] = await this.generateNegativePrompt(prompt, model);
      }
      
      return defaultParams;
    } catch (error) {
      AgentLogger.logAgentAction(this, 'Error', `Error suggesting model parameters: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return basic fallback parameters
      return {
        guidance_scale: 7.5,
        num_inference_steps: 30,
        negative_prompt: "blurry, pixelated, low quality, low resolution, distorted, deformed"
      };
    }
  }
  
  /**
   * Process a request
   */
  async process(context: AgentContext): Promise<AgentResult> {
    this.status = AgentStatus.BUSY;
    
    try {
      AgentLogger.logAgentAction(this, 'Process', 'Processing refinement request');
      
      // Check what task we need to perform
      const task = context.task?.action || 'refine_prompt';
      const prompt = context.prompt || context.concept || '';
      
      let result;
      switch (task) {
        case 'refine_prompt':
          // Refine the prompt based on feedback
          const feedback = context.task?.feedback || context.feedback;
          const refinedPrompt = await this.refinePrompt(prompt, feedback);
          
          result = {
            prompt: refinedPrompt
          };
          break;
          
        case 'optimize_for_model':
          // Optimize the prompt for a specific model
          const model = context.task?.model || 'black-forest-labs/flux-1.1-pro';
          const optimizedPrompt = await this.optimizeForModel(prompt, model);
          
          // Generate model parameters
          const modelParams = await this.suggestModelParameters(optimizedPrompt, model);
          
          result = {
            prompt: optimizedPrompt,
            modelParams
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