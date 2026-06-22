"use client";

import { motion } from "framer-motion";
import { ChatMessage as ChatMessageType } from "@/types";
import { User, Bot, Sparkles } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

function scrollToSource(num: string) {
  const el = document.getElementById(`source-${num}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-primary-400", "ring-offset-2", "rounded-lg");
    setTimeout(() => {
      el.classList.remove("ring-2", "ring-primary-400", "ring-offset-2", "rounded-lg");
    }, 2500);
  }
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\[\d+\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/\[(\d+)\]/);
        if (match) {
          const num = match[1];
          return (
            <button
              key={i}
              onClick={() => scrollToSource(num)}
              className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary-100 text-primary-700 text-[11px] font-bold hover:bg-primary-200 hover:scale-110 active:scale-95 transition-all mx-0.5 align-middle"
            >
              {num}
            </button>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function formatAnswer(text: string): React.ReactNode {
  const elements: React.ReactNode[] = [];
  const blocks = text.split(/\n{2,}/);

  blocks.forEach((block, bIdx) => {
    const lines = block.split("\n").filter((l) => l.trim());

    if (lines.length === 0) return;

    const firstLine = lines[0].trim();

    if (firstLine.startsWith("## ")) {
      elements.push(
        <h3 key={`h-${bIdx}`} className="text-lg font-bold text-[#3d3833] mt-6 mb-3">
          {renderInline(firstLine.replace(/^##\s+/, ""))}
        </h3>
      );
      if (lines.length > 1) {
        elements.push(
          <div key={`hc-${bIdx}`} className="space-y-2 mb-4">
            {lines.slice(1).map((line, lIdx) => renderLine(`hl-${bIdx}-${lIdx}`, line))}
          </div>
        );
      }
      return;
    }

    if (lines.length === 1 && firstLine.match(/^\*\*.+\*\*$/)) {
      elements.push(
        <h4 key={`sh-${bIdx}`} className="text-base font-semibold text-[#3d3833] mt-5 mb-2">
          {renderInline(firstLine.replace(/^\*\*/, "").replace(/\*\*$/, ""))}
        </h4>
      );
      return;
    }

    elements.push(
      <div key={`c-${bIdx}`} className="space-y-1.5 mb-4">
        {lines.map((line, lIdx) => renderLine(`l-${bIdx}-${lIdx}`, line))}
      </div>
    );
  });

  return elements;
}

function renderLine(key: string, line: string): React.ReactNode {
  const trimmed = line.trim();

  if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
    return (
      <div key={key} className="flex items-start gap-2.5 pl-1">
        <span className="text-primary-500 mt-1.5 flex-shrink-0">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
            <circle cx="4" cy="4" r="3" />
          </svg>
        </span>
        <span className="flex-1 text-[#6b6560] leading-[1.8]">
          {renderInline(trimmed.replace(/^[-*•]\s+/, ""))}
        </span>
      </div>
    );
  }

  if (trimmed.match(/^\d+[\.\)]\s/)) {
    const num = trimmed.match(/^(\d+[\.\)])/)?.[1] || "";
    return (
      <div key={key} className="flex items-start gap-2.5 pl-1">
        <span className="text-[#9c9590] text-xs mt-1.5 font-medium min-w-[1.2rem] flex-shrink-0">
          {num}
        </span>
        <span className="flex-1 text-[#6b6560] leading-[1.8]">
          {renderInline(trimmed.replace(/^\d+[\.\)]\s+/, ""))}
        </span>
      </div>
    );
  }

  return (
    <p key={key} className="text-[#6b6560] leading-[1.8]">
      {renderInline(trimmed)}
    </p>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex gap-3 justify-end"
      >
        <div className="max-w-[80%]">
          <div className="rounded-2xl rounded-br-md bg-primary-600 text-white shadow-md shadow-primary-200/30 px-4 py-3 text-sm leading-relaxed">
            {message.content}
          </div>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f0ece6] border border-[#e5ded7]">
          <User className="h-4 w-4 text-[#6b6560]" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-md shadow-primary-200/30 mt-1">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-[#3d3833]">Document Analyst</span>
          <span className="flex items-center gap-1 text-[10px] text-[#9c9590] bg-[#f0ece6] rounded-full px-2 py-0.5">
            <Sparkles className="h-3 w-3" />
            Answer
          </span>
        </div>
        <div className="rounded-2xl bg-[#faf7f3] border border-[#e0d8d0] shadow-md p-5">
          <div className="text-base leading-[1.8] space-y-1">
            {formatAnswer(message.content)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
