/**
 * Critic Agent
 * Responsible for evaluating and providing feedback on generated artwork
 */

import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentContext, AgentMessage, AgentResult, AgentRole, AgentStatus, CriticAgent as ICriticAgent, MessageDirection } from './types';
import { AgentLogger, LogLevel } from '../utils/agentLogger';
import { AIService } from '../services/ai/index';

/**
 * Critic Agent implementation
 */
export class CriticAgent implements ICriticAgent {
  id: string;
  role: AgentRole.CRITIC;
  status: AgentStatus;
  
  private aiService: AIService;
  private messages: AgentMessage[];
  
  /**
   * Constructor
   */
  constructor(aiService: AIService) {
    this.id = uuidv4().substring(0, 8);
    this.role = AgentRole.CRITIC;
    this.status = AgentStatus.IDLE;
    this.aiService = aiService;
    this.messages = [];
    
    AgentLogger.logAgentAction(this, 'Initialize', 'Critic agent created');
  }
  
  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.status = AgentStatus.IDLE;
    AgentLogger.logAgentAction(this, 'Initialize', 'Critic agent initialized');
  }

  /**
   * Evaluate a generated result
   */
  async evaluateResult(result: any): Promise<{
    score: number;
    feedback: string;
    improvements: string[];
  }> {
    this.status = AgentStatus.BUSY;
    AgentLogger.logAgentAction(this, 'Evaluate Result', 'Evaluating generated artwork result');
    
    try {
      // Extract art information
      const prompt = result.prompt || '';
      const style = result.style || 'magritte';
      const imageUrl = result.imageUrl || '';
      
      // Perform basic evaluation if we don't have an AI service
      if (!this.aiService) {
        const basicEvaluation = this.performBasicEvaluation(prompt, style);
        this.status = AgentStatus.SUCCESS;
        return basicEvaluation;
      }
      
      // Using AI service for advanced evaluation
      const evaluationCriteria = [
        'Style consistency with ' + style,
        'Visual quality and appeal',
        'Concept-prompt alignment',
        'Technical execution',
        'Surrealist elements (for Magritte style)',
        'Emotional impact'
      ];
      
      const aiPrompt = `
      Evaluate this AI-generated artwork based on the following criteria:
      
      Prompt: "${prompt}"
      Style requested: ${style}
      ${imageUrl ? `Image URL (if you can access it): ${imageUrl}` : ''}
      
      Evaluation criteria:
      ${evaluationCriteria.map(criterion => `- ${criterion}`).join('\n')}
      
      Provide:
      1. A score from 0.0 to 1.0 (where 1.0 is perfect)
      2. Brief feedback (2-3 sentences max)
      3. A list of 2-3 specific improvements
      
      Format your response in JSON:
      {
        "score": number,
        "feedback": "string",
        "improvements": ["string", "string", "string"]
      }
      `;
      
      const response = await this.aiService.getCompletion({
        messages: [
          { role: 'system', content: 'You are an expert art critic specializing in evaluating AI-generated artwork with a focus on René Magritte-style surrealism.' },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.3
      });
      
      // Parse the response to get evaluation data
      let evaluation;
      try {
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          evaluation = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        AgentLogger.logAgentAction(this, 'Parse Error', `Failed to parse AI response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
        evaluation = this.performBasicEvaluation(prompt, style);
      }
      
      this.status = AgentStatus.SUCCESS;
      AgentLogger.logAgentAction(this, 'Evaluation Complete', `Score: ${evaluation.score}, Feedback: ${evaluation.feedback}`);
      
      return evaluation;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      AgentLogger.logAgentAction(this, 'Evaluation Error', `Error: ${error instanceof Error ? error.message : String(error)}`);
      
      // Return a default evaluation
      return this.performBasicEvaluation(result.prompt || '', result.style || 'magritte');
    }
  }
  
  /**
   * Perform a basic evaluation without using AI
   */
  private performBasicEvaluation(prompt: string, style: string): {
    score: number;
    feedback: string;
    improvements: string[];
  } {
    // Very basic evaluation metrics based on prompt
    const promptLength = prompt.length;
    const hasMagritteElements = style.toLowerCase().includes('magritte') && 
      (prompt.toLowerCase().includes('bowler hat') || 
       prompt.toLowerCase().includes('surreal') || 
       prompt.toLowerCase().includes('photorealistic'));
    
    // Score calculation (very simplified)
    const lengthScore = Math.min(1.0, promptLength / 200); // Prompt length up to 200 chars
    const styleScore = hasMagritteElements ? 0.8 : 0.6; // Higher score for Magritte elements
    
    const score = (lengthScore * 0.3) + (styleScore * 0.7);
    
    return {
      score,
      feedback: `Generated artwork has ${hasMagritteElements ? 'good' : 'partial'} style alignment and ${promptLength > 150 ? 'detailed' : 'basic'} prompt specificity.`,
      improvements: [
        'Add more specific surrealist elements to enhance the Magritte style',
        'Improve technical details about lighting and atmosphere',
        'Consider adding more philosophical or paradoxical elements'
      ]
    };
  }
  
  /**
   * Process a context
   */
  async process(context: AgentContext): Promise<AgentResult> {
    this.status = AgentStatus.BUSY;
    
    try {
      // Check what task we need to perform
      const task = context.task?.action || 'evaluate_result';
      
      if (task === 'evaluate_result') {
        // Extract what we need to evaluate
        const result = context.previousResults || context;
        
        // Evaluate the result
        const evaluation = await this.evaluateResult(result);
        
        // Create a result message
        const resultMessage: AgentMessage = {
          id: uuidv4(),
          timestamp: new Date(),
          from: this.role,
          to: AgentRole.DIRECTOR,
          direction: MessageDirection.OUTGOING,
          type: 'result',
          content: { evaluation }
        };
        
        // Log the message and add it to our list
        AgentLogger.logAgentMessage(resultMessage);
        this.messages.push(resultMessage);
        
        // Return success
        this.status = AgentStatus.SUCCESS;
        return {
          success: true,
          output: { evaluation },
          messages: [resultMessage]
        };
      }
      
      // If we don't know the task, return an error
      throw new Error(`Unknown task: ${task}`);
    } catch (error) {
      this.status = AgentStatus.ERROR;
      
      // Create an error message
      const errorMessage: AgentMessage = {
        id: uuidv4(),
        timestamp: new Date(),
        from: this.role,
        to: AgentRole.DIRECTOR,
        direction: MessageDirection.OUTGOING,
        type: 'error',
        content: { error: error instanceof Error ? error.message : String(error) }
      };
      
      // Log the message and add it to our list
      AgentLogger.logAgentMessage(errorMessage);
      this.messages.push(errorMessage);
      
      // Return error
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        messages: [errorMessage]
      };
    }
  }
  
  /**
   * Handle a message from another agent
   */
  async handleMessage(message: AgentMessage): Promise<void> {
    // Add the message to our list
    this.messages.push(message);
    
    // Log the message
    AgentLogger.logAgentMessage(message);
  }
} 