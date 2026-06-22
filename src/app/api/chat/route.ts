import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_MODEL } from "@/lib/models";

interface CitationData {
  fileName: string;
  section: string;
  pageNumber: number;
  paragraphIndex: number;
  confidence: number;
}

interface ChatHistoryEntry {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  question: string;
  context: string;
  scores: number[];
  chatHistory: ChatHistoryEntry[];
  model?: string;
}

function isFreeModel(modelId: string): boolean {
  return modelId.includes(":free");
}

function shouldFallback(status: number): boolean {
  return [429, 500, 502, 503].includes(status);
}

function isTimeout(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function isQuotaOrUnavailable(body: string): boolean {
  return (
    body.includes("quota") ||
    body.includes("rate_limit") ||
    body.includes("insufficient_quota") ||
    body.includes("free") ||
    body.includes("not found") ||
    body.includes("model_not_found") ||
    body.includes("unavailable")
  );
}

async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string,
  history: ChatHistoryEntry[],
  modelId: string,
  apiKey: string,
  signal: AbortSignal
): Promise<string> {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "MyDocReader",
      },
      signal,
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: "user", content: userPrompt },
        ],
        max_tokens: 2048,
        temperature: 0.1,
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    const error: any = new Error(
      `OpenRouter ${response.status}: ${errBody.slice(0, 500)}`
    );
    error.status = response.status;
    error.body = errBody;
    throw error;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  history: ChatHistoryEntry[],
  groqKey: string,
  signal: AbortSignal
): Promise<string> {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      signal,
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: "user", content: userPrompt },
        ],
        max_tokens: 2048,
        temperature: 0.1,
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Groq ${response.status}: ${errBody.slice(0, 500)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

function parseCitations(
  text: string,
  defaultConfidence: number
): { cleanText: string; citations: CitationData[] } {
  const citations: CitationData[] = [];
  let cleanText = text;

  const sourceBlocks: string[] = [];
  const sourceRegex = /Source:[\s\S]*?(?=(?:\n\n|\n---|$))/gi;
  let match;
  while ((match = sourceRegex.exec(text)) !== null) {
    sourceBlocks.push(match[0]);
  }

  for (const block of sourceBlocks) {
    cleanText = cleanText.replace(block, "").trim();
  }
  cleanText = cleanText.replace(/\n---\n?/g, "").trim();

  for (const block of sourceBlocks) {
    let fileName = "";
    let section = "";
    let pageNumber = 1;
    let paragraphIndex = 1;

    const fileMatch = block.match(/File:\s*([^\n,]+)/i);
    if (fileMatch) fileName = fileMatch[1].trim();

    const sectionMatch = block.match(/(?:Section|Topic):\s*([^\n,]+)/i);
    if (sectionMatch) section = sectionMatch[1].trim();

    const pageMatch = block.match(/Page:\s*(\d+)/i);
    if (pageMatch) pageNumber = parseInt(pageMatch[1], 10);

    const paraMatch = block.match(/(?:Paragraph|Para):\s*(\d+)/i);
    if (paraMatch) paragraphIndex = parseInt(paraMatch[1], 10);

    if (fileName) {
      citations.push({
        fileName,
        section,
        pageNumber,
        paragraphIndex,
        confidence: defaultConfidence,
      });
    }
  }

  return { cleanText, citations };
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { question, context, scores, chatHistory, model } = body;

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (!openRouterKey) {
      return NextResponse.json(
        {
          answer:
            "Please configure your OPENROUTER_API_KEY in the environment variables.",
          citations: [],
          error: "API key not configured",
        },
        { status: 200 }
      );
    }

    const modelId = model || DEFAULT_MODEL;

    if (!isFreeModel(modelId)) {
      return NextResponse.json(
        {
          answer: "Only free models are supported. Please select a model with ':free' suffix.",
          citations: [],
          error: "Paid model rejected",
        },
        { status: 200 }
      );
    }

    const historyContext = chatHistory
      .slice(-6)
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const systemPrompt = `You are a precise document analysis assistant. Answer STRICTLY based ONLY on the provided context below.

RULES:
- ONLY use information from the provided context. NEVER use your own knowledge.
- If the context does not contain the answer, respond with: "Information not found in uploaded documents."
- Do NOT make up, infer, or guess. Do NOT add explanations when information is not found.
- Synthesize and summarize in your own words. Do NOT copy large blocks of text.
- Use [1], [2], [3] numbers in your answer to reference the corresponding Reference from the context.

ANSWER STRUCTURE (follow this template exactly):
## Answer
Direct answer to the question (1-2 sentences).

## Reason
Brief explanation with supporting details. Use [1], [2] citations.

## Key Points
• Point 1
• Point 2
• Point 3

## Conclusion
Final verdict or summary.

After your answer, add a blank line, then list sources like this (strict format, one field per line):
Source:
File: Government of State of RP GRAND.pdf
Section: General
Page: 3
Paragraph: 31

Each source must have its own line for each field. Do NOT combine fields on one line.`;

    const userPrompt = `Context:
${context}

Chat History (for reference):
${historyContext}

Question: ${question}

Follow the answer structure template exactly. Use [1], [2] etc. to cite references in your answer. Append source list at the end with one field per line.`;

    let responseText: string;
    let usedFallback = false;
    const controller = new AbortController();
    const TIMEOUT_MS = 30000;

    setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      responseText = await callOpenRouter(
        systemPrompt,
        userPrompt,
        chatHistory,
        modelId,
        openRouterKey,
        controller.signal
      );
    } catch (primaryError: any) {
      const status = primaryError.status || 0;
      const errBody = primaryError.body || "";
      const isAbort = isTimeout(primaryError);
      const shouldTryGroq =
        (shouldFallback(status) || isAbort || isQuotaOrUnavailable(errBody)) &&
        groqKey;

      if (shouldTryGroq) {
        console.log(
          `OpenRouter free model failed (${status}). Falling back to Groq.`
        );
        try {
          const fallbackController = new AbortController();
          setTimeout(() => fallbackController.abort(), TIMEOUT_MS);
          responseText = await callGroq(
            systemPrompt,
            userPrompt,
            chatHistory,
            groqKey,
            fallbackController.signal
          );
          usedFallback = true;
        } catch {
          console.error("Groq also failed.");
          return NextResponse.json(
            {
              answer:
                "Limit Reached",
              citations: [],
              error: "All providers unavailable",
            },
            { status: 200 }
          );
        }
      } else {
        return NextResponse.json(
          {
            answer:
              "Limit Reached",
            citations: [],
            error: primaryError.message,
          },
          { status: 200 }
        );
      }
    }

    const avgScore =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
    const defaultConfidence = Math.min(Math.round(avgScore * 100), 99);

    const { cleanText, citations } = parseCitations(
      responseText,
      defaultConfidence
    );

    return NextResponse.json({
      answer: cleanText,
      citations,
      provider: usedFallback ? "groq" : "openrouter",
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        answer:
          "Sorry, I encountered an error while processing your question. Please try again.",
        citations: [],
        error: error?.message || "Internal server error",
      },
      { status: 200 }
    );
  }
}
