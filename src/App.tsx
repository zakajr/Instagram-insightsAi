import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  Flame, 
  Zap, 
  Sparkles, 
  RefreshCw, 
  SlidersHorizontal, 
  Globe, 
  Eye, 
  Database,
  ArrowRight,
  ShieldCheck,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from "recharts";

import { Reel, CategoryTrend, GeographicZone, InsightReport } from "./types";
import MetricCard from "./components/MetricCard";
import InsightItem from "./components/InsightItem";
import ReelCard from "./components/ReelCard";
import HookAssistant from "./components/HookAssistant";
import DataUploader from "./components/DataUploader";

export default function App() {
  // Static profile choices
  const [geographies, setGeographies] = useState<GeographicZone[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Active Filter Selections
  const [selectedCountry, setSelectedCountry] = useState<string>("United States");
  const [selectedRegion, setSelectedRegion] = useState<string>("California");
  const [customZone, setCustomZone] = useState<string>("");
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [selectedCategory, setSelectedCategory] = useState<string>("Comedy");
  
  // Loaded Stats States
  const [reels, setReels] = useState<Reel[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryTrend[]>([]);
  const [kpis, setKpis] = useState({
    totalViews: 0,
    avgEngagement: 0,
    totalReels: 0,
    growthLeader: "None",
    topCategory: "None"
  });

  // Insights State
  const [insights, setInsights] = useState<InsightReport[]>([]);
  const [leakedKey, setLeakedKey] = useState(false);
  
  // Auxiliary UI controllers
  const [activeTab, setActiveTab] = useState<'charts' | 'upload'>('charts');
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [showHookAssistant, setShowHookAssistant] = useState(false);
  const [selectedReelForHook, setSelectedReelForHook] = useState<Reel | null>(null);

  // Initialize Static presets on mount
  useEffect(() => {
    async function loadPresets() {
      try {
        const response = await fetch("/api/reels/static-data");
        const data = await response.json();
        setGeographies(data.geography || []);
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to load static list configurations:", err);
      }
    }
    loadPresets();
  }, []);

  // Run Metric queries when configuration parameters change
  useEffect(() => {
    fetchMetrics();
  }, [selectedCountry, selectedRegion, customZone, timeRange]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reels/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selectedCountry,
          region: selectedRegion,
          customZone: customZone,
          timeRange: timeRange
        })
      });

      const data = await response.json();
      setReels(data.reels || []);
      setCategoryStats(data.categoryStats || []);
      setKpis(data.summaryKpis || {
        totalViews: 0,
        avgEngagement: 0,
        totalReels: 0,
        growthLeader: "None",
        topCategory: "None"
      });

      // Automatically trigger a summary analysis updates
      triggerAIInsights(data.summaryKpis, data.categoryStats);

    } catch (err) {
      console.error("Metric computation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerAIInsights = async (currentKpis: any, summaries: CategoryTrend[]) => {
    setInsightsLoading(true);
    try {
      const response = await fetch("/api/reels/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selectedCountry,
          region: selectedRegion,
          kpis: currentKpis,
          categorySummaries: summaries.filter(s => s.reelsCount > 0)
        })
      });

      const data = await response.json();
      setInsights(data.insights || []);
      setLeakedKey(!!data.leakedKey);
    } catch (err) {
      console.error("Failed to sync AI insights:", err);
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    // Automatically select the first region of that country
    const match = geographies.find(g => g.country === country);
    if (match && match.regions.length > 0) {
      setSelectedRegion(match.regions[0]);
    } else {
      setSelectedRegion("All Regions");
    }
    setCustomZone("");
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(0) + "K";
    return views.toString();
  };

  const handleUploadDone = (report: { message: string; count: number }) => {
    // Reload local dashboard context
    fetchMetrics();
  };

  const handleReelStrategyClicked = (reel: Reel) => {
    setSelectedReelForHook(reel);
    setSelectedCategory(reel.category);
    setShowHookAssistant(true);
  };

  // Filter reels corresponding to active selected category context
  const filteredReelsInCategory = reels.filter(r => r.category === selectedCategory);

  // Prepare chart metrics comparison
  // Bar chart needs keys: category, Views (Millions), EngagementRate (%)
  const chartData = categoryStats
    .filter(c => c.reelsCount > 0)
    .map(c => {
      const growthValue = timeRange === '24h' ? c.growth24h : timeRange === '7d' ? c.growth7d : c.growth30d;
      return {
        name: c.category,
        "Views (M)": parseFloat((c.totalViews / 1000000).toFixed(2)),
        "Engagement Rate (%)": c.avgEngagementRate,
        "Growth Rate (%)": growthValue
      };
    });

  // Calculate matching region list
  const activeCountryRegions = geographies.find(g => g.country === selectedCountry)?.regions || [];

  return (
    <div id="reels_app" className="flex bg-[#050505] text-white min-h-screen select-text font-sans">
      {/* Brutalist Sidebar */}
      <aside className="w-20 border-r border-white/10 flex flex-col items-center py-8 space-y-12 bg-[#0A0A0A] hidden md:flex shrink-0">
        <div className="font-mono font-black text-xl tracking-tighter text-[#CCFF00]">RI.</div>
        <div className="flex flex-col space-y-8 opacity-40">
          <div className="w-6 h-6 border-2 border-[#CCFF00]"></div>
          <div className="w-6 h-6 border-2 border-white rounded-full"></div>
          <div className="w-6 h-6 border-2 border-dashed border-[#CCFF00]"></div>
        </div>
        <div className="mt-auto mb-4 opacity-30 text-[9px] font-mono rotate-180" style={{ writingMode: "vertical-rl" }}>
          v2.4.0_INTEL
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pb-16 px-4 md:px-12 max-w-7xl space-y-8 pt-8 overflow-hidden">
      
        {/* 1. BRAND AND TELEMETRY PORT HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-white pb-6">
          <div className="flex flex-col">
            <span className="text-[#CCFF00] font-mono text-[10px] tracking-[0.2em] uppercase mb-1">
              // REELS_INTELLIGENCE_CENTRE // {selectedRegion.toUpperCase().replace(/\s+/g, "_")}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase text-white">
              {selectedCountry}
            </h1>
          </div>

          <div className="flex flex-wrap items-start md:items-end flex-col gap-2.5">
            <div className="flex gap-2">
              <div className="px-3 py-1 border border-white/20 bg-white/5 text-slate-300 text-[10px] font-mono font-bold uppercase">
                {timeRange.toUpperCase()} FEED
              </div>
              <div className="px-3 py-1 bg-[#CCFF00] text-black text-[10px] font-mono font-black uppercase tracking-wider">
                META INSTAGRAM LIVE
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#CCFF00] animate-pulse" />
                STABLE_CONN
              </span>
              <span>PING: 32MS</span>
            </div>
          </div>
        </header>

        {/* 2. DIAGNOSTIC PANEL CONTROLS */}
        <section className="bg-[#111111] p-6 border border-white/10 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-1">
            <SlidersHorizontal className="w-4 h-4 text-[#CCFF00]" />
            <h2 className="text-xs font-mono font-black uppercase tracking-widest text-white">
              GEOGRAPHIC SEGMENT BOUNDARIES & PARAMETERS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Country selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-white/50 block">
                Target Country
              </label>
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full bg-[#050505] border border-white/20 rounded-none px-3.5 py-2.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-[#CCFF00] cursor-pointer appearance-none"
                >
                  {geographies.map((g) => (
                    <option key={g.country} value={g.country} className="bg-black text-white">{g.country.toUpperCase()}</option>
                  ))}
                </select>
                <Globe className="w-3.5 h-3.5 text-white/40 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Region Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-white/50 block">
                State / Area Geo
              </label>
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setCustomZone("");
                  }}
                  disabled={activeCountryRegions.length === 0}
                  className="w-full bg-[#050505] border border-white/20 rounded-none px-3.5 py-2.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-[#CCFF00] cursor-pointer appearance-none disabled:opacity-40"
                >
                  <option value="All Regions" className="bg-black text-white">ALL REGIONS</option>
                  {activeCountryRegions.map((reg) => (
                    <option key={reg} value={reg} className="bg-black text-white">{reg.toUpperCase()}</option>
                  ))}
                </select>
                <MapPin className="w-3.5 h-3.5 text-white/40 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Custom micro-zone input */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-white/50 block">
                Custom Zone Search Keyword Override
              </label>
              <input
                type="text"
                placeholder="E.G. BRICKLANE, TOKYO_CAFE, FITNESS..."
                value={customZone}
                onChange={(e) => setCustomZone(e.target.value)}
                className="w-full bg-[#050505] border border-white/20 rounded-none px-3.5 py-2.5 text-xs text-white uppercase font-mono tracking-wider placeholder:text-white/25 focus:outline-none focus:border-[#CCFF00]"
              />
            </div>

            {/* Time range controller */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-white/50 block">
                Analysis Window
              </label>
              <div className="grid grid-cols-3 bg-black border border-white/20 p-1 font-mono">
                {(['24h', '7d', '30d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`text-[10px] py-1.5 font-bold uppercase cursor-pointer transition-colors ${
                      timeRange === range
                        ? "bg-[#CCFF00] text-black"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>


      {/* 3. CORE BENTO METRICS GROUP */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-2">
        <MetricCard
          title="Reels Ingested"
          value={loading ? "..." : kpis.totalReels}
          icon={<Database className="w-4.5 h-4.5" />}
          description="Segmented samples from location"
          accentColor="indigo"
        />
        <MetricCard
          title="Total Segment Views"
          value={loading ? "..." : formatViews(kpis.totalViews)}
          icon={<Eye className="w-4.5 h-4.5" />}
          description="Cumulative reach under selection"
          accentColor="emerald"
        />
        <MetricCard
          title="Avg Engagement Rate"
          value={loading ? "..." : `${kpis.avgEngagement}%`}
          icon={<Zap className="w-4.5 h-4.5" />}
          description="Likes/Views normalized rating"
          accentColor="amber"
          trend={kpis.avgEngagement > 15 ? { value: "HIGH PERFORMANCE", isPositive: true } : undefined}
        />
        <MetricCard
          title="Growth Category Leader"
          value={loading ? "..." : kpis.growthLeader}
          icon={<TrendingUp className="w-4.5 h-4.5" />}
          description="Greatest incremental growth margin"
          accentColor="rose"
        />
      </section>

      {/* 4. BALANCED CATEGORIES INDEX & MIDDLE WORKSPACE */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left column: Categories visual Leaderboard */}
        <div className="lg:col-span-1 bg-[#111111] border border-white/10 p-6 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-white pb-3">
            <div>
              <h3 className="text-xs font-black font-display text-white uppercase tracking-widest">// CATEGORIES LEADERBOARD</h3>
              <p className="text-[10px] font-mono text-white/40 uppercase mt-0.5 tracking-wider">Select context block to scan reels</p>
            </div>
            
            <span className="text-[9px] font-mono tracking-widest bg-white/5 border border-white/15 text-[#CCFF00] px-2 py-0.5 font-bold">
              VIEWS_DESC
            </span>
          </div>

          <div className="space-y-4">
            {categoryStats.map((catMetric, idx) => {
              const isActive = catMetric.category === selectedCategory;
              const hasMatchingReels = catMetric.reelsCount > 0;
              const currentGrowth = timeRange === '24h' 
                ? catMetric.growth24h 
                : timeRange === '7d' 
                  ? catMetric.growth7d 
                  : catMetric.growth30d;

              return (
                <button
                  key={catMetric.category}
                  onClick={() => {
                    setSelectedCategory(catMetric.category);
                  }}
                  className={`w-full text-left p-4 rounded-none border transition-all duration-150 cursor-pointer flex justify-between items-center relative gap-3 overflow-hidden ${
                    isActive
                      ? "bg-[#0A0A0A] border-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.06)]"
                      : "bg-[#0A0A0A]/50 border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono font-bold ${isActive ? "text-[#CCFF00]" : "text-white/30"}`}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h4 className={`text-sm font-black uppercase tracking-tight truncate ${isActive ? "text-[#CCFF00]" : "text-white"}`}>
                        {catMetric.category}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[9px] font-mono uppercase text-white/50 tracking-wider">
                      <span>{catMetric.reelsCount} REELS</span>
                      <span>•</span>
                      <span>{formatViews(catMetric.totalViews)} VIEWS</span>
                    </div>

                    {/* Simple visual bar indicators represent reach comparison */}
                    <div className="w-full bg-[#050505] h-1.5 overflow-hidden text-[1px]">
                      <div 
                        className={`h-full ${isActive ? "bg-[#CCFF00]" : "bg-white/20"}`} 
                        style={{ width: `${Math.min(100, Math.max(10, (catMetric.totalViews / (kpis.totalViews || 1)) * 100))}%` }} 
                      />
                    </div>
                  </div>

                  {/* Growth indicators badges to flag volatile trends */}
                  <div className="flex flex-col items-end gap-1 font-mono shrink-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                      currentGrowth >= 0 
                        ? "bg-[#CCFF00]/10 border-[#CCFF00]/30 text-[#CCFF00]" 
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}>
                      {currentGrowth >= 0 ? "+" : ""}{currentGrowth}%
                    </span>
                    <span className="text-[8px] text-white/30 font-bold uppercase">VELOCITY</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right workspace: Chart analysis tab + Pluggable File uploader */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-[#111111] border border-white/10 p-6 flex flex-col justify-between h-[360px] relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActiveTab('charts')}
                  className={`text-xs font-black uppercase tracking-widest py-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'charts'
                      ? "border-[#CCFF00] text-[#CCFF00]"
                      : "border-transparent text-white/40 hover:text-white"
                  }`}
                >
                  // Theme Analytics
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`text-xs font-black uppercase tracking-widest py-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'upload'
                      ? "border-[#CCFF00] text-[#CCFF00]"
                      : "border-transparent text-white/40 hover:text-white"
                  }`}
                >
                  // Custom Imports
                </button>
              </div>

              {/* Auxiliary information */}
              <div className="text-[9px] text-[#CCFF00] font-mono tracking-widest flex items-center gap-1.5 font-bold uppercase">
                <BarChart3 className="w-3.5 h-3.5" />
                // CHARTING_RENDERS
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex-1 min-h-0 pt-4 bg-[#0A0A0A] p-4 border border-white/5 mt-2">
              <AnimatePresence mode="wait">
                {activeTab === 'charts' ? (
                  <motion.div
                    key="charts"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    className="w-full h-full"
                  >
                    {chartData.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-2 uppercase font-mono text-[10px]">
                        <BarChart3 className="w-8 h-8 opacity-25" />
                        <span>No dynamic signals under current region presets</span>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="95%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#CCFF00" stopOpacity={0.95}/>
                              <stop offset="100%" stopColor="#CCFF00" stopOpacity={0.05}/>
                            </linearGradient>
                            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9}/>
                              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.06} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#ffffff" 
                            fontSize={8} 
                            tickLine={false}
                            opacity={0.4}
                          />
                          <YAxis 
                            stroke="#ffffff" 
                            fontSize={8} 
                            tickLine={false}
                            opacity={0.4}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#050505', 
                              borderColor: '#CCFF00',
                              borderRadius: '0px',
                              borderWidth: '2px',
                              fontSize: '10px',
                              fontFamily: 'monospace',
                              color: '#fff'
                            }} 
                          />
                          <Legend wrapperStyle={{ fontSize: 9, pt: 10, opacity: 0.7, textTransform: 'uppercase', fontFamily: 'monospace' }} />
                          <Bar dataKey="Views (M)" fill="url(#viewsGradient)" name="Reach (Million Views)" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="Growth Rate (%)" fill="url(#growthGradient)" name="Growth Rate (%)" radius={[0, 0, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full text-left"
                  >
                    <DataUploader onUploadSuccess={handleUploadDone} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
        </div>
      </section>

      {/* 5. LEADING REELS GRID INSIDE CATEGORY */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-white pb-3">
          <div className="flex items-end gap-3 flex-wrap">
            <span className="px-2.5 py-1 bg-[#CCFF00] text-black text-[9px] font-mono font-black uppercase tracking-widest shrink-0">
              LEDGER_INDEX
            </span>
            <h3 className="text-xl font-black font-display text-white uppercase tracking-tighter">
              Leading Reels in &ldquo;{selectedCategory}&rdquo; context
            </h3>
          </div>

          <button
            onClick={() => {
              setSelectedReelForHook(null);
              setShowHookAssistant(true);
            }}
            className="self-start text-[10px] font-mono font-black bg-[#CCFF00] hover:bg-white text-black px-4 py-2.5 uppercase tracking-widest cursor-pointer transition-colors"
          >
            PREDICT VIRAL HOOKS & SCRIPTS
          </button>
        </div>

        {filteredReelsInCategory.length === 0 ? (
          <div className="bg-[#111111] border border-white/10 p-16 text-center space-y-3">
            <SlidersHorizontal className="w-10 h-10 mx-auto text-[#CCFF00] opacity-40 animate-pulse" />
            <p className="text-xs font-mono uppercase font-black text-white tracking-widest">No matching Reels found for this Category context</p>
            <p className="text-[10px] font-serif italic text-white/50">Try selecting another category or uploading your custom CSV dataset to import reels</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReelsInCategory
              .sort((a, b) => b.engagementScore - a.engagementScore)
              .map((reel) => (
                <ReelCard 
                  key={reel.id} 
                  reel={reel} 
                  onGenerateStrategy={handleReelStrategyClicked} 
                />
              ))}
          </div>
        )}
      </section>

      {/* 6. AI AGGREGATE INSIGHTS ENGINE HUB */}
      <section className="bg-[#0A0A0A] border-2 border-[#CCFF00]/30 p-8 space-y-6 relative overflow-hidden mt-6">
        {leakedKey && (
          <div className="bg-red-950/20 border-l-4 border-red-500 p-4 font-mono text-[11px] text-red-400 space-y-1">
            <span className="font-bold uppercase block">// SECURITY_NOTICE_BYPASS_ACTIVE</span>
            <p className="leading-relaxed font-sans">
              Google AI Studio reported the current API key as leaked or revoked (403 Permission Denied).
              The system has executed a seamless bypass, utilizing our dynamic, metrics-driven fallback engine to construct accurate localized trend reports. You can configure a new API secret anytime via the <strong>Settings &gt; Secrets</strong> panel inside AI Studio.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center text-[#CCFF00]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#CCFF00] font-bold block uppercase">// AI_INTELLIGENCE_GRAIN</span>
              <h3 className="text-xl font-black font-display text-white uppercase mt-0.5 tracking-tight">MARKET INTELLIGENCE HUB</h3>
            </div>
          </div>

          <button
            onClick={() => triggerAIInsights(kpis, categoryStats)}
            disabled={insightsLoading}
            className="bg-white hover:bg-[#CCFF00] text-black font-mono text-[10px] font-black px-4 py-2.5 uppercase tracking-widest transition-colors cursor-pointer"
          >
            REGENERATE AI INSIGHTS
          </button>
        </div>

        {insightsLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-none border border-[#CCFF00]/20 animate-ping absolute inset-0" />
              <div className="w-10 h-10 rounded-none border border-t-[#CCFF00] border-r-[#CCFF00] border-[#0A0A0A] border-l-[#0A0A0A] animate-spin" />
            </div>
            <p className="text-xs font-mono text-[#CCFF00] uppercase tracking-widest font-black">// MODEL SCANNING LOCAL DATASET TRENDS...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, idx) => (
              <InsightItem key={insight.id || idx} insight={insight} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* AI Content Generation Assistant modal overlay */}
      <AnimatePresence>
        {showHookAssistant && (
          <HookAssistant
            category={selectedCategory}
            region={selectedRegion}
            country={selectedCountry}
            onClose={() => {
              setShowHookAssistant(false);
              setSelectedReelForHook(null);
            }}
            reelContext={
              selectedReelForHook
                ? {
                    caption: selectedReelForHook.caption,
                    username: selectedReelForHook.username,
                    audio: selectedReelForHook.audioTrend
                  }
                : null
            }
          />
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}

