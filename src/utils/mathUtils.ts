/**
 * Deterministic mathematical calculation utility functions for MathVerse AI
 */

export interface Vector2D {
  x: number;
  y: number;
}

export function dotProduct(u: Vector2D, v: Vector2D): number {
  return u.x * v.x + u.y * v.y;
}

export function vectorMagnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function cosineSimilarity(u: Vector2D, v: Vector2D): number {
  const magU = vectorMagnitude(u);
  const magV = vectorMagnitude(v);
  if (magU < 1e-9 || magV < 1e-9) return 0;
  const dot = dotProduct(u, v);
  return Math.max(-1, Math.min(1, dot / (magU * magV)));
}

export function matrixDeterminant2x2(a: number, b: number, c: number, d: number): number {
  return a * d - b * c;
}

export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export function sigmoidDerivative(z: number): number {
  const s = sigmoid(z);
  return s * (1 - s);
}

export function sampleMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function sampleVariance(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = sampleMean(values);
  return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
}

export function huberLoss(error: number, delta = 1.0): number {
  const absE = Math.abs(error);
  if (absE <= delta) {
    return 0.5 * error * error;
  }
  return delta * (absE - 0.5 * delta);
}

export function calculateQuizScore(correctCount: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  return Math.round((correctCount / totalQuestions) * 100);
}
