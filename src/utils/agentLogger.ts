/**
 * Agent Logger Utility
 * Provides structured logging for multi-agent system interactions
 */

import { Agent, AgentMessage, AgentRole, AgentStatus, MessageDirection } from '../agents/types';

/**
 * Log level enum
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  enabled: boolean;
  logToConsole: boolean;
  logToFile: boolean;
  logFilePath?: string;
  level: LogLevel;
  colorize: boolean;
  showTimestamp: boolean;
}

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: LoggerConfig = {
  enabled: true,
  logToConsole: true,
  logToFile: false,
  level: LogLevel.INFO,
  colorize: true,
  showTimestamp: true
};

/**
 * ANSI color codes for terminal output
 */
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

/**
 * Agent role to color mapping
 */
const ROLE_COLORS: Record<AgentRole, string> = {
  [AgentRole.DIRECTOR]: COLORS.cyan,
  [AgentRole.IDEATOR]: COLORS.green,
  [AgentRole.STYLIST]: COLORS.magenta,
  [AgentRole.REFINER]: COLORS.yellow,
  [AgentRole.CRITIC]: COLORS.red,
  [AgentRole.CHARACTER_GENERATOR]: COLORS.blue,
  [AgentRole.METADATA_GENERATOR]: COLORS.white
};

/**
 * Agent Logger class
 */
export class AgentLogger {
  private static config: LoggerConfig = DEFAULT_CONFIG;

