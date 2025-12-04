import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export interface GenerateOptions {
  useThinking?: boolean;
}

interface GenerationConfig {
    thinkingConfig?: {
        thinkingBudget: number;
    };
}

export const generateContent = async (prompt: string, options?: GenerateOptions): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const model = options?.useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
  const config: GenerationConfig = {};
  
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const model = options?.useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
  const config: GenerationConfig = {};
  
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