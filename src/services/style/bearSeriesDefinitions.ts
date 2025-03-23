/**
 * Bear Series Definitions
 * Defines the 15 distinct series for Surrealist Bear Portraits
 */

export interface BearSeriesDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  keyElements: string[];
  accessories: string[];
  conceptualThemes: string[];
  characterTraits: string[];
  promptEnhancers: string[];
  magritteElements: string[];
}

/**
 * Collection of bear series definitions based on the README
 */
export const BEAR_SERIES: BearSeriesDefinition[] = [
  {
    id: "adventure",
    name: "Adventure Series",
    emoji: "🌟",
    description: "Explorers and adventurers in diverse environments",
    keyElements: [
      "exploration gear", "specialized equipment", "navigational tools", 
      "protective attire", "scientific instruments"
    ],
    accessories: [
      "thermal gear", "navigation tools", "pith helmet", "botanical tools",
      "heat suit", "measuring devices", "brass periscope", "depth gauges",
      "wetsuit", "monofin", "balance equipment", "ice axes", "ropes",
      "specialized cave gear", "wingsuit"
    ],
    conceptualThemes: [
      "discovery", "courage", "scientific inquiry", "natural exploration", 
      "environmental study", "geographical mastery", "survival", "pioneering"
    ],
    characterTraits: [
      "intrepid", "curious", "methodical", "resilient", "observant", "fearless", "adventurous"
    ],
    promptEnhancers: [
      "against an enigmatic horizon", 
      "with paradoxical landscape elements",
      "where the expedition gear exists in impossible harmony with surroundings",
      "with exploration tools floating mysteriously in the space before them",
      "where the sky and the expedition environment merge in surreal contradiction"
    ],
    magritteElements: [
      "floating expedition tools",
      "sky with dual time of day",
      "mirrors reflecting impossible geography",
      "transparent map overlay",
      "clouds forming geographical features"
    ]
  },
  {
    id: "artistic",
    name: "Artistic Series",
    emoji: "🎨",
    description: "Creative artists with their tools and mediums",
    keyElements: [
      "creative tools", "artistic implements", "workspaces", 
      "materials", "creative products"
    ],
    accessories: [
      "molten glass", "specialized tools", "clay-stained apron", 
      "potter's wheel", "spray cans", "urban art tools", "looms", 
      "textile implements", "precious gems", "precision instruments",
      "audio equipment", "control interfaces", "laboratory equipment"
    ],
    conceptualThemes: [
      "creation", "expression", "craftsmanship", "innovation", 
      "tradition", "artistic vision", "transformation"
    ],
    characterTraits: [
      "creative", "meticulous", "visionary", "expressive", "skilled", "contemplative", "innovative"
    ],
    promptEnhancers: [
      "where art and reality intertwine", 
      "with creative tools floating in surreal arrangement",
      "against a backdrop that questions perception of artistic reality",
      "where the artwork and artist become indistinguishable",
      "with implements that defy their expected purpose"
    ],
    magritteElements: [
      "floating paintbrushes or tools",
      "artwork within artwork paradox",
      "creative implements of impossible scale",
      "studio elements with dreamlike quality", 
      "art materials behaving contrary to nature"
    ]
  },
  {
    id: "hipster",
    name: "Hipster Series",
    emoji: "🌿",
    description: "Modern pioneers in sustainable and artisanal practices",
    keyElements: [
      "sustainable items", "artisanal equipment", "urban agriculture", 
      "natural materials", "craft tools"
    ],
    accessories: [
      "sustainable containers", "rooftop hives", "brewing vessels", 
      "culture starters", "medicinal plants", "drying racks",
      "vintage turntables", "rare records", "sourdough", "ancient grains",
      "precise brewing methods", "foraging basket", "identification guide",
      "kombucha brewing equipment", "vintage typewriter"
    ],
    conceptualThemes: [
      "sustainability", "urban renewal", "craft revival", "slow living", 
      "natural processes", "cultural preservation", "zero waste"
    ],
    characterTraits: [
      "conscientious", "precise", "patient", "knowledgeable", "thoughtful", "authentic", "meticulous"
    ],
    promptEnhancers: [
      "where traditional crafts exist in a modern contradiction", 
      "with artisanal tools floating impossibly in urban space",
      "balancing natural elements in surreal urban context",
      "where scale and perspective of craft materials challenge reality",
      "with past and present craft techniques merging impossibly"
    ],
    magritteElements: [
      "floating artisanal tools",
      "urban-natural environment paradox",
      "craft materials behaving unnaturally",
      "indoor-outdoor space confusion",
      "time-distorted craft objects"
    ]
  },
  {
    id: "academic",
    name: "Academic Series",
    emoji: "📚",
    description: "Scholarly figures in various intellectual disciplines",
    keyElements: [
      "scholarly attire", "intellectual tools", "academic symbols", 
      "research equipment", "knowledge artifacts"
    ],
    accessories: [
      "scholarly robes", "ancient tomes", "brass telescopes", 
      "artifacts", "field tools", "rare specimens", "magnifying glass",
      "classical texts", "scrolls", "manuscripts", "complex equations",
      "geometric models", "ancient writing systems", "documents"
    ],
    conceptualThemes: [
      "knowledge", "wisdom", "discovery", "analysis", "contemplation", 
      "education", "intellectual pursuit", "heritage"
    ],
    characterTraits: [
      "erudite", "analytical", "contemplative", "methodical", "patient", "curious", "discerning"
    ],
    promptEnhancers: [
      "where knowledge objects exist in philosophical contradiction", 
      "with academic implements challenging the nature of understanding",
      "where books and instruments defy logical arrangement",
      "in a setting where interior and exterior academic spaces merge impossibly",
      "with scholarly items that question their own existence"
    ],
    magritteElements: [
      "floating books or documents",
      "academic instruments of impossible relation",
      "windows to contradictory knowledge domains",
      "scholarly items negating their purpose",
      "academic robes with surreal properties"
    ]
  },
  {
    id: "steampunk",
    name: "Steampunk Series",
    emoji: "⚡",
    description: "Victorian-futuristic inventors and mechanists",
    keyElements: [
      "brass devices", "mechanical contraptions", "clockwork", 
      "steam-powered machines", "Victorian futurism"
    ],
    accessories: [
      "brass-fitted devices", "mechanical contraptions", "intricate clockwork", 
      "fantastic airship controls", "steam-powered innovations",
      "brass and copper devices", "elaborate calculation tools",
      "precision instruments", "revolutionary machinery", "brass automatons"
    ],
    conceptualThemes: [
      "invention", "mechanical ingenuity", "alternative history", "technological wonder", 
      "Victorian futurism", "temporal manipulation", "aetheric science"
    ],
    characterTraits: [
      "ingenious", "methodical", "visionary", "meticulous", "precise", "inventive", "curious"
    ],
    promptEnhancers: [
      "where mechanical devices defy their logical function", 
      "with clockwork elements floating in impossible arrangement",
      "where time and space are mechanically distorted",
      "in a setting where Victorian and futuristic elements create paradox",
      "with brass mechanisms challenging physical laws"
    ],
    magritteElements: [
      "floating mechanical components",
      "clockwork defying temporal logic",
      "mechanical devices with impossible functions",
      "steam behaving contrary to physics",
      "Victorian objects in surreal relationships"
    ]
  },
  {
    id: "classical",
    name: "Classical Series",
    emoji: "🎵",
    description: "Musicians and composers of classical tradition",
    keyElements: [
      "musical instruments", "compositional tools", "performance attire", 
      "musical scores", "concert settings"
    ],
    accessories: [
      "quill and parchment", "precise baton", "rare vintage instruments", 
      "grand pianos", "centuries-old string instruments",
      "dramatic performance attire", "ensemble settings",
      "harpsichord", "music theory documents"
    ],
    conceptualThemes: [
      "harmony", "composition", "musical tradition", "performance", 
      "musical expression", "orchestration", "auditory experience"
    ],
    characterTraits: [
      "disciplined", "expressive", "meticulous", "passionate", "precise", "sophisticated", "cultured"
    ],
    promptEnhancers: [
      "where musical instruments defy their sonic purpose", 
      "with musical notes floating visibly in impossible arrangement",
      "where the distinction between performer and instrument blurs surreally",
      "in a setting where music becomes visually manifested against logic",
      "with sound and silence portrayed in visible contradiction"
    ],
    magritteElements: [
      "floating musical instruments",
      "music scores with impossible notation",
      "instruments merged with performers",
      "sound visualized as tangible element",
      "concert halls with paradoxical spatial properties"
    ]
  },
  {
    id: "craft",
    name: "Contemporary Craft Series",
    emoji: "🌟",
    description: "Artisans of modern craft and traditional techniques",
    keyElements: [
      "handcrafted tools", "traditional techniques", "artisanal products", 
      "craft materials", "workshop elements"
    ],
    accessories: [
      "artisanal goods", "culinary implements", "plant-based dyes", 
      "bookbinding tools", "vintage printing presses",
      "herb-infused vessels", "heritage seeds",
      "cheese-making equipment", "custom knives", "ceramic tools"
    ],
    conceptualThemes: [
      "craftsmanship", "tradition", "slow process", "material knowledge", 
      "tactile creation", "cultural preservation", "artisanal excellence"
    ],
    characterTraits: [
      "skilled", "patient", "detail-oriented", "knowledgeable", "meticulous", "traditional", "tactile"
    ],
    promptEnhancers: [
      "where craft implements exist in philosophical contradiction", 
      "with artisanal tools floating in impossible arrangement",
      "where craft materials transform in surreal manner",
      "in a setting where past and present craft techniques visually coexist",
      "with traditional processes rendered in temporal impossibility"
    ],
    magritteElements: [
      "floating craft tools",
      "artisanal materials behaving impossibly",
      "traditional implements and modern elements in surreal juxtaposition",
      "craft processes frozen in paradoxical time",
      "workshop elements with dreamlike quality"
    ]
  },
  {
    id: "urban_homesteading",
    name: "Urban Homesteading Series",
    emoji: "🌱",
    description: "Urban agriculturalists and sustainable practitioners",
    keyElements: [
      "urban farming tools", "preservation equipment", "sustainability implements", 
      "natural resources", "city-nature fusion"
    ],
    accessories: [
      "city farming tools", "preservation jars", "medicinal herb garden", 
      "water harvesting system", "compost equipment",
      "natural soap making supplies", "beeswax candles",
      "fiber spinning tools", "mead brewing apparatus", "plant identification guides"
    ],
    conceptualThemes: [
      "urban sustainability", "self-sufficiency", "natural cycles", "resource conservation", 
      "traditional knowledge", "urban nature", "ecological harmony"
    ],
    characterTraits: [
      "resourceful", "knowledgeable", "patient", "observant", "practical", "ecological", "inventive"
    ],
    promptEnhancers: [
      "where urban and natural elements merge in impossible harmony", 
      "with farming tools floating surreally in city space",
      "where the scale of natural elements challenges urban reality",
      "in a setting where indoor and outdoor urban spaces impossibly coexist",
      "with city and agricultural elements in philosophical contradiction"
    ],
    magritteElements: [
      "floating gardening implements",
      "urban-rural spatial contradictions",
      "natural elements behaving unnaturally in city context",
      "preservation jars with impossible contents",
      "city skyline merging with garden elements"
    ]
  },
  {
    id: "modern_maker",
    name: "Modern Maker Series",
    emoji: "🔧",
    description: "Contemporary makers creating analog and digital artifacts",
    keyElements: [
      "analog technologies", "maker tools", "vintage equipment", 
      "digital-analog fusion", "independent media"
    ],
    accessories: [
      "analog synthesizers", "electronic components", "vintage cameras", 
      "vinyl press equipment", "cassette label materials",
      "zine publishing tools", "embroidery equipment",
      "enamel pin materials", "sticker art supplies", "riso printer"
    ],
    conceptualThemes: [
      "analog revival", "independent creation", "technological repurposing", "media preservation", 
      "subcultural expression", "maker ethos", "physical-digital intersection"
    ],
    characterTraits: [
      "innovative", "detail-oriented", "technical", "creative", "independent", "resourceful", "curious"
    ],
    promptEnhancers: [
      "where analog and digital technologies exist in philosophical tension", 
      "with maker tools floating in impossible arrangement",
      "where electronic components defy their expected function",
      "in a setting where obsolete and cutting-edge technologies merge surreally",
      "with physical media existing in digital impossibility"
    ],
    magritteElements: [
      "floating electronic components",
      "analog media with impossible properties",
      "technologies from different eras in surreal coexistence",
      "circuitry behaving contrary to logic",
      "media devices with paradoxical functions"
    ]
  },
  {
    id: "experimental_art",
    name: "Experimental Art Series",
    emoji: "🔬",
    description: "Avant-garde artists exploring unconventional mediums",
    keyElements: [
      "experimental apparatus", "unconventional materials", "interactive elements", 
      "scientific-artistic fusion", "emergent media"
    ],
    accessories: [
      "light installation controls", "kinetic sculpture components", 
      "interactive design interfaces", "temporal media devices",
      "ecological art materials", "biofeedback equipment",
      "quantum art apparatus", "nano art tools", "zero-gravity art supplies",
      "weather system controls"
    ],
    conceptualThemes: [
      "artistic experimentation", "medium transcendence", "scientific art", "participatory creation", 
      "environmental interaction", "temporal experience", "scale manipulation"
    ],
    characterTraits: [
      "experimental", "conceptual", "boundary-pushing", "analytical", "interdisciplinary", "visionary", "provocative"
    ],
    promptEnhancers: [
      "where art and science exist in surreal contradiction", 
      "with experimental apparatus floating in impossible configuration",
      "where scale and perspective of artistic media challenge perception",
      "in a setting where natural laws are artistically subverted",
      "with interactive elements that philosophically question their purpose"
    ],
    magritteElements: [
      "floating experimental equipment",
      "scientific instruments behaving artistically",
      "light and shadow with impossible properties",
      "time visualized as spatial element",
      "art materials with paradoxical scale relationships"
    ]
  },
  {
    id: "digital_innovation",
    name: "Digital Innovation Series",
    emoji: "💻",
    description: "Digital pioneers exploring technological frontiers",
    keyElements: [
      "digital interfaces", "blockchain visualizations", "VR/AR equipment", 
      "emerging technologies", "computational devices"
    ],
    accessories: [
      "NFT visualization tools", "crypto art interfaces", "AI collaboration systems", 
      "VR headsets", "hologram generators",
      "bioart equipment", "algorithmic coding interfaces",
      "robotic art machines", "data visualization tools", "AR devices"
    ],
    conceptualThemes: [
      "digital frontier", "technological art", "code as medium", "virtual experience", 
      "data aesthetics", "human-machine collaboration", "decentralized creation"
    ],
    characterTraits: [
      "innovative", "technical", "forward-thinking", "analytical", "creative", "systematic", "visionary"
    ],
    promptEnhancers: [
      "where digital and physical reality exist in philosophical contradiction", 
      "with technological interfaces floating in impossible arrangement",
      "where virtual elements materialize in surreal manner",
      "in a setting where code and physical space merge impossibly",
      "with digital artifacts that question their own virtual nature"
    ],
    magritteElements: [
      "floating digital interfaces",
      "code visualized as tangible element",
      "virtual and physical objects in impossible relationship",
      "technological devices with paradoxical functions",
      "digital space rendered with physical impossibilities"
    ]
  },
  {
    id: "performance_art",
    name: "Performance Art Series",
    emoji: "🎭",
    description: "Performance artists exploring bodily and spatial expression",
    keyElements: [
      "performance spaces", "interactive elements", "body-based tools", 
      "temporal media", "audience engagement"
    ],
    accessories: [
      "movement notation", "audience interaction tools", "digital performance interfaces", 
      "sound performance equipment", "projection apparatus",
      "ritual objects", "site-specific materials",
      "durational art timepieces", "social practice implements", "hybrid media controls"
    ],
    conceptualThemes: [
      "embodied expression", "audience relationship", "spatial intervention", "temporal experience", 
      "ritual and ceremony", "social interaction", "multi-disciplinary fusion"
    ],
    characterTraits: [
      "expressive", "conceptual", "provocative", "present", "boundary-crossing", "embodied", "interactive"
    ],
    promptEnhancers: [
      "where performance and reality exist in philosophical tension", 
      "with performance elements floating in impossible configuration",
      "where the performer and audience relationship defies conventional boundaries",
      "in a setting where time and action merge surreally",
      "with ritual elements that question their ceremonial purpose"
    ],
    magritteElements: [
      "floating performance objects",
      "theatrical elements with impossible relationships",
      "performance space with paradoxical properties",
      "ritual objects behaving contrary to expectation",
      "audience-performer boundaries visually subverted"
    ]
  },
  {
    id: "sustainable_future",
    name: "Sustainable Future Series",
    emoji: "🌍",
    description: "Environmental innovators creating sustainable systems",
    keyElements: [
      "renewable technologies", "ecological systems", "sustainable materials", 
      "environmental monitoring", "future-oriented design"
    ],
    accessories: [
      "solar art installations", "wind energy devices", "recycled material tools", 
      "living material containers", "renewable energy interfaces",
      "water conservation systems", "earth art implements",
      "climate monitoring equipment", "eco-system models", "future vision blueprints"
    ],
    conceptualThemes: [
      "environmental harmony", "sustainable innovation", "ecological balance", "future resilience", 
      "natural systems", "renewable cycles", "earth stewardship"
    ],
    characterTraits: [
      "visionary", "ecological", "innovative", "conscientious", "systematic", "hopeful", "principled"
    ],
    promptEnhancers: [
      "where future and present environmental realities exist in philosophical contradiction", 
      "with sustainable technologies floating in impossible arrangement",
      "where natural and technological elements merge in surreal harmony",
      "in a setting where ecological processes are visualized in dreamlike manner",
      "with environmental elements that question conventional temporal progression"
    ],
    magritteElements: [
      "floating sustainable technologies",
      "natural elements with technological properties",
      "ecological processes with impossible visual manifestation",
      "environmental monitoring devices with paradoxical functions",
      "future and present states in surreal coexistence"
    ]
  },
  {
    id: "mystical",
    name: "Mystical Arts Series",
    emoji: "🎨",
    description: "Practitioners of esoteric and mystical traditions",
    keyElements: [
      "alchemical apparatus", "divinatory tools", "mystical symbols", 
      "occult implements", "spiritual artifacts"
    ],
    accessories: [
      "alchemical vessels", "celestial charts", "fortune telling implements", 
      "spiritual objects", "shamanic tools",
      "druidic artifacts", "oracle implements",
      "wizarding apparatus", "sage's scrolls", "occult manuscripts"
    ],
    conceptualThemes: [
      "mystical knowledge", "transformation", "divination", "spiritual connection", 
      "nature wisdom", "cosmic understanding", "hidden truth"
    ],
    characterTraits: [
      "enigmatic", "wise", "perceptive", "intuitive", "mysterious", "knowledgeable", "contemplative"
    ],
    promptEnhancers: [
      "where mystical implements exist in philosophical contradiction", 
      "with esoteric tools floating in impossible arrangement",
      "where visible and invisible realms merge in surreal manner",
      "in a setting where mystical processes materialize paradoxically",
      "with occult elements that transcend conventional understanding"
    ],
    magritteElements: [
      "floating mystical objects",
      "alchemical processes with impossible properties",
      "divinatory tools revealing paradoxical insights",
      "occult symbols with visual manifestations",
      "spiritual and material realms in surreal intersection"
    ]
  }
];

/**
 * Get a specific bear series by ID
 */
export function getSeriesById(id: string): BearSeriesDefinition | undefined {
  return BEAR_SERIES.find(series => series.id === id);
}

/**
 * Select a random bear series
 */
export function getRandomSeries(): BearSeriesDefinition {
  return BEAR_SERIES[Math.floor(Math.random() * BEAR_SERIES.length)];
} 