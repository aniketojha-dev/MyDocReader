import { ModelOption } from "@/types";

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B",
    provider: "Meta (Free)",
  },
  {
    id: "openai/gpt-oss-120b:free",
    name: "GPT-OSS 120B",
    provider: "OpenAI (Free)",
  },
  {
    id: "openai/gpt-oss-20b:free",
    name: "GPT-OSS 20B",
    provider: "OpenAI (Free)",
  },
  {
    id: "qwen/qwen3-coder:free",
    name: "Qwen 3 Coder",
    provider: "Qwen (Free)",
  },
  {
    id: "google/gemma-4-31b-it:free",
    name: "Gemma 4 31B",
    provider: "Google (Free)",
  },
  {
    id: "nousresearch/hermes-3-llama-3.1-405b:free",
    name: "Hermes 3 405B",
    provider: "Nous Research (Free)",
  },
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "Nemotron 3 Super",
    provider: "NVIDIA (Free)",
  },
];

export const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
