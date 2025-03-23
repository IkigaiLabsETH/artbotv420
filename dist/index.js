"use strict";
/**
 * ArtBot Plugin for ElizaOS
 * Main entry point
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedMagrittePromptService = void 0;
const artbotElizaPlugin_1 = require("./plugins/artbotElizaPlugin");
const enhancedMagrittePromptService_1 = require("./services/style/enhancedMagrittePromptService");
Object.defineProperty(exports, "EnhancedMagrittePromptService", { enumerable: true, get: function () { return enhancedMagrittePromptService_1.EnhancedMagrittePromptService; } });
exports.default = artbotElizaPlugin_1.artbotElizaPlugin;
