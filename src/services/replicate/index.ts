import { v4 as uuidv4 } from 'uuid';
import { ModelPrediction } from '../../types.js';
import fetch from 'node-fetch';

export { ModelPrediction };

// Define the models
const FLUX_PRO_MODEL = 'black-forest-labs/flux-1.1-pro';
const STABILITY_MODEL = 'stability-ai/stable-diffusion-xl-base-1.0';
const FALLBACK_MODEL = 'stability-ai/sdxl';

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
    
    // Ensure dimensions are within limits
    this.defaultWidth = Math.min(this.defaultWidth, 1440);
    this.defaultHeight = Math.min(this.defaultHeight, 1440);
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
      input.width = Math.min(input.width || this.defaultWidth, 1440);
      input.height = Math.min(input.height || this.defaultHeight, 1440);
      
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

  async generateImage(prompt: string, options: Record<string, any> = {}): Promise<string | null> {
    try {
      console.log(`🎨 Using model for image generation: ${this.defaultModel}`);
      
      // Check if this is a FLUX model
      const isFluxModel = this.defaultModel.includes('flux');
      
      // For FLUX model, enhance the prompt with IKIGAI keyword
      if (isFluxModel && !prompt.includes('IKIGAI')) {
        prompt = `IKIGAI ${prompt}`;
      }
      
      // Ensure dimensions are within limits
      options.width = Math.min(options.width || this.defaultWidth, 1440);
      options.height = Math.min(options.height || this.defaultHeight, 1440);
      
      // Add negative prompt if not provided
      if (!options.negative_prompt) {
        options.negative_prompt = "low quality, bad anatomy, blurry, pixelated, watermark";
      }
      
      // Prepare input for the model
      const input: Record<string, any> = {
        prompt: prompt,
        ...options
      };
      
      // Try the default model first
      try {
        const prediction = await this.runPrediction(this.defaultModel, input);
        
        // Get the image URL from the prediction output
        if (prediction.status === 'succeeded' && prediction.output) {
          let imageUrl: string | null = this.extractImageUrl(prediction.output);
          if (imageUrl) return imageUrl;
        }
        
        throw new Error('No output from default model');
      } catch (error) {
        console.warn(`⚠️ ${this.defaultModel} model failed, trying Stability model`);
        
        // Retry with Stability model
        try {
          // Adjust parameters for Stability model
          const stabilityInput = { ...input };
          
          // Convert specific parameters
          if (stabilityInput.guidance_scale) {
            stabilityInput.guidance = stabilityInput.guidance_scale;
            delete stabilityInput.guidance_scale;
          }
          
          if (stabilityInput.num_inference_steps) {
            stabilityInput.num_steps = stabilityInput.num_inference_steps;
            delete stabilityInput.num_inference_steps;
          }
          
          const prediction = await this.runPrediction(STABILITY_MODEL, stabilityInput);
          
          // Get the image URL from the prediction output
          if (prediction.status === 'succeeded' && prediction.output) {
            let imageUrl: string | null = this.extractImageUrl(prediction.output);
            if (imageUrl) return imageUrl;
          }
          
          throw new Error('No output from Stability model');
        } catch (error) {
          console.warn(`⚠️ Stability model failed, trying fallback model`);
          
          // Try fallback model
          try {
            const fallbackPrediction = await this.runPrediction(FALLBACK_MODEL, input);
            
            // Get the image URL from the prediction output
            if (fallbackPrediction.status === 'succeeded' && fallbackPrediction.output) {
              let imageUrl: string | null = this.extractImageUrl(fallbackPrediction.output);
              if (imageUrl) return imageUrl;
            }
            
            throw new Error('No output from fallback model');
          } catch (fallbackError) {
            console.error(`❌ All Replicate models failed. Last error: ${fallbackError}`);
            // Fallback to DALL-E as a last resort
            return await this.fallbackToDALLE(prompt, options);
          }
        }
      }
    } catch (error) {
      console.error(`Error generating image: ${error}`);
      
      // Try falling back to DALL-E
      console.log('🎨 Falling back to OpenAI DALL-E for image generation');
      return await this.fallbackToDALLE(prompt, options);
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
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: size,
          quality: 'standard'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
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