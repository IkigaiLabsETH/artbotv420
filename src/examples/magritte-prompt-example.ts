/**
 * Magritte Prompt Generation Example
 * Demonstrates how to use the EnhancedMagrittePromptService with different emphasis options
 */

import { AIService } from '../services/ai';
import { EnhancedMagrittePromptService } from '../services/style/enhancedMagrittePromptService';

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
  console.log('🎨 MAGRITTE PROMPT GENERATION EXAMPLES\n');
  
  // Initialize services
  console.log('Initializing services...');
  const aiService = new AIService();
  await aiService.initialize();
  const promptService = new EnhancedMagrittePromptService(aiService);
  
  // 1. Get available options
  console.log('\n📋 Available Series:');
  const series = promptService.getAvailableSeries();
  series.slice(0, 5).forEach(s => console.log(`  - ${s.emoji} ${s.name}: ${s.description}`));
  console.log(`  - ... and ${series.length - 5} more series`);
  
  console.log('\n📋 Available Templates:');
  const templates = promptService.getAvailableTemplates();
  templates.slice(0, 5).forEach(t => console.log(`  - ${t.name}: ${t.description}`));
  console.log(`  - ... and ${templates.length - 5} more templates`);
  
  console.log('\n📋 Available Emphasis Options:');
  const emphasisOptions = promptService.getAvailableEmphasisOptions();
  emphasisOptions.forEach(e => console.log(`  - ${e.name}: ${e.description}`));
  
  // 2. Generate prompts with different emphasis options
  console.log('\n🔄 Generating prompts with different emphasis options...\n');
  
  // Define a base concept
  const baseConcept = 'a distinguished bear professor with a pipe and bowler hat';
  
  // Define the examples to generate
  const examples = [
    { name: 'Balanced Style', emphasis: 'balanced' },
    { name: 'Philosophical Depth', emphasis: 'philosophical' },
    { name: 'Pristine Execution', emphasis: 'technical' },
    { name: 'Dreamlike Clarity', emphasis: 'dreamlike' },
    { name: 'Traditional Techniques', emphasis: 'traditional' },
    { name: 'Surreal Juxtapositions', emphasis: 'surreal' }
  ];
  
  // Generate each example
  for (const example of examples) {
    console.log(`\n📌 EXAMPLE: ${example.name}`);
    console.log(`   Concept: "${baseConcept}"`);
    console.log(`   Emphasis: ${example.emphasis}`);
    
    const result = await promptService.generateEnhancedPrompt(baseConcept, {
      seriesId: 'academic',
      templateId: 'son_of_man',
      emphasis: example.emphasis as any
    });
    
    console.log('\n   ✨ EMPHASIS BLOCK:');
    console.log(formatPrompt(result.emphasisBlock));
    
    console.log('\n   ✨ FINAL PROMPT:');
    console.log(formatPrompt(result.prompt));
    
    console.log('\n   --- Metadata ---');
    console.log(`   Character: ${result.characterIdentity.name}`);
    console.log(`   Template: ${result.templateName}`);
    console.log(`   Series: ${result.seriesName} ${result.seriesEmoji}`);
    
    console.log('\n' + '-'.repeat(80));
  }
  
  // 3. Generate prompts with custom emphasis configuration
  console.log('\n🔄 Generating a prompt with custom emphasis configuration...\n');
  
  const customEmphasisResult = await promptService.generateEnhancedPrompt(
    'a mystical bear shaman with ancient scrolls and ceremonial artifacts',
    {
      seriesId: 'mystical',
      emphasis: {
        philosophical: true,
        technical: true,
        dreamlike: true,
        traditional: false,
        surreal: false
      }
    }
  );
  
  console.log('📌 CUSTOM EMPHASIS EXAMPLE:');
  console.log('\n   ✨ EMPHASIS BLOCK:');
  console.log(formatPrompt(customEmphasisResult.emphasisBlock));
  
  console.log('\n   ✨ FINAL PROMPT:');
  console.log(formatPrompt(customEmphasisResult.prompt));
  
  console.log('\n🎭 MAGRITTE PROMPT GENERATION EXAMPLES COMPLETE');
}

// Run the example if this file is executed directly
if (require.main === module) {
  generateMagrittePromptExamples().catch(console.error);
}

export { generateMagrittePromptExamples }; 