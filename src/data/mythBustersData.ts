import { MythBusterItem } from '../types';

export const MYTH_BUSTERS: MythBusterItem[] = [
  {
    id: 'myth_matrix_commutative',
    title: 'Matrix Multiplication is Commutative (AB = BA)',
    trap: 'Assuming AB equals BA in neural network layers',
    myth: 'Just like ordinary scalar numbers 3 * 4 = 4 * 3, multiplying matrix A by matrix B gives the same result as B by A.',
    reality: 'Matrix multiplication is strictly non-commutative: AB ≠ BA in general. In fact, if A is 3x4 and B is 4x2, BA is not even mathematically defined!',
    mathExplanation: 'A matrix represents a spatial geometric transformation (e.g. rotation, shear). Rotating 90° then translating right is completely different from translating right then rotating 90°.',
    aiImpact: 'In PyTorch, writing `x @ W` versus `W @ x` causes immediate dimension mismatch crashes or garbles the forward pass batch representation completely.'
  },
  {
    id: 'myth_correlation_causation',
    title: 'High Correlation Proves Direct Causation',
    trap: 'Believing feature correlation implies causal impact on model predictions',
    myth: 'If feature X has a correlation of r = 0.95 with target Y, increasing X in the real world will directly increase Y.',
    reality: 'Correlation only measures linear co-occurrence. A hidden confounder Z may cause both, or the relationship may be reverse-causal.',
    mathExplanation: 'Pearson r = Cov(X, Y) / (σX σY). Covariance is symmetric: Cov(X, Y) = Cov(Y, X). Mathematics cannot determine direction of causality without randomized intervention (Do-calculus).',
    aiImpact: 'Feature attribution tools (SHAP/LIME) can fool data scientists into recommending real-world policy changes based on spurious confounders.'
  },
  {
    id: 'myth_zero_initialization',
    title: 'Initializing All Weights to Zero is Safe',
    trap: 'Starting model weights at 0.0 because biases start at 0.0',
    myth: 'Setting initial weights to zero is a clean, neutral starting point.',
    reality: 'If all weights in a layer start at zero, every neuron computes the identical output and receives the exact same gradient during backpropagation (Symmetry Problem).',
    mathExplanation: 'For neuron 1 and neuron 2 with w1 = w2 = 0: ∂L/∂w1 = ∂L/∂w2. Both weights update identically forever. The layer never develops specialized feature detectors.',
    aiImpact: 'A multi-layer network with 1024 neurons collapses into having the representational capacity of a single neuron. Always use He or Xavier random initialization!'
  },
  {
    id: 'myth_accuracy_imbalance',
    title: '99% Accuracy Means the Model is Excellent',
    trap: 'Relying on raw classification accuracy on imbalanced datasets',
    myth: 'A fraud detection or tumor diagnosis model with 99.2% accuracy is production-ready.',
    reality: 'If 99.5% of credit card transactions are legitimate, a stupid model that predicts "Legitimate" for every transaction achieves 99.5% accuracy while catching 0% of actual frauds!',
    mathExplanation: 'Accuracy = (TP + TN) / (TP + TN + FP + FN). When TN dominates by 1000:1, accuracy is decoupled from true positive detection rate (Recall = TP / (TP + FN)).',
    aiImpact: 'Catastrophic failures in healthcare and cybersecurity. Always check Precision, Recall, F1-Score, and ROC-AUC for imbalanced data.'
  },
  {
    id: 'myth_large_learning_rate',
    title: 'Higher Learning Rate Always Trains Faster',
    trap: 'Cranking up learning rate α when training feels slow',
    myth: 'If a step size of 0.001 takes 100 epochs, a step size of 1.0 will finish in 1 epoch.',
    reality: 'If the step size exceeds the curvature stability threshold (α > 2 / L where L is the Lipschitz constant of the gradient), updates overshoot the valley and explode to NaN.',
    mathExplanation: 'In 1D loss L(w) = w^2, gradient is 2w. Update: w_new = w - α(2w) = w(1 - 2α). If α = 1.5: w_new = w(1 - 3) = -2w. The magnitude DOUBLES with opposite sign each step!',
    aiImpact: 'Loss curves spiking upward abruptly to "Loss: NaN", wasting thousands of dollars in GPU cluster compute.'
  },
  {
    id: 'myth_det_zero_invert',
    title: 'Every Matrix Has an Inverse',
    trap: 'Calling `torch.inverse()` or `np.linalg.inv()` without checking rank or determinant',
    myth: 'You can solve any linear system Ax = b by multiplying both sides by A^-1.',
    reality: 'If det(A) = 0, the matrix is singular (degenerate). It compresses space into a lower dimension, and the information lost cannot be inverted.',
    mathExplanation: 'A^-1 = (1 / det(A)) * adj(A). When det(A) = 0, calculating the inverse requires dividing by zero, which is undefined.',
    aiImpact: 'Inverting non-invertible covariance matrices in Gaussian processes or Linear Discriminant Analysis triggers singular matrix runtime exceptions.'
  }
];
