export interface DocumentChunk {
  id: string;
  text: string;
  embedding: number[];
  metadata: ChunkMetadata;
}

export interface ChunkMetadata {
  fileName: string;
  documentTitle: string;
  section: string;
  pageNumber: number;
  paragraphIndex: number;
}

export interface Citation {
  fileName: string;
  section: string;
  pageNumber: number;
  paragraphIndex: number;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: number;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  chunks: DocumentChunk[];
  processed: boolean;
}

export interface RAGResponse {
  answer: string;
  citations: Citation[];
  error?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

export interface ScoredChunk {
  chunk: DocumentChunk;
  score: number;
}
