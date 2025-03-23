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
  ACADEMIC = 'academic',
  HIPSTER = 'hipster',
  MYSTICAL = 'mystical',
  STEAMPUNK = 'steampunk',
  CLASSICAL = 'classical',
  DIPLOMATIC = 'diplomatic',
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
  
  // Academic Series
  {
    id: "bear_pfp_professor",
    name: "Professor Bear",
    description: "A distinguished bear portrait featuring an academic with scholarly accessories",
    series: SeriesType.ACADEMIC,
    accessories: [
      "antique fountain pen",
      "leather notebook",
      "polished magnifying glass",
      "pocket watch",
      "academic seal"
    ],
    headwear: [
      "mortarboard cap",
      "reading glasses",
      "tweed flat cap",
      "velvet academic tam",
      "scholarly beret"
    ],
    clothing: [
      "tweed jacket with elbow patches",
      "academic robes",
      "formal waistcoat and bow tie",
      "corduroy jacket",
      "departmental scarf"
    ],
    tools: [
      "antique books",
      "scrolled diploma",
      "brass telescope",
      "scientific measuring devices",
      "globe of antiquity"
    ],
    personalityTraits: [
      "Erudite",
      "Analytical",
      "Methodical",
      "Philosophical",
      "Curious"
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
  
  // Mystical Series
  {
    id: "bear_pfp_alchemist",
    name: "Alchemist Bear",
    description: "A distinguished bear portrait featuring an alchemist with mystical accessories",
    series: SeriesType.MYSTICAL,
    accessories: [
      "philosopher's stone pendant",
      "celestial charts",
      "crystal vials",
      "astrological compass",
      "ancient grimoire"
    ],
    headwear: [
      "alchemist's hood",
      "stargazer's cap",
      "midnight blue veil",
      "mystical crown",
      "third eye circlet"
    ],
    clothing: [
      "mystical robe with symbols",
      "alchemist's apron",
      "star-patterned cloak",
      "celestial vestments",
      "transformation coat"
    ],
    tools: [
      "alchemical apparatus",
      "mortar and pestle",
      "scales of balance",
      "element vessels",
      "transformation crucible"
    ],
    personalityTraits: [
      "Enigmatic",
      "Visionary",
      "Esoteric",
      "Patient",
      "Intuitive"
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