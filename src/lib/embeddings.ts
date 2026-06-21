let embedder: ((text: string) => Promise<number[]>) | null = null;

async function getEmbedder(): Promise<(text: string) => Promise<number[]>> {
  if (embedder) return embedder;

  const { pipeline } = await import("@xenova/transformers");
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  embedder = async (text: string): Promise<number[]> => {
    const result = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });
    return Array.from(result.data);
  };

  return embedder;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const fn = await getEmbedder();
  return fn(text);
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const fn = await getEmbedder();
  const results: number[][] = [];
  for (const text of texts) {
    results.push(await fn(text));
  }
  return results;
}
