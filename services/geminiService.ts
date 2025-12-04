import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      console.warn("API_KEY not found in environment variables.");
      return null;
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export interface GenerateOptions {
  useThinking?: boolean;
}

export const generateContent = async (prompt: string, options?: GenerateOptions): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Simulated Response: Please configure process.env.API_KEY to get real responses. \n\n(Thinking Mode would use Gemini 3.0 Pro here).");
        }, 1000);
    });
  }

  const model = options?.useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
  const config: any = {};
  
  if (options?.useThinking) {
    // Thinking Config for Gemini 3.0 Pro
    config.thinkingConfig = { thinkingBudget: 32768 };
    // Explicitly NOT setting maxOutputTokens as per instructions
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error generating content: ${(error as Error).message}`;
  }
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const streamChat = async function* (
  history: ChatMessage[], 
  newMessage: string, 
  options?: GenerateOptions
): AsyncGenerator<string, void, unknown> {
  const ai = getClient();
  if (!ai) {
    yield "Simulated Chat: Please configure API_KEY.";
    return;
  }

  const model = options?.useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
  const config: any = {};
  
  if (options?.useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  // Convert internal message format to API history format
  const chatHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  try {
    const chat = ai.chats.create({
      model,
      config,
      history: chatHistory
    });

    const result = await chat.sendMessageStream({ message: newMessage });
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Chat Stream Error:", error);
    yield `Error: ${(error as Error).message}`;
  }
};