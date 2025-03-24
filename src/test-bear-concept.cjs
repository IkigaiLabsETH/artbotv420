/**
 * Simple test script for BearConceptGenerator
 */

const { BearConceptGenerator } = require('../dist/generators/BearConceptGenerator');

// Create generator
const generator = new BearConceptGenerator();

// Generate concepts with different options
console.log('\n=== BEAR CONCEPT GENERATOR TEST ===\n');

// Default generation
console.log('DEFAULT CONCEPT:');
console.log(generator.generateBearConcept());
console.log('\n---\n');

// With bowler hat
console.log('WITH BOWLER HAT:');
console.log(generator.generateBearConcept({ forceBowlerHat: true }));
console.log('\n---\n');

// Series-based only
console.log('SERIES-BASED ONLY:');
console.log(generator.generateBearConcept({ 
  useSeries: true,
  useCategories: false,
  useRandomCombinations: false
}));
console.log('\n---\n');

// Categories-based only
console.log('CATEGORIES-BASED ONLY:');
console.log(generator.generateBearConcept({ 
  useSeries: false,
  useCategories: true,
  useRandomCombinations: false
}));
console.log('\n---\n');

// Random combinations only
console.log('RANDOM COMBINATIONS ONLY:');
console.log(generator.generateBearConcept({ 
  useSeries: false,
  useCategories: false,
  useRandomCombinations: true
}));
console.log('\n---\n');

// Generate multiple concepts
console.log('MULTIPLE CONCEPTS (3):');
generator.generateMultipleConcepts(3).forEach((concept, i) => {
  console.log(`[${i+1}] ${concept}`);
}); 