import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load local environmental variables if any
dotenv.config();

import { 
  PRESET_REELS, 
  SUPPORTED_ZEOGRAPHY, 
  PRESET_CATEGORIES, 
  computeTrendsAndCategoryStats 
} from "./server-data";
import { Reel, CategoryTrend, InsightReport } from "./src/types";

// Safety check for starting
const app = express();
app.use(express.json({ limit: '10mb' })); // ensure base64/heavy datasets parse fine

// Store processed custom user-uploaded reels in-memory for the duration of the dev-session
let globalCustomReels: Reel[] = [];

// Lazy API Key checker
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// -------------------------------------------------------------
// DETERMINISTIC CLASSIFICATION FALLBACK
// -------------------------------------------------------------
function fallbackClassification(caption: string, hashtags: string[]): string {
  const text = `${caption} ${hashtags.join(" ")}`.toLowerCase();
  
  if (text.includes("workout") || text.includes("fit") || text.includes("gym") || text.includes("protein") || text.includes("lift")) {
    return "Fitness";
  }
  if (text.includes("funny") || text.includes("joke") || text.includes("pov") || text.includes("comedy") || text.includes("skit") || text.includes("lol")) {
    return "Comedy";
  }
  if (text.includes("money") || text.includes("finance") || text.includes("crypto") || text.includes("stock") || text.includes("invest") || text.includes("business")) {
    return "Business & Finance";
  }
  if (text.includes("travel") || text.includes("trip") || text.includes("beach") || text.includes("hiddengem") || text.includes("island") || text.includes("hotel")) {
    return "Travel";
  }
  if (text.includes("outfit") || text.includes("thrift") || text.includes("makeup") || text.includes("style") || text.includes("fashion") || text.includes("beauty")) {
    return "Fashion & Beauty";
  }
  if (text.includes("food") || text.includes("recipe") || text.includes("cafe") || text.includes("eat") || text.includes("matcha") || text.includes("dining")) {
    return "Food & Dining";
  }
  if (text.includes("code") || text.includes("tech") || text.includes("ai") || text.includes("learn") || text.includes("study") || text.includes("education")) {
    return "Education & Tech";
  }
  if (text.includes("gamin") || text.includes("twitch") || text.includes("setup") || text.includes("streamer") || text.includes("playstation")) {
    return "Gaming";
  }
  if (text.includes("mindset") || text.includes("motivation") || text.includes("discipline") || text.includes("growth") || text.includes("resilience")) {
    return "Motivation & Mindset";
  }
  return "Local Culture";
}

// -------------------------------------------------------------
// CORE API ROUTES
// -------------------------------------------------------------

// 1. Get geography zones and category configuration templates
app.get("/api/reels/static-data", (req, res) => {
  res.json({
    geography: SUPPORTED_ZEOGRAPHY,
    categories: PRESET_CATEGORIES
  });
});

