/**
 * Terminal Preview Plugin
 * 
 * Provides a terminal-based preview and review interface for generated images
 * without requiring a full web server.
 */

import chalk from 'chalk';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

// Define interfaces
interface GeneratedArtwork {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  status?: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

interface PreviewOptions {
  autoOpen?: boolean;
  maxHistory?: number;
  outputDir?: string;
}

/**
 * TerminalPreview
 * 
 * A terminal-based preview and review interface for generated artworks
 */
export class TerminalPreview {
  private artworks: GeneratedArtwork[] = [];
  private historyFile: string;
  private maxHistory: number;
  private rl: readline.Interface;
  private autoOpen: boolean;
  
  constructor(options: PreviewOptions = {}) {
    this.autoOpen = options.autoOpen || false;
    this.maxHistory = options.maxHistory || 20;
    const outputDir = options.outputDir || path.join(process.cwd(), 'output');
    this.historyFile = path.join(outputDir, 'preview-history.json');
    
    // Create the readline interface
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Load previous history if it exists
    this.loadHistory();
  }
  
  /**
   * Add a generated artwork to the preview system
   */
  async addArtwork(artwork: Omit<GeneratedArtwork, 'id' | 'timestamp' | 'status'>): Promise<string> {
    const id = uuidv4();
    
    const newArtwork: GeneratedArtwork = {
      id,
      prompt: artwork.prompt,
      imageUrl: artwork.imageUrl,
      timestamp: new Date(),
      metadata: artwork.metadata || {},
      status: 'pending'
    };
    
    // Add to the list
    this.artworks.unshift(newArtwork);
    
    // Trim the list to maxHistory
    if (this.artworks.length > this.maxHistory) {
      this.artworks = this.artworks.slice(0, this.maxHistory);
    }
    
    // Save the updated history
    this.saveHistory();
    
    // Display the preview
    await this.showPreview(id);
    
    return id;
  }
  
  /**
   * Show the preview for a specific artwork
   */
  async showPreview(id: string): Promise<void> {
    const artwork = this.artworks.find(a => a.id === id);
    
    if (!artwork) {
      console.log(chalk.red(`\nArtwork with ID ${id} not found.`));
      return;
    }
    
    // Clear the console
    console.clear();
    
    // Show the preview header
    console.log(chalk.bold.cyan('\n╭───────────────────────────────────────────╮'));
    console.log(chalk.bold.cyan('│           ARTWORK PREVIEW                 │'));
    console.log(chalk.bold.cyan('╰───────────────────────────────────────────╯'));
    
    // Show the artwork details
    console.log(chalk.bold.yellow('\n📝 Prompt:'));
    console.log(chalk.white(artwork.prompt));
    
    console.log(chalk.bold.yellow('\n🖼️ Image URL:'));
    console.log(chalk.white(artwork.imageUrl));
    
    console.log(chalk.bold.yellow('\n📅 Generated:'));
    console.log(chalk.white(artwork.timestamp.toISOString()));
    
    if (artwork.metadata && Object.keys(artwork.metadata).length > 0) {
      console.log(chalk.bold.yellow('\n📊 Metadata:'));
      
      // Show the most important metadata fields
      const importantKeys = ['name', 'title', 'character', 'style', 'series'];
      const importantMetadata = importantKeys
        .filter(key => artwork.metadata && artwork.metadata[key])
        .reduce((obj, key) => {
          obj[key] = artwork.metadata![key];
          return obj;
        }, {} as Record<string, any>);
      
      if (Object.keys(importantMetadata).length > 0) {
        console.log(chalk.white(JSON.stringify(importantMetadata, null, 2)));
      } else {
        console.log(chalk.white('Metadata available but no important fields found.'));
      }
    }
    
    console.log(chalk.bold.yellow('\n📋 Status:'));
    console.log(chalk.white(artwork.status || 'pending'));
    
    // Show options
    console.log(chalk.bold.greenBright('\n╭───────────────────────────────────────────╮'));
    console.log(chalk.bold.greenBright('│           ACTIONS                         │'));
    console.log(chalk.bold.greenBright('│                                           │'));
    console.log(chalk.bold.greenBright('│ [o] Open image in browser                 │'));
    console.log(chalk.bold.greenBright('│ [a] Approve artwork                       │'));
    console.log(chalk.bold.greenBright('│ [r] Reject artwork                        │'));
    console.log(chalk.bold.greenBright('│ [n] Add notes                             │'));
    console.log(chalk.bold.greenBright('│ [l] List all artworks                     │'));
    console.log(chalk.bold.greenBright('│ [q] Quit preview                          │'));
    console.log(chalk.bold.greenBright('╰───────────────────────────────────────────╯'));
    
    // Automatically open the image if configured
    if (this.autoOpen) {
      this.openImage(artwork.imageUrl);
    }
    
    // Handle user input
    this.rl.question(chalk.cyan('\nEnter your choice: '), async (answer) => {
      switch (answer.toLowerCase()) {
        case 'o':
          // Open the image in the browser
          await this.openImage(artwork.imageUrl);
          await this.showPreview(id);
          break;
        
        case 'a':
          // Approve the artwork
          artwork.status = 'approved';
          this.saveHistory();
          console.log(chalk.green('\n✓ Artwork approved.'));
          setTimeout(() => this.showPreview(id), 1000);
          break;
        
        case 'r':
          // Reject the artwork
          artwork.status = 'rejected';
          this.saveHistory();
          console.log(chalk.red('\n✗ Artwork rejected.'));
          setTimeout(() => this.showPreview(id), 1000);
          break;
        
        case 'n':
          // Add notes
          this.rl.question(chalk.cyan('\nEnter notes: '), (notes) => {
            artwork.notes = notes;
            this.saveHistory();
            console.log(chalk.green('\n✓ Notes added.'));
            setTimeout(() => this.showPreview(id), 1000);
          });
          break;
        
        case 'l':
          // List all artworks
          await this.listArtworks();
          break;
        
        case 'q':
          // Quit the preview
          console.log(chalk.yellow('\nExiting preview mode.'));
          return;
        
        default:
          // Invalid input
          console.log(chalk.red('\nInvalid choice. Please try again.'));
          setTimeout(() => this.showPreview(id), 1000);
          break;
      }
    });
  }
  
