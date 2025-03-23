/**
 * Test script for varied bear portrait generation
 * A simplified version without the multi-agent system that just shows how to use the concept generator
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { ReplicateService } from './services/replicate';
import { bearConceptGenerator } from './generators/BearConceptGenerator';

// Load environment variables
dotenv.config();

/**
 * Generate an image with a random bear concept
 */
async function generateVariedBear() {
  console.log('\n════════════════════════════════════════════════════');
  console.log('    🐻 VARIED BEAR PORTRAIT GENERATOR 🎨');
  console.log('════════════════════════════════════════════════════\n');

  try {
    // Create Replicate service
    const replicateService = new ReplicateService({
      apiKey: process.env.REPLICATE_API_KEY,
      defaultModel: 'black-forest-labs/flux-1.1-pro',
      defaultWidth: 1024,
      defaultHeight: 1024,
      defaultNumInferenceSteps: 28,
      defaultGuidanceScale: 3.0
    });

    // Initialize service
    await replicateService.initialize();
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const numImages = args.find(arg => /^\d+$/.test(arg)) ? parseInt(args.find(arg => /^\d+$/.test(arg))!, 10) : 1;
    
    // Generate multiple images if requested
    for (let i = 0; i < numImages; i++) {
      console.log(`\n📷 Generating image ${i + 1} of ${numImages}...\n`);
      
      // Generate a random concept
      const forceBowlerHat = args.includes('--bowler');
      const concept = bearConceptGenerator.generateBearConcept({ forceBowlerHat });
      
      // Show the concept
      console.log(`📝 Concept: ${concept}\n`);
  
      // Generate the image
      console.log('🖼️ Generating image...');
      const imageUrl = await replicateService.generateImage(concept);
      
      // Show the image URL
      console.log('\n✅ Image generated!');
      console.log(`🔗 Image URL: ${imageUrl}\n`);
    }
  } catch (error) {
    console.error('\n❌ Error generating image:', error);
  }
}

// Run the generator
generateVariedBear().catch(console.error); 