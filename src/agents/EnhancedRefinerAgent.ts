/**
 * Enhanced Refiner Agent
 * Optimizes prompts for specific models and image generation services
 * with advanced refinement capabilities and model-specific optimizations
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, RefinerAgent as IRefinerAgent, MessageDirection } from './types';
import { AgentLogger } from '../utils/agentLogger';
import { AIService, AIMessage } from '../services/ai/index';
import { ReplicateService } from '../services/replicate/index';
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
 * Enhanced Refiner Agent implementation
 */
export class EnhancedRefinerAgent implements IRefinerAgent {
  id: string;
  role: AgentRole.REFINER;
  status: AgentStatus;
  
  private aiService: AIService;
  private replicateService: ReplicateService;
  private messages: AgentMessage[];
  private magritteEvaluator: MagritteStyleEvaluator;
  
  // Refinement parameters
  private refinementParameters = {
    iterationCount: 3,
    refinementStrength: 0.7,
    detailLevel: 0.8,
    preserveStyleWeight: 0.9
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
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Enhanced Refiner agent created with Magritte capabilities');
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
      
      // Add refinement strength based on feedback intensity
      refinedPrompt += `, refined with strength ${this.refinementParameters.refinementStrength}`;
    }
    
    // Add detail level parameter for fine-tuning
    refinedPrompt += `, detail level ${this.refinementParameters.detailLevel}`;
    
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

