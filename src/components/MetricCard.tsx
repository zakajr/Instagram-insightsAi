import React, { ReactNode } from "react";
import { motion } from "motion/react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  description,
  trend,
  accentColor = "indigo"
}: MetricCardProps) {
  // Bold high-contrast monochrome & lime presets
  const borderClass = "border-white/10";
  const iconColorClass = "text-[#CCFF00]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="bg-[#111111] p-5 border border-white/10 flex flex-col justify-between h-34 relative group hover:border-[#CCFF00]/40 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-mono tracking-widest text-white/50">
          // {title}
        </span>
        <div className={`text-[#CCFF00] drop-shadow-[0_0_10px_rgba(204,255,0,0.1)]`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <h3 className="text-4xl font-extrabold font-display tracking-tighter text-white leading-none uppercase">
            {value}
          </h3>
          {description && (
            <p className="text-[9px] font-mono tracking-wider text-white/40 uppercase mt-2">{description}</p>
          )}
        </div>

        {trend && (
          <span
            className="text-[9px] font-mono font-bold px-2 py-1 bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00]"
          >
            {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
}

