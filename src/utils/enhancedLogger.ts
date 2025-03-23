/**
 * Enhanced Logger
 * Provides rich, structured logging for the multi-agent art generation system
 */

import { Agent, AgentRole, AgentStatus } from '../agents/types';
import chalk from 'chalk';

/**
 * Log levels with color mappings
 */
export enum LogLevel {
  INFO = 'info',
  DEBUG = 'debug',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success'
}

/**
 * Color configuration for different log elements
 */
const logColors: Record<string, any> = {
  // Log level colors
  [LogLevel.INFO]: chalk.blue,
  [LogLevel.DEBUG]: chalk.cyan,
  [LogLevel.WARNING]: chalk.yellow,
  [LogLevel.ERROR]: chalk.red,
  [LogLevel.SUCCESS]: chalk.green,
  
  // Agent-specific colors
  [AgentRole.DIRECTOR]: chalk.magenta,
  [AgentRole.IDEATOR]: chalk.cyan,
  [AgentRole.STYLIST]: chalk.blue,
  [AgentRole.REFINER]: chalk.yellow,
  [AgentRole.CRITIC]: chalk.red,
  [AgentRole.CHARACTER_GENERATOR]: chalk.green,
  [AgentRole.METADATA_GENERATOR]: chalk.gray,
  
  // Status colors - renamed to avoid duplicates
  status_idle: chalk.gray,
  status_busy: chalk.yellow,
  status_success: chalk.green,
  status_error: chalk.red,
  
  // Special elements
  header: chalk.bold.blue,
  border: chalk.gray,
  time: chalk.gray,
  highlight: chalk.bold.white,
  separator: chalk.gray,
  section: chalk.bold.cyan
};

/**
 * EnhancedLogger class for structured agent system logging
 */
export class EnhancedLogger {
  private static showDebug: boolean = process.env.DEBUG === 'true';
  private static indent: number = 0;
  
  /**
   * Get color function for agent status
   */
  private static getStatusColor(status: AgentStatus): any {
    switch (status) {
      case AgentStatus.IDLE:
        return logColors.status_idle;
      case AgentStatus.BUSY:
        return logColors.status_busy;
      case AgentStatus.SUCCESS:
        return logColors.status_success;
      case AgentStatus.ERROR:
        return logColors.status_error;
      default:
        return logColors[LogLevel.INFO];
    }
  }
  
  /**
   * Log a message with a specified level
   */
  static log(message: string, level: LogLevel = LogLevel.INFO): void {
    if (level === LogLevel.DEBUG && !this.showDebug) {
      return;
    }
    
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    const colorFn = logColors[level] || logColors[LogLevel.INFO];
    const indent = ' '.repeat(this.indent);
    
    console.log(`${logColors.time(timestamp)} ${colorFn('•')} ${indent}${message}`);
  }
  
  /**
   * Print a header section
   */
  static printHeader(text: string): void {
    const line = '═'.repeat(50);
    console.log('\n' + logColors.border(line));
    console.log(logColors.header(`  ${text}`));
    console.log(logColors.border(line) + '\n');
  }
  
  /**
   * Print a section header
   */
  static printSection(title: string): void {
    console.log(`\n${logColors.section('┌─')}${logColors.section('─'.repeat(title.length + 4))}${logColors.section('─┐')}`);
    console.log(`${logColors.section('│')}  ${logColors.highlight(title)}  ${logColors.section('│')}`);
    console.log(`${logColors.section('└─')}${logColors.section('─'.repeat(title.length + 4))}${logColors.section('─┘')}`);
  }
  
  /**
   * Log an agent action
   */
  static logAgentAction(agent: Agent, action: string, details: string): void {
    const roleName = agent.role.charAt(0).toUpperCase() + agent.role.slice(1).replace(/_/g, ' ');
    const colorFn = logColors[agent.role] || logColors[LogLevel.INFO];
    
    console.log(`\n${colorFn('┌───')} ${logColors.highlight(roleName)} Agent (${agent.id}) ${colorFn('───────')}`);
    console.log(`${colorFn('│')} Action: ${action}`);
    console.log(`${colorFn('│')} ${details}`);
    console.log(`${colorFn('└')}${colorFn('─'.repeat(40))}\n`);
  }
  
  /**
   * Log agent interaction
   */
  static logAgentInteraction(from: Agent, to: Agent, message: string): void {
    const fromColorFn = logColors[from.role] || logColors[LogLevel.INFO];
    const toColorFn = logColors[to.role] || logColors[LogLevel.INFO];
    
    console.log(`${fromColorFn('↓')} ${from.role} → ${toColorFn(to.role)}`);
    console.log(`${logColors.separator('└──')} ${message}`);
  }
  
