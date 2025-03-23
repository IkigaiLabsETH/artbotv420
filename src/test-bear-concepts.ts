/**
 * Test script for BearConceptGenerator
 * 
 * Generates a variety of bear portrait concepts to demonstrate the diversity
 * of ideas that can be created.
 */

import { bearConceptGenerator, BearConceptOptions } from './generators/BearConceptGenerator';

// Parse command line arguments
const args = process.argv.slice(2);
const count = parseInt(args.find(arg => /^\d+$/.test(arg)) || '5', 10);
const forceBowlerHat = args.includes('--bowler');
const onlySeries = args.includes('--series');
const onlyCategories = args.includes('--categories');
const onlyRandom = args.includes('--random');

// Build options
const options: BearConceptOptions = {
  useSeries: !onlyCategories && !onlyRandom,
  useCategories: !onlySeries && !onlyRandom,
  useRandomCombinations: !onlySeries && !onlyCategories,
  forceBowlerHat
};

// Function to log an example concept
function logConcept(concept: string, index: number): void {
  console.log(`\n${index + 1}. ${concept}`);
}

// Generate and display concepts
function generateAndDisplay(): void {
  console.log('\n=====================================================');
  console.log('🎨 BEAR PORTRAIT CONCEPT GENERATOR 🐻');
  console.log('=====================================================');
  
  // Display settings
  console.log('\nGeneration settings:');
  console.log(`- Number of concepts: ${count}`);
  console.log(`- Force bowler hat: ${forceBowlerHat ? 'yes' : 'no'}`);
  console.log(`- Use series: ${options.useSeries ? 'yes' : 'no'}`);
  console.log(`- Use categories: ${options.useCategories ? 'yes' : 'no'}`);
  console.log(`- Use random combinations: ${options.useRandomCombinations ? 'yes' : 'no'}`);
  
  // Generate concepts
  console.log('\n✨ Generated Concepts:');
  const concepts = bearConceptGenerator.generateMultipleConcepts(count, options);
  
  // Display each concept
  concepts.forEach(logConcept);
  
  console.log('\n=====================================================');
  console.log('Try running with different options:');
  console.log('  --bowler      Force the use of a bowler hat');
  console.log('  --series      Only use bear series templates');
  console.log('  --categories  Only use character categories');
  console.log('  --random      Only use random combinations');
  console.log('  <number>      Generate this many concepts');
  console.log('=====================================================\n');
}

// Run the generator
generateAndDisplay(); 