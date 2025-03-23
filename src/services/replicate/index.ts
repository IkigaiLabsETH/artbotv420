import { v4 as uuidv4 } from 'uuid';
import { ModelPrediction } from '../../types.js';
import fetch from 'node-fetch';

export { ModelPrediction };

// Define the models
const FLUX_PRO_MODEL = 'black-forest-labs/flux-1.1-pro';
const STABILITY_MODEL = 'stability-ai/stable-diffusion-xl-base-1.0';
const FALLBACK_MODEL = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';

export class ReplicateService {
  private apiKey: string;
  private baseUrl: string = 'https://api.replicate.com/v1';
  private defaultModel: string;
  private defaultWidth: number;
  private defaultHeight: number;
  private defaultNumInferenceSteps: number;
  private defaultGuidanceScale: number;
  private defaultOutputFormat: string;
  
  constructor(config: Record<string, any> = {}) {
    this.apiKey = config.apiKey || process.env.REPLICATE_API_KEY || '';
    this.defaultModel = config.defaultModel || process.env.DEFAULT_IMAGE_MODEL || FLUX_PRO_MODEL;
    this.defaultWidth = config.defaultWidth || parseInt(process.env.IMAGE_WIDTH || '1024', 10);
    this.defaultHeight = config.defaultHeight || parseInt(process.env.IMAGE_HEIGHT || '1024', 10);
    this.defaultNumInferenceSteps = config.defaultNumInferenceSteps || parseInt(process.env.NUM_INFERENCE_STEPS || '28', 10);
    this.defaultGuidanceScale = config.defaultGuidanceScale || parseFloat(process.env.GUIDANCE_SCALE || '3.0');
    this.defaultOutputFormat = config.defaultOutputFormat || process.env.OUTPUT_FORMAT || 'png';
    
    // Ensure dimensions are within limits for all models
    if (this.defaultModel.includes('flux')) {
      // FLUX model can handle up to 1440x1440
      this.defaultWidth = Math.min(Math.max(this.defaultWidth, 768), 1440); 
      this.defaultHeight = Math.min(Math.max(this.defaultHeight, 768), 1440);
    } else {
      // For other models, use standard limits
      this.defaultWidth = Math.min(this.defaultWidth, 1024);
      this.defaultHeight = Math.min(this.defaultHeight, 1024);
    }
  }
  
  async initialize(): Promise<void> {
    if (!this.apiKey) {
      console.warn('Replicate API key not provided. Service will not work properly.');
    } else {
      console.log(`✅ Replicate API key found: ${this.apiKey.substring(0, 5)}...`);
      console.log(`🖼️ Default image model: ${this.defaultModel}`);
      console.log(`📐 Image dimensions: ${this.defaultWidth}x${this.defaultHeight}`);
      console.log(`🔄 Inference steps: ${this.defaultNumInferenceSteps}`);
      console.log(`🎯 Guidance scale: ${this.defaultGuidanceScale}`);
      console.log(`🖼️ Output format: ${this.defaultOutputFormat}`);
    }
  }
  
  /**
   * Get the default model
   */
  getDefaultModel(): string {
    return this.defaultModel;
  }
  
  /**
   * Get the default output format
   */
  getDefaultOutputFormat(): string {
    return this.defaultOutputFormat;
  }
  
