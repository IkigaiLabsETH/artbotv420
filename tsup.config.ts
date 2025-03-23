import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/artbot-multiagent-system.ts',
    'src/agents/types.ts',
    'src/agents/DirectorAgent.ts',
    'src/config/generationConfig.ts',
    'src/generators/CharacterGenerator.ts',
    'src/plugins/artbotPlugin.ts',
    'src/types.ts',
    'src/utils/agentLogger.ts'
  ],
  outDir: 'dist',
  tsconfig: './tsconfig.build.json', // Use build-specific tsconfig
  sourcemap: true,
  clean: true,
  format: ['esm'], // Ensure you're targeting ESM
  dts: false, // Skip DTS generation to avoid external import issues
  external: [
    'dotenv', // Externalize dotenv to prevent bundling
    'fs', // Externalize fs to use Node.js built-in module
    'path', // Externalize other built-ins if necessary
    'https',
    'http',
    '@elizaos/core',
    'zod',
    'uuid'
  ],
});
