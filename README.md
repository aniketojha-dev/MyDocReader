# MyDocReader

Upload PDF, DOCX, or TXT files and ask questions about your content. Answers are grounded in your documents with automatic citations.

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
│                         Browser                                    
│                                                                     
│  ┌──────────┐    ┌──────────┐    ┌───────────┐    ┌────────────┐ 
│  │ Upload   │───▶│ Extract  │───▶│ Chunk +   │───▶│ IndexedDB │
│  │ Document │    │ Text     │    │ Embed      │    │ Persist    │ 
│  └──────────┘    └──────────┘    └─────┬─────┘    └────────────┘ 
│                                        │                            
│  ┌──────────┐    ┌──────────┐          │                            
│  │ Chat UI  │◀───│ Answer   │◀─────────┘                            
│  │ + Cites  │    │ + Cites  │                                       
│  └──────────┘    └────┬─────┘                                       
│                       │                                             
│            ┌──────────▼──────────────────┐                          
│            │  Server API Route            │                          
│            │  OpenRouter (free model)     │                          
│            │  ─── fallback on 429 ──▶ Groq │                          
│            └─────────────────────────────┘                          
└──────────────────────────────────────────────────────────────────┘
```

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

Live Link Here : https://my-doc-reader-beige.vercel.app/

---

<p align="center">Built By Aniket Ojha</p>
