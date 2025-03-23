/**
 * Agent Logger
 * Enhanced logging system specifically for multi-agent interactions
 */

import chalk from 'chalk';
import { Agent, AgentMessage, AgentRole } from '../agents/types';

/**
 * Log levels for different types of messages
 */
export enum LogLevel {
  INFO = 'info',
  DEBUG = 'debug',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success'
}

/**
 * Agent Logger
 * Provides structured logging for multi-agent systems
 */
export class AgentLogger {
  private static logLevel: LogLevel = LogLevel.INFO;
  private static enableColors: boolean = true;
  
  /**
   * Set the minimum log level
   */
  static setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
  
  /**
   * Enable or disable colors
   */
  static setEnableColors(enable: boolean): void {
    this.enableColors = enable;
  }
  
  /**
   * Log a message with a specified level
   */
  static log(message: string, level: LogLevel = LogLevel.INFO): void {
    let formattedMessage: string;
    
    if (this.enableColors) {
      switch (level) {
        case LogLevel.DEBUG:
          formattedMessage = chalk.gray(message);
          break;
        case LogLevel.INFO:
          formattedMessage = chalk.blue(message);
          break;
        case LogLevel.WARNING:
          formattedMessage = chalk.yellow(message);
          break;
        case LogLevel.ERROR:
          formattedMessage = chalk.red(message);
          break;
        case LogLevel.SUCCESS:
          formattedMessage = chalk.green(message);
          break;
        default:
          formattedMessage = message;
      }
    } else {
      const prefix = level.toUpperCase();
      formattedMessage = `[${prefix}] ${message}`;
    }
    
    console.log(formattedMessage);
  }
  
  /**
   * Log an agent action
   */
  static logAgentAction(agent: Agent, action: string, details: string): void {
    if (this.enableColors) {
      console.log(chalk.cyan(`\n┌─── ${agent.role.toUpperCase()} Agent (${agent.id.substring(0, 8)}) ───┐`));
      console.log(chalk.cyan(`│ Action: ${action}`));
      console.log(chalk.cyan(`│ Details: ${details}`));
      console.log(chalk.cyan(`└${'─'.repeat(40)}┘`));
    } else {
      console.log(`\n[${agent.role.toUpperCase()}] (${agent.id.substring(0, 8)})`);
      console.log(`Action: ${action}`);
      console.log(`Details: ${details}`);
    }
  }
  
  /**
   * Log an interaction between agents
   */
  static logAgentInteraction(from: Agent, to: Agent, message: string): void {
    if (this.enableColors) {
      console.log(chalk.magenta(`\n↓ ${from.role} → ${to.role}`));
      console.log(chalk.magenta(`└── ${message}`));
    } else {
      console.log(`\n[${from.role} → ${to.role}]`);
      console.log(`Message: ${message}`);
    }
  }
  
  /**
   * Log a message from an agent
   */
  static logAgentMessage(message: AgentMessage): void {
    const direction = message.direction === 'incoming' ? '←' : '→';
    const fromTo = `${message.from} ${direction} ${message.to}`;
    
    if (this.enableColors) {
      console.log(chalk.blue(`\n[${message.timestamp.toISOString()}] ${fromTo}`));
      console.log(chalk.blue(`Type: ${message.type}`));
      console.log(chalk.blue(`Content: ${typeof message.content === 'string' ? message.content : JSON.stringify(message.content, null, 2)}`));
    } else {
      console.log(`\n[${message.timestamp.toISOString()}] ${fromTo}`);
      console.log(`Type: ${message.type}`);
      console.log(`Content: ${typeof message.content === 'string' ? message.content : JSON.stringify(message.content, null, 2)}`);
    }
  }
  
  /**
   * Log the start of a system
   */
  static logSystemStart(config: any): void {
    if (this.enableColors) {
      console.log(chalk.green('\n╭───────────────────────────────────────────╮'));
      console.log(chalk.green('│ 🤖 ArtBot Multi-Agent System initialized   │'));
      console.log(chalk.green('╰───────────────────────────────────────────╯'));
      
      console.log(chalk.green('\n╭───────────────────────────────────────────╮'));
      console.log(chalk.green('│ System Configuration:                      │'));
      
      if (config.outputDir) {
        console.log(chalk.green(`│ Output Directory: ${config.outputDir.substring(0, 25)}... │`));
      }
      
      console.log(chalk.green(`│ AI Service: ${config.aiService}                  │`));
      console.log(chalk.green(`│ Replicate Service: ${config.replicateService}            │`));
      console.log(chalk.green(`│ Memory System: ${config.memorySystem}               │`));
      console.log(chalk.green(`│ Style Service: ${config.styleService}                │`));
      console.log(chalk.green(`│ Agent Count: ${config.agentCount}                       │`));
      console.log(chalk.green('╰───────────────────────────────────────────╯'));
    } else {
      console.log('\n[SYSTEM START]');
      console.log('ArtBot Multi-Agent System initialized');
      console.log('\nSystem Configuration:');
      
      if (config.outputDir) {
        console.log(`Output Directory: ${config.outputDir}`);
      }
      
      console.log(`AI Service: ${config.aiService}`);
      console.log(`Replicate Service: ${config.replicateService}`);
      console.log(`Memory System: ${config.memorySystem}`);
      console.log(`Style Service: ${config.styleService}`);
      console.log(`Agent Count: ${config.agentCount}`);
    }
  }
  
