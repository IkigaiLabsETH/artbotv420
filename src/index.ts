/**
 * ArtBot Plugin for ElizaOS
 * Main entry point
 */

import { artbotElizaPlugin } from './plugins/artbotElizaPlugin';
import { EnhancedMagrittePromptService } from './services/style/enhancedMagrittePromptService';

export default artbotElizaPlugin;

// Export the Enhanced Prompt Service
export { EnhancedMagrittePromptService };
