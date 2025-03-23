/**
 * Terminal Preview CLI
 * 
 * Command-line interface for the Terminal Preview feature,
 * allowing users to review and curate generated artworks.
 */

import { TerminalPreview } from './index';
import chalk from 'chalk';

// Parse command-line arguments
const args = process.argv.slice(2);
const outputDir = args.find(arg => arg.startsWith('--output='))?.split('=')[1];
const autoOpen = args.includes('--auto-open');
const maxHistory = parseInt(args.find(arg => arg.startsWith('--max-history='))?.split('=')[1] || '20', 10);

// Show the header
console.log(chalk.bold.cyan('\n╭───────────────────────────────────────────╮'));
console.log(chalk.bold.cyan('│        ARTBOT PREVIEW INTERFACE           │'));
console.log(chalk.bold.cyan('╰───────────────────────────────────────────╯'));

// Show options
if (autoOpen) console.log(chalk.green('✓ Auto-open mode enabled'));
if (outputDir) console.log(chalk.green(`✓ Using custom output directory: ${outputDir}`));
console.log(chalk.green(`✓ Maximum history: ${maxHistory} items`));

// Create and start the preview interface
const preview = new TerminalPreview({
  outputDir,
  autoOpen,
  maxHistory
});

// Start the preview
preview.start();

// Handle process termination
process.on('SIGINT', () => {
  console.log(chalk.yellow('\nExiting preview mode...'));
  preview.stop();
  process.exit(0);
});
