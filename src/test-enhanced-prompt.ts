/**
 * Enhanced Prompt Generator Test
 * Demonstrates the advanced prompt generation system for Surrealist Bear Portraits
 */

import { AIService } from './services/ai';
import { EnhancedPromptGenerator } from './services/style/enhancedPromptGenerator';

// Define test cases
const TEST_CASES = [
  {
    name: "Adventure Series - Explorer",
    concept: "a distinguished bear explorer in the arctic with navigation tools",
    options: {
      seriesId: "adventure"
    }
  },
  {
    name: "Artistic Series - Painter",
    concept: "a bear artist with palette and brushes",
    options: {
      seriesId: "artistic",
      templateId: "human_condition"
    }
  },
  {
    name: "Academic Series - Professor",
    concept: "a distinguished bear professor wearing scholarly robes",
    options: {
      seriesId: "academic",
      characterName: "Professor Bartholomew Bearington"
    }
  },
  {
    name: "Steampunk Series - Inventor",
    concept: "a steampunk bear inventor with brass-fitted contraptions",
    options: {
      seriesId: "steampunk",
      additionalElements: ["brass goggles", "copper gears", "steam-powered apparatus"]
    }
  },
  {
    name: "Son of Man Template",
    concept: "a dignified bear with an apple floating in front of the face",
    options: {
      templateId: "son_of_man"
    }
  }
];

/**
 * Run the enhanced prompt generator tests
 */
async function runTests() {
  console.log("\n🧪 Testing Enhanced Prompt Generator\n");
  
  // Initialize services
  const aiService = new AIService();
  await aiService.initialize();
  
  // Create generator
  const promptGenerator = new EnhancedPromptGenerator(aiService);
  
  // Run each test
  for (let i = 0; i < TEST_CASES.length; i++) {
    const test = TEST_CASES[i];
    
    console.log(`\n▶️ Test Case ${i+1}: ${test.name}`);
    console.log(`Concept: "${test.concept}"`);
    console.log('Options:', JSON.stringify(test.options, null, 2));
    
    try {
      // Generate prompt
      console.log(`\n📝 Generating prompt...`);
      const startTime = Date.now();
      const result = await promptGenerator.generatePrompt(test.concept, test.options);
      const duration = Date.now() - startTime;
      
      // Print results
      console.log(`\n✅ Successfully generated prompt in ${duration}ms`);
      
      // Print key details
      console.log(`\n🐻 Character: ${result.characterIdentity.name}`);
      console.log(`🏷️ Title: ${result.characterIdentity.title}`);
      console.log(`🎨 Series: ${result.series.name} (${result.series.emoji})`);
      console.log(`🖼️ Template: ${result.template.name} based on "${result.template.referenceArtwork}"`);
      
      // Print final prompt
      console.log(`\n🔤 FINAL PROMPT:`);
      console.log(`${result.prompt}`);
      
      // Print negative prompt
      console.log(`\n🚫 NEGATIVE PROMPT:`);
      console.log(`${result.negativePrompt}`);
      
      // Print conceptual process
      console.log(`\n💭 CONCEPTUAL PROCESS:`);
      console.log(`${result.conceptualProcess}`);
      
      console.log('\n' + '='.repeat(80));
    } catch (error) {
      console.error(`❌ Error generating prompt for "${test.name}":\n`, error);
    }
  }
  
  console.log("\n🏁 All tests completed\n");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests }; 