  /**
   * List all artworks in history
   */
  async listArtworks(): Promise<void> {
    // Clear the console
    console.clear();
    
    // Show the list header
    console.log(chalk.bold.cyan('\n╭───────────────────────────────────────────╮'));
    console.log(chalk.bold.cyan('│           ARTWORK HISTORY                 │'));
    console.log(chalk.bold.cyan('╰───────────────────────────────────────────╯'));
    
    // Show the artworks
    if (this.artworks.length === 0) {
      console.log(chalk.yellow('\nNo artworks in history.'));
    } else {
      this.artworks.forEach((artwork, index) => {
        const statusColor = 
          artwork.status === 'approved' ? chalk.green :
          artwork.status === 'rejected' ? chalk.red :
          chalk.yellow;
        
        console.log(chalk.bold.white(`\n${index + 1}. [${statusColor(artwork.status || 'pending')}] ${new Date(artwork.timestamp).toLocaleString()}`));
        console.log(chalk.gray(`   ID: ${artwork.id}`));
        console.log(chalk.gray(`   Prompt: ${artwork.prompt.substring(0, 60)}...`));
      });
    }
    
    // Show options
    console.log(chalk.bold.greenBright('\n╭───────────────────────────────────────────╮'));
    console.log(chalk.bold.greenBright('│           ACTIONS                         │'));
    console.log(chalk.bold.greenBright('│                                           │'));
    console.log(chalk.bold.greenBright('│ [number] View artwork by number           │'));
    console.log(chalk.bold.greenBright('│ [q] Return to main menu                   │'));
    console.log(chalk.bold.greenBright('╰───────────────────────────────────────────╯'));
    
    // Handle user input
    this.rl.question(chalk.cyan('\nEnter your choice: '), async (answer) => {
      if (answer.toLowerCase() === 'q') {
        console.log(chalk.yellow('\nReturning to main menu.'));
        return;
      }
      
      const index = parseInt(answer, 10) - 1;
      if (isNaN(index) || index < 0 || index >= this.artworks.length) {
        console.log(chalk.red('\nInvalid choice. Please try again.'));
        setTimeout(() => this.listArtworks(), 1000);
      } else {
        await this.showPreview(this.artworks[index].id);
      }
    });
  }
  
  /**
   * Open an image URL in the default browser
   */
  async openImage(url: string): Promise<void> {
    const command = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' :
                  'xdg-open';
    
    exec(`${command} "${url}"`);
    console.log(chalk.green('\n✓ Opening image in browser...'));
  }
  