  /**
   * Run a prediction on a model
   */
  async runPrediction(
    model: string | undefined,
    input: Record<string, any>
  ): Promise<ModelPrediction> {
    // Use the default model if none is provided
    const selectedModel = model || this.defaultModel;
    
    // Create a prediction object
    const prediction: ModelPrediction = {
      id: uuidv4(),
      model: selectedModel,
      input,
      output: null,
      created: new Date(),
      status: 'pending'
    };
    
    try {
      if (!this.apiKey) {
        throw new Error('Replicate API key not provided');
      }
      
      // Check if this is a FLUX model
      const isFluxModel = selectedModel.includes('flux');
      const isStabilityModel = selectedModel.includes('stability-ai');
      
      // For any model, make sure dimensions are within limits
      if (isFluxModel) {
        input.width = Math.min(Math.max(input.width || this.defaultWidth, 768), 1440);
        input.height = Math.min(Math.max(input.height || this.defaultHeight, 768), 1440);
      } else {
        // For any other model, enforce strict limits
        input.width = Math.min(input.width || this.defaultWidth, 1024);
        input.height = Math.min(input.height || this.defaultHeight, 1024);
      }
      
      // If this is the FLUX model, add default parameters if not provided
      if (isFluxModel) {
        input.num_inference_steps = input.num_inference_steps || this.defaultNumInferenceSteps;
        input.guidance_scale = input.guidance_scale || this.defaultGuidanceScale;
        input.output_format = input.output_format || this.defaultOutputFormat;
        
        // Ensure the prompt has the FLUX trigger word
        if (input.prompt) {
          // Make sure IKIGAI is at the beginning
          if (!input.prompt.trim().startsWith('IKIGAI')) {
            input.prompt = `IKIGAI ${input.prompt.trim()}`;
          }
          
          // Add soft trigger for high-quality output
          if (!input.prompt.includes('detailed high quality')) {
            input.prompt = `${input.prompt}, detailed high quality`;
          }
        }
      }
      
      // If this is a Stability model, handle specific parameters
      if (isStabilityModel) {
        input.num_inference_steps = input.num_inference_steps || 30;
        input.guidance_scale = input.guidance_scale || 7.5;
        
        // Rename parameters to match the model's API
        if (input.guidance_scale && !input.guidance) {
          input.guidance = input.guidance_scale;
          delete input.guidance_scale;
        }
        
        if (input.num_inference_steps && !input.num_steps) {
          input.num_steps = input.num_inference_steps;
          delete input.num_inference_steps;
        }
      }
      
      // Make the API request to create a prediction
      const response = await fetch(`${this.baseUrl}/predictions`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: selectedModel,
          input
        })
      });
      
      // Check for errors
      if (!response.ok) {
        const errorData = await response.json();
        console.warn(`⚠️ Replicate API error: ${JSON.stringify(errorData)}`);
        throw new Error(`Replicate API error: ${JSON.stringify(errorData)}`);
      }
      
      // Parse the response
      const data = await response.json();
      prediction.id = data.id;
      
      // Poll for the prediction result
      const result = await this.pollPrediction(data.id);
      
      // Update the prediction object
      prediction.output = result.output;
      prediction.status = result.status;
      
      return prediction;
    } catch (error) {
      console.error(`Error running prediction: ${error}`);
      prediction.status = 'failed';
      throw error;
    }
  }
  
  /**
   * Poll for a prediction result
   */
  private async pollPrediction(id: string): Promise<any> {
    let attempts = 0;
    const maxAttempts = 30;
    const delay = 1000; // 1 second
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${this.baseUrl}/predictions/${id}`, {
          headers: {
            'Authorization': `Token ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.warn(`⚠️ Error polling prediction: ${JSON.stringify(errorData)}`);
          throw new Error(`Error polling prediction: ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'succeeded') {
          console.log(`✅ Prediction completed: ${id}`);
          
          if (Array.isArray(data.output) && data.output.length > 0) {
            console.log(`🖼️ Output URL: ${data.output[0]}`);
          }
          
          return data;
        } else if (data.status === 'failed') {
          console.error(`❌ Prediction failed: ${id}`);
          throw new Error(`Prediction ${id} failed: ${data.error || 'Unknown error'}`);
        }
        
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, delay));
        attempts++;
      } catch (error) {
        console.error(`Error polling prediction: ${error}`);
        throw error;
      }
    }
    
    throw new Error(`Prediction ${id} timed out after ${maxAttempts} attempts`);
  }

  /**
   * Generate an image using the selected model
   */
  async generateImage(prompt: string, options: Record<string, any> = {}): Promise<string | null> {
    try {
      console.log(`🎨 Using model for image generation: ${this.defaultModel}`);
      
      // Check if this is a FLUX model
      const isFluxModel = this.defaultModel.includes('flux');
      
      // For FLUX model, enhance the prompt with IKIGAI keyword
      if (isFluxModel && !prompt.trim().startsWith('IKIGAI')) {
        prompt = `IKIGAI ${prompt.trim()}`;
      }
      
      console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
      
      // Ensure dimensions are within API limits
      options.width = Math.min(options.width || this.defaultWidth, 1440);
      options.height = Math.min(options.height || this.defaultHeight, 1440);
      
      console.log(`📏 Dimensions: ${options.width}x${options.height}`);
      
      // If this is Flux, set optimal inference steps if not specified
      if (isFluxModel && !options.num_inference_steps) {
        options.num_inference_steps = 45; // Increased from 28 for better quality
      }
      
      // If this is Flux, set optimal guidance scale if not specified
      if (isFluxModel && !options.guidance_scale) {
        options.guidance_scale = 4.5; // Increased from 3.0 for better quality
      }
      
      // Add negative prompt if not provided
      if (!options.negative_prompt) {
        if (isFluxModel) {
          options.negative_prompt = "low quality, blurry, grainy, pixelated, watermark, signature, deformed, disfigured, low resolution, amateur, bad anatomy, cartoon, anime, illustration, 3d render, sketch";
        } else {
          options.negative_prompt = "low quality, bad anatomy, blurry, pixelated, watermark";
        }
      }
      
      // Add clip_skip for flux models if not specified (helps with detail)
      if (isFluxModel && !options.clip_skip) {
        options.clip_skip = 2;
      }
      
      // Set controlnet conditioning scale for more precise control
      if (isFluxModel && !options.controlnet_conditioning_scale) {
        options.controlnet_conditioning_scale = 0.8;
      }
      
      // Prepare input for the model
      const input: Record<string, any> = {
        prompt: prompt,
        ...options
      };
      
      // Log all parameters being used for the generation
      console.log('╭───────────────────────────────────────────╮');
      console.log('│ Generation Parameters:                    │');
      console.log(`│ - Model: ${this.defaultModel.substring(0, 30).padEnd(30)} │`);
      console.log(`│ - Dimensions: ${options.width}x${options.height.toString().padEnd(24)} │`);
      console.log(`│ - Steps: ${options.num_inference_steps || this.defaultNumInferenceSteps}                                │`);
      console.log(`│ - Guidance: ${options.guidance_scale || this.defaultGuidanceScale}                              │`);
      console.log('╰───────────────────────────────────────────╯');
      
      // Try the default model first
      try {
        const prediction = await this.runPrediction(undefined, input);
        
        if (prediction.status === 'succeeded' && prediction.output) {
          const imageUrl = this.extractImageUrl(prediction.output);
          if (imageUrl) {
            return imageUrl;
          }
        }
        
        throw new Error(`Image generation failed: ${prediction.status !== 'succeeded' ? prediction.status : 'No output'}`);
      } catch (error) {
        console.error(`Error generating image with primary model: ${error}`);
        
        // Try a fallback model if the primary fails
        if (this.defaultModel !== FALLBACK_MODEL) {
          console.log(`⚠️ Falling back to ${FALLBACK_MODEL}`);
          
          // Adjust parameters for the fallback model
          const fallbackInput = { ...input };
          
          // Ensure dimensions are within limits for SDXL
          fallbackInput.width = Math.min(fallbackInput.width, 1024);
          fallbackInput.height = Math.min(fallbackInput.height, 1024);
          
          // Update parameters for the fallback model
          if (fallbackInput.guidance_scale) {
            fallbackInput.guidance = fallbackInput.guidance_scale;
            delete fallbackInput.guidance_scale;
          }
          
          if (fallbackInput.num_inference_steps) {
            fallbackInput.num_steps = fallbackInput.num_inference_steps;
            delete fallbackInput.num_inference_steps;
          }
          
          // Remove FLUX-specific parameters that might cause errors
          delete fallbackInput.clip_skip;
          delete fallbackInput.controlnet_conditioning_scale;
          
          // Set SDXL-specific parameters
          fallbackInput.scheduler = "K_EULER";
          fallbackInput.num_outputs = 1;
          
          // Try with fallback model
          try {
            const fallbackPrediction = await this.runPrediction(FALLBACK_MODEL, fallbackInput);
            
            if (fallbackPrediction.status === 'succeeded' && fallbackPrediction.output) {
              const imageUrl = this.extractImageUrl(fallbackPrediction.output);
              if (imageUrl) {
                return imageUrl;
              }
            }
            
            throw new Error(`Fallback image generation failed: ${fallbackPrediction.status !== 'succeeded' ? fallbackPrediction.status : 'No output'}`);
          } catch (fallbackError) {
            console.error(`Error generating image with fallback model: ${fallbackError}`);
            // Fall through to DALL-E fallback if applicable
          }
        }
        
        // If all Replicate models fail, try DALL-E if we have OpenAI API key
        if (process.env.OPENAI_API_KEY) {
          console.log(`⚠️ Falling back to DALL-E`);
          return this.fallbackToDALLE(prompt, options);
        }
        
        // If we reach here, all attempts failed
        throw new Error(`All image generation attempts failed`);
      }
    } catch (error) {
      console.error(`Error generating image: ${error}`);
      throw error;
    }
  }

  /**
   * Extract image URL from prediction output
   */
  private extractImageUrl(output: any): string | null {
    let imageUrl: string | null = null;
    
    if (Array.isArray(output)) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else if (output && typeof output === 'object') {
      // Try to find an image URL in the output object
      const possibleImageKeys = ['image', 'images', 'url', 'urls', 'output'];
      
      for (const key of possibleImageKeys) {
        if (output[key]) {
          if (Array.isArray(output[key])) {
            imageUrl = output[key][0];
          } else {
            imageUrl = output[key];
          }
          break;
        }
      }
    }
    
    return imageUrl;
  }

  private async fallbackToDALLE(prompt: string, options: Record<string, any> = {}): Promise<string | null> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not provided for DALL-E fallback');
      }
      
      console.log('🤖 Using DALL-E for image generation');
      
      // Get the size parameter
      let size = '1024x1024';
      if (options.width && options.height) {
        // OpenAI only supports specific sizes
        const allowedSizes = ['256x256', '512x512', '1024x1024', '1024x1792', '1792x1024'];
        size = '1024x1024'; // Default
        
        // Try to match to closest allowed size
        if (options.width === options.height) {
          // Square image
          if (options.width <= 256) size = '256x256';
          else if (options.width <= 512) size = '512x512';
          else size = '1024x1024';
        } else if (options.width > options.height) {
          // Landscape
          size = '1792x1024';
        } else {
          // Portrait
          size = '1024x1792';
        }
      }
      
      console.log(`📊 Using DALL-E with size: ${size}`);
      
      // Determine the model to use (try dall-e-3 first)
      const model = 'dall-e-3';
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          n: 1,
          size: size,
          quality: 'standard',
          response_format: 'url'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`⚠️ OpenAI API error: ${JSON.stringify(errorData)}`);
        
        // Try dall-e-2 if dall-e-3 fails
        if (model === 'dall-e-3') {
          console.log('⚠️ Falling back to DALL-E 2');
          
          // DALL-E 2 only supports specific sizes
          const dalle2Size = options.width <= 512 ? '512x512' : '1024x1024';
          
          const dalle2Response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'dall-e-2',
              prompt: prompt,
              n: 1,
              size: dalle2Size,
              response_format: 'url'
            })
          });
          
          if (!dalle2Response.ok) {
            const dalle2Error = await dalle2Response.json();
            console.error(`⚠️ DALL-E 2 API error: ${JSON.stringify(dalle2Error)}`);
            throw new Error(`OpenAI API error: ${JSON.stringify(dalle2Error)}`);
          }
          
          const dalle2Data = await dalle2Response.json();
          
          if (dalle2Data.data && dalle2Data.data.length > 0 && dalle2Data.data[0].url) {
            console.log(`✅ DALL-E 2 generated image URL: ${dalle2Data.data[0].url.substring(0, 50)}...`);
            return dalle2Data.data[0].url;
          }
        } else {
          throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
        }
      }
      
      const data = await response.json();
      
      if (data.data && data.data.length > 0 && data.data[0].url) {
        console.log(`✅ DALL-E generated image URL: ${data.data[0].url.substring(0, 50)}...`);
        return data.data[0].url;
      }
      
      throw new Error('No URL in DALL-E response');
    } catch (error) {
      console.error(`❌ Error in DALL-E fallback: ${error}`);
      return null;
    }
  }
} 