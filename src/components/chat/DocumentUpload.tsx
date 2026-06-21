"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize, isValidFileType } from "@/lib/utils";

interface DocumentUploadProps {
  onUpload: (file: File) => Promise<void>;
  isProcessing: boolean;
  uploadedFiles: string[];
}

export function DocumentUpload({ onUpload, isProcessing, uploadedFiles }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!isValidFileType(file.type)) {
        setError("Unsupported file type. Please upload PDF, DOCX, or TXT files.");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError("File size exceeds 50MB limit.");
        return;
      }
      try {
        await onUpload(file);
      } catch (err) {
        setError("Failed to process file. Please try again.");
      }
    },
    [onUpload]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <div className="space-y-4">
      <motion.div
        initial={false}
        animate={{
          borderColor: dragActive
            ? "rgb(59, 130, 246)"
            : error
            ? "rgb(239, 68, 68)"
            : "rgb(226, 232, 240)",
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="relative rounded-2xl border-2 border-dashed bg-slate-50/50 p-8 transition-all"
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={isProcessing}
        />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
            <Upload className="h-6 w-6 text-primary-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">
              {dragActive ? "Drop your file here" : "Drag & drop your document"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              or click to browse &bull; PDF, DOCX, TXT (max 50MB)
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isProcessing && (
        <div className="flex items-center gap-3 rounded-xl bg-primary-50 px-4 py-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          <span className="text-sm text-primary-700">Processing document...</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Uploaded Documents
          </p>
          {uploadedFiles.map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-emerald-700 truncate">{name}</span>
              </div>
              <Badge variant="success" className="ml-auto flex-shrink-0">
                Ready
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
