# Varied Bear Portrait Generator

This module enhances the ArtBot system by providing much greater variety in the generated bear portrait concepts. Instead of always generating the same "distinguished bear portrait with a bowler hat in the style of René Magritte", it creates diverse and interesting concepts with different accessories, clothing, and surreal elements.

## Features

- **Multiple Generation Strategies**: Uses different approaches to create variety
- **Series-based Generation**: Creates concepts based on predefined bear series definitions
- **Category-based Generation**: Uses character categories to build diverse prompts
- **Random Combination Generation**: Creates completely random combinations of elements
- **Option Control**: Fine-tune the generation through options

## Quick Start

```bash
# Generate 5 different bear portrait concepts
npm run test:concepts

# Generate a varied bear portrait image
npm run varied-bear

# Generate multiple bear portrait images
npm run varied-bear -- 3

# Force the use of a bowler hat
npm run varied-bear -- --bowler
```

## Usage in Code

```typescript
import { bearConceptGenerator } from './generators/BearConceptGenerator';

// Generate a random concept
const concept = bearConceptGenerator.generateBearConcept();
console.log(concept);

// Generate with specific options
const conceptWithOptions = bearConceptGenerator.generateBearConcept({
  forceBowlerHat: true,         // Always include a bowler hat
  useSeries: true,              // Use bear series definitions
  useCategories: true,          // Use character categories
  useRandomCombinations: true   // Use random combinations
});

// Generate multiple concepts
const concepts = bearConceptGenerator.generateMultipleConcepts(5);
```

## Available Scripts

- `npm run test:concepts`: Generate sample bear portrait concepts
- `npm run varied-bear`: Generate an image with a varied bear concept
- `npm run start`: Run the main ArtBot test (will use varied concepts)

## Concept Options

When generating concepts, you can use these options:

- `--bowler`: Force the use of a bowler hat in all concepts
- `--series`: Only use bear series templates
- `--categories`: Only use character categories
- `--random`: Only use random combinations
- `<number>`: Generate this many concepts

For example:
```bash
# Generate 10 concepts using only the series-based strategy
npm run test:concepts -- 10 --series

# Generate 3 images with bowler hats
npm run varied-bear -- 3 --bowler
```

## Integration with ArtBot

The bear concept generator is automatically integrated with the existing ArtBot system. When you run `npm start`, it will use a varied concept instead of the default one.

## Examples of Generated Concepts

Here are some examples of the varied bear portrait concepts that can be generated:

1. A distinguished bear portrait in profile wearing a chef's toque, fountain pen, and artistic medallion, dressed in a conductor's tailcoat, with paradoxical shadows, painted in Magritte's precise style against a Belgian sky blue background

2. A distinguished bear portrait in the style of René Magritte, featuring a modern maker bear wearing a beret and sticker art supplies, with physical media existing in digital impossibility, with technologies from different eras in surreal coexistence

3. A distinguished bear portrait in profile wearing a explorer's pith helmet, leather-bound journal, and academic stole, dressed in a philosopher's dress coat, with surreal window showing an impossible landscape, painted in Magritte's precise style against a Belgian sky blue background

4. A distinguished bear portrait in the style of René Magritte, featuring a hipster bear wearing a cap and medicinal plants, balancing natural elements in surreal urban context, with floating artisanal tools

5. A distinguished bear portrait in profile wearing a natural fiber cap and carrying waste audit journal, dressed in repaired and reinforced clothing, with home composting tools and rose, in the style of René Magritte 