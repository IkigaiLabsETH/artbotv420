/**
 * Enhanced Logger for Eliza ArtBot Plugin
 * Provides structured logging for art generation in Eliza environment
 */

import { logger } from '@elizaos/core';
import chalk from 'chalk';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export class ElizaLogger {
  /**
   * Log a standard message
   */
  static log(message: string, level: LogLevel = LogLevel.INFO): void {
    switch (level) {
      case LogLevel.DEBUG:
        logger.debug(message);
        break;
      case LogLevel.INFO:
        logger.info(message);
        break;
      case LogLevel.WARNING:
        logger.warn(message);
        break;
      case LogLevel.ERROR:
        logger.error(message);
        break;
    }
  }

  /**
   * Log system initialization
   */
  static logSystemInit(config: Record<string, any>): void {
    logger.info('╭───────────────────────────────────────────╮');
    logger.info('│           ArtBot System Initialized       │');
    logger.info('├───────────────────────────────────────────┤');
    
    if (config.REPLICATE_API_KEY) {
      logger.info('│ ✓ Replicate API: Available               │');
    } else {
      logger.warn('│ ✗ Replicate API: Missing                 │');
    }
    
    if (config.ANTHROPIC_API_KEY) {
      logger.info('│ ✓ Anthropic API: Available               │');
    } else {
      logger.warn('│ ✗ Anthropic API: Missing (Fallback)      │');
    }
    
    if (config.OPENAI_API_KEY) {
      logger.info('│ ✓ OpenAI API: Available                  │');
    } else {
      logger.warn('│ ✗ OpenAI API: Missing                    │');
    }
    
    logger.info('│                                           │');
    logger.info('│ Default Style: Magritte Surrealist        │');
    logger.info('│ Default Model: Flux 1.1 Pro               │');
    logger.info('╰───────────────────────────────────────────╯');
  }

  /**
   * Log generation start
   */
  static logGenerationStart(concept: string, style: string): void {
    logger.info('╭───────────────────────────────────────────╮');
    logger.info(`│ 🎨 Generating: ${concept.substring(0, 25).padEnd(25)} │`);
    logger.info(`│ 🖌️ Style: ${style.substring(0, 30).padEnd(30)} │`);
    logger.info('╰───────────────────────────────────────────╯');
  }

  /**
   * Log generation progress
   */
  static logGenerationProgress(stage: string, progress: number): void {
    const progressBar = '█'.repeat(Math.floor(progress / 10)) + '░'.repeat(10 - Math.floor(progress / 10));
    logger.info(`│ [${progressBar}] ${progress}% - ${stage.padEnd(20)} │`);
  }

  /**
   * Log generation complete
   */
  static logGenerationComplete(result: any): void {
    if (result.success) {
      logger.info('╭───────────────────────────────────────────╮');
      logger.info('│ ✓ Generation Complete                     │');
      logger.info(`│ 🖼️ Image: ${result.artwork?.imageUrl ? 'Available' : 'Failed'}                       │`);
      logger.info('╰───────────────────────────────────────────╯');
    } else {
      logger.error('╭───────────────────────────────────────────╮');
      logger.error('│ ✗ Generation Failed                       │');
      logger.error(`│ Error: ${result.error?.message?.substring(0, 27) || 'Unknown error'}                   │`);
      logger.error('╰───────────────────────────────────────────╯');
    }
  }
} 