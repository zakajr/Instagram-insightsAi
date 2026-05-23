import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, Check, AlertTriangle, Code, Play, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DataUploaderProps {
  onUploadSuccess: (report: { message: string; count: number }) => void;
}

export default function DataUploader({ onUploadSuccess }: DataUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorError, setErrorError] = useState<string | null>(null);
  const [uploadReport, setUploadReport] = useState<{ message: string; count: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleCSV = `caption,hashtags,views,likes,comments,shares,region,country,username
"Insane heavy deadlift PR in Venice Beach Venice Gold's Gym! Ready to destroy this summer body workout","gymlife;deadlift;venicebeach;california;fitnessmotivation",1850000,142000,3100,18500,"California","United States","venice_monster"
"My absolute favorite vintage thrift boutique in London's brick lane! Custom styling outfit tips","thriftshop;bricklane;vintagelondon;fashionstyle;londonwalk",280000,31000,420,1950,"London","United Kingdom","vintage_lister"
"Trying the viral chocolate strawberry cups in Tokyo's Harajuku district. Real cheese pulls","tokyofood;harajuku;viralstrawberry;japaneseeats",910000,111000,2900,12400,"Tokyo","Japan","harajuku_sweetie"
"Traditional Fado classical acoustic session at midnight in Rio de Janeiro hills. Bossa nova mood","riomusic;traditionalbrazil;bossanova;cariocalocal",145000,12000,410,2100,"Rio de Janeiro","Brazil","fado_carioca"
"The raw ultimate software engineering setup for student coders under $500 total in Bangalore","softwarehouse;bangaloretech;studentcoder;gamingsetup",430000,48000,1100,6500,"Karnataka (Bangalore)","India","tech_guru_blr"`;

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    setLoading(true);
    setErrorError(null);
    setUploadReport(null);

    const isJSON = file.name.endsWith(".json");
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        await sendDataToServer(isJSON ? "json" : "csv", text);
      } catch (err: any) {
        setErrorError(err.message || "Failed to process target content formatting.");
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  const sendDataToServer = async (contentType: "json" | "csv", rawData: string) => {
    try {
      const response = await fetch("/api/reels/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, rawData })
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to parse content matrix.");
      }

      setUploadReport({
        message: data.message,
        count: data.reelsAnalyzed
      });
      onUploadSuccess({
        message: data.message,
        count: data.reelsAnalyzed
      });
    } catch (err: any) {
      setErrorError(err.message || "Communication failure during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const loadSampleCSV = async () => {
    setLoading(true);
    setErrorError(null);
    setUploadReport(null);
    // Simulate real delay
    setTimeout(async () => {
      await sendDataToServer("csv", sampleCSV);
    }, 600);
  };

  return (
    <div className="bg-[#111111] border border-white/10 p-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5 border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#CCFF00] font-bold block uppercase">// PIPELINE_INGESTION_MODULE</span>
          <h4 className="text-base font-black font-display text-white mt-1 uppercase">PLUGGABLE REELS STREAM</h4>
        </div>
        
        {/* Help schema badge */}
        <div className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 text-[10px] font-mono uppercase tracking-wider">
          CSV / JSON DATASTREAM
        </div>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInputClick}
        className={`border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? "border-[#CCFF00] bg-[#CCFF00]/10"
            : "border-white/10 bg-[#0A0A0A] hover:border-white/30 hover:bg-white/[0.02]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json"
          onChange={handleFileChange}
          className="hidden"
        />

        {loading ? (
          <div className="space-y-3 py-2 flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-t-[#CCFF00] border-r-[#CCFF00] border-b-black border-l-black animate-spin" />
            <p className="text-xs font-mono text-[#CCFF00] uppercase tracking-wider">// BATCH CATEGORIZING RAW REEL DATASETS...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-10 h-10 bg-[#111] flex items-center justify-center border border-white/10 mx-auto text-white">
              <Upload className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-white uppercase tracking-wider">DRAG & DROP REALTIME DATASET FILE HERE, OR CLICK TO BROWSE</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest font-mono">caption, hashtags, views, likes, comments, shares, region, country, username</p>
            </div>
          </div>
        )}
      </div>

      {/* Action shortcuts / instructions */}
      <div className="mt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-wide flex-1">
          <HelpCircle className="w-4 h-4 text-[#CCFF00] flex-shrink-0" />
          <span>Require test mock data? load our curated sample reels structure to trigger automated machine learning categorizer.</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            loadSampleCSV();
          }}
          disabled={loading}
          className="bg-white hover:bg-[#CCFF00] text-black font-display text-[11px] font-black px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer shrink-0"
        >
          LOAD TRIAL SEGMENT
        </button>
      </div>

      {/* Reports and indicators */}
      <AnimatePresence>
        {uploadReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-xs text-[#CCFF00] font-mono uppercase"
          >
            <Check className="w-4.5 h-4.5 inline-block mr-2" />
            <span className="font-bold inline-block">{uploadReport.message}</span>
            <span className="text-[9px] text-white/60 block mt-1 tracking-wider">PROCESSED {uploadReport.count} INTELLIGENT NODE CLUSTERS COMPLETED OVER SPECIFIED GEOS.</span>
          </motion.div>
        )}

        {errorError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono uppercase"
          >
            <AlertTriangle className="w-4.5 h-4.5 inline-block mr-2" />
            <span>{errorError}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

