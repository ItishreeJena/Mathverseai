import { FormulaCard } from '../types';

export const FORMULA_CARDS: FormulaCard[] = [
  {
    id: 'f_dot_product',
    name: 'Vector Dot Product & Cosine Similarity',
    topic: 'Linear Algebra',
    formula: '\\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^n u_i v_i = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos(\\theta)',
    meaning: 'Measures directional alignment between two vectors. Equals 0 when orthogonal, positive when acute, negative when obtuse.',
    aiUse: 'Cosine similarity between token embeddings, semantic document search (RAG), and self-attention score computation.',
    example: '[1, 2] · [3, 4] = (1)(3) + (2)(4) = 3 + 8 = 11'
  },
  {
    id: 'f_matrix_mult',
    name: 'Matrix Multiplication (GEMM)',
    topic: 'Linear Algebra',
    formula: 'C_{ij} = \\sum_{k=1}^p A_{ik} B_{kj} \\quad (A \\in \\mathbb{R}^{m \\times p}, B \\in \\mathbb{R}^{p \\times n})',
    meaning: 'Linear combination of columns of A weighted by rows of B. Inner dimensions must match.',
    aiUse: 'Every fully connected layer, convolutional projection, and transformer feedforward network.',
    example: '[[1, 2], [3, 4]] * [[1], [0]] = [[1], [3]]'
  },
  {
    id: 'f_eigen',
    name: 'Eigendecomposition',
    topic: 'Linear Algebra',
    formula: 'A \\mathbf{v} = \\lambda \\mathbf{v} \\iff (A - \\lambda I)\\mathbf{v} = \\mathbf{0}',
    meaning: 'Eigenvectors v maintain their direction when transformed by matrix A; λ is the scaling factor.',
    aiUse: 'Principal Component Analysis (PCA), graph neural network Laplacian embeddings, and spectral clustering.',
    example: 'Diagonal matrix diag(3, 2) has eigenvalues 3 and 2 with unit basis eigenvectors.'
  },
  {
    id: 'f_gradient',
    name: 'Multivariable Gradient Vector',
    topic: 'Calculus',
    formula: '\\nabla f(\\mathbf{x}) = \\left[ \\frac{\\partial f}{\\partial x_1}, \\frac{\\partial f}{\\partial x_2}, \\dots, \\frac{\\partial f}{\\partial x_n} \\right]^T',
    meaning: 'Vector pointing in the direction of steepest rate of increase of scalar function f.',
    aiUse: 'Loss minimization via Gradient Descent: w := w - α ∇L(w).',
    example: 'For f(x, y) = x^2 + 3y^2: ∇f = [2x, 6y]^T.'
  },
  {
    id: 'f_chain_rule',
    name: 'The Chain Rule of Calculus',
    topic: 'Calculus',
    formula: '\\frac{\\partial L}{\\partial w_i} = \\frac{\\partial L}{\\partial \\hat{y}} \\cdot \\frac{\\partial \\hat{y}}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w_i}',
    meaning: 'Derivative of composite functions: rate of change is product of intermediate derivative terms.',
    aiUse: 'Reverse-mode automatic differentiation (Backpropagation) across deep neural network layers.',
    example: 'If y = u^2 and u = 3x, then dy/dx = (2u) * (3) = 6u = 18x.'
  },
  {
    id: 'f_bayes',
    name: 'Bayes\' Theorem',
    topic: 'Probability',
    formula: 'P(A|B) = \\frac{P(B|A) P(A)}{P(B)}',
    meaning: 'Updates the prior probability of hypothesis A given new observed evidence B.',
    aiUse: 'Naive Bayes text classification, Bayesian neural networks, and Active Learning uncertainty sampling.',
    example: 'P(Spam|words) = P(words|Spam) * P(Spam) / P(words)'
  },
  {
    id: 'f_normal_dist',
    name: 'Gaussian Normal Distribution',
    topic: 'Probability & Statistics',
    formula: '\\mathcal{N}(x; \\mu, \\sigma^2) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)',
    meaning: 'Continuous bell curve symmetric around mean μ with spread parameterized by standard deviation σ.',
    aiUse: 'Weight initialization, latent spaces in Variational Autoencoders (VAEs), and Diffusion noise schedules.',
    example: 'Standard Normal has mean μ = 0, variance σ^2 = 1.'
  },
  {
    id: 'f_mse_loss',
    name: 'Mean Squared Error (L2 Loss)',
    topic: 'Optimization',
    formula: '\\mathcal{L}_{\\text{MSE}} = \\frac{1}{N}\\sum_{i=1}^N (y_i - \\hat{y}_i)^2',
    meaning: 'Average of squared residuals between ground truth y and model prediction y_hat.',
    aiUse: 'Continuous regression models and autoencoder reconstruction loss.',
    example: 'For errors [1, -2, 3], MSE = (1 + 4 + 9)/3 = 4.67.'
  },
  {
    id: 'f_cross_entropy',
    name: 'Cross-Entropy Loss',
    topic: 'Information Theory',
    formula: '\\mathcal{L}_{\\text{CE}} = -\\sum_{c=1}^C y_c \\log(\\hat{y}_c)',
    meaning: 'Measures divergence between true probability distribution y and predicted distribution y_hat.',
    aiUse: 'Multi-class classification in Vision and next-token prediction in Large Language Models (LLMs).',
    example: 'If true class is 1 and predicted probability is 0.8: L = -ln(0.8) ≈ 0.223.'
  },
  {
    id: 'f_attention',
    name: 'Scaled Dot-Product Attention',
    topic: 'Machine Learning',
    formula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V',
    meaning: 'Routes information dynamically based on inner product similarity between Query and Key vectors, scaled by sqrt(d_k).',
    aiUse: 'The core building block of all modern Transformer architectures (GPT, Claude, Gemini, Llama, BERT).',
    example: 'Softmax turns similarity matrix into probability distribution rows that blend Value vectors.'
  },
  {
    id: 'f_relu',
    name: 'ReLU Activation Function',
    topic: 'Machine Learning',
    formula: '\\text{ReLU}(z) = \\max(0, z), \\quad \\frac{d}{dz}\\text{ReLU}(z) = \\begin{cases} 1 & z > 0 \\\\ 0 & z < 0 \\end{cases}',
    meaning: 'Rectified Linear Unit: passes positive signals unchanged, zeroes out negative inputs.',
    aiUse: 'Primary activation function in deep networks; prevents vanishing gradients on positive domain.',
    example: 'ReLU(3.5) = 3.5, ReLU(-4.2) = 0.'
  },
  {
    id: 'f_adam',
    name: 'Adam Optimizer Update',
    topic: 'Optimization',
    formula: '\\theta_{t+1} = \\theta_t - \\frac{\\alpha}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t',
    meaning: 'Combines momentum (first moment m) with per-coordinate adaptive learning rates (second moment v).',
    aiUse: 'Default optimizer for training modern deep learning and transformer models.',
    example: 'Parameters with large frequent gradients get smaller updates; sparse parameters get larger updates.'
  }
];
