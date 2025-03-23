/**
 * Enhanced Refiner Agent
 * Optimizes prompts for specific models and image generation services
 * with advanced refinement capabilities and model-specific optimizations
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, RefinerAgent as IRefinerAgent, MessageDirection } from './types';
import { AgentLogger, LogLevel } from '../utils/agentLogger';
import { AIService, AIMessage } from '../services/ai/index';
import { ReplicateService } from '../services/replicate/index';
import { defaultGenerationConfig } from '../config/generationConfig';
import { MagritteStyleEvaluator } from '../services/style/MagritteStyleEvaluator';
import { magrittePatterns } from '../services/style/magrittePatterns';
import { StyleIntegrationService } from '../services/style/StyleIntegrationService';
import { CharacterGenerator } from '../generators/CharacterGenerator';

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
    keywords: ["IKIGAI", "detailed high quality", "cinematic lighting", "masterpiece", "detailed", "intricate details"],
    avoidWords: ["anime", "cartoon", "stylized", "sketch", "low quality", "grainy", "blurry", "deformed"],
    maxLength: 2000,
    parameterKeys: ["guidance_scale", "num_inference_steps", "negative_prompt", "controlnet_conditioning_scale", "clip_skip"]
  },
  "adirik/flux-cinestill": {
    name: "Flux Cinestill",
    strength: "Cinematic film look, moody lighting",
    keywords: ["cinestill", "film grain", "shallow depth of field", "cinematic", "night photography", "IKIGAI"],
    avoidWords: ["digital", "sharp", "clean", "anime", "cartoon", "low quality"],
    maxLength: 1800,
    parameterKeys: ["guidance_scale", "num_inference_steps", "negative_prompt"]
  },
  "stability-ai/stable-diffusion-3": {
    name: "Stable Diffusion 3",
    strength: "Versatile image generation, consistent composition",
    keywords: ["detailed", "coherent", "professional", "8k", "high resolution", "masterpiece"],
    avoidWords: ["low quality", "blurry", "deformed"],
    maxLength: 2000,
    parameterKeys: ["cfg_scale", "steps", "negative_prompt"]
  },
  "minimax/image-01": {
    name: "MiniMax image-01",
    strength: "Clean, accurate image generation",
    keywords: ["best quality", "detailed", "sharp", "detailed"],
    avoidWords: ["anime", "cartoon", "simple", "low quality"],
    maxLength: 1500,
    parameterKeys: ["guidance_scale", "num_inference_steps"]
  }
};

// Magritte-specific flux optimization
const MAGRITTE_FLUX_OPTIMIZATION: ModelOptimization = {
  name: "Magritte on Flux Pro",
  strength: "Magritte style surrealism with photorealistic quality",
  keywords: [
    "IKIGAI", 
    "René Magritte style", 
    "Belgian surrealism", 
    "hyper-precise painting", 
    "immaculate edges", 
    "perfect surface quality", 
    "philosophical surrealism",
    "museum-quality painting technique",
    "masterpiece",
    "perfect oil painting"
  ],
  avoidWords: [
    "expressionistic", 
    "rough texture", 
    "brushstrokes", 
    "impasto", 
    "sketchy", 
    "loose style",
    "abstract", 
    "cartoon",
    "anime",
    "grainy",
    "photo",
    "photograph",
    "low quality",
    "realistic fur"
  ],
  maxLength: 2000,
  parameterKeys: ["guidance_scale", "num_inference_steps", "negative_prompt", "controlnet_conditioning_scale", "clip_skip"]
};

/**
 * Enhanced Refiner Agent implementation
 */
export class EnhancedRefinerAgent implements IRefinerAgent {
  id: string;
  role: AgentRole.REFINER = AgentRole.REFINER;
  name: string = 'Enhanced Refiner Agent';
  status: AgentStatus = AgentStatus.IDLE;
  
