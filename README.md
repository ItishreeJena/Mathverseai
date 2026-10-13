# MathVerse AI — Mathematics for Artificial Intelligence

MathVerse AI is an interactive, gamified mathematics learning platform tailored specifically for Artificial Intelligence, Machine Learning, Deep Learning, and Data Science. It bridges the gap between intuitive first principles and rigorous mathematical foundations through interactive visual playgrounds, structured multi-step lessons, gamified missions, and an AI tutor companion.

---

## 🌟 Key Features

### 1. Complete 7-Stage AI Mathematics Curriculum
- **Stage 1: Mathematical Foundations**: Exponents, logarithms, sigma notation ($\sum$), and vector spaces.
- **Stage 2: Linear Algebra**: 2D/3D vectors, Euclidean norms, dot products, matrix multiplication (GEMM), geometric linear transformations, eigenvalues/eigenvectors, and Singular Value Decomposition (SVD) for low-rank model compression (LoRA).
- **Stage 3: Multivariable Calculus**: Instantaneous slope, tangent line limits, partial derivatives, gradient vectors ($\nabla$), and reverse-mode automatic differentiation (Backpropagation).
- **Stage 4: Probability & Uncertainty**: Conditional probability, Bayes' Theorem, Bernoulli/Binomial/Normal distributions, expectation, variance, and the Central Limit Theorem.
- **Stage 5: Statistics & Data Science**: Central tendencies (Mean vs Median), outlier resistance, IQR, box plots, covariance and correlation matrices, and hypothesis testing ($p$-values).
- **Stage 6: Optimization & Information Theory**: Convexity, gradient descent dynamics, momentum, AdamW optimizers, Shannon entropy, cross-entropy loss, and KL divergence.
- **Stage 7: Mathematics of Machine Learning & Transformers**: Linear/logistic regression, decision boundaries, multi-layer perceptron forward/backward passes, and Scaled Dot-Product Attention ($\text{Attention}(Q,K,V)$).

### 2. Interactive Visual Math Playgrounds
- **2D Vector Space**: Drag vectors $\mathbf{u}$ and $\mathbf{v}$ with real-time updates for magnitude, angle $\theta$, dot product, cosine similarity, and projection.
- **2x2 Matrix Laboratory**: Enter transformation values to deform the unit coordinate grid, observe determinant area scaling, and view trace/eigenvalues.
- **Function & Derivative Explorer**: Toggle Sigmoid, ReLU, Tanh, and quadratic curves with live tangent lines and finite difference secant approximations ($h \to 0$).
- **Gradient Descent Simulator**: Tune learning rate $\alpha$, starting positions, and momentum across convex and non-convex loss surfaces.
- **Probability Simulator**: Run Monte Carlo trials for the Central Limit Theorem (dice sums converging to Gaussian normal), the Law of Large Numbers, and the Monty Hall paradox.
- **Statistics Laboratory**: Interactive strip chart and box-and-whisker plot with dynamic outlier injection demonstrating mean distortion versus median robustness.
- **Neural Network Sandbox**: A live 2-layer perceptron calculating forward activations and exact analytical backpropagation weight updates.
- **Loss Function Explorer**: Side-by-side comparison of L2 (MSE), L1 (MAE), and Huber loss and gradients.
- **PCA Dimensionality Reduction**: Rotate a 1D projection axis to discover the 1st Principal Component that maximizes preserved variance.

### 3. Gamification, Daily Streaks & Missions
- **Daily Streak Engine**: Tracks daily learning activity automatically across calendar days (`YYYY-MM-DD`).
  - Active streak indicator in both Navbar and Dashboard with flame icon (`🔥 {streak}d`).
  - Interactive 7-Day Activity Calendar displaying daily participation checkmarks.
  - Streak milestones with XP awards (Math Spark 3d, Weekly Inferno 7d, Calculus Constancy 14d, Deep Learning Sovereign 30d).
  - Manual practice logger / simulation button to verify day-by-day progression.