// 2. Perform deep segmented metric calculations based on selections
app.post("/api/reels/analyze", (req, res) => {
  const { country, region, customZone, timeRange } = req.body;

  // Gather preset data
  let activePool = [...PRESET_REELS];

  // If we have custom session uploads, merge them!
  if (globalCustomReels.length > 0) {
    activePool = [...globalCustomReels, ...activePool];
  }

  // Filter based on options
  let filteredReels = activePool;

  if (customZone && customZone.trim().length > 0) {
    // Keyword match on custom zone phrase inside captions, hashtags or region
    const searchStr = customZone.trim().toLowerCase();
    filteredReels = activePool.filter(r => 
      r.caption.toLowerCase().includes(searchStr) || 
      r.hashtags.some(h => h.toLowerCase().includes(searchStr)) ||
      r.region.toLowerCase().includes(searchStr)
    );
  } else {
    // Default country filter
    if (country) {
      filteredReels = filteredReels.filter(r => r.country.toLowerCase() === country.toLowerCase());
    }
    // Optional region filter
    if (region && region.toLowerCase() !== "all regions") {
      filteredReels = filteredReels.filter(r => r.region.toLowerCase() === region.toLowerCase());
    }
  }

  // Calculate trends
  const categoryStats = computeTrendsAndCategoryStats(filteredReels, timeRange);

  // Core KPIs aggregation
  const totalReels = filteredReels.length;
  const totalViews = filteredReels.reduce((sum, r) => sum + r.views, 0);
  const totalLikes = filteredReels.reduce((sum, r) => sum + r.likes, 0);
  const totalComments = filteredReels.reduce((sum, r) => sum + r.comments, 0);
  const totalShares = filteredReels.reduce((sum, r) => sum + r.shares, 0);

  const avgEngagementOfPool = totalViews > 0 
    ? parseFloat((((totalLikes + totalComments + totalShares) / totalViews) * 100).toFixed(2))
    : 0;

  // Identify growth leaders or viral topics
  const withValidStats = categoryStats.filter(c => c.reelsCount > 0);
  const sortedByGrowth = [...withValidStats].sort((a, b) => {
    const growthA = timeRange === '24h' ? a.growth24h : timeRange === '7d' ? a.growth7d : a.growth30d;
    const growthB = timeRange === '24h' ? b.growth24h : timeRange === '7d' ? b.growth7d : b.growth30d;
    return growthB - growthA;
  });

  const growthLeader = sortedByGrowth[0]?.category || "None";
  const topCategory = [...withValidStats].sort((a, b) => b.totalViews - a.totalViews)[0]?.category || "Local Culture";

  res.json({
    reels: filteredReels,
    categoryStats,
    summaryKpis: {
      totalViews,
      avgEngagement: avgEngagementOfPool,
      totalReels,
      growthLeader,
      topCategory
    }
  });
});

// 3. AI Insights synthesis endpoint (uses Gemini)
// -------------------------------------------------------------
// DYNAMIC AI FALLBACK ENGINES
// -------------------------------------------------------------
function generateFallbackInsights(country: string, region: string, kpis: any, categorySummaries: any[]) {
  const activeZone = region && region !== "All Regions" ? region : country;
  
  // Sort categorySummaries to find the highest velocity (growth) category
  const sortedByGrowth = [...(categorySummaries || [])].sort((a, b) => {
    const growthA = b.growth7d || 0;
    const growthB = a.growth7d || 0;
    return growthA - growthB;
  });
  const leaderItem = sortedByGrowth[0];
  const leaderCategory = leaderItem?.category || "Comedy";
  const leaderGrowth = leaderItem ? leaderItem.growth7d : 28;
  
  // Find top category by views
  const sortedByViews = [...(categorySummaries || [])].sort((a, b) => b.totalViews - a.totalViews);
  const topItem = sortedByViews[0];
  const topCategory = topItem?.category || "Local Culture";
  const topViewsNum = topItem ? topItem.totalViews : 500000;
  
  const formatViewsLocal = (views: number) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(0) + "K";
    return views.toString();
  };

  return [
    {
      id: "fallback_1",
      type: "trend",
      title: `VIRAL SPIKE IN ${leaderCategory.toUpperCase()}`,
      text: `${leaderCategory} content is experiencing a massive audience surge across ${activeZone} with a dynamic velocity spike of +${leaderGrowth}% in organic reach.`,
      growth: leaderGrowth,
      categoryBound: leaderCategory,
      generatedAt: new Date().toISOString()
    },
    {
      id: "fallback_2",
      type: "info",
      title: "PEAK ENGAGEMENT EFFICIENCY",
      text: `${topCategory} continues to retain market dominance with ${formatViewsLocal(topViewsNum)} views under current filters, driving a robust segment average of ${kpis?.avgEngagement || 14.5}% reader interaction level.`,
      categoryBound: topCategory,
      generatedAt: new Date().toISOString()
    },
    {
      id: "fallback_3",
      type: "warning",
      title: "RETENTION CORRECTION NOTICE",
      text: "Standard template structures are flagging a notable drop in early-retention performance. Focus on a visual hook within the first 2 seconds to retain momentum.",
      generatedAt: new Date().toISOString()
    }
  ];
}