  private aiService: AIService;
  private replicateService: ReplicateService;
  private messages: AgentMessage[];
  private magritteEvaluator: MagritteStyleEvaluator;
  private styleIntegrationService: StyleIntegrationService;
  private lastAction: string = '';
  
  // Refinement parameters
  private refinementParameters = {
    iterationCount: 3,
    refinementStrength: 0.8,
    detailLevel: 0.9,
    preserveStyleWeight: 0.95
  };
  
  private context: Record<string, any> = {
    currentTask: null,
    refinementHistory: []
  };
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.role = AgentRole.REFINER;
    this.status = AgentStatus.IDLE;
    this.aiService = aiService;
    this.replicateService = new ReplicateService();
    this.messages = [];
    this.magritteEvaluator = new MagritteStyleEvaluator();
    this.styleIntegrationService = new StyleIntegrationService(aiService);
    
    AgentLogger.log(`EnhancedRefinerAgent (${this.id}) created`, LogLevel.INFO);
  }
  
  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    
    // Initialize the Replicate service
    await this.replicateService.initialize();
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Enhanced Refiner agent initialized with Replicate service');
  }

  /**
   * Refine a prompt with optional feedback
   */
  async refinePrompt(prompt: string | undefined, feedback?: string): Promise<string> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Refine Prompt', 'Refining prompt');
    
    // Ensure prompt is a string
    const safePrompt = prompt || '';
    
    try {
      // Check if this is a Magritte-style prompt based on content
      const isMagritteStyle = this.isMagrittePrompt(safePrompt);
      
      if (isMagritteStyle) {
        AgentLogger.logAgentAction(this, 'Magritte Style', 'Detected Magritte-style prompt, applying specialized refinement');
        const refinedPrompt = await this.refineMagrittePrompt(safePrompt, feedback);
        
        this.status = AgentStatus.SUCCESS;
        AgentLogger.logAgentAction(this, 'Prompt Refined', `Refined Magritte prompt: ${refinedPrompt.substring(0, 100)}...`);
        
        return refinedPrompt;
      }
      
      // Standard prompt refinement logic
      let refinedPrompt = safePrompt;
      
      // If feedback is provided, use it to improve the prompt
      if (feedback) {
        const aiPrompt = `
        Refine this image generation prompt based on the feedback:
        
        Original prompt: "${safePrompt}"
        
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
        
        Original prompt: "${safePrompt}"
        
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
      return safePrompt;
    }
  }

  /**
   * Optimize a prompt for a specific model
   */
  async optimizeForModel(prompt: string | undefined, model: string): Promise<string> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Optimize for Model', `Optimizing prompt for model: ${model}`);
    
    // Ensure prompt is a string
    const safePrompt = prompt || '';
    
    try {
      // Check if this is a Magritte-style prompt for special handling
      const isMagritteStyle = this.isMagrittePrompt(safePrompt);
      
      // Use Magritte-specific optimization for Flux if it's a Magritte prompt
      if (isMagritteStyle && model === "black-forest-labs/flux-1.1-pro") {
        AgentLogger.logAgentAction(this, 'Magritte Style', 'Applying specialized Magritte optimization for Flux model');
        
        const optimizedPrompt = await this.optimizeMagritteForFlux(safePrompt);
        
        // Ensure we have the IKIGAI keyword at the beginning
        const finalPrompt = this.ensureIkigaiPrefix(optimizedPrompt);
        
        this.status = AgentStatus.SUCCESS;
        AgentLogger.logAgentAction(this, 'Optimized for Flux', `Optimized Magritte prompt for Flux: ${finalPrompt.substring(0, 100)}...`);
        
        return finalPrompt;
      }
      
      // Generic model optimization
      const optimization = MODEL_OPTIMIZATIONS[model] || MODEL_OPTIMIZATIONS["black-forest-labs/flux-1.1-pro"];
      
      // Create an optimization prompt for the AI service
      const aiPrompt = `
      Optimize this image generation prompt for the ${optimization.name} model, which has these strengths: ${optimization.strength}
      
      Original prompt: "${safePrompt}"
      
      Please:
      1. Add these keywords appropriately: ${optimization.keywords.join(', ')}
      2. Remove or replace these problematic terms: ${optimization.avoidWords.join(', ')}
      3. Ensure the prompt is clear and specific
      4. Keep the prompt under ${optimization.maxLength} characters
      5. Maintain the artistic intent and style of the original
      
      Return ONLY the optimized prompt, without explanation or meta-commentary.
      `;
      
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are an expert at optimizing prompts for specific AI image generation models.' },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.3
      });
      
      let optimizedPrompt = response.content.trim();
      
      // For Flux models, ensure the IKIGAI keyword is at the beginning
      if (model.includes('flux') && !optimizedPrompt.startsWith('IKIGAI')) {
        optimizedPrompt = `IKIGAI ${optimizedPrompt}`;
      }
      
      this.status = AgentStatus.SUCCESS;
      AgentLogger.logAgentAction(this, 'Optimized for Model', `Optimized prompt for ${model}: ${optimizedPrompt.substring(0, 100)}...`);
      
      return optimizedPrompt;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Error', `Error optimizing prompt: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return the original prompt as fallback
      return this.ensureIkigaiPrefix(safePrompt);
    }
  }
  
  /**
   * Ensures the IKIGAI prefix is present for Flux models
   */
  private ensureIkigaiPrefix(prompt: string): string {
    if (!prompt.trim().startsWith('IKIGAI')) {
      return `IKIGAI ${prompt.trim()}`;
    }
    return prompt;
  }

  /**
   * Check if a prompt is for a Magritte-style image
   */
  private isMagrittePrompt(prompt: string | undefined): boolean {
    if (!prompt) return false;
    
    const magritteKeywords = [
      'magritte', 'rené magritte', 'surrealist', 'belgian surrealism', 
      'bowler hat', 'philosophical', 'surreal', 'magritte-style',
      'son of man', 'belgian painter', 'enigmatic'
    ];
    
    const lowerPrompt = prompt.toLowerCase();
    
    // Check for Magritte keywords
    for (const keyword of magritteKeywords) {
      if (lowerPrompt.includes(keyword)) {
        return true;
      }
    }
    
    // Check for bear + magritte pattern
    if (lowerPrompt.includes('bear') && 
        (lowerPrompt.includes('surreal') || 
         lowerPrompt.includes('bowler') || 
         lowerPrompt.includes('belgian'))) {
      return true;
    }
    
    // Check for Magritte patterns
    const patterns = [
      'floating apple', 'cloudy sky background', 'pipe', 'bowler hat',
      'sky behind', 'ceci n\'est pas', 'not a pipe', 'empire of light',
      'bird leaf', 'reflection', 'mirror', 'door opening'
    ];
    
    for (const pattern of patterns) {
      if (lowerPrompt.includes(pattern)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Refine a Magritte-style prompt with specialized techniques
   */
  private async refineMagrittePrompt(prompt: string | undefined, feedback?: string): Promise<string> {
    // Ensure prompt is a string
    const safePrompt = prompt || '';
    
    // Create a specialized Magritte refinement prompt
    const aiPrompt = `
    Enhance this René Magritte-style image prompt to produce a museum-quality image:
    
    ${safePrompt}
    
    ${feedback ? `Feedback to address: ${feedback}` : ''}
    
    Enhance it by:
    1. Emphasizing perfectly smooth, matte surfaces with no visible brushwork
    2. Adding hyper-precise edges and mathematically perfect transitions
    3. Focusing on pure, unmodulated color fields
    4. Highlighting philosophical surrealism with impossible but harmonious elements
    5. Ensuring proper lighting with sourceless illumination
    6. Emphasizing Magritte's distinctive surface quality
    
    Return ONLY the refined prompt, without explanation.
    `;
    
    const response = await this.aiService.getCompletion({
      messages: [
        { role: 'system', content: 'You are a world expert on René Magritte\'s painting technique and surrealist style.' },
        { role: 'user', content: aiPrompt }
      ],
      temperature: 0.4
    });
    
    // Extract just the prompt from the response
    return response.content.trim();
  }

  /**
   * Special optimization for Magritte style on Flux model
   */
  private async optimizeMagritteForFlux(prompt: string | undefined): Promise<string> {
    // Ensure prompt is a string
    const safePrompt = prompt || '';
    
    // Create a specialized optimization prompt
    const aiPrompt = `
    Optimize this René Magritte surrealist image prompt specifically for the black-forest-labs/flux-1.1-pro model:
    
    Original prompt: "${safePrompt}"
    
    Please:
    1. Add these specific terms appropriately: ${MAGRITTE_FLUX_OPTIMIZATION.keywords.join(', ')}
    2. Remove these problematic terms: ${MAGRITTE_FLUX_OPTIMIZATION.avoidWords.join(', ')}
    3. Emphasize perfectly smooth, matte paint surfaces with zero visible brushwork
    4. Highlight hyper-precise edges with mathematically perfect color transitions
    5. Use philosophical surrealism terminology to capture Magritte's essence
    6. Ensure the prompt creates a museum-quality image in Magritte's distinctive style
    7. Include the perfect surrealist lighting with sourceless illumination
    8. Keep the core concept and intention of the original prompt
    
    Return ONLY the optimized prompt, without explanation.
    `;
    
    const response = await this.aiService.getCompletion({
      messages: [
        { role: 'system', content: 'You are a world expert on optimizing prompts for the Flux image model, specializing in René Magritte\'s surrealist style.' },
        { role: 'user', content: aiPrompt }
      ],
      temperature: 0.3
    });
    
    // Process the response
    let optimizedPrompt = response.content.trim();
    
    // Ensure the prompt isn't too long
    if (optimizedPrompt.length > MAGRITTE_FLUX_OPTIMIZATION.maxLength) {
      // Truncate to the maximum length but try to end on a complete sentence or phrase
      const truncated = optimizedPrompt.substring(0, MAGRITTE_FLUX_OPTIMIZATION.maxLength);
      const lastPeriod = truncated.lastIndexOf('.');
      const lastComma = truncated.lastIndexOf(',');
      const lastSentenceEnd = Math.max(lastPeriod, lastComma);
      
      if (lastSentenceEnd > MAGRITTE_FLUX_OPTIMIZATION.maxLength * 0.8) {
        optimizedPrompt = truncated.substring(0, lastSentenceEnd + 1);
      } else {
        optimizedPrompt = truncated;
      }
    }
    
    return optimizedPrompt;
  }

  /**
   * Generate a negative prompt specifically for Magritte style
   */
  private async generateMagritteNegativePrompt(): Promise<string> {
    const negativeElements = [
      "photorealistic", "hyperrealistic", "photograph", "DSLR", "camera photo",
      "3D rendering", "CGI", "digital art", "graphic design", "illustration", "cartoon",
      "rough texture", "heavy impasto", "visible brushstrokes", "expressionistic", "loose style",
      "sketchy", "unfinished", "abstract", "modernist", "contemporary", "avant-garde",
      "full body shot", "landscape format", "action poses", "busy backgrounds", "low quality",
      "natural wilderness", "full face view", "messy composition", "cluttered elements",
      "informal poses", "casual style", "modern clothing", "contemporary fashion", "watermark",
      "fuzzy", "blurry", "grainy", "pixelated", "deformed", "low quality", "anime", "cartoon",
      "realistic fur", "signature", "text", "deformed", "disfigured", "extra limbs", "cropped"
    ];
    
    return negativeElements.join(", ");
  }

  /**
   * Generate a negative prompt for a specific model
   */
  private async generateNegativePrompt(prompt: string | undefined, model: string): Promise<string> {
    // Ensure prompt is a string
    const safePrompt = prompt || '';
    
    // Check if this is a Magritte-style prompt
    if (this.isMagrittePrompt(safePrompt)) {
      return this.generateMagritteNegativePrompt();
    }
    
    // Get model-specific information
    const optimization = MODEL_OPTIMIZATIONS[model] || MODEL_OPTIMIZATIONS["black-forest-labs/flux-1.1-pro"];
    
    // Create a basic negative prompt
    const baseNegativePrompt = "low quality, bad anatomy, blurry, pixelated, watermark";
    
    // Add model-specific avoid words
    const modelSpecificNegative = optimization.avoidWords.join(", ");
    
    // Combine the negative prompts
    return `${baseNegativePrompt}, ${modelSpecificNegative}`;
  }

  /**
   * Suggest optimal model parameters based on prompt and model
   */
  private async suggestModelParameters(prompt: string | undefined, model: string): Promise<Record<string, any>> {
    // Ensure prompt is a string
    const safePrompt = prompt || '';
    
    // Default parameters
    const defaultParams = {
      guidance_scale: 4.5,
      num_inference_steps: 45
    };
    
    // Get model configuration from generationConfig
    const modelConfig = defaultGenerationConfig.models[model] || defaultGenerationConfig.default;
    
    // Check if this is a Magritte-style prompt
    if (this.isMagrittePrompt(safePrompt)) {
      // Special parameters for Magritte style
      if (model === "black-forest-labs/flux-1.1-pro") {
        return {
          guidance_scale: 4.5,
          num_inference_steps: 45,
          controlnet_conditioning_scale: 0.8,
          clip_skip: 2
        };
      }
    }
    
    // Return model-specific parameters
    return {
      guidance_scale: modelConfig.guidanceScale,
      num_inference_steps: modelConfig.inferenceSteps,
      ...(modelConfig.customParams || {})
    };
  }

  /**
   * Handle a message from another agent
   */
  async handleMessage(message: AgentMessage): Promise<void> {
    // Log the incoming message
    AgentLogger.logAgentMessage(message);
    
    // Add the message to our list
    this.messages.push(message);
    
    // Process different message types
    switch (message.type) {
      case 'request':
        if (message.content?.action === 'refine_prompt') {
          this.status = AgentStatus.BUSY;
          
          try {
            // Extract data from the message
            const prompt = message.content.prompt || '';
            const feedback = message.content.feedback;
            const model = message.content.model || this.replicateService.getDefaultModel();
            
            // Refine the prompt
            const refinedPrompt = await this.refinePrompt(prompt, feedback ? String(feedback) : undefined);
            
            // Optimize for model if specified
            const optimizedPrompt = message.content.optimize 
              ? await this.optimizeForModel(refinedPrompt, model)
              : refinedPrompt;
            
            // Generate negative prompt
            const negativePrompt = await this.generateNegativePrompt(optimizedPrompt, model);
            
            // Get model parameters
            const modelParams = await this.suggestModelParameters(optimizedPrompt, model);
            
            // Create response message
            const responseMessage: AgentMessage = {
              id: uuidv4(),
              timestamp: new Date(),
              from: this.role,
              to: message.from,
              direction: MessageDirection.OUTGOING,
              type: 'result',
              content: {
                refinedPrompt: optimizedPrompt,
                negativePrompt,
                modelParams
              }
            };
            
            // Log and add the message
            AgentLogger.logAgentMessage(responseMessage);
            this.messages.push(responseMessage);
            
            this.status = AgentStatus.SUCCESS;
          } catch (error) {
            this.status = AgentStatus.ERROR;
            
            // Create error message
            const errorMessage: AgentMessage = {
              id: uuidv4(),
              timestamp: new Date(),
              from: this.role,
              to: message.from,
              direction: MessageDirection.OUTGOING,
              type: 'error',
              content: { 
                error: error instanceof Error ? error.message : String(error)
              }
            };
            
            // Log and add the message
            AgentLogger.logAgentMessage(errorMessage);
            this.messages.push(errorMessage);
          }
        }
        break;
        
      case 'feedback':
        if (message.content?.prompt) {
          this.status = AgentStatus.BUSY;
          
          try {
            // Extract data from the message and ensure they're strings
            const prompt = String(message.content.prompt);
            const feedback = message.content.feedback ? String(message.content.feedback) : undefined;
            
            // Refine the prompt with feedback
            const refinedPrompt = await this.refinePrompt(prompt, feedback);
            
            // Create response message
            const responseMessage: AgentMessage = {
              id: uuidv4(),
              timestamp: new Date(),
              from: this.role,
              to: message.from,
              direction: MessageDirection.OUTGOING,
              type: 'result',
              content: {
                refinedPrompt,
                originalPrompt: prompt,
                feedback
              }
            };
            
            // Log and add the message
            AgentLogger.logAgentMessage(responseMessage);
            this.messages.push(responseMessage);
            
            this.status = AgentStatus.SUCCESS;
          } catch (error) {
            this.status = AgentStatus.ERROR;
            
            // Create error message
            const errorMessage: AgentMessage = {
              id: uuidv4(),
              timestamp: new Date(),
              from: this.role,
              to: message.from,
              direction: MessageDirection.OUTGOING,
              type: 'error',
              content: { 
                error: error instanceof Error ? error.message : String(error)
              }
            };
            
            // Log and add the message
            AgentLogger.logAgentMessage(errorMessage);
            this.messages.push(errorMessage);
          }
        }
        break;
    }
  }

  /**
   * Process a context
   */
  async process(context: AgentContext): Promise<AgentResult> {
    this.status = AgentStatus.BUSY;
    this.context.currentTask = context.task;
    
    try {
      AgentLogger.logAgentAction(this, 'Process', `Processing task: ${context.task?.action || 'unknown'}`);
      
      // No concept provided, return error
      if (!context.concept && !context.prompt) {
        throw new Error('No concept or prompt provided in context');
      }
      
      // Get the prompt from the context and ensure it's a string
      const originalPrompt = (context.prompt || context.concept || '');
      
      // Extract style and model information
      const style = context.style || 'magritte';
      const model = context.model || this.replicateService.getDefaultModel();
      
      // Check for specific refiner tasks
      if (context.task?.action === 'refine_prompt') {
        // Refine the prompt
        const refinedPrompt = await this.refinePrompt(originalPrompt, context.feedback ? String(context.feedback) : undefined);
        
        // Optimize for model if specified
        const optimizedPrompt = context.task.optimize
          ? await this.optimizeForModel(refinedPrompt, model)
          : refinedPrompt;
        
        // Generate negative prompt
        const negativePrompt = await this.generateNegativePrompt(optimizedPrompt, model);
        
        // Get model parameters
        const modelParams = await this.suggestModelParameters(optimizedPrompt, model);
        
        this.status = AgentStatus.SUCCESS;
        
        // Create result message
        const resultMessage: AgentMessage = {
          id: uuidv4(),
          timestamp: new Date(),
          from: this.role,
          to: AgentRole.DIRECTOR,
          direction: MessageDirection.OUTGOING,
          type: 'result',
          content: {
            refinedPrompt: optimizedPrompt,
            negativePrompt,
            modelParams
          }
        };
        
        // Log the message and store it
        AgentLogger.logAgentMessage(resultMessage);
        this.messages.push(resultMessage);
        
        // Return success
        return {
          success: true,
          output: {
            refinedPrompt: optimizedPrompt,
            negativePrompt,
            modelParams
          },
          messages: [resultMessage]
        };
      } 
      else if (context.task?.action === 'optimize_for_model') {
        // Optimize directly for the model
        const optimizedPrompt = await this.optimizeForModel(originalPrompt, model);
        
        // Generate negative prompt
        const negativePrompt = await this.generateNegativePrompt(optimizedPrompt, model);
        
        // Get model parameters
        const modelParams = await this.suggestModelParameters(optimizedPrompt, model);
        
        this.status = AgentStatus.SUCCESS;
        
        // Create result message
        const resultMessage: AgentMessage = {
          id: uuidv4(),
          timestamp: new Date(),
          from: this.role,
          to: AgentRole.DIRECTOR,
          direction: MessageDirection.OUTGOING,
          type: 'result',
          content: {
            optimizedPrompt,
            negativePrompt,
            modelParams
          }
        };
        
        // Log the message and store it
        AgentLogger.logAgentMessage(resultMessage);
        this.messages.push(resultMessage);
        
        // Return success
        return {
          success: true,
          output: {
            optimizedPrompt,
            negativePrompt,
            modelParams
          },
          messages: [resultMessage]
        };
      }
      // Special handling for Magritte style
      else if (style === 'magritte' || style === 'bear_pfp' || this.isMagrittePrompt(originalPrompt)) {
        // First refine the prompt to enhance Magritte style
        const refinedPrompt = await this.refineMagrittePrompt(originalPrompt);
        
        // Then optimize for the model
        const optimizedPrompt = await this.optimizeMagritteForFlux(refinedPrompt);
        
        // Add IKIGAI to the beginning if it's not already there
        const finalPrompt = this.ensureIkigaiPrefix(optimizedPrompt);
        
        // Generate Magritte-specific negative prompt
        const negativePrompt = await this.generateMagritteNegativePrompt();
        
        // Get Magritte-specific model parameters
        const modelParams = await this.suggestModelParameters(finalPrompt, model);
        
        this.status = AgentStatus.SUCCESS;
        
        // Create result message
        const resultMessage: AgentMessage = {
          id: uuidv4(),
          timestamp: new Date(),
          from: this.role,
          to: AgentRole.DIRECTOR,
          direction: MessageDirection.OUTGOING,
          type: 'result',
          content: {
            refinedPrompt: finalPrompt,
            originalPrompt,
            negativePrompt,
            modelParams
          }
        };
        
        // Log the message and store it
        AgentLogger.logAgentMessage(resultMessage);
        this.messages.push(resultMessage);
        
        // Return success
        return {
          success: true,
          output: {
            refinedPrompt: finalPrompt,
            negativePrompt,
            modelParams,
            styleInfo: {
              style: 'magritte',
              enhancedForModel: model
            }
          },
          messages: [resultMessage]
        };
      }
      // Default processing for other styles
      else {
        // Basic refinement
        const refinedPrompt = await this.refinePrompt(originalPrompt);
        
        // Optimize for the model
        const optimizedPrompt = await this.optimizeForModel(refinedPrompt, model);
        
        // Generate negative prompt
        const negativePrompt = await this.generateNegativePrompt(optimizedPrompt, model);
        
        // Get model parameters
        const modelParams = await this.suggestModelParameters(optimizedPrompt, model);
        
        this.status = AgentStatus.SUCCESS;
        
        // Create result message
        const resultMessage: AgentMessage = {
          id: uuidv4(),
          timestamp: new Date(),
          from: this.role,
          to: AgentRole.DIRECTOR,
          direction: MessageDirection.OUTGOING,
          type: 'result',
          content: {
            refinedPrompt: optimizedPrompt,
            originalPrompt,
            negativePrompt,
            modelParams
          }
        };
        
        // Log the message and store it
        AgentLogger.logAgentMessage(resultMessage);
        this.messages.push(resultMessage);
        
        // Return success
        return {
          success: true,
          output: {
            refinedPrompt: optimizedPrompt,
            negativePrompt,
            modelParams
          },
          messages: [resultMessage]
        };
      }
    } catch (error) {
      this.status = AgentStatus.ERROR;
      
      // Create error message
      const errorMessage: AgentMessage = {
        id: uuidv4(),
        timestamp: new Date(),
        from: this.role,
        to: AgentRole.DIRECTOR,
        direction: MessageDirection.OUTGOING,
        type: 'error',
        content: { error: error instanceof Error ? error.message : String(error) }
      };
      
      // Log the message and store it
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
   * Optimize a prompt specifically for the FLUX model
   */
  async optimizeForFluxModel(prompt: string, additionalRequirements: string[] = []): Promise<string> {
    try {
      AgentLogger.log(`${this.role} optimizing prompt for FLUX model`, LogLevel.INFO);
      AgentLogger.logAgentAction(this, 'FLUX Optimization', 'Refining prompt for FLUX model');

      // This prefix helps with FLUX model optimization
      const fluxPrefix = "IKIGAI:";
      
      // Style parameters known to work well with FLUX for Magritte-style images
      const fluxStyleParameters = [
        "meticulously detailed",
        "dreamlike clarity",
        "photorealistic hyperdetail",
        "philosophical",
        "mysterious",
        "contemplative"
      ];
      
      // Create a system message with specific instructions for FLUX prompt optimization
      const systemMessage = `You are a specialized AI fine-tuning prompts specifically for the black-forest-labs/flux-1.1-pro model to create Magritte-style surrealist bear portraits. 
      
Your task is to transform the given prompt into an optimized version that will produce the best results with the FLUX model while maintaining the René Magritte stylistic elements.

Follow these specific guidelines when refining the prompt:
1. Start the prompt with the prefix "IKIGAI:" (this helps with FLUX model control)
2. Maintain the bear portrait concept but enhance descriptive elements
3. Add philosophical and contemplative undertones typical of Magritte's work
4. Include specific technical terms that work well with FLUX: "meticulously detailed", "dreamlike clarity", "photorealistic hyperdetail"
5. Keep a balanced description focused on the visual style, composition, and mood
6. Add subtle surrealist elements that juxtapose ordinary objects in extraordinary ways
7. Incorporate specific Magritte styling: flat Belgian sky blue backgrounds, perfect matte finish, precise edge definition
8. End with style keywords: "philosophical, mysterious, contemplative"
9. Keep the prompt concise but richly descriptive (under 200 words)

Make sure the prompt maintains the original concept but is optimized specifically for the strengths of the FLUX model.`;

      // User message template with the original prompt
      const userMessage = `Original prompt: "${prompt}"

Please transform this into an optimized prompt for the FLUX model that will create a stunning Magritte-style bear portrait.

Additional requirements to incorporate:
${additionalRequirements.map(req => `- ${req}`).join('\n')}`;

      // Get the response using AI service
      if (!this.aiService) {
        throw new Error('AI service not initialized');
      }

      const response = await this.aiService.getCompletion({
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage }
        ],
        model: "claude-3-sonnet-20240229"
      });

      // Process the response
      let optimizedPrompt = response.content.trim();
      
      // Ensure the FLUX prefix is present
      if (!optimizedPrompt.startsWith(fluxPrefix)) {
        optimizedPrompt = `${fluxPrefix} ${optimizedPrompt}`;
      }
      
      // Ensure style parameters are present
      const missingStyleParams = fluxStyleParameters.filter(param => 
        !optimizedPrompt.toLowerCase().includes(param.toLowerCase())
      );
      
      if (missingStyleParams.length > 0) {
        optimizedPrompt = `${optimizedPrompt}, ${missingStyleParams.join(", ")}`;
      }
      
      AgentLogger.log(`${this.role} optimized prompt for FLUX model:`, LogLevel.INFO);
      AgentLogger.log(`Original: ${prompt.substring(0, 100)}...`, LogLevel.INFO);
      AgentLogger.log(`Optimized: ${optimizedPrompt.substring(0, 100)}...`, LogLevel.INFO);
      
      return optimizedPrompt;
    } catch (error) {
      AgentLogger.log(`Error in ${this.role}.optimizeForFluxModel: ${error}`, LogLevel.ERROR);
      
      // If optimization fails, add a simple prefix and return
      return `IKIGAI: ${prompt}, philosophical, mysterious, contemplative`;
    }
  }
} 