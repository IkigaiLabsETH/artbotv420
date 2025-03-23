/**
 * Configuration system for AI image generation
 * Centralizes all model parameters and style settings
 */

/**
 * Base configuration for a specific model
 */
export interface ModelConfig {
  inferenceSteps: number;
  guidanceScale: number;
  dimensions: {
    width: number;
    height: number;
  };
  scheduler?: string;
  sampler?: string;
  denoisingStrength?: number;
  customParams?: Record<string, any>;
}

/**
 * Style-specific configuration
 */
export interface StyleConfig {
  name: string;
  description: string;
  promptPrefix?: string;
  promptSuffix?: string;
  negativePrompt?: string[];
  styleEmphasis?: string[];
  visualElements?: string[];
  colorPalette?: string[];
  compositionGuidelines?: string[];
  references?: string[];
  avoidElements?: string[];
  customStyleParams?: Record<string, any>;
}

/**
 * Complete generation configuration
 */
export interface GenerationConfig {
  default: ModelConfig;
  models: Record<string, ModelConfig>;
  styles: Record<string, StyleConfig>;
  defaultStyle: string;
}

/**
 * Default generation configuration with optimized settings
 */
export const defaultGenerationConfig: GenerationConfig = {
  default: {
    inferenceSteps: 50,
    guidanceScale: 7.5,
    dimensions: {
      width: 1024,
      height: 1024
    },
    scheduler: "DPMSolverMultistep"
  },
  models: {
    "black-forest-labs/flux-1.1-pro": {
      inferenceSteps: 28,
      guidanceScale: 3,
      dimensions: {
        width: 2048,
        height: 2048
      },
      scheduler: "DPMSolverMultistep",
      denoisingStrength: 0.5
    },
    "adirik/flux-cinestill": {
      inferenceSteps: 30,
      guidanceScale: 5,
      dimensions: {
        width: 1024,
        height: 1024
      },
      scheduler: "DPMSolverMultistep"
    },
    "minimax/image-01": {
      inferenceSteps: 50,
      guidanceScale: 7.5,
      dimensions: {
        width: 1024,
        height: 1024
      }
    }
  },
  styles: {
    "magritte": {
      name: "Magritte Surrealist",
      description: "René Magritte's distinctive surrealist style with Belgian techniques",
      promptPrefix: "Create a portrait in René Magritte's distinctive painting style, perfectly centered for a PFP (Profile Picture). The image should embody Magritte's precise yet painterly technique that captures ",
      promptSuffix: `. Render with Magritte's signature artistic elements:
- Painting Style: 
  * Magritte's characteristic smooth, matte finish
  * Subtle visible brushwork in flat color areas
  * Soft edges with precise control
  * Deliberate paint application with minimal texture
  * Careful gradients reminiscent of Belgian sky
  * Oil painting technique with minimal impasto
- Artistic Elements:
  * Clean, unmodulated color fields
  * Subtle tonal transitions
  * Precise yet painterly edges
  * Careful attention to light and shadow
  * Magritte's characteristic surface quality
- Composition Guidelines:
  * Perfectly balanced surreal elements
  * Mathematically precise staging
  * Golden ratio compositions
  * Classical painting structure
  * Traditional profile view
  * Museum-quality presentation
- Color Treatment:
  * Cerulean sky blue with deep shadow grey
  * Twilight purple with pristine cloud white
  * Deep night blue with pale morning light
  * Unmodulated color fields with perfect transitions
  * Traditional matte surfaces with subtle tonal variation
Must maintain the artist's distinctive painting style while being perfectly centered for profile picture use.`,
      negativePrompt: [
        "photorealistic", "hyperrealistic", "camera photo", "photograph", "DSLR", "studio lighting",
        "3D rendering", "CGI", "digital art", "graphic design", "illustration", "cartoon",
        "rough texture", "heavy impasto", "visible brushstrokes", "expressionistic", "loose style",
        "sketchy", "unfinished", "abstract", "modernist", "contemporary", "avant-garde",
        "full body shot", "landscape format", "action poses", "busy backgrounds",
        "natural wilderness", "full face view", "messy composition", "cluttered elements",
        "informal poses", "casual style", "modern clothing", "contemporary fashion",
        "sports wear", "casual accessories"
      ],
      styleEmphasis: [
        "Magritte's characteristic smooth, matte finish",
        "Subtle visible brushwork in flat areas",
        "Precise yet painterly edges",
        "Careful oil paint application",
        "Minimal surface texture",
        "Controlled tonal transitions",
        "Clean color fields",
        "Belgian surrealist painting style",
        "Traditional oil painting method",
        "Deliberate artistic technique"
      ],
      colorPalette: [
        "Belgian sky blue (smooth gradient)",
        "Magritte cloud white (unmodulated)",
        "Son of Man apple green (matte finish)",
        "Empire of Light blue (careful transition)",
        "Golconda grey (precise tone)",
        "Deep shadow grey (controlled darkness)",
        "Twilight purple (mysterious glow)",
        "Pristine cloud white (atmospheric effect)",
        "Deep night blue (metaphysical depth)",
        "Pale morning light (subtle luminosity)"
      ],
      compositionGuidelines: [
        "Perfectly centered main subject",
        "Traditional profile view against blue sky",
        "Theatrical staging of symbolic elements",
        "Perfect placement using golden ratio",
        "Classical balance with surreal elements",
        "Formal painting arrangement with contemplative spacing",
        "Objects arranged in impossible but harmonious configuration"
      ],
      customStyleParams: {
        surfaceQuality: 0.9,
        edgePrecision: 0.85,
        colorPurity: 0.8,
        lightingControl: 0.9,
        shadowQuality: 0.85
      }
    },
    "bear_pfp": {
      name: "Surrealist Bear Portrait",
      description: "Distinguished bear portrait in Magritte's surrealist style",
      promptPrefix: "Create a portrait of a distinguished bear in René Magritte's distinctive painting style, perfectly centered for a PFP (Profile Picture). The bear portrait should feature ",
      promptSuffix: `. Render with Magritte's signature artistic elements:
- Painting Style: 
  * Magritte's characteristic smooth, matte finish
  * Subtle visible brushwork in flat color areas
  * Soft edges with precise control
  * Deliberate paint application with minimal texture
  * Careful gradients reminiscent of Belgian sky
  * Oil painting technique with minimal impasto
- Bear Portrait Elements:
  * Distinguished bear facial features
  * Formal portrait composition
  * Professional attire and accessories
  * Clean, unmodulated color fields
  * Subtle tonal transitions
  * Precise yet painterly edges
  * Careful attention to light and shadow
Must maintain Magritte's distinctive painting style while being perfectly centered for profile picture use.`,
      negativePrompt: [
        "photorealistic", "hyperrealistic", "camera photo", "photograph", "DSLR", "studio lighting",
        "3D rendering", "CGI", "digital art", "graphic design", "illustration", "cartoon",
        "rough texture", "heavy impasto", "visible brushstrokes", "expressionistic", "loose style",
        "sketchy", "unfinished", "abstract", "modernist", "contemporary", "avant-garde",
        "full body shot", "landscape format", "action poses", "busy backgrounds",
        "natural wilderness", "full face view", "messy composition", "cluttered elements",
        "informal poses", "casual style", "modern clothing", "contemporary fashion",
        "sports wear", "casual accessories", "cute", "childish", "anime", "cartoon bear"
      ]
    }
  },
  defaultStyle: "magritte"
}; 