function generateFallbackConcepts(category: string, region: string, country: string) {
  const activeZone = region && region !== "All Regions" ? region : country;
  return [
    {
      id: "concept_fb_1",
      title: `THE ${category.toUpperCase()} 'EXPECTATION VS REALITY' COLD OPEN`,
      hookText: `They told you to do this for ${category}, but try this instead...`,
      description: `Highlight a standard cliché in ${category} matching the local lifestyle of ${activeZone}, and flip it with subtle humor in the first 3 seconds to trigger comments.`,
      recommendedAudio: "Upbeat Phonk Beat or Sarcastic Synth Overlay",
      executionTip: "Begin with an extreme close-up visual crop before snapping out to wide frame. Use high contrast colors."
    },
    {
      id: "concept_fb_2",
      title: `THE 3-SECOND LOCAL SECRET HACK`,
      hookText: `My absolute favorite hidden gatekept hack for ${category} in ${activeZone}...`,
      description: `Share an ultra-niche, highly specific hidden regional secret that directly relates to ${category}. Great for scaling bookmarks and shares.`,
      recommendedAudio: "Chill Lo-Fi Instrumental or Coffee Shop Vibe",
      executionTip: "Utilize brief text blocks styled in warm, high-contrast colors. Keep total reel duration under 16 seconds."
    }
  ];
}

app.post("/api/reels/ai-insights", async (req, res) => {
  const { country, region, kpis, categorySummaries } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    const fallbackInsights = generateFallbackInsights(country, region, kpis, categorySummaries);
    return res.json({
      fallback: true,
      leakedKey: false,
      insights: fallbackInsights
    });
  }

  try {
    const statsSummary = JSON.stringify({ kpis, categorySummaries });
    const prompt = `
      You are an expert Social Audience Analyst specializing in Instagram Reels trends.
      Analyze the current engagement statistics for this target zone: "${region || country}".
      
      Here is the aggregated data summary: ${statsSummary}.
      
      Generate exactly 3 extremely actionable, highly creative marketing Insights Reports.
      Each insight report must map to standard visual categories we analyze (Fitness, Travel, Food & Dining, Comedy, Local Culture, Business & Finance, Education & Tech).
      Ensure they have realistic, localized commentary matching the vibe of "${region || country}".
      
      Return the output as a clean, strictly compliant JSON array of objects fitting this Typescript interface:
      interface InsightReport {
        id: string; // unique random id
        type: 'success' | 'warning' | 'info' | 'trend';
        title: string; // short dramatic catchphrase, keep it literal and professional (avoid over-hype words)
        text: string; // concise insight explanation (max 2 sentences) including growth statistics if relevant
        growth?: number; // integer representing growth percentage if a trend
        categoryBound?: string; // a matching category from the list above
        generatedAt: string; // current timestamp ISO string
      }
      Do NOT embed code blocks, quotes, or markdown wrappers. Just return raw JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an analytical, data-driven strategist. Avoid generic marketing buzzwords; specify precise creative trends.",
      }
    });

    const text = response.text || "[]";
    const insights = JSON.parse(text.trim());
    res.json({ fallback: false, leakedKey: false, insights });

  } catch (err: any) {
    console.error("Gemini AI Insights Error:", err);
    
    // Check if the key is reportedly leaked, or permission denied
    const errString = err?.message || JSON.stringify(err) || "";
    const isLeaked = errString.includes("leaked") || errString.includes("PERMISSION_DENIED") || err?.status === 403;
    
    const fallbackInsights = generateFallbackInsights(country, region, kpis, categorySummaries);
    res.json({ 
      fallback: true, 
      leakedKey: isLeaked, 
      insights: fallbackInsights,
      errorMessage: errString
    });
  }
});

// 4. Custom Hook Creator Assistant endpoint (uses Gemini)
app.post("/api/reels/suggest-concept", async (req, res) => {
  const { category, region, country } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    const fallbackConcepts = generateFallbackConcepts(category, region, country);
    return res.json({ fallback: true, leakedKey: false, concepts: fallbackConcepts });
  }

  try {
    const prompt = `
      Create 3 hyper-targeted, highly viral and specific Instagram Reels content concepts for the category "${category}" targeting the location "${region || country}".
      Ensure the concepts incorporate actual localized trends, cultural aspects of "${region || country}", and relatable situations.
      
      Return raw JSON of an array with exactly 3 objects:
      [
        {
          "id": "string",
          "title": "string", // engaging concept title
          "hookText": "string", // exact words text overlay that should flash on screen in first 2 seconds
          "description": "string", // visual storyline overview
          "recommendedAudio": "string", // style of audio/music to select
          "executionTip": "string" // key editing, camera angle, or text styling tip
        }
      ]
      Do NOT wrap in markdown, code blocks, or custom tags. Raw JSON response.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a top-tier viral instagram consultant with precise knowledge of soundscapes, formatting rules, and visual pacing."
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "[]");
    res.json({ fallback: false, leakedKey: false, concepts: parsed });
  } catch (err: any) {
    console.error("Gemini Hook Creator Error:", err);
    
    // Check if the key is reportedly leaked, or permission denied
    const errString = err?.message || JSON.stringify(err) || "";
    const isLeaked = errString.includes("leaked") || errString.includes("PERMISSION_DENIED") || err?.status === 403;
    
    // Return high quality local backup concepts
    const fallbackConcepts = generateFallbackConcepts(category, region, country);
    res.json({ fallback: true, leakedKey: isLeaked, concepts: fallbackConcepts });
  }
});

