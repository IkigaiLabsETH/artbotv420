/**
 * Enhanced Magritte Service
 * Integrates enhanced Magritte-style components for generating bear portraits
 */

import { v4 as uuidv4 } from 'uuid';
import { AIService } from '../ai';
import { ReplicateService } from '../replicate';
import { MagrittePromptEnhancer } from '../style/magrittePromptEnhancer';
import { EnhancedMagritteMetadataGenerator } from '../style/EnhancedMagritteMetadataGenerator';
import { EnhancedCharacterGenerator } from '../../generators/EnhancedCharacterGenerator';
import { EnhancedLogger, LogLevel } from '../../utils/enhancedLogger';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Configuration for Enhanced Magritte Service
 */
export interface EnhancedMagritteServiceConfig {
  aiService: AIService;
  replicateService: ReplicateService;
  outputDir?: string;
}

/**
 * Enhanced Magritte Service Result
 */
export interface EnhancedMagritteResult {
  success: boolean;
  artwork?: {
    id: string;
    title: string;
    imageUrl: string;
    character: any;
    prompt: string;
    metadata: any;
  };
  error?: Error;
}

/**
 * Result from Replicate image generation
 */
interface ImageGenerationResult {
  success: boolean;
  imageUrl: string;
  error?: Error;
}

/**
 * Helper function to extract image ID from URL
 */
function extractImageId(url: string): string {
  if (!url) return uuidv4().substring(0, 8);
  
  try {
    // Handle flux model URLs
    const fluxMatch = url.match(/\/([A-Za-z0-9]{20,})\/([A-Za-z0-9]+\.png)$/);
    if (fluxMatch) {
      return `${fluxMatch[1].substring(0, 8)}_${fluxMatch[2].replace('.png', '')}`;
    }
    
    // Handle standard Replicate URLs
    const standardMatch = url.match(/\/([A-Za-z0-9]{20,})\/out-\d+\.png$/);
    if (standardMatch) {
      return standardMatch[1].substring(0, 12);
    }
    
    // If no match, use the last segment of the URL path
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1].split('.')[0];
    return lastSegment;
  } catch (error) {
    console.error('Error extracting image ID:', error);
    return uuidv4().substring(0, 8);
  }
}

/**
 * Enhanced Magritte Service
 * Provides a streamlined service for generating Magritte-style bear portraits
 */
export class EnhancedMagritteService {
  private id: string;
  private aiService: AIService;
  private replicateService: ReplicateService;
  private outputDir: string;
  
  private promptEnhancer: MagrittePromptEnhancer;
  private metadataGenerator: EnhancedMagritteMetadataGenerator;
  private characterGenerator: EnhancedCharacterGenerator;
  
  /**
   * Constructor
   */
  constructor(config: EnhancedMagritteServiceConfig) {
    this.id = uuidv4().substring(0, 8);
    this.aiService = config.aiService;
    this.replicateService = config.replicateService;
    this.outputDir = config.outputDir || path.join(process.cwd(), 'output', 'magritte');
    
    // Initialize components
    this.promptEnhancer = new MagrittePromptEnhancer();
    this.metadataGenerator = new EnhancedMagritteMetadataGenerator();
    this.characterGenerator = new EnhancedCharacterGenerator(this.aiService);
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    EnhancedLogger.log(`EnhancedMagritteService (${this.id}) initialized`, LogLevel.INFO);
  }
  
