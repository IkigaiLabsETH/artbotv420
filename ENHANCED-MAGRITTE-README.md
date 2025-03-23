# Enhanced Magritte Bear Portrait Generator

This system provides enhanced capabilities for generating Magritte-style surrealist bear portraits with rich character development and NFT-ready metadata.

## Features

- **Advanced Prompt Generation**: Creates detailed prompts using Magritte's iconic surrealist styles and techniques
- **Character Generation**: Builds distinguished bear characters with names, titles, and backstories
- **Rich Metadata**: Produces comprehensive NFT-ready metadata with attributes and traits
- **Visual Logging**: Provides clear, structured terminal output of the multi-agent system
- **Batch Processing**: Supports generating multiple portraits in a single run
- **NFT Export**: Prepares collections for NFT platforms

## Installation

1. Make sure you have Node.js (v16+) installed
2. Clone this repository
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with your API keys:
   ```
   REPLICATE_API_KEY=your_replicate_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key_optional
   OPENAI_API_KEY=your_openai_api_key_optional
   ```

## Usage

### Single Portrait Generation

Generate a single Magritte-style bear portrait:

```bash
npm run test:enhanced:single "a distinguished bear with bowler hat"
```

### Batch Generation

Generate multiple portraits in a batch:

```bash
npm run test:enhanced:batch
```

### Custom Concept

You can provide your own concept for generation:

```bash
npm run test:enhanced:single "a philosophical bear portrait with pipe and book"
```

## Integration

To integrate the enhanced Magritte generator into your own code:

```typescript
import { EnhancedMagritteService } from './services/magritte/EnhancedMagritteService';

// Create service (normally with AI and Replicate services)
const magritteService = new EnhancedMagritteService({
  aiService,
  replicateService,
  outputDir: 'output/magritte'
});

// Generate a single portrait
const result = await magritteService.generateBearPortrait(
  "a distinguished bear portrait with bowler hat", 
  { series: "academic" }
);

// Output the result
console.log(`Generated: ${result.artwork.title}`);
console.log(`Character: ${result.artwork.character.name}`);
console.log(`Image URL: ${result.artwork.imageUrl}`);
```

## Components

The enhanced Magritte system includes these main components:

1. **MagrittePromptEnhancer**: Generates rich, contextually appropriate prompts based on templates
2. **EnhancedCharacterGenerator**: Creates distinguished bear characters with personalities
3. **EnhancedMagritteMetadataGenerator**: Produces detailed metadata suitable for NFTs
4. **EnhancedLogger**: Provides structured terminal output to visualize the generation process
5. **EnhancedMagritteService**: Integrates all components in a streamlined service

## Output

The system produces:

- Generated images using Replicate API
- JSON metadata files with character details and attributes
- Prompt text files for reference
- Ready-to-use NFT collection exports

## Technical Details

- Uses Flux 1.1 Pro model on Replicate for image generation
- Generates images at 1024x1024 or 2048x2048 resolution
- Supports 15 different series of bear portraits
- Includes reference to Magritte's iconic works and techniques
- Generates distinguished bear characters with consistent naming patterns

## Examples

Examples of concepts to try:

```
"a distinguished bear portrait with bowler hat floating in front of face"
"a bear portrait with day and night simultaneously in Magritte style"
"a scholarly bear portrait with pipe and philosophical book"
"a bear portrait with window showing paradoxical scene in Magritte style"
"a distinguished bear with oversized apple in surreal room"
```

## License

MIT 