  /**
   * Configure the logger
   */
  static configure(config: Partial<LoggerConfig>): void {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Log an agent action
   */
  static logAgentAction(agent: Agent, action: string, details: string, level: LogLevel = LogLevel.INFO): void {
    if (!this.shouldLog(level)) return;

    const timestamp = this.config.showTimestamp ? new Date().toISOString() : '';
    const agentColor = this.config.colorize ? ROLE_COLORS[agent.role] : '';
    const resetColor = this.config.colorize ? COLORS.reset : '';
    
    // Convert role to uppercase string safely
    const roleStr = String(agent.role).toUpperCase();
    
    const header = `\n┌─── ${agentColor}${roleStr} Agent (${agent.id})${resetColor} ───┐`;
    const actionLine = `│ Action: ${action}`;
    const detailsLine = `│ Details: ${details}`;
    const statusLine = `│ Status: ${agent.status}`;
    const timestampLine = timestamp ? `│ Time: ${timestamp}` : '';
    const footer = `└${'─'.repeat(40)}┘`;
    
    const message = [
      header,
      actionLine,
      detailsLine,
      statusLine,
      timestampLine,
      footer
    ].filter(Boolean).join('\n');
    
    this.log(message, level);
  }
  
  /**
   * Log agent interaction
   */
  static logAgentInteraction(from: Agent, to: Agent, message: string, level: LogLevel = LogLevel.INFO): void {
    if (!this.shouldLog(level)) return;

    const fromColor = this.config.colorize ? ROLE_COLORS[from.role] : '';
    const toColor = this.config.colorize ? ROLE_COLORS[to.role] : '';
    const resetColor = this.config.colorize ? COLORS.reset : '';
    
    const header = `\n↓ ${fromColor}${from.role}${resetColor} → ${toColor}${to.role}${resetColor}`;
    const messageLine = `└── ${message}`;
    
    const logMessage = [
      header,
      messageLine
    ].join('\n');
    
    this.log(logMessage, level);
  }
  
  /**
   * Log an agent message
   */
  static logAgentMessage(message: AgentMessage, level: LogLevel = LogLevel.DEBUG): void {
    if (!this.shouldLog(level)) return;

    const direction = message.direction === MessageDirection.INCOMING ? 'Received' : 'Sent';
    const fromColor = this.config.colorize ? ROLE_COLORS[message.from] : '';
    const toColor = this.config.colorize ? ROLE_COLORS[message.to === 'all' ? AgentRole.DIRECTOR : message.to] : '';
    const resetColor = this.config.colorize ? COLORS.reset : '';
    
    const header = `\n${direction}: ${fromColor}${message.from}${resetColor} → ${toColor}${message.to}${resetColor}`;
    const typeLine = `├── Type: ${message.type}`;
    const contentLine = `└── Content: ${typeof message.content === 'object' ? JSON.stringify(message.content) : message.content}`;
    
    const logMessage = [
      header,
      typeLine,
      contentLine
    ].join('\n');
    
    this.log(logMessage, level);
  }
  
  /**
   * Log system start
   */
  static logSystemStart(config: Record<string, any>, level: LogLevel = LogLevel.INFO): void {
    if (!this.shouldLog(level)) return;
    
    const header = this.config.colorize 
      ? `\n${COLORS.bright}${COLORS.cyan}╔══════════════════════════════════════════╗${COLORS.reset}`
      : '\n╔══════════════════════════════════════════╗';
    
    const title = this.config.colorize
      ? `${COLORS.bright}${COLORS.cyan}║${COLORS.reset}  ${COLORS.bright}ArtBot Multi-Agent System Started${COLORS.reset}     ${COLORS.bright}${COLORS.cyan}║${COLORS.reset}`
      : '║  ArtBot Multi-Agent System Started     ║';
    
    const footer = this.config.colorize
      ? `${COLORS.bright}${COLORS.cyan}╚══════════════════════════════════════════╝${COLORS.reset}`
      : '╚══════════════════════════════════════════╝';
    
    // Configuration summary
    const configString = Object.entries(config)
      .map(([key, value]) => `  ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
      .join('\n');
    
    const message = [
      header,
      title,
      footer,
      'Configuration:',
      configString
    ].join('\n');
    
    this.log(message, level);
  }
  
  /**
   * Log generation progress
   */
  static logGenerationProgress(progress: number, total: number, stage: string, level: LogLevel = LogLevel.INFO): void {
    if (!this.shouldLog(level)) return;
    
    const percent = Math.floor((progress / total) * 100);
    const progressBar = this.createProgressBar(percent);
    
    const message = `\n${stage}: ${progressBar} ${progress}/${total} (${percent}%)`;
    
    this.log(message, level);
  }
  
  /**
   * Create a progress bar string
   */
  private static createProgressBar(percent: number): string {
    const width = 20;
    const completed = Math.floor((percent / 100) * width);
    const remaining = width - completed;
    
    const completedBar = '█'.repeat(completed);
    const remainingBar = '░'.repeat(remaining);
    
    return this.config.colorize
      ? `${COLORS.green}${completedBar}${COLORS.reset}${COLORS.dim}${remainingBar}${COLORS.reset}`
      : `${completedBar}${remainingBar}`;
  }

  /**
   * Log a general message
   */
  static log(message: string, level: LogLevel = LogLevel.INFO): void {
    if (!this.shouldLog(level)) return;
    
    if (this.config.logToConsole) {
      const levelPrefix = this.getLevelPrefix(level);
      console.log(`${levelPrefix}${message}`);
    }
    
    // TODO: Add file logging when needed
  }
  
  /**
   * Get level prefix
   */
  private static getLevelPrefix(level: LogLevel): string {
    if (!this.config.colorize) return `[${level.toUpperCase()}] `;
    
    switch (level) {
      case LogLevel.DEBUG:
        return `${COLORS.dim}[DEBUG]${COLORS.reset} `;
      case LogLevel.INFO:
        return `${COLORS.green}[INFO]${COLORS.reset} `;
      case LogLevel.WARNING:
        return `${COLORS.yellow}[WARNING]${COLORS.reset} `;
      case LogLevel.ERROR:
        return `${COLORS.red}[ERROR]${COLORS.reset} `;
      default:
        return `[${String(level).toUpperCase()}] `;
    }
  }
  
  /**
   * Should this level be logged
   */
  private static shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARNING, LogLevel.ERROR];
    const configLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= configLevelIndex;
  }
} 