// 5. Upload Custom Reel Datasets (JSON or CSV parsing + batch AI classification)
app.post("/api/reels/upload", async (req, res) => {
  const { contentType, rawData } = req.body;

  if (!rawData || rawData.trim().length === 0) {
    return res.status(400).json({ success: false, message: "Empty dataset payload provided." });
  }

  let reelsToProcess: Partial<Reel>[] = [];

  try {
    if (contentType === "json") {
      const parsed = JSON.parse(rawData);
      reelsToProcess = Array.isArray(parsed) ? parsed : [parsed];
    } else {
      // Direct CSV parser
      const lines = rawData.split(/\r?\n/);
      const headers = lines[0].split(",");
      
      // Map columns: caption, hashtags, views, likes, comments, shares, region, country
      const getIndex = (name: string) => headers.findIndex(h => h.trim().toLowerCase() === name);
      const captionIdx = getIndex("caption");
      const hashtagsIdx = getIndex("hashtags");
      const viewsIdx = getIndex("views");
      const likesIdx = getIndex("likes");
      const commentsIdx = getIndex("comments");
      const sharesIdx = getIndex("shares");
      const regionIdx = getIndex("region");
      const countryIdx = getIndex("country");
      const userIdx = getIndex("username");

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].trim();
        if (currentLine.length === 0) continue;
        
        // Simple split considering quotes or comma split
        // For robustness, replace common delimiters
        const cells = currentLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        const cleanCell = (idx: number) => {
          if (idx === -1 || idx >= cells.length) return "";
          return cells[idx].replace(/^"|"$/g, '').trim();
        };

        const caption = cleanCell(captionIdx) || "Custom uploaded Reel caption";
        const rawTags = cleanCell(hashtagsIdx);
        const hashtags = rawTags ? rawTags.split(";").map(t => t.replace(/#/g, "").trim()) : ["custom_upload"];
        const views = parseInt(cleanCell(viewsIdx)) || Math.floor(Math.random() * 500000) + 1000;
        const likes = parseInt(cleanCell(likesIdx)) || Math.floor(views * 0.08);
        const comments = parseInt(cleanCell(commentsIdx)) || Math.floor(likes * 0.04);
        const shares = parseInt(cleanCell(sharesIdx)) || Math.floor(likes * 0.12);
        
        reelsToProcess.push({
          caption,
          hashtags,
          views,
          likes,
          comments,
          shares,
          region: cleanCell(regionIdx) || "Custom Zone",
          country: cleanCell(countryIdx) || "Custom Country",
          username: cleanCell(userIdx) || "custom_creator"
        });
      }
    }

    if (reelsToProcess.length === 0) {
      return res.status(400).json({ success: false, message: "No valid rows or records parsed." });
    }

    // Process categories & IDs
    const finalReels: Reel[] = [];
    const ai = getGeminiClient();

    // Check if we can batch classify them with Gemini for deep NLP categorization
    let classificationMap: { [caption: string]: string } = {};
    if (ai && reelsToProcess.length > 0) {
      try {
        const metadataForAI = reelsToProcess.map((r, idx) => ({
          index: idx,
          caption: r.caption || "",
          hashtags: r.hashtags || []
        }));

        const prompt = `
          We have uploaded new Instagram Reels content. For each item list, categorize it into exactly one of these 10 categories: 
          ["Fitness", "Comedy", "Business & Finance", "Travel", "Fashion & Beauty", "Food & Dining", "Education & Tech", "Gaming", "Motivation & Mindset", "Local Culture"].
          
          List of Items to categorize: ${JSON.stringify(metadataForAI)}.
          
          Return a JSON array of objects with keys 'index' and 'category' matching the original index and categorized string:
          [{"index": 0, "category": "Fitness"}]
          Do not include other explanation text or markdown wrappers. Just raw JSON output.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            systemInstruction: "You are a swift metadata classifier. Strictly outputs valid JSON matching categorization array."
          }
        });

        const batchResults = JSON.parse(response.text?.trim() || "[]");
        batchResults.forEach((res: any) => {
          const item = reelsToProcess[res.index];
          if (item) {
            classificationMap[item.caption || ""] = res.category;
          }
        });
      } catch (classifyErr) {
        console.warn("Batch AI Classification failed, using fallback keyword rules instead:", classifyErr);
      }
    }

    // Format final structure
    reelsToProcess.forEach((p, index) => {
      const likes = p.likes ?? 1000;
      const comments = p.comments ?? 50;
      const shares = p.shares ?? 150;
      const views = p.views ?? 10000;
      const engRate = views > 0 ? parseFloat((((likes + comments + shares) / views) * 100).toFixed(2)) : 0;

      // Assign category based on AI helper, then fallback logic
      let assignedCategory = p.category || "";
      if (!assignedCategory) {
        assignedCategory = classificationMap[p.caption || ""] || fallbackClassification(p.caption || "", p.hashtags || []);
      }

      finalReels.push({
        id: `custom_${Date.now()}_${index}`,
        caption: p.caption || "Aesthetic daily update vlog style",
        hashtags: p.hashtags || ["content", "reelsdaily"],
        audioTrend: p.audioTrend || "Aesthetic Lo-fi Drift (Uploaded)",
        audioOriginal: p.audioOriginal ?? false,
        videoLength: p.videoLength || 15,
        likes,
        comments,
        shares,
        views,
        engagementRate: engRate,
        engagementScore: parseFloat((engRate * 0.7 + (likes/5000) * 0.3).toFixed(1)),
        category: assignedCategory,
        region: p.region || "Custom Region",
        country: p.country || "Custom Country",
        username: p.username || "content_uploader",
        postedAt: p.postedAt || new Date().toISOString()
      });
    });

    // Store in global memory state
    globalCustomReels = [...finalReels, ...globalCustomReels];

    res.json({
      success: true,
      message: `Successfully parsed and classified ${finalReels.length} Reels!`,
      reelsAnalyzed: finalReels.length,
      mergedCount: globalCustomReels.length
    });

  } catch (err: any) {
    console.error("Uploader Parsing Error:", err);
    res.status(500).json({ success: false, message: `Failed to process uploaded data: ${err.message}` });
  }
});

// Serve Vite middleware or production build output
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite development middlewares AFTER our API endpoints
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Reels Analyzer Backend] Server running on http://localhost:${PORT}`);
  });
}

startServer();
