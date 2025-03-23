# Enhanced Refiner Agent for ArtBot

The Enhanced Refiner Agent is an improved implementation that combines the best aspects of model-specific optimization and artistic refinement capabilities. This agent is responsible for taking prompts and refining them to generate better artwork, with special handling for Magritte-style surrealist art.

## Key Features

- **Model-specific Optimization**: Tailors prompts for specific models like Flux, SD3, etc.
- **Specialized Magritte Handling**: Advanced detection and enhancement for René Magritte style art
- **Negative Prompt Generation**: Intelligent negative prompt creation for better results
- **Parameter Optimization**: Suggests optimal parameters for each model
- **Direct Image Generation**: Can directly generate images using the Replicate service
- **Refinement History**: Maintains a history of refinements for better learning
- **Enhanced Feedback Processing**: Incorporates feedback for continuous improvements

## Architecture

The Enhanced Refiner Agent extends the base RefinerAgent interface with:

1. **AI Service Integration**: Uses sophisticated AI prompting for refinements
2. **Replicate Service Integration**: Direct access to image generation capabilities
3. **Magritte Style Evaluation**: Uses specialized evaluator for surrealist styles
4. **Model Optimization Database**: Knowledge base of model-specific optimizations
5. **Adaptive Parameters**: Refinement parameters that adjust based on context

## Usage

### Basic Usage

```typescript
// Initialize services
const aiService = new AIService();
await aiService.initialize();

// Create the enhanced refiner using the factory
const refiner = RefinerAgentFactory.createRefinerAgent(
  RefinerAgentType.ENHANCED,
  aiService
);
await refiner.initialize();

// Refine a prompt
const refinedPrompt = await refiner.refinePrompt("a bear portrait in Magritte style");

// Optimize for a specific model
const optimizedPrompt = await refiner.optimizeForModel(
  refinedPrompt,
  "black-forest-labs/flux-1.1-pro"
);
```

### Image Generation

```typescript
// Generate an image directly
const result = await refiner.process({
  projectId: 'my-project',
  prompt: "a distinguished bear portrait in profile wearing a bowler hat, Magritte style",
  task: {
    action: 'generate_image',
    model: "black-forest-labs/flux-1.1-pro"
  },
  messages: []
});

// The result contains the image URL and other details
console.log(result.output.imageUrl);
```

## Magritte Style Enhancement

The agent includes specialized capabilities for Magritte-style art:

1. **Style Detection**: Automatically identifies Magritte elements in prompts
2. **Visual Elements**: Adds signature Magritte visual elements when needed
3. **Composition Enhancement**: Improves composition based on Magritte principles
4. **Philosophical Depth**: Adds conceptual and philosophical elements
5. **Technical Precision**: Emphasizes the clean, precise technique of Magritte

## Testing

To test the enhanced refiner agent:

```bash
npm run test:enhanced-refiner
```

This will:
1. Compare standard and enhanced refinement capabilities
2. Demonstrate model-specific optimizations
3. Generate a test image with optimal parameters
4. Save the results to the output directory

## Implementation Details

The agent uses several optimizations for different models:

```typescript
const MODEL_OPTIMIZATIONS = {
  "black-forest-labs/flux-1.1-pro": {
    name: "Flux 1.1 Pro",
    strength: "Photorealistic images, consistent quality",
    keywords: ["photorealistic", "hyper-detailed", "cinematic lighting", "35mm film"],
    avoidWords: ["anime", "cartoon", "stylized", "sketch"],
    maxLength: 1800,
    parameterKeys: ["guidance_scale", "num_inference_steps", "negative_prompt"]
  },
  // Other models...
};
```

## Future Improvements

- **Learning from Feedback**: Store successful refinement patterns
- **Style Transfer**: Apply style characteristics from reference images
- **Interactive Refinement**: Multi-step refinement with user feedback
- **Refinement Visualization**: Preview refinement impact before generation
- **Cross-Model Optimization**: Translate prompts between different models

## Factory Pattern

For flexibility, we use a factory pattern to create different refiners:

```typescript
// Create standard refiner
const standardRefiner = RefinerAgentFactory.createRefinerAgent(
  RefinerAgentType.STANDARD,
  aiService
);

// Create enhanced refiner
const enhancedRefiner = RefinerAgentFactory.createRefinerAgent(
  RefinerAgentType.ENHANCED,
  aiService
);
```

This allows easy switching between implementations and future extensions. 