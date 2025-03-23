/**
 * Helper Utilities
 * Common utility functions for the ArtBot system
 */

/**
 * Extract the image ID from a Replicate URL
 * Handles URLs from different Replicate models
 */
export function extractImageId(url: string): string | null {
  if (!url) return null;
  
  try {
    // Handle flux model URLs
    // Example: https://replicate.delivery/xezq/PD5WUwjaoLqlBBJPvbdJzWb7yOdaOD8futoHe70ryeYpuB3oA/tmpjdeesyor.png
    const fluxMatch = url.match(/\/([A-Za-z0-9]{20,})\/([A-Za-z0-9]+\.png)$/);
    if (fluxMatch) {
      return `${fluxMatch[1].substring(0, 8)}_${fluxMatch[2].replace('.png', '')}`;
    }
    
    // Handle standard Replicate URLs
    // Example: https://replicate.delivery/pbxt/JasD44JF6SY7wqRVOD1xGzEiX9kK9GnKzhjiEGLuAFQSHeyQA/out-0.png
    const standardMatch = url.match(/\/([A-Za-z0-9]{20,})\/out-\d+\.png$/);
    if (standardMatch) {
      return standardMatch[1].substring(0, 12);
    }
    
    // Handle prediction URLs
    // Example: https://replicate.com/p/zxfdlk3gqvff7a4kmcvfn4i7xa
    const predictionMatch = url.match(/\/p\/([a-z0-9]+)$/);
    if (predictionMatch) {
      return predictionMatch[1];
    }
    
    // If no match, use the last segment of the URL path
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1].split('.')[0];
    return lastSegment;
  } catch (error) {
    console.error('Error extracting image ID:', error);
    return null;
  }
}

/**
 * Generate a safe filename from a string
 * Removes special characters and spaces
 */
export function safeFilename(str: string): string {
  if (!str) return 'untitled';
  
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '_') // Replace special chars with underscore
    .replace(/_+/g, '_')         // Replace multiple underscores with single
    .replace(/^_|_$/g, '')       // Remove leading/trailing underscores
    .substring(0, 64);           // Limit length
}

/**
 * Create a truncated version of a string with ellipsis
 */
export function truncateString(str: string, maxLength: number = 50): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Format a date as a string
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Create a random ID with a specified length
 */
export function createRandomId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Check if a URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Calculate the time difference between two dates in seconds
 */
export function calculateDuration(startTime: Date, endTime: Date = new Date()): number {
  return Math.round((endTime.getTime() - startTime.getTime()) / 1000);
}

/**
 * Format a duration in seconds to a human-readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
} 