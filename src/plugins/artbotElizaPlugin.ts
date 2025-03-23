/**
 * ArtBot Plugin for ElizaOS
 * Integrates the ArtBot multi-agent art generation system with ElizaOS
 */

import {
  Plugin,
  IAgentRuntime,
  Action,
  Memory,
  Content,
  State,
  HandlerCallback,
  logger,
  Service,
  Route
} from '@elizaos/core';
import { z } from 'zod';
import { ArtBotElizaService } from '../services/eliza';
import { ElizaLogger, LogLevel } from '../utils/elizaLogger';
import path from 'path';

/**
 * Define the configuration schema for the plugin
 */
const configSchema = z.object({
  REPLICATE_API_KEY: z
    .string()
    .min(1, 'Replicate API key is required for image generation')
    .optional()
    .transform((val) => {
      if (!val) {
        logger.warn('Replicate API key is not provided - image generation will not work');
      }
      return val;
    }),
  ANTHROPIC_API_KEY: z
    .string()
    .min(1, 'Anthropic API key is recommended for optimal results')
    .optional()
    .transform((val) => {
      if (!val) {
        logger.warn('Anthropic API key is not provided - fallback AI will be used');
      }
      return val;
    }),
  OPENAI_API_KEY: z
    .string()
    .min(1, 'OpenAI API key is recommended as an alternative AI provider')
    .optional()
    .transform((val) => {
      if (!val) {
        logger.warn('OpenAI API key is not provided - may limit AI provider options');
      }
      return val;
    }),
});

/**
 * Generate Image Action
 * Allows users to generate images with the ArtBot system
 */
const generateImageAction: Action = {
  name: 'GENERATE_IMAGE',
  similes: ['CREATE_ART', 'MAKE_IMAGE', 'GENERATE_ART'],
  description: 'Generates an image based on a text description',

  validate: async (runtime: IAgentRuntime, message: Memory, state?: State): Promise<boolean> => {
    // Check if the message has text content
    return !!message?.content?.text;
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    options?: any,
    callback?: HandlerCallback,
    responses?: Memory[]
  ): Promise<Content> => {
    try {
      logger.info('Handling GENERATE_IMAGE action');

      // Get the ArtBot service
      const service = runtime.getService('artbot');
      if (!service) {
        throw new Error('ArtBot service not found');
      }
      
      // Cast to ArtBotElizaService type
      const artBotService = service as ArtBotElizaService;

      // Extract concept from message
      const concept = message.content.text || '';
      
      // Extract style from options if available
      const style = options?.style || 'bear_pfp';

      ElizaLogger.log(`Generating image for concept: "${concept}" with style: ${style}`);

      // Generate art using the service
      const result = await artBotService.generateArt(concept, style);

      // Create response content
      const responseContent: Content = {
        text: `Generated art for "${concept}": ${result.artwork?.imageUrl || 'No image generated'}`,
        images: result.artwork?.imageUrl ? [result.artwork.imageUrl] : [],
        success: result.success,
        source: message.content.source,
      };

      // Call back with the result
      if (callback) {
        await callback(responseContent);
      }

      return responseContent;
    } catch (error) {
      logger.error('Error in GENERATE_IMAGE action:', error);
      
      // Create an error response
      const errorResponse: Content = {
        text: `Error generating image: ${error instanceof Error ? error.message : String(error)}`,
        success: false,
        source: message.content.source,
      };
      
      // Call back with the error response
      if (callback) {
        await callback(errorResponse);
      }
      
      return errorResponse;
    }
  },

  examples: [
    [
      {
        name: '{{name1}}',
        content: {
          text: 'Generate an image of a distinguished bear portrait in Magritte style with a bowler hat',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: 'Generated art for "Generate an image of a distinguished bear portrait in Magritte style with a bowler hat": https://example.com/image.png',
          images: ['https://example.com/image.png'],
          success: true,
        },
      },
    ],
  ],
};

/**
 * ArtBot HTTP Routes
 */
const artbotRoutes: Route[] = [
  {
    path: '/artbot/generate',
    type: 'POST',
    handler: async (req: any, res: any) => {
      try {
        // Get the ArtBot service
        const runtime = req.runtime;
        const artBotService = runtime.getService('artbot') as ArtBotElizaService;
        
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
  },
  {
    path: '/artbot/styles',
    type: 'GET',
    handler: async (_req: any, res: any) => {
      try {
        // Return available styles
        res.json({
          success: true,
          styles: [
            {
              id: 'bear_pfp',
              name: 'Surrealist Bear Portrait',
              description: 'Distinguished bear portrait in Magritte\'s surrealist style'
            },
            {
              id: 'magritte',
              name: 'Magritte Surrealist',
              description: 'René Magritte\'s distinctive surrealist style with Belgian techniques'
            }
          ]
        });
      } catch (error) {
        logger.error('Error in /artbot/styles route:', error);
        
        // Return an error response
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }
];

/**
 * ArtBot plugin for ElizaOS
 */
export const artbotElizaPlugin: Plugin = {
  name: 'artbot',
  description: 'ArtBot image generation plugin for ElizaOS',
  config: {
    REPLICATE_API_KEY: process.env.REPLICATE_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  
  async init(config: Record<string, string>) {
    logger.info('Initializing ArtBot plugin');
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      // Set all environment variables at once
      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
      }
      
      // Create output directory
      const outputDir = path.join(process.cwd(), 'output', 'artbot');
      try {
        const fs = require('fs');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
          logger.info(`Created output directory: ${outputDir}`);
        }
      } catch (err) {
        logger.warn(`Could not create output directory: ${err instanceof Error ? err.message : String(err)}`);
      }
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid plugin configuration: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw error;
    }
  },
  
  services: [ArtBotElizaService],
  actions: [generateImageAction],
  routes: artbotRoutes,
  
  tests: [
    {
      name: 'artbot_test_suite',
      tests: [
        {
          name: 'artbot_service_available',
          fn: async (runtime) => {
            logger.debug('artbot_service_available test run by', runtime.character.name);
            // Verify the plugin is loaded properly
            const service = runtime.getService('artbot');
            if (!service) {
              throw new Error('ArtBot service not found');
            }
          },
        },
        {
          name: 'generate_image_action_registered',
          fn: async (runtime) => {
            // Check if the action is registered
            const actions = artbotElizaPlugin.actions || [];
            const actionExists = actions.some((a) => a.name === 'GENERATE_IMAGE');
            if (!actionExists) {
              throw new Error('GENERATE_IMAGE action not found in plugin');
            }
          },
        },
      ],
    },
  ],
};

export default artbotElizaPlugin; 