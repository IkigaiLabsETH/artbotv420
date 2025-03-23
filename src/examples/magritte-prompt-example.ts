/**
 * Magritte Prompt Generation Example
 * Demonstrates how to use the EnhancedMagrittePromptService with different emphasis options
 */

import { AIService } from '../services/ai';
import { EnhancedMagrittePromptService } from '../services/style/enhancedMagrittePromptService';
import { EnhancedLogger, LogLevel } from '../utils/enhancedLogger';

// Create a helper function to format the prompt output nicely
function formatPrompt(prompt: string): string {
  const lines = prompt.split('\n');
  const formatted = lines.map(line => `  ${line}`).join('\n');
  return formatted;
}

/**
 * Magritte Prompt Example
 * Demonstrates generating prompts with different emphasis options
 */
async function generateMagrittePromptExamples() {
  // Enable compact mode for prettier output
  EnhancedLogger.setCompactMode(true);
  
  // Header
  EnhancedLogger.printHeader('MAGRITTE PROMPT GENERATION EXAMPLES');
  
  // Initialize services
  EnhancedLogger.log('Initializing services...', LogLevel.INFO);
  const aiService = new AIService();
  await aiService.initialize();
  const promptService = new EnhancedMagrittePromptService(aiService);
  
  // 1. Get available options
  EnhancedLogger.printSection('Available Series');
  const series = promptService.getAvailableSeries();
  series.slice(0, 5).forEach(s => 
    EnhancedLogger.log(`${s.emoji} ${s.name}: ${s.description}`, LogLevel.INFO)
  );
  EnhancedLogger.log(`... and ${series.length - 5} more series`, LogLevel.INFO);
  
  EnhancedLogger.printSection('Available Templates');
  const templates = promptService.getAvailableTemplates();
  templates.slice(0, 5).forEach(t => 
    EnhancedLogger.log(`${t.name}: ${t.description}`, LogLevel.INFO)
  );
  EnhancedLogger.log(`... and ${templates.length - 5} more templates`, LogLevel.INFO);
  
  EnhancedLogger.printSection('Available Emphasis Options');
  const emphasisOptions = promptService.getAvailableEmphasisOptions();
  emphasisOptions.forEach(e => 
    EnhancedLogger.log(`${e.name}: ${e.description}`, LogLevel.INFO)
  );
  
  // 2. Generate prompts with different emphasis options
  EnhancedLogger.printSection('Generating Prompts');
  EnhancedLogger.log('Creating examples with different emphasis options...', LogLevel.INFO);
  
  const baseConcept = "a distinguished bear portrait in profile wearing a bowler hat";
  
  const examples = [
    { name: "Balanced Style", emphasis: "balanced" },
    { name: "Philosophical Depth", emphasis: "philosophical" },
    { name: "Pristine Execution", emphasis: "technical" },
    { name: "Dreamlike Clarity", emphasis: "dreamlike" },
    { name: "Traditional Techniques", emphasis: "traditional" }
  ];
  
  for (const example of examples) {
    EnhancedLogger.printSection(`EXAMPLE: ${example.name}`);
    EnhancedLogger.log(`Concept: "${baseConcept}"`, LogLevel.INFO);
    EnhancedLogger.log(`Emphasis: ${example.emphasis}`, LogLevel.INFO);
    
    // Generate the enhanced prompt with the specific emphasis
    const result = await promptService.generateEnhancedPrompt(
      baseConcept,
      {
        emphasis: example.emphasis as "balanced" | "philosophical" | "technical" | "dreamlike" | "traditional" | "surreal"
      }
    );
    
    // Log the results
    EnhancedLogger.log('EMPHASIS BLOCK:', LogLevel.INFO);
    console.log(formatPrompt(result.emphasisBlock));
    
    EnhancedLogger.log('FINAL PROMPT:', LogLevel.INFO);
    console.log(formatPrompt(result.prompt));
    
    EnhancedLogger.log('Metadata:', LogLevel.INFO);
    EnhancedLogger.log(`Character: ${result.characterIdentity.name}`, LogLevel.INFO);
    EnhancedLogger.log(`Template: ${result.templateName}`, LogLevel.INFO);
    EnhancedLogger.log(`Series: ${result.seriesName} ${result.seriesEmoji}`, LogLevel.INFO);
    
    console.log('\n' + '-'.repeat(80));
  }
  
  // 3. Generate a custom emphasis example
  EnhancedLogger.printSection('Custom Emphasis Example');
  
  // Generate a prompt with custom emphasis settings using an explicit object
  const customEmphasisResult = await promptService.generateEnhancedPrompt(
    baseConcept,
    {
      emphasis: {
        philosophical: true,
        technical: true,
        dreamlike: true,
        traditional: false,
        surreal: false
      }
    }
  );
  
  EnhancedLogger.log('EMPHASIS BLOCK:', LogLevel.INFO);
  console.log(formatPrompt(customEmphasisResult.emphasisBlock));
  
  EnhancedLogger.log('FINAL PROMPT:', LogLevel.INFO);
  console.log(formatPrompt(customEmphasisResult.prompt));
  
  EnhancedLogger.printHeader('MAGRITTE PROMPT GENERATION EXAMPLES COMPLETE');
}

// Run the example
generateMagrittePromptExamples().catch(error => {
  EnhancedLogger.log(`Error: ${error.message}`, LogLevel.ERROR);
}); 