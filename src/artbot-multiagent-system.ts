/**
 * ArtBot Multi-Agent System
 * Coordinates the agents for art generation
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentRole, DirectorAgent, IdeatorAgent, StylistAgent, RefinerAgent, CriticAgent, CharacterGeneratorAgent, MetadataGeneratorAgent, MultiAgentSystemConfig, AgentContext, AgentResult } from './agents/types';
import { DirectorAgent as DirectorAgentImpl } from './agents/DirectorAgent';
import { CharacterGenerator } from './generators/CharacterGenerator';
import { AgentLogger, LogLevel } from './utils/agentLogger';
import { defaultGenerationConfig, GenerationConfig } from './config/generationConfig';
import { ReplicateService } from './services/replicate';
import { StyleIntegrationService } from './services/style/StyleIntegrationService';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Updated MultiAgentSystemConfig interface with optional styleIntegrationService
 */
interface EnhancedMultiAgentSystemConfig extends MultiAgentSystemConfig {
  styleIntegrationService?: StyleIntegrationService;
}

/**
 * ArtBot Multi-Agent System
 * Implements a collaborative multi-agent system for art generation
 */
export class ArtBotMultiAgentSystem {
  private config: EnhancedMultiAgentSystemConfig;
  private director: DirectorAgent;
  private agents: Map<AgentRole, Agent>;
  private initialized: boolean = false;
  private generationConfig: GenerationConfig;
  private outputDir: string;
  private replicateService: ReplicateService | null;
  private styleIntegrationService: StyleIntegrationService | null;
  
  /**
   * Constructor
   */
  constructor(config: EnhancedMultiAgentSystemConfig) {
    this.config = config;
    this.agents = new Map();
    this.generationConfig = defaultGenerationConfig;
    this.outputDir = config.outputDir || path.join(process.cwd(), 'output');
    this.replicateService = config.replicateService;
    
    // Initialize StyleIntegrationService if AIService is available
    this.styleIntegrationService = config.styleIntegrationService || 
      (config.aiService ? new StyleIntegrationService(config.aiService) : null);
    
    // Create the director agent
    this.director = new DirectorAgentImpl(this.generationConfig);
    
    // Register the director agent
    this.agents.set(AgentRole.DIRECTOR, this.director);
    
    if (this.styleIntegrationService) {
      AgentLogger.log('StyleIntegrationService initialized', LogLevel.INFO);
    }
  }
  
  /**
   * Initialize the multi-agent system
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    // Initialize all registered agents
    for (const agent of this.agents.values()) {
      await agent.initialize();
    }
    
    // Initialize the director agent
    await this.director.initialize();
    
    // Register the director agent as initialized
    this.initialized = true;
    
    // Log system start
    AgentLogger.logSystemStart({
      outputDir: this.outputDir,
      aiService: this.config.aiService ? 'Available' : 'Unavailable',
      replicateService: this.replicateService ? 'Available' : 'Unavailable',
      memorySystem: this.config.memorySystem ? 'Available' : 'Unavailable',
      styleService: this.config.styleService ? 'Available' : 'Unavailable',
      agentCount: this.agents.size
    });
  }
  
  /**
   * Register an agent
   */
  registerAgent(agent: Agent): void {
    this.agents.set(agent.role, agent);
    this.director.registerAgent(agent);
  }
  
  /**
   * Get an agent by role
   */
  getAgent(role: AgentRole): Agent | undefined {
    return this.agents.get(role);
  }
  
  /**
   * Get all registered agents
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
  
  /**
   * Run an art project
   */
  async runArtProject(project: any): Promise<any> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      // Log project start
      AgentLogger.log(`\n🎨 Starting art project: ${project.title || 'Untitled'}`);
      
      // Extract project parameters
      const concept = project.concept || project.title || 'Untitled';
      const style = project.style || 'magritte';
      
      // Create a workflow context
      const context = await this.director.createWorkflow(concept, style);
      
      // Add project-specific data to the context
      const projectContext: AgentContext = {
        ...context,
        projectId: uuidv4(),
        title: project.title,
        description: project.description,
        requirements: project.requirements || [],
        outputFilename: project.outputFilename || `output-${context.projectId.substring(0, 8)}`,
        artDirection: project.artDirection || {},
        characterOptions: project.characterOptions || {}
      };
      
