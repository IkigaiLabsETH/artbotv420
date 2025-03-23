# ArtBot Refactoring Documentation

## Overview

This document outlines the refactoring work done on the ArtBot image generation system. The refactoring focused on several key areas:

1. **Centralized Configuration** - All generation parameters and style settings consolidated
2. **Agent System Structure** - Clear agent roles, interfaces, and communication patterns
3. **Improved Logging** - Structured logging for debugging and monitoring agent interactions
4. **Character Generation** - Modularized character identity generation
5. **ElizaOS Integration** - Plugin-based integration with ElizaOS

## Directory Structure

The refactored project follows this directory structure:

```
src/
├── agents/                   # Agent definitions and implementations
│   ├── types.ts              # Agent interface definitions
│   ├── DirectorAgent.ts      # Director agent implementation
│   └── ...                   # Other agent implementations
├── config/                   # Configuration system
│   └── generationConfig.ts   # Generation parameters
├── generators/               # Content generators
│   └── CharacterGenerator.ts # Character generation
├── plugins/                  # ElizaOS integration
│   └── artbotPlugin.ts       # ArtBot plugin
├── services/                 # Core services
│   ├── ai/                   # AI services
│   ├── replicate/            # Replicate integration
│   └── ...                   # Other services
├── utils/                    # Utilities
│   └── agentLogger.ts        # Logging system
├── artbot-multiagent-system.ts  # Main system class
└── ...
```

## Key Components

### 1. Configuration System

The generation configuration is now centralized in `src/config/generationConfig.ts`, providing:

- Model-specific settings
- Style-specific parameters
- Default configurations
- Type safety through TypeScript interfaces

### 2. Agent System

The multi-agent system has been structured with clear interfaces in `src/agents/types.ts`:

- `Agent` - Base interface for all agents
- `AgentRole` - Enum defining agent roles
- `AgentContext` - Context passed between agents
- `AgentResult` - Standard result format

Specialized agent roles include:
- `DirectorAgent` - Coordinates the workflow
- `IdeatorAgent` - Generates creative ideas
- `StylistAgent` - Applies artistic styles
- `RefinerAgent` - Optimizes prompts
- `CriticAgent` - Evaluates results
- `CharacterGeneratorAgent` - Creates character identities
- `MetadataGeneratorAgent` - Generates NFT metadata

### 3. Logging System

The `AgentLogger` in `src/utils/agentLogger.ts` provides structured, visually enhanced logging:

- Agent actions
- Agent interactions
- Message exchanges
- System status
- Progress tracking

### 4. Character Generation

Character generation is now modularized in `src/generators/CharacterGenerator.ts`:

- Name generation
- Title creation
- Personality derivation
- Backstory creation
- Consistent identity for NFT metadata

### 5. ElizaOS Integration

ArtBot is now available as an ElizaOS plugin:

- `ArtBotService` - Service for ElizaOS
- `GENERATE_ART` action - Action for generating art
- API endpoint - `/artbot/generate` for HTTP access

## Multi-Agent Workflow

The refactored system implements this workflow:

1. `DirectorAgent` creates a workflow context
2. `IdeatorAgent` generates the initial concept
3. `StylistAgent` applies the artistic style
4. `RefinerAgent` optimizes the prompt for the model
5. `CharacterGeneratorAgent` creates a character identity
6. Image is generated via Replicate service
7. Results are saved with metadata

## Usage Example

```typescript
// Initialize the ArtBot system
const artBotSystem = new ArtBotMultiAgentSystem({
  aiService,
  replicateService,
  outputDir: './output'
});

await artBotSystem.initialize();

// Generate art
const result = await artBotSystem.runArtProject({
  title: 'Bear Portrait',
  concept: 'a distinguished bear portrait in profile wearing a vintage aviator cap',
  style: 'magritte'
});

console.log(`Generated image: ${result.artwork.imageUrl}`);
```

## ElizaOS Integration Example

```typescript
// Get the ArtBot service
const artBotService = runtime.getService('artbot');

// Generate art
const result = await artBotService.generateArt(
  'a surrealist bear portrait in Magritte style',
  'bear_pfp'
);

// Use the generated artwork
console.log(`Generated image: ${result.artwork.imageUrl}`);
```

## Benefits of Refactoring

1. **Maintainability** - Clearer code organization and modular structure
2. **Extensibility** - Easy to add new agents or modify behavior
3. **Debuggability** - Improved logging and visualization of agent interactions
4. **Consistency** - Standardized interfaces and communication patterns
5. **Integration** - Plug-and-play with ElizaOS through the plugin system 