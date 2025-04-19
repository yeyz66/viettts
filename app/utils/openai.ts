import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources/chat/completions';

// Environment variable fallbacks
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

// Configuration validation
if (!OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set in environment variables');
}

// Create a configured OpenAI client instance
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
});

// Helper function to use the configured model or a specific one
export const createChatCompletion = async (
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options?: Partial<Omit<OpenAI.Chat.Completions.ChatCompletionCreateParams, 'messages' | 'model' | 'stream'>>
): Promise<ChatCompletion> => {
  return openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages,
    stream: false, // 确保我们不使用流式响应
    ...options,
  });
};

// Export configured values for use in other parts of the application
export const openaiConfig = {
  apiKey: OPENAI_API_KEY,
  baseUrl: OPENAI_BASE_URL,
  defaultModel: OPENAI_MODEL,
}; 