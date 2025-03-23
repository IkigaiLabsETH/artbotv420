/**
 * Director Agent
 * Coordinates the multi-agent system workflow
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, DirectorAgent as IDirectorAgent, MessageDirection } from './types';
import { AgentLogger, LogLevel } from '../utils/agentLogger';
import { defaultGenerationConfig, GenerationConfig } from '../config/generationConfig';
import { magrittePatterns } from '../services/style/magrittePatterns';

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
  private magrittePatterns: typeof magrittePatterns;
  
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
    this.magrittePatterns = magrittePatterns;
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Director agent created with Magritte style capabilities');
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
    
    // Check if this is a Magritte-style workflow
    const isMagritteStyle = style === 'magritte' || 
                           style === 'bear_pfp' || 
                           (this.config.styles[style]?.name.toLowerCase().includes('magritte'));
    
    // Create Magritte-specific art direction if applicable
    const artDirection = isMagritteStyle 
      ? this.createMagritteArtDirection(concept)
      : undefined;
    
    // Initialize a new context
    this.context = {
      projectId: uuidv4(),
      concept,
      style,
      styleConfig: this.config.styles[style] || this.config.styles[this.config.defaultStyle],
      modelConfig: this.config.models["black-forest-labs/flux-1.1-pro"],
      messages: [],
      startTime: new Date(),
      artDirection,
      progress: {
        stage: 'initialization',
        progress: 0,
        total: 100
      }
    };
    
    if (isMagritteStyle) {
      AgentLogger.logAgentAction(this, 'Create Magritte Workflow', `Created Magritte-style workflow for concept: ${concept}`);
      
      // Log the Magritte elements selected
      AgentLogger.log(`\n┌─── Magritte Art Direction ───────────────────┐`);
      AgentLogger.log(`│ Visual Element: ${artDirection?.visualElement}`);
      AgentLogger.log(`│ Composition: ${artDirection?.composition}`);
      AgentLogger.log(`│ Paradox: ${artDirection?.paradox}`);
      AgentLogger.log(`│ Technique: ${artDirection?.technique}`);
      AgentLogger.log(`└────────────────────────────────────────────────┘`);
    } else {
      AgentLogger.logAgentAction(this, 'Create Workflow', `Created workflow for concept: ${concept}`);
    }
    
    return this.context;
  }
  
  /**
   * Create Magritte-specific art direction
   */
  private createMagritteArtDirection(baseConcept: string): Record<string, string> {
    // Select specific Magritte elements to incorporate
    const visualElement = this.selectRandom(this.magrittePatterns.visualElements);
    const composition = this.selectRandom(this.magrittePatterns.compositions);
    const paradox = this.selectRandom(this.magrittePatterns.paradoxes);
    const technique = this.selectRandom(this.magrittePatterns.technicalAspects);
    const colorApproach = this.selectRandom(this.magrittePatterns.colorPalettes);
    const theme = this.selectRandom(this.magrittePatterns.conceptualThemes);
    
    return {
      visualElement,
      composition,
      paradox,
      technique,
      colorApproach,
      theme,
      // Additional bear-specific direction
      bearPortraitStyle: "distinguished bear in formal portrait pose, in profile view",
      renderingStyle: "photorealistic in the precise style of René Magritte, with perfectly smooth surfaces and clean edges"
    };
  }
  
  /**
   * Helper to select a random item from an array
   */
  private selectRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
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
      
      // 2. Ideation - Generate or enhance the concept
      this.updateProgress('ideation', 20, 100);
      const ideator = this.getAgent(AgentRole.IDEATOR);
      if (!ideator) {
        throw new Error('Ideator agent not registered');
      }
      
      // Send the concept to the ideator for enhancement
      await this.assignTask(AgentRole.IDEATOR, {
        action: 'enhance_prompt',
        concept: context.concept
      });
      
      // 3. Styling - Apply the requested style
      this.updateProgress('styling', 30, 100);
      const stylist = this.getAgent(AgentRole.STYLIST);
      if (!stylist) {
        throw new Error('Stylist agent not registered');
      }
      
      // Check for Magritte style for special handling
      if (context.style === 'magritte' || 
          context.style === 'bear_pfp' || 
          (context.styleConfig?.name.toLowerCase().includes('magritte'))) {
        AgentLogger.logAgentAction(this, 'Process', 'Applying specialized Magritte styling');
        
        // If we have art direction, pass it to the stylist
        await this.assignTask(AgentRole.STYLIST, {
          action: 'apply_style',
          style: context.style,
          prompt: context.prompt,
          artDirection: context.artDirection
        });
      } else {
        // Standard styling
        await this.assignTask(AgentRole.STYLIST, {
          action: 'apply_style',
          style: context.style,
          prompt: context.prompt
        });
      }
      
      // 4. Character Generation - Generate character identity if needed
      this.updateProgress('character_generation', 40, 100);
      const characterGenerator = this.getAgent(AgentRole.CHARACTER_GENERATOR);
      if (characterGenerator) {
        AgentLogger.logAgentAction(this, 'Process', 'Generating character information');
        
        // Extract character options if available
        const characterOptions = context.characterOptions || {};
        
        // Generate a character based on the styled prompt
        await this.assignTask(AgentRole.CHARACTER_GENERATOR, {
          action: 'generate_character',
          concept: context.prompt,
          categoryId: characterOptions.categoryId,
          seriesType: characterOptions.seriesType,
          allowAiEnhancement: characterOptions.allowAiEnhancement !== false
        });
      }
      
      // 5. Refinement - Optimize for the selected model
      this.updateProgress('refinement', 50, 100);
      const refiner = this.getAgent(AgentRole.REFINER);
      if (!refiner) {
        throw new Error('Refiner agent not registered');
      }
      
      // Send for refinement, including art direction for Magritte style
      await this.assignTask(AgentRole.REFINER, {
        action: 'optimize_for_model',
        model: 'black-forest-labs/flux-1.1-pro',
        prompt: context.prompt,
        artDirection: context.artDirection,
        character: context.character
      });
      
      // At this point, the image should be generated during refinement or will be generated
      // in the ArtBotMultiAgentSystem.saveResults method
      
      // 6. Critic Evaluation - Evaluate the generated artwork
      this.updateProgress('evaluation', 70, 100);
      const critic = this.getAgent(AgentRole.CRITIC);
      if (critic) {
        AgentLogger.logAgentAction(this, 'Process', 'Evaluating generated artwork with critic');
        
        // Evaluate the artwork
        await this.assignTask(AgentRole.CRITIC, {
          action: 'evaluate_result',
          previousResults: context
        });
        
        // If the evaluation score is too low, we could refine further
        if (context.evaluation && context.evaluation.score < 0.6) {
          AgentLogger.logAgentAction(this, 'Process', 'Refinement needed based on critic feedback');
          
          // Re-refine with feedback from the critic
          await this.assignTask(AgentRole.REFINER, {
            action: 'refine_prompt',
            prompt: context.prompt,
            feedback: context.evaluation.feedback,
            artDirection: context.artDirection,
            improvements: context.evaluation.improvements
          });
        }
      }
      
      // 7. Metadata Generation - Generate comprehensive metadata
      this.updateProgress('metadata', 80, 100);
      const metadataGenerator = this.getAgent(AgentRole.METADATA_GENERATOR);
      if (metadataGenerator) {
        AgentLogger.logAgentAction(this, 'Process', 'Generating comprehensive metadata');
        
        // Generate metadata
        await this.assignTask(AgentRole.METADATA_GENERATOR, {
          action: 'generate_metadata',
          previousResults: context,
          character: context.character
        });
      }
      
      // 8. Finalization
      this.updateProgress('finalization', 90, 100);
      
      const result = await this.collectResults();
      this.status = AgentStatus.SUCCESS;
      this.updateProgress('complete', 100, 100);
      
      return result;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Error', `Process error: ${error instanceof Error ? error.message : String(error)}`);
      
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
    const agent = this.getAgent(agentRole);
    if (!agent) {
      throw new Error(`Agent with role ${agentRole} not found`);
    }
    
    if (!this.context) {
      throw new Error('No active context');
    }
    
    // Create context for the agent
    const agentContext: AgentContext = {
      ...this.context,
      task
    };
    
    // Create a message for the task
    const message: AgentMessage = {
      id: uuidv4(),
      timestamp: new Date(),
      from: this.role,
      to: agentRole,
      direction: MessageDirection.OUTGOING,
      type: 'task',
      content: task
    };
    
    // Send the message to the agent
    await agent.handleMessage(message);
    
    // Log the interaction
    AgentLogger.logAgentInteraction(this, agent, `Assigned task: ${task.action}`);
    
    // Add to our message history
    this.messages.push(message);
    
    // Process the task
    const result = await agent.process(agentContext);
    
    // Update our context with the results
    if (result.success) {
      this.context = {
        ...this.context,
        ...result.output
      };
      
      // Add result messages to our history
      result.messages.forEach(msg => {
        if (!this.messages.some(m => m.id === msg.id)) {
          this.messages.push(msg);
        }
      });
    } else {
      throw result.error || new Error('Task failed');
    }
  }
  
  /**
   * Collect results
   */
  async collectResults(): Promise<AgentResult> {
    if (!this.context) {
      throw new Error('No active context');
    }
    
    AgentLogger.logAgentAction(this, 'Collect Results', 'Assembling final results');
    
    // Create result object
    const result = {
      success: true,
      output: this.context,
      messages: this.messages
    };
    
    return result;
  }
  
  /**
   * Handle a message
   */
  async handleMessage(message: AgentMessage): Promise<void> {
    AgentLogger.logAgentMessage(message);
    
    // Add to message history
    this.messages.push(message);
    
    // Process based on message type
    switch (message.type) {
      case 'request':
        // Handle request
        if (this.context) {
          this.context = {
            ...this.context,
            ...message.content
          };
        }
        break;
        
      case 'status':
        // Handle status update
        // Nothing to do here currently
        break;
        
      case 'response':
        // Handle response
        // Pass along to relevant agent if needed
        if (message.to !== this.role && message.to !== 'all') {
          const targetAgent = this.getAgent(message.to);
          if (targetAgent) {
            await targetAgent.handleMessage(message);
          }
        }
        break;
        
      default:
        // Handle other message types
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
      
      AgentLogger.logGenerationProgress(progress, total, stage);
    }
  }
} 