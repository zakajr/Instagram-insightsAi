import { Reel, CategoryTrend } from "./src/types";

export const SUPPORTED_ZEOGRAPHY = [
  {
    country: "United States",
    regions: ["California", "New York", "Texas", "Florida", "Pacific Northwest"]
  },
  {
    country: "United Kingdom",
    regions: ["London", "Scotland", "Manchester / North West", "Midlands"]
  },
  {
    country: "India",
    regions: ["Maharashtra (Mumbai)", "Karnataka (Bangalore)", "Delhi NCR", "Tamil Nadu"]
  },
  {
    country: "Japan",
    regions: ["Tokyo", "Kyoto", "Osaka / Kansai", "Hokkaido"]
  },
  {
    country: "Brazil",
    regions: ["São Paulo", "Rio de Janeiro", "Bahia", "Minas Gerais"]
  }
];

export const PRESET_CATEGORIES = [
  "Fitness",
  "Comedy",
  "Business & Finance",
  "Travel",
  "Fashion & Beauty",
  "Food & Dining",
  "Education & Tech",
  "Gaming",
  "Motivation & Mindset",
  "Local Culture"
];

// Helper to generate a baseline date in the last Days
function getRandomDateWithin(daysAgo: number): string {
  const date = new Date();
  const randomHours = Math.floor(Math.random() * daysAgo * 24);
  date.setHours(date.getHours() - randomHours);
  return date.toISOString();
}

