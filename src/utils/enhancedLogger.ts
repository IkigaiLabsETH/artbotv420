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
  section: chalk.bold.cyan,
  
  // Symbols
  checkmark: chalk.green('✓'),
  x_mark: chalk.red('✗'),
  hourglass: chalk.yellow('⏳'),
  palette: chalk.magenta('🎨'),
  paintbrush: chalk.cyan('🖌️'),
  bot: chalk.blue('🤖'),
  thinking: chalk.yellow('🧠')
};

// Box drawing characters
const box = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  verticalRight: '├',
  verticalLeft: '┤'
};

/**
 * EnhancedLogger class for structured agent system logging
 */
export class EnhancedLogger {
  private static showDebug: boolean = process.env.DEBUG === 'true';
  private static indent: number = 0;
  private static compactMode: boolean = true;
  
  /**
   * Toggle compact mode
   */
  static setCompactMode(compact: boolean): void {
    this.compactMode = compact;
  }
  
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
    
    const colorFn = logColors[level] || logColors[LogLevel.INFO];
    const indent = ' '.repeat(this.indent);
    
    if (this.compactMode) {
      // Compact timestamp format
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      console.log(`${logColors.time(timestamp)} ${colorFn('•')} ${indent}${message}`);
    } else {
      const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
      console.log(`${logColors.time(timestamp)} ${colorFn('•')} ${indent}${message}`);
    }
  }
  
  /**
   * Print a compact header section
   */
  static printHeader(text: string): void {
    const width = 50;
    const paddedText = text.padEnd(width - 4);
    
    console.log(logColors.border(`\n${box.topLeft}${box.horizontal.repeat(width - 2)}${box.topRight}`));
    console.log(logColors.border(`${box.vertical}`)+logColors.header(` ${paddedText} `)+logColors.border(`${box.vertical}`));
    console.log(logColors.border(`${box.bottomLeft}${box.horizontal.repeat(width - 2)}${box.bottomRight}`));
  }
  
  /**
   * Print a compact section header
   */
  static printSection(title: string): void {
    if (this.compactMode) {
      console.log(`\n${logColors.section('▸')} ${logColors.highlight(title)}`);
    } else {
      console.log(`\n${logColors.section('┌─')}${logColors.section('─'.repeat(title.length + 4))}${logColors.section('─┐')}`);
      console.log(`${logColors.section('│')}  ${logColors.highlight(title)}  ${logColors.section('│')}`);
      console.log(`${logColors.section('└─')}${logColors.section('─'.repeat(title.length + 4))}${logColors.section('─┘')}`);
    }
  }
  
  /**
   * Log an agent action in compact form
   */
  static logAgentAction(agent: Agent, action: string, details: string): void {
    const roleName = agent.role.charAt(0).toUpperCase() + agent.role.slice(1).replace(/_/g, ' ');
    const colorFn = logColors[agent.role] || logColors[LogLevel.INFO];
    const shortId = agent.id.substring(0, 6);
    
    if (this.compactMode) {
      console.log(`\n${colorFn('▸')} ${logColors.highlight(roleName)} [${shortId}]: ${action}`);
      console.log(`  ${details}`);
    } else {
      console.log(`\n${colorFn('┌───')} ${logColors.highlight(roleName)} Agent (${agent.id}) ${colorFn('───────')}`);
      console.log(`${colorFn('│')} Action: ${action}`);
      console.log(`${colorFn('│')} ${details}`);
      console.log(`${colorFn('└')}${colorFn('─'.repeat(40))}\n`);
    }
  }
  
  /**
   * Log agent interaction in compact form
   */
  static logAgentInteraction(from: Agent, to: Agent, message: string): void {
    const fromColorFn = logColors[from.role] || logColors[LogLevel.INFO];
    const toColorFn = logColors[to.role] || logColors[LogLevel.INFO];
    
    if (this.compactMode) {
      console.log(`  ${fromColorFn(from.role)} ${fromColorFn('→')} ${toColorFn(to.role)}: ${message}`);
    } else {
      console.log(`${fromColorFn('↓')} ${from.role} → ${toColorFn(to.role)}`);
      console.log(`${logColors.separator('└──')} ${message}`);
    }
  }
  
  /**
   * Log the start of the generation process with compact display
   */
  static logGenerationStart(concept: string, style: string): void {
    if (this.compactMode) {
      this.printHeader(' IKIGAI ART GENERATION ');
      console.log(`${logColors.palette} ${logColors.highlight('Concept:')} ${concept}`);
      console.log(`${logColors.paintbrush} ${logColors.highlight('Style:')} ${style}`);
    } else {
      this.printHeader('IKIGAI ART GENERATION');
      console.log(`${logColors.palette} Concept: ${logColors.highlight(concept)}`);
      console.log(`${logColors.paintbrush} Style: ${logColors.highlight(style)}\n`);
    }
  }
  
  /**
   * Log generation progress with compact display
   */
  static logGenerationProgress(stage: string, progress: number, total: number): void {
    const percent = Math.round((progress / total) * 100);
    const progressBar = this.createProgressBar(percent, this.compactMode ? 10 : 20);
    
    if (this.compactMode) {
      console.log(`${logColors.hourglass} ${stage} ${progressBar} ${percent}%`);
    } else {
      console.log(`${logColors.hourglass} ${stage}: ${progressBar} ${percent}%`);
    }
  }
  
  /**
   * Create a visual progress bar
   */
  private static createProgressBar(percent: number, width: number = 20): string {
    const completed = Math.floor((width * percent) / 100);
    const remaining = width - completed;
    
    return `${logColors[LogLevel.SUCCESS]('█'.repeat(completed))}${logColors[LogLevel.INFO]('░'.repeat(remaining))}`;
  }
  
  /**
   * Log Magritte-style art direction in compact form
   */
  static logMagritteArtDirection(artDirection: any): void {
    this.printSection('Magritte Art Direction');
    
    if (!artDirection) {
      console.log('No art direction specified');
      return;
    }
    
    if (this.compactMode) {
      if (artDirection.visualElement) console.log(`• ${logColors.highlight('Visual:')} ${artDirection.visualElement}`);
      if (artDirection.composition) console.log(`• ${logColors.highlight('Comp:')} ${artDirection.composition}`);
      if (artDirection.paradox) console.log(`• ${logColors.highlight('Paradox:')} ${artDirection.paradox}`);
      if (artDirection.technique) console.log(`• ${logColors.highlight('Tech:')} ${artDirection.technique}`);
      if (artDirection.additionalElements) console.log(`• ${logColors.highlight('Add:')} ${artDirection.additionalElements}`);
    } else {
      console.log(`${logColors.border('│')} Visual Element: ${logColors.highlight(artDirection.visualElement || 'None')}`);
      console.log(`${logColors.border('│')} Composition: ${logColors.highlight(artDirection.composition || 'None')}`);
      console.log(`${logColors.border('│')} Paradox: ${logColors.highlight(artDirection.paradox || 'None')}`);
      console.log(`${logColors.border('│')} Technique: ${logColors.highlight(artDirection.technique || 'None')}`);
      
      if (artDirection.additionalElements) {
        console.log(`${logColors.border('│')} Additional: ${logColors.highlight(artDirection.additionalElements)}`);
      }
      
      console.log(logColors.border('└') + logColors.border('─'.repeat(40)));
    }
  }
  
  /**
   * Log generation completion in compact form
   */
  static logGenerationComplete(result: any): void {
    if (result.success) {
      this.printSection('Generation Complete');
      
      if (this.compactMode) {
        console.log(`${logColors.checkmark} ${logColors.highlight('Image generated successfully')}`);
        
        if (result.artwork) {
          if (result.artwork.title) console.log(`${logColors.checkmark} ${logColors.highlight('Title:')} ${result.artwork.title}`);
          
          if (result.artwork.character) {
            console.log(`${logColors.checkmark} ${logColors.highlight('Character:')} ${result.artwork.character.name}, ${result.artwork.character.title}`);
          }
          
          if (result.artwork.imageUrl) {
            // Display shortened URL
            const shortUrl = result.artwork.imageUrl.length > 40 
              ? result.artwork.imageUrl.substring(0, 37) + '...' 
              : result.artwork.imageUrl;
            console.log(`${logColors.checkmark} ${logColors.highlight('URL:')} ${shortUrl}`);
          }
        }
      } else {
        console.log(`${logColors.checkmark} Image generated successfully`);
        
        if (result.artwork) {
          console.log(`${logColors.checkmark} Title: ${logColors.highlight(result.artwork.title || 'Untitled')}`);
          
          if (result.artwork.character) {
            console.log(`${logColors.checkmark} Character: ${logColors.highlight(result.artwork.character.name)}`);
            console.log(`${logColors.checkmark} Title: ${logColors.highlight(result.artwork.character.title)}`);
          }
          
          if (result.artwork.imageUrl) {
            console.log(`${logColors.checkmark} Image URL: ${result.artwork.imageUrl}`);
          }
        }
      }
    } else {
      this.printSection('Generation Failed');
      console.log(`${logColors.x_mark} ${result.error?.message || 'Unknown error'}`);
    }
  }
  
  /**
   * Log system start with compact display
   */
  static logSystemStart(config: any): void {
    this.printHeader('ArtBot Multi-Agent System');
    
    if (this.compactMode) {
      // Display services on a single line
      const aiStatus = config.aiService ? logColors.checkmark : logColors.x_mark;
      const repStatus = config.replicateService ? logColors.checkmark : logColors.x_mark; 
      console.log(`${logColors.bot} ${logColors.highlight('Services:')} AI:${aiStatus} Replicate:${repStatus} Agents:${config.agentCount}`);
      console.log(`${logColors[LogLevel.INFO]('💾')} ${logColors.highlight('Output:')} ${config.outputDir}`);
    } else {
      console.log(`${logColors.bot} AI Service: ${config.aiService ? logColors.checkmark : logColors.x_mark}`);
      console.log(`${logColors[LogLevel.INFO]('🖼️')} Replicate Service: ${config.replicateService ? logColors.checkmark : logColors.x_mark}`);
      console.log(`${logColors[LogLevel.INFO]('💾')} Output Directory: ${logColors.highlight(config.outputDir)}`);
      console.log(`${logColors[LogLevel.INFO]('🧩')} Agents: ${logColors.highlight(config.agentCount.toString())}`);
    }
    
    console.log('\n' + logColors.border('─'.repeat(50)));
  }
  
  /**
   * Log generation parameters in compact form
   */
  static logGenerationParameters(params: any): void {
    if (!params) return;
    
    if (this.compactMode) {
      console.log(`\n${logColors[LogLevel.INFO]('⚙️')} ${logColors.highlight('Generation Parameters:')}`);
      
      // Model with shortened display
      if (params.model) {
        const shortModel = params.model.includes('/') 
          ? params.model.split('/').pop() 
          : params.model;
        console.log(`• ${logColors.highlight('Model:')} ${shortModel}`);
      }
      
      // Dimensions
      if (params.width && params.height) {
        console.log(`• ${logColors.highlight('Size:')} ${params.width}×${params.height}`);
      }
      
      // Steps and Guidance on single line
      if (params.steps || params.guidance) {
        const steps = params.steps ? `Steps:${params.steps}` : '';
        const guidance = params.guidance ? `Guide:${params.guidance}` : '';
        const separator = steps && guidance ? ' | ' : '';
        console.log(`• ${logColors.highlight('Params:')} ${steps}${separator}${guidance}`);
      }
    } else {
      this.printSection('Generation Parameters');
      
      if (params.model) console.log(`• Model: ${params.model}`);
      if (params.width && params.height) console.log(`• Dimensions: ${params.width}×${params.height}`);
      if (params.steps) console.log(`• Steps: ${params.steps}`);
      if (params.guidance) console.log(`• Guidance: ${params.guidance}`);
    }
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