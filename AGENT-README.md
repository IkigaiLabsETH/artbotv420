# ArtBot Agent Registration System

## Overview

This document outlines the agent registration system for the ArtBot multi-agent art generation system. The system uses a collaborative approach where specialized agents with different roles work together to generate artwork.

## Required Agents

The ArtBot system requires the following agents to be registered and available:

1. **Director Agent** (`director`) - Coordinates the overall workflow
2. **Ideator Agent** (`ideator`) - Generates creative ideas
3. **Stylist Agent** (`stylist`) - Handles styling aspects
4. **Refiner Agent** (`flux_refiner`) - Refines generated content
5. **Critic Agent** (`critic`) - Evaluates results
6. **Character Generator Agent** (`character_generator`) - Creates character profiles
7. **Metadata Generator Agent** (`metadata_generator`) - Generates metadata for the artwork

## Automatic Agent Registration

We implemented an automatic agent registration system to ensure all required agents are available before generation begins:

1. The `ArtBotMultiAgentSystem` now checks for missing agents during initialization
2. The `ensureRequiredAgentsRegistered` utility function automatically registers any missing agents
3. Agent creation is handled by `createAgentByRole` which instantiates appropriate agent types

### Key Files:

- `src/utils/ensureAgentRegistration.ts` - Core registration utility functions
- `src/artbot-multiagent-system.ts` - Modified to use automatic registration
- `src/verify-agent-registration.ts` - Verification script
- `src/check-agent-registration.ts` - Diagnostic script
- `src/build-agents.ts` - Build and verification script

## Usage

### Automatic Registration (Recommended)

Simply create and initialize the system. All required agents will be automatically registered:

```typescript
// Create the multi-agent system
const system = new ArtBotMultiAgentSystem({
  aiService, 
  replicateService,
  styleIntegrationService,
  outputDir: 'output'
});

// Initialize the system - this will automatically register all required agents
await system.initialize();
```

### Manual Registration (Alternative)

If you need more control, you can still manually register agents:

```typescript
// Create the multi-agent system
const system = new ArtBotMultiAgentSystem({
  aiService, 
  replicateService,
  styleIntegrationService,
  outputDir: 'output'
});

// Register specific agents
system.registerAgent(new IdeatorAgent(aiService));
system.registerAgent(new StylistAgent(aiService));
// ... register other agents

// Initialize the system
await system.initialize();
```

## CommonJS Support

For CommonJS scripts like `test-artbot-common.cjs`, explicit agent registration is required:

```javascript
// Create and register the Ideator agent
const ideatorAgent = new IdeatorAgent(aiService);
artBotSystem.registerAgent(ideatorAgent);

// Create and register the Stylist agent
const stylistAgent = new StylistAgent(aiService);
artBotSystem.registerAgent(stylistAgent);

// ... register other agents
```

This is necessary because the automatic registration in the TypeScript code may not be fully available in the CommonJS environment after compilation.

## Verification and Build

Use the following commands to verify and build the agent registration system:

```bash
# Check registration with automatic fixing
npm run verify:agents

# Run diagnostic check
npm run check:agents

# Test generation with explicit registration
npm run start:register

# Build and verify in both TypeScript and CommonJS environments
npm run build:agents
```

The `build:agents` script performs the following checks:
1. Compiles the TypeScript code
2. Verifies required files exist in the `dist` directory
3. Tests the automatic agent registration system
4. Verifies the CommonJS script works properly

## Troubleshooting

If you encounter "Agent not registered" errors, try the following:

1. Make sure all agents are properly imported in your file
2. Use the explicit registration script for testing: `npm run start:register`
3. Run the verification script to check agent status: `npm run verify:agents`
4. Ensure the AIService is properly initialized before agent creation
5. For CommonJS scripts, ensure explicit agent registration is used
6. Run `npm run build:agents` to check both TypeScript and CommonJS environments

## Implementation Notes

- The Director agent is created and registered automatically in the system constructor
- When using CommonJS versions of the code, ensure the TypeScript code is properly compiled
- All agent registration happens before the system initialization is complete 