import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API route for AI Math Tutor
app.post('/api/tutor/chat', async (req, res) => {
  const { message, lessonTitle, topic, currentFormula } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Deterministic mathematical pedagogical assistant fallback
    return res.json({
      reply: `### Academic AI Math Tutor (Offline Mode)\n\nI am currently analyzing your question about **${lessonTitle || topic || 'Mathematics for AI'}**.\n\n*Key insight*: When working with ${topic || 'these models'}, always verify:
1. **Dimensions & Shapes**: Ensure inner dimensions match (e.g. in matrix products $X W + b$).
2. **Gradient flow**: Check whether derivatives can vanish or explode (e.g. saturation of Sigmoid vs ReLU).
3. **Loss minimization**: Remember that optimization is gradient-driven hill climbing in reverse.\n\nAsk me about any specific variable, derivation step, or geometric intuition!`,
      source: 'offline'
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are MathVerse AI's premier Mathematics & AI Educator.
You guide learners from first principles to advanced AI/ML mathematics with warmth, clarity, and rigor.
Current Module / Topic: "${topic || 'General Mathematics for Machine Learning'}"
Current Lesson: "${lessonTitle || 'Mathematics Overview'}"
Active Equation / Concept: "${currentFormula || 'None'}"

Pedagogical guidelines:
1. Begin with an intuitive explanation or concrete ML analogy (e.g., word embeddings, loss landscapes, attention weights).
2. Show mathematical rigor without skipping algebraic intermediate steps.
3. Format math cleanly using standard LaTeX ($...$ for inline, $$...$$ for block).
4. Highlight common misconceptions and pitfalls (e.g. matrix non-commutativity, correlation vs causation, learning rate divergence).
5. Conclude with a quick 1-question check to verify understanding. Keep answers structured and concise.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message || 'Explain this mathematical concept for machine learning.',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || 'Unable to generate response.',
      source: 'gemini'
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.json({
      reply: `### AI Math Tutor\n\nI encountered a connection issue with the cloud AI endpoint (${error?.message || 'Request timeout'}).\n\n**Pedagogical Guidance for ${lessonTitle || 'this concept'}**:\nIn machine learning, this mathematical structure ensures that updates preserve geometric consistency and numerical stability. Review the interactive playground on this page to test parameter values and inspect live outputs!`,
      source: 'fallback'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MathVerse AI Server running at http://localhost:${PORT}`);
  });
}

startServer();
