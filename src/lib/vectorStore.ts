import { DocumentChunk, ScoredChunk } from "@/types";

export class InMemoryVectorStore {
  private chunks: DocumentChunk[] = [];

  addChunks(chunks: DocumentChunk[]): void {
    this.chunks.push(...chunks);
  }

  replaceAll(chunks: DocumentChunk[]): void {
    this.chunks = chunks;
  }

  clear(): void {
    this.chunks = [];
  }

  get size(): number {
    return this.chunks.length;
  }

  getAll(): DocumentChunk[] {
    return [...this.chunks];
  }

  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vectors must have same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  search(queryEmbedding: number[], topK: number = 5): DocumentChunk[] {
    return this.searchWithScores(queryEmbedding, topK).map((s) => s.chunk);
  }

  searchWithScores(queryEmbedding: number[], topK: number = 5): ScoredChunk[] {
    const scored = this.chunks
      .filter((chunk) => chunk.embedding?.length)
      .map((chunk) => ({
        chunk,
        score: this.cosineSimilarity(queryEmbedding, chunk.embedding!),
      }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  }
}

export const vectorStore = new InMemoryVectorStore();
