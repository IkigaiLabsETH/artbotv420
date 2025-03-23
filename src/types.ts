/**
 * Common type definitions for the ArtBot system
 */

/**
 * Model prediction result from Replicate
 */
export interface ModelPrediction {
  id: string;
  version?: string;
  model?: string;
  created?: Date;
  urls?: {
    get: string;
    cancel: string;
  };
  created_at?: string;
  started_at?: string;
  completed_at?: string;
  status: string;
  input: Record<string, any>;
  output: string[] | null;
  error?: string | null;
  logs?: string | null;
  metrics?: Record<string, any>;
}

/**
 * Art generation result
 */
export interface ArtGenerationResult {
  success: boolean;
  artwork?: {
    id: string;
    title: string;
    description: string;
    prompt: string;
    imageUrl: string;
    character?: any;
    style?: string;
    files?: {
      prompt: string;
      image: string;
      metadata: string;
    };
  };
  error?: Error;
}

/**
 * Art project configuration
 */
export interface ArtProject {
  title: string;
  description?: string;
  concept: string;
  style?: string;
  requirements?: string[];
  outputFilename?: string;
  artDirection?: Record<string, any>;
}

/**
 * Metadata for generated artwork
 */
export interface ArtworkMetadata {
  id: string;
  title: string;
  description: string;
  prompt: string;
  style: string;
  imageUrl: string;
  character?: any;
  createdAt: string;
  tags?: string[];
  attributes?: Record<string, any>;
}

/**
 * NFT metadata format for compatibility with marketplaces
 */
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
  created_by: string;
  creation_date: string;
} 