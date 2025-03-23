/**
 * Director Agent
 * Coordinates the multi-agent system workflow
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, DirectorAgent as IDirectorAgent, MessageDirection } from './types';
import { AgentLogger, LogLevel } from '../utils/agentLogger';
import { defaultGenerationConfig, GenerationConfig } from '../config/generationConfig';

/**
 * Director Agent implementation
 */
export class DirectorAgent implements IDirectorAgent {
  id: string;
  role: AgentRole.DIRECTOR;
  status: AgentStatus;
  
  private agents: Map<AgentRole, Agent>;
  private context: AgentContext | null;
  private config: GenerationConfig;
  private messages: AgentMessage[];
  
  /**
   * Constructor
   */
  constructor(config: GenerationConfig = defaultGenerationConfig) {
    this.id = uuidv4().substring(0, 8);
    this.role = AgentRole.DIRECTOR;
    this.status = AgentStatus.IDLE;
    
    this.agents = new Map();
    this.context = null;
    this.config = config;
    this.messages = [];
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Director agent created');
  }
  
  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    AgentLogger.logAgentAction(this, 'Initialize', 'Director agent initialized');
  }

  /**
   * Register a new agent
   */
  registerAgent(agent: Agent): void {
    this.agents.set(agent.role, agent);
    AgentLogger.logAgentAction(this, 'Register Agent', `Registered ${agent.role} agent (${agent.id})`);
  }
  
  /**
   * Get an agent by role
   */
  getAgent(role: AgentRole): Agent | undefined {
    return this.agents.get(role);
  }
  
  /**
   * Create a workflow
   */
  async createWorkflow(concept: string, style: string): Promise<AgentContext> {
    this.status = AgentStatus.BUSY;
    
    // Initialize a new context
    this.context = {
      projectId: uuidv4(),
      concept,
      style,
      styleConfig: this.config.styles[style] || this.config.styles[this.config.defaultStyle],
      modelConfig: this.config.models["black-forest-labs/flux-1.1-pro"],
      messages: [],
      startTime: new Date(),
      progress: {
        stage: 'initialization',
        progress: 0,
        total: 100
      }
    };
    
    AgentLogger.logAgentAction(this, 'Create Workflow', `Created workflow for concept: ${concept}`);
    
    return this.context;
  }
  
  /**
   * Process a request
   */
  async process(context: AgentContext): Promise<AgentResult> {
    this.status = AgentStatus.BUSY;
    this.context = context;
    
    try {
      // 1. Initialization
      this.updateProgress('initialization', 10, 100);
      AgentLogger.logAgentAction(this, 'Process', 'Starting generation process');
      
      // 2. Ideation
      const ideator = this.agents.get(AgentRole.IDEATOR);
      if (!ideator) {
        throw new Error('Ideator agent not registered');
      }
      
      this.updateProgress('ideation', 20, 100);
      await this.assignTask(AgentRole.IDEATOR, {
        action: 'generate_idea',
        concept: context.concept
      });
      
      // 3. Styling
      this.updateProgress('styling', 40, 100);
      await this.assignTask(AgentRole.STYLIST, {
        action: 'apply_style',
        prompt: context.prompt,
        style: context.style
      });
      
      // 4. Refinement
      this.updateProgress('refinement', 60, 100);
      await this.assignTask(AgentRole.REFINER, {
        action: 'refine_prompt',
        prompt: context.prompt,
        model: "black-forest-labs/flux-1.1-pro"
      });
      
      // 5. Character Generation
      this.updateProgress('character_generation', 80, 100);
      await this.assignTask(AgentRole.CHARACTER_GENERATOR, {
        action: 'generate_character',
        concept: context.concept
      });
      
      // 6. Finalization
      this.updateProgress('finalization', 90, 100);
      
      // 7. Completion
      this.updateProgress('complete', 100, 100);
      this.status = AgentStatus.SUCCESS;
      
      // Return the result
      return {
        success: true,
        output: {
          ...context,
          completionTime: new Date()
        },
        messages: this.messages
      };
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Process Error', `Error: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
      
      // Return error result
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        messages: this.messages
      };
    }
  }
  
  /**
   * Assign a task to an agent
   */
  async assignTask(agentRole: AgentRole, task: any): Promise<void> {
    const agent = this.agents.get(agentRole);
    if (!agent) {
      throw new Error(`Agent with role ${agentRole} not found`);
    }
    
    // Create a message for the agent
    const message: AgentMessage = {
      id: uuidv4(),
      timestamp: new Date(),
      from: this.role,
      to: agentRole,
      direction: MessageDirection.OUTGOING,
      type: 'task',
      content: task
    };
    
    // Log the message
    AgentLogger.logAgentMessage(message);
    this.messages.push(message);
    
    if (!this.context) {
      throw new Error('No active context');
    }
    
    // Update the context with the message
    this.context.messages.push(message);
    
    // Send the message to the agent
    await agent.handleMessage(message);
    
    // Process the updated context
    const result = await agent.process({
      ...this.context,
      task
    });
    
    // Update the context with the result
    if (result.success && result.output) {
      Object.assign(this.context, result.output);
    }
    
    // Add the result messages to our messages
    this.messages.push(...result.messages);
    
    // Log the interaction
    AgentLogger.logAgentAction(this, 'Task Completed', `${agentRole} completed task: ${task.action}`);
  }
  
  /**
   * Collect results from all agents
   */
  async collectResults(): Promise<AgentResult> {
    if (!this.context) {
      throw new Error('No active context');
    }
    
    return {
      success: true,
      output: this.context,
      messages: this.messages
    };
  }
  
  /**
   * Handle a message from another agent
   */
  async handleMessage(message: AgentMessage): Promise<void> {
    // Add the message to our list
    this.messages.push(message);
    
    // Log the message
    AgentLogger.logAgentMessage(message);
    
    // Process the message based on type
    switch (message.type) {
      case 'result':
        // Update the context with the result
        if (this.context) {
          if (message.content.prompt) {
            this.context.prompt = message.content.prompt;
          }
          if (message.content.character) {
            this.context.character = message.content.character;
          }
        }
        break;
        
      case 'error':
        // Log the error
        AgentLogger.logAgentAction(this, 'Error', `Error from ${message.from}: ${message.content.error}`, LogLevel.ERROR);
        break;
        
      case 'status':
        // Update the agent status
        const agent = this.agents.get(message.from);
        if (agent) {
          agent.status = message.content.status;
        }
        break;
        
      default:
        // Unknown message type
        break;
    }
  }
  
  /**
   * Update progress
   */
  private updateProgress(stage: string, progress: number, total: number): void {
    if (this.context) {
      this.context.progress = {
        stage,
        progress,
        total
      };
      
      // Log the progress
      AgentLogger.logGenerationProgress(progress, total, stage);
    }
  }
} 