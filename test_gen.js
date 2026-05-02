import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: "AIzaSyAU4ERBfbdDNd6hq0dZ73x5mfJjqsAnxgA" });

async function list() {
  try {
    const prompt = "A cat.";
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: { numberOfImages: 1 }
    });
    console.log("generateImages length:", response.generatedImages?.length);
  } catch (error) {
    console.error("API Error:");
    console.error(error);
  }
}
list().catch(console.error);
