"use client";

import { motion } from "framer-motion";
import { Citation } from "@/types";
import { FileText, BookOpen, Hash, List, ShieldCheck } from "lucide-react";

interface CitationCardProps {
  citation: Citation;
  index: number;
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (confidence >= 75) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
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
      className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
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
          <FileText className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              File
            </span>
            <p className="text-sm font-medium text-slate-700 break-all leading-snug">
              {citation.fileName}
            </p>
          </div>
        </div>

        {citation.section && (
          <div className="flex items-start gap-2.5">
            <BookOpen className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                Section
              </span>
              <p className="text-sm text-slate-600 leading-snug">
                {citation.section}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2.5">
          <Hash className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              Page
            </span>
            <p className="text-sm text-slate-600 leading-snug">
              {citation.pageNumber}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <List className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              Paragraph
            </span>
            <p className="text-sm text-slate-600 leading-snug">
              {citation.paragraphIndex}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