      // Enhance the project context with StyleIntegrationService if available
      if (this.styleIntegrationService && (style === 'magritte' || style === 'bear_pfp')) {
        try {
          const enhancedPromptResult = await this.styleIntegrationService.generateEnhancedPrompt(
            concept,
            { 
              seriesId: project.seriesId,
              templateId: project.templateId,
              emphasis: project.emphasis,
              additionalElements: project.additionalElements
            }
          );
          
          // Add style enhancement data to the context
          projectContext.enhancedPrompt = enhancedPromptResult.prompt;
          projectContext.negativePrompt = enhancedPromptResult.negativePrompt;
          projectContext.styleInfo = enhancedPromptResult.integrationInfo;
          projectContext.series = enhancedPromptResult.series;
          projectContext.templateName = enhancedPromptResult.templateName;
          
          AgentLogger.log(`Enhanced prompt generated using all style services`, LogLevel.INFO);
        } catch (styleError) {
          AgentLogger.log(`Error enhancing prompt with StyleIntegrationService: ${styleError instanceof Error ? styleError.message : String(styleError)}`, LogLevel.WARNING);
          // Continue with regular processing
        }
      }
      
      // Process the context
      const result = await this.director.process(projectContext);
      
      // Save the results
      if (result.success && result.output) {
        const outputResult = await this.saveResults(result);
        return outputResult;
      }
      
