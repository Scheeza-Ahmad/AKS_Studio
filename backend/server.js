import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { parseFabricImage } from './validation.js';
import { generateReport } from './providers.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '14mb' }));
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0352686033' });
app.get('/health', (_req, res) => res.json({ status: 'ok', aiConfigured: Boolean(ai || process.env.XAI_API_KEY) }));
async function requireUser(req, res, next) {
  const token = /^Bearer (\S+)$/.exec(req.get('authorization') || '')?.[1];
  if (!token) return res.status(401).json({ error: 'Please sign in to analyze fabric.' });
  try {
    req.user = await getAuth().verifyIdToken(token);
    next();
  } catch (error) {
    console.warn('Invalid Firebase ID token:', error.code || error.message);
    res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}
app.post('/api/generate', requireUser, async (req, res) => {
  let image;
  const { fabricImage, templateType = 'A-Line Kurta' } = req.body || {};
  try {
    image = parseFabricImage(fabricImage);
    if (!['A-Line Kurta', 'Modern Lehenga', 'Classic Gharara'].includes(templateType)) throw new Error('Please choose a supported outfit template.');
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  if (!ai && !process.env.XAI_API_KEY) return res.status(503).json({ error: 'Fabric analysis is not configured. Please contact the studio administrator.' });
  try {
    const result = await generateReport({ ai, grokKey: process.env.XAI_API_KEY, image, templateType });
    res.json(result);
  } catch (error) {
    console.error('Fabric analysis failed:', error.message);
    res.status(502).json({ error: 'Unable to analyze this fabric right now. Please try again.' });
  }
});
app.use((error, _req, res, _next) => {
  const status = error.status === 413 ? 413 : 400;
  res.status(status).json({ error: status === 413 ? 'Image must be 10 MB or smaller.' : 'Invalid request body.' });
});
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => console.log(`Server is running on port ${port}`));
