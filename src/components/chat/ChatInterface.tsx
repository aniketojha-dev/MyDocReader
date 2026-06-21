"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  FileText,
  ArrowLeft,
  Trash2,
  Sparkles,
  Bot,
  ChevronDown,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChatMessage as ChatMessageComponent } from "./ChatMessage";
import { DocumentUpload } from "./DocumentUpload";
import { ChatMessage, UploadedDocument, RAGResponse } from "@/types";
import { DocumentProcessor } from "@/lib/documentProcessor";
import { SemanticChunker } from "@/lib/chunker";
import { vectorStore } from "@/lib/vectorStore";
import { generateEmbedding } from "@/lib/embeddings";
import { generateId, cn } from "@/lib/utils";
import { DEFAULT_MODEL, AVAILABLE_MODELS } from "@/lib/models";
import {
  saveChunks,
  loadChunks,
  clearChunks,
  saveSessionMeta,
  loadSessionMeta,
} from "@/lib/storage";
import { toast } from "sonner";

interface ChatInterfaceProps {
  onBack: () => void;
}

export function ChatInterface({ onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "upload">("upload");
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    (async () => {
      try {
        const meta = await loadSessionMeta();
        if (meta && meta.chunkCount > 0) {
          const chunks = await loadChunks();
          if (chunks.length > 0) {
            vectorStore.replaceAll(chunks);
            setDocuments([
              {
                id: generateId(),
                name: meta.documentNames[0] || "Restored document",
                type: "application/octet-stream",
                size: 0,
                chunks,
                processed: true,
              },
            ]);
            setActiveTab("chat");
            toast.success("Previous session restored.");
          }
        }
      } catch {
        // IndexedDB unavailable or empty — start fresh
      } finally {
        setIsRestoring(false);
      }
    })();
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const { text, title } = await DocumentProcessor.extractText(file);
      const chunker = new SemanticChunker();
      const chunks = chunker.chunk({
        text,
        fileName: file.name,
        documentTitle: title,
      });

      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk.text);
        chunk.embedding = embedding;
      }

      vectorStore.addChunks(chunks);
      await saveChunks(chunks);
      await saveSessionMeta({
        documentNames: [file.name],
        chunkCount: vectorStore.size,
      });

      const doc: UploadedDocument = {
        id: generateId(),
        name: file.name,
        type: file.type,
        size: file.size,
        chunks,
        processed: true,
      };

      setDocuments((prev) => [...prev, doc]);
      setActiveTab("chat");
      toast.success(`"${file.name}" processed and saved.`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to process document. Please try again.");
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isAnswering) return;
    if (vectorStore.size === 0) {
      toast.error("Please upload a document first.");
      return;
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsAnswering(true);

    try {
      const queryEmbedding = await generateEmbedding(userMessage.content);
      const scoredChunks = vectorStore.searchWithScores(queryEmbedding, 5);

      if (scoredChunks.length === 0) {
        const noDataMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: "No indexed chunks found. Please re-upload your document to rebuild the search index.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, noDataMessage]);
        setIsAnswering(false);
        return;
      }

      const context = scoredChunks
        .map(
          (sc, i) =>
            `[Chunk ${i + 1}]
File: ${sc.chunk.metadata.fileName}
Section: ${sc.chunk.metadata.section}
Page: ${sc.chunk.metadata.pageNumber}
Paragraph: ${sc.chunk.metadata.paragraphIndex}
Content: ${sc.chunk.text}`
        )
        .join("\n\n");

      const scores = scoredChunks.map((sc) => sc.score);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
          context,
          scores,
          chatHistory: messages,
          model: selectedModel,
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data: RAGResponse = await response.json();

      const citations = (data.citations || []).map((c) => {
        const matched = scoredChunks.find(
          (sc) =>
            sc.chunk.metadata.fileName === c.fileName &&
            sc.chunk.metadata.pageNumber === c.pageNumber &&
            sc.chunk.metadata.paragraphIndex === c.paragraphIndex
        );
        return {
          ...c,
          confidence:
            c.confidence || (matched ? Math.min(Math.round(matched.score * 100), 99) : 85),
        };
      });

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.answer,
        citations,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please check your API key and try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAnswering(false);
    }
  }, [input, isAnswering, messages, selectedModel]);

  const handleClear = useCallback(async () => {
    setMessages([]);
    setDocuments([]);
    vectorStore.clear();
    await clearChunks();
    setActiveTab("upload");
    toast.success("Session reset. All data cleared.");
  }, []);

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel);
  const processedCount = documents.filter((d) => d.processed).length;
  const totalChunks = documents.reduce((acc, d) => acc + d.chunks.length, 0);

  if (isRestoring) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Database className="h-8 w-8 text-primary-400 animate-pulse" />
          <p className="text-sm text-slate-400">Restoring session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-md shadow-primary-200">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900">MyDocReader</h1>
              <p className="text-xs text-slate-400">
                {processedCount > 0
                  ? `${processedCount} doc(s) | ${totalChunks} chunks`
                  : "No documents loaded"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {currentModel?.name || "Select Model"}
              <ChevronDown className="h-3 w-3" />
            </button>
            {showModelPicker && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowModelPicker(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-50 w-64 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 py-1">
                  {AVAILABLE_MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m.id);
                        setShowModelPicker(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-slate-50",
                        m.id === selectedModel
                          ? "text-primary-600 bg-primary-50"
                          : "text-slate-600"
                      )}
                    >
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-slate-400">{m.provider}</p>
                      </div>
                      {m.id === selectedModel && (
                        <div className="h-2 w-2 rounded-full bg-primary-500" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <Badge variant="secondary" className="hidden sm:flex">
            <Sparkles className="h-3 w-3 mr-1" />
            RAG Active
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="text-slate-400 hover:text-red-500"
            title="Clear all data"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex border-b border-slate-100 bg-slate-50/50">
        <button
          onClick={() => setActiveTab("upload")}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === "upload"
              ? "text-primary-600"
              : "text-slate-400 hover:text-slate-600"
          )}
        >
          Documents
          {activeTab === "upload" && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          disabled={processedCount === 0}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === "chat"
              ? "text-primary-600"
              : "text-slate-400 hover:text-slate-600",
            processedCount === 0 && "cursor-not-allowed opacity-50"
          )}
        >
          Chat
          {activeTab === "chat" && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
            />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "upload" ? (
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-lg space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  Upload Documents
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Your files stay in your browser. Data persists across refreshes.
                </p>
              </div>
              <DocumentUpload
                onUpload={handleUpload}
                isProcessing={isProcessing}
                uploadedFiles={documents.map((d) => d.name)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <ScrollArea ref={scrollRef} className="flex-1 px-4 sm:px-6 py-4">
              <div className="mx-auto max-w-3xl space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 mb-4">
                        <Sparkles className="h-8 w-8 text-primary-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Ready to Ask Questions
                      </h3>
                      <p className="text-sm text-slate-400 max-w-sm">
                        Ask anything about your uploaded documents. Get precise
                        answers with citations and confidence scores.
                      </p>
                    </motion.div>
                  )}
                  {messages.map((message) => (
                    <ChatMessageComponent key={message.id} message={message} />
                  ))}
                </AnimatePresence>
                {isAnswering && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-md shadow-primary-200">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex gap-1.5">
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-primary-400"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-primary-500"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-primary-600"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-slate-100 bg-white p-4 sm:p-6">
              <div className="mx-auto flex max-w-3xl gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={
                    processedCount > 0
                      ? "Ask a question about your document..."
                      : "Upload a document to start asking questions..."
                  }
                  disabled={isAnswering || processedCount === 0}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={
                    !input.trim() || isAnswering || processedCount === 0
                  }
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-slate-100 bg-white py-2 px-4 text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
          <span>Model: {currentModel?.name || DEFAULT_MODEL}</span>
          <span>&middot;</span>
          <span>IndexedDB</span>
          <span>&middot;</span>
          <span>Build By Aniket Ojha</span>
        </div>
      </footer>
    </div>
  );
}