  /**
   * Start the preview interface
   */
  async start(): Promise<void> {
    console.clear();
    
    console.log(chalk.bold.magenta('\n╭───────────────────────────────────────────╮'));
    console.log(chalk.bold.magenta('│           ARTBOT PREVIEW                  │'));
    console.log(chalk.bold.magenta('│                                           │'));
    console.log(chalk.bold.magenta('│ Terminal-based artwork review system      │'));
    console.log(chalk.bold.magenta('╰───────────────────────────────────────────╯'));
    
    // Show options
    console.log(chalk.bold.cyan('\n╭───────────────────────────────────────────╮'));
    console.log(chalk.bold.cyan('│           MAIN MENU                       │'));
    console.log(chalk.bold.cyan('│                                           │'));
    console.log(chalk.bold.cyan('│ [l] List all artworks                     │'));
    console.log(chalk.bold.cyan('│ [a] View approved artworks                │'));
    console.log(chalk.bold.cyan('│ [r] View rejected artworks                │'));
    console.log(chalk.bold.cyan('│ [p] View pending artworks                 │'));
    console.log(chalk.bold.cyan('│ [e] Export approved artworks              │'));
    console.log(chalk.bold.cyan('│ [q] Quit preview                          │'));
    console.log(chalk.bold.cyan('╰───────────────────────────────────────────╯'));
    
    // Handle user input
    this.rl.question(chalk.magenta('\nEnter your choice: '), async (answer) => {
      switch (answer.toLowerCase()) {
        case 'l':
          // List all artworks
          await this.listArtworks();
          break;
        
        case 'a':
          // View approved artworks
          await this.listFilteredArtworks('approved');
          break;
        
        case 'r':
          // View rejected artworks
          await this.listFilteredArtworks('rejected');
          break;
        
        case 'p':
          // View pending artworks
          await this.listFilteredArtworks('pending');
          break;
        
        case 'e':
          // Export approved artworks
          await this.exportApprovedArtworks();
          break;
        
        case 'q':
          // Quit the preview
          console.log(chalk.yellow('\nExiting preview mode.'));
          this.rl.close();
          return;
        
        default:
          // Invalid input
          console.log(chalk.red('\nInvalid choice. Please try again.'));
          setTimeout(() => this.start(), 1000);
          break;
      }
    });
  }
  
  /**
   * List artworks filtered by status
   */
  async listFilteredArtworks(status: 'approved' | 'rejected' | 'pending'): Promise<void> {
    // Filter the artworks
    const filtered = this.artworks.filter(a => a.status === status);
    
    // Clear the console
    console.clear();
    
    // Show the list header
    const statusColor = 
      status === 'approved' ? chalk.green :
      status === 'rejected' ? chalk.red :
      chalk.yellow;
    
    console.log(statusColor(`\n╭───────────────────────────────────────────╮`));
    console.log(statusColor(`│           ${status.toUpperCase()} ARTWORKS                │`));
    console.log(statusColor(`╰───────────────────────────────────────────╯`));
    
    // Show the artworks
    if (filtered.length === 0) {
      console.log(chalk.yellow(`\nNo ${status} artworks in history.`));
    } else {
      filtered.forEach((artwork, index) => {
        console.log(chalk.bold.white(`\n${index + 1}. ${new Date(artwork.timestamp).toLocaleString()}`));
        console.log(chalk.gray(`   ID: ${artwork.id}`));
        console.log(chalk.gray(`   Prompt: ${artwork.prompt.substring(0, 60)}...`));
      });
    }
    
    // Show options
    console.log(chalk.bold.greenBright('\n╭───────────────────────────────────────────╮'));
    console.log(chalk.bold.greenBright('│           ACTIONS                         │'));
    console.log(chalk.bold.greenBright('│                                           │'));
    console.log(chalk.bold.greenBright('│ [number] View artwork by number           │'));
    console.log(chalk.bold.greenBright('│ [b] Back to main menu                     │'));
    console.log(chalk.bold.greenBright('╰───────────────────────────────────────────╯'));
    
    // Handle user input
    this.rl.question(chalk.cyan('\nEnter your choice: '), async (answer) => {
      if (answer.toLowerCase() === 'b') {
        await this.start();
        return;
      }
      
      const index = parseInt(answer, 10) - 1;
      if (isNaN(index) || index < 0 || index >= filtered.length) {
        console.log(chalk.red('\nInvalid choice. Please try again.'));
        setTimeout(() => this.listFilteredArtworks(status), 1000);
      } else {
        await this.showPreview(filtered[index].id);
      }
    });
  }
  
