import axios from "axios";
import { aiConfig } from "../config";

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatCompletionsRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  stream?: boolean;
}

export async function createChatCompletion(
  body: ChatCompletionsRequest,
  apiKey?: string
) {
  const key = apiKey || aiConfig.apiKey;
  if (!key) {
    throw new Error("AI API key 未配置，请设置 VITE_AI_API_KEY 或传入 apiKey 参数");
  }

  const url = `${aiConfig.baseUrl}/chat/completions`;
  const res = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
  });
  return res.data;
}


