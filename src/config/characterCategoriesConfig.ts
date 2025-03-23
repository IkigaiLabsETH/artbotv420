/**
 * Character Categories Configuration
 * Comprehensive list of character categories and associated elements for rich generation
 */

/**
 * Character category definition
 */
export interface CategoryDefinition {
  id: string;                   // Unique identifier (e.g., "bear_pfp_pilot")
  name: string;                 // Display name (e.g., "Pilot Bear")
  description: string;          // Description of the character type
  series: SeriesType;           // Which series this belongs to
  accessories: string[];        // Common accessories for this type
  headwear: string[];           // Headwear options
  clothing: string[];           // Clothing options
  tools: string[];              // Tools and equipment
  personalityTraits: string[];  // Common personality traits
}

/**
 * Series types for organization
 */
export enum SeriesType {
  ADVENTURE = 'adventure',
  ARTISTIC = 'artistic',
  HIPSTER = 'hipster',
  BLOCKCHAIN = 'blockchain',
  SUSTAINABLE = 'sustainable'
}

/**
 * Character categories master list
 */
export const characterCategories: CategoryDefinition[] = [
  // Adventure Series
  {
    id: "bear_pfp_pilot",
    name: "Pilot Bear",
    description: "A distinguished bear portrait featuring a vintage aviator with leather accessories",
    series: SeriesType.ADVENTURE,
    accessories: [
      "vintage compass",
      "brass pocket watch",
      "leather-bound flight journal",
      "aviator sunglasses",
      "navigation charts"
    ],
    headwear: [
      "leather aviator cap",
      "classic pilot helmet",
      "officer's peaked cap",
      "vintage flight goggles",
      "aviator hat with ear flaps"
    ],
    clothing: [
      "vintage leather flight jacket",
      "aviator's uniform",
      "bomber jacket with fur collar",
      "air force dress uniform",
      "classic pilot jumpsuit"
    ],
    tools: [
      "brass altimeter",
      "vintage flight instruments",
      "mahogany propeller",
      "navigation slide rule",
      "morse code key"
    ],
    personalityTraits: [
      "Adventurous",
      "Precise",
      "Courageous",
      "Calculating",
      "Steadfast"
    ]
  },
  
  {
    id: "bear_pfp_mountaineer",
    name: "Mountaineer Bear",
    description: "A distinguished bear portrait featuring an alpine explorer with climbing equipment",
    series: SeriesType.ADVENTURE,
    accessories: [
      "vintage mountaineering compass",
      "leather-bound expedition journal",
      "altitude watch",
      "field binoculars",
      "topographic maps"
    ],
    headwear: [
      "classic alpine hat",
      "mountaineering beanie",
      "wool expedition cap",
      "ice climbing helmet",
      "fur-lined hood"
    ],
    clothing: [
      "vintage mountaineering coat",
      "wool expedition sweater",
      "alpine climbing vest",
      "traditional climbing knickers",
      "expedition parka with fur collar"
    ],
    tools: [
      "wooden ice axe",
      "traditional pitons",
      "hemp climbing rope",
      "brass telescope",
      "leather climbing harness"
    ],
    personalityTraits: [
      "Determined",
      "Resilient",
      "Contemplative",
      "Strategic",
      "Steadfast"
    ]
  },
  
  {
    id: "bear_pfp_diver",
    name: "Diver Bear",
    description: "A distinguished bear portrait featuring a vintage deep-sea explorer with diving equipment",
    series: SeriesType.ADVENTURE,
    accessories: [
      "brass diving gauge",
      "vintage dive watch",
      "underwater notebook",
      "dive knife",
      "hand-drawn depth charts"
    ],
    headwear: [
      "vintage brass diving helmet",
      "classic diving hood",
      "traditional diving cap",
      "antique dive mask",
      "naval diver's headgear"
    ],
    clothing: [
      "vintage diving suit",
      "traditional diver's vest",
      "naval diving uniform",
      "salvage diver's coveralls",
      "deep-sea exploration suit"
    ],
    tools: [
      "brass diving compass",
      "vintage underwater camera",
      "dive slate and pencil",
      "collection specimen jars",
      "brass-fitted dive light"
    ],
    personalityTraits: [
      "Contemplative",
      "Methodical",
      "Patient",
      "Observant",
      "Calm"
    ]
  },
  
  {
    id: "bear_pfp_sailor",
    name: "Sailor Bear",
    description: "A distinguished bear portrait featuring a maritime navigator with seafaring accessories",
    series: SeriesType.ADVENTURE,
    accessories: [
      "brass sextant",
      "nautical maps",
      "ship's log book",
      "naval telescope",
      "maritime chronometer"
    ],
    headwear: [
      "captain's peaked cap",
      "naval officer's hat",
      "classic sailor's cap",
      "maritime commander's hat",
      "traditional navy headgear"
    ],
    clothing: [
      "navy peacoat",
      "captain's dress uniform",
      "maritime officer's jacket",
      "naval commander's coat",
      "traditional sailor's uniform"
    ],
    tools: [
      "ship's wheel",
      "navigation dividers",
      "tide calculator",
      "brass barometer",
      "maritime compass"
    ],
    personalityTraits: [
      "Commanding",
      "Disciplined",
      "Weather-wise",
      "Navigational",
      "Steadfast"
    ]
  },
  
  {
    id: "bear_pfp_explorer",
    name: "Explorer Bear",
    description: "A distinguished bear portrait featuring a wilderness explorer with expedition gear",
    series: SeriesType.ADVENTURE,
    accessories: [
      "leather map case",
      "expedition journal",
      "antique field compass",
      "specimen collection box",
      "discovery medallion"
    ],
    headwear: [
      "explorer's wide-brimmed hat",
      "vintage pith helmet",
      "expedition cap",
      "wilderness fedora",
      "leather explorer's hat"
    ],
    clothing: [
      "khaki expedition jacket",
      "multi-pocketed field vest",
      "canvas exploration coat",
      "leather-patched adventure wear",
      "traditional safari jacket"
    ],
    tools: [
      "brass magnifying glass",
      "specimen collection tools",
      "expedition telescope",
      "field sketching kit",
      "butterfly net"
    ],
    personalityTraits: [
      "Curious",
      "Observant",
      "Resourceful",
      "Determined",
      "Knowledgeable"
    ]
  },
  
  // Artistic Series
  {
    id: "bear_pfp_painter",
    name: "Painter Bear",
    description: "A distinguished bear portrait featuring an artist with painterly accessories",
    series: SeriesType.ARTISTIC,
    accessories: [
      "classic palette",
      "fine sable brushes",
      "palette knife",
      "canvas stretcher",
      "color wheel"
    ],
    headwear: [
      "classic beret",
      "painterly bandana",
      "straw artist's hat",
      "bohemian scarf",
      "studio cap"
    ],
    clothing: [
      "paint-splattered smock",
      "artist's apron with brushes",
      "bohemian shirt with vest",
      "traditional linen coat",
      "studio jacket with paint stains"
    ],
    tools: [
      "antique easel",
      "paint tubes",
      "mahl stick",
      "varnish bottles",
      "charcoal and sketch pads"
    ],
    personalityTraits: [
      "Creative",
      "Perceptive",
      "Expressive",
      "Contemplative",
      "Passionate"
    ]
  },
  
  {
    id: "bear_pfp_sculptor",
    name: "Sculptor Bear",
    description: "A distinguished bear portrait featuring a sculptor with studio tools",
    series: SeriesType.ARTISTIC,
    accessories: [
      "marble dust patina",
      "sculptor's measuring calipers",
      "clay-spattered notebook",
      "artist's magnifying glass",
      "sculpture maquettes"
    ],
    headwear: [
      "sculptor's work cap",
      "clay-dusted bandana",
      "studio protective headgear",
      "classical artist's beret",
      "marble worker's head wrap"
    ],
    clothing: [
      "stone carver's apron",
      "clay studio smock",
      "traditional sculptor's coat",
      "marble dust-covered vest",
      "classical studio workwear"
    ],
    tools: [
      "fine chisels and mallets",
      "clay modeling tools",
      "plaster casting equipment",
      "patina application brushes",
      "polishing cloths"
    ],
    personalityTraits: [
      "Meticulous",
      "Visionary",
      "Patient",
      "Tactile",
      "Profound"
    ]
  },
  
  {
    id: "bear_pfp_photographer",
    name: "Photographer Bear",
    description: "A distinguished bear portrait featuring a classic photographer with camera equipment",
    series: SeriesType.ARTISTIC,
    accessories: [
      "vintage camera case",
      "exposure meter",
      "film canisters",
      "photographer's notebook",
      "contact sheet loupe"
    ],
    headwear: [
      "photographer's cap",
      "darkroom visor",
      "vintage fedora",
      "field photography hat",
      "focusing cloth"
    ],
    clothing: [
      "photographer's vest with pockets",
      "darkroom apron",
      "field jacket with lens pouches",
      "classic photography coat",
      "vintage camera strap"
    ],
    tools: [
      "vintage folding camera",
      "rangefinder camera",
      "tripod with wooden legs",
      "light meter",
      "developing equipment"
    ],
    personalityTraits: [
      "Observant",
      "Patient",
      "Deliberate",
      "Compositional",
      "Perceptive"
    ]
  },
  
  {
    id: "bear_pfp_printmaker",
    name: "Printmaker Bear",
    description: "A distinguished bear portrait featuring a traditional printmaker with ink-stained tools",
    series: SeriesType.ARTISTIC,
    accessories: [
      "ink-stained hands",
      "etching plates",
      "print registration pins",
      "printmaker's loupe",
      "edition numbering pencil"
    ],
    headwear: [
      "printmaker's protective cap",
      "ink-spattered bandana",
      "traditional printer's hat",
      "acid-room head protection",
      "press operator's cap"
    ],
    clothing: [
      "ink-stained apron",
      "lithographer's smock",
      "etcher's protective coat",
      "traditional printer's garb",
      "woodblock carver's jacket"
    ],
    tools: [
      "etching needles",
      "carving gouges",
      "brayer and ink stone",
      "printing press tools",
      "burnishing equipment"
    ],
    personalityTraits: [
      "Methodical",
      "Patient",
      "Precise",
      "Technical",
      "Artistic"
    ]
  },
  
  // Hipster Series
  {
    id: "bear_pfp_barista",
    name: "Barista Bear",
    description: "A distinguished bear portrait featuring a coffee artisan with barista accessories",
    series: SeriesType.HIPSTER,
    accessories: [
      "handcrafted coffee scale",
      "artisanal pour-over setup",
      "cupping spoon collection",
      "brewing thermometer",
      "vintage coffee grinder"
    ],
    headwear: [
      "barista's flat cap",
      "coffee-stained bandana",
      "artisanal wool beanie",
      "vintage cycling cap",
      "handmade linen cap"
    ],
    clothing: [
      "denim barista apron",
      "selvedge denim shirt",
      "hand-stitched canvas work coat",
      "vintage work vest",
      "small-batch flannel shirt"
    ],
    tools: [
      "precision tamper",
      "hand-thrown ceramic cups",
      "brass hand grinder",
      "cupping journal",
      "roasting notebook"
    ],
    personalityTraits: [
      "Meticulous",
      "Artisanal",
      "Discerning",
      "Patient",
      "Passionate"
    ]
  },
  
  {
    id: "bear_pfp_vinylista",
    name: "Vinyl Collector Bear",
    description: "A distinguished bear portrait featuring a record collector with vintage audio equipment",
    series: SeriesType.HIPSTER,
    accessories: [
      "rare vinyl records",
      "record cleaning brush",
      "anti-static mat",
      "crate digger's notebook",
      "vintage headphones"
    ],
    headwear: [
      "vintage audio brand cap",
      "record store beanie",
      "DJ headphones",
      "collector's fedora",
      "music festival bandana"
    ],
    clothing: [
      "vintage band t-shirt",
      "record shop jacket",
      "audio engineer's vest",
      "music collector's coat",
      "album-inspired outfit"
    ],
    tools: [
      "record weight",
      "album sleeves",
      "stylus microscope",
      "turntable adjustment tools",
      "liner note magnifier"
    ],
    personalityTraits: [
      "Obsessive",
      "Curatorial",
      "Detail-oriented",
      "Nostalgic",
      "Discerning"
    ]
  },
  
  {
    id: "bear_pfp_craftbrewer",
    name: "Craft Brewer Bear",
    description: "A distinguished bear portrait featuring a beer artisan with brewing equipment",
    series: SeriesType.HIPSTER,
    accessories: [
      "hop sample collection",
      "grain testing sieves",
      "beer tasting journal",
      "brewery stopwatch",
      "recipe development notebook"
    ],
    headwear: [
      "brewery work cap",
      "hop-stained bandana",
      "traditional brewing beret",
      "malt dust-covered beanie",
      "beer festival cap"
    ],
    clothing: [
      "brewery rubber apron",
      "craft beer workshirt",
      "traditional brewer's coat",
      "malt house coveralls",
      "hop garden work jacket"
    ],
    tools: [
      "mash paddle",
      "hydrometer",
      "grain mill",
      "copper brewing spoon",
      "fermentation lock"
    ],
    personalityTraits: [
      "Experimental",
      "Patient",
      "Scientific",
      "Tradition-minded",
      "Sensory"
    ]
  },
  
  // Blockchain & Web3 Series
  {
    id: "bear_pfp_defi",
    name: "DeFi Bear",
    description: "A distinguished bear portrait featuring a decentralized finance expert",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "hardware wallet necklace",
      "private key vault",
      "transaction signer",
      "multi-signature device",
      "digital asset portfolio"
    ],
    headwear: [
      "crypto trader's LED matrix glasses",
      "validator node cooling headset",
      "blockchain data visor",
      "token economist's crown",
      "smart contract analyzer"
    ],
    clothing: [
      "digital ledger jacket",
      "consensus algorithm coat",
      "protocol governance uniform",
      "zero-knowledge proof vest",
      "liquidity provider blazer"
    ],
    tools: [
      "yield optimizer",
      "governance voting panel",
      "protocol inspection lens",
      "flash loan calculator",
      "staking validator key"
    ],
    personalityTraits: [
      "Analytical",
      "Decentralized",
      "Innovative",
      "Security-focused",
      "Visionary"
    ]
  },
  
  {
    id: "bear_pfp_nftartist",
    name: "NFT Artist Bear",
    description: "A distinguished bear portrait featuring a digital art creator specializing in blockchain art",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "digital artwork display",
      "cryptographic signature device",
      "token metadata scanner",
      "virtual gallery remote",
      "rarity tracker"
    ],
    headwear: [
      "holographic AR glasses",
      "digital creator's headset",
      "metaverse access visor",
      "projection matrix crown",
      "token-gated access chip"
    ],
    clothing: [
      "digital art creator's coat",
      "holographic fabric jacket",
      "minting process display vest",
      "generative pattern shirt",
      "tokenized fashion piece"
    ],
    tools: [
      "digital stylus",
      "token minting device",
      "artwork provenance scanner",
      "digital signature pad",
      "crypto art valuation tool"
    ],
    personalityTraits: [
      "Creative",
      "Forward-thinking",
      "Digitally-native",
      "Cryptographically-minded",
      "Community-focused"
    ]
  },
  
  {
    id: "bear_pfp_validator",
    name: "Validator Bear",
    description: "A distinguished bear portrait featuring a blockchain network validator with node operation equipment",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "staking dashboard display",
      "validator key management system",
      "consensus participation medal",
      "node health monitor",
      "multi-chain tracking device"
    ],
    headwear: [
      "node cooling system headset",
      "validator status indicator cap",
      "blockchain data stream visor",
      "network security scanner",
      "consensus visualization display"
    ],
    clothing: [
      "proof-of-stake uniform",
      "validator operations jacket",
      "network security vest",
      "blockchain maintenance coat",
      "validator rewards tracker"
    ],
    tools: [
      "validator node controller",
      "consensus voting device",
      "blockchain indexing tool",
      "slashing protection shield",
      "network participation monitor"
    ],
    personalityTraits: [
      "Reliable",
      "Vigilant",
      "Technical",
      "Precise",
      "Responsible"
    ]
  },
  
  {
    id: "bear_pfp_dao",
    name: "DAO Governance Bear",
    description: "A distinguished bear portrait featuring a decentralized autonomous organization governance specialist",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "governance proposal tracker",
      "voting power indicator",
      "delegate management system",
      "treasury oversight tools",
      "governance forum badge"
    ],
    headwear: [
      "proposal voting visor",
      "governance status crown",
      "decentralized decision matrix",
      "coordination headset",
      "protocol direction analyzer"
    ],
    clothing: [
      "governance participation robe",
      "treasury steward's coat",
      "proposal author's jacket",
      "protocol stewardship uniform",
      "community governance blazer"
    ],
    tools: [
      "governance voting device",
      "quadratic voting calculator",
      "treasury simulation tool",
      "proposal impact analyzer",
      "consensus building platform"
    ],
    personalityTraits: [
      "Deliberative",
      "Collaborative",
      "Strategic",
      "Transparent",
      "Community-minded"
    ]
  },

  // Sustainable Living Series
  {
    id: "bear_pfp_urbanfarm",
    name: "Urban Farmer Bear",
    description: "A distinguished bear portrait featuring a sustainable city farmer",
    series: SeriesType.SUSTAINABLE,
    accessories: [
      "heirloom seed collection",
      "organic certification",
      "pollinator protection kit",
      "solar-powered tools",
      "rainwater collection designs"
    ],
    headwear: [
      "sustainable straw hat",
      "recycled fabric bandana",
      "solar-powered grow light visor",
      "upcycled seed cap",
      "woven natural fiber hat"
    ],
    clothing: [
      "urban farmer's overalls",
      "hemp work shirt",
      "reclaimed fabric apron",
      "vertical garden vest",
      "organic cotton work coat"
    ],
    tools: [
      "community garden plans",
      "compost tea brewer",
      "rooftop irrigation system",
      "vertical farming trellises",
      "companion planting guide"
    ],
    personalityTraits: [
      "Resourceful",
      "Community-minded",
      "Sustainable",
      "Innovative",
      "Patient"
    ]
  },
  
  {
    id: "bear_pfp_upcycler",
    name: "Upcycler Bear",
    description: "A distinguished bear portrait featuring a creative materials reuser and sustainable designer",
    series: SeriesType.SUSTAINABLE,
    accessories: [
      "salvaged material collection",
      "upcycling design sketchbook",
      "material transformation tools",
      "zero-waste certification",
      "creative reuse portfolio"
    ],
    headwear: [
      "reconstructed fabric hat",
      "upcycled material bandana",
      "repurposed object crown",
      "salvaged item headwear",
      "waste-stream diversion cap"
    ],
    clothing: [
      "reconstructed textile coat",
      "multi-source material vest",
      "repurposed fabric jacket",
      "salvaged object accessories",
      "post-consumer material outfit"
    ],
    tools: [
      "creative conversion tools",
      "material repurposing guides",
      "upcycling technique books",
      "transformation workshop tools",
      "sustainable design measurements"
    ],
    personalityTraits: [
      "Creative",
      "Resourceful",
      "Visionary",
      "Waste-conscious",
      "Transformative"
    ]
  },
  
  {
    id: "bear_pfp_ecofashion",
    name: "Eco Fashion Bear",
    description: "A distinguished bear portrait featuring a sustainable fashion designer with ecological materials",
    series: SeriesType.SUSTAINABLE,
    accessories: [
      "organic fabric swatches",
      "natural dye samples",
      "sustainable fashion portfolio",
      "ethical sourcing certificates",
      "zero-waste pattern cutouts"
    ],
    headwear: [
      "organic cotton cap",
      "plant-dyed head wrap",
      "sustainable fashion beret",
      "biodegradable designer hat",
      "upcycled textile headpiece"
    ],
    clothing: [
      "zero-waste designed coat",
      "organic fiber garments",
      "plant-dyed fashion pieces",
      "biodegradable material outfit",
      "ethically produced collection"
    ],
    tools: [
      "sustainable pattern tools",
      "natural dyeing equipment",
      "ethical fashion guidebook",
      "zero-waste cutting templates",
      "lifecycle assessment calculator"
    ],
    personalityTraits: [
      "Ethical",
      "Innovative",
      "Conscious",
      "Purposeful",
      "Visionary"
    ]
  },
  
  {
    id: "bear_pfp_repaircafe",
    name: "Repair Specialist Bear",
    description: "A distinguished bear portrait featuring a repair cafe specialist with fixing tools",
    series: SeriesType.SUSTAINABLE,
    accessories: [
      "multi-purpose repair toolkit",
      "broken item diagnostic guide",
      "repair cafe manifesto",
      "community skill-sharing badge",
      "repair documentation book"
    ],
    headwear: [
      "repair expert's cap",
      "fixer's magnifying visor",
      "technical repair headlamp",
      "protective work cap",
      "skill-sharing workshop hat"
    ],
    clothing: [
      "durable work apron",
      "multi-pocketed repair vest",
      "long-lasting utility jacket",
      "mended demonstration pieces",
      "repair cafe volunteer uniform"
    ],
    tools: [
      "precision repair instruments",
      "modular fixing devices",
      "diagnostic testing equipment",
      "sustainable repair supplies",
      "repair reference manuals"
    ],
    personalityTraits: [
      "Methodical",
      "Resourceful",
      "Patient",
      "Educational",
      "Community-minded"
    ]
  }
];

/**
 * Get a complete category by ID
 */
export function getCategoryById(id: string): CategoryDefinition | undefined {
  return characterCategories.find(category => category.id === id);
}

/**
 * Get all categories in a series
 */
export function getCategoriesBySeries(series: SeriesType): CategoryDefinition[] {
  return characterCategories.filter(category => category.series === series);
}

/**
 * Get a random category
 */
export function getRandomCategory(): CategoryDefinition {
  const randomIndex = Math.floor(Math.random() * characterCategories.length);
  return characterCategories[randomIndex];
}

/**
 * Get a random category from a specific series
 */
export function getRandomCategoryFromSeries(series: SeriesType): CategoryDefinition {
  const seriesCategories = getCategoriesBySeries(series);
  const randomIndex = Math.floor(Math.random() * seriesCategories.length);
  return seriesCategories[randomIndex];
} 