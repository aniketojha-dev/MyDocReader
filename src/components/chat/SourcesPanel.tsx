"use client";

import { Citation } from "@/types";
import { CitationCard } from "./CitationCard";
import { BookOpen } from "lucide-react";

interface SourcesPanelProps {
  citations: Citation[];
}

export function SourcesPanel({ citations }: SourcesPanelProps) {
  return (
    <div className="h-full">
      <div className="sticky top-0 p-4">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e5ded7]">
          <BookOpen className="h-4 w-4 text-primary-500" />
          <h3 className="text-sm font-semibold text-[#3d3833]">Sources</h3>
          {citations.length > 0 && (
            <span className="text-xs text-[#9c9590]">({citations.length})</span>
          )}
        </div>
        {citations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-8 w-8 text-[#d5cec7] mb-2" />
            <p className="text-xs text-[#9c9590]">Sources will appear here when you receive an answer.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {citations.map((citation, idx) => (
              <CitationCard key={idx} citation={citation} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