- **XP & Levels**: Progress from *Novice Geometer* to *Deep Learning Sovereign*.
- **Interactive Missions**:
  - *Vector Voyager*: Navigate 2D coordinate space to hit target points.
  - *Matrix Architect*: Transform space to invert orientation ($\det = -1$).
  - *Gradient Descent Race*: Reach loss minimum in 15 steps or fewer.
  - *Probability Detective*: Solve uncertainty mysteries with empirical sampling.
  - *Neural Boss Fight*: Reduce network prediction loss below $0.01$.
- **Myth Busters**: A curated misconception collection explaining why common wrong answers fail in real ML code (e.g. $AB \neq BA$, zero weight initialization symmetry, correlation vs causation).

### 4. User Authentication & Profile Isolation
- **Multi-User Accounts**: Sign in, sign up, and isolated per-user progress, bookmark, and note persistence.
- **Mathematician Avatars**: Custom persona selection (Alan Turing, Ada Lovelace, Leonhard Euler, Carl Gauss, Srinivasa Ramanujan).
- **Fast Profile Switching**: One-click demo account switcher to easily test different student progress states and streaks.

### 5. Smart Quizzes & Structured Lessons
- 11-step structured lesson sequence:
  1. Why this concept matters in AI
  2. Everyday analogy
  3. Interactive demonstration
  4. Intuitive explanation in plain language
  5. Mathematical definition and KaTeX notation
  6. Zero-jump worked example problem
  7. Hands-on laboratory
  8. Real-world ML algorithm application
  9. Guided hints and misconception feedback
  10. Mastery quiz
  11. Revision summary sheet with formulas and classic traps
- Spaced repetition and local persistence of notes and bookmarks.

### 6. AI Learning Companion (Tutor)
- Server-side integration with Google Gemini (`gemini-3.8-flash` via `@google/genai`).
- Context-aware assistance that automatically ingests the current lesson title, topic, and active formula.
- Reliable offline pedagogical fallback when no API key is configured.

### 7. Math-to-Code Lab (PyTorch & NumPy Generator)
- Converts high-level AI mathematical definitions directly into production vectorized Python code.
- Generates side-by-side **PyTorch** (`torch.nn` / `torch.Tensor` with autograd) and **NumPy** implementations.
- Tensor shape tracking (e.g. `(B, S, d) -> (B, S, S) -> (B, S, d)`) and real-world architecture callouts (Transformers, ResNets, Adam optimizers).

### 8. AI Math Gym (Dynamic Problem Generator)
- On-demand dynamic problem synthesis powered by the Gemini API across all 7 curriculum stages.
- Variable difficulty levels (Novice, Intermediate, Master) with progressive hints, KaTeX typesetting, and step-by-step misconception feedback.
- Awards XP and automatically updates the daily streak upon correct completion.

### 9. GitHub Sync & 1-Click Push Integration
- Built-in GitHub remote synchronizer for `https://github.com/itishree-jena/math-for-ai.git`.
- Displays branch state, commit hash, and staged files.
- Provides 1-click token push via backend `/api/git/push` or copy-pasteable terminal commands.


---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Canvas Confetti.
- **Math Rendering**: KaTeX with custom math typesetting components.
- **Backend**: Express with `@google/genai` server-side integration and Vite middleware.
- **Persistence**: Browser LocalStorage for progress, XP, streak, bookmarks, and personal notes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/itishree-jena/math-for-ai.git
cd math-for-ai

# Install dependencies
npm install
```

### Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
To enable live AI tutoring via Gemini, configure:
```env
GEMINI_API_KEY="your-gemini-api-key"
```
*(Note: MathVerse AI functions completely with rich offline tutoring even without an API key).*

### Running the Application
```bash
# Start dev server on port 3000
npm run dev

# Run unit tests
npm test

# Build for production
npm run build
```

---

## 🧪 Testing & Verification
The test suite validates mathematical fidelity, numerical tolerances, loss functions, and leveling logic:
```bash
npm test
```
All 12 unit tests verify:
- Vector dot products and cosine similarity
- Matrix determinants and rotational properties
- Sigmoid activation values and derivatives
- Sample mean and Bessel's corrected variance
- Huber loss quadratic-to-linear transitions
- Quiz scoring and XP progression thresholds
