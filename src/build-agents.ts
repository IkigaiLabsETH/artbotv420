/**
 * Build Agents Script
 * 
 * This script compiles the TypeScript changes and verifies agent registration.
 * It's designed to be run after making changes to agent registration logic.
 */

import * as path from 'path';
import * as child_process from 'child_process';
import { promises as fs } from 'fs';
import { EnhancedLogger } from './utils/enhancedLogger';
import { LogLevel } from './utils/agentLogger';

async function buildAndVerify() {
  EnhancedLogger.printHeader('Building and Verifying Agent Registration');
  
  try {
    // Step 1: Build TypeScript
    EnhancedLogger.printSection('Building TypeScript');
    EnhancedLogger.log('Running TypeScript compiler...', LogLevel.INFO);
    
    try {
      child_process.execSync('npm run build', { stdio: 'inherit' });
      EnhancedLogger.log('TypeScript build completed successfully', LogLevel.SUCCESS);
    } catch (buildError) {
      EnhancedLogger.log('TypeScript build failed', LogLevel.ERROR);
      throw new Error(`Build error: ${buildError}`);
    }
    
    // Step 2: Verify the dist directory contains our agent files
    EnhancedLogger.printSection('Verifying Compiled Files');
    
    const requiredDistFiles = [
      'agents/types.js',
      'agents/DirectorAgent.js',
      'agents/IdeatorAgent.js',
      'agents/StylistAgent.js',
      'agents/EnhancedRefinerAgent.js',
      'agents/CharacterGeneratorAgent.js',
      'agents/CriticAgent.js',
      'agents/MetadataGeneratorAgent.js',
      'utils/ensureAgentRegistration.js',
      'artbot-multiagent-system.js'
    ];
    
    for (const file of requiredDistFiles) {
      const filePath = path.join('dist', file);
      try {
        await fs.access(filePath);
        EnhancedLogger.log(`✅ File exists: ${filePath}`, LogLevel.SUCCESS);
      } catch (err) {
        EnhancedLogger.log(`❌ Missing file: ${filePath}`, LogLevel.ERROR);
        throw new Error(`Required compiled file missing: ${filePath}`);
      }
    }
    
    // Step 3: Run verification script
    EnhancedLogger.printSection('Running Agent Verification');
    
    try {
      child_process.execSync('npm run verify:agents', { stdio: 'inherit' });
      EnhancedLogger.log('Agent verification completed successfully', LogLevel.SUCCESS);
    } catch (verifyError) {
      EnhancedLogger.log('Agent verification failed', LogLevel.ERROR);
      throw new Error(`Verification error: ${verifyError}`);
    }
    
    // Step 4: Test the CommonJS script
    EnhancedLogger.printSection('Testing CommonJS Script');
    
    try {
      // Only run for a brief moment to see if it initializes properly
      const childProcess = child_process.spawn('node', ['src/test-artbot-common.cjs'], {
        timeout: 10000 // 10 seconds timeout
      });
      
      let output = '';
      
      childProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      childProcess.stderr.on('data', (data) => {
        output += data.toString();
      });
      
      // Wait a short time to capture initialization output
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Kill the process as we don't need the full execution
      childProcess.kill();
      
      // Check if initialization was successful
      if (output.includes('ArtBot system initialized') && 
          !output.includes('Agent not registered')) {
        EnhancedLogger.log('CommonJS script initialization successful', LogLevel.SUCCESS);
      } else {
        console.log(output);
        throw new Error('CommonJS script initialization failed or has missing agents');
      }
    } catch (testError) {
      EnhancedLogger.log('CommonJS script test failed', LogLevel.ERROR);
      throw new Error(`CommonJS test error: ${testError}`);
    }
    
    // All checks passed
    EnhancedLogger.printHeader('✅ BUILD AND VERIFICATION SUCCESSFUL');
    EnhancedLogger.log('The agent registration system is working correctly in both TypeScript and CommonJS environments.', LogLevel.SUCCESS);
    
  } catch (error) {
    EnhancedLogger.printHeader('❌ BUILD AND VERIFICATION FAILED');
    EnhancedLogger.log(`Error: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
    process.exit(1);
  }
}

// Run the build and verify process
buildAndVerify().catch(console.error); 