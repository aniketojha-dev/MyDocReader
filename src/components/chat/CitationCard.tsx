"use client";

import { motion } from "framer-motion";
import { Citation } from "@/types";
import { FileText, BookOpen, Hash, List, ShieldCheck } from "lucide-react";

interface CitationCardProps {
  citation: Citation;
  index: number;
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return "text-[#7a9c76] bg-[#e8f0e6] border-[#d1e0ce]";
  if (confidence >= 75) return "text-[#b88152] bg-[#faf5f0] border-[#e7ceb9]";
  return "text-[#6b6560] bg-[#f0ece6] border-[#e5ded7]";
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 90) return "High";
  if (confidence >= 75) return "Medium";
  return "Low";
}

export function CitationCard({ citation, index }: CitationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-xl bg-[#faf7f3] border border-[#e5ded7] p-4 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#9c9590] uppercase tracking-widest">
          Source #{index + 1}
        </span>
        <div
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${getConfidenceColor(
            citation.confidence
          )}`}
        >
          <ShieldCheck className="h-3 w-3" />
          {citation.confidence}% &middot; {getConfidenceLabel(citation.confidence)}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-start gap-2.5">
          <FileText className="h-3.5 w-3.5 text-[#9c9590] mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-[#9c9590] uppercase tracking-wide">
              File
            </span>
            <p className="text-sm font-medium text-[#3d3833] break-all leading-snug">
              {citation.fileName}
            </p>
          </div>
        </div>

        {citation.section && (
          <div className="flex items-start gap-2.5">
            <BookOpen className="h-3.5 w-3.5 text-[#9c9590] mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-[#9c9590] uppercase tracking-wide">
                Section
              </span>
              <p className="text-sm text-[#6b6560] leading-snug">
                {citation.section}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2.5">
          <Hash className="h-3.5 w-3.5 text-[#9c9590] mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-[#9c9590] uppercase tracking-wide">
              Page
            </span>
            <p className="text-sm text-[#6b6560] leading-snug">
              {citation.pageNumber}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <List className="h-3.5 w-3.5 text-[#9c9590] mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-[#9c9590] uppercase tracking-wide">
              Paragraph
            </span>
            <p className="text-sm text-[#6b6560] leading-snug">
              {citation.paragraphIndex}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