// Rich preset database of Reels
export const PRESET_REELS: Reel[] = [
  // --- UNITED STATES ---
  // California
  {
    id: "us_cal_fit_1",
    caption: "Early morning beach run followed by a solid calisthenics routine. Keep pushing!",
    hashtags: ["fitnessmotivation", "californialifestyle", "beachworkout", "grindneverstops", "fitnessaesthetic"],
    audioTrend: "Summer Vibes - Remix (Trending)",
    audioOriginal: false,
    videoLength: 15,
    likes: 42500,
    comments: 1200,
    shares: 8900,
    views: 310000,
    engagementRate: 16.9,
    engagementScore: 78.5,
    category: "Fitness",
    region: "California",
    country: "United States",
    username: "fit_cali_kid",
    postedAt: getRandomDateWithin(7)
  },
  {
    id: "us_cal_com_1",
    caption: "POV: Trying to explain to a tourist why a 20-minute drive in LA takes 2 hours.",
    hashtags: ["losangeles", "trafficproblems", "funny", "relatable", "californiacomedy"],
    audioTrend: "Original Sound - LA Humor",
    audioOriginal: true,
    videoLength: 22,
    likes: 128000,
    comments: 4800,
    shares: 34000,
    views: 890000,
    engagementRate: 18.7,
    engagementScore: 92.1,
    category: "Comedy",
    region: "California",
    country: "United States",
    username: "lounge_jokes",
    postedAt: getRandomDateWithin(3)
  },
  {
    id: "us_cal_food_1",
    caption: "Is this the best matcha in San Francisco? Trying the viral lavender matcha cold foam!",
    hashtags: ["sffoodie", "matchalover", "aestheticcafe", "viralbites", "coffeeholic"],
    audioTrend: "Lo-Fi Coffee Shop Beats",
    audioOriginal: false,
    videoLength: 45,
    likes: 18300,
    comments: 320,
    shares: 4200,
    views: 125000,
    engagementRate: 18.25,
    engagementScore: 68.4,
    category: "Food & Dining",
    region: "California",
    country: "United States",
    username: "matcha_queen",
    postedAt: getRandomDateWithin(1)
  },
  {
    id: "us_cal_biz_1",
    caption: "How I bought my first duplex in California at 24 - House hacking broken down simply.",
    hashtags: ["realestateinvesting", "househacking", "financialfreedom", "californiarealestate", "wealthhacks"],
    audioTrend: "Chill Lo-Fi Hip Hop",
    audioOriginal: false,
    videoLength: 58,
    likes: 64000,
    comments: 2900,
    shares: 19500,
    views: 520000,
    engagementRate: 16.6,
    engagementScore: 84.2,
    category: "Business & Finance",
    region: "California",
    country: "United States",
    username: "fintech_connor",
    postedAt: getRandomDateWithin(12)
  },
  // New New York
  {
    id: "us_ny_trav_1",
    caption: "3 secret hidden study spots & libraries in NYC with the absolute best views of the skyline 🏙️",
    hashtags: ["newyorkcity", "hiddengems", "nycguide", "architecturelover", "travelblogger"],
    audioTrend: "Autumn Leaves Instrumental",
    audioOriginal: false,
    videoLength: 31,
    likes: 245000,
    comments: 1100,
    shares: 98000,
    views: 1850000,
    engagementRate: 18.59,
    engagementScore: 97.4,
    category: "Travel",
    region: "New York",
    country: "United States",
    username: "wander_nyc",
    postedAt: getRandomDateWithin(5)
  },
  {
    id: "us_ny_fash_1",
    caption: "Thrifting in Brooklyn - Finding 90s vintage leather jackets in Williamsburg!",
    hashtags: ["nycfashion", "thriftshop", "brooklynstyle", "vintagefinds", "fitcheck"],
    audioTrend: "Synthwave Grooves - Sunset",
    audioOriginal: false,
    videoLength: 29,
    likes: 83000,
    comments: 940,
    shares: 11200,
    views: 610000,
    engagementRate: 15.6,
    engagementScore: 81.3,
    category: "Fashion & Beauty",
    region: "New York",
    country: "United States",
    username: "street_runway",
    postedAt: getRandomDateWithin(4)
  },
  {
    id: "us_ny_cul_1",
    caption: "Ordering a bagel in New York style. If you don't say 'Lox with cc on a toasted everything' you are doing it wrong.",
    hashtags: ["nycbagel", "newyorkculture", "eatingnewyork", "localvibes", "bagelshop"],
    audioTrend: "Original Sound - NY Street Scenes",
    audioOriginal: true,
    videoLength: 18,
    likes: 312000,
    comments: 8700,
    shares: 61000,
    views: 2400000,
    engagementRate: 15.9,
    engagementScore: 98.2,
    category: "Local Culture",
    region: "New York",
    country: "United States",
    username: "empire_statesman",
    postedAt: getRandomDateWithin(2)
  },

  // --- UNITED KINGDOM ---
  // London
  {
    id: "uk_lon_com_1",
    caption: "Polite passive aggressiveness in London commuter trains is an art form. The 'excuse me' cough is legendary.",
    hashtags: ["londonlife", "britishhumour", "comedyreels", "relatable", "tubecommute"],
    audioTrend: "Inquisitive Violin Theme",
    audioOriginal: false,
    videoLength: 26,
    likes: 95000,
    comments: 3100,
    shares: 24000,
    views: 730000,
    engagementRate: 16.7,
    engagementScore: 87.5,
    category: "Comedy",
    region: "London",
    country: "United Kingdom",
    username: "parliament_giggle",
    postedAt: getRandomDateWithin(4)
  },
  {
    id: "uk_lon_trav_1",
    caption: "Rainy London afternoon aesthetic 🌧️ Walking through Chelsea with a perfect cup of tea.",
    hashtags: ["londonwalk", "rainydays", "englandtravel", "cottagecorevibes", "chelsealondon"],
    audioTrend: "Soft Rainy Jazz Piano",
    audioOriginal: false,
    videoLength: 14,
    likes: 112000,
    comments: 850,
    shares: 15000,
    views: 920000,
    engagementRate: 13.9,
    engagementScore: 83.1,
    category: "Travel",
    region: "London",
    country: "United Kingdom",
    username: "rainy_londoner",
    postedAt: getRandomDateWithin(1)
  },
  {
    id: "uk_lon_fash_1",
    caption: "What people are wearing in Soho today. The preppy trench coat or technical gorpcore is taking over.",
    hashtags: ["londonfashion", "sohostyle", "streetwearuk", "gorpcore", "mensweardaily"],
    audioTrend: "Deep House Rhythm - Soho Beat",
    audioOriginal: false,
    videoLength: 40,
    likes: 72000,
    comments: 480,
    shares: 8300,
    views: 490000,
    engagementRate: 16.48,
    engagementScore: 80.9,
    category: "Fashion & Beauty",
    region: "London",
    country: "United Kingdom",
    username: "tweed_and_sneakers",
    postedAt: getRandomDateWithin(6)
  },
  // Scotland
  {
    id: "uk_sco_trav_1",
    caption: "Driving through the Isle of Skye under heavy fog. Felt like entering a fantasy realm.",
    hashtags: ["scotlandtravel", "isleofskye", "roadtripuk", "naturephotography", "mistyvibe"],
    audioTrend: "Celtic Harp & Piper Symphony",
    audioOriginal: false,
    videoLength: 30,
    likes: 185000,
    comments: 2050,
    shares: 55000,
    views: 1150000,
    engagementRate: 21.0,
    engagementScore: 96.6,
    category: "Travel",
    region: "Scotland",
    country: "United Kingdom",
    username: "highland_roamer",
    postedAt: getRandomDateWithin(10)
  },

  // --- INDIA ---
  // Maharashtra (Mumbai)
  {
    id: "in_mum_cul_1",
    caption: "POV: Trying your first cutting chai and vada pav at midnight near CST station. 🫖🍔",
    hashtags: ["mumbaistreetfood", "mumbaikar", "vadapav", "cuttingchai", "localculture"],
    audioTrend: "Mumbai Local Instrumental Loop",
    audioOriginal: true,
    videoLength: 19,
    likes: 410000,
    comments: 11200,
    shares: 135000,
    views: 2900000,
    engagementRate: 19.17,
    engagementScore: 99.8,
    category: "Local Culture",
    region: "Maharashtra (Mumbai)",
    country: "India",
    username: "mumbai_food_traveler",
    postedAt: getRandomDateWithin(2)
  },
  {
    id: "in_mum_com_1",
    caption: "Every software engineer when they try to catch the 8:45 slow train from Thane to Kurla.",
    hashtags: ["mumbailocal", "corporatecomedy", "techhumor", "mumbaijob", "relatablelife"],
    audioTrend: "Dramatic Bollywood Tension SFX",
    audioOriginal: false,
    videoLength: 24,
    likes: 185000,
    comments: 4500,
    shares: 72000,
    views: 1200000,
    engagementRate: 21.79,
    engagementScore: 95.9,
    category: "Comedy",
    region: "Maharashtra (Mumbai)",
    country: "India",
    username: "mumbai_dev_memes",
    postedAt: getRandomDateWithin(5)
  },
  {
    id: "in_mum_motivation_1",
    caption: "The spirit of Mumbai: Meet 75-year-old Ramu who has been delivering Dabbas since 1970 without a single misdelivery.",
    hashtags: ["mumbaiddabbawala", "motivationoftheday", "resilience", "indianheroes", "reallifehero"],
    audioTrend: "Emotional Flute & Sitar Harmony",
    audioOriginal: false,
    videoLength: 50,
    likes: 295000,
    comments: 9800,
    shares: 89000,
    views: 1900000,
    engagementRate: 20.73,
    engagementScore: 98.4,
    category: "Motivation & Mindset",
    region: "Maharashtra (Mumbai)",
    country: "India",
    username: "legends_of_india",
    postedAt: getRandomDateWithin(8)
  },
  // Karnataka (Bangalore)
  {
    id: "in_blr_edu_1",
    caption: "Top 5 AI tools that will save you 20 hours of coding every single week. Highly practical guide!",
    hashtags: ["bangaloretech", "codinglifestyle", "softwaredeveloper", "aitoolbox", "productivityhacks"],
    audioTrend: "Cyberpunk Electronic Wave",
    audioOriginal: false,
    videoLength: 42,
    likes: 145000,
    comments: 3100,
    shares: 110000,
    views: 1400000,
    engagementRate: 18.4,
    engagementScore: 93.5,
    category: "Education & Tech",
    region: "Karnataka (Bangalore)",
    country: "India",
    username: "tech_with_karthik",
    postedAt: getRandomDateWithin(3)
  },
  {
    id: "in_blr_food_1",
    caption: "Filtering filter coffee the right way at 6:30 AM in Jayanagar. Perfection exists.",
    hashtags: ["filtercoffee", "bangalorecafes", "southindianbreakfast", "foodpornin", "morningroutine"],
    audioTrend: "Morning Carnatic Sitar Beats",
    audioOriginal: false,
    videoLength: 20,
    likes: 92000,
    comments: 1100,
    shares: 24000,
    views: 590000,
    engagementRate: 19.8,
    engagementScore: 86.4,
    category: "Food & Dining",
    region: "Karnataka (Bangalore)",
    country: "India",
    username: "kaapi_culture",
    postedAt: getRandomDateWithin(1)
  },

  // --- JAPAN ---
  // Tokyo
  {
    id: "jp_tok_trav_1",
    caption: "Shinjuku at 2:00 AM under rainy neon lights. Capturing the beautiful retro cyberpunk atmosphere. 🌧️👾",
    hashtags: ["tokyonight", "tokyotravel", "cyberpunkaesthetic", "shinjuku", "japanvlog"],
    audioTrend: "Lo-Fi Instrumental - Shibuya Midnight",
    audioOriginal: false,
    videoLength: 12,
    likes: 540000,
    comments: 3100,
    shares: 165000,
    views: 3100000,
    engagementRate: 22.8,
    engagementScore: 99.9,
    category: "Travel",
    region: "Tokyo",
    country: "Japan",
    username: "tokyo_stardust",
    postedAt: getRandomDateWithin(4)
  },
  {
    id: "jp_tok_food_1",
    caption: "Trying the 10-yen cheese coins in Akihabara. Look at that massive cheese pull! 🧀🪙",
    hashtags: ["tokyofood", "akihabara", "cheeselover", "japanesestreetfood", "reelsjapan"],
    audioTrend: "Cute Pastel Synth Chiptune",
    audioOriginal: false,
    videoLength: 25,
    likes: 122000,
    comments: 1900,
    shares: 27000,
    views: 950000,
    engagementRate: 15.89,
    engagementScore: 84.1,
    category: "Food & Dining",
    region: "Tokyo",
    country: "Japan",
    username: "kawaii_eats",
    postedAt: getRandomDateWithin(2)
  },
  {
    id: "jp_tok_game_1",
    caption: "Touring a $15,000 custom retro gaming setup in Akihabara's tallest nerd building.",
    hashtags: ["gamingsetup", "retrogaming", "tokyotech", "gamersofjapan", "playstationclassic"],
    audioTrend: "Epic Retro Gaming Brass Remix",
    audioOriginal: false,
    videoLength: 55,
    likes: 198000,
    comments: 3500,
    shares: 44000,
    views: 1540000,
    engagementRate: 15.94,
    engagementScore: 91.2,
    category: "Gaming",
    region: "Tokyo",
    country: "Japan",
    username: "pixel_samurai",
    postedAt: getRandomDateWithin(6)
  },
  // Kyoto
  {
    id: "jp_kyo_cul_1",
    caption: "Walking through Arashiyama bamboo path at sunrise before the crowds arrive. Pure zen. 🎋🌱",
    hashtags: ["kyotoheritage", "bamboogrove", "zenmindset", "kyototravel", "traditionaljapan"],
    audioTrend: "Traditional Shakuhachi Bamboo Flute Solo",
    audioOriginal: false,
    videoLength: 18,
    likes: 245000,
    comments: 1400,
    shares: 72000,
    views: 1350000,
    engagementRate: 23.58,
    engagementScore: 97.2,
    category: "Local Culture",
    region: "Kyoto",
    country: "Japan",
    username: "kyoto_moments",
    postedAt: getRandomDateWithin(5)
  },

  // --- BRAZIL ---
  // São Paulo
  {
    id: "br_sp_food_1",
    caption: "Reviewing the most loaded Mortadela sandwich in Mercado Municipal. It weighs almost 1 kilogram! 🥪🤩",
    hashtags: ["saopaulofoodie", "mercadomunicipal", "mortadelasandwich", "comidabrasileira", "rolepaulistano"],
    audioTrend: "Upbeat Pagode & Samba Live Drumming",
    audioOriginal: true,
    videoLength: 35,
    likes: 112000,
    comments: 3100,
    shares: 46000,
    views: 930000,
    engagementRate: 17.3,
    engagementScore: 88.9,
    category: "Food & Dining",
    region: "São Paulo",
    country: "Brazil",
    username: "paulistando_com_fome",
    postedAt: getRandomDateWithin(3)
  },
  {
    id: "br_sp_fash_1",
    caption: "Thrifting vintage gems at Beco do Batman street art market. Insane streetwear style!",
    hashtags: ["thriftbrasil", "becodobatman", "streetwearbr", "fashionbrasil", "modasustentavel"],
    audioTrend: "Brazilian Phonk Remix (Trending)",
    audioOriginal: false,
    videoLength: 44,
    likes: 54000,
    comments: 650,
    shares: 11000,
    views: 410000,
    engagementRate: 16.0,
    engagementScore: 78.4,
    category: "Fashion & Beauty",
    region: "São Paulo",
    country: "Brazil",
    username: "garimpo_urbano",
    postedAt: getRandomDateWithin(2)
  },
  // Rio de Janeiro
  {
    id: "br_rio_trav_1",
    caption: "Carioca lifestyle: Catching the golden sunset from Arpoador stone in Ipanema. Clapping included 👏🌊🌅",
    hashtags: ["riodejaneiro", "ipanemabeach", "pordesol", "carioca", "travelbrazil"],
    audioTrend: "Bossa Nova Chill Classical Sabor",
    audioOriginal: false,
    videoLength: 15,
    likes: 380000,
    comments: 5400,
    shares: 142000,
    views: 2100000,
    engagementRate: 25.09,
    engagementScore: 99.1,
    category: "Travel",
    region: "Rio de Janeiro",
    country: "Brazil",
    username: "carioca_sunsets",
    postedAt: getRandomDateWithin(1)
  },
  {
    id: "br_rio_fit_1",
    caption: "Beachside volleyball and bodyweight training in Copacabana. Energy is unmatchable!",
    hashtags: ["copacabanabeach", "beachworkout", "futevoleibrasil", "riofit", "fitnessmotivation"],
    audioTrend: "Energetic Rio Funk Beats",
    audioOriginal: false,
    videoLength: 21,
    likes: 164000,
    comments: 1800,
    shares: 31000,
    views: 1100000,
    engagementRate: 17.89,
    engagementScore: 89.2,
    category: "Fitness",
    region: "Rio de Janeiro",
    country: "Brazil",
    username: "rj_maromba",
    postedAt: getRandomDateWithin(5)
  }
];

