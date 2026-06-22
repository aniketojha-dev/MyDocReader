"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Citation } from "@/types";
import { FileText, BookOpen, Hash, List, ChevronDown, ChevronRight, Star } from "lucide-react";

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export function CitationCard({ citation, index }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isPrimary = index === 0;

  return (
    <motion.div
      id={`source-${index + 1}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`rounded-xl bg-[#faf7f3] border p-2.5 shadow-sm hover:shadow-md hover:border-[#d0c8c0] transition-all duration-200 cursor-pointer scroll-mt-4 ${isPrimary ? "border-accent-300" : "border-[#e0d8d0]"}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {isPrimary ? (
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-accent-700">
              <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
              Primary Source
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-[#9c9590] uppercase tracking-widest">
              Source {index + 1}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronDown className="h-3 w-3 text-[#9c9590]" />
        ) : (
          <ChevronRight className="h-3 w-3 text-[#9c9590]" />
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-start gap-1.5">
          <FileText className="h-3 w-3 text-[#9c9590] mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] font-medium text-[#9c9590] uppercase tracking-wide">PDF</span>
            <p className="text-xs font-medium text-[#3d3833] break-all leading-snug">
              {citation.fileName}
            </p>
          </div>
        </div>

        {citation.section && (
          <div className="flex items-start gap-1.5">
            <BookOpen className="h-3 w-3 text-[#9c9590] mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] font-medium text-[#9c9590] uppercase tracking-wide">Section</span>
              <p className="text-xs text-[#6b6560] leading-snug">{citation.section}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-1.5">
          <List className="h-3 w-3 text-[#9c9590] mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] font-medium text-[#9c9590] uppercase tracking-wide">Point</span>
            <p className="text-xs text-[#6b6560] leading-snug">{citation.paragraphIndex}</p>
          </div>
        </div>

        <div className="flex items-start gap-1.5">
          <Hash className="h-3 w-3 text-[#9c9590] mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] font-medium text-[#9c9590] uppercase tracking-wide">Page</span>
            <p className="text-xs text-[#6b6560] leading-snug">{citation.pageNumber}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
