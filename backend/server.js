import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/generate', async (req, res) => {
  try {
    console.log("Analyzing fabric with Gemini Vision...");
    const { fabricImage, templateType } = req.body;

    if (!fabricImage) {
      return res.status(400).json({ error: "fabricImage is required" });
    }

    const base64PrefixRegex = /^data:image\/(png|jpeg|jpg|webp);base64,/;
    const cleanedBase64 = fabricImage.replace(base64PrefixRegex, '');

    const prompt = `You are a high-end fashion consultant specializing in Pakistani fashion with a modern touch. Analyze the provided image of unstitched fabric (color, texture, pattern). The user is interested in making a ${templateType || 'dress'}. Provide a structured, aesthetic style report in JSON format with the following keys: 'design_name' (a catchy name for the outfit), 'fabric_analysis' (2 sentences on the pattern/color), 'tailoring_instructions' (specific cut, neckline, sleeves, and modern details for the tailor), and 'styling_accessories' (recommend jewelry and explicitly suggest a matching handbag in neutral elegant tones like black, off-white, or brown).`;

    const response = await ai.models.generateContent({
      // Is line ko update karein
      model: 'gemini-2.5-flash', // ya 'gemini-2.5-flash' jo aapne pehle likha tha, // Updated to stable 1.5-flash
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanedBase64,
                mimeType: "image/jpeg"
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const reportJson = response.text;
    const parsedReport = JSON.parse(reportJson);

    console.log("Success! Generated style report.");
    res.json({ report: parsedReport });

  } catch (error) {
    console.error("Error in /api/generate:", error.message || error);
    res.status(500).json({ error: "Failed to analyze fabric." });
  }
});

// FIX: Google Cloud Run requires the server to listen on a dynamic PORT environment variable
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});