import { GoogleGenAI } from "@google/genai";
import { Card } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBattleIntro = async (playerCards: Card[], enemyCards: Card[]): Promise<string> => {
  try {
    const playerNames = playerCards.map(c => c.name).join(', ');
    const enemyNames = enemyCards.map(c => c.name).join(', ');

    const prompt = `
      You are a hype announcer for a Marvel superhero arena card battle.
      Player Team: ${playerNames}.
      Enemy Team: ${enemyNames}.
      Write a short, high-energy 2-sentence intro for this match.
      Mention a key clash.
      Keep it under 30 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "The battle begins!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The arena awaits! Heroes assemble!";
  }
};

export const getTacticalAdvice = async (card: Card, gridState: string): Promise<string> => {
  try {
    const prompt = `
      The player just played ${card.name}.
      Give a 1-sentence tactical comment or a famous quote modified for this battle context.
      Keep it extremely short (max 15 words).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || `${card.name} enters the fray!`;
  } catch (error) {
    return `${card.name} is ready for battle!`;
  }
};