  /**
   * Process a request
   */
  async process(context: AgentContext): Promise<AgentResult> {
    this.status = AgentStatus.BUSY;
    this.context = {
      ...this.context,
      ...context,
      currentTask: context.task || this.context.currentTask
    };
    
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
          
        case 'generate_image':
          // Generate an image using the Replicate service
          AgentLogger.logAgentAction(this, 'Generate Image', 'Generating image from prompt');
          
          const imagePrompt = context.prompt || '';
          const imageModel = context.task?.model || "black-forest-labs/flux-1.1-pro";
          
          // First refine and optimize the prompt
          const refinedImagePrompt = await this.refinePrompt(imagePrompt);
          const optimizedImagePrompt = await this.optimizeForModel(refinedImagePrompt, imageModel);
          
          // Generate negative prompt
          const imageNegativePrompt = this.isMagrittePrompt(imagePrompt) 
            ? await this.generateMagritteNegativePrompt() 
            : await this.generateNegativePrompt(optimizedImagePrompt, imageModel);
          
          // Get parameters for the model
          const imageParameters = await this.suggestModelParameters(optimizedImagePrompt, imageModel);
          
          // Prepare options for image generation
          const imageOptions = {
            prompt: optimizedImagePrompt,
            negative_prompt: imageNegativePrompt,
            num_outputs: 1,
            ...imageParameters
          };
          
          // Call Replicate to generate the image
          const prediction = await this.replicateService.runPrediction(
            imageModel, 
            imageOptions
          );
          
          if (prediction.status !== 'succeeded' || !prediction.output) {
            throw new Error(`Image generation failed: ${prediction.error || 'Unknown error'}`);
          }
          
          // Get the image URL from the prediction output
          const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
          
          // Store in refinement history
          this.context.refinementHistory.push({
            prompt: optimizedImagePrompt,
            model: imageModel,
            parameters: imageParameters,
            imageUrl,
            timestamp: new Date()
          });
          
          result = {
            prompt: optimizedImagePrompt,
            negativePrompt: imageNegativePrompt,
            parameters: imageParameters,
            imageUrl,
            predictionId: prediction.id
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
        to: context.requestingAgent || AgentRole.DIRECTOR,
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
        to: context.requestingAgent || AgentRole.DIRECTOR,
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
    
    // Process specific message types
    if (message.type === 'request') {
      await this.handleRequest(message);
    } else if (message.type === 'feedback') {
      await this.handleFeedback(message);
    }
  }
  
  /**
   * Handle request messages
   */
  private async handleRequest(message: AgentMessage): Promise<void> {
    const content = message.content;
    
    // Handle task assignment
    if (content.action === 'assign_task' && content.targetRole === AgentRole.REFINER) {
      // Store the task
      this.context.currentTask = content.task;
      
      // Process the request
      const result = await this.process({
        ...this.context,
        projectId: this.context.projectId || 'temp-project-' + uuidv4().substring(0, 8),
        task: content.task,
        prompt: content.prompt,
        requestingAgent: message.from,
        messages: [] // Ensure messages is included
      });
      
      // Handle the result (Director agent will receive it through process())
    }
  }
  
  /**
   * Handle feedback messages
   */
  private async handleFeedback(message: AgentMessage): Promise<void> {
    const feedback = message.content.feedback;
    const promptToRefine = message.content.prompt || this.context.prompt;
    
    if (promptToRefine && feedback) {
      // Refine based on feedback
      const refinedPrompt = await this.refinePrompt(promptToRefine, feedback);
      
      // Create response message
      const responseMessage: AgentMessage = {
        id: uuidv4(),
        timestamp: new Date(),
        from: this.role,
        to: message.from,
        direction: MessageDirection.OUTGOING,
        type: 'response',
        content: {
          refinedPrompt,
          originalPrompt: promptToRefine,
          feedback
        }
      };
      
      // Add to messages
      this.messages.push(responseMessage);
      
      // Update context
      this.context.prompt = refinedPrompt;
    }
  }
  
  /**
   * Create artwork using the Replicate service
   */
  async createArtwork(project: any, style: any): Promise<any> {
    try {
      // Use AI service to create a detailed prompt for image generation
      const messages: AIMessage[] = [
        {
          role: 'system' as 'system' | 'user' | 'assistant',
          content: `You are the Refiner agent in a multi-agent art creation system. Your role is to refine and improve artwork in René Magritte's distinctive surrealist style.
          
          Refinement parameters:
          - Iteration count: ${this.refinementParameters.iterationCount}
          - Refinement strength: ${this.refinementParameters.refinementStrength}
          - Detail level: ${this.refinementParameters.detailLevel}
          - Preserve style weight: ${this.refinementParameters.preserveStyleWeight}
          
          Magritte Style Expertise:
          
          1. Oil Painting Technique:
          - Flawless oil paint application with no visible brushstrokes
          - Pristine matte finish characteristic of his work
          - Subtle canvas texture in large areas
          - Perfect color transitions while maintaining crisp edges
          - Rich, deep shadows with gentle gradients
          - Crystalline clarity in all details
          - Traditional oil painting luminosity
          - Unified, controlled lighting across the composition
          - Mathematical precision in object placement
          - Clean, sharp edges where needed
          - Consistent surface quality throughout
          - Delicate modeling of forms
          - Perfect balance of elements
          - Subtle reflections and highlights
          
          2. Surrealist Elements:
          - Juxtaposition of ordinary objects in extraordinary contexts
          - Precise, photorealistic rendering of impossible scenarios
          - Common motifs: bowler hats, pipes, apples, clouds, birds
          - Day and night scenes simultaneously
          - Windows and frames as portals
          - Objects floating or suspended in space
          - Scale distortions of familiar items
          - Trompe l'oeil effects
          - Mirror and reflection paradoxes
          
          3. Composition Principles:
          - Clear, centered arrangements
          - Strong horizon lines
          - Balanced asymmetry
          - Use of architectural elements
          - Empty or minimal backgrounds
          - Strategic placement of surreal elements
          - Careful attention to negative space
          - Mathematical precision in object relationships
          
          4. Color and Light:
          - Muted, realistic color palette
          - Soft, diffused lighting
          - Subtle atmospheric effects
          - Careful handling of shadows
          - Limited but precise use of contrast
          - Natural sky colors (day or night)
          - Earth tones and neutral backgrounds
          - Precise rendering of material qualities`
        },
        {
          role: 'user' as 'system' | 'user' | 'assistant',
          content: `Create a detailed prompt for image generation based on the following project and style:
          
          Project: ${project.title} - ${project.description}
          
          Style:
          Name: ${style.name || 'Unnamed Style'}
          Description: ${style.description || 'No description provided'}
          Visual characteristics: ${style.visualCharacteristics ? style.visualCharacteristics.join(', ') : 'None specified'}
          Color palette: ${style.colorPalette ? style.colorPalette.join(', ') : 'None specified'}
          Texture: ${style.texture || 'None specified'}
          Composition: ${style.composition || 'None specified'}
          
          Create a detailed prompt that will be used for a diffusion model to generate an image. The prompt should:
          1. Be highly detailed and descriptive
          2. Incorporate the style elements
          3. Reflect the project requirements
          4. Include specific visual elements, composition, colors, and textures
          5. Be optimized for Stable Diffusion XL
          
          Format your response as a JSON object with the following structure:
          {
            "prompt": "The detailed prompt for image generation",
            "negativePrompt": "Elements to avoid in the generation",
            "title": "A title for the artwork",
            "description": "A description of the expected result"
          }`
        }
      ];
      
      // Get the prompt from AI
      const response = await this.aiService.getCompletion({
        messages,
        temperature: 0.7
      });
      
      // Parse the response to extract the prompt
      let promptData;
      try {
        // Extract JSON from the response
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          promptData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('Error parsing prompt JSON:', parseError);
        // Fallback to using the whole response as the prompt
        promptData = {
          prompt: response.content,
          negativePrompt: "blurry, distorted, low quality, ugly, poorly drawn",
          title: `${style.name} Composition`,
          description: `Artwork in ${style.name} style for project ${project.title}`
        };
      }
      
      // Optimize the prompt for the model
      const optimizedPrompt = await this.optimizeForModel(promptData.prompt, this.replicateService.getDefaultModel());
      
      // Generate the image using Replicate
      const imageOptions = {
        prompt: optimizedPrompt,
        negative_prompt: promptData.negativePrompt || "blurry, distorted, low quality, ugly, poorly drawn",
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 50
      };
      
      // Call Replicate to generate the image
      const prediction = await this.replicateService.runPrediction(
        undefined, // This will use the defaultModel from ReplicateService
        imageOptions
      );
      
      if (prediction.status !== 'succeeded' || !prediction.output) {
        throw new Error(`Image generation failed: ${prediction.error || 'Unknown error'}`);
      }
      
      // Get the image URL from the prediction output
      const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
      
      // Return the refined artwork with the generated image
      return {
        id: uuidv4(),
        title: promptData.title || `${style.name} Composition`,
        description: promptData.description || `A refined artwork created in the ${style.name} style.`,
        prompt: optimizedPrompt,
        negativePrompt: promptData.negativePrompt,
        imageUrl: imageUrl,
        visualElements: style.visualCharacteristics || [],
        composition: {
          structure: style.composition || "Balanced composition",
          focalPoints: ["Generated based on prompt"],
          flow: "Natural visual movement",
          balance: "Harmonious balance of elements"
        },
        colorUsage: {
          palette: style.colorPalette || ["Generated based on prompt"],
          dominant: style.colorPalette ? style.colorPalette[0] : "Generated based on prompt",
          accents: style.colorPalette ? style.colorPalette.slice(-2) : ["Generated based on prompt"],
          transitions: "Natural color transitions"
        },
        texture: {
          type: style.texture || "Generated based on prompt",
          details: "Details generated based on prompt",
          materials: "Digital medium with AI-generated qualities"
        },
        emotionalImpact: {
          primary: "Determined by viewer",
          secondary: "Determined by viewer",
          notes: "The artwork evokes emotions based on the generated image and prompt."
        },
        refinementIterations: this.refinementParameters.iterationCount,
        style: style,
        project: {
          id: project.id,
          title: project.title
        },
        created: new Date()
      };
    } catch (error) {
      console.error('Error creating artwork:', error);
      return this.createDefaultArtwork(project);
    }
  }
  
  /**
   * Create a default artwork when generation fails
   */
  private createDefaultArtwork(project: any): any {
    return {
      id: uuidv4(),
      title: `${project.title} in Magritte Style`,
      description: "A surrealist artwork in the style of René Magritte.",
      prompt: `René Magritte inspired surrealist oil painting for project: ${project.title} - ${project.description}. Photorealistic rendering, impossible juxtapositions, clean precise technique, muted colors, perfect shadows.`,
      negativePrompt: "sketchy, rough, expressionist, abstract, bright colors, visible brushstrokes, modern elements, digital effects",
      imageUrl: null, // No image generated for default artwork
      visualElements: [
        "surreal juxtapositions",
        "photorealistic rendering",
        "impossible scenarios",
        "classic Magritte motifs"
      ],
      composition: {
        structure: "Balanced surrealist composition",
        focalPoints: ["Central paradox", "Clear horizon"],
        flow: "Mathematical precision",
        balance: "Perfect symmetry or calculated asymmetry"
      },
      colorUsage: {
        palette: ["#4A4A4A", "#87CEEB", "#8B4513", "#F5F5F5"],
        dominant: "#87CEEB",
        accents: ["#4A4A4A"],
        transitions: "Subtle gradients"
      },
      texture: {
        type: "Smooth oil painting",
        details: "No visible brushstrokes",
        materials: "Traditional oil on canvas"
      },
      emotionalImpact: {
        primary: "Philosophical contemplation",
        secondary: "Quiet surrealism",
        notes: "The artwork creates a sense of mystery through precise rendering of impossible scenarios."
      },
      refinementIterations: 1,
      style: {
        name: "Magritte Surrealism",
        description: "Precise surrealist oil painting in the style of René Magritte"
      },
      project: {
        id: project.id,
        title: project.title
      },
      created: new Date()
    };
  }
} 