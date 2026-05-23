import React, { useState } from "react";
import { Reel } from "../types";
import { Eye, Heart, MessageSquare, Share2, Music, User, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface ReelCardProps {
  reel: Reel;
  onGenerateStrategy: (reel: Reel) => void;
  key?: any;
}

export default function ReelCard({ reel, onGenerateStrategy }: ReelCardProps) {
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const handleCopyHashtags = () => {
    const text = reel.hashtags.map(t => `#${t}`).join(" ");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#111] border border-white/10 overflow-hidden flex flex-col justify-between h-auto hover:border-[#CCFF00]/40 transition-all duration-200 relative group"
    >
      {/* Visual Header representing a Reel frame */}
      <div className="bg-[#0A0A0A] p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-xs uppercase">
            {reel.username[0].toUpperCase()}
          </div>
          <div>
            <h5 className="text-xs font-bold text-white tracking-tight">@{reel.username}</h5>
            <p className="text-[9px] font-mono uppercase tracking-wider text-white/40">{reel.region}, {reel.country}</p>
          </div>
        </div>

        {/* Weighted score pill */}
        <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/30 px-2.5 py-1 flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
          <span className="text-[9px] font-mono font-bold text-[#CCFF00]">
            {reel.engagementScore.toFixed(1)} VELOCITY
          </span>
        </div>
      </div>

      {/* Main caption segment */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-[#111111]">
        <div>
          <p className="text-xs text-white/95 font-sans leading-relaxed line-clamp-3 font-medium">
            &ldquo;{reel.caption}&rdquo;
          </p>
          
          <div className="flex flex-wrap gap-1.5 mt-3">
            {reel.hashtags.map((tag, i) => (
              <span key={i} className="text-[10px] text-[#CCFF00] font-mono font-bold">
                #{tag.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Music audio bar */}
        <div className="bg-[#050505] border border-white/5 px-2.5 py-1.5 flex items-center gap-2 text-[10px] text-white/60 font-mono uppercase tracking-wider">
          <Music className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
          <span className="truncate flex-1">{reel.audioTrend}</span>
          {reel.audioOriginal && (
            <span className="text-[8px] bg-white/10 text-white/40 px-1 rounded uppercase shrink-0">ORIG</span>
          )}
        </div>
      </div>

      {/* Interactive metrics footer */}
      <div className="px-4 py-3 bg-[#0A0A0A] border-t border-white/10 grid grid-cols-4 gap-2 text-center text-white/50">
        <div className="flex flex-col items-center">
          <Eye className="w-3.5 h-3.5 text-white/30 mb-0.5" />
          <span className="text-xs font-bold text-white tracking-tight font-mono">{formatNumber(reel.views)}</span>
          <span className="text-[8px] font-mono text-white/40 font-bold uppercase">VIEWS</span>
        </div>
        <div className="flex flex-col items-center">
          <Heart className="w-3.5 h-3.5 text-[#CCFF00] mb-0.5" />
          <span className="text-xs font-bold text-white tracking-tight font-mono">{formatNumber(reel.likes)}</span>
          <span className="text-[8px] font-mono text-white/40 font-bold uppercase">LIKES</span>
        </div>
        <div className="flex flex-col items-center">
          <MessageSquare className="w-3.5 h-3.5 text-white/30 mb-0.5" />
          <span className="text-xs font-bold text-white tracking-tight font-mono">{formatNumber(reel.comments)}</span>
          <span className="text-[8px] font-mono text-white/40 font-bold uppercase">REPLIES</span>
        </div>
        <div className="flex flex-col items-center">
          <Share2 className="w-3.5 h-3.5 text-white/30 mb-0.5" />
          <span className="text-xs font-bold text-white tracking-tight font-mono">{formatNumber(reel.shares)}</span>
          <span className="text-[8px] font-mono text-white/40 font-bold uppercase">SHARES</span>
        </div>
      </div>

      {/* Strategy and helper triggers */}
      <div className="p-3 bg-[#0A0A0A] border-t border-white/10 flex gap-2">
        <button
          onClick={() => onGenerateStrategy(reel)}
          className="flex-1 bg-white hover:bg-[#CCFF00] text-black font-display text-xs font-black py-2 uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          AI SCRIPT STRATEGY
        </button>

        <button
          onClick={handleCopyHashtags}
          className="px-3 py-1 bg-[#111] hover:bg-white hover:text-black border border-white/10 text-[9px] font-mono text-white uppercase font-bold shrink-0 cursor-pointer transition-colors"
        >
          {copied ? "COPIED" : "TAGS"}
        </button>
      </div>
    </motion.div>
  );
}

