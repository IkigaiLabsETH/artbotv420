/**
 * Character Generation Test
 * Tests the enhanced character generation capabilities with different categories
 */

// Import required modules
import dotenv from 'dotenv';
import { AIService } from './services/ai/index';
import { EnhancedCharacterGenerator, CharacterGenerationOptions } from './generators/EnhancedCharacterGenerator';
import { CharacterGeneratorAgent } from './agents/CharacterGeneratorAgent';
import { SeriesType, characterCategories, getCategoryById, getRandomCategory } from './config/characterCategoriesConfig';
import { AgentLogger } from './utils/agentLogger';

// Load environment variables
dotenv.config();

// Check for API key
const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.error('Error: No API key found. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY in .env file.');
  process.exit(1);
}

// Initialize the AI service
const aiService = new AIService({
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Main function to test the character generation
 */
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let categoryId = '';
  let seriesTypeStr = '';
  let concept = '';
  
  // Process arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--category' && i + 1 < args.length) {
      categoryId = args[i + 1];
      i++;
    } else if (args[i] === '--series' && i + 1 < args.length) {
      seriesTypeStr = args[i + 1];
      i++;
    } else if (args[i] === '--concept' && i + 1 < args.length) {
      concept = args[i + 1];
      i++;
    } else if (!concept) {
      // If no concept flag is provided, use the first unrecognized argument as the concept
      concept = args[i];
    }
  }
  
  // Initialize the character generator
  console.log('Initializing Character Generator...');
  const characterGeneratorAgent = new CharacterGeneratorAgent(aiService);
  await characterGeneratorAgent.initialize();
  
  // Prepare generation options
  const options: CharacterGenerationOptions = {
    allowAiEnhancement: true
  };
  
  // Handle specific category
  if (categoryId) {
    const category = getCategoryById(categoryId);
    if (category) {
      options.categoryId = categoryId;
      console.log(`Selected category: ${category.name} (${category.id})`);
    } else {
      console.warn(`Warning: Category '${categoryId}' not found. Using auto-detection.`);
    }
  }
  
  // Handle specific series
  if (seriesTypeStr) {
    try {
      const seriesType = SeriesType[seriesTypeStr.toUpperCase() as keyof typeof SeriesType];
      if (seriesType) {
        options.seriesType = seriesType;
        console.log(`Selected series: ${seriesType}`);
      } else {
        console.warn(`Warning: Series '${seriesTypeStr}' not found. Using auto-detection.`);
      }
    } catch (error) {
      console.warn(`Warning: Invalid series '${seriesTypeStr}'. Using auto-detection.`);
    }
  }
  
  // If no concept is provided, generate a random concept
  if (!concept) {
    const randomCategory = getRandomCategory();
    concept = `Distinguished ${randomCategory.name.toLowerCase()} portrait in René Magritte's surrealist style`;
    console.log(`Generated concept: "${concept}"`);
  }
  
  console.log('\nGenerating character...');
  console.log('----------------------');
  
  try {
    // Generate the character
    const character = await characterGeneratorAgent.generateCharacter(concept, options);
    
    // Print the character details
    console.log('\n✨ Generated Character:');
    console.log(`🎩 Name: ${character.name}`);
    console.log(`🏆 Title: ${character.title}`);
    if (character.nickname) {
      console.log(`📝 Nickname: ${character.nickname}`);
    }
    console.log(`👔 Occupation: ${character.occupation || 'Unknown'}`);
    console.log(`🧠 Personality: ${character.personality.join(', ')}`);
    
    if (character.specialItems && character.specialItems.length > 0) {
      console.log(`🔮 Special Items: ${character.specialItems.join(', ')}`);
    }
    
    console.log('\n📖 Backstory:');
    console.log(character.backstory);
    
    if (character.traits) {
      console.log('\n🏷️ Traits:');
      for (const [key, value] of Object.entries(character.traits)) {
        console.log(`  ${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
      }
    }
    
    // Print JSON format
    console.log('\n📋 JSON Format:');
    console.log(JSON.stringify(character, null, 2));
    
  } catch (error) {
    console.error('Error generating character:', error);
  }
}

// Run the main function
main().catch(console.error);

/**
 * Display available categories and series
 */
function printAvailableOptions() {
  console.log('\nAvailable Categories:');
  console.log('--------------------');
  
  const seriesMap = new Map<SeriesType, string[]>();
  
  // Group categories by series
  for (const category of characterCategories) {
    if (!seriesMap.has(category.series)) {
      seriesMap.set(category.series, []);
    }
    
    seriesMap.get(category.series)?.push(`${category.id} (${category.name})`);
  }
  
  // Print categories by series
  for (const [series, categories] of seriesMap.entries()) {
    console.log(`\n${series}:`);
    for (const category of categories) {
      console.log(`  - ${category}`);
    }
  }
  
  console.log('\nUsage Examples:');
  console.log('-------------');
  console.log('npm run character-gen --category bear_pfp_pilot');
  console.log('npm run character-gen --series ACADEMIC');
  console.log('npm run character-gen --concept "A distinguished bear professor with a tweed jacket"');
}

// Check if the user wants to see available options
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  printAvailableOptions();
} 