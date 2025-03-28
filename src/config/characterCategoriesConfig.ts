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
  
  {
    id: "bear_pfp_surfer",
    name: "Surfer Bear",
    description: "A distinguished bear portrait featuring a retro surf culture enthusiast with classic board",
    series: SeriesType.ADVENTURE,
    accessories: [
      "vintage surf wax",
      "shell necklace",
      "retro tide watch",
      "classic surf magazine",
      "wave forecasting chart"
    ],
    headwear: [
      "surf culture bandana",
      "vintage lifeguard cap",
      "classic surf hat",
      "retro surfing visor",
      "sun-bleached flat cap"
    ],
    clothing: [
      "vintage surf poncho",
      "classic striped wetsuit",
      "retro boardshorts",
      "surf culture jacket",
      "traditional surfer's shirt"
    ],
    tools: [
      "handcrafted longboard",
      "vintage fin system",
      "classic leash",
      "antique surf wax comb",
      "traditional surf compass"
    ],
    personalityTraits: [
      "Free-spirited",
      "Patient",
      "Balanced",
      "Wave-wise",
      "Harmonious"
    ]
  },
  
  {
    id: "bear_pfp_astronaut",
    name: "Astronaut Bear",
    description: "A distinguished bear portrait featuring a space explorer with specialized equipment",
    series: SeriesType.ADVENTURE,
    accessories: [
      "star chart",
      "mission patch collection",
      "space navigation device",
      "gravity measurement tool",
      "cosmic radiation monitor"
    ],
    headwear: [
      "vintage space helmet",
      "mission commander's cap",
      "spacewalk visor",
      "communication headset",
      "lunar exploration headgear"
    ],
    clothing: [
      "classic space suit",
      "mission flight jacket",
      "pressure garment",
      "thermal protection layer",
      "space agency uniform"
    ],
    tools: [
      "celestial navigation equipment",
      "specimen collection containers",
      "space telescope",
      "gravity measurement device",
      "experimental propulsion module"
    ],
    personalityTraits: [
      "Meticulous",
      "Courageous",
      "Scientific",
      "Visionary",
      "Resourceful"
    ]
  },
  
  {
    id: "bear_pfp_polarexplorer",
    name: "Polar Explorer Bear",
    description: "A distinguished bear portrait featuring an arctic expedition leader with specialized gear",
    series: SeriesType.ADVENTURE,
    accessories: [
      "polar route map",
      "expedition chronometer",
      "aurora observation journal",
      "ice core sample container",
      "polar climate measurement tools"
    ],
    headwear: [
      "fur-lined expedition hat",
      "traditional arctic hood",
      "polar research cap",
      "snow goggles",
      "thermal insulated headgear"
    ],
    clothing: [
      "traditional fur parka",
      "expedition snow suit",
      "polar research uniform",
      "arctic expedition jacket",
      "traditional inuit-inspired coat"
    ],
    tools: [
      "ice measurement equipment",
      "traditional snow shoes",
      "polar navigation compass",
      "aurora research spectrometer",
      "ice core drilling equipment"
    ],
    personalityTraits: [
      "Resilient",
      "Methodical",
      "Enduring",
      "Observant",
      "Wilderness-wise"
    ]
  },
  
  {
    id: "bear_pfp_freediver",
    name: "Freediver Bear",
    description: "A distinguished bear portrait featuring a breath-hold diving specialist with monofin",
    series: SeriesType.ADVENTURE,
    accessories: [
      "depth gauge watch",
      "marine life identification chart",
      "breath training journal",
      "underwater navigation tools",
      "marine conservation badge"
    ],
    headwear: [
      "low-volume dive mask",
      "traditional diving hood",
      "streamlined swim cap",
      "freediving nose clip",
      "marine biologist's cap"
    ],
    clothing: [
      "classic freediving wetsuit",
      "gradient camouflage suit",
      "traditional breath-hold diver's jacket",
      "marine conservationist vest",
      "underwater photographer's gear"
    ],
    tools: [
      "carbon fiber monofin",
      "underwater camera housing",
      "dive computer",
      "marine specimen collection bag",
      "underwater photography lights"
    ],
    personalityTraits: [
      "Focused",
      "Serene",
      "Patient",
      "Deep-thinking",
      "Harmonious"
    ]
  },
  
  // Adventure Series - Additional Categories
  {
    id: "bear_pfp_snowboarder",
    name: "Snowboarder Bear",
    description: "A distinguished bear portrait featuring a winter sports enthusiast with vintage goggles and gear",
    series: SeriesType.ADVENTURE,
    accessories: [
      "vintage ski resort map",
      "competition medals",
      "snow condition journal",
      "mountain pass identification",
      "avalanche safety card"
    ],
    headwear: [
      "vintage ski goggles",
      "winter sports beanie",
      "retro snowboard helmet",
      "classic winter cap",
      "mountain lodge headband"
    ],
    clothing: [
      "vintage snowboard jacket",
      "retro winter sports outfit",
      "classic mountain wear",
      "thermal expedition layer",
      "alpine competition uniform"
    ],
    tools: [
      "vintage snowboard",
      "hand-carved wax applicator",
      "slope angle measure",
      "traditional binding tools",
      "avalanche safety equipment"
    ],
    personalityTraits: [
      "Adventurous",
      "Balanced",
      "Fearless",
      "Mountain-wise",
      "Free-spirited"
    ]
  },
  
  {
    id: "bear_pfp_skater",
    name: "Skater Bear",
    description: "A distinguished bear portrait featuring a vintage skateboard culture enthusiast with classic board",
    series: SeriesType.ADVENTURE,
    accessories: [
      "vintage skateboard deck",
      "classic skate magazine",
      "retro skate stickers",
      "competition medals",
      "skate spot map"
    ],
    headwear: [
      "classic skater's helmet",
      "vintage flat cap",
      "retro skate brand cap",
      "bandana",
      "old-school headphones"
    ],
    clothing: [
      "vintage skate team jacket",
      "classic skate brand t-shirt",
      "padded skate vest",
      "retro knee pads",
      "classic skate shoes"
    ],
    tools: [
      "skateboard maintenance kit",
      "wheel change tools",
      "grip tape cutter",
      "skatepark blueprint",
      "ramp design chart"
    ],
    personalityTraits: [
      "Adventurous",
      "Independent",
      "Persistent",
      "Creative",
      "Nonconformist"
    ]
  },
  
  {
    id: "bear_pfp_cyclist",
    name: "Cyclist Bear",
    description: "A distinguished bear portrait featuring a classic cycling enthusiast with vintage gear",
    series: SeriesType.ADVENTURE,
    accessories: [
      "classic cycling cap",
      "vintage route map",
      "team water bottle",
      "historic race medal",
      "traditional cycling gloves"
    ],
    headwear: [
      "vintage cycling cap",
      "classic wool team hat",
      "traditional tour cap",
      "leather strap helmet",
      "cycling club visor"
    ],
    clothing: [
      "vintage wool cycling jersey",
      "classic team racing kit",
      "traditional cycling jacket",
      "historic team colors",
      "vintage cycling pants"
    ],
    tools: [
      "classic steel frame bicycle",
      "traditional leather tool kit",
      "vintage bicycle pump",
      "historic race manual",
      "traditional route marker flags"
    ],
    personalityTraits: [
      "Enduring",
      "Strategic",
      "Disciplined",
      "Detail-oriented",
      "Tradition-minded"
    ]
  },
  
  {
    id: "bear_pfp_caver",
    name: "Cave Explorer Bear",
    description: "A distinguished bear portrait featuring a spelunking specialist with mapping tools and headlamp",
    series: SeriesType.ADVENTURE,
    accessories: [
      "cave survey notebook",
      "underground mineral samples",
      "cave system maps",
      "expedition log",
      "subterranean ecology guide"
    ],
    headwear: [
      "spelunker's headlamp",
      "cave explorer's helmet",
      "subterranean safety cap",
      "mining-inspired headwear",
      "crystal cave protective gear"
    ],
    clothing: [
      "cave exploration suit",
      "spelunking coveralls",
      "subterranean expedition jacket",
      "moisture-resistant garments",
      "cave environment protection wear"
    ],
    tools: [
      "cave mapping equipment",
      "specialized survey tools",
      "climbing carabiners",
      "underground navigation device",
      "specialized rope systems"
    ],
    personalityTraits: [
      "Methodical",
      "Patient",
      "Detail-oriented",
      "Adventurous",
      "Contemplative"
    ]
  },
  
  {
    id: "bear_pfp_racer",
    name: "Racing Bear",
    description: "A distinguished bear portrait featuring a vintage motorsport enthusiast with leather racing gear",
    series: SeriesType.ADVENTURE,
    accessories: [
      "vintage racing goggles",
      "classic racing gloves",
      "track map collection",
      "competition medallions",
      "race timing device"
    ],
    headwear: [
      "vintage racing helmet",
      "classic driver's cap",
      "motorsport headgear",
      "protective racing headwear",
      "speed record headpiece"
    ],
    clothing: [
      "classic racing leather jacket",
      "vintage driver's suit",
      "traditional motorsport uniform",
      "speed record attempt gear",
      "historic racing team colors"
    ],
    tools: [
      "vintage steering wheel",
      "mechanical stopwatch",
      "traditional lap counter",
      "classic racing tool kit",
      "mechanical engine tester"
    ],
    personalityTraits: [
      "Focused",
      "Precise",
      "Strategic",
      "Speed-conscious",
      "Competitive"
    ]
  },
  
  {
    id: "bear_pfp_alpinist",
    name: "Alpinist Bear",
    description: "A distinguished bear portrait featuring an alpine climbing specialist with technical gear",
    series: SeriesType.ADVENTURE,
    accessories: [
      "alpine summit log",
      "mountain first ascent records",
      "climbing chalk bag",
      "mountain range panoramic map",
      "traditional climbing pegs"
    ],
    headwear: [
      "alpine climbing helmet",
      "mountain summit cap",
      "cold weather climbing hood",
      "alpinist's protective headwear",
      "traditional climbing headgear"
    ],
    clothing: [
      "technical climbing jacket",
      "alpine expedition suit",
      "traditional mountaineering attire",
      "summit attempt layers",
      "mountain windbreaker"
    ],
    tools: [
      "traditional ice axe",
      "alpinist rope system",
      "classic climbing cams",
      "summit navigation tools",
      "high-alpine protection gear"
    ],
    personalityTraits: [
      "Determined",
      "Strategic",
      "Methodical",
      "Self-reliant",
      "Mountain-wise"
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
  
  {
    id: "bear_pfp_musician",
    name: "Musician Bear",
    description: "A distinguished bear portrait featuring a jazz musician with classic instrument",
    series: SeriesType.ARTISTIC,
    accessories: [
      "vintage sheet music",
      "custom instrument case",
      "metronome",
      "composition notebook",
      "performance medallion"
    ],
    headwear: [
      "jazz performer's cap",
      "classic musician's beret",
      "vintage stage fedora",
      "composer's signature hat",
      "orchestra member's cap"
    ],
    clothing: [
      "performer's tailcoat",
      "jazz club suit",
      "concert attire",
      "vintage performance vest",
      "musician's formal wear"
    ],
    tools: [
      "handcrafted saxophone",
      "vintage trumpet",
      "classic double bass",
      "antique piano keys",
      "conductor's baton"
    ],
    personalityTraits: [
      "Expressive",
      "Rhythmic",
      "Improvisational",
      "Passionate",
      "Harmonious"
    ]
  },
  
  {
    id: "bear_pfp_architect",
    name: "Architect Bear",
    description: "A distinguished bear portrait featuring a modernist designer with drafting tools",
    series: SeriesType.ARTISTIC,
    accessories: [
      "blueprint case",
      "scale ruler",
      "architectural references",
      "design awards",
      "building model"
    ],
    headwear: [
      "modernist glasses",
      "architectural beret",
      "site visit hard hat",
      "designer's cap",
      "drafting visor"
    ],
    clothing: [
      "black turtleneck",
      "modernist suit",
      "architectural studio coat",
      "design firm blazer",
      "site inspection jacket"
    ],
    tools: [
      "drafting compass",
      "technical pens",
      "precision scale ruler",
      "building measurement tools",
      "architectural model supplies"
    ],
    personalityTraits: [
      "Visionary",
      "Precise",
      "Spatial",
      "Structural",
      "Innovative"
    ]
  },
  
  {
    id: "bear_pfp_glassblower",
    name: "Glassblower Bear",
    description: "A distinguished bear portrait featuring a glass artist with specialized tools",
    series: SeriesType.ARTISTIC,
    accessories: [
      "glass color samples",
      "heat-resistant gloves",
      "design sketches",
      "annealing schedule",
      "glass formula notebook"
    ],
    headwear: [
      "heat-resistant work cap",
      "glassblower's bandana",
      "protective eyewear",
      "traditional studio headwear",
      "furnace worker's hat"
    ],
    clothing: [
      "heat-resistant work jacket",
      "traditional glass studio apron",
      "flame-resistant smock",
      "handmade artisan vest",
      "historic glasshouse uniform"
    ],
    tools: [
      "handcrafted blowpipe",
      "glass shears",
      "marver plate",
      "punty rod",
      "glass gathering tools"
    ],
    personalityTraits: [
      "Patient",
      "Heat-wise",
      "Precise",
      "Balanced",
      "Tradition-minded"
    ]
  },
  
  {
    id: "bear_pfp_digitalartist",
    name: "Digital Artist Bear",
    description: "A distinguished bear portrait featuring a digital art pioneer with creative technology",
    series: SeriesType.ARTISTIC,
    accessories: [
      "digital portfolio display",
      "stylus collection",
      "interactive art reference",
      "creative algorithm notebook",
      "digital exhibition invitations"
    ],
    headwear: [
      "digital creator's visor",
      "studio headphones",
      "augmented reality glasses",
      "virtual workspace headset",
      "projection interface cap"
    ],
    clothing: [
      "minimalist design coat",
      "digital studio jacket",
      "computational fashion piece",
      "creative technologist vest",
      "digital art lab coat"
    ],
    tools: [
      "custom digital pen",
      "haptic feedback device",
      "algorithmic generation tools",
      "interactive display tablet",
      "digital art visualization system"
    ],
    personalityTraits: [
      "Innovative",
      "Technical",
      "Futuristic",
      "Boundary-pushing",
      "Visionary"
    ]
  },
  
  // Artistic Series - Additional Categories
  {
    id: "bear_pfp_poet",
    name: "Poet Bear",
    description: "A distinguished bear portrait featuring a bohemian writer with notebook and traditional pen",
    series: SeriesType.ARTISTIC,
    accessories: [
      "leather-bound poetry journal",
      "collection of classic poems",
      "writer's inspiration trinkets",
      "poetry competition medals",
      "literary society membership"
    ],
    headwear: [
      "poetic bohemian beret",
      "writer's slouch cap",
      "literary society hat",
      "contemplative poet's headwear",
      "author's signature cap"
    ],
    clothing: [
      "bohemian poet's jacket",
      "artistic writer's attire",
      "literary salon outfit",
      "contemplative author's wear",
      "poetic tradition-inspired clothes"
    ],
    tools: [
      "vintage fountain pen",
      "handcrafted writing desk",
      "antique ink well",
      "poetry composition guides",
      "writer's reference books"
    ],
    personalityTraits: [
      "Contemplative",
      "Expressive",
      "Observant",
      "Thoughtful",
      "Emotionally deep"
    ]
  },
  
  {
    id: "bear_pfp_dancer",
    name: "Ballet Dancer Bear",
    description: "A distinguished bear portrait featuring a classical ballet performer with traditional tutu",
    series: SeriesType.ARTISTIC,
    accessories: [
      "performance program",
      "ballet competition medals",
      "choreography notes",
      "theater access passes",
      "performance schedule"
    ],
    headwear: [
      "ballet performance tiara",
      "classical dance headpiece",
      "rehearsal hair band",
      "swan lake crown",
      "dancer's formal headwear"
    ],
    clothing: [
      "classical ballet tutu",
      "rehearsal outfit",
      "performance costume",
      "traditional dancer's attire",
      "ballet company uniform"
    ],
    tools: [
      "ballet slippers",
      "dance floor rosin box",
      "performance soundtrack",
      "choreography notation book",
      "stretching equipment"
    ],
    personalityTraits: [
      "Graceful",
      "Disciplined",
      "Expressive",
      "Perfectionist",
      "Artistic"
    ]
  },
  
  {
    id: "bear_pfp_filmmaker",
    name: "Filmmaker Bear",
    description: "A distinguished bear portrait featuring a director with vintage camera and film equipment",
    series: SeriesType.ARTISTIC,
    accessories: [
      "director's screenplay",
      "film festival badges",
      "shot composition guide",
      "film reel collection",
      "movie production schedule"
    ],
    headwear: [
      "director's beret",
      "filmmaker's cap",
      "vintage camera headstrap",
      "production headset",
      "classic cinema-inspired hat"
    ],
    clothing: [
      "director's jacket",
      "film set vest with pockets",
      "cinematographer's outfit",
      "production team attire",
      "classic filmmaker's clothes"
    ],
    tools: [
      "vintage film camera",
      "director's viewfinder",
      "clapperboard",
      "editing equipment",
      "storyboard sketches"
    ],
    personalityTraits: [
      "Visionary",
      "Detail-oriented",
      "Expressive",
      "Commanding",
      "Storytelling"
    ]
  },
  
  {
    id: "bear_pfp_woodblock",
    name: "Woodblock Artist Bear",
    description: "A distinguished bear portrait featuring a traditional woodblock print master with carving tools",
    series: SeriesType.ARTISTIC,
    accessories: [
      "woodblock print collection",
      "print technique manual",
      "edition numbering journal",
      "traditional art society membership",
      "print exhibition invitations"
    ],
    headwear: [
      "traditional printer's cap",
      "woodblock artist's bandana",
      "carving protection headwear",
      "print studio headpiece",
      "ink-stained work cap"
    ],
    clothing: [
      "traditional printer's uniform",
      "woodblock carver's apron",
      "ink-stained work clothes",
      "print studio jacket",
      "traditional artisan wear"
    ],
    tools: [
      "carved wooden blocks",
      "traditional carving tools",
      "natural pigment set",
      "baren printing disk",
      "handmade paper stack"
    ],
    personalityTraits: [
      "Patient",
      "Precise",
      "Traditional",
      "Detailed",
      "Methodical"
    ]
  },
  
  {
    id: "bear_pfp_jeweler",
    name: "Jeweler Bear",
    description: "A distinguished bear portrait featuring a jewelry maker with precious gems and precision tools",
    series: SeriesType.ARTISTIC,
    accessories: [
      "gemstone collection",
      "jewelry design sketchbook",
      "precision scale",
      "goldsmith's certificates",
      "gem authentication documents"
    ],
    headwear: [
      "jeweler's loupe headband",
      "precision work cap",
      "gemstone appraiser's visor",
      "traditional goldsmith's headwear",
      "craftsman's protective eyewear"
    ],
    clothing: [
      "jeweler's precision apron",
      "gemstone handler's coat",
      "traditional goldsmith's uniform",
      "fine craftsmanship jacket",
      "metal working protective wear"
    ],
    tools: [
      "precision jeweler's tools",
      "gemstone setting equipment",
      "metal working instruments",
      "polishing wheels",
      "precious metal testing kit"
    ],
    personalityTraits: [
      "Meticulous",
      "Precise",
      "Detail-oriented",
      "Patient",
      "Perfectionistic"
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
  
  {
    id: "bear_pfp_botanist",
    name: "Botanist Bear",
    description: "A distinguished bear portrait featuring a plant enthusiast with specialized terrarium",
    series: SeriesType.HIPSTER,
    accessories: [
      "rare seed collection",
      "plant identification guide",
      "botanical journal",
      "humidity measurement tools",
      "specimen preservation kit"
    ],
    headwear: [
      "botanical sun hat",
      "greenhouse visor",
      "plant explorer's cap",
      "specimen collection bandana",
      "botanical society hat"
    ],
    clothing: [
      "botanical work shirt",
      "greenhouse apron",
      "plant society vest",
      "expedition-inspired jacket",
      "specimen collection coat"
    ],
    tools: [
      "precision pruning shears",
      "handcrafted terrarium",
      "botanical illustration supplies",
      "seedling propagation tools",
      "microclimate measurement device"
    ],
    personalityTraits: [
      "Nurturing",
      "Patient",
      "Observant",
      "Cataloguing",
      "Growth-minded"
    ]
  },
  
  {
    id: "bear_pfp_mixologist",
    name: "Mixologist Bear",
    description: "A distinguished bear portrait featuring a craft cocktail creator with specialized tools",
    series: SeriesType.HIPSTER,
    accessories: [
      "bitters collection",
      "recipe journal",
      "artisanal ice molds",
      "botanical infusion jars",
      "vintage cocktail books"
    ],
    headwear: [
      "mixologist's newsboy cap",
      "speakeasy-inspired hat",
      "craft bartender's cap",
      "prohibition-era headwear",
      "distillery tour hat"
    ],
    clothing: [
      "classic bartender's vest",
      "craft cocktail apron",
      "prohibition-era attire",
      "speakeasy-inspired outfit",
      "botanical mixology jacket"
    ],
    tools: [
      "handcrafted cocktail shaker",
      "precision jigger",
      "artisanal bar spoon",
      "small-batch botanical infuser",
      "hand-carved ice tools"
    ],
    personalityTraits: [
      "Precise",
      "Creative",
      "Hospitable",
      "Experimental",
      "Flavor-focused"
    ]
  },
  
  {
    id: "bear_pfp_bookshop",
    name: "Bookshop Bear",
    description: "A distinguished bear portrait featuring an independent bookstore owner with literary accessories",
    series: SeriesType.HIPSTER,
    accessories: [
      "first edition collection",
      "book recommendation journal",
      "author-signed memorabilia",
      "reading list catalog",
      "rare bookmark collection"
    ],
    headwear: [
      "bookshop reading glasses",
      "literary festival cap",
      "author society hat",
      "publishing house beanie",
      "book club visor"
    ],
    clothing: [
      "independent bookstore cardigan",
      "literary-themed vest",
      "small publisher's jacket",
      "book fair attire",
      "rare book dealer's coat"
    ],
    tools: [
      "book classification system",
      "first edition verification tools",
      "author event planning notebook",
      "book repair kit",
      "literary society membership cards"
    ],
    personalityTraits: [
      "Well-read",
      "Curatorial",
      "Contemplative",
      "Community-minded",
      "Literary"
    ]
  },
  
  {
    id: "bear_pfp_sourdough",
    name: "Sourdough Baker Bear",
    description: "A distinguished bear portrait featuring an artisanal bread baker with traditional tools",
    series: SeriesType.HIPSTER,
    accessories: [
      "sourdough starter jar",
      "fermentation schedule",
      "flour variety collection",
      "heritage grain samples",
      "bread scoring designs"
    ],
    headwear: [
      "baker's linen cap",
      "flour-dusted bandana",
      "traditional baker's hat",
      "bread guild cap",
      "artisanal bakery beret"
    ],
    clothing: [
      "traditional baker's apron",
      "heritage bakery coat",
      "flour-dusted work shirt",
      "artisanal bakery vest",
      "bread craftsman uniform"
    ],
    tools: [
      "handcrafted banneton basket",
      "traditional scoring lame",
      "wooden bread peel",
      "fermentation monitoring tools",
      "heritage grain mill"
    ],
    personalityTraits: [
      "Patient",
      "Nurturing",
      "Traditional",
      "Methodical",
      "Community-focused"
    ]
  },
  
  // Hipster Series - Additional Categories
  {
    id: "bear_pfp_vintagegame",
    name: "Vintage Game Collector Bear",
    description: "A distinguished bear portrait featuring a retro game enthusiast with classic consoles and cartridges",
    series: SeriesType.HIPSTER,
    accessories: [
      "rare game cartridge collection",
      "gaming magazine archive",
      "retro console catalog",
      "game preservation guide",
      "pixel art design book"
    ],
    headwear: [
      "vintage gaming headset",
      "retro developer cap",
      "classic gaming tournament visor",
      "pixel art branded beanie",
      "arcade champion crown"
    ],
    clothing: [
      "vintage game developer jacket",
      "retro arcade uniform",
      "classic console brand shirt",
      "gaming competition vest",
      "pixelated design outfit"
    ],
    tools: [
      "game restoration kit",
      "cartridge repair equipment",
      "console modification tools",
      "game testing devices",
      "preservation storage system"
    ],
    personalityTraits: [
      "Nostalgic",
      "Detail-oriented",
      "Preservationist",
      "Technological",
      "Community-minded"
    ]
  },
  
  {
    id: "bear_pfp_apiarist",
    name: "Urban Beekeeper Bear",
    description: "A distinguished bear portrait featuring an urban apiculturist with hive tools and honey production",
    series: SeriesType.HIPSTER,
    accessories: [
      "urban honey variety samples",
      "bee population tracking journal",
      "hive management calendar",
      "honey production awards",
      "pollinator habitat maps"
    ],
    headwear: [
      "traditional beekeeper's hat",
      "urban apiarist veil",
      "protective mesh headwear",
      "honey harvester's cap",
      "pollinator conservation headpiece"
    ],
    clothing: [
      "traditional beekeeper suit",
      "urban apiary jacket",
      "honey harvesting overalls",
      "bee-friendly gardener's outfit",
      "artisanal honey producer's uniform"
    ],
    tools: [
      "handcrafted smoker",
      "traditional hive tools",
      "honey extraction equipment",
      "urban apiary blueprints",
      "bee health testing kit"
    ],
    personalityTraits: [
      "Patient",
      "Nurturing",
      "Observant",
      "Ecological",
      "Methodical"
    ]
  },
  
  {
    id: "bear_pfp_teasmith",
    name: "Tea Ceremony Master Bear",
    description: "A distinguished bear portrait featuring a traditional tea ceremony specialist with ceremonial tools",
    series: SeriesType.HIPSTER,
    accessories: [
      "rare tea collection",
      "ceremonial tea journal",
      "tasting evaluation notes",
      "traditional ceremony scroll",
      "tea master certification"
    ],
    headwear: [
      "tea master's cap",
      "ceremonial headwear",
      "traditional tea house hat",
      "meditation practice headpiece",
      "tea garden sun visor"
    ],
    clothing: [
      "traditional tea ceremony robes",
      "tea master's formal attire",
      "ceremonial practice garments",
      "tea garden work clothes",
      "tasting session uniform"
    ],
    tools: [
      "handcrafted tea whisk",
      "ceremonial tea bowls",
      "traditional heating vessel",
      "bamboo water ladle",
      "tea ceremony tatami mat"
    ],
    personalityTraits: [
      "Centered",
      "Mindful",
      "Disciplined",
      "Harmonious",
      "Tradition-honoring"
    ]
  },
  
  {
    id: "bear_pfp_analogphoto",
    name: "Analog Photography Bear",
    description: "A distinguished bear portrait featuring a film photography artist with vintage cameras and darkroom equipment",
    series: SeriesType.HIPSTER,
    accessories: [
      "rare film collection",
      "vintage camera manual",
      "film development journal",
      "photo exhibition catalogs",
      "analog technique guides"
    ],
    headwear: [
      "darkroom protective cap",
      "film photographer's beret",
      "light meter headband",
      "camera strap harness",
      "focusing cloth"
    ],
    clothing: [
      "darkroom apron",
      "film photographer's vest",
      "chemical-resistant lab coat",
      "vintage camera workshop jacket",
      "analog enthusiast uniform"
    ],
    tools: [
      "vintage large format camera",
      "traditional film developing tanks",
      "darkroom enlarger",
      "chemical mixing station",
      "printing easel and trays"
    ],
    personalityTraits: [
      "Patient",
      "Methodical",
      "Detail-oriented",
      "Process-minded",
      "Artistic"
    ]
  },
  
  {
    id: "bear_pfp_letterpress",
    name: "Letterpress Bear",
    description: "A distinguished bear portrait featuring a traditional printing press artist with type and ink",
    series: SeriesType.HIPSTER,
    accessories: [
      "metal type collection",
      "letterpress sample book",
      "print registration guides",
      "paper stock samples",
      "typography manuals"
    ],
    headwear: [
      "printer's cap",
      "ink-stained bandana",
      "traditional press operator's hat",
      "typesetter's visor",
      "print shop headwear"
    ],
    clothing: [
      "traditional printer's apron",
      "letterpress shop coat",
      "ink-stained work clothes",
      "type drawer carrier vest",
      "paper handling overalls"
    ],
    tools: [
      "vintage printing press",
      "lead type set",
      "composing stick",
      "ink brayer",
      "paper cutter"
    ],
    personalityTraits: [
      "Precise",
      "Patient",
      "Traditional",
      "Detail-oriented",
      "Craftsman-minded"
    ]
  },
  
  // Blockchain Series
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
  
  {
    id: "bear_pfp_cryptominer",
    name: "Crypto Miner Bear",
    description: "A distinguished bear portrait featuring a cryptocurrency mining operation specialist",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "mining hash rate monitor",
      "blockchain reward calculator",
      "power efficiency analyzer",
      "mining pool membership badge",
      "hardware performance charts"
    ],
    headwear: [
      "miner's cooling headset",
      "heat dissipation cap",
      "hashrate monitoring visor",
      "overclocking specialist's goggles",
      "mining farm supervisor hat"
    ],
    clothing: [
      "mining operation jacket",
      "hardware maintenance uniform",
      "cooling system technician vest",
      "power management coat",
      "blockchain mining suit"
    ],
    tools: [
      "mining rig diagnostic kit",
      "specialized cooling equipment",
      "power consumption optimizer",
      "hardware tuning devices",
      "blockchain node connectivity tools"
    ],
    personalityTraits: [
      "Persistent",
      "Technical",
      "Methodical",
      "Efficiency-minded",
      "Resourceful"
    ]
  },
  
  {
    id: "bear_pfp_metaverse",
    name: "Metaverse Architect Bear",
    description: "A distinguished bear portrait featuring a virtual world designer and builder",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "virtual land deed collection",
      "metaverse mapping system",
      "digital asset portfolio",
      "virtual world accessibility tools",
      "cross-platform integration guides"
    ],
    headwear: [
      "VR development headset",
      "virtual world designer's visor",
      "metaverse exploration goggles",
      "spatial computing interface",
      "digital realm architect's crown"
    ],
    clothing: [
      "cross-platform design coat",
      "virtual identity specialist's jacket",
      "metaverse builder's uniform",
      "digital reality architect's vest",
      "virtual world navigation suit"
    ],
    tools: [
      "virtual space modeling devices",
      "metaverse integration tools",
      "digital physics simulator",
      "virtual architecture software",
      "cross-platform experience designer"
    ],
    personalityTraits: [
      "Imaginative",
      "Boundary-pushing",
      "Spatial",
      "Interconnected",
      "Future-focused"
    ]
  },
  
  {
    id: "bear_pfp_smartcontract",
    name: "Smart Contract Developer Bear",
    description: "A distinguished bear portrait featuring a blockchain code specialist with development tools",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "code repository access card",
      "security audit results",
      "gas optimization metrics",
      "contract deployment checklist",
      "blockchain developer conference badges"
    ],
    headwear: [
      "debugging visor",
      "code optimization glasses",
      "blockchain IDE headset",
      "security mindset cap",
      "gas-efficient coding hat"
    ],
    clothing: [
      "developer hackathon jacket",
      "code review coat",
      "immutable deployment uniform",
      "blockchain engineer's vest",
      "decentralized application builder's attire"
    ],
    tools: [
      "secure coding environment",
      "contract testing framework",
      "formal verification tools",
      "blockchain deployment panel",
      "version control system"
    ],
    personalityTraits: [
      "Precise",
      "Security-conscious",
      "Logical",
      "Methodical",
      "Innovative"
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
  },
  
  {
    id: "bear_pfp_zerowaste",
    name: "Zero Waste Bear",
    description: "A distinguished bear portrait featuring a sustainable living enthusiast with waste reduction tools",
    series: SeriesType.SUSTAINABLE,
    accessories: [
      "package-free shopping kit",
      "waste audit journal",
      "home composting guide",
      "plastic-free alternatives collection",
      "community zero-waste initiative badges"
    ],
    headwear: [
      "natural fiber cap",
      "plastic-free awareness bandana",
      "waste reduction advocate's hat",
      "compost education visor",
      "community clean-up headwear"
    ],
    clothing: [
      "long-lasting sustainable uniform",
      "minimal-waste designed jacket",
      "naturally dyed durable coat",
      "plastic-free advocate's vest",
      "repaired and reinforced clothing"
    ],
    tools: [
      "reusable container collection",
      "home composting tools",
      "biodegradable packaging alternatives",
      "waste stream separation system",
      "DIY cleaning product equipment"
    ],
    personalityTraits: [
      "Mindful",
      "Systematic",
      "Resourceful",
      "Determined",
      "Community-oriented"
    ]
  },
  
  {
    id: "bear_pfp_permaculture",
    name: "Permaculture Designer Bear",
    description: "A distinguished bear portrait featuring a sustainable ecosystem designer with natural systems tools",
    series: SeriesType.SUSTAINABLE,
    accessories: [
      "permaculture design certificate",
      "ecological system mapping tools",
      "natural patterns reference guide",
      "water flow observation notebook",
      "soil health testing kit"
    ],
    headwear: [
      "wide-brimmed field hat",
      "natural systems observer's cap",
      "practical permaculturist's headwear",
      "ecosystem designer's visor",
      "plant guild identifier hat"
    ],
    clothing: [
      "many-pocketed field vest",
      "practical design work coat",
      "natural fiber earth worker's jacket",
      "durable implementation uniform",
      "season-appropriate layered attire"
    ],
    tools: [
      "a-frame level",
      "swale design templates",
      "plant guild charts",
      "sector analysis tools",
      "earthworks surveying equipment"
    ],
    personalityTraits: [
      "Observant",
      "Ecological",
      "Systems-minded",
      "Patient",
      "Regenerative"
    ]
  },
  
  {
    id: "bear_pfp_renewableenergy",
    name: "Renewable Energy Bear",
    description: "A distinguished bear portrait featuring a sustainable energy specialist with alternative power tools",
    series: SeriesType.SUSTAINABLE,
    accessories: [
      "solar power calculator",
      "wind assessment tools",
      "energy independence planning guide",
      "small-scale renewable models",
      "off-grid system designs"
    ],
    headwear: [
      "solar technician's cap",
      "wind engineer's helmet",
      "hydro specialist's protective headwear",
      "energy assessor's visor",
      "renewables researcher's headset"
    ],
    clothing: [
      "solar installer's vest",
      "wind turbine technician's jacket",
      "hydro system designer's coat",
      "battery storage specialist's uniform",
      "sustainable energy consultant's attire"
    ],
    tools: [
      "energy audit equipment",
      "solar angle optimizer",
      "wind speed measurement devices",
      "battery storage calculators",
      "microhydro assessment kit"
    ],
    personalityTraits: [
      "Technical",
      "Forward-thinking",
      "Analytical",
      "Solution-oriented",
      "Self-sufficient"
    ]
  },
  
  // Blockchain Series - Additional Categories
  {
    id: "bear_pfp_hodler",
    name: "HODL Bear",
    description: "A distinguished bear portrait featuring a long-term cryptocurrency investor with cold storage devices",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "early bitcoin whitepaper",
      "vintage crypto conference badges",
      "market cycle charts",
      "investment thesis journal",
      "crypto industry pioneer photos"
    ],
    headwear: [
      "diamond hands crown",
      "long-term investor cap",
      "crypto winter survivor hat",
      "bull market celebration headpiece",
      "blockchain pioneer headwear"
    ],
    clothing: [
      "relaxed hodler's jacket",
      "long-term investor vest",
      "crypto conference hoodie",
      "blockchain early adopter shirt",
      "patient investor uniform"
    ],
    tools: [
      "hardware wallet collection",
      "seed phrase storage system",
      "private key backup devices",
      "cold storage solution",
      "secure recovery system"
    ],
    personalityTraits: [
      "Patient",
      "Long-term focused",
      "Conviction-driven",
      "Resilient",
      "Community-oriented"
    ]
  },
  
  {
    id: "bear_pfp_dapp",
    name: "DApp Developer Bear",
    description: "A distinguished bear portrait featuring a decentralized application developer with coding tools",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "smart contract architecture diagrams",
      "decentralized protocol whitepapers",
      "dapp user experience wireframes",
      "developer hackathon medals",
      "blockchain optimization research"
    ],
    headwear: [
      "web3 developer's headset",
      "decentralized builder's cap",
      "smart contract debugging visor",
      "protocol engineer's headwear",
      "blockchain coder's thinking cap"
    ],
    clothing: [
      "dapp developer's jacket",
      "smart contract engineer attire",
      "decentralized protocol builder coat",
      "web3 hackathon uniform",
      "blockchain development suit"
    ],
    tools: [
      "decentralized development environment",
      "smart contract testing framework",
      "blockchain node simulator",
      "protocol optimization tools",
      "dapp user interface builder"
    ],
    personalityTraits: [
      "Innovative",
      "Technical",
      "Solution-oriented",
      "Decentralized-thinking",
      "Community-focused"
    ]
  },
  
  {
    id: "bear_pfp_tokenomics",
    name: "Tokenomics Designer Bear",
    description: "A distinguished bear portrait featuring a token economy architect with economic models and distribution charts",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "token distribution models",
      "economic incentive diagrams",
      "game theory textbook",
      "token velocity research",
      "governance mechanism comparisons"
    ],
    headwear: [
      "token economist's thinking cap",
      "incentive design crown",
      "mechanism design helmet",
      "governance architect's headwear",
      "economic model visor"
    ],
    clothing: [
      "token architect's formal jacket",
      "economic designer's attire",
      "incentive structures lab coat",
      "game theorist's vest",
      "distribution modeling uniform"
    ],
    tools: [
      "token simulation software",
      "economic modeling tools",
      "distribution visualization system",
      "governance structure designer",
      "incentive alignment calculator"
    ],
    personalityTraits: [
      "Analytical",
      "Strategic",
      "Balanced",
      "System-oriented",
      "Forward-thinking"
    ]
  },
  
  {
    id: "bear_pfp_onchain",
    name: "On-Chain Analyst Bear",
    description: "A distinguished bear portrait featuring a blockchain data expert with visualization tools and metrics",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "blockchain transaction patterns",
      "network visualization models",
      "address clustering research",
      "on-chain metric dashboard",
      "data analysis journal"
    ],
    headwear: [
      "blockchain data visor",
      "data analyst's headset",
      "on-chain visualization glasses",
      "metrics monitoring crown",
      "pattern recognition headwear"
    ],
    clothing: [
      "data visualization jacket",
      "on-chain analyst uniform",
      "blockchain pattern recognition coat",
      "network flow modeling vest",
      "metrics researcher attire"
    ],
    tools: [
      "blockchain explorer interface",
      "on-chain pattern visualization system",
      "transaction flow analyzer",
      "wallet clustering software",
      "metric correlation detector"
    ],
    personalityTraits: [
      "Analytical",
      "Pattern-recognizing",
      "Detail-oriented",
      "Methodical",
      "Insightful"
    ]
  },
  
  {
    id: "bear_pfp_tradfi",
    name: "TradFi Bridge Bear",
    description: "A distinguished bear portrait featuring a financial expert bridging traditional and crypto finance",
    series: SeriesType.BLOCKCHAIN,
    accessories: [
      "regulatory framework guides",
      "institutional adoption roadmap",
      "compliance procedure manual",
      "crypto-asset classification system",
      "cross-industry integration models"
    ],
    headwear: [
      "financial bridge builder's cap",
      "institutional adoption crown",
      "regulatory navigation headset",
      "cross-industry connector headwear",
      "integration specialist visor"
    ],
    clothing: [
      "institutional bridge jacket",
      "traditional finance ambassador suit",
      "regulatory navigation uniform",
      "cross-industry connector blazer",
      "market integration formal wear"
    ],
    tools: [
      "compliance framework builder",
      "institutional onboarding system",
      "regulatory navigation maps",
      "market integration platforms",
      "cross-industry translation guide"
    ],
    personalityTraits: [
      "Diplomatic",
      "Integrative",
      "Strategic",
      "Balanced",
      "Forward-thinking"
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