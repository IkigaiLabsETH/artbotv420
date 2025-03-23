/**
 * Agent Logger
 * Provides structured logging for multi-agent interactions
 */

import { Agent, AgentMessage } from '../agents/types';

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
 * Agent Logger Class
 * Handles formatted logging of agent actions and interactions
 */
export class AgentLogger {
  /**
   * Log a simple message with timestamp
   */
  static log(message: string, level: LogLevel = LogLevel.INFO): void {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    console.log(`[${timestamp}] ${message}`);
  }

  /**
   * Log an agent action with structured formatting
   */
  static logAgentAction(agent: Agent, action: string, details: string): void {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    console.log(`\n┌─── ${agent.role.toUpperCase()} Agent (${agent.id}) ───┐`);
    console.log(`│ Action: ${action}`);
    console.log(`│ Details: ${details}`);
    console.log(`│ Time: ${timestamp}`);
    console.log(`└${'─'.repeat(40)}┘`);
  }

  /**
   * Log an agent message
   */
  static logAgentMessage(message: AgentMessage): void {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    console.log(`\n↓ ${message.from} → ${message.to}`);
    console.log(`├── Type: ${message.type}`);
    console.log(`├── Time: ${timestamp}`);
    console.log(`└── ${JSON.stringify(message.content).substring(0, 100)}${JSON.stringify(message.content).length > 100 ? '...' : ''}`);
  }

  /**
   * Log an agent interaction between two agents
   */
  static logAgentInteraction(from: Agent, to: Agent, message: string): void {
    console.log(`\n↓ ${from.role} → ${to.role}`);
    console.log(`└── ${message}`);
  }

  /**
   * Log start of a process with header
   */
  static logHeader(text: string): void {
    console.log('\n' + '═'.repeat(50));
    console.log(`  ${text}`);
    console.log('═'.repeat(50) + '\n');
  }

  /**
   * Log configuration details in a structured format
   */
  static logConfig(title: string, config: Record<string, any>): void {
    console.log(`\n┌─── ${title} ───────────────────────┐`);
    Object.entries(config).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        console.log(`│ ${key}:`);
        Object.entries(value).forEach(([subKey, subValue]) => {
          console.log(`│   ${subKey}: ${subValue}`);
        });
      } else {
        console.log(`│ ${key}: ${value}`);
      }
    });
    console.log(`└${'─'.repeat(40)}┘`);
  }

  /**
   * Log progress updates
   */
  static logProgress(step: string, current: number, total: number): void {
    const percentage = Math.floor((current / total) * 100);
    const progressBar = `[${'█'.repeat(Math.floor(percentage / 5))}${' '.repeat(20 - Math.floor(percentage / 5))}]`;
    console.log(`│ ${step}: ${progressBar} ${current}/${total} (${percentage}%)`);
  }

  /**
   * Log errors with highlighting
   */
  static logError(source: string, error: Error | string): void {
    const errorMessage = error instanceof Error ? error.message : error;
    console.log(`\n┌─── ERROR in ${source} ───┐`);
    console.log(`│ ${errorMessage}`);
    if (error instanceof Error && error.stack) {
      console.log(`│ Stack: ${error.stack.split('\n')[1].trim()}`);
    }
    console.log(`└${'─'.repeat(40)}┘`);
  }

  /**
   * Log success message
   */
  static logSuccess(message: string): void {
    console.log(`\n✓ ${message}\n`);
  }

  /**
   * Log system start with configuration information
   */
  static logSystemStart(config: any): void {
    console.log('\n╭───────────────────────────────────────────╮');
    console.log('│        ArtBot Multi-Agent System           │');
    console.log('├───────────────────────────────────────────┤');
    console.log(`│ 🤖 AI Service: ${config.aiService}          │`);
    console.log(`│ 🖼️ Replicate Service: ${config.replicateService} │`);
    console.log(`│ 📁 Output Directory: ${config.outputDir}    │`);
    console.log(`│ 🧠 Memory System: ${config.memorySystem}    │`);
    console.log(`│ 🎨 Style Service: ${config.styleService}    │`);
    console.log(`│ 👥 Agents: ${config.agentCount}            │`);
    console.log('╰───────────────────────────────────────────╯\n');
  }

  /**
   * Log generation progress
   */
  static logGenerationProgress(progress: number, total: number, stage: string): void {
    const percentage = Math.floor((progress / total) * 100);
    const progressBar = `[${'█'.repeat(Math.floor(percentage / 5))}${' '.repeat(20 - Math.floor(percentage / 5))}]`;
    console.log(`⏳ ${stage}: ${progressBar} ${progress}/${total} (${percentage}%)`);
  }
} 