import React from "react";
import { InsightReport } from "../types";
import { TrendingUp, AlertCircle, Info, Flame, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface InsightItemProps {
  insight: InsightReport;
  index: number;
  key?: any;
}

export default function InsightItem({ insight, index }: InsightItemProps) {
  const iconMap = {
    trend: <TrendingUp className="w-4 h-4" />,
    warning: <AlertCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
    success: <Flame className="w-4 h-4" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 220 }}
      className="p-5 bg-[#111] border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-[#CCFF00]/40 transition-colors gap-4"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5 text-[#CCFF00]">
            {iconMap[insight.type] || <Sparkles className="w-4 h-4" />}
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#CCFF00]">
              // {insight.type.toUpperCase()}
            </span>
          </div>

          {insight.categoryBound && (
            <span className="text-[9px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 border border-[#CCFF00]/20 bg-[#CCFF00]/5 text-[#CCFF00] shrink-0">
              {insight.categoryBound}
            </span>
          )}
        </div>

        <h4 className="text-base font-bold font-display text-white uppercase tracking-tight leading-tight mb-2">
          {insight.title}
        </h4>

        <p className="text-xs text-white/70 leading-relaxed font-sans font-medium italic">
          &ldquo;{insight.text}&rdquo;
        </p>
      </div>

      {insight.growth !== undefined && (
        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1 shrink-0">
          <span className="text-[9px] font-mono text-white/40 uppercase">VELOCITY SHIFT</span>
          <span className="text-xl font-bold font-mono text-[#CCFF00] leading-none">
            +{insight.growth}%
          </span>
        </div>
      )}
    </motion.div>
  );
}

