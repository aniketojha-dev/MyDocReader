import { ChunkMetadata, DocumentChunk } from "@/types";
import { generateId } from "./utils";

interface ChunkInput {
  text: string;
  fileName: string;
  documentTitle: string;
}

export class SemanticChunker {
  private readonly maxChunkSize: number;
  private readonly overlapSize: number;

  constructor(maxChunkSize = 1000, overlapSize = 100) {
    this.maxChunkSize = maxChunkSize;
    this.overlapSize = overlapSize;
  }

  chunk(input: ChunkInput): DocumentChunk[] {
    const sections = this.splitIntoSections(input.text);
    const chunks: DocumentChunk[] = [];
    let pageCounter = 1;
    let paragraphCounter = 1;

    for (const section of sections) {
      const sectionChunks = this.splitSectionIntoChunks(section.text);
      const sectionName = section.heading || "General";

      for (const chunkText of sectionChunks) {
        if (!chunkText.trim()) continue;

        const metadata: ChunkMetadata = {
          fileName: input.fileName,
          documentTitle: input.documentTitle,
          section: sectionName,
          pageNumber: this.detectPageNumber(section.text, chunkText, pageCounter),
          paragraphIndex: paragraphCounter++,
        };

        chunks.push({
          id: generateId(),
          text: chunkText.trim(),
          embedding: [],
          metadata,
        });
      }
    }

    return chunks;
  }

  private splitIntoSections(text: string): { heading: string; text: string }[] {
    const lines = text.split("\n");
    const sections: { heading: string; text: string }[] = [];
    let currentHeading = "General";
    let currentText: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      const pageMatch = trimmed.match(/^\[Page (\d+)\]/i);

      if (pageMatch) {
        if (currentText.length > 0) {
          sections.push({ heading: currentHeading, text: currentText.join("\n") });
          currentText = [];
        }
        currentText.push(trimmed);
        continue;
      }

      if (
        trimmed.length > 0 &&
        trimmed.length < 100 &&
        /^[A-Z][A-Za-z\s\-:]+$/.test(trimmed) &&
        !trimmed.endsWith(".")
      ) {
        if (currentText.length > 0) {
          sections.push({ heading: currentHeading, text: currentText.join("\n") });
          currentText = [];
        }
        currentHeading = trimmed;
      } else {
        currentText.push(trimmed);
      }
    }

    if (currentText.length > 0) {
      sections.push({ heading: currentHeading, text: currentText.join("\n") });
    }

    return sections;
  }

  private splitSectionIntoChunks(text: string): string[] {
    const paragraphs = text.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      if (currentChunk.length + trimmed.length > this.maxChunkSize && currentChunk) {
        chunks.push(currentChunk);
        currentChunk = trimmed.slice(0, this.overlapSize);
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + trimmed;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  private detectPageNumber(
    sectionText: string,
    chunkText: string,
    defaultPage: number
  ): number {
    const pageMatch = chunkText.match(/\[Page (\d+)\]/i);
    if (pageMatch) {
      return parseInt(pageMatch[1], 10);
    }
    const sectionPageMatch = sectionText.match(/\[Page (\d+)\]/i);
    if (sectionPageMatch) {
      return parseInt(sectionPageMatch[1], 10);
    }
    return defaultPage;
  }
}
