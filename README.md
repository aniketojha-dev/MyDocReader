# MyDocReader

AI-powered document intelligence platform. Upload PDF, DOCX, or TXT files and ask questions about your content. Answers are grounded in your documents with automatic citations.

---

## Core Concept

Retrieval-Augmented Generation (RAG) pipeline running entirely in the browser:

1. **Ingest** — Extract text from uploaded documents via pdf.js / mammoth.js
2. **Chunk** — Split text into semantic segments with section, page, and paragraph metadata
3. **Embed** — Generate local vector embeddings using Transformers.js (all-MiniLM-L6-v2)
4. **Store** — Persist chunks to IndexedDB; load into in-memory vector store on session restore
5. **Query** — Embed the user's question and retrieve top-5 chunks via cosine similarity
6. **Generate** — Send question + retrieved context to an LLM (OpenRouter free models primary, Groq fallback)
7. **Cite** — Every answer includes file name, section, page number, paragraph index, and confidence score

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Browser                                    │
│                                                                     │
│  ┌──────────┐    ┌──────────┐    ┌───────────┐    ┌────────────┐ │
│  │ Upload   │───▶│ Extract  │───▶│ Chunk +   │───▶│ IndexedDB  │ │
│  │ Document │    │ Text     │    │ Embed      │    │ Persist    │ │
│  └──────────┘    └──────────┘    └─────┬─────┘    └────────────┘ │
│                                        │                            │
│  ┌──────────┐    ┌──────────┐          │                            │
│  │ Chat UI  │◀───│ Answer   │◀─────────┘                            │
│  │ + Cites  │    │ + Cites  │                                       │
│  └──────────┘    └────┬─────┘                                       │
│                       │                                             │
│            ┌──────────▼──────────────────┐                          │
│            │  Server API Route            │                          │
│            │  OpenRouter (free model)     │                          │
│            │  ─── fallback on 429 ──▶ Groq │                          │
│            └─────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Embeddings | Transformers.js (local) | Zero API calls, fully private, no vector DB |
| Vector Store | In-memory + IndexedDB | Survives refresh, cleared on reset |
| Primary LLM | OpenRouter free models (`:free` suffix) | No cost, model-swappable via UI |
| Fallback LLM | Groq | Covers rate limits / outages |
| Persistence | IndexedDB | Page refresh safe, no cloud storage |
| Hosting | Vercel (serverless) | No server-side database needed |

---

## Technology Used

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI** | shadcn/ui, Radix Primitives, Framer Motion, Lucide Icons |
| **LLM Provider** | OpenRouter API (primary), Groq API (fallback) |
| **Embeddings** | Transformers.js (`Xenova/all-MiniLM-L6-v2`) |
| **Document Parsing** | pdf.js (PDF), mammoth.js (DOCX), File API (TXT) |
| **Storage** | IndexedDB (browser) |
| **Chunking** | Custom semantic chunker with metadata extraction |

---

## Quick Start

```bash
git clone https://github.com/aniketojha-dev/MyDocReader.git
cd MyDocReader
npm install
cp .env.example .env.local
# Add OPENROUTER_API_KEY and GROQ_API_KEY to .env.local
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key |
| `GROQ_API_KEY` | No | Groq API key (fallback) |

## Deployment

Deploy on Vercel — set the environment variables in the dashboard, no config changes needed.

---

## License

MIT — see [LICENSE](./LICENSE).

---

<p align="center">Built By Aniket Ojha</p>