  /**
   * Export approved artworks
   */
  async exportApprovedArtworks(): Promise<void> {
    // Filter the approved artworks
    const approved = this.artworks.filter(a => a.status === 'approved');
    
    // Clear the console
    console.clear();
    
    // Show the export header
    console.log(chalk.bold.green('\n╭───────────────────────────────────────────╮'));
    console.log(chalk.bold.green('│           EXPORT APPROVED ARTWORKS        │'));
    console.log(chalk.bold.green('╰───────────────────────────────────────────╯'));
    
    // Check if there are any approved artworks
    if (approved.length === 0) {
      console.log(chalk.yellow('\nNo approved artworks to export.'));
      
      // Wait for input to continue
      this.rl.question(chalk.cyan('\nPress Enter to return to the main menu...'), async () => {
        await this.start();
      });
      
      return;
    }
    
    // Show the export options
    console.log(chalk.bold.white(`\nFound ${approved.length} approved artworks to export.`));
    
    console.log(chalk.bold.cyan('\n╭───────────────────────────────────────────╮'));
    console.log(chalk.bold.cyan('│           EXPORT OPTIONS                  │'));
    console.log(chalk.bold.cyan('│                                           │'));
    console.log(chalk.bold.cyan('│ [j] Export as JSON                        │'));
    console.log(chalk.bold.cyan('│ [c] Export as CSV                         │'));
    console.log(chalk.bold.cyan('│ [b] Back to main menu                     │'));
    console.log(chalk.bold.cyan('╰───────────────────────────────────────────╯'));
    
    // Handle user input
    this.rl.question(chalk.cyan('\nEnter your choice: '), async (answer) => {
      switch (answer.toLowerCase()) {
        case 'j':
          // Export as JSON
          await this.exportAsJson(approved);
          break;
        
        case 'c':
          // Export as CSV
          await this.exportAsCsv(approved);
          break;
        
        case 'b':
          // Back to main menu
          await this.start();
          break;
        
        default:
          // Invalid input
          console.log(chalk.red('\nInvalid choice. Please try again.'));
          setTimeout(() => this.exportApprovedArtworks(), 1000);
          break;
      }
    });
  }
  
  /**
   * Export artworks as JSON
   */
  async exportAsJson(artworks: GeneratedArtwork[]): Promise<void> {
    const outputDir = path.dirname(this.historyFile);
    const exportFile = path.join(outputDir, `export-${new Date().toISOString().replace(/:/g, '-')}.json`);
    
    // Create the export data
    const exportData = artworks.map(artwork => ({
      id: artwork.id,
      prompt: artwork.prompt,
      imageUrl: artwork.imageUrl,
      timestamp: artwork.timestamp,
      metadata: artwork.metadata
    }));
    
    // Write the file
    fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2));
    
    console.log(chalk.green(`\n✓ Exported ${artworks.length} artworks to ${exportFile}`));
    
    // Wait for input to continue
    this.rl.question(chalk.cyan('\nPress Enter to return to the main menu...'), async () => {
      await this.start();
    });
  }
  
  /**
   * Export artworks as CSV
   */
  async exportAsCsv(artworks: GeneratedArtwork[]): Promise<void> {
    const outputDir = path.dirname(this.historyFile);
    const exportFile = path.join(outputDir, `export-${new Date().toISOString().replace(/:/g, '-')}.csv`);
    
    // Create the CSV header
    const header = 'id,prompt,imageUrl,timestamp\n';
    
    // Create the CSV rows
    const rows = artworks.map(artwork => 
      `"${artwork.id}","${artwork.prompt.replace(/"/g, '""')}","${artwork.imageUrl}","${artwork.timestamp}"`
    );
    
    // Write the file
    fs.writeFileSync(exportFile, header + rows.join('\n'));
    
    console.log(chalk.green(`\n✓ Exported ${artworks.length} artworks to ${exportFile}`));
    
    // Wait for input to continue
    this.rl.question(chalk.cyan('\nPress Enter to return to the main menu...'), async () => {
      await this.start();
    });
  }
  
  /**
   * Load the history from the history file
   */
  private loadHistory(): void {
    try {
      if (fs.existsSync(this.historyFile)) {
        const data = fs.readFileSync(this.historyFile, 'utf8');
        this.artworks = JSON.parse(data);
        
        // Convert date strings to Date objects
        this.artworks.forEach(artwork => {
          artwork.timestamp = new Date(artwork.timestamp);
        });
      }
    } catch (error) {
      console.error('Error loading history:', error);
      this.artworks = [];
    }
  }
  
  /**
   * Save the history to the history file
   */
  private saveHistory(): void {
    try {
      // Ensure the directory exists
      const dir = path.dirname(this.historyFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.historyFile, JSON.stringify(this.artworks, null, 2));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }
  
  /**
   * Stop the preview interface
   */
  stop(): void {
    this.rl.close();
  }
  
  /**
   * Get all artworks
   */
  getAllArtworks(): GeneratedArtwork[] {
    return [...this.artworks];
  }
  
  /**
   * Get artworks by status
   */
  getArtworksByStatus(status: 'approved' | 'rejected' | 'pending'): GeneratedArtwork[] {
    return this.artworks.filter(a => a.status === status);
  }
} 