  /**
   * Generate a Magritte-style bear portrait
   */
  async generateBearPortrait(
    concept: string,
    options?: {
      series?: string;
      artDirection?: any;
      outputFilename?: string;
    }
  ): Promise<EnhancedMagritteResult> {
    const startTime = new Date();
    
    try {
      // Start the generation process
      EnhancedLogger.logGenerationStart(concept, 'bear_pfp');
      
      // Step 1: Enhance the prompt
      EnhancedLogger.printSection('Enhancing Prompt');
      const enhancedPromptResult = await this.promptEnhancer.enhancePrompt(
        concept,
        options?.series,
        options?.artDirection
      );
      
      EnhancedLogger.log(`Enhanced prompt created using template: ${enhancedPromptResult.template.name}`, LogLevel.SUCCESS);
      EnhancedLogger.log(`Template reference: ${enhancedPromptResult.template.referenceArtwork}`, LogLevel.INFO);
      
      // Step 2: Generate the image
      EnhancedLogger.printSection('Generating Image');
      const modelName = this.replicateService.getDefaultModel ? 
        this.replicateService.getDefaultModel() : 
        'black-forest-labs/flux-1.1-pro';
      
      EnhancedLogger.log(`Sending to ${modelName}`, LogLevel.INFO);
      
      // Generate the image using Replicate
      // Create options object for negative prompt
      const generateOptions: Record<string, any> = {};
      if (enhancedPromptResult.negativePrompt && enhancedPromptResult.negativePrompt.length > 0) {
        generateOptions.negative_prompt = enhancedPromptResult.negativePrompt.join(', ');
      }
      
      // Call the service
      // Note: We handle both possible return types from the service (object or string URL)
      const imageResultRaw = await this.replicateService.generateImage(
        enhancedPromptResult.prompt,
        generateOptions
      );
      
      // Normalize the result to our ImageGenerationResult format
      let imageResult: ImageGenerationResult;
      if (typeof imageResultRaw === 'string') {
        // If the service returns just a URL string
        imageResult = {
          success: true,
          imageUrl: imageResultRaw
        };
      } else if (typeof imageResultRaw === 'object' && imageResultRaw !== null) {
        // If the service returns an object with imageUrl property
        imageResult = imageResultRaw as ImageGenerationResult;
      } else {
        // Handle unexpected result
        throw new Error('Unexpected result from image generation service');
      }
      
      if (!imageResult || !imageResult.imageUrl) {
        throw new Error('Failed to generate image');
      }
      
      EnhancedLogger.log(`Image generated successfully`, LogLevel.SUCCESS);
      
      // Step 3: Generate character
      EnhancedLogger.printSection('Creating Character');
      const character = await this.characterGenerator.generateCharacter(
        concept, 
        enhancedPromptResult.prompt
      );
      
      EnhancedLogger.log(`Character created: ${character.name}, ${character.title}`, LogLevel.SUCCESS);
      
      // Step 4: Generate metadata
      EnhancedLogger.printSection('Generating Metadata');
      const metadata = await this.metadataGenerator.generateMetadata(
        enhancedPromptResult.prompt,
        character,
        imageResult.imageUrl,
        options?.artDirection
      );
      
      EnhancedLogger.log(`Metadata generated with ${metadata.nftMetadata.attributes.length} attributes`, LogLevel.SUCCESS);
      
      // Step 5: Save results
      const outputFilename = options?.outputFilename || 
        `magritte_bear_${extractImageId(imageResult.imageUrl)}`;
        
      await this.saveResults(metadata, outputFilename);
      
      // Calculate duration
      const duration = new Date().getTime() - startTime.getTime();
      EnhancedLogger.log(`Generation completed in ${(duration / 1000).toFixed(2)}s`, LogLevel.SUCCESS);
      
      // Return the result
      return {
        success: true,
        artwork: {
          id: metadata.id,
          title: metadata.title,
          imageUrl: imageResult.imageUrl,
          character: metadata.character,
          prompt: enhancedPromptResult.prompt,
          metadata: metadata
        }
      };
    } catch (error) {
      EnhancedLogger.log(`Error generating bear portrait: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
      
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }
  
  /**
   * Save the results to the output directory
   */
  private async saveResults(metadata: any, filename: string): Promise<void> {
    try {
      // Create filepath
      const filepath = path.join(this.outputDir, filename);
      
      // Save metadata JSON
      fs.writeFileSync(`${filepath}.json`, JSON.stringify(metadata, null, 2));
      EnhancedLogger.log(`Metadata saved to ${filepath}.json`, LogLevel.SUCCESS);
      
      // Save prompt file
      fs.writeFileSync(`${filepath}-prompt.txt`, metadata.prompt);
      EnhancedLogger.log(`Prompt saved to ${filepath}-prompt.txt`, LogLevel.SUCCESS);
      
      return;
    } catch (error) {
      EnhancedLogger.log(`Error saving results: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
      throw error;
    }
  }
  
  /**
   * Generate multiple bear portraits in batch
   */
  async generateBatch(
    concepts: string[],
    options?: {
      series?: string;
      artDirection?: any;
      baseFilename?: string;
    }
  ): Promise<{
    success: boolean;
    results: EnhancedMagritteResult[];
    completed: number;
    errors: number;
  }> {
    const results: EnhancedMagritteResult[] = [];
    let completed = 0;
    let errors = 0;
    
    EnhancedLogger.printHeader(`BATCH GENERATION: ${concepts.length} PORTRAITS`);
    
    for (let i = 0; i < concepts.length; i++) {
      const concept = concepts[i];
      
      EnhancedLogger.log(`Processing ${i+1}/${concepts.length}: ${concept}`, LogLevel.INFO);
      EnhancedLogger.logGenerationProgress('Batch Progress', i, concepts.length);
      
      try {
        // Generate with sequence number in filename
        const result = await this.generateBearPortrait(concept, {
          ...options,
          outputFilename: `${options?.baseFilename || 'batch'}_${i+1}`
        });
        
        results.push(result);
        
        if (result.success) {
          completed++;
        } else {
          errors++;
        }
      } catch (error) {
        EnhancedLogger.log(`Error processing concept ${i+1}: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
        
        errors++;
        results.push({
          success: false,
          error: error instanceof Error ? error : new Error(String(error))
        });
      }
    }
    
    EnhancedLogger.printSection('Batch Generation Complete');
    EnhancedLogger.log(`Completed: ${completed}/${concepts.length}`, LogLevel.SUCCESS);
    EnhancedLogger.log(`Errors: ${errors}/${concepts.length}`, errors > 0 ? LogLevel.ERROR : LogLevel.SUCCESS);
    
    return {
      success: errors === 0,
      results,
      completed,
      errors
    };
  }
  
  /**
   * Export the collection for NFT minting
   */
  async exportForNFT(
    artworks: EnhancedMagritteResult[],
    collectionName: string = 'Surrealist Bear Portraits'
  ): Promise<string> {
    try {
      // Create export directory
      const exportDir = path.join(this.outputDir, 'nft-collection');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }
      
      // Create images directory
      const imagesDir = path.join(exportDir, 'images');
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }
      
      // Transform metadata to NFT format
      const nftMetadata = artworks
        .filter(artwork => artwork.success && artwork.artwork)
        .map((artwork, index) => {
          const { character, title, imageUrl } = artwork.artwork!;
          
          return {
            name: `${character.name} #${index + 1}`,
            description: character.backstory,
            image: `ipfs://PLACEHOLDER_CID/${index + 1}.png`,
            attributes: artwork.artwork!.metadata.nftMetadata.attributes
          };
        });
      
      // Save metadata JSON
      const metadataPath = path.join(exportDir, 'metadata.json');
      fs.writeFileSync(metadataPath, JSON.stringify(nftMetadata, null, 2));
      
      // Create collection info
      const collectionInfo = {
        name: collectionName,
        description: "A collection of distinguished bear portraits in René Magritte's surrealist style",
        image: "ipfs://PLACEHOLDER_CID/collection.png",
        external_link: "https://example.com/collection",
        seller_fee_basis_points: 250, // 2.5%
        fee_recipient: "0x0000000000000000000000000000000000000000"
      };
      
      // Save collection info
      fs.writeFileSync(
        path.join(exportDir, 'collection.json'),
        JSON.stringify(collectionInfo, null, 2)
      );
      
      EnhancedLogger.log(`Collection exported to ${exportDir}`, LogLevel.SUCCESS);
      EnhancedLogger.log(`Total NFTs: ${nftMetadata.length}`, LogLevel.SUCCESS);
      
      return exportDir;
    } catch (error) {
      EnhancedLogger.log(`Error exporting collection: ${error instanceof Error ? error.message : String(error)}`, LogLevel.ERROR);
      throw error;
    }
  }
} 