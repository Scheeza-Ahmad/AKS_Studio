// Optional manual smoke test. Never commit API keys.
import { GoogleGenAI } from '@google/genai';
if (!process.env.GEMINI_API_KEY) throw new Error('Set GEMINI_API_KEY before running this script.');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: 'Reply with OK.' });
console.log(response.text);
