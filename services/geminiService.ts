import { GoogleGenAI } from "@google/genai";

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

export const generateContent = async (prompt: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    // Return a mock response if no API key is available for demo purposes
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Simulated Response: Please configure process.env.API_KEY to get real responses from Gemini. \n\nBased on your prompt, here is a structured outline...");
        }, 1000);
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error generating content: ${(error as Error).message}`;
  }
};
