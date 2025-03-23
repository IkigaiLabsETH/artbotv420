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
  
  /**
   * Constructor
   */
  constructor(config: MultiAgentSystemConfig) {
    this.config = config;
    this.agents = new Map();
    this.generationConfig = defaultGenerationConfig;
    this.outputDir = config.outputDir || path.join(process.cwd(), 'output');
    
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
      replicateService: this.config.replicateService ? 'Available' : 'Unavailable',
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
      
      // Ensure we have a prompt and imageUrl
      if (!output.prompt || !output.imageUrl) {
        return {
          success: false,
          error: new Error('Missing prompt or imageUrl in output'),
          artwork: null
        };
      }
      
      // Create the output file paths
      const baseFilename = output.outputFilename || `output-${output.projectId.substring(0, 8)}`;
      const promptPath = path.join(this.outputDir, `${baseFilename}-prompt.txt`);
      const imagePath = path.join(this.outputDir, `${baseFilename}-image.txt`);
      const metadataPath = path.join(this.outputDir, `${baseFilename}-metadata.json`);
      
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