  /**
   * Log the start of the generation process
   */
  static logGenerationStart(concept: string, style: string): void {
    this.printHeader('IKIGAI ART GENERATION');
    console.log(`${logColors[LogLevel.INFO]('🎨')} Concept: ${logColors.highlight(concept)}`);
    console.log(`${logColors[LogLevel.INFO]('🖌️')} Style: ${logColors.highlight(style)}\n`);
  }
  
  /**
   * Log generation progress
   */
  static logGenerationProgress(stage: string, progress: number, total: number): void {
    const percent = Math.round((progress / total) * 100);
    const progressBar = this.createProgressBar(percent);
    
    console.log(`${logColors[LogLevel.INFO]('⏳')} ${stage}: ${progressBar} ${percent}%`);
  }
  
  /**
   * Create a visual progress bar
   */
  private static createProgressBar(percent: number): string {
    const width = 20;
    const completed = Math.floor((width * percent) / 100);
    const remaining = width - completed;
    
    return `${logColors[LogLevel.SUCCESS]('█'.repeat(completed))}${logColors[LogLevel.INFO]('░'.repeat(remaining))}`;
  }
  
  /**
   * Log Magritte-style art direction
   */
  static logMagritteArtDirection(artDirection: any): void {
    this.printSection('Magritte Art Direction');
    
    if (!artDirection) {
      console.log('No art direction specified');
      return;
    }
    
    console.log(`${logColors.border('│')} Visual Element: ${logColors.highlight(artDirection.visualElement || 'None')}`);
    console.log(`${logColors.border('│')} Composition: ${logColors.highlight(artDirection.composition || 'None')}`);
    console.log(`${logColors.border('│')} Paradox: ${logColors.highlight(artDirection.paradox || 'None')}`);
    console.log(`${logColors.border('│')} Technique: ${logColors.highlight(artDirection.technique || 'None')}`);
    
    if (artDirection.additionalElements) {
      console.log(`${logColors.border('│')} Additional: ${logColors.highlight(artDirection.additionalElements)}`);
    }
    
    console.log(logColors.border('└') + logColors.border('─'.repeat(40)));
  }
  
  /**
   * Log generation completion
   */
  static logGenerationComplete(result: any): void {
    if (result.success) {
      this.printSection('Generation Complete');
      console.log(`${logColors[LogLevel.SUCCESS]('✓')} Image generated successfully`);
      
      if (result.artwork) {
        console.log(`${logColors[LogLevel.SUCCESS]('✓')} Title: ${logColors.highlight(result.artwork.title || 'Untitled')}`);
        
        if (result.artwork.character) {
          console.log(`${logColors[LogLevel.SUCCESS]('✓')} Character: ${logColors.highlight(result.artwork.character.name)}`);
          console.log(`${logColors[LogLevel.SUCCESS]('✓')} Title: ${logColors.highlight(result.artwork.character.title)}`);
        }
        
        if (result.artwork.imageUrl) {
          console.log(`${logColors[LogLevel.SUCCESS]('✓')} Image URL: ${result.artwork.imageUrl}`);
        }
      }
    } else {
      this.printSection('Generation Failed');
      console.log(`${logColors[LogLevel.ERROR]('✗')} ${result.error?.message || 'Unknown error'}`);
    }
  }
  
  /**
   * Log system start
   */
  static logSystemStart(config: any): void {
    this.printHeader('ArtBot Multi-Agent System');
    
    console.log(`${logColors[LogLevel.INFO]('🤖')} AI Service: ${config.aiService ? logColors[LogLevel.SUCCESS]('Available') : logColors[LogLevel.ERROR]('Unavailable')}`);
    console.log(`${logColors[LogLevel.INFO]('🖼️')} Replicate Service: ${config.replicateService ? logColors[LogLevel.SUCCESS]('Available') : logColors[LogLevel.ERROR]('Unavailable')}`);
    console.log(`${logColors[LogLevel.INFO]('💾')} Output Directory: ${logColors.highlight(config.outputDir)}`);
    console.log(`${logColors[LogLevel.INFO]('🧩')} Agents: ${logColors.highlight(config.agentCount.toString())}`);
    
    console.log('\n' + logColors.border('─'.repeat(50)));
  }
  
  /**
   * Increase indentation level
   */
  static increaseIndent(): void {
    this.indent += 2;
  }
  
  /**
   * Decrease indentation level
   */
  static decreaseIndent(): void {
    this.indent = Math.max(0, this.indent - 2);
  }
} 