"use client";

import { motion } from "framer-motion";
import { ChatMessage as ChatMessageType } from "@/types";
import { CitationCard } from "./CitationCard";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-md shadow-primary-200">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}

      <div className={cn("max-w-[80%] space-y-2", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-primary-600 text-white shadow-md shadow-primary-200"
              : "bg-slate-50 border border-slate-100 text-slate-700"
          )}
        >
          {message.content}
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Sources
            </p>
            {message.citations.map((citation, idx) => (
              <CitationCard key={idx} citation={citation} index={idx} />
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
          <User className="h-4 w-4 text-slate-600" />
        </div>
      )}
    </motion.div>
  );
}