// Dynamically updates category metrics based on some filter options
export function computeTrendsAndCategoryStats(reels: Reel[], timeRange: '24h' | '7d' | '30d'): CategoryTrend[] {
  // Group reels by category
  const categoriesMap: { [cat: string]: Reel[] } = {};
  PRESET_CATEGORIES.forEach(cat => {
    categoriesMap[cat] = [];
  });
  
  reels.forEach(r => {
    if (!categoriesMap[r.category]) {
      categoriesMap[r.category] = [];
    }
    categoriesMap[r.category].push(r);
  });

  const categoryStats: CategoryTrend[] = [];

  Object.entries(categoriesMap).forEach(([cat, catReels]) => {
    if (catReels.length === 0) {
      // Add empty fallback so we keep a clean layout
      categoryStats.push({
        category: cat,
        reelsCount: 0,
        totalViews: 0,
        avgEngagementRate: 0,
        growth24h: 0,
        growth7d: 0,
        growth30d: 0,
        topHashtags: [],
        topAudio: "No active audio found",
        description: `Instagram Reels about ${cat}`,
        sentiment: 'neutral'
      });
      return;
    }

    const totalViews = catReels.reduce((sum, r) => sum + r.views, 0);
    const totalEngRate = catReels.reduce((sum, r) => sum + r.engagementRate, 0);
    const avgEngRate = parseFloat((totalEngRate / catReels.length).toFixed(2));

    // Get hashtags summary
    const hashCounts: { [tag: string]: number } = {};
    catReels.forEach(r => {
      r.hashtags.forEach(tag => {
        hashCounts[tag] = (hashCounts[tag] || 0) + 1;
      });
    });
    const sortedHashs = Object.entries(hashCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 3);

    // Get top audio
    const audioCounts: { [aud: string]: number } = {};
    catReels.forEach(r => {
      audioCounts[r.audioTrend] = (audioCounts[r.audioTrend] || 0) + 1;
    });
    const topAudio = Object.entries(audioCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])[0] || "Original Sound";

    // Build growth trends based on static hashes combined with timeRange triggers
    // We calibrate high growth for specific trend topics for realism
    let growth24h = Math.floor(Math.random() * 25) - 5; // -5% to +20%
    let growth7d = Math.floor(Math.random() * 60) + 5;   // +5% to +65%
    let growth30d = Math.floor(Math.random() * 150) + 15; // +15% to +165%

    // Make certain items explode intentionally
    if (cat === "Travel") {
      growth24h += 12;
      growth7d += 25;
      growth30d += 42;
    } else if (cat === "Comedy" || cat === "Local Culture") {
      growth24h += 18;
      growth7d += 35;
      growth30d += 60;
    }

    // Determine sentiment badge
    let sentiment: 'positive' | 'neutral' | 'highly_active' | 'explosive' = 'neutral';
    const growthVal = timeRange === '24h' ? growth24h : timeRange === '7d' ? growth7d : growth30d;
    if (growthVal > 50) sentiment = 'explosive';
    else if (growthVal > 25) sentiment = 'highly_active';
    else if (growthVal > 0) sentiment = 'positive';

    categoryStats.push({
      category: cat,
      reelsCount: catReels.length,
      totalViews,
      avgEngagementRate: avgEngRate,
      growth24h,
      growth7d,
      growth30d,
      topHashtags: sortedHashs.length > 0 ? sortedHashs : [cat.toLowerCase()],
      topAudio,
      description: `Trending audio waves & high-impact visual formats in ${cat}`,
      sentiment
    });
  });

  // Sort overall categories by views / popularity by default
  return categoryStats.sort((a, b) => b.totalViews - a.totalViews);
}
