import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/api/chat', async (req, res) => {
  try {
    const { conversation } = req.body;

    if (!conversation || !Array.isArray(conversation)) {
      return res.status(400).json({ message: 'Messages must be an array !' });
    }
    const contents = conversation.map(({ role, text }) => {
      return {
        role,
        parts: [
          { text }
        ]
      };
    });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        temperature: 0.9,
        topP: 0.5,
        maxOutputTokens: 800,
        systemInstruction: `
        You are an AI Business Assistant named BizAI.
        Your job is to help users explore how AI can improve and grow their business.

        Rules:
        - Ask guiding questions if the user's intent is unclear (e.g. "Bisnis Anda di bidang apa?")
        - Provide practical and actionable advice
        - Keep answers concise, helpful, and easy to understand
        - Use a friendly and semi-formal tone in Bahasa Indonesia
        - Focus on: business growth, productivity, digitalization, AI tools, and marketing strategy
        - If asked about topics unrelated to business or AI, gently redirect the conversation back to business topics
        `.trim(),
      }
    });
    res.status(200).json({ reply: response.text });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