  /**
   * Log the generation process with progress
   */
  static logGenerationProcess(stage: string, progress: number = 0): void {
    const maxProgress = 10;
    const progressBars = Math.floor(progress * maxProgress);
    const progressBar = `[${'█'.repeat(progressBars)}${'-'.repeat(maxProgress - progressBars)}]`;
    
    if (this.enableColors) {
      console.log(chalk.cyan(`\n┌─── Generation Progress ────────────────────────┐`));
      console.log(chalk.cyan(`│ Stage: ${stage.padEnd(40)}│`));
      console.log(chalk.cyan(`│ Progress: ${progressBar} ${Math.floor(progress * 100)}%         │`));
      console.log(chalk.cyan(`└────────────────────────────────────────────────┘`));
    } else {
      console.log(`\n[Generation Progress]`);
      console.log(`Stage: ${stage}`);
      console.log(`Progress: ${progressBar} ${Math.floor(progress * 100)}%`);
    }
  }
  
  /**
   * Log generation settings
   */
  static logGenerationSettings(settings: any): void {
    if (this.enableColors) {
      console.log(chalk.magenta(`\n┌─── Generation Settings ───────────────────────┐`));
      
      if (settings.model) {
        console.log(chalk.magenta(`│ Model: ${settings.model}`));
      }
      
      if (settings.dimensions) {
        console.log(chalk.magenta(`│ Dimensions: ${settings.dimensions.width}x${settings.dimensions.height}`));
      }
      
      if (settings.inferenceSteps) {
        console.log(chalk.magenta(`│ Inference Steps: ${settings.inferenceSteps}`));
      }
      
      if (settings.guidanceScale) {
        console.log(chalk.magenta(`│ Guidance Scale: ${settings.guidanceScale}`));
      }
      
      console.log(chalk.magenta(`└────────────────────────────────────────────────┘`));
    } else {
      console.log(`\n[Generation Settings]`);
      
      if (settings.model) {
        console.log(`Model: ${settings.model}`);
      }
      
      if (settings.dimensions) {
        console.log(`Dimensions: ${settings.dimensions.width}x${settings.dimensions.height}`);
      }
      
      if (settings.inferenceSteps) {
        console.log(`Inference Steps: ${settings.inferenceSteps}`);
      }
      
      if (settings.guidanceScale) {
        console.log(`Guidance Scale: ${settings.guidanceScale}`);
      }
    }
  }
  
  /**
   * Log the completion of a generation
   */
  static logGenerationComplete(imageUrl: string, files: any): void {
    if (this.enableColors) {
      console.log(chalk.green('\n╭───────────────────────────────────────────╮'));
      console.log(chalk.green('│ ✓ Generation Complete                     │'));
      console.log(chalk.green(`│ 🖼️ Image: ${imageUrl ? 'Generated' : 'Failed'}            │`));
      
      if (files && files.image) {
        console.log(chalk.green(`│ 📁 Saved to: ${files.image.substring(0, 25)}... │`));
      }
      
      console.log(chalk.green('╰───────────────────────────────────────────╯'));
    } else {
      console.log('\n[GENERATION COMPLETE]');
      console.log(`Image: ${imageUrl ? 'Generated' : 'Failed'}`);
      
      if (files && files.image) {
        console.log(`Saved to: ${files.image}`);
      }
    }
  }

  /**
   * Log a header for a section
   */
  static logHeader(text: string): void {
    if (this.enableColors) {
      console.log(chalk.blue('\n═'.repeat(50)));
      console.log(chalk.blue(`  ${text}`));
      console.log(chalk.blue('═'.repeat(50) + '\n'));
    } else {
      console.log('\n' + '='.repeat(50));
      console.log(`  ${text}`);
      console.log('='.repeat(50) + '\n');
    }
  }

  /**
   * Log a success message
   */
  static logSuccess(message: string): void {
    if (this.enableColors) {
      console.log(chalk.green(`✅ ${message}`));
    } else {
      console.log(`[SUCCESS] ${message}`);
    }
  }

  /**
   * Log an error message
   */
  static logError(context: string, error: string): void {
    if (this.enableColors) {
      console.log(chalk.red(`❌ [${context}] ${error}`));
    } else {
      console.log(`[ERROR - ${context}] ${error}`);
    }
  }
} 