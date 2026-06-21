# MyDocReader

**AI-Powered Document Intelligence Platform**

MyDocReader is a modern, production-ready web application that lets you upload PDF, DOCX, and TXT documents and ask questions about their content using Retrieval-Augmented Generation (RAG) — all in your browser.

## Features

- **📄 Multi-Format Support** — Upload PDF, DOCX, and TXT files
- **🧠 RAG-Powered Q&A** — Ask questions and get answers grounded in your documents
- **📋 Automatic Citations** — Every answer includes file, section, page, and paragraph references with confidence scores
- **🔒 100% Private** — Documents never leave your browser; local embeddings, no cloud vector database
- **🔄 Dual-Provider Fallback** — OpenRouter free models primary, Groq fallback on rate limits
- **💾 Persistent Storage** — IndexedDB saves chunks across page refreshes; clean reset available
- **⚡ Fast Processing** — Semantic chunking and local cosine similarity vector search
- **🎨 Premium UI** — Warm beige/cream theme, smooth animations, responsive design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Library | shadcn/ui + Radix Primitives |
| Animations | Framer Motion |
| LLM Provider | OpenRouter API (free models) + Groq fallback |
| Default Model | `meta-llama/llama-3.3-70b-instruct:free` |
| Embeddings | Transformers.js (all-MiniLM-L6-v2, local in-browser) |
| Vector Store | In-memory (custom cosine similarity) |
| Persistence | IndexedDB |
| Document Parsing | pdf.js, mammoth.js |
| Hosting | Vercel |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌────────┐ │
│  │ Upload    │───▶│ Extract  │───▶│ Chunk &  │───▶│IndexedDB│ │
│  │ Document  │    │ Text     │    │ Embed    │    │ Store   │ │
│  └──────────┘    └──────────┘    └─────┬────┘    └────────┘ │
│                                        │                      │
│  ┌──────────┐    ┌──────────┐          │                      │
│  │ Chat UI  │◀───│ Answer   │◀─────────┘                      │
│  │ + Cites  │    │ + Cites  │                                  │
│  └──────────┘    └────┬─────┘                                  │
│                       │                                        │
│            ┌──────────▼──────────┐                              │
│            │  OpenRouter (free)  │                              │
│            │  ── 429/5xx ──▶ Groq │                              │
│            └─────────────────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Upload** — User uploads a PDF, DOCX, or TXT file
2. **Extract** — Text extracted via pdf.js, mammoth.js, or native File API
3. **Chunk** — Text split into semantic chunks with metadata (section, page, paragraph)
4. **Embed** — Each chunk embedded locally via Transformers.js (all-MiniLM-L6-v2)
5. **Store** — Chunks saved to IndexedDB (survives page refresh) and in-memory vector store
6. **Query** — User asks a question; query is embedded locally
7. **Search** — Cosine similarity search finds the 5 most relevant chunks
8. **Generate** — Retrieved chunks + question sent to OpenRouter (free model); falls back to Groq on rate limits
9. **Cite** — Answers include citations with file, section, page, paragraph, and confidence %

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- OpenRouter API key ([get one free](https://openrouter.ai/keys))
- Groq API key ([get one free](https://console.groq.com/keys)) — optional, for fallback

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aniketojha-dev/MyDocReader.git
   cd MyDocReader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your API keys to `.env.local`:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your_key_here
   GROQ_API_KEY=gsk_your_key_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes |
| `GROQ_API_KEY` | Groq API key (fallback) | No |

## Model Configuration

Models are configured in `src/lib/models.ts`. All models use the `:free` suffix (OpenRouter free tier):

```ts
export const AVAILABLE_MODELS: ModelOption[] = [
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B", provider: "Meta (Free)" },
  { id: "openai/gpt-oss-120b:free", name: "GPT-OSS 120B", provider: "OpenAI (Free)" },
  { id: "qwen/qwen3-coder:free", name: "Qwen 3 Coder", provider: "Qwen (Free)" },
  // ...
];
```

Any free model on [OpenRouter](https://openrouter.ai/models?supported_parameters=free) can be added with the `:free` suffix. The API route validates that only `:free` models are used.

## Project Structure

```
mydocreader/
├── src/
│   ├── app/
│   │   ├── api/chat/         # Chat API route (OpenRouter + Groq fallback)
│   │   ├── globals.css        # Global styles (warm beige theme)
│   │   ├── layout.tsx         # Root layout
│   │   ├── loading.tsx        # Loading state
│   │   └── page.tsx           # Landing page + chat routing
│   ├── components/
│   │   ├── chat/              # Chat interface, messages, citations, upload
│   │   ├── landing/           # Landing page components
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── chunker.ts         # Semantic text chunking
│   │   ├── documentProcessor.ts # PDF/DOCX/TXT extraction
│   │   ├── embeddings.ts      # Local Transformers.js embeddings
│   │   ├── models.ts          # Free model configuration
│   │   ├── storage.ts         # IndexedDB persistence
│   │   ├── utils.ts           # Utility functions
│   │   └── vectorStore.ts     # In-memory vector store
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── .env.example               # Environment template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vercel.json                # Vercel deployment config
```

## Deployment

### Deploy to Vercel

1. Push the code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables (`OPENROUTER_API_KEY`, `GROQ_API_KEY`) in Vercel project settings
4. Deploy — no additional configuration needed

### Manual Build

```bash
npm run build
npm start
```

## License

MIT

## Author

**Aniket Ojha**
