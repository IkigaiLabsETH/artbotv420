/**
 * Enhanced Magritte Style Example
 * Demonstrates the advanced Magritte style rendering with precise technical elements
 */

import { AIService } from '../services/ai';
import { EnhancedMagrittePromptService } from '../services/style/enhancedMagrittePromptService';
import { magritteStyleElements } from '../services/style/magritteStyleElements';

// Helper function for nice formatting
function formatPrompt(prompt: string): string {
  const lines = prompt.split('\n');
  const formatted = lines.map(line => `  ${line}`).join('\n');
  return formatted;
}

/**
 * Example showing enhanced Magritte style rendering with precise technical specifications
 */
async function demonstrateEnhancedMagritteStyle() {
  console.log('🎨 ENHANCED MAGRITTE STYLE EXAMPLES\n');
  
  // Initialize services
  console.log('Initializing services...');
  const aiService = new AIService();
  await aiService.initialize();
  const promptService = new EnhancedMagrittePromptService(aiService);
  
  // 1. Show available visual elements, style emphasis, and color palette
  console.log('\n📋 Enhanced Magritte Style Elements:');
  
  console.log('\n💠 Style Emphasis:');
  magritteStyleElements.styleEmphasis.forEach(element => console.log(`  - ${element}`));
  
  console.log('\n🎭 Visual Elements:');
  magritteStyleElements.visualElements.forEach(element => console.log(`  - ${element}`));
  
  console.log('\n🎨 Color Palette:');
  magritteStyleElements.colorPalette.forEach(color => console.log(`  - ${color}`));
  
  console.log('\n📐 Composition Guidelines:');
  magritteStyleElements.compositionGuidelines.slice(0, 5).forEach(guideline => console.log(`  - ${guideline}`));
  console.log(`  - ... and ${magritteStyleElements.compositionGuidelines.length - 5} more guidelines`);
  
  // 2. Define test cases highlighting specific Magritte elements
  const examples = [
    {
      name: "Son of Man - Magritte's Iconic Apple",
      concept: "a distinguished academic bear with a floating green apple obscuring the face",
      options: {
        seriesId: "academic",
        templateId: "son_of_man", 
        preferredVisualElements: [
          "perfect green apples", 
          "floating bowler hats", 
          "pristine blue skies"
        ],
        colorPalette: [
          "Magritte sky blue (RGB: 135, 206, 235)",
          "perfect apple green (RGB: 86, 130, 89)",
          "deep shadow grey (RGB: 74, 74, 74)"
        ]
      }
    },
    {
      name: "Empire of Light - Day/Night Paradox",
      concept: "a distinguished bear standing beneath a sky that is day above and night below",
      options: {
        seriesId: "mystical",
        preferredVisualElements: [
          "pristine blue skies", 
          "impossible shadows",
          "metaphysical curtains"  
        ],
        colorPalette: [
          "Magritte sky blue (RGB: 135, 206, 235)",
          "deep night blue (RGB: 25, 25, 112)",
          "pristine cloud white (RGB: 245, 245, 245)"
        ]
      }
    },
    {
      name: "Human Condition - Window Paradox",
      concept: "a distinguished bear artist standing before an easel with a painting that seamlessly continues the landscape behind it",
      options: {
        seriesId: "artistic",
        templateId: "human_condition",
        preferredVisualElements: [
          "mysterious windows", 
          "traditional frames", 
          "surreal landscapes"
        ]
      }
    },
    {
      name: "Perfect Mathematical Balance",
      concept: "a distinguished steampunk bear inventor with floating mechanical objects arranged in perfect mathematical precision",
      options: {
        seriesId: "steampunk",
        preferredVisualElements: [
          "mathematically precise clouds", 
          "floating stones"
        ],
        colorPalette: [
          "matte black (RGB: 28, 28, 28)",
          "stone grey (RGB: 128, 128, 128)",
          "shadow blue (RGB: 68, 85, 90)"
        ]
      }
    },
    {
      name: "Philosophical Meta-Awareness Bear",
      concept: "a distinguished philosophical bear contemplating its own existence as digital art",
      options: {
        seriesId: "philosophical",
        templateId: "meta_artistic",
        preferredVisualElements: [
          "eyes containing miniature paradoxical landscape (Magritte's False Mirror technique)",
          "bear silhouette containing impossible interior landscape (Personal Values technique)",
          "subtle ceci n'est pas un ours paradox in composition",
          "digital meta-awareness suggested through frame-breaking elements",
          "NFT-specific visual paradoxes rendered in Magritte's technical style"
        ],
        colorPalette: [
          "Magritte Cerulean (RGB: 0, 123, 167) (Guaranteed to render accurately on digital displays)",
          "Precise Shadow Grey (RGB: 64, 64, 64) (Calibrated to match Magritte's museum display lighting)",
          "Belgian Museum White (RGB: 253, 253, 253) (Spectrally optimized for digital reproduction)",
          "Quantum Blue (non-natural blue impossible in physical pigments)"
        ],
        compositionGuidelines: [
          "Golden ratio positioning of all bear portrait elements (φ = 1.618...)",
          "Fibonacci spiral arrangement of visual weight and color emphasis",
          "Zero visual noise in color field transitions",
          "Perfect edge acutance at mathematical maximum"
        ],
        narrativeElements: [
          "Distinguished bear character exists at intersection of physical and digital reality",
          "Bear portrait serves as gateway between metaverse and traditional art history",
          "Portrait serves as philosophical exploration of NFT permanence vs. ephemeral art"
        ],
        metaArtisticElements: [
          "Portrait contains subtle acknowledgment of its digital nature",
          "Image includes Magritte-style paradox about NFT art status",
          "Composition references its existence in a larger collection"
        ],
        enhancedTechnicalParams: {
          surfaceQuality: 0.98,
          edgePrecision: 0.97,
          colorPurity: 0.95,
          lightingControl: 0.97,
          atmosphericPerspective: 0.94,
          materialParadox: 0.92,
          conceptualClarity: 0.96,
          metaphysicalDepth: 0.95,
          technicalInvisibility: 0.98,
          blockchainResonance: 0.90
        }
      }
    }
  ];
  
  // 3. Generate each example prompt
  console.log('\n🔄 Generating enhanced Magritte style prompts...\n');
  
  for (const example of examples) {
    console.log(`\n📌 EXAMPLE: ${example.name}`);
    console.log(`   Concept: "${example.concept}"`);
    
    if (example.options.preferredVisualElements) {
      console.log('\n   🎭 Preferred Visual Elements:');
      example.options.preferredVisualElements.forEach(element => console.log(`   - ${element}`));
    }
    
    if (example.options.colorPalette) {
      console.log('\n   🎨 Specified Color Palette:');
      example.options.colorPalette.forEach(color => console.log(`   - ${color}`));
    }
    
    // Generate the prompt
    const result = await promptService.generateEnhancedPrompt(example.concept, example.options);
    
    // Print key components
    console.log('\n   ✨ STYLE BLOCK:');
    console.log(formatPrompt(result.promptStructure.styleBlock));
    
    console.log('\n   🎨 COLOR INSTRUCTIONS:');
    console.log(formatPrompt(result.promptStructure.colorInstructions));
    
    console.log('\n   📐 COMPOSITION INSTRUCTIONS:');
    console.log(formatPrompt(result.promptStructure.compositionInstructions));
    
    console.log('\n   📝 FINAL PROMPT:');
    console.log(formatPrompt(result.prompt));
    
    console.log('\n   🚫 NEGATIVE PROMPT:');
    console.log(formatPrompt(result.negativePrompt));
    
    console.log('\n' + '-'.repeat(80));
  }
  
  // 4. Example showcasing how to combine all the elements with a custom emphasis
  console.log('\n🔄 Generating a comprehensive Magritte example with all enhanced elements...\n');
  
  const comprehensiveExample = await promptService.generateEnhancedPrompt(
    "a distinguished philosophical bear seated at a desk with a pipe that transforms into a bird",
    {
      seriesId: "academic",
      emphasis: "balanced",
      preferredVisualElements: [
        "philosophical pipes", 
        "mysterious birds", 
        "perfect mirrors", 
        "enigmatic figures"
      ],
      colorPalette: [
        "shadow blue (RGB: 68, 85, 90)",
        "rich earth brown (RGB: 139, 69, 19)",
        "twilight purple (RGB: 78, 81, 128)"
      ]
    }
  );
  
  console.log('📌 COMPREHENSIVE MAGRITTE EXAMPLE:');
  
  console.log('\n✨ EMPHASIS BLOCK:');
  console.log(formatPrompt(comprehensiveExample.promptStructure.emphasisBlock));
  
  console.log('\n🎭 STYLE BLOCK:');
  console.log(formatPrompt(comprehensiveExample.promptStructure.styleBlock));
  
  console.log('\n🎨 COLOR INSTRUCTIONS:');
  console.log(formatPrompt(comprehensiveExample.promptStructure.colorInstructions));
  
  console.log('\n📐 COMPOSITION INSTRUCTIONS:');
  console.log(formatPrompt(comprehensiveExample.promptStructure.compositionInstructions));
  
  console.log('\n📝 FINAL COMBINED PROMPT:');
  console.log(formatPrompt(comprehensiveExample.prompt));
  
  // Add a section for generating and showing the meta-artistic philosophical bear
  console.log('\n🧠 META-ARTISTIC PHILOSOPHICAL BEAR:');
  const philosophicalBearExample = examples.find(ex => ex.name === "Philosophical Meta-Awareness Bear");
  if (philosophicalBearExample) {
    console.log(`\n📝 Concept: ${philosophicalBearExample.concept}`);
    
    console.log('\n🔍 Enhanced Meta-Artistic Elements:');
    philosophicalBearExample.options.metaArtisticElements?.forEach(element => 
      console.log(`  - ${element}`)
    );
    
    console.log('\n🧩 Narrative Elements:');
    philosophicalBearExample.options.narrativeElements?.forEach(element => 
      console.log(`  - ${element}`)
    );
    
    console.log('\n⚙️ Advanced Technical Parameters:');
    Object.entries(philosophicalBearExample.options.enhancedTechnicalParams || {}).forEach(([key, value]) => 
      console.log(`  - ${key}: ${value}`)
    );
    
    // Generate the enhanced prompt
    console.log('\n🎨 Generating enhanced philosophical bear prompt...');
    try {
      const result: any = await promptService.generateEnhancedPrompt(
        philosophicalBearExample.concept,
        philosophicalBearExample.options
      );
      
      console.log('\n📋 Enhanced Meta-Artistic Philosophical Bear Prompt:');
      if (result && typeof result === 'object' && 'prompt' in result) {
        console.log(formatPrompt(result.prompt));
      } else {
        console.log(formatPrompt(String(result)));
      }
    } catch (error) {
      console.error('Error generating enhanced prompt:', error);
    }
  }
  
  console.log('\n🏁 ENHANCED MAGRITTE STYLE EXAMPLES COMPLETE');
}

// Run the example if this file is executed directly
if (require.main === module) {
  demonstrateEnhancedMagritteStyle().catch(console.error);
}

export { demonstrateEnhancedMagritteStyle }; 