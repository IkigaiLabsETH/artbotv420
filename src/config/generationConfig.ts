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
  narrativeElements?: string[];
  metaArtisticElements?: string[];
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
  * Psychological depth with philosophical contemplation
  * Meta-artistic awareness of digital existence
- Color Palette:
  * Belgian cerulean sky blue with deep Prussian shadow
  * Rich mahogany brown with amber highlights
  * Deep viridian green with cool shadow tones
  * Sophisticated charcoal grey with blue undertones
  * Pristine cloud white with subtle warm tint
  * Scientifically calibrated Magritte color space
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
        "Philosophical surrealism",
        
        "The Gradation of Light (1926-1967) technique: microscopic smooth transitions between tones",
        "The Red Model (1935) surface quality: porcelain-like perfection with zero brushwork",
        "The Castle of the Pyrenees (1959) lighting: sourceless illumination with perfect shadow balance",
        "The Threatened Assassin (1926) edge technique: mathematically precise borders between color fields",
        "The Origin of Language (1955) detail: hyper-defined minutiae within simplified forms",
        "The Call of Peaks (1943) depth: flawless atmospheric perspective without obvious technique",
        "The Lovers (1928) texture: cloth-like precision with optical perfection",
        "The Secret Player (1927) spatial paradox: precise depth without conventional perspective",
        "Not To Be Reproduced (1937) reflective technique: mirror-like surfaces with impossible physics",
        "The Human Condition (1933) paint quality: dimensionless surface with infinite depth suggestion",
        
        "Altered physics of light: reflection patterns impossible in natural world",
        "Recursive spatial paradoxes: paintings-within-paintings with perfect technical execution",
        "Precision atmospheric coloration with zero gradients yet perfect transitions",
        "Mathematical shadow deployment with zero diffusion yet perfect optical reality",
        "Material property subversion with flawless technical rendering",
        
        "Bear gaze suggesting philosophical contemplation of unseen elements",
        "Subtle expression reflecting stoic awareness of surreal surroundings",
        "Eyes containing miniature paradoxical landscape (Magritte's False Mirror technique)",
        "Partial face obscured by perfectly rendered floating object (Son of Man adaptation)",
        "Emotion suggested through Magritte's sourceless lighting rather than expression",
        "Bear silhouette containing impossible interior landscape (Personal Values technique)",
        "Mental state revealed through impossible shadow direction (Empire of Light technique)",
        "Psychological narrative through object juxtaposition (Key of Dreams approach)",
        "Identity exploration through mirror with impossible reflection (Not to be Reproduced method)",
        "Consciousness depicted through window-within-eye (Human Condition technique)",
        
        "Digital meta-awareness suggested through frame-breaking elements",
        "NFT-specific visual paradoxes rendered in Magritte's technical style",
        "Blockchain visual metaphors using Magritte's object vocabulary",
        "Digital ownership symbolism through Magritte's approach to space and boundaries",
        "Contemporary technology elements interpreted through Magritte's 1930s sensibilities"
      ],
      visualElements: [
        "Distinguished bear facial features with perfect symmetry",
        "Formal portrait composition with mathematical precision",
        "Professional attire and accessories rendered with painterly realism",
        "Pure, unmodulated color fields with flawless transitions",
        "Perfect tonal transitions with optical precision",
        "Hyper-precise yet painterly edges with complete control",
        "Carefully controlled light and shadow with sourceless illumination",
        
        "Bear gaze suggesting philosophical contemplation of unseen elements",
        "Subtle expression reflecting stoic awareness of surreal surroundings",
        "Eyes containing miniature paradoxical landscape (Magritte's False Mirror technique)",
        "Partial face obscured by perfectly rendered floating object (Son of Man adaptation)",
        "Emotion suggested through Magritte's sourceless lighting rather than expression",
        "Bear silhouette containing impossible interior landscape (Personal Values technique)",
        "Mental state revealed through impossible shadow direction (Empire of Light technique)",
        "Psychological narrative through object juxtaposition (Key of Dreams approach)",
        "Identity exploration through mirror with impossible reflection (Not to be Reproduced method)",
        "Consciousness depicted through window-within-eye (Human Condition technique)",
        
        "Digital meta-awareness suggested through frame-breaking elements",
        "NFT-specific visual paradoxes rendered in Magritte's technical style",
        "Blockchain visual metaphors using Magritte's object vocabulary",
        "Digital ownership symbolism through Magritte's approach to space and boundaries",
        "Contemporary technology elements interpreted through Magritte's 1930s sensibilities"
      ],
      colorPalette: [
        "Belgian sky blue (flawless gradient)",
        "Magritte cloud white (pure, unmodulated)",
        "Distinguished bear brown (perfectly rendered)",
        "Deep shadow grey (controlled darkness)",
        "Twilight purple (mysterious glow)",
        "Pristine collar white (atmospheric effect)",
        "Deep charcoal black (metaphysical depth)",
        "Pale highlight (subtle luminosity)",
        
        "Magritte Cerulean (RGB: 0, 123, 167) (Guaranteed to render accurately on digital displays)",
        "Precise Shadow Grey (RGB: 64, 64, 64) (Calibrated to match Magritte's museum display lighting)",
        "Belgian Museum White (RGB: 253, 253, 253) (Spectrally optimized for digital reproduction)",
        "Curatorial Night Blue (RGB: 21, 31, 60) (Matches Magritte retrospective lighting conditions)",
        "Conservation-Grade Flesh (RGB: 237, 213, 183) (Matches preserved Magritte paintings)",
        "Art Historical Green (RGB: 29, 90, 63) (Color-matched to Magritte's preserved pigments)",
        "Digital Collection Brown (RGB: 98, 52, 18) (Optimized for consistent cross-platform display)",
        "Museum Archival Red (RGB: 170, 56, 30) (Matches aging characteristics of Magritte's pigments)",
        
        "Quantum Blue (non-natural blue impossible in physical pigments)",
        "Digital-Only Gradient (mathematically perfect transition impossible in physical paint)",
        "Device-Optimized Grey (appears identical across all properly calibrated displays)",
        "Perception-Enhancing Yellow (calibrated to trigger specific visual cortex response)",
        "Memory-Associative Green (calibrated to evoke specific art historical recall)",
        "Attention-Directing Red (scientifically optimized for visual hierarchy)"
      ],
      compositionGuidelines: [
        "Perfectly centered main subject",
        "Traditional profile view against blue sky",
        "Theatrical staging of symbolic elements",
        "Perfect placement using golden ratio",
        "Classical balance with surreal elements",
        "Formal painting arrangement with contemplative spacing",
        "Objects arranged in impossible but harmonious configuration",
        
        "Golden ratio positioning of all bear portrait elements (φ = 1.618...)",
        "Fibonacci spiral arrangement of visual weight and color emphasis",
        "Sacred geometry principles applied to negative space distribution",
        "Rule of Thirds subverted through perfectly centered composition",
        "Dynamic symmetry grid underlying all object placements",
        "Information theory optimization of visual entropy and order",
        "Computational aesthetic balance using Arnheim's visual weight algorithms",
        "Gestalt principles applied to paradoxical grouping elements",
        
        "Zero visual noise in color field transitions",
        "Perfect edge acutance at mathematical maximum",
        "Magritte's impossible lighting physics rendered with physical simulation accuracy",
        "Optical precision at the limits of human perception",
        "Surface quality at theoretical perfection (zero texture while maintaining paint character)",
        "Perfect atmospheric perspective without technique visibility"
      ],
      narrativeElements: [
        "Distinguished bear character exists at intersection of physical and digital reality",
        "Bear portrait serves as gateway between metaverse and traditional art history",
        "Character exists simultaneously in multiple states (Schrödinger's Bear concept)",
        "Portrait serves as philosophical exploration of NFT permanence vs. ephemeral art",
        "Bear character has awareness of its own digital nature (meta-narrative)",
        "Portrait contains subtle references to its existence across blockchain dimensions",
        "Character possesses both historical art knowledge and digital future awareness",
        "Portrait embodies tension between traditional painting and computational art",
        
        "Subtle ceci n'est pas un ours ('this is not a bear') paradox embedded in composition",
        "Portrait questions relationship between physical and digital ownership",
        "Image explores boundaries between human, animal and digital intelligence",
        "Portrait suggests tension between algorithmic creation and human creativity",
        "Character embodies philosophical questioning of art market mechanisms",
        "Image explores what distinguishes NFT art from traditional art objects"
      ],
      metaArtisticElements: [
        "Portrait contains subtle acknowledgment of its digital nature",
        "Image includes Magritte-style paradox about NFT art status",
        "Composition subtly references digital art marketplace context",
        "Portrait contains veiled commentary on art collecting practices",
        "Image incorporates awareness of its viewing conditions (digital display)",
        "Portrait suggests continuity between traditional and digital surrealism",
        "Composition references its existence in a larger collection",
        "Image contains subtle suggestion of its creation process",
        
        "Subtle visual connectors to other portraits in collection",
        "Background elements suggesting shared universe with other bears",
        "Color palette connecting to broader collection narrative",
        "Symbolic elements creating visual language across collection",
        "Compositional echo patterns establishing collection rhythm"
      ],
      customStyleParams: {
        surfaceQuality: 0.98,
        edgePrecision: 0.97,
        colorPurity: 0.95,
        lightingControl: 0.97,
        shadowQuality: 0.97,
        
        atmosphericPerspective: 0.94,
        materialParadox: 0.92,
        conceptualClarity: 0.96,
        temporalAmbiguity: 0.93,
        metaphysicalDepth: 0.95,
        technicalInvisibility: 0.98,
        historyConsistency: 0.94,
        contemporaryRelevance: 0.92,
        blockchainResonance: 0.90
      }
    }
  },
  defaultStyle: "magritte"
}; 