/**
 * ArtBot Plugin for ElizaOS
 */

import { Plugin, ModelType, IAgentRuntime, Service, logger } from '@elizaos/core';
import { ArtBotMultiAgentSystem } from '../artbot-multiagent-system';
import { AgentLogger } from '../utils/agentLogger';
import { defaultGenerationConfig } from '../config/generationConfig';
import path from 'path';

/**
 * ArtBot Service for ElizaOS
 */
export class ArtBotService extends Service {
  static serviceType = 'artbot';
  capabilityDescription = 'This service provides art generation capability using a multi-agent system.';
  private artBotSystem: ArtBotMultiAgentSystem | null = null;
  
  constructor(protected runtime: IAgentRuntime) {
    super(runtime);
  }
  
  /**
   * Start the service
   */
  static async start(runtime: IAgentRuntime) {
    logger.info('Starting ArtBot service');
    const service = new ArtBotService(runtime);
    await service.initialize();
    return service;
  }
  
  /**
   * Stop the service
   */
  static async stop(runtime: IAgentRuntime) {
    logger.info('Stopping ArtBot service');
    const service = runtime.getService(ArtBotService.serviceType);
    if (!service) {
      throw new Error('ArtBot service not found');
    }
    service.stop();
  }
  
  /**
   * Initialize the service
   */
  async initialize() {
    try {
      // Import required services
      const aiService = this.runtime.getService('ai');
      const replicateService = this.runtime.getService('replicate');
      
      if (!aiService) {
        logger.warn('AI service not found, ArtBot will use fallback AI service');
      }
      
      if (!replicateService) {
        logger.warn('Replicate service not found, ArtBot will not be able to generate images');
      }
      
      // Create the ArtBot system
      this.artBotSystem = new ArtBotMultiAgentSystem({
        aiService: aiService || null,
        replicateService: replicateService || null,
        outputDir: path.join(process.cwd(), 'output')
      });
      
      // Initialize the system
      await this.artBotSystem.initialize();
      
      logger.info('ArtBot service initialized');
    } catch (error) {
      logger.error('Error initializing ArtBot service:', error);
      throw error;
    }
  }
  
  /**
   * Generate art using the ArtBot system
   */
  async generateArt(concept: string, style?: string) {
    try {
      if (!this.artBotSystem) {
        throw new Error('ArtBot system not initialized');
      }
      
      // Create a project configuration
      const project = {
        title: concept,
        description: `Generate art for: ${concept}`,
        concept,
        style: style || 'magritte',
        requirements: [
          'Generate high-quality art',
          'Use the specified style',
          'Create a coherent composition'
        ]
      };
      
      // Run the art project
      const result = await this.artBotSystem.runArtProject(project);
      
      return result;
    } catch (error) {
      logger.error('Error generating art:', error);
      throw error;
    }
  }
  
  /**
   * Stop the service
   */
  async stop() {
    logger.info('ArtBot service stopped');
  }
}

/**
 * ArtBot Plugin for ElizaOS
 */
export const artbotPlugin: Plugin = {
  name: 'plugin-artbot',
  description: 'ArtBot image generation plugin for ElizaOS',
  config: {
    REPLICATE_API_KEY: process.env.REPLICATE_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  },
  async init(config: Record<string, string>) {
    logger.info('Initializing ArtBot plugin');
    
    // Set environment variables
    if (config.REPLICATE_API_KEY) {
      process.env.REPLICATE_API_KEY = config.REPLICATE_API_KEY;
    }
    
    if (config.ANTHROPIC_API_KEY) {
      process.env.ANTHROPIC_API_KEY = config.ANTHROPIC_API_KEY;
    }
    
    if (config.OPENAI_API_KEY) {
      process.env.OPENAI_API_KEY = config.OPENAI_API_KEY;
    }
  },
  services: [ArtBotService],
  actions: [
    {
      name: 'GENERATE_ART',
      similes: ['CREATE_ART', 'MAKE_IMAGE', 'GENERATE_IMAGE'],
      description: 'Generates art based on a text description',
      
      validate: async (runtime: IAgentRuntime, message: any, state: any): Promise<boolean> => {
        // Check if the message has text content
        return !!message?.content?.text;
      },
      
      handler: async (runtime: IAgentRuntime, message: any, state: any, options: any, callback: any) => {
        try {
          // Get the ArtBot service
          const artBotService = runtime.getService('artbot') as ArtBotService;
          
          // Extract concept from message
          const concept = message.content.text;
          
          // Extract style from options if available
          const style = options?.style || 'magritte';
          
          // Generate art
          const result = await artBotService.generateArt(concept, style);
          
          // Create a response
          const response = {
            text: `Generated art for "${concept}": ${result.artwork?.imageUrl || 'No image generated'}`,
            images: result.artwork?.imageUrl ? [result.artwork.imageUrl] : [],
            success: result.success,
            source: message.content.source
          };
          
          // Call back with the response
          await callback(response);
          
          return response;
        } catch (error) {
          logger.error('Error handling GENERATE_ART action:', error);
          
          // Create an error response
          const errorResponse = {
            text: `Error generating art: ${error instanceof Error ? error.message : String(error)}`,
            success: false,
            source: message.content.source
          };
          
          // Call back with the error response
          await callback(errorResponse);
          
          return errorResponse;
        }
      },
      
      examples: [
        [
          {
            name: 'user',
            content: {
              text: 'Generate a surrealist bear portrait in Magritte style',
            },
          },
          {
            name: 'eliza',
            content: {
              text: 'Generated art for "Generate a surrealist bear portrait in Magritte style": https://example.com/image.png',
              images: ['https://example.com/image.png'],
              success: true,
            },
          },
        ],
      ],
    }
  ],
  routes: [
    {
      path: '/artbot/generate',
      type: 'POST',
      handler: async (req: any, res: any) => {
        try {
          // Get the ArtBot service
          const runtime = req.runtime;
          const artBotService = runtime.getService('artbot') as ArtBotService;
          
          // Extract concept and style from request body
          const { concept, style } = req.body;
          
          if (!concept) {
            res.status(400).json({
              success: false,
              error: 'Missing concept in request body'
            });
            return;
          }
          
          // Generate art
          const result = await artBotService.generateArt(concept, style);
          
          // Return the result
          res.json(result);
        } catch (error) {
          logger.error('Error in /artbot/generate route:', error);
          
          // Return an error response
          res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }
    }
  ]
};

export default artbotPlugin; 