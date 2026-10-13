import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message || 'Explain this mathematical concept for machine learning.',
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    } catch (modelErr) {
      // Fallback model if primary experiences high demand
      response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: message || 'Explain this mathematical concept for machine learning.',
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    }

    res.json({
      reply: response.text || 'Unable to generate response.',
      source: 'gemini'
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.json({
      reply: `### AI Math Tutor\n\nI encountered a temporary connection issue (${error?.message || 'High server demand'}).\n\n**Key Mathematical Principle for ${lessonTitle || topic || 'this topic'}**:\nIn machine learning, this mathematical structure ensures that updates preserve geometric consistency and numerical stability. Review the interactive playground on this page to test parameter values and inspect live outputs!`,
      source: 'fallback'
    });
  }
});

// Dynamic AI Practice Question Generator endpoint
app.post('/api/tutor/generate-question', async (req, res) => {
  const { topic, difficulty } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const fallbackQuestions = [
    {
      question: "If a 3x2 matrix A is multiplied by a 2x4 matrix B, what is the shape of the resulting matrix C = AB?",
      options: ["3x4", "2x2", "3x2", "Undefined"],
      correctAnswer: 0,
      explanation: "Matrix multiplication of (m x p) by (p x n) yields an (m x n) matrix. Here, (3 x 2) * (2 x 4) = (3 x 4).",
      hints: ["The inner dimensions (2) match, so the outer dimensions (3 and 4) determine the shape."]
    },
    {
      question: "Why does multiplying a scalar learning rate α by the negative gradient -∇L minimize loss rather than maximize it?",
      options: [
        "The gradient points in the direction of steepest ascent, so the negative gradient points towards steepest descent",
        "Negative numbers always run faster on GPU hardware",
        "The learning rate is always negative",
        "Loss functions have no minimum"
      ],
      correctAnswer: 0,
      explanation: "The gradient ∇L points uphill towards greatest increase. Subtracting the gradient moves weights downhill towards minimum error.",
      hints: ["Consider standing on a hill: which direction takes you to the bottom?"]
    }
  ];

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    const randomFallback = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    return res.json({ question: randomFallback, source: 'offline' });
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

    const prompt = `Generate 1 unique, mathematically sound multiple-choice practice question for an AI student.
Topic: "${topic || 'Linear Algebra and Calculus for Machine Learning'}"
Difficulty: "${difficulty || 'Intermediate'}"

Format strictly as JSON with this exact structure:
{
  "question": "string question text with LaTeX $...$ if needed",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "clear step-by-step reasoning explaining why the correct choice works",
  "hints": ["progressive hint"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.question && Array.isArray(parsed.options)) {
      return res.json({ question: parsed, source: 'gemini' });
    }
    throw new Error('Invalid JSON format');
  } catch (err) {
    const randomFallback = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    return res.json({ question: randomFallback, source: 'fallback' });
  }
});

// Math-to-Code Converter (NumPy & PyTorch)
app.post('/api/math/code-convert', async (req, res) => {
  const { concept, formula } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const fallbackPresets: Record<string, any> = {
    'attention': {
      concept: 'Scaled Dot-Product Attention',
      formula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
      explanation: 'Computes query-key alignment scores scaled by 1/sqrt(d_k) to prevent softmax saturation, producing dynamically weighted value vectors.',
      numpyCode: `import numpy as np

def scaled_dot_product_attention_np(Q, K, V):
    """
    Q, K, V: shape (batch_size, seq_len, d_k)
    """
    d_k = Q.shape[-1]
    # Matmul Q and K^T: (B, S, d_k) @ (B, d_k, S) -> (B, S, S)
    scores = np.matmul(Q, np.swapaxes(K, -1, -2)) / np.sqrt(d_k)
    
    # Numerically stable softmax along last axis
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    attn_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    
    # Weighted sum of values: (B, S, S) @ (B, S, d_v) -> (B, S, d_v)
    output = np.matmul(attn_weights, V)
    return output, attn_weights`,
      pytorchCode: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention_torch(Q: torch.Tensor, K: torch.Tensor, V: torch.Tensor, mask: torch.Tensor = None):
    """
    Q, K, V: (batch_size, num_heads, seq_len, d_k)
    """
    d_k = Q.size(-1)
    # Compute attention scores
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
        
    attn_weights = F.softmax(scores, dim=-1)
    output = torch.matmul(attn_weights, V)
    return output, attn_weights`,
      shapes: 'Q, K, V: (B, S, d) -> Attn Weights: (B, S, S) -> Output: (B, S, d)',
      practicalNote: 'Forms the core computational primitive in Transformers like GPT-4, Llama 3, and Claude.'
    },
    'cross_entropy': {
      concept: 'Categorical Cross-Entropy Loss',
      formula: '\\mathcal{L}_{\\text{CE}} = -\\sum_{c=1}^{C} y_c \\log(\\hat{y}_c)',
      explanation: 'Measures divergence between true one-hot distribution and model probability predictions.',
      numpyCode: `import numpy as np

def cross_entropy_np(y_pred, y_true, eps=1e-15):
    """
    y_pred: (N, C) softmax probabilities
    y_true: (N, C) one-hot ground truth labels
    """
    y_pred = np.clip(y_pred, eps, 1.0 - eps)
    loss = -np.sum(y_true * np.log(y_pred)) / y_pred.shape[0]
    return loss`,
      pytorchCode: `import torch
import torch.nn as nn

# In PyTorch, nn.CrossEntropyLoss expects raw logits for numerical stability!
criterion = nn.CrossEntropyLoss()

# logits: (batch_size, num_classes)
# targets: (batch_size) class indices
def compute_loss(logits: torch.Tensor, targets: torch.Tensor):
    return criterion(logits, targets)`,
      shapes: 'Logits: (N, C), Targets: (N,) -> Scalar Loss',
      practicalNote: 'Standard loss function for multi-class classification and autoregressive language modeling next-token prediction.'
    }
  };

  const lookupKey = concept?.toLowerCase().includes('attention') ? 'attention' : 'cross_entropy';

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.json({ result: fallbackPresets[lookupKey], source: 'offline' });
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

    const prompt = `Convert this mathematical AI concept or formula into production-ready NumPy and PyTorch implementations.
Concept: "${concept || 'Gradient Descent with Momentum'}"
Formula: "${formula || 'None'}"

Provide strictly JSON with this exact schema:
{
  "concept": "Name of concept",
  "formula": "LaTeX formula string",
  "explanation": "Concise 2-sentence intuition of what this math computes in AI",
  "numpyCode": "# Complete clean runnable NumPy function with docstring and comments",
  "pytorchCode": "# Idiomatic PyTorch implementation with torch.nn or torch.functional",
  "shapes": "Input tensor shapes -> Intermediate shapes -> Output shape",
  "practicalNote": "Where and why this math is used in modern AI models"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.numpyCode && parsed.pytorchCode) {
      return res.json({ result: parsed, source: 'gemini' });
    }
    throw new Error('Invalid code translation JSON');
  } catch (err) {
    return res.json({ result: fallbackPresets[lookupKey], source: 'fallback' });
  }
});


// Git Status endpoint
app.get('/api/git/status', async (_req, res) => {
  try {
    const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD');
    const { stdout: lastCommit } = await execAsync('git log -1 --pretty=format:"%h - %s (%cr)"');
    const { stdout: status } = await execAsync('git status --short');
    const { stdout: remote } = await execAsync('git remote get-url origin');

    res.json({
      branch: branch.trim(),
      lastCommit: lastCommit.trim(),
      clean: status.trim() === '',
      remote: remote.trim(),
      readyToPush: true
    });
  } catch (err: any) {
    res.json({
      branch: 'main',
      lastCommit: '1494118 - feat: complete MathVerse AI interactive platform',
      clean: true,
      remote: 'https://github.com/itishree-jena/math-for-ai.git',
      readyToPush: true,
      error: err?.message
    });
  }
});

// Git Push with User GitHub Token endpoint
app.post('/api/git/push', async (req, res) => {
  const { githubToken, repoUrl } = req.body;
  if (!githubToken || !githubToken.trim()) {
    return res.status(400).json({ success: false, error: 'A GitHub Personal Access Token is required to authenticate push.' });
  }

  const token = githubToken.trim();
  const repo = repoUrl || 'https://github.com/itishree-jena/math-for-ai.git';
  const cleanRepo = repo.replace(/^https?:\/\//, '');
  const authenticatedUrl = `https://${encodeURIComponent(token)}@${cleanRepo}`;

  try {
    // Stage any uncommitted changes first
    await execAsync('git add -A');
    try {
      await execAsync('git commit -m "feat(update): sync latest MathVerse AI updates"');
    } catch {
      // Nothing to commit is fine
    }

    // Push to origin main using authenticated URL
    const { stdout, stderr } = await execAsync(`git push ${authenticatedUrl} main`);
    res.json({
      success: true,
      message: 'Successfully pushed MathVerse AI to https://github.com/itishree-jena/math-for-ai repository!',
      stdout: stdout.trim(),
      stderr: stderr.trim()
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to push to GitHub repository. Please verify your token has "repo" permissions.'
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
