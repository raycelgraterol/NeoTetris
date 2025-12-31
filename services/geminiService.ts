
import { GoogleGenAI } from "@google/genai";

export const getTetrisTip = async (score: number, level: number): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Current Tetris status: Score ${score}, Level ${level}. Give me one short, punchy strategy tip or motivational quote in Spanish for a Tetris player. Keep it under 15 words.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text || "¡Sigue colocando piezas con precisión!";
  } catch (error) {
    console.error("AI Error:", error);
    return "¡Concéntrate y mantén la calma!";
  }
};