      return {
        success: false,
        error: result.error || new Error('Unknown error occurred'),
        artwork: null
      };
    } catch (error) {
      AgentLogger.log(`❌ Error running art project: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
      
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        artwork: null
      };
    }
  }
  
  /**
   * Save the results of a generation
   */
  private async saveResults(result: AgentResult): Promise<any> {
    if (!result.success || !result.output) {
      return {
        success: false,
        error: new Error('No output to save'),
        artwork: null
      };
    }
    
    try {
      const output = result.output;
      
      // Ensure we have a prompt
      if (!output.prompt) {
        // Use the refined prompt from the last stage if available
        output.prompt = output.refinedPrompt || output.concept || 'Default prompt';
        AgentLogger.log(`Using fallback prompt: ${output.prompt.substring(0, 50)}...`, LogLevel.WARNING);
      }
      
      // Generate the image if we have a Replicate service and no imageUrl yet
      if (!output.imageUrl && this.replicateService) {
        try {
          // Get any model-specific options from the context
          const options: Record<string, any> = {};
          
          // Add model configuration if available
          if (output.modelConfig) {
            if (output.modelConfig.dimensions) {
              options.width = output.modelConfig.dimensions.width;
              options.height = output.modelConfig.dimensions.height;
            }
            
            if (output.modelConfig.inferenceSteps) {
              options.num_inference_steps = output.modelConfig.inferenceSteps;
            }
            
            if (output.modelConfig.guidanceScale) {
              options.guidance_scale = output.modelConfig.guidanceScale;
            }
          }
          
          // Add negative prompt if specified
          if (output.negativePrompt) {
            options.negative_prompt = output.negativePrompt;
          }
          
          // Log the settings for better debugging
          AgentLogger.logGenerationSettings({
            model: output.model || this.replicateService.getDefaultModel(),
            dimensions: {
              width: options.width || 2048,
              height: options.height || 2048
            },
            inferenceSteps: options.num_inference_steps || 28,
            guidanceScale: options.guidance_scale || 3
          });
          
          // Set the generation process to start
          AgentLogger.logGenerationProcess('Starting image generation', 0);
          
          // Generate the image using the Replicate service
          const imageResult = await this.replicateService.generateImage(output.prompt, {
            ...options,
            model: output.model
          });
          
          // Update progress
          AgentLogger.logGenerationProcess('Image generation complete', 1);
          
          // If we have an image result, update the output
          if (imageResult) {
            output.imageUrl = imageResult;
            
            // Log the successful generation
            AgentLogger.log(`Artwork generated: ${output.imageUrl}`, LogLevel.SUCCESS);
          } else {
            throw new Error('Image generation failed');
          }
        } catch (error) {
          // Log the error
          AgentLogger.log(`Error generating image: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
          
          // Try one more time with fallback settings
          try {
            AgentLogger.log('Attempting image generation with fallback settings...', LogLevel.WARNING);
            
            // Use more conservative settings for the fallback attempt
            const fallbackOptions = {
              width: 768,
              height: 768,
              num_inference_steps: 28,
              guidance_scale: 3,
              negative_prompt: output.negativePrompt || 'low quality, bad anatomy, blurry, pixelated'
            };
            
            // Log the fallback settings
            AgentLogger.logGenerationSettings({
              model: 'black-forest-labs/flux-1.1-pro',
              dimensions: {
                width: fallbackOptions.width,
                height: fallbackOptions.height
              },
              inferenceSteps: fallbackOptions.num_inference_steps,
              guidanceScale: fallbackOptions.guidance_scale
            });
            
            // Try with simplified model specification
            const imageResult = await this.replicateService.generateImage(output.prompt, fallbackOptions);
            
            if (imageResult) {
              output.imageUrl = imageResult;
              AgentLogger.log(`Artwork generated successfully with fallback settings: ${output.imageUrl}`, LogLevel.SUCCESS);
            } else {
              throw new Error('Image generation failed with fallback settings');
            }
          } catch (fallbackError) {
            AgentLogger.log(`Error generating image with fallback settings: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`, LogLevel.ERROR);
            
            // Return partial results even if image generation failed
            return {
              success: false,
              error: new Error(`Image generation failed: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`),
              artwork: {
                prompt: output.prompt,
                negativePrompt: output.negativePrompt,
                imageUrl: null,
                files: {},
                character: output.character,
                metadata: output.metadata
              }
            };
          }
        }
      }
      
      // Create the output filename
      const outputFilename = output.outputFilename || `artwork-${output.projectId || new Date().getTime().toString()}`;
      
      // Download the image if we have a URL
      const files: Record<string, string> = {};
      if (output.imageUrl) {
        try {
          // Ensure the output directory exists
          if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
          }
          
          // Download the image
          const imageResponse = await fetch(output.imageUrl);
          if (!imageResponse.ok) {
            throw new Error(`Failed to download image: ${imageResponse.statusText}`);
          }
          
          const imageArrayBuffer = await imageResponse.arrayBuffer();
          const imageBuffer = Buffer.from(imageArrayBuffer);
          
          // Save the image
          const imagePath = path.join(this.outputDir, `${outputFilename}.png`);
          fs.writeFileSync(imagePath, imageBuffer);
          files.image = imagePath;
          
          AgentLogger.log(`Image saved to: ${imagePath}`, LogLevel.INFO);
        } catch (error) {
          AgentLogger.log(`Error saving image: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
          // Continue with the process, but without saving the image
        }
      }
      
      // Create the artwork metadata
      let metadata: Record<string, any> = {
        name: output.name || 'Untitled Artwork',
        description: output.description || `Generated artwork based on: ${output.concept}`,
        prompt: output.prompt,
        style: output.style,
        timestamp: new Date().toISOString(),
        artDirection: output.artDirection,
        character: output.character
      };
      
      // Use metadata from MetadataGeneratorAgent if available
      if (output.metadata) {
        metadata = { ...metadata, ...output.metadata };
        AgentLogger.log(`Using enhanced metadata from MetadataGeneratorAgent`, LogLevel.INFO);
      }
      
      // Use the critic evaluation if available
      if (output.evaluation) {
        metadata.evaluation = output.evaluation;
        metadata.qualityScore = output.evaluation.score;
        AgentLogger.log(`Added evaluation data from CriticAgent with score: ${output.evaluation.score}`, LogLevel.INFO);
      }
      
      // Use the character info if available
      if (output.character) {
        metadata.characterInfo = output.character;
        AgentLogger.log(`Added character info: ${output.character.name}`, LogLevel.INFO);
      }
      
      // Save the metadata
      if (Object.keys(files).length > 0) {
        try {
          const metadataPath = path.join(this.outputDir, `${outputFilename}.json`);
          fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
          files.metadata = metadataPath;
          
          AgentLogger.log(`Metadata saved to: ${metadataPath}`, LogLevel.INFO);
        } catch (error) {
          AgentLogger.log(`Error saving metadata: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
          // Continue with the process, but without saving the metadata
        }
      }
      
      // Return the result
      return {
        success: true,
        artwork: {
          prompt: output.prompt,
          imageUrl: output.imageUrl,
          style: output.style,
          files,
          metadata
        }
      };
    } catch (error) {
      AgentLogger.log(`Error saving results: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
      
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        artwork: null
      };
    }
  }
} 