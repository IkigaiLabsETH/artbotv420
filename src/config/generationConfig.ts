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
      inferenceSteps: 45,
      guidanceScale: 4.5,
      dimensions: {
        width: 2048,
        height: 2048
      },
      scheduler: "DPMSolverMultistep",
      denoisingStrength: 0.75,
      customParams: {
        controlnet_conditioning_scale: 0.8,
        clip_skip: 2
      }
    },
    "adirik/flux-cinestill": {
      inferenceSteps: 35,
      guidanceScale: 5.5,
      dimensions: {
        width: 1536,
        height: 1536
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
  * Magritte's characteristic perfectly smooth, matte finish
  * Invisible brushwork in flat color areas
  * Crisp, mathematically precise edges
  * Meticulous paint application with no visible texture
  * Immaculate gradients reminiscent of Belgian sky
  * Oil painting technique with zero impasto
- Artistic Elements:
  * Pure, unmodulated color fields
  * Perfect tonal transitions
  * Hyper-precise edge definition
  * Sourceless ambient lighting
  * Magritte's characteristic glass-like surface quality
- Composition Guidelines:
  * Mathematically balanced surreal elements
  * Perfect golden ratio compositions
  * Classical painting structure
  * Traditional profile view
  * Museum-quality presentation
- Color Treatment:
  * Pure cerulean sky blue with deep shadow grey
  * Twilight purple with pristine cloud white
  * Deep night blue with pale morning light
  * Immaculate color fields with perfect transitions
  * Matte surfaces with porcelain-like finish
Must maintain the artist's distinctive painting style while being perfectly centered for profile picture use.`,
      negativePrompt: [
        "photorealistic", "hyperrealistic", "camera photo", "photograph", "DSLR", "studio lighting",
        "3D rendering", "CGI", "digital art", "graphic design", "illustration", "cartoon",
        "rough texture", "heavy impasto", "visible brushstrokes", "expressionistic", "loose style",
        "sketchy", "unfinished", "abstract", "modernist", "contemporary", "avant-garde",
        "full body shot", "landscape format", "action poses", "busy backgrounds",
        "natural wilderness", "full face view", "messy composition", "cluttered elements",
        "informal poses", "casual style", "modern clothing", "contemporary fashion",
        "sports wear", "casual accessories", "low quality", "blurry", "grainy", "pixelated"
      ],
      styleEmphasis: [
        "Magritte's characteristic perfectly smooth, matte finish",
        "Invisible brushwork in flat areas",
        "Hyper-precise edges",
        "Meticulous oil paint application",
        "Zero surface texture",
        "Mathematically precise tonal transitions",
        "Pure, unmodulated color fields",
        "Belgian surrealist painting technique",
        "Traditional oil painting method",
        "Museum-quality execution"
      ],
      colorPalette: [
        "Belgian sky blue (flawless gradient)",
        "Magritte cloud white (pure, unmodulated)",
        "Son of Man apple green (perfect matte)",
        "Empire of Light blue (mathematically precise transition)",
        "Golconda grey (precise, even tone)",
        "Deep shadow grey (controlled darkness)",
        "Twilight purple (mysterious glow)",
        "Pristine cloud white (atmospheric perfection)",
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
        surfaceQuality: 0.95,
        edgePrecision: 0.95,
        colorPurity: 0.9,
        lightingControl: 0.95,
        shadowQuality: 0.95
      }
    },
    "bear_pfp": {
      name: "Surrealist Bear Portrait",
      description: "Distinguished bear portrait in Magritte's surrealist style",
      promptPrefix: "Create a portrait of a distinguished bear in René Magritte's distinctive painting style, perfectly centered for a PFP (Profile Picture). The bear portrait should feature ",
      promptSuffix: `. Render with Magritte's signature artistic elements:
- Painting Style: 
  * Magritte's characteristic perfectly smooth, matte finish
  * Invisible brushwork in flat color areas
  * Crisp, mathematically precise edges
  * Meticulous paint application with no visible texture
  * Immaculate gradients reminiscent of Belgian sky
  * Oil painting technique with zero impasto
- Bear Portrait Elements:
  * Distinguished bear facial features with perfect symmetry
  * Formal portrait composition with mathematical precision
  * Professional attire and accessories rendered with painterly realism
  * Pure, unmodulated color fields with flawless transitions
  * Perfect tonal transitions with optical precision
  * Hyper-precise yet painterly edges with complete control
  * Carefully controlled light and shadow with sourceless illumination
- Color Palette:
  * Belgian cerulean sky blue with deep Prussian shadow
  * Rich mahogany brown with amber highlights
  * Deep viridian green with cool shadow tones
  * Sophisticated charcoal grey with blue undertones
  * Pristine cloud white with subtle warm tint
Must maintain Magritte's distinctive painting style while being perfectly centered for profile picture use.`,
      negativePrompt: [
        "photorealistic", "hyperrealistic", "camera photo", "photograph", "DSLR", "studio lighting",
        "3D rendering", "CGI", "digital art", "graphic design", "illustration", "cartoon",
        "rough texture", "heavy impasto", "visible brushstrokes", "expressionistic", "loose style",
        "sketchy", "unfinished", "abstract", "modernist", "contemporary", "avant-garde",
        "full body shot", "landscape format", "action poses", "busy backgrounds",
        "natural wilderness", "full face view", "messy composition", "cluttered elements",
        "informal poses", "casual style", "modern clothing", "contemporary fashion",
        "sports wear", "casual accessories", "cute", "childish", "anime", "cartoon bear",
        "fuzzy", "blurry", "low quality", "deformed", "disfigured", "mutated", "extra limbs", 
        "watermark", "signature", "realistic fur texture", "3D render", "photograph"
      ],
      styleEmphasis: [
        "Magritte's characteristic perfectly smooth, matte finish",
        "Invisible brushwork in flat areas",
        "Hyper-precise edges",
        "Meticulous oil paint application",
        "Zero surface texture",
        "Mathematically precise tonal transitions",
        "Pure, unmodulated color fields",
        "Belgian surrealist painting technique",
        "Traditional oil painting method",
        "Museum-quality execution",
        "Distinguished bear character",
        "Philosophical surrealism"
      ],
      colorPalette: [
        "Belgian sky blue (flawless gradient)",
        "Magritte cloud white (pure, unmodulated)",
        "Distinguished bear brown (perfectly rendered)",
        "Deep shadow grey (controlled darkness)",
        "Twilight purple (mysterious glow)",
        "Pristine collar white (atmospheric effect)",
        "Deep charcoal black (metaphysical depth)",
        "Pale highlight (subtle luminosity)"
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
        surfaceQuality: 0.97,
        edgePrecision: 0.95,
        colorPurity: 0.9,
        lightingControl: 0.95,
        shadowQuality: 0.95
      }
    }
  },
  defaultStyle: "magritte"
}; 