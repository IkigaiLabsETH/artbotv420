/**
 * Magritte Focus Test
 * Demonstrates the advanced prompt generation with emphasis on Magritte's key elements
 */

import { AIService } from './services/ai';
import { EnhancedPromptGenerator } from './services/style/enhancedPromptGenerator';

// Define test cases with focus on different Magritte elements
const TEST_CASES = [
  {
    name: "Philosophical Depth Focus",
    concept: "a distinguished bear professor contemplating the nature of reality",
    options: {
      seriesId: "academic",
      emphasisPriorities: {
        philosophical: true,
        technical: false,
        dreamlike: false,
        traditional: false,
        surreal: false
      }
    }
  },
  {
    name: "Pristine Execution Focus",
    concept: "a bear painter with immaculate technique applying precise brushstrokes",
    options: {
      seriesId: "artistic",
      emphasisPriorities: {
        philosophical: false,
        technical: true,
        dreamlike: false,
        traditional: false,
        surreal: false
      }
    }
  },
  {
    name: "Dreamlike Clarity Focus",
    concept: "a mystical bear shaman in an otherworldly yet perfectly clear realm",
    options: {
      seriesId: "mystical",
      emphasisPriorities: {
        philosophical: false,
        technical: false,
        dreamlike: true,
        traditional: false,
        surreal: false
      }
    }
  },
  {
    name: "Traditional Techniques Focus",
    concept: "a classical bear musician rendered with traditional oil painting methods",
    options: {
      seriesId: "classical",
      emphasisPriorities: {
        philosophical: false,
        technical: false,
        dreamlike: false,
        traditional: true,
        surreal: false
      }
    }
  },
  {
    name: "Surreal Juxtapositions Focus",
    concept: "a steampunk bear inventor with everyday objects in impossible configurations",
    options: {
      seriesId: "steampunk",
      emphasisPriorities: {
        philosophical: false,
        technical: false,
        dreamlike: false,
        traditional: false,
        surreal: true
      }
    }
  },
  {
    name: "Balanced Magritte Style",
    concept: "a distinguished bear with a floating green apple obscuring its face",
    options: {
      templateId: "son_of_man",
      emphasisPriorities: {
        philosophical: true,
        technical: true,
        dreamlike: true,
        traditional: true,
        surreal: true
      }
    }
  }
];

/**
 * Run the enhanced prompt generator tests with Magritte focus
 */
async function runMagritteFocusTests() {
  console.log("\n🧪 Testing Enhanced Prompt Generator with Magritte Element Focus\n");
  
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
      
      // Print emphasis block
      console.log(`\n🔍 MAGRITTE EMPHASIS:`);
      console.log(`${result.promptStructure.emphasisBlock}`);
      
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
  
  console.log("\n🏁 All Magritte focus tests completed\n");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runMagritteFocusTests().catch(console.error);
}

export { runMagritteFocusTests }; 