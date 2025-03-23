/**
 * ArtBot Eliza Service
 * Integrates ArtBot multi-agent system with ElizaOS
 */

import { Service, IAgentRuntime, logger } from '@elizaos/core';
import { v4 as uuidv4 } from 'uuid';
import { ArtBotMultiAgentSystem } from '../../artbot-multiagent-system';
import { ElizaLogger, LogLevel } from '../../utils/elizaLogger';
import { defaultGenerationConfig } from '../../config/generationConfig';
import path from 'path';

/**
 * ArtBot Service for ElizaOS
 * Provides art generation capabilities using the multi-agent system
 */
export class ArtBotElizaService extends Service {
  static readonly serviceType = 'artbot';
  readonly capabilityDescription = 'Generates artwork using a multi-agent system with Magritte style specialty';
  
  private multiAgentSystem: ArtBotMultiAgentSystem | null = null;
  private outputDir: string;
  protected configOptions: Record<string, string>;
  
  /**
   * Constructor
   */
  constructor(runtime: IAgentRuntime, config: Record<string, string> = {}) {
    super(runtime);
    this.configOptions = config;
    this.outputDir = path.join(process.cwd(), 'output', 'artbot');
  }
  
  /**
   * Start the service
   */
  static async start(runtime: IAgentRuntime, config: Record<string, string> = {}): Promise<Service> {
    logger.info('Starting ArtBot Eliza service');
    const service = new ArtBotElizaService(runtime, config);
    await service.initialize();
    return service;
  }
  
  /**
   * Stop the service
   */
  async stop(): Promise<void> {
    logger.info('Stopping ArtBot Eliza service');
  }
  
  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    try {
      // Get required services from Eliza
      const aiService = this.runtime.getService('ai');
      const replicateService = this.runtime.getService('replicate');
      
      if (!aiService) {
        logger.warn('AI service not found, ArtBot will use fallback LLM service');
      }
      
      if (!replicateService) {
        logger.warn('Replicate service not found, ArtBot will not be able to generate images');
      }
      
      // Create multi-agent system
      this.multiAgentSystem = new ArtBotMultiAgentSystem({
        aiService,
        replicateService,
        outputDir: this.outputDir
      });
      
      // Initialize the system
      await this.multiAgentSystem.initialize();
      
      // Log system initialization
      ElizaLogger.logSystemInit(this.configOptions);
      
    } catch (error) {
      logger.error('Error initializing ArtBot Eliza service:', error);
      throw error;
    }
  }
  
  /**
   * Generate artwork using the multi-agent system
   * 
   * @param concept The concept to generate art from
   * @param style The style to use (defaults to 'magritte')
   * @param options Additional generation options
   * @returns The generation result with artwork details
   */
  async generateArt(concept: string, style: string = 'bear_pfp', options: Record<string, any> = {}): Promise<any> {
    if (!this.multiAgentSystem) {
      throw new Error('ArtBot multi-agent system not initialized');
    }
    
    try {
      // Log generation start
      ElizaLogger.logGenerationStart(concept, style);
      
      // Create a project configuration
      const projectId = uuidv4().substring(0, 8);
      const project = {
        projectId,
        title: `Art for: ${concept}`,
        description: concept,
        concept,
        style,
        outputFilename: `${style}_${projectId}`,
        requirements: [
          'Generate high-quality image',
          'Follow style guidelines',
          'Create a visually appealing composition'
        ],
        ...options
      };
      
      // Generate the artwork
      const result = await this.multiAgentSystem.runArtProject(project);
      
      // Log generation complete
      ElizaLogger.logGenerationComplete(result);
      
      return result;
    } catch (error) {
      logger.error('Error generating art:', error);
      
      // Log generation failure
      ElizaLogger.log(`Failed to generate art: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
      
      // Return error result
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        artwork: null
      };
    }
  }
} 