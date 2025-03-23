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
import * as fs from 'fs';
import * as path from 'path';

/**
 * ArtBot Multi-Agent System
 * Implements a collaborative multi-agent system for art generation
 */
export class ArtBotMultiAgentSystem {
  private config: MultiAgentSystemConfig;
  private director: DirectorAgent;
  private agents: Map<AgentRole, Agent>;
  private initialized: boolean = false;
  private generationConfig: GenerationConfig;
  private outputDir: string;
  private replicateService: ReplicateService | null;
  
  /**
   * Constructor
   */
  constructor(config: MultiAgentSystemConfig) {
    this.config = config;
    this.agents = new Map();
    this.generationConfig = defaultGenerationConfig;
    this.outputDir = config.outputDir || path.join(process.cwd(), 'output');
    this.replicateService = config.replicateService;
    
    // Create the director agent
    this.director = new DirectorAgentImpl(this.generationConfig);
    
    // Register the director agent
    this.agents.set(AgentRole.DIRECTOR, this.director);
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
        artDirection: project.artDirection || {}
      };
      
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
          
          // Log that we're generating an image
          AgentLogger.log(`🖼️ Generating image using Replicate...`, LogLevel.INFO);
          
          // Generate the image
          const imageUrl = await this.replicateService.generateImage(output.prompt, options);
          
          if (imageUrl) {
            output.imageUrl = imageUrl;
            AgentLogger.log(`✅ Image generated: ${imageUrl.substring(0, 50)}...`, LogLevel.INFO);
          } else {
            throw new Error('Failed to generate image URL');
          }
        } catch (error) {
          AgentLogger.log(`❌ Error generating image: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
          
          // Use a placeholder image URL in case of failure
          output.imageUrl = 'https://placehold.co/1024x1024/EEE/31343C?text=ArtBot+Test+Image';
          AgentLogger.log('Using placeholder image URL due to generation error', LogLevel.WARNING);
        }
      } else if (!output.imageUrl) {
        // No Replicate service and no imageUrl, use a placeholder
        output.imageUrl = 'https://placehold.co/1024x1024/EEE/31343C?text=ArtBot+Test+Image';
        AgentLogger.log('Using placeholder image URL for test', LogLevel.WARNING);
      }
      
      // Create the output file paths
      const baseFilename = output.outputFilename || `output-${output.projectId.substring(0, 8)}`;
      const promptPath = path.join(this.outputDir, `${baseFilename}-prompt.txt`);
      const imagePath = path.join(this.outputDir, `${baseFilename}-image.txt`);
      const metadataPath = path.join(this.outputDir, `${baseFilename}-metadata.json`);
      
      // Ensure the output directory exists
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }
      
      // Save the prompt
      fs.writeFileSync(promptPath, output.prompt);
      
      // Save the image URL
      fs.writeFileSync(imagePath, output.imageUrl);
      
      // Create metadata
      const metadata = {
        id: output.projectId,
        title: output.title || 'Untitled',
        description: output.description || '',
        prompt: output.prompt,
        style: output.style,
        imageUrl: output.imageUrl,
        character: output.character,
        createdAt: new Date().toISOString()
      };
      
      // Save the metadata
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      // Return the artwork details
      return {
        success: true,
        artwork: {
          id: output.projectId,
          title: output.title || 'Untitled',
          description: output.description || '',
          prompt: output.prompt,
          imageUrl: output.imageUrl,
          character: output.character,
          style: output.style,
          files: {
            prompt: promptPath,
            image: imagePath,
            metadata: metadataPath
          }
        }
      };
    } catch (error) {
      AgentLogger.log(`❌ Error saving results: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
      
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        artwork: result.output
      };
    }
  }
} 