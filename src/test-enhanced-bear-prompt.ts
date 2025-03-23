/**
 * Test script for the enhanced bear prompt generator
 */

import { EnhancedBearPromptGenerator, EnhancedBearPromptOptions } from './generators/EnhancedBearPromptGenerator';
import { BEAR_SERIES } from './services/style/bearSeriesDefinitions';

// Create an instance of the enhanced generator
const promptGenerator = new EnhancedBearPromptGenerator();

// Function to print prompts with a header
function printPrompt(title: string, prompt: string) {
  console.log('\n' + '═'.repeat(100));
  console.log(`${title}:`);
  console.log('═'.repeat(100));
  console.log(prompt);
}

// Main function to run the examples
async function main() {
  console.log('\n' + '╭' + '─'.repeat(98) + '╮');
  console.log('│ ' + 'ENHANCED BEAR PORTRAIT PROMPT GENERATOR'.padEnd(97) + '│');
  console.log('│ ' + 'Generating sophisticated Magritte-style bear portrait prompts'.padEnd(97) + '│');
  console.log('╰' + '─'.repeat(98) + '╯');

  // Generate a basic prompt
  const basicPrompt = promptGenerator.generatePortraitPrompt();
  printPrompt('BASIC PROMPT', basicPrompt);

  // Generate a prompt with forced bowler hat
  const bowlerHatPrompt = promptGenerator.generatePortraitPrompt({ forceBowlerHat: true });
  printPrompt('BOWLER HAT PROMPT', bowlerHatPrompt);

  // Generate prompts for specific bear series
  console.log('\n' + '═'.repeat(100));
  console.log('SERIES-SPECIFIC PROMPTS:');
  console.log('═'.repeat(100));

  // Sample a few series to demonstrate
  const seriesToTest = ['academic', 'artistic', 'classical', 'adventure'];

  for (const seriesId of seriesToTest) {
    const seriesPrompt = promptGenerator.generatePortraitPrompt({ seriesId });
    const seriesName = BEAR_SERIES.find(s => s.id === seriesId)?.name || seriesId;
    console.log(`\n[${seriesName}]:`);
    console.log(seriesPrompt);
  }

  // Compare to a simpler format
  console.log('\n' + '═'.repeat(100));
  console.log('SIMPLIFIED FORMAT EXAMPLE (for comparison):');
  console.log('═'.repeat(100));
  console.log(`a distinguished bear portrait in profile wearing a bowler hat, pristine collar, and golden medallion, dressed in a formal suit, with antique pocket watch, painted in Magritte's precise style against a Belgian sky blue background`);

  // Generate multiple prompts
  console.log('\n' + '═'.repeat(100));
  console.log('MULTIPLE PROMPT EXAMPLES:');
  console.log('═'.repeat(100));

  const multiplePrompts = promptGenerator.generateMultiplePrompts(3);
  multiplePrompts.forEach((prompt, index) => {
    console.log(`\n[Example ${index + 1}]:`);
    console.log(prompt);
  });
}

// Run the examples
main().catch(console.error); 