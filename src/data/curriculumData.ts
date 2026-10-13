import { Lesson, ModuleInfo } from '../types';

export const MODULES: ModuleInfo[] = [
  {
    id: 'foundations',
    stage: 1,
    title: 'Mathematical Foundations',
    description: 'Master logs, exponents, summations, and coordinate geometry foundational to AI loss functions.',
    iconName: 'Calculator',
    lessonIds: ['foundations_1', 'foundations_2'],
  },
  {
    id: 'linear_algebra',
    stage: 2,
    title: 'Linear Algebra',
    description: 'Vectors, matrices, dot products, transformations, and SVD that power modern embeddings and LLMs.',
    iconName: 'Grid',
    lessonIds: ['linear_algebra_1', 'linear_algebra_2', 'linear_algebra_3', 'linear_algebra_4'],
  },
  {
    id: 'calculus',
    stage: 3,
    title: 'Multivariable Calculus',
    description: 'Limits, derivatives, partial gradients, and the chain rule engine powering backpropagation.',
    iconName: 'TrendingUp',
    lessonIds: ['calculus_1', 'calculus_2', 'calculus_3'],
  },
  {
    id: 'probability',
    stage: 4,
    title: 'Probability & Uncertainty',
    description: 'Conditional probability, Bayes theorem, distributions, and variance behind classification models.',
    iconName: 'Dice5',
    lessonIds: ['probability_1', 'probability_2'],
  },
  {
    id: 'statistics',
    stage: 5,
    title: 'Statistics & Data Science',
    description: 'Distributions, variance, covariance matrices, hypothesis testing, and correlation vs causation.',
    iconName: 'BarChart3',
    lessonIds: ['statistics_1', 'statistics_2'],
  },
  {
    id: 'optimization',
    stage: 6,
    title: 'Optimization & Information Theory',
    description: 'Convexity, gradient descent dynamics, Shannon entropy, cross-entropy loss, and KL divergence.',
    iconName: 'Target',
    lessonIds: ['optimization_1', 'optimization_2'],
  },
  {
    id: 'machine_learning',
    stage: 7,
    title: 'Mathematics of AI & Deep Learning',
    description: 'Linear/logistic regression, PCA projection, neural network forward/backprop, and self-attention math.',
    iconName: 'Cpu',
    lessonIds: ['machine_learning_1', 'machine_learning_2', 'machine_learning_3'],
  },
];

export const LESSONS: Record<string, Lesson> = {
  foundations_1: {
    id: 'foundations_1',
    moduleId: 'foundations',
    stage: 1,
    title: 'Logarithms & Exponents in AI',
    summary: 'Discover why logarithms convert multiplicative probabilities into additive loss sums, preventing numerical underflow in deep learning.',
    estimatedMinutes: 12,
    xpReward: 60,
    prerequisites: ['Basic arithmetic', 'Powers'],
    whyItMatters: 'Computers cannot multiply thousands of small probabilities like 0.0001 without hitting numerical underflow (rounding to 0.0). Logarithms transform multiplication into addition: log(a * b) = log(a) + log(b), making neural network loss calculation numerically stable.',
    everydayAnalogy: 'Imagine measuring sound. Instead of saying a jet engine has 1,000,000,000 times the air pressure of a whisper, decibels use a logarithmic scale (120 dB vs 30 dB) to keep huge ranges manageable. AI uses logarithms the same way to compress extreme probability scales.',
    intuitiveExplanation: 'A logarithm answers the question: "To what power must I raise the base to get this number?" If 2^3 = 8, then log_2(8) = 3. In AI, natural logarithms (base e ≈ 2.71828) are everywhere because the derivative of ln(x) is simply 1/x.',
    mathematicalDefinition: '\\ln(x \\cdot y) = \\ln(x) + \\ln(y), \\quad \\ln\\left(\\frac{x}{y}\\right) = \\ln(x) - \\ln(y), \\quad \\ln(x^k) = k \\ln(x)',
    keyFormula: '\\mathcal{L}_{\\text{NLL}} = -\\sum_{i=1}^N \\ln(P(y_i|x_i))',
    symbolsExplained: [
      { symbol: 'e', meaning: 'Euler\'s constant ≈ 2.71828, base of natural logarithm' },
      { symbol: '\\ln(x)', meaning: 'Natural logarithm (log base e)' },
      { symbol: '\\mathcal{L}_{\\text{NLL}}', meaning: 'Negative Log-Likelihood loss function used in language models' },
      { symbol: 'P(y_i|x_i)', meaning: 'Probability of correct token y given input context x' },
    ],
    workedExample: {
      problem: 'Given model output probabilities P(A) = 0.01 and P(B) = 0.005 for independent tokens, compute the joint log-likelihood ln(P(A) * P(B)) using log properties.',
      steps: [
        {
          stepTitle: 'Step 1: Apply logarithm product rule',
          explanation: 'Transform the product of probabilities into the sum of their individual logarithms.',
          math: '\\ln(P(A) \\cdot P(B)) = \\ln(P(A)) + \\ln(P(B))'
        },
        {
          stepTitle: 'Step 2: Calculate individual logarithms',
          explanation: 'Find ln(0.01) and ln(0.005). ln(0.01) = ln(10^-2) ≈ -4.605. ln(0.005) = ln(5 * 10^-3) ≈ -5.298.',
          math: '\\ln(0.01) \\approx -4.605, \\quad \\ln(0.005) \\approx -5.298'
        },
        {
          stepTitle: 'Step 3: Add values',
          explanation: 'Adding the two negative values yields the joint log probability.',
          math: '-4.605 + (-5.298) = -9.903'
        }
      ],
      finalResult: '\\ln(P(A \\cap B)) = -9.903'
    },
    aiApplication: {
      title: 'Cross-Entropy Loss in Large Language Models (LLMs)',
      description: 'When training GPT or Claude, the model predicts the probability distribution over 32,000+ vocabulary tokens. We compute cross-entropy loss by taking -ln(P(correct_token)). When P = 1, -ln(1) = 0 (zero loss). When P -> 0, -ln(P) -> infinity (heavy penalty).',
      algorithm: 'Negative Log Likelihood / Cross-Entropy Loss'
    },
    revisionSummary: {
      keyTakeaway: 'Logarithms turn hazardous tiny floating-point multiplications into stable sums and provide well-behaved gradients for optimization.',
      formula: '\\log(a \\cdot b) = \\log(a) + \\log(b)',
      commonMistake: 'Confusing log(a + b) with log(a) + log(b). Logarithms do NOT distribute over addition!'
    },
    interactiveType: 'loss_functions',
    quiz: [
      {
        id: 'f1_q1',
        question: 'Why do deep learning frameworks optimize log-probabilities instead of raw probabilities?',
        options: [
          'Logarithms make computations run faster on CPUs',
          'Multiplying many small probabilities causes floating-point underflow towards zero',
          'Probabilities cannot be graphed on 2D screens',
          'Neural networks cannot multiply floats'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Consider what happens when you multiply 0.001 by 0.001 one hundred times on a computer.'],
        explanation: 'Multiplying probabilities below 1 repeatedly causes numbers to quickly exceed standard 32-bit floating-point limits, rounding to 0. Log transforms multiplication into addition.',
        misconceptionExplanation: 'It is not a speed or display limitation; it is a fundamental hardware floating-point precision constraint (underflow).'
      },
      {
        id: 'f1_q2',
        question: 'If a language model predicts a probability P = 1.0 (100% certainty) for the correct word, what is the Negative Log-Likelihood loss -ln(P)?',
        options: ['1.0', '0.0', '-1.0', 'Infinity'],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Recall what power you raise e to to get 1: e^0 = 1.'],
        explanation: 'Since ln(1) = 0, the loss -ln(1) = 0. Perfect confidence on the correct token incurs zero penalty.',
        misconceptionExplanation: 'A common misconception is thinking the loss is 1. When the model is perfectly right, the loss should be zero.'
      }
    ]
  },

  foundations_2: {
    id: 'foundations_2',
    moduleId: 'foundations',
    stage: 1,
    title: 'Summations, Sigma Notation & Vector Space Basics',
    summary: 'Decode sigma notation Σ, weighted sums, and coordinate axes that form the foundation of artificial neurons.',
    estimatedMinutes: 10,
    xpReward: 50,
    prerequisites: ['Arithmetic'],
    whyItMatters: 'Every single artificial neuron in a deep learning network calculates a weighted sum: z = Σ(w_i * x_i) + b. Reading and manipulating sigma notation effortlessly is required to understand paper derivations and matrix formulations.',
    everydayAnalogy: 'Think of calculating your final college grade: Homework (20%), Midterm (30%), Final Exam (50%). You multiply each score by its weight and sum them up. That is exactly what an artificial neuron does with input features!',
    intuitiveExplanation: 'The capital Greek letter Sigma (Σ) is a looping shorthand in mathematics. It tells you to start with an index (e.g. i=1), evaluate the formula, increment i, and add up all terms until reaching the top limit n.',
    mathematicalDefinition: '\\sum_{i=1}^n w_i x_i = w_1 x_1 + w_2 x_2 + \\dots + w_n x_n',
    keyFormula: 'z = \\sum_{i=1}^d w_i x_i + b',
    symbolsExplained: [
      { symbol: '\\Sigma', meaning: 'Summation operator (Greek uppercase Sigma)' },
      { symbol: 'w_i', meaning: 'Weight scalar associated with feature i' },
      { symbol: 'x_i', meaning: 'Input feature value i' },
      { symbol: 'b', meaning: 'Bias scalar (shifts the activation threshold)' },
    ],
    workedExample: {
      problem: 'Calculate the pre-activation z of a neuron with inputs x = [2, -1, 3], weights w = [0.5, 2, -1], and bias b = 0.5.',
      steps: [
        {
          stepTitle: 'Step 1: Compute pairwise products',
          explanation: 'Multiply each input feature by its corresponding synaptic weight.',
          math: 'w_1 x_1 = 0.5 \\times 2 = 1.0, \\quad w_2 x_2 = 2 \\times (-1) = -2.0, \\quad w_3 x_3 = (-1) \\times 3 = -3.0'
        },
        {
          stepTitle: 'Step 2: Sum the weighted products',
          explanation: 'Sum the terms together.',
          math: '\\sum_{i=1}^3 w_i x_i = 1.0 + (-2.0) + (-3.0) = -4.0'
        },
        {
          stepTitle: 'Step 3: Add the bias term b',
          explanation: 'Add bias b = 0.5 to complete the linear combination.',
          math: 'z = -4.0 + 0.5 = -3.5'
        }
      ],
      finalResult: 'z = -3.5'
    },
    aiApplication: {
      title: 'Perceptron and Dense Layer Pre-activation',
      description: 'Dense (Fully Connected) layers in PyTorch and TensorFlow compute Y = XW + b. Every single output coordinate is an independent weighted sum computed across all input channels simultaneously via GPU matrix multiplication.',
      algorithm: 'Artificial Neuron Forward Pass'
    },
    revisionSummary: {
      keyTakeaway: 'Sigma notation describes a linear combination of inputs and weights, forming the linear core of every neural network layer.',
      formula: 'z = \\mathbf{w}^T \\mathbf{x} + b = \\sum_{i=1}^d w_i x_i + b',
      commonMistake: 'Forgetting to include the bias term b after computing the summation.'
    },
    interactiveType: 'neural_network',
    quiz: [
      {
        id: 'f2_q1',
        question: 'Given inputs x = [4, 1] and weights w = [0.25, 3] with bias b = -1, what is z = Σ(w_i * x_i) + b?',
        options: ['4.0', '3.0', '2.0', '5.0'],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Compute (0.25 * 4) + (3 * 1), then add b = -1.'],
        explanation: '(0.25 * 4) = 1. (3 * 1) = 3. Sum = 4. Adding bias b = -1 gives 4 - 1 = 3.',
        misconceptionExplanation: 'Double check: (1 + 3) - 1 = 3.'
      }
    ]
  },

  linear_algebra_1: {
    id: 'linear_algebra_1',
    moduleId: 'linear_algebra',
    stage: 2,
    title: 'Vectors, Magnitudes & Dot Products',
    summary: 'Understand geometric and algebraic vectors, Euclidean norms, and how the dot product measures similarity between embeddings.',
    estimatedMinutes: 15,
    xpReward: 80,
    prerequisites: ['Coordinate geometry'],
    whyItMatters: 'In AI, everything is a vector: words in ChatGPT, pixels in an image, user preferences on Netflix. The dot product is the engine of Cosine Similarity and Attention mechanisms, measuring how strongly two vectors align.',
    everydayAnalogy: 'Imagine two arrows. If they point in the exact same direction, they reinforce each other (maximum dot product). If they are perpendicular (90 degrees), they have zero in common (dot product = 0). If they point in opposite directions, they oppose each other (negative dot product).',
    intuitiveExplanation: 'A vector has both magnitude (length) and direction. The dot product u · v multiplies the matching components: u_1 v_1 + u_2 v_2 + ... + u_n v_n. Geometrically, it equals |u||v| cos(θ). Dividing by both lengths yields the cosine of the angle between them.',
    mathematicalDefinition: '\\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^n u_i v_i = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos(\\theta)',
    keyFormula: '\\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}',
    symbolsExplained: [
      { symbol: '\\mathbf{u}, \\mathbf{v}', meaning: 'Vectors in n-dimensional real space R^n' },
      { symbol: '\\|\\mathbf{u}\\|', meaning: 'Euclidean norm (magnitude or length) = sqrt(u_1^2 + ... + u_n^2)' },
      { symbol: '\\theta', meaning: 'Angle between vector u and vector v' },
      { symbol: '\\mathbf{u} \\cdot \\mathbf{v}', meaning: 'Scalar dot product (inner product)' },
    ],
    workedExample: {
      problem: 'Given two embedding vectors u = [3, 4] and v = [4, 3], compute their magnitudes, dot product, and cosine similarity.',
      steps: [
        {
          stepTitle: 'Step 1: Compute Euclidean norms (magnitudes)',
          explanation: 'Square each coordinate, sum them, and take the square root.',
          math: '\\|\\mathbf{u}\\| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5, \\quad \\|\\mathbf{v}\\| = \\sqrt{4^2 + 3^2} = \\sqrt{25} = 5'
        },
        {
          stepTitle: 'Step 2: Compute the dot product',
          explanation: 'Multiply corresponding elements and sum them.',
          math: '\\mathbf{u} \\cdot \\mathbf{v} = (3 \\times 4) + (4 \\times 3) = 12 + 12 = 24'
        },
        {
          stepTitle: 'Step 3: Calculate Cosine Similarity',
          explanation: 'Divide the dot product by the product of both magnitudes.',
          math: '\\cos(\\theta) = \\frac{24}{5 \\times 5} = \\frac{24}{25} = 0.96'
        }
      ],
      finalResult: '\\cos(\\theta) = 0.96 \\implies 96\\% \\text{ semantic similarity}'
    },
    aiApplication: {
      title: 'Vector Search & Retrieval-Augmented Generation (RAG)',
      description: 'Modern vector databases (Pinecone, Chroma, FAISS) index document embeddings. When you ask a query, RAG encodes your question into a vector and finds the nearest documents by computing dot products with stored embeddings at lightning speed.',
      algorithm: 'Cosine Similarity / K-Nearest Neighbors Retrieval'
    },
    revisionSummary: {
      keyTakeaway: 'The dot product measures directional alignment. Orthogonal vectors have a dot product of 0; identical direction gives maximum value.',
      formula: '\\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}',
      commonMistake: 'Thinking the dot product produces a vector. The dot product always yields a single scalar number!'
    },
    interactiveType: 'vectors',
    quiz: [
      {
        id: 'la1_q1',
        question: 'If two nonzero embedding vectors have a dot product of exactly 0, what does this tell us about their geometric relationship?',
        options: [
          'They are parallel and identical in direction',
          'They are orthogonal (perpendicular at 90 degrees)',
          'One of the vectors has zero magnitude',
          'They point in opposite 180-degree directions'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Recall: u · v = |u||v|cos(θ). For what angle θ is cos(θ) = 0?'],
        explanation: 'cos(90°) = 0. When the dot product is 0 for nonzero vectors, the angle between them is 90 degrees (orthogonal), meaning they share zero directional correlation.',
        misconceptionExplanation: 'Opposite vectors yield a negative dot product (|u||v| * -1), not zero.'
      },
      {
        id: 'la1_q2',
        question: 'What is the magnitude (Euclidean norm) of vector v = [6, 8]?',
        options: ['14', '10', '100', '48'],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Compute sqrt(6^2 + 8^2) = sqrt(36 + 64).'],
        explanation: 'sqrt(36 + 64) = sqrt(100) = 10.',
        misconceptionExplanation: 'Remember to take the square root of the sum of squares, not just the sum.'
      }
    ]
  },

  linear_algebra_2: {
    id: 'linear_algebra_2',
    moduleId: 'linear_algebra',
    stage: 2,
    title: 'Matrices & Linear Transformations',
    summary: 'Visualize matrices as geometric space-warping functions: stretching, rotating, shearing, and projecting coordinate grids.',
    estimatedMinutes: 18,
    xpReward: 90,
    prerequisites: ['linear_algebra_1'],
    whyItMatters: 'Every linear layer in deep learning is a matrix multiplication. A matrix does not merely store numbers; geometrically, each column specifies where the standard basis vectors i-hat and j-hat land after transformation!',
    everydayAnalogy: 'Think of a rubber sheet with a grid drawn on it. A matrix transformation grabs the edges and stretches, rotates, or squashes the sheet without curving grid lines or moving the origin (0,0).',
    intuitiveExplanation: 'When you multiply a matrix A by a vector x, you are computing a linear combination of A\'s column vectors weighted by x\'s coordinates. If column 1 is [2, 0] and column 2 is [0, 3], the plane is stretched by 2 horizontally and 3 vertically.',
    mathematicalDefinition: 'A \\mathbf{x} = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = x \\begin{pmatrix} a \\\\ c \\end{pmatrix} + y \\begin{pmatrix} b \\\\ d \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}',
    keyFormula: '\\det(A) = ad - bc = \\text{Area scaling factor}',
    symbolsExplained: [
      { symbol: 'A', meaning: 'Transformation matrix of size m x n' },
      { symbol: '\\mathbf{x}', meaning: 'Input vector before transformation' },
      { symbol: 'A\\mathbf{x}', meaning: 'Transformed vector' },
      { symbol: '\\det(A)', meaning: 'Determinant (factor by which area scales; negative means space flipped)' },
    ],
    workedExample: {
      problem: 'Given rotation-like matrix A = [[0, -1], [1, 0]], apply it to vector x = [2, 3] and compute the determinant of A.',
      steps: [
        {
          stepTitle: 'Step 1: Compute matrix-vector product Ax',
          explanation: 'Multiply row by column: first row [0, -1] dot [2, 3], second row [1, 0] dot [2, 3].',
          math: 'A\\mathbf{x} = \\begin{pmatrix} (0)(2) + (-1)(3) \\\\ (1)(2) + (0)(3) \\end{pmatrix} = \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}'
        },
        {
          stepTitle: 'Step 2: Compute the determinant',
          explanation: 'det(A) = ad - bc.',
          math: '\\det(A) = (0)(0) - (-1)(1) = 0 - (-1) = 1'
        },
        {
          stepTitle: 'Step 3: Geometric interpretation',
          explanation: 'The vector [2, 3] rotated 90 degrees counterclockwise to [-3, 2]. Because det(A) = 1, area is perfectly preserved.',
          math: '\\theta = 90^\\circ, \\quad \\text{Area preservation factor} = 1.0'
        }
      ],
      finalResult: 'A\\mathbf{x} = \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}, \\quad \\det(A) = 1'
    },
    aiApplication: {
      title: 'Feedforward Layer Transformation',
      description: 'In a transformer MLP block, input token embeddings X are projected into higher dimensions via W_gate and W_up matrices, enabling the model to combine disparate semantic features before activation.',
      algorithm: 'Matrix Multiplication (GEMM on Tensor Cores)'
    },
    revisionSummary: {
      keyTakeaway: 'Matrix multiplication represents geometric transformation of space. Columns represent transformed basis vectors.',
      formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} a \\\\ c \\end{pmatrix}',
      commonMistake: 'Assuming matrix multiplication is commutative. In general, AB ≠ BA!'
    },
    interactiveType: 'matrices',
    quiz: [
      {
        id: 'la2_q1',
        question: 'What does a determinant of 0 (det(A) = 0) mean geometrically for a 2D matrix transformation?',
        options: [
          'The transformation rotates space by 360 degrees',
          'Space is collapsed into a single line or point (loss of dimension/information)',
          'The matrix doubles the area of all shapes',
          'The matrix is invertible'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Remember that det(A) is the area scaling factor. What happens if area becomes 0?'],
        explanation: 'When det(A) = 0, the 2D area scales to 0, which means 2D space has been squashed onto a 1D line or 0D point. You cannot invert this matrix because the lost dimension cannot be recovered.',
        misconceptionExplanation: 'An invertible matrix requires a nonzero determinant.'
      }
    ]
  },

  linear_algebra_3: {
    id: 'linear_algebra_3',
    moduleId: 'linear_algebra',
    stage: 2,
    title: 'Eigenvalues & Eigenvectors',
    summary: 'Discover the special axes that remain steadfast in direction during transformations, forming the backbone of PCA and spectral analysis.',
    estimatedMinutes: 20,
    xpReward: 100,
    prerequisites: ['linear_algebra_2'],
    whyItMatters: 'Most vectors change direction when multiplied by a matrix. Eigenvectors are the rare, special vectors whose direction is unchanged — they are merely stretched by a factor λ (the eigenvalue). In AI, they reveal the principal directions of maximum variance in data.',
    everydayAnalogy: 'Think of spinning a globe. Every point on Earth moves in circles, EXCEPT the North and South poles, which remain in place along the axis of rotation. The axis of rotation is an eigenvector!',
    intuitiveExplanation: 'Av = λv. Matrix A acts on vector v like simple scalar multiplication by λ. If λ = 3, the vector stretches by 3x along its own line without tilting.',
    mathematicalDefinition: 'A \\mathbf{v} = \\lambda \\mathbf{v} \\iff (A - \\lambda I)\\mathbf{v} = \\mathbf{0} \\iff \\det(A - \\lambda I) = 0',
    keyFormula: 'A \\mathbf{v} = \\lambda \\mathbf{v}',
    symbolsExplained: [
      { symbol: 'A', meaning: 'Square matrix (n x n)' },
      { symbol: '\\mathbf{v}', meaning: 'Eigenvector (non-zero)' },
      { symbol: '\\lambda', meaning: 'Eigenvalue (scalar scaling factor)' },
      { symbol: 'I', meaning: 'Identity matrix' },
    ],
    workedExample: {
      problem: 'Find the eigenvalues and an eigenvector for A = [[2, 0], [0, 5]].',
      steps: [
        {
          stepTitle: 'Step 1: Set up characteristic equation det(A - λI) = 0',
          explanation: 'Subtract λ from the diagonal elements.',
          math: '\\det\\begin{pmatrix} 2 - \\lambda & 0 \\\\ 0 & 5 - \\lambda \\end{pmatrix} = (2 - \\lambda)(5 - \\lambda) - 0 = 0'
        },
        {
          stepTitle: 'Step 2: Solve for λ',
          explanation: 'Roots are immediate from diagonal factorization.',
          math: '\\lambda_1 = 5, \\quad \\lambda_2 = 2'
        },
        {
          stepTitle: 'Step 3: Find eigenvector for λ1 = 5',
          explanation: 'Solve (A - 5I)v = 0: [[-3, 0], [0, 0]] [x, y]^T = [0, 0]^T => -3x = 0 => x = 0, y can be any nonzero number (e.g. 1).',
          math: '\\mathbf{v}_1 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}'
        }
      ],
      finalResult: '\\lambda_1 = 5 \\text{ with } \\mathbf{v}_1 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}; \\quad \\lambda_2 = 2 \\text{ with } \\mathbf{v}_2 = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}'
    },
    aiApplication: {
      title: 'Principal Component Analysis (PCA)',
      description: 'PCA computes the covariance matrix of high-dimensional data (e.g. 1000 features). The eigenvectors with the largest eigenvalues correspond to the axes capturing the highest variance, allowing compression to 2D or 3D with minimal information loss.',
      algorithm: 'PCA / Eigendecomposition'
    },
    revisionSummary: {
      keyTakeaway: 'Eigenvectors are vectors whose direction is invariant under matrix transformation; eigenvalues specify the amount of stretching.',
      formula: 'A \\mathbf{v} = \\lambda \\mathbf{v}',
      commonMistake: 'Forgetting that eigenvectors must be non-zero (v ≠ 0 by definition).'
    },
    interactiveType: 'pca',
    quiz: [
      {
        id: 'la3_q1',
        question: 'If matrix A has eigenvector v with eigenvalue λ = -2, what happens to vector v when multiplied by A?',
        options: [
          'It rotates by 90 degrees and doubles in length',
          'It flips 180 degrees in direction and doubles in length',
          'Its length is cut in half',
          'It becomes the zero vector'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Multiplying a vector by -2 reverses its direction and scales its magnitude by 2.'],
        explanation: 'Av = -2v. The negative sign flips the vector along its line of span (180°), and the magnitude |λ| = 2 doubles its length.',
        misconceptionExplanation: 'A negative eigenvalue scales along the exact same line of span in the opposite direction; it does not turn 90 degrees.'
      }
    ]
  },

  linear_algebra_4: {
    id: 'linear_algebra_4',
    moduleId: 'linear_algebra',
    stage: 2,
    title: 'Singular Value Decomposition (SVD) & Embeddings',
    summary: 'Deconstruct any matrix into rotation, scaling, and rotation, unleashing low-rank compression in LoRA and recommendation engines.',
    estimatedMinutes: 20,
    xpReward: 95,
    prerequisites: ['linear_algebra_3'],
    whyItMatters: 'Not all matrices are square or diagonalizable. SVD works on ANY rectangular matrix M (m x n), factorizing it into M = U Σ V^T. It powers LoRA (Low-Rank Adaptation) fine-tuning of 70B parameter LLMs and matrix factorization in recommender systems.',
    everydayAnalogy: 'Think of prime factorization: any integer like 12 can be factored into 2 x 2 x 3. SVD is the ultimate prime factorization for rectangular data matrices.',
    intuitiveExplanation: 'SVD states that any linear mapping can be broken into: (1) an initial rotation/reflection V^T, (2) independent scaling along orthogonal axes Σ, and (3) a final rotation/reflection U.',
    mathematicalDefinition: 'M = U \\Sigma V^T, \\quad U \\in \\mathbb{R}^{m \\times m}, \\; \\Sigma \\in \\mathbb{R}^{m \\times n}, \\; V \\in \\mathbb{R}^{n \\times n}',
    keyFormula: 'M \\approx \\sum_{i=1}^k \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T \\quad (k \\ll \\min(m, n))',
    symbolsExplained: [
      { symbol: 'U', meaning: 'Left singular vectors (orthonormal basis for column space)' },
      { symbol: '\\Sigma', meaning: 'Diagonal matrix of singular values in descending order (σ_1 ≥ σ_2 ≥ ... ≥ 0)' },
      { symbol: 'V^T', meaning: 'Right singular vectors (orthonormal basis for row space)' },
      { symbol: 'k', meaning: 'Rank cutoff for low-rank approximation' },
    ],
    workedExample: {
      problem: 'Explain how rank-1 approximation of a 1000 x 2000 weight matrix reduces parameters from 2,000,000 to just 3,001.',
      steps: [
        {
          stepTitle: 'Step 1: Original parameter count',
          explanation: 'Storing dense matrix M requires 1000 x 2000 = 2,000,000 floats.',
          math: '\\text{Params}_{\\text{dense}} = 1000 \\times 2000 = 2\\text{M}'
        },
        {
          stepTitle: 'Step 2: Low-rank rank-1 factorization (u_1, σ_1, v_1)',
          explanation: 'Store vector u_1 (length 1000), scalar σ_1 (1), and vector v_1 (length 2000).',
          math: '\\text{Params}_{\\text{rank-1}} = 1000 + 1 + 2000 = 3001'
        },
        {
          stepTitle: 'Step 3: Compression ratio',
          explanation: 'Calculate compression factor.',
          math: '\\frac{3001}{2\\text{,}000\\text{,}000} \\approx 0.15\\% \\implies 99.85\\% \\text{ reduction}'
        }
      ],
      finalResult: '3001 \\text{ parameters (over } 660\\times \\text{ smaller!)}'
    },
    aiApplication: {
      title: 'LoRA (Low-Rank Adaptation) Fine-Tuning',
      description: 'Instead of retraining all 70 billion weights W in Llama-3, LoRA freezes W and trains low-rank decomposition matrices A and B such that ΔW = B * A (where rank r is typically 8 or 16). This cuts GPU VRAM requirements by over 80%.',
      algorithm: 'LoRA / Low-Rank Matrix Factorization'
    },
    revisionSummary: {
      keyTakeaway: 'SVD factorizes any matrix into orthogonal rotations and singular scales, providing optimal low-rank matrix approximations.',
      formula: 'M = U \\Sigma V^T',
      commonMistake: 'Confusing singular values σ_i with eigenvalues λ_i. Singular values are always non-negative real numbers.'
    },
    interactiveType: 'pca',
    quiz: [
      {
        id: 'la4_q1',
        question: 'In LoRA fine-tuning, why can we approximate large weight update matrices ΔW of size 4096 x 4096 with rank r = 16?',
        options: [
          'Because neural networks have zero rank',
          'Because weight updates have low intrinsic rank, meaning most change occurs along a few primary singular directions',
          'Because GPUs cannot multiply matrices larger than 16',
          'Because SVD deletes all bias terms'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Think about intrinsic dimensionality of adaptation tasks.'],
        explanation: 'Empirical research (Aghajanyan et al., Hu et al.) proved that task-specific adaptation matrices have a very low intrinsic rank, so the top few singular values capture nearly all necessary parameter adaptation.',
        misconceptionExplanation: 'Weight update matrices are not zero; they have low intrinsic rank.'
      }
    ]
  },

  calculus_1: {
    id: 'calculus_1',
    moduleId: 'calculus',
    stage: 3,
    title: 'Derivatives & The Slope of Learning',
    summary: 'Master instantaneous rate of change, tangent slopes, and the secret of how gradients tell models which way to step.',
    estimatedMinutes: 16,
    xpReward: 85,
    prerequisites: ['foundations_1'],
    whyItMatters: 'If a neural network adjusts a weight w by +0.01, does its prediction error go UP or DOWN? The derivative dL/dw answers this exact question: it is the sensitivity of the loss function to changes in that parameter.',
    everydayAnalogy: 'Imagine walking down a misty mountain in pitch darkness. You cannot see the bottom. To reach the valley, you feel the slope beneath your boots with each footstep and step downhill. The slope beneath your boots is the derivative!',
    intuitiveExplanation: 'The derivative f\'(x) is the limit of the average slope as the interval h shrinks to zero: [f(x+h) - f(x)] / h. If f\'(x) is positive, increasing x increases the function. If f\'(x) is negative, increasing x decreases the function.',
    mathematicalDefinition: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}',
    keyFormula: '\\frac{d}{dx}[x^n] = n x^{n-1}, \\quad \\frac{d}{dx}[\\sigma(x)] = \\sigma(x)(1 - \\sigma(x))',
    symbolsExplained: [
      { symbol: '\\frac{df}{dx}', meaning: 'Derivative of f with respect to x' },
      { symbol: 'h', meaning: 'Infinitesimal step size approaching 0' },
      { symbol: '\\sigma(x)', meaning: 'Sigmoid activation function 1 / (1 + e^-x)' },
    ],
    workedExample: {
      problem: 'Find the derivative of the loss function L(w) = (w - 3)^2 at w = 5, and determine which direction to adjust w to reduce L.',
      steps: [
        {
          stepTitle: 'Step 1: Compute analytical derivative using power rule',
          explanation: 'dL/dw = 2(w - 3) * 1.',
          math: '\\frac{dL}{dw} = 2(w - 3)'
        },
        {
          stepTitle: 'Step 2: Evaluate derivative at current weight w = 5',
          explanation: 'Plug in w = 5.',
          math: '\\frac{dL}{dw}\\Big|_{w=5} = 2(5 - 3) = +4.0'
        },
        {
          stepTitle: 'Step 3: Determine gradient descent update direction',
          explanation: 'Because the derivative is positive (+4.0), increasing w increases loss. To decrease loss, we must subtract the derivative: w_new = w - α * (dL/dw).',
          math: 'w_{\\text{new}} = 5 - (0.1 \\times 4.0) = 4.6 \\quad (\\text{moving closer to optimum } w=3)'
        }
      ],
      finalResult: '\\frac{dL}{dw} = +4.0 \\implies \\text{decrease } w \\text{ to descend loss}'
    },
    aiApplication: {
      title: 'Weight Updates in Stochastic Gradient Descent',
      description: 'Every optimizer (SGD, AdamW, RMSprop) uses derivatives to update millions of weights: w := w - learning_rate * (dL/dw). Without calculus, models would have to guess weights randomly.',
      algorithm: 'Gradient Descent'
    },
    revisionSummary: {
      keyTakeaway: 'The derivative gives the instantaneous rate of change. Stepping in the opposite direction of the derivative minimizes loss.',
      formula: 'w \\leftarrow w - \\alpha \\frac{dL}{dw}',
      commonMistake: 'Adding the gradient instead of subtracting it (which would cause gradient ascent to the maximum error!).'
    },
    interactiveType: 'derivatives',
    quiz: [
      {
        id: 'c1_q1',
        question: 'If dL/dw = -6.0 at the current weight w, which direction should we move w to reduce the loss L?',
        options: [
          'Decrease w (make w more negative)',
          'Increase w (move w in the positive direction)',
          'Leave w unchanged because it is at a local minimum',
          'Divide w by zero'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Gradient descent rule: w_new = w - α * (dL/dw). What is w - α * (-6)?'],
        explanation: 'Because the derivative is negative, the function slopes downward to the right. Moving w in the positive direction decreases the loss. Formally, w - α(-6) = w + 6α (an increase in w).',
        misconceptionExplanation: 'Subtracting a negative number results in an increase.'
      }
    ]
  },

  calculus_2: {
    id: 'calculus_2',
    moduleId: 'calculus',
    stage: 3,
    title: 'Partial Derivatives & The Gradient Vector',
    summary: 'Extend single-variable calculus to high-dimensional loss landscapes with partial derivatives and the gradient operator ∇.',
    estimatedMinutes: 18,
    xpReward: 90,
    prerequisites: ['calculus_1'],
    whyItMatters: 'Neural networks have millions of parameters, not just one. The gradient vector ∇L gathers the partial derivatives of all weights into a single vector pointing in the direction of steepest ascent.',
    everydayAnalogy: 'Imagine standing on a 3D hill. You can face North, South, East, or West. The slope in the East-West direction is ∂L/∂x, and North-South is ∂L/∂y. The gradient vector points directly up the steepest incline.',
    intuitiveExplanation: 'To take the partial derivative ∂f/∂x, treat all other variables (like y, z) as frozen constants and differentiate with respect to x only.',
    mathematicalDefinition: '\\nabla f(x_1, \\dots, x_n) = \\begin{pmatrix} \\frac{\\partial f}{\\partial x_1} \\\\ \\vdots \\\\ \\frac{\\partial f}{\\partial x_n} \\end{pmatrix}',
    keyFormula: '\\nabla L = \\left[ \\frac{\\partial L}{\\partial w_1}, \\frac{\\partial L}{\\partial w_2}, \\dots, \\frac{\\partial L}{\\partial b} \\right]^T',
    symbolsExplained: [
      { symbol: '\\nabla', meaning: 'Nabla / Del operator representing the multivariable gradient vector' },
      { symbol: '\\frac{\\partial f}{\\partial x}', meaning: 'Partial derivative of f with respect to x (holding other variables constant)' },
    ],
    workedExample: {
      problem: 'Given 2D loss surface L(w1, w2) = 2 w1^2 + 3 w2^2, compute the gradient vector ∇L at point (w1=1, w2=2).',
      steps: [
        {
          stepTitle: 'Step 1: Compute partial derivative with respect to w1',
          explanation: 'Treat w2 as a constant: d/dw1 [2 w1^2 + 3 C^2] = 4 w1.',
          math: '\\frac{\\partial L}{\\partial w_1} = 4 w_1'
        },
        {
          stepTitle: 'Step 2: Compute partial derivative with respect to w2',
          explanation: 'Treat w1 as a constant: d/dw2 [2 C^2 + 3 w2^2] = 6 w2.',
          math: '\\frac{\\partial L}{\\partial w_2} = 6 w_2'
        },
        {
          stepTitle: 'Step 3: Assemble gradient vector at point (1, 2)',
          explanation: 'Plug in w1=1 and w2=2.',
          math: '\\nabla L(1, 2) = \\begin{pmatrix} 4(1) \\\\ 6(2) \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 12 \\end{pmatrix}'
        }
      ],
      finalResult: '\\nabla L = \\begin{pmatrix} 4 \\\\ 12 \\end{pmatrix} \\implies \\text{Steepest descent vector is } -\\nabla L = \\begin{pmatrix} -4 \\\\ -12 \\end{pmatrix}'
    },
    aiApplication: {
      title: 'Multivariable Optimization Landscapes',
      description: 'Loss surfaces in deep learning have billions of dimensions. PyTorch\'s torch.autograd computes ∇L across all model parameters simultaneously during loss.backward().',
      algorithm: 'Autograd / Multivariable Gradient Descent'
    },
    revisionSummary: {
      keyTakeaway: 'The gradient vector points in the direction of greatest increase. To minimize loss, we step in the direction of the negative gradient -∇L.',
      formula: '\\mathbf{w} \\leftarrow \\mathbf{w} - \\alpha \\nabla L(\\mathbf{w})',
      commonMistake: 'Treating other variables as variables instead of holding them strictly constant during partial differentiation.'
    },
    interactiveType: 'gradient_descent',
    quiz: [
      {
        id: 'c2_q1',
        question: 'Given f(x, y) = 3x^2 * y, what is the partial derivative ∂f/∂x?',
        options: ['6x * y', '3x^2', '6x', '6xy^2'],
        correctAnswer: 0,
        type: 'multiple-choice',
        hints: ['Treat y as a constant multiplier.'],
        explanation: 'd/dx [3y * x^2] = 3y * 2x = 6xy.',
        misconceptionExplanation: 'y is treated as a constant factor and remains in the product.'
      }
    ]
  },

  calculus_3: {
    id: 'calculus_3',
    moduleId: 'calculus',
    stage: 3,
    title: 'Chain Rule & Backpropagation',
    summary: 'Uncover the master equation of deep learning: propagating gradients backward through composition of layers.',
    estimatedMinutes: 22,
    xpReward: 110,
    prerequisites: ['calculus_2'],
    whyItMatters: 'Deep neural networks are composite functions: Loss = f_3(f_2(f_1(x))). How does a change in layer 1\'s weight affect the final loss at layer 3? The Chain Rule allows gradients to flow backward from loss to the earliest layers.',
    everydayAnalogy: 'Think of a row of gears. If Gear A rotates Gear B, and Gear B rotates Gear C, the speed of Gear C relative to Gear A is the product of their individual gear ratios: (Speed C / Speed A) = (Speed C / Speed B) * (Speed B / Speed A). That is the chain rule in action!',
    intuitiveExplanation: 'If y depends on u, and u depends on x, then dy/dx = (dy/du) * (du/dx). To find how input affects output, multiply the intermediate rates of change along the computational path.',
    mathematicalDefinition: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x) \\quad \\iff \\quad \\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial \\hat{y}} \\cdot \\frac{\\partial \\hat{y}}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}',
    keyFormula: '\\frac{\\partial L}{\\partial w_i} = \\delta \\cdot x_i, \\quad \\text{where } \\delta = \\frac{\\partial L}{\\partial z}',
    symbolsExplained: [
      { symbol: 'L', meaning: 'Loss value (scalar error)' },
      { symbol: '\\hat{y}', meaning: 'Network output prediction' },
      { symbol: 'z', meaning: 'Pre-activation (w · x + b)' },
      { symbol: '\\delta', meaning: 'Error term propagated back to current node' },
    ],
    workedExample: {
      problem: 'For a neuron with input x = 2, weight w, bias b = 0, activation y_hat = z^2, and loss L = (y_hat - 10)^2, compute dL/dw when w = 3.',
      steps: [
        {
          stepTitle: 'Step 1: Forward pass',
          explanation: 'Compute z, y_hat, and current loss L.',
          math: 'z = w x = 3(2) = 6, \\quad \\hat{y} = z^2 = 36, \\quad L = (36 - 10)^2 = 26^2 = 676'
        },
        {
          stepTitle: 'Step 2: Backward pass using chain rule dL/dw = (dL/dy_hat) * (dy_hat/dz) * (dz/dw)',
          explanation: 'Compute each factor separately.',
          math: '\\frac{\\partial L}{\\partial \\hat{y}} = 2(\\hat{y} - 10) = 2(26) = 52'
        },
        {
          stepTitle: 'Step 3: Activation gradient and pre-activation gradient',
          explanation: 'dy_hat/dz = 2z = 2(6) = 12. dz/dw = x = 2.',
          math: '\\frac{\\partial \\hat{y}}{\\partial z} = 12, \\quad \\frac{\\partial z}{\\partial w} = 2'
        },
        {
          stepTitle: 'Step 4: Multiply factors',
          explanation: 'dL/dw = 52 * 12 * 2 = 1248.',
          math: '\\frac{\\partial L}{\\partial w} = 52 \\times 12 \\times 2 = 1248'
        }
      ],
      finalResult: '\\frac{\\partial L}{\\partial w} = 1248 \\implies \\text{Backpropagation gradient}'
    },
    aiApplication: {
      title: 'Backpropagation Algorithm in Deep Learning',
      description: 'Backpropagation is simply the recursive application of the multivariable chain rule on a computational graph from the output loss node backwards to every trainable weight tensor.',
      algorithm: 'Reverse-Mode Automatic Differentiation'
    },
    revisionSummary: {
      keyTakeaway: 'Backpropagation computes exact analytical gradients in O(N) operations by reusing intermediate chain-rule factors computed from the output backwards.',
      formula: '\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial \\text{out}} \\cdot \\frac{\\partial \\text{out}}{\\partial \\text{in}} \\cdot \\frac{\\partial \\text{in}}{\\partial w}',
      commonMistake: 'Vanishing gradients: multiplying many numbers less than 1 (like Sigmoid derivative ≤ 0.25) across many layers causes the gradient to shrink to near zero!'
    },
    interactiveType: 'neural_network',
    quiz: [
      {
        id: 'c3_q1',
        question: 'Why does using Sigmoid activation in a 50-layer deep network cause the "Vanishing Gradient" problem during backpropagation?',
        options: [
          'Sigmoid functions take too long to compute on GPUs',
          'The maximum derivative of Sigmoid is only 0.25; multiplying 50 factors ≤ 0.25 via the chain rule shrinks the gradient to almost 0',
          'Sigmoids only accept positive numbers',
          'Sigmoids cannot be differentiated'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Consider (0.25)^50 ≈ 7.8 x 10^-31.'],
        explanation: 'Because σ\'(x) ≤ 0.25, the chain rule repeatedly multiplies by values ≤ 0.25. In deep networks, the gradient vanishes before reaching early layers, preventing them from learning. This motivated the adoption of ReLU.',
        misconceptionExplanation: 'It is a mathematical chain-rule multiplication issue, not a GPU or domain issue.'
      }
    ]
  },

  probability_1: {
    id: 'probability_1',
    moduleId: 'probability',
    stage: 4,
    title: 'Conditional Probability & Bayes\' Theorem',
    summary: 'Update beliefs in the presence of new evidence using Bayes\' Theorem — the foundation of Naive Bayes and generative AI.',
    estimatedMinutes: 18,
    xpReward: 85,
    prerequisites: ['foundations_1'],
    whyItMatters: 'AI models never have 100% certainty. Bayes\' Theorem provides the mathematically optimal framework to update the probability of a hypothesis H given new observed evidence E: P(H|E) = P(E|H) * P(H) / P(E).',
    everydayAnalogy: 'You hear a siren. Is it a fire truck or an ice cream truck? If you see smoke (evidence), you update your prior belief that it is an emergency versus a dessert vendor. That rational updating is Bayes\' Theorem.',
    intuitiveExplanation: 'Prior belief P(H) multiplied by the likelihood of observing the evidence if the hypothesis is true P(E|H), normalized by the total evidence probability P(E), produces the posterior belief P(H|E).',
    mathematicalDefinition: 'P(A|B) = \\frac{P(B|A) P(A)}{P(B)} = \\frac{P(B|A) P(A)}{P(B|A)P(A) + P(B|\\neg A)P(\\neg A)}',
    keyFormula: 'P(\\text{Spam}|\\text{Word}) = \\frac{P(\\text{Word}|\\text{Spam}) P(\\text{Spam})}{P(\\text{Word})}',
    symbolsExplained: [
      { symbol: 'P(A)', meaning: 'Prior probability of event A before seeing evidence' },
      { symbol: 'P(B|A)', meaning: 'Likelihood: probability of evidence B occurring if A is true' },
      { symbol: 'P(A|B)', meaning: 'Posterior probability: updated belief in A after observing B' },
      { symbol: 'P(B)', meaning: 'Marginal likelihood: total probability of evidence B across all outcomes' },
    ],
    workedExample: {
      problem: 'A rare disease affects 1% of population (P(D)=0.01). A test is 95% accurate when disease is present (P(Pos|D)=0.95), but has a 5% false positive rate (P(Pos|No D)=0.05). If a patient tests positive, what is the probability they actually have the disease?',
      steps: [
        {
          stepTitle: 'Step 1: Identify given probabilities',
          explanation: 'P(D) = 0.01, P(No D) = 0.99, P(Pos|D) = 0.95, P(Pos|No D) = 0.05.',
          math: 'P(D) = 0.01, \\quad P(\\neg D) = 0.99'
        },
        {
          stepTitle: 'Step 2: Calculate total probability of testing positive P(Pos)',
          explanation: 'Use law of total probability: P(Pos) = P(Pos|D)P(D) + P(Pos|No D)P(No D).',
          math: 'P(\\text{Pos}) = (0.95 \\times 0.01) + (0.05 \\times 0.99) = 0.0095 + 0.0495 = 0.0590'
        },
        {
          stepTitle: 'Step 3: Apply Bayes\' Theorem for posterior P(D|Pos)',
          explanation: 'Divide true positive rate contribution by total positive probability.',
          math: 'P(D|\\text{Pos}) = \\frac{0.0095}{0.0590} \\approx 0.161'
        }
      ],
      finalResult: 'P(D|\\text{Pos}) \\approx 16.1\\% \\quad (\\text{Not 95\\%! Prior base rate dominates})'
    },
    aiApplication: {
      title: 'Naive Bayes Spam Classifier',
      description: 'Naive Bayes classifies emails as spam by calculating the posterior probability P(Spam|words) = P(Spam) * Π P(word_i|Spam), assuming word occurrences are conditionally independent.',
      algorithm: 'Naive Bayes Classifier'
    },
    revisionSummary: {
      keyTakeaway: 'Never ignore the prior base rate! A test with 95% accuracy can still have a low posterior if the event is extremely rare.',
      formula: 'P(A|B) = \\frac{P(B|A) P(A)}{P(B)}',
      commonMistake: 'Base rate fallacy: confusing P(A|B) with P(B|A). The probability of having a disease given a positive test is NOT equal to the test accuracy!'
    },
    interactiveType: 'probability',
    quiz: [
      {
        id: 'p1_q1',
        question: 'What is the "Base Rate Fallacy" commonly committed in probability and AI modeling?',
        options: [
          'Assuming all probabilities sum to 1',
          'Confusing the conditional probability P(Evidence|Hypothesis) with the posterior P(Hypothesis|Evidence) while ignoring low prior probability P(Hypothesis)',
          'Using a learning rate that is too high',
          'Assuming coins always land heads 50% of the time'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Think of the medical test example: why was the chance of disease only 16% despite a 95% accurate test?'],
        explanation: 'The base rate fallacy occurs when people judge the likelihood of a hypothesis based purely on the evidence test accuracy, ignoring how rare the hypothesis is in the general population.',
        misconceptionExplanation: 'It is a failure to incorporate prior probability distribution.'
      }
    ]
  },

  probability_2: {
    id: 'probability_2',
    moduleId: 'probability',
    stage: 4,
    title: 'Distributions & The Central Limit Theorem',
    summary: 'Explore Bernoulli, Binomial, and Normal distributions, expectation, variance, and why the Gaussian bell curve rules AI.',
    estimatedMinutes: 18,
    xpReward: 90,
    prerequisites: ['probability_1'],
    whyItMatters: 'From weight initialization (He/Xavier) to Variational Autoencoders (VAEs) and Diffusion Models, the Gaussian Normal distribution is the core prior distribution in machine learning.',
    everydayAnalogy: 'Flip a single coin: heads or tails (Bernoulli). Flip 100 coins and count heads: peak at 50 with smooth bell spread (Binomial). Average thousands of arbitrary random measurements: they always converge into a smooth bell curve (Central Limit Theorem)!',
    intuitiveExplanation: 'Expectation E[X] is the probability-weighted average outcome. Variance Var(X) measures the spread around that average. The Central Limit Theorem proves that the sum of independent random variables approaches a Normal distribution regardless of their original shape.',
    mathematicalDefinition: '\\mathcal{N}(x; \\mu, \\sigma^2) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)',
    keyFormula: '\\mathbb{E}[X] = \\sum x P(x), \\quad \\text{Var}(X) = \\mathbb{E}[(X - \\mu)^2] = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2',
    symbolsExplained: [
      { symbol: '\\mu', meaning: 'Mean (center of mass / expectation)' },
      { symbol: '\\sigma', meaning: 'Standard deviation (spread / width of bell curve)' },
      { symbol: '\\sigma^2', meaning: 'Variance (expected squared deviation from mean)' },
    ],
    workedExample: {
      problem: 'For a fair 6-sided die, compute the expected value E[X] and variance Var(X).',
      steps: [
        {
          stepTitle: 'Step 1: Compute expected value E[X]',
          explanation: 'Each side 1 through 6 has probability 1/6.',
          math: '\\mathbb{E}[X] = \\frac{1}{6}(1 + 2 + 3 + 4 + 5 + 6) = \\frac{21}{6} = 3.5'
        },
        {
          stepTitle: 'Step 2: Compute expected squared outcome E[X^2]',
          explanation: 'Sum x^2 * P(x) for x = 1 to 6.',
          math: '\\mathbb{E}[X^2] = \\frac{1}{6}(1^2 + 2^2 + 3^2 + 4^2 + 5^2 + 6^2) = \\frac{91}{6} \\approx 15.167'
        },
        {
          stepTitle: 'Step 3: Compute variance Var(X) = E[X^2] - (E[X])^2',
          explanation: 'Subtract square of mean.',
          math: '\\text{Var}(X) = \\frac{91}{6} - (3.5)^2 = 15.167 - 12.25 = 2.917'
        }
      ],
      finalResult: '\\mathbb{E}[X] = 3.5, \\quad \\text{Var}(X) \\approx 2.917'
    },
    aiApplication: {
      title: 'Latent Space Priors in VAEs & Stable Diffusion',
      description: 'Latent Diffusion Models (Stable Diffusion, Midjourney) sample random latent noise from a standard normal distribution N(0, I) and iteratively denoise it via neural networks into photorealistic images.',
      algorithm: 'Diffusion Denoising / VAE Reparameterization'
    },
    revisionSummary: {
      keyTakeaway: 'The Central Limit Theorem guarantees that aggregate noise in real-world systems behaves normally, justifying Gaussian assumptions in AI models.',
      formula: '\\mathcal{N}(\\mu, \\sigma^2)',
      commonMistake: 'Confusing standard deviation σ with variance σ^2. Standard deviation is in the same units as the data; variance is in squared units.'
    },
    interactiveType: 'probability',
    quiz: [
      {
        id: 'p2_q1',
        question: 'According to the Central Limit Theorem, what happens to the distribution of sample means as sample size N increases?',
        options: [
          'It becomes completely uniform',
          'It converges to a Normal (Gaussian) bell curve, regardless of the underlying population distribution',
          'It collapses to 0',
          'It becomes skewed'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Think of rolling 50 dice and averaging the score.'],
        explanation: 'The Central Limit Theorem proves that sample averages converge toward a Gaussian normal distribution with mean μ and variance σ^2 / N as N increases.',
        misconceptionExplanation: 'It does not become uniform; it becomes a bell-shaped Gaussian normal distribution.'
      }
    ]
  },

  statistics_1: {
    id: 'statistics_1',
    moduleId: 'statistics',
    stage: 5,
    title: 'Descriptive Statistics & Outlier Sensitivity',
    summary: 'Compare Mean vs Median, Standard Deviation, Skewness, and how extreme outliers distort machine learning models.',
    estimatedMinutes: 15,
    xpReward: 75,
    prerequisites: ['foundations_1'],
    whyItMatters: 'Loss functions like Mean Squared Error (MSE) square error terms, making them hyper-sensitive to extreme outliers. Choosing between Mean and Median (or L2 vs L1 loss) depends directly on statistical resistance.',
    everydayAnalogy: 'Nine teachers in a coffee shop have an average income of $60,000. Bill Gates walks in. The MEAN income spikes to $100,000,000, while the MEDIAN income stays at $60,000! Which metric represents reality better? Median is robust; mean is easily distorted.',
    intuitiveExplanation: 'Mean balances total sum. Median finds the exact 50th percentile rank. When data is skewed or has heavy tails, median and interquartile ranges give a more reliable picture of central tendency.',
    mathematicalDefinition: '\\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i, \\quad s = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^n (x_i - \\bar{x})^2}',
    keyFormula: '\\text{IQR} = Q_3 - Q_1, \\quad \\text{Outlier Boundary} = [Q_1 - 1.5\\text{IQR}, \\; Q_3 + 1.5\\text{IQR}]',
    symbolsExplained: [
      { symbol: '\\bar{x}', meaning: 'Sample mean' },
      { symbol: 's', meaning: 'Sample standard deviation (with Bessel\'s correction n-1)' },
      { symbol: 'Q_1, Q_3', meaning: 'First (25%) and Third (75%) quartiles' },
      { symbol: '\\text{IQR}', meaning: 'Interquartile Range' },
    ],
    workedExample: {
      problem: 'Given dataset [2, 4, 4, 5, 7, 9, 80], compute Mean and Median, and explain the outlier effect.',
      steps: [
        {
          stepTitle: 'Step 1: Compute Mean',
          explanation: 'Sum all 7 numbers and divide by 7.',
          math: '\\bar{x} = \\frac{2 + 4 + 4 + 5 + 7 + 9 + 80}{7} = \\frac{111}{7} \\approx 15.86'
        },
        {
          stepTitle: 'Step 2: Compute Median',
          explanation: 'Find middle number of sorted list (position 4 of 7).',
          math: '\\text{Median} = 5'
        },
        {
          stepTitle: 'Step 3: Analyze the difference',
          explanation: 'The single outlier (80) pulled the mean to 15.86, which is higher than 6 out of 7 data points! The median (5) accurately reflects central tendency.',
          math: '\\bar{x} = 15.86 \\text{ vs Median} = 5'
        }
      ],
      finalResult: '\\text{Mean} \\approx 15.86, \\quad \\text{Median} = 5 \\implies \\text{Outlier skew}'
    },
    aiApplication: {
      title: 'Loss Function Choice: MSE (L2) vs MAE (L1)',
      description: 'MSE corresponds to optimizing the mean and is vulnerable to noisy label outliers. MAE corresponds to optimizing the median and is robust against corrupt training examples.',
      algorithm: 'Robust Regression / Huber Loss'
    },
    revisionSummary: {
      keyTakeaway: 'Outliers exert immense leverage on mean and variance. Use median and IQR for skewed distributions, and consider L1 or Huber loss when training data contains noise.',
      formula: '\\bar{x} = \\frac{1}{n}\\sum x_i',
      commonMistake: 'Assuming normal distribution for financial, text, or web data that actually exhibit power-law fat tails.'
    },
    interactiveType: 'statistics',
    quiz: [
      {
        id: 's1_q1',
        question: 'If a training dataset contains extreme sensor malfunction outliers (e.g. readings of 999999), why is L1 loss (Mean Absolute Error) preferred over L2 loss (Mean Squared Error)?',
        options: [
          'L1 loss is faster to compute on TPU hardware',
          'L2 squares the error, giving an outlier of 999999 immense gradient pull that ruins all other predictions, while L1 produces constant gradient magnitude of ±1',
          'L1 loss eliminates the need for activation functions',
          'L2 loss cannot be minimized'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Compare d/de [e^2] = 2e with d/de [|e|] = sign(e).'],
        explanation: 'Squaring an outlier error makes its gradient enormous, forcing the model to distort all other parameters to fit that single broken sample. L1\'s gradient is bounded to ±1.',
        misconceptionExplanation: 'L2 loss squares errors, amplifying outlier pull exponentially.'
      }
    ]
  },

  statistics_2: {
    id: 'statistics_2',
    moduleId: 'statistics',
    stage: 5,
    title: 'Covariance, Correlation & Hypothesis Testing',
    summary: 'Distinguish correlation from causation, interpret covariance matrices, and understand p-values in A/B testing.',
    estimatedMinutes: 18,
    xpReward: 85,
    prerequisites: ['statistics_1'],
    whyItMatters: 'Feature selection, multi-collinearity, and data leakage all hinge on correlation matrices. Furthermore, evaluating whether a new LLM prompt or model checkpoint is genuinely better requires hypothesis testing and p-values.',
    everydayAnalogy: 'Ice cream sales and shark attacks both spike in July. Does ice cream attract sharks? No! A confounding variable (warm weather / summer swimming) drives both. Correlation does not equal causation!',
    intuitiveExplanation: 'Covariance measures whether two variables increase together (+), decrease together (-), or are unrelated (0). Pearson correlation r normalizes covariance between -1 and +1, independent of units of measurement.',
    mathematicalDefinition: '\\text{Cov}(X, Y) = \\frac{1}{n-1}\\sum (x_i - \\bar{x})(y_i - \\bar{y}), \\quad r_{XY} = \\frac{\\text{Cov}(X,Y)}{\\sigma_X \\sigma_Y}',
    keyFormula: 'r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}} \\quad (-1 \\le r \\le +1)',
    symbolsExplained: [
      { symbol: '\\text{Cov}(X,Y)', meaning: 'Covariance between variables X and Y' },
      { symbol: 'r_{XY}', meaning: 'Pearson correlation coefficient (-1: perfect negative, 0: uncorrelated, +1: perfect positive)' },
      { symbol: 'p\\text{-value}', meaning: 'Probability of observing this result by random chance assuming the null hypothesis is true' },
    ],
    workedExample: {
      problem: 'In an A/B test between Model A and Model B, we observe a benchmark win rate of 54% over 10,000 evals (p-value = 0.001). Interpret this result against significance threshold α = 0.05.',
      steps: [
        {
          stepTitle: 'Step 1: State hypotheses',
          explanation: 'Null hypothesis H0: Model A and B have identical performance (win rate = 50%). Alternative H1: Model B is truly superior.',
          math: 'H_0: p = 0.50, \\quad H_1: p > 0.50'
        },
        {
          stepTitle: 'Step 2: Compare p-value to significance level α = 0.05',
          explanation: 'p = 0.001 is much smaller than α = 0.05.',
          math: 'p = 0.001 < 0.05'
        },
        {
          stepTitle: 'Step 3: Draw conclusion',
          explanation: 'There is only a 0.1% chance this performance boost occurred by random sample luck. We reject H0; the improvement is statistically significant.',
          math: '\\text{Reject } H_0 \\implies \\text{Statistically significant}'
        }
      ],
      finalResult: '\\text{Statistically significant improvement } (p = 0.001)'
    },
    aiApplication: {
      title: 'Model Evaluation & LLM-as-a-Judge Evals',
      description: 'When benchmarking a new model version against baseline on MT-Bench or LMSYS Chatbot Arena, teams calculate win-rate confidence intervals and p-values to prevent shipping noisy regressions.',
      algorithm: 'Two-Sample Hypothesis Testing / Elo Rating'
    },
    revisionSummary: {
      keyTakeaway: 'A correlation coefficient r measures linear association, but cannot establish causality. A small p-value indicates data is unlikely under the null hypothesis.',
      formula: '-1 \\le r \\le 1',
      commonMistake: 'Thinking p-value is the probability that the hypothesis is true. A p-value is P(observed data | null hypothesis is true)!'
    },
    interactiveType: 'statistics',
    quiz: [
      {
        id: 's2_q1',
        question: 'What does a Pearson correlation of r = 0 between two features X and Y mean?',
        options: [
          'There is no relationship whatsoever between X and Y',
          'There is no linear relationship, but there could still be a strong nonlinear relationship (like y = x^2)',
          'X and Y are always identical',
          'X causes Y'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Consider y = x^2 for x in [-5, 5]. What is the correlation?'],
        explanation: 'Pearson correlation only measures LINEAR association. For y = x^2 with symmetric points, r = 0 even though y is 100% deterministically determined by x.',
        misconceptionExplanation: 'r = 0 only rules out linear correlation; nonlinear relationships can still exist.'
      }
    ]
  },

  optimization_1: {
    id: 'optimization_1',
    moduleId: 'optimization',
    stage: 6,
    title: 'Gradient Descent Dynamics & Learning Rates',
    summary: 'Analyze loss surfaces, learning rate tuning, momentum, saddle points, and why AdamW is the king of optimizers.',
    estimatedMinutes: 20,
    xpReward: 100,
    prerequisites: ['calculus_2'],
    whyItMatters: 'If your learning rate is too small, your training takes weeks and stalls in local plateaus. If it is too large, loss explodes to NaN. Understanding optimizer dynamics is essential to training stable AI models.',
    everydayAnalogy: 'Imagine a skier trying to find the lowest point in a snowy bowl in dense fog. A tiny step takes forever to get down the mountain. A massive leap shoots the skier over the opposite peak into space. A balanced step with momentum carries the skier smoothly through flat sections.',
    intuitiveExplanation: 'Gradient descent computes step = -learning_rate * ∇L. Momentum adds a fraction β of the previous step\'s velocity to push past shallow valleys and damp oscillations. Adam computes adaptive per-parameter learning rates using first and second moment estimates.',
    mathematicalDefinition: 'm_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t, \\quad v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2, \\quad \\theta_t = \\theta_{t-1} - \\frac{\\alpha}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t',
    keyFormula: '\\mathbf{w}_{t+1} = \\mathbf{w}_t - \\alpha \\nabla L(\\mathbf{w}_t)',
    symbolsExplained: [
      { symbol: '\\alpha', meaning: 'Learning rate (step size multiplier)' },
      { symbol: 'm_t', meaning: 'First moment vector (moving average of gradients / momentum)' },
      { symbol: 'v_t', meaning: 'Second moment vector (moving average of squared gradients)' },
      { symbol: '\\epsilon', meaning: 'Small constant (e.g. 1e-8) preventing division by zero' },
    ],
    workedExample: {
      problem: 'On a 1D loss curve L(w) = w^2, start at w_0 = 10. Compute w_1 and w_2 using learning rate α = 0.2.',
      steps: [
        {
          stepTitle: 'Step 1: Compute gradient at w_0 = 10',
          explanation: 'dL/dw = 2w => at w=10, gradient = 20.',
          math: '\\nabla L(w_0) = 2(10) = 20'
        },
        {
          stepTitle: 'Step 2: Update to w_1',
          explanation: 'w_1 = w_0 - α * ∇L = 10 - (0.2 * 20) = 10 - 4 = 6.',
          math: 'w_1 = 10 - (0.2 \\times 20) = 6'
        },
        {
          stepTitle: 'Step 3: Compute gradient at w_1 = 6 and update to w_2',
          explanation: 'Gradient at w=6 is 2(6) = 12. w_2 = 6 - (0.2 * 12) = 6 - 2.4 = 3.6.',
          math: 'w_2 = 6 - (0.2 \\times 12) = 3.6 \\quad (\\text{converging smoothly to } w=0)'
        }
      ],
      finalResult: 'w_0 = 10 \\to w_1 = 6 \\to w_2 = 3.6 \\to \\dots \\to 0'
    },
    aiApplication: {
      title: 'Training Foundation Models with AdamW',
      description: 'Llama-3, GPT-4, and Claude are trained using AdamW with cosine learning rate decay and warmup schedules to navigate non-convex multi-billion parameter loss landscapes.',
      algorithm: 'AdamW Optimizer'
    },
    revisionSummary: {
      keyTakeaway: 'Learning rate is the single most critical hyperparameter. Too small causes crawl; too large causes loss divergence or NaN.',
      formula: '\\theta \\leftarrow \\theta - \\alpha \\nabla_\\theta L',
      commonMistake: 'Keeping a fixed large learning rate throughout training without decay schedules.'
    },
    interactiveType: 'gradient_descent',
    quiz: [
      {
        id: 'o1_q1',
        question: 'What happens during gradient descent if the learning rate α is chosen excessively large (e.g. α > 2/L for Lipschitz constant L)?',
        options: [
          'The model reaches the global minimum in 1 step',
          'The parameter updates overshoot the valley, bounce higher on each iteration, and the loss explodes to infinity or NaN',
          'The model freezes and cannot update weights',
          'The gradient becomes zero'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Imagine taking a step that launches you over the opposite wall of the canyon.'],
        explanation: 'When the learning rate is too large, the update overshoots the minimum and lands higher on the opposite side of the bowl. Subsequent steps grow exponentially, causing divergence.',
        misconceptionExplanation: 'A larger learning rate does not guarantee faster convergence; beyond the stability bound it guarantees divergence.'
      }
    ]
  },

  optimization_2: {
    id: 'optimization_2',
    moduleId: 'optimization',
    stage: 6,
    title: 'Information Theory: Entropy & Cross-Entropy',
    summary: 'Quantify information, surprise, and divergence with Shannon Entropy, Cross-Entropy, and Kullback-Leibler (KL) Divergence.',
    estimatedMinutes: 20,
    xpReward: 95,
    prerequisites: ['foundations_1', 'probability_2'],
    whyItMatters: 'Information theory defines the universal loss function of modern AI: Cross-Entropy. Furthermore, KL Divergence is the foundational constraint in Reinforcement Learning from Human Feedback (RLHF) ensuring aligned models don\'t drift.',
    everydayAnalogy: 'If someone tells you "The sun rose this morning", there is almost zero surprise (low information). If someone tells you "A meteorite struck the city center", there is immense surprise (high information). Entropy measures average surprise.',
    intuitiveExplanation: 'Information is quantified as -log_2(P). Rare events carry more bits of information. Shannon Entropy H(P) is the expected surprise of distribution P. Cross-entropy H(P, Q) measures the average bits needed when coding true distribution P using model prediction Q.',
    mathematicalDefinition: 'H(P) = -\\sum_{x} P(x) \\log_2 P(x), \\quad D_{\\text{KL}}(P \\parallel Q) = \\sum_{x} P(x) \\log \\left( \\frac{P(x)}{Q(x)} \\right) = H(P, Q) - H(P)',
    keyFormula: 'H(P, Q) = -\\sum_{i=1}^C y_i \\log(\\hat{y}_i)',
    symbolsExplained: [
      { symbol: 'H(P)', meaning: 'Shannon Entropy: intrinsic uncertainty of distribution P' },
      { symbol: 'H(P, Q)', meaning: 'Cross-Entropy between true targets P and model predictions Q' },
      { symbol: 'D_{\\text{KL}}(P \\parallel Q)', meaning: 'Kullback-Leibler Divergence: extra bits wasted using Q instead of true P' },
    ],
    workedExample: {
      problem: 'Calculate Shannon entropy H(P) for a fair coin (P(H)=0.5, P(T)=0.5) and a biased coin (P(H)=0.9, P(T)=0.1) in bits (base 2).',
      steps: [
        {
          stepTitle: 'Step 1: Compute entropy for fair coin',
          explanation: 'H = -(0.5 * log2(0.5) + 0.5 * log2(0.5)). Since log2(0.5) = -1:',
          math: 'H_{\\text{fair}} = -[0.5(-1) + 0.5(-1)] = -[-0.5 - 0.5] = 1.0 \\text{ bit}'
        },
        {
          stepTitle: 'Step 2: Compute entropy for biased coin',
          explanation: 'log2(0.9) ≈ -0.152, log2(0.1) ≈ -3.322.',
          math: 'H_{\\text{biased}} = -[0.9(-0.152) + 0.1(-3.322)] = -[-0.1368 - 0.3322] \\approx 0.469 \\text{ bits}'
        },
        {
          stepTitle: 'Step 3: Interpret entropy difference',
          explanation: 'The fair coin has maximum uncertainty (1.0 bit). The biased coin is mostly predictable, so its entropy drops to 0.469 bits.',
          math: 'H_{\\text{fair}} = 1.0 > H_{\\text{biased}} = 0.469'
        }
      ],
      finalResult: 'H(\\text{fair}) = 1.0 \\text{ bit (maximum)}, \\quad H(\\text{biased}) = 0.47 \\text{ bits}'
    },
    aiApplication: {
      title: 'PPO & DPO in RLHF Model Alignment',
      description: 'In ChatGPT\'s RLHF alignment, a KL-divergence penalty term D_KL(π_policy || π_ref) is added to the objective to prevent the policy model from diverging excessively from the base reference model.',
      algorithm: 'PPO (Proximal Policy Optimization) / DPO'
    },
    revisionSummary: {
      keyTakeaway: 'Minimizing cross-entropy loss is mathematically identical to minimizing KL divergence from true data distribution to model predictions.',
      formula: 'H(P, Q) = H(P) + D_{\\text{KL}}(P \\parallel Q)',
      commonMistake: 'Assuming KL divergence is symmetric. D_KL(P || Q) ≠ D_KL(Q || P) in general!'
    },
    interactiveType: 'loss_functions',
    quiz: [
      {
        id: 'o2_q1',
        question: 'Under what condition does the KL Divergence D_KL(P || Q) equal exactly 0?',
        options: [
          'When both distributions have zero mean',
          'When distribution Q is identical to distribution P everywhere (P = Q)',
          'When the learning rate is 0',
          'When entropy is 0'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Consider log(P(x) / Q(x)) when P(x) = Q(x). log(1) = ?'],
        explanation: 'When P(x) = Q(x) for all x, log(P(x)/Q(x)) = log(1) = 0. Thus the sum is 0. KL divergence is strictly non-negative and zero only when the distributions are identical.',
        misconceptionExplanation: 'KL divergence measures difference between distributions; it equals zero if and only if they are identical.'
      }
    ]
  },

  machine_learning_1: {
    id: 'machine_learning_1',
    moduleId: 'machine_learning',
    stage: 7,
    title: 'Linear & Logistic Regression: From Theory to Decision Boundary',
    summary: 'Derive Ordinary Least Squares (OLS) normal equations, the Sigmoid link function, and the log-odds boundary.',
    estimatedMinutes: 20,
    xpReward: 95,
    prerequisites: ['linear_algebra_2', 'calculus_2'],
    whyItMatters: 'Linear and logistic regression are the bedrock of supervised machine learning. Logistic regression is simply a single artificial neuron with a sigmoid activation function trained under binary cross-entropy loss.',
    everydayAnalogy: 'Linear regression draws the single best-fit trendline through scatter points. Logistic regression takes that line and wraps it around an S-curve, outputting a probability between 0% and 100% of whether an email is spam or ham.',
    intuitiveExplanation: 'In linear regression, we minimize sum of squared residuals: ||y - Xw||^2. Setting the derivative to zero yields the analytical Normal Equation w = (X^T X)^-1 X^T y. In logistic regression, we squash linear outputs through σ(z) = 1 / (1 + e^-z).',
    mathematicalDefinition: '\\hat{y}_{\\text{linear}} = \\mathbf{w}^T \\mathbf{x} + b, \\quad P(y=1|\\mathbf{x}) = \\sigma(\\mathbf{w}^T \\mathbf{x} + b) = \\frac{1}{1 + e^{-(\\mathbf{w}^T \\mathbf{x} + b)}}',
    keyFormula: '\\mathbf{w}^* = (X^T X)^{-1} X^T \\mathbf{y} \\quad (\\text{Normal Equation})',
    symbolsExplained: [
      { symbol: 'X', meaning: 'Design matrix of input features (N samples x D features)' },
      { symbol: '\\mathbf{y}', meaning: 'Target labels vector' },
      { symbol: '\\sigma(z)', meaning: 'Sigmoid function mapping real numbers (-∞, +∞) to (0, 1)' },
    ],
    workedExample: {
      problem: 'For 1D points (x=1, y=2) and (x=2, y=4), compute the best-fit slope w with intercept b=0 using OLS formula w = (X^T X)^-1 X^T y.',
      steps: [
        {
          stepTitle: 'Step 1: Express X and y vectors',
          explanation: 'X = [1, 2]^T, y = [2, 4]^T.',
          math: 'X = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}, \\quad \\mathbf{y} = \\begin{pmatrix} 2 \\\\ 4 \\end{pmatrix}'
        },
        {
          stepTitle: 'Step 2: Compute X^T X and X^T y',
          explanation: 'X^T X = 1^2 + 2^2 = 5. X^T y = (1)(2) + (2)(4) = 2 + 8 = 10.',
          math: 'X^T X = 5, \\quad X^T \\mathbf{y} = 10'
        },
        {
          stepTitle: 'Step 3: Solve for optimal slope w*',
          explanation: 'w* = 10 / 5 = 2.0.',
          math: 'w^* = \\frac{10}{5} = 2.0'
        }
      ],
      finalResult: 'w^* = 2.0 \\implies \\hat{y} = 2.0 x \\text{ (exact fit)}'
    },
    aiApplication: {
      title: 'Classification Heads in Neural Networks',
      description: 'The final classification layer of ResNet, BERT, and ViT is literally a multi-class logistic regression head (softmax linear projection) operating on learned representations.',
      algorithm: 'Softmax / Multinomial Logistic Regression'
    },
    revisionSummary: {
      keyTakeaway: 'Linear regression models continuous outputs; logistic regression applies the sigmoid link to model binary probability bounded between 0 and 1.',
      formula: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
      commonMistake: 'Attempting to solve the Normal Equation (X^T X)^-1 on millions of features where matrix inversion O(D^3) is computationally impossible. In high dimensions, use iterative gradient descent!'
    },
    interactiveType: 'loss_functions',
    quiz: [
      {
        id: 'ml1_q1',
        question: 'What is the decision boundary of a logistic regression model with weights w1 = 2, w2 = -1, and bias b = 0?',
        options: [
          'A curved parabola y = 2x^2',
          'A linear line where 2*x1 - x2 = 0 (or x2 = 2*x1)',
          'A circle around the origin',
          'A 3D sphere'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['The decision boundary occurs where P(y=1) = 0.5, which happens when z = w^T x + b = 0.'],
        explanation: 'Setting σ(z) = 0.5 means z = 0. Here, 2*x1 - x2 = 0, which defines a straight line x2 = 2*x1 separating the two classes.',
        misconceptionExplanation: 'Logistic regression is a linear classifier; its decision boundary is always a flat hyperplane/line.'
      }
    ]
  },

  machine_learning_2: {
    id: 'machine_learning_2',
    moduleId: 'machine_learning',
    stage: 7,
    title: 'Neural Networks: Forward & Backward Dynamics',
    summary: 'Connect linear algebra, calculus, and optimization to understand how multi-layer perceptrons learn arbitrary nonlinear functions.',
    estimatedMinutes: 22,
    xpReward: 110,
    prerequisites: ['calculus_3', 'linear_algebra_2'],
    whyItMatters: 'According to the Universal Approximation Theorem, a feedforward neural network with nonlinear activations can approximate ANY continuous function. Understanding forward inference and gradient backprop is the capstone of modern AI.',
    everydayAnalogy: 'Think of an orchestra. Inputs are individual musicians. Early layers combine basic notes into harmonies. Middle layers weave harmonies into melodies. The final layer produces the complete symphony.',
    intuitiveExplanation: 'A neural network chains affine transformations (z = Wx + b) with nonlinear activation functions (ReLU, GELU, Sigmoid). Without nonlinearity, stacking 100 linear layers would collapse mathematically into a single boring linear transformation W_combined = W100 * ... * W1!',
    mathematicalDefinition: '\\mathbf{a}^{[l]} = g^{[l]}\\left( W^{[l]} \\mathbf{a}^{[l-1]} + \\mathbf{b}^{[l]} \\right), \\quad \\text{where } g^{[l]} \\text{ is activation function}',
    keyFormula: '\\text{ReLU}(z) = \\max(0, z), \\quad \\text{GELU}(z) = z \\Phi(z) \\approx 0.5 z (1 + \\tanh(\\sqrt{2/\\pi}(z + 0.044715 z^3)))',
    symbolsExplained: [
      { symbol: 'W^{[l]}', meaning: 'Weight matrix at layer l of shape (n^{[l]}, n^{[l-1]})' },
      { symbol: '\\mathbf{b}^{[l]}', meaning: 'Bias vector at layer l' },
      { symbol: '\\mathbf{a}^{[l]}', meaning: 'Post-activation outputs at layer l' },
      { symbol: 'g(z)', meaning: 'Nonlinear activation function' },
    ],
    workedExample: {
      problem: 'Why would a deep neural network with 10 layers collapse into a single linear regression model if all activation functions are linear (g(z) = z)?',
      steps: [
        {
          stepTitle: 'Step 1: Write two successive linear layers',
          explanation: 'Layer 1: a1 = W1 * x. Layer 2: a2 = W2 * a1.',
          math: '\\mathbf{a}_2 = W_2 (W_1 \\mathbf{x})'
        },
        {
          stepTitle: 'Step 2: Apply associative property of matrix multiplication',
          explanation: 'Multiply W2 and W1 together into a single combined matrix W_eff.',
          math: '\\mathbf{a}_2 = (W_2 W_1) \\mathbf{x} = W_{\\text{eff}} \\mathbf{x}'
        },
        {
          stepTitle: 'Step 3: Extend to 10 layers',
          explanation: 'Product of 10 matrices W10 * W9 * ... * W1 is just one single matrix W_final. Depth provides zero expressive advantage without nonlinearities!',
          math: '\\mathbf{y} = (W_{10} W_9 \\dots W_1) \\mathbf{x} = W_{\\text{final}} \\mathbf{x}'
        }
      ],
      finalResult: '\\text{Without nonlinear activations, deep networks reduce to simple linear models.}'
    },
    aiApplication: {
      title: 'Modern Deep Learning Architectures',
      description: 'Convolutional networks (CNNs), residual networks (ResNets), and multi-layer perceptron (MLP) blocks in LLMs use ReLU and GELU to allow gradients to propagate deep without saturating.',
      algorithm: 'Deep Multilayer Perceptron'
    },
    revisionSummary: {
      keyTakeaway: 'Nonlinear activation functions give neural networks their expressive power to model nonlinear curves and decision boundaries.',
      formula: '\\mathbf{z} = W \\mathbf{x} + \\mathbf{b}, \\quad \\mathbf{a} = \\text{activation}(\\mathbf{z})',
      commonMistake: 'Initializing all weights to zero. If all weights are identical (0), every neuron computes the identical forward and backward gradient (symmetry problem) and the network cannot learn diverse features!'
    },
    interactiveType: 'neural_network',
    quiz: [
      {
        id: 'ml2_q1',
        question: 'Why must neural network weights be randomly initialized (e.g. He/Xavier initialization) rather than initialized to all zeros?',
        options: [
          'Because computers cannot multiply by zero',
          'Because if all weights are identical, all hidden neurons compute the exact same gradient during backpropagation and learn identical redundant features (symmetry problem)',
          'Because zero weights cause memory leaks',
          'Because biases cannot be added to zero'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Consider whether Neuron 1 and Neuron 2 can ever differentiate if their weights and gradients are identical.'],
        explanation: 'Symmetry breaking is essential: if all weights start at 0, every hidden neuron in a layer receives the exact same gradient update and remains identical, reducing an entire layer to just one effective neuron.',
        misconceptionExplanation: 'It is a mathematical symmetry breaking requirement for gradient descent.'
      }
    ]
  },

  machine_learning_3: {
    id: 'machine_learning_3',
    moduleId: 'machine_learning',
    stage: 7,
    title: 'The Mathematics of Attention & Transformers',
    summary: 'Deconstruct Query, Key, Value matrices, scaled dot-product attention, and softmax routing inside modern Large Language Models.',
    estimatedMinutes: 25,
    xpReward: 120,
    prerequisites: ['linear_algebra_1', 'linear_algebra_2', 'optimization_2'],
    whyItMatters: 'Every modern LLM (ChatGPT, Claude, Gemini, Llama) is built on the Transformer architecture introduced in "Attention Is All You Need". The attention equation is the single most impactful mathematical formula in contemporary AI.',
    everydayAnalogy: 'Imagine searching a library: your Query (Q) is your question "How does gravity work?". The catalog index cards are the Keys (K). You match your Query against all Keys to find relevant books. The actual book contents are the Values (V). You take a weighted sum of the Values based on how well their Keys matched your Query!',
    intuitiveExplanation: 'For each token, we compute Q = X W_q, K = X W_k, V = X W_v. The dot product Q K^T measures compatibility between tokens. Scaling by sqrt(d_k) prevents softmax saturation. Softmax converts dot products into attention weights summing to 1. Multiplying by V yields context-enriched embeddings.',
    mathematicalDefinition: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V',
    keyFormula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V',
    symbolsExplained: [
      { symbol: 'Q', meaning: 'Query matrix (what current tokens are looking for)' },
      { symbol: 'K', meaning: 'Key matrix (what each token advertises about itself)' },
      { symbol: 'V', meaning: 'Value matrix (the semantic information each token carries)' },
      { symbol: 'd_k', meaning: 'Dimension of key vectors (e.g. 64 or 128)' },
      { symbol: '\\sqrt{d_k}', meaning: 'Scaling factor to maintain unit variance and prevent vanishing gradients in softmax' },
    ],
    workedExample: {
      problem: 'Why do we divide by sqrt(d_k) in the Attention formula? What would happen if key dimension d_k = 64 without this scaling?',
      steps: [
        {
          stepTitle: 'Step 1: Compute variance of unscaled dot product',
          explanation: 'If components of q and k have mean 0 and variance 1, their dot product q · k = Σ(q_i * k_i) has variance equal to d_k = 64.',
          math: '\\text{Var}(\\mathbf{q} \\cdot \\mathbf{k}) = d_k = 64 \\implies \\text{Std Dev } \\sigma = \\sqrt{64} = 8'
        },
        {
          stepTitle: 'Step 2: Effect of large dot products on Softmax',
          explanation: 'Values with standard deviation of 8 will routinely reach +16 or -16. Exponentiating e^16 produces extreme numbers, causing softmax to saturate into a hard one-hot vector [0, 0, ..., 1, 0].',
          math: 'e^{16} \\approx 8.88 \\times 10^6 \\implies \\text{Softmax saturates}'
        },
        {
          stepTitle: 'Step 3: Scaling normalizes variance back to 1.0',
          explanation: 'Dividing by sqrt(d_k) = 8 rescales the variance back to 1.0, preserving healthy gradient flow throughout backpropagation.',
          math: '\\text{Var}\\left( \\frac{\\mathbf{q} \\cdot \\mathbf{k}}{\\sqrt{d_k}} \\right) = \\frac{d_k}{d_k} = 1.0'
        }
      ],
      finalResult: '\\text{Scaling by } \\sqrt{d_k} \\text{ prevents softmax gradient vanishing.}'
    },
    aiApplication: {
      title: 'Self-Attention in Large Language Models',
      description: 'Self-attention allows every word in a 128k context window to dynamically attend to any other word across arbitrary distances, enabling comprehension of complex codebases, long dialogues, and multi-step reasoning.',
      algorithm: 'FlashAttention / Multi-Head Self-Attention'
    },
    revisionSummary: {
      keyTakeaway: 'Scaled Dot-Product Attention dynamically routes information based on semantic alignment between query and key projections, normalized by softmax.',
      formula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V',
      commonMistake: 'Confusing the role of Keys and Values. Keys are used to compute matching weights (scores); Values are the actual vectors being blended and returned.'
    },
    interactiveType: 'matrices',
    quiz: [
      {
        id: 'ml3_q1',
        question: 'In the Transformer Scaled Dot-Product Attention equation, what is the mathematical consequence of omitting the 1 / sqrt(d_k) scaling factor?',
        options: [
          'Attention weights cannot be multiplied by V',
          'For large d_k, dot products grow large in magnitude, pushing softmax into regions with extremely tiny gradients where backpropagation stalls',
          'Matrix multiplication becomes non-commutative',
          'Token positions are lost'
        ],
        correctAnswer: 1,
        type: 'multiple-choice',
        hints: ['Think of what happens to the derivative of softmax when one input is +50 and another is -50.'],
        explanation: 'As d_k grows, the variance of the dot product grows as d_k. Large logits push softmax outputs toward 0 and 1, where the gradient of softmax vanishes to near zero, impeding learning.',
        misconceptionExplanation: 'It is a numerical and gradient stability issue in softmax.'
      }
    ]
  }
};
