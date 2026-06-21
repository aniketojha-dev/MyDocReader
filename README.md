# MyDocReader

**AI-Powered Document Intelligence Platform**

MyDocReader is a modern, production-ready web application that allows users to upload PDF, DOCX, and TXT documents and ask questions about the uploaded content using Retrieval-Augmented Generation (RAG). Built with Next.js, TypeScript, Tailwind CSS, and OpenRouter AI.

## Features

- **📄 Multi-Format Support** — Upload PDF, DOCX, and TXT files
- **🧠 RAG-Powered Q&A** — Ask questions and get answers from your documents
- **📋 Automatic Citations** — Every answer includes file name, section, page, and paragraph references
- **🔒 100% Private** — Documents never leave your browser; embedding is local, no cloud vector database
- **🔄 Model Agnostic** — Switch between DeepSeek, Qwen, Llama, Mistral, Gemini via UI dropdown
- **⚡ Fast Processing** — Semantic chunking and local vector similarity search
- **🎨 Premium UI** — Light theme, smooth animations, responsive design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Library | shadcn/ui + Radix Primitives |
| Animations | Framer Motion |
| LLM Provider | OpenRouter API (model-swappable) |
| Default Model | DeepSeek Chat V3 |
| Embeddings | Transformers.js (all-MiniLM-L6-v2, local browser) |
| Vector Store | In-memory (custom cosine similarity) |
| Document Parsing | pdf.js, mammoth.js |
| Hosting | Vercel |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser                             │
│  ┌──────────┐    ┌──────────┐    ┌────────────────┐ │
│  │ Upload    │───▶│ Extract  │───▶│ Chunk & Embed  │ │
│  │ Document  │    │ Text     │    │ (Transformers) │ │
│  └──────────┘    └──────────┘    └───────┬────────┘ │
│                                          │           │
│  ┌──────────┐    ┌──────────┐            │           │
│  │ Chat UI  │◀───│ Answer   │◀───────────┘           │
│  │ + Cite   │    │ + Cite   │                        │
│  └──────────┘    └────┬─────┘                        │
│                       │                              │
│              ┌────────▼────────┐                      │
│              │  OpenRouter API │                      │
│              │  (Server-side)  │                      │
│              │  DeepSeek/Qwen  │                      │
│              │  Llama/Mistral  │                      │
│              │  Gemini/etc.    │                      │
│              └─────────────────┘                      │
└─────────────────────────────────────────────────────┘
```

### Data Flow

1. **Upload** — User uploads a document via the browser
2. **Extract** — Text is extracted using pdf.js (PDF), mammoth.js (DOCX), or native File API (TXT)
3. **Chunk** — Text is split into semantic chunks with metadata (section, page, paragraph)
4. **Embed** — Each chunk is embedded locally in the browser using Transformers.js (all-MiniLM-L6-v2)
5. **Store** — Embeddings and chunks are stored in browser memory (in-memory vector store)
6. **Query** — User asks a question; query is embedded locally
7. **Search** — Cosine similarity search finds relevant chunks
8. **Generate** — Retrieved chunks + question are sent to OpenRouter API for answer generation with citations

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- OpenRouter API key ([get one here](https://openrouter.ai/keys))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mydocreader.git
cd mydocreader
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Add your OpenRouter API key to `.env.local`:

```
OPENROUTER_API_KEY=sk-or-v1-your_key_here
```

> Get your API key at: https://openrouter.ai/keys

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add the environment variable `OPENROUTER_API_KEY` in Vercel project settings
4. Deploy — no additional configuration needed

### Manual Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes |

## Model Configuration

Models are configured in `src/lib/models.ts`. Add or remove models without changing any other code:

```ts
export const AVAILABLE_MODELS: ModelOption[] = [
  { id: "deepseek/deepseek-chat-v3", name: "DeepSeek Chat V3", provider: "DeepSeek" },
  { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B", provider: "Alibaba" },
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B", provider: "Meta" },
];
```

Any model available on [OpenRouter](https://openrouter.ai/models) can be added.

## Project Structure

```
mydocreader/
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/chat/         # Chat API route (server-side, OpenRouter)
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── loading.tsx        # Loading state
│   │   └── page.tsx           # Main page (landing + chat routing)
│   ├── components/
│   │   ├── chat/              # Chat interface components
│   │   ├── landing/           # Landing page components
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── chunker.ts         # Semantic text chunking
│   │   ├── documentProcessor.ts # PDF/DOCX/TXT extraction
│   │   ├── embeddings.ts      # Local embeddings (Transformers.js)
│   │   ├── models.ts          # LLM model configuration
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

## Future Enhancements

- **Persistent Storage** — Add localStorage/indexedDB for session persistence
- **Multiple Document Support** — Query across multiple documents simultaneously
- **Document Preview** — View document text alongside chat
- **Export Conversations** — Download chat history as PDF or Markdown
- **Dark Mode** — Theme toggle for dark mode support
- **Advanced Chunking** — Implement hierarchical chunking with overlap strategies
- **Streaming Responses** — Real-time streaming of AI responses
- **File Renaming** — Allow users to rename uploaded documents
- **Batch Upload** — Upload multiple files at once
- **Offline Mode** — PWA support for offline document processing

## License

MIT

## Author

**Aniket Ojha**

---

<p align="center">Build By Aniket Ojha</p>
