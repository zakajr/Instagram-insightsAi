import React, { useState, useEffect } from "react";
import { Sparkles, X, Terminal, Copy, Music, Film, CheckCircle, Flame, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HookAssistantProps {
  category: string;
  region: string;
  country: string;
  onClose: () => void;
  reelContext?: {
    caption: string;
    username: string;
    audio: string;
  } | null;
}

interface Concept {
  id: string;
  title: string;
  hookText: string;
  description: string;
  recommendedAudio: string;
  executionTip: string;
}

export default function HookAssistant({
  category,
  region,
  country,
  onClose,
  reelContext = null
}: HookAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [leakedKey, setLeakedKey] = useState(false);

  useEffect(() => {
    fetchConcepts();
  }, [category, region, country, reelContext]);

  const fetchConcepts = async () => {
    setLoading(true);
    setError(null);
    setLeakedKey(false);
    try {
      const response = await fetch("/api/reels/suggest-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          region,
          country,
          reelContext
        })
      });

      if (!response.ok) {
        throw new Error("Endpoint failed to react.");
      }

      const data = await response.json();
      setConcepts(data.concepts || []);
      setLeakedKey(!!data.leakedKey);
      if (data.leakedKey) {
        setError("Our target backend detected a credentials exception (Revoked/Leaked Gemini API Key). Running custom blueprint parameters instead.");
      }
    } catch (err: any) {
      setError("AI generation paused. Displaying simulated creative prompts instead.");
      setConcepts([
        {
          id: "local_fb_1",
          title: `The 3-Second Rule in ${region || country}`,
          hookText: `NEVER do this when traveling to ${region || country}...`,
          description: `Deliver a highly unexpected culture rule or niche fact that breaks the ice for tourists or locals. Film with standard POV camera looking down at feet.`,
          recommendedAudio: `Original Sound of ${region} city streets`,
          executionTip: "Add bold yellow text in upper third. Cut transition every 1.5 seconds strictly."
        },
        {
          id: "local_fb_2",
          title: `Instagram vs Reality: ${category} Edition`,
          hookText: `What they think ${category} in ${region} looks like vs what it actually is...`,
          description: `Perfect parody format comparing a scenic aesthetic slow-motion pan of local spots with a chaotic, funny, organic handheld capture of regional lifestyle.`,
          recommendedAudio: "Sudden electronic beat drops on transition",
          executionTip: "Keep the first segment to 2.5 seconds max. Make the second shot long and conversational."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (concept: Concept) => {
    const textToCopy = `Title: ${concept.title}\nHook: "${concept.hookText}"\nStoryline: ${concept.description}\nAudio: ${concept.recommendedAudio}\nTip: ${concept.executionTip}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(concept.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="bg-[#050505] border-2 border-white/20 w-full max-w-2xl rounded-none overflow-hidden relative shadow-2xl flex flex-col justify-between my-8 max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#CCFF00]/10 border border-[#CCFF00]/20 flex items-center justify-center text-[#CCFF00]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest font-bold text-[#CCFF00] uppercase block">
                // SYSTEM_AI_STRATEGY_GENERATOR
              </span>
              <h3 className="text-xl font-black font-display text-white uppercase tracking-tight">
                {reelContext ? `BLUEPRINT FOR @${reelContext.username.toUpperCase()}` : `VIRAL BLUEPRINT CREATOR`}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/5 hover:bg-[#CCFF00] hover:text-black text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Core Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 select-text bg-[#050505]">
          {reelContext && (
            <div className="p-4 bg-[#111] border border-white/10 rounded-none">
              <span className="text-[10px] font-black text-[#CCFF00] font-mono tracking-wider block mb-1 uppercase">// REFERENCE METADATA</span>
              <p className="text-xs text-white italic leading-relaxed font-medium">"{reelContext.caption}"</p>
              <p className="text-[9px] font-mono text-white/40 mt-2 uppercase tracking-wider">AUDIO_TRACK_ID: {reelContext.audio}</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono uppercase tracking-wider">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-none border border-[#CCFF00]/20 animate-ping absolute inset-0" />
                <div className="w-10 h-10 rounded-none border border-t-[#CCFF00] border-r-[#CCFF00] border-b-black border-l-black animate-spin" />
              </div>
              <p className="text-xs text-[#CCFF00] font-mono uppercase tracking-widest font-bold">// SYNTHESIZING RAW BLUEPRINTS...</p>
            </div>
          ) : (
            <div className="space-y-5">
              {concepts.map((concept, idx) => (
                <div
                  key={concept.id || idx}
                  className="p-5 bg-[#111111] border border-white/10 rounded-none hover:border-[#CCFF00]/40 transition-colors relative group/card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/25 px-1.5 py-0.5">
                          #{String(idx + 1).padStart(2, "0")}
                        </span>
                        <h4 className="text-base font-black font-display text-white uppercase tracking-tight">{concept.title}</h4>
                      </div>

                      <div className="p-3 bg-[#050505] border border-white/10 rounded-none border-l-2 border-l-[#CCFF00] relative">
                        <span className="absolute -top-2 left-2 text-[8px] font-mono tracking-wider bg-[#111111] px-1 text-[#CCFF00]">TEXT OVERLAY HOOK</span>
                        <p className="text-xs font-mono font-bold text-white tracking-wide select-all mt-1 leading-snug">
                          &ldquo;{concept.hookText}&rdquo;
                        </p>
                      </div>

                      <div className="text-xs text-white/80 font-sans leading-relaxed">
                        <span className="text-[10px] font-bold text-white/40 font-mono block mb-1 uppercase tracking-widest">// VISUAL STORYLINE SEQUENCE</span>
                        <p className="italic font-medium">{concept.description}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 mt-2 border-t border-white/5 font-mono text-[10px]">
                        <div className="flex items-center gap-2 text-white/50">
                          <Music className="w-3.5 h-3.5 text-[#CCFF00] flex-shrink-0" />
                          <span className="truncate uppercase">AUDIO: {concept.recommendedAudio}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/50">
                          <Film className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                          <span className="truncate uppercase">TIP: {concept.executionTip}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(concept)}
                      className="p-2.5 bg-[#050505] hover:bg-white hover:text-black border border-white/10 text-white cursor-pointer transition-colors"
                    >
                      {copiedId === concept.id ? (
                        <CheckCircle className="w-4 h-4 text-[#CCFF00]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-[#0A0A0A] border-t border-white/10 flex justify-end gap-3 text-xs">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-[#CCFF00] text-black font-black uppercase tracking-widest cursor-pointer transition-colors"
          >
            CLOSE PLANNER
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

