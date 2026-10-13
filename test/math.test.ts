import {
  dotProduct,
  vectorMagnitude,
  cosineSimilarity,
  matrixDeterminant2x2,
  sigmoid,
  sigmoidDerivative,
  sampleMean,
  sampleVariance,
  huberLoss,
  calculateQuizScore,
} from '../src/utils/mathUtils';
import { calculateLevel } from '../src/services/storageService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✓ ${message}`);
}

console.log('--- Running MathVerse AI Mathematical & Progress Unit Tests ---');

// 1. Vector Operations
const u = { x: 3, y: 4 };
const v = { x: 4, y: 3 };
assert(dotProduct(u, v) === 24, 'dotProduct([3, 4], [4, 3]) should be 24');
assert(vectorMagnitude(u) === 5, 'magnitude of [3, 4] should be 5');
assert(Math.abs(cosineSimilarity(u, v) - 0.96) < 1e-4, 'cosine similarity of [3,4] and [4,3] should be 0.96');

// Orthogonal vectors
const ortho1 = { x: 1, y: 0 };
const ortho2 = { x: 0, y: 1 };
assert(dotProduct(ortho1, ortho2) === 0, 'Orthogonal vectors have 0 dot product');
assert(cosineSimilarity(ortho1, ortho2) === 0, 'Orthogonal vectors have 0 cosine similarity');

// 2. Matrix Determinant
assert(matrixDeterminant2x2(1, 0, 0, 1) === 1, 'Identity matrix determinant is 1');
assert(matrixDeterminant2x2(0, -1, 1, 0) === 1, '90-degree rotation determinant is 1');
assert(matrixDeterminant2x2(1, 2, 2, 4) === 0, 'Singular matrix determinant is 0');

// 3. Activation Functions & Derivatives
assert(Math.abs(sigmoid(0) - 0.5) < 1e-5, 'Sigmoid(0) equals 0.5');
assert(Math.abs(sigmoidDerivative(0) - 0.25) < 1e-5, 'Sigmoid derivative at 0 is max 0.25');

// 4. Statistics & Loss
const sample = [2, 4, 4, 4, 5, 5, 7, 9];
assert(sampleMean(sample) === 5, 'Sample mean of [2,4,4,4,5,5,7,9] is 5');
assert(Math.abs(sampleVariance(sample) - 4.5714) < 1e-3, 'Sample variance is computed correctly with Bessel correction (n-1)');

// Huber Loss
assert(huberLoss(0.5, 1.0) === 0.125, 'Huber loss for |e| <= delta is quadratic (0.5 * 0.5^2 = 0.125)');
assert(huberLoss(2.0, 1.0) === 1.5, 'Huber loss for |e| > delta is linear (1.0 * (2.0 - 0.5) = 1.5)');

// 5. Quiz & Progress
assert(calculateQuizScore(3, 4) === 75, 'Quiz scoring: 3/4 is 75%');
assert(calculateQuizScore(2, 2) === 100, 'Quiz scoring: 2/2 is 100%');

// Level Progression
const lvl1 = calculateLevel(150);
assert(lvl1.level === 1 && lvl1.title === 'Novice Geometer', '150 XP should be Level 1');

const lvl2 = calculateLevel(400);
assert(lvl2.level === 2 && lvl2.title === 'Vector Apprentice', '400 XP should be Level 2');

// 6. Daily Streak Logic
import { recordDailyActivity, createDefaultProgress, getTodayDateString, getYesterdayDateString } from '../src/services/storageService';

const baseProg = createDefaultProgress(3);
baseProg.lastActiveDate = getYesterdayDateString();
const streakResult = recordDailyActivity(baseProg);
assert(streakResult.streakIncremented === true, 'Streak should increment if user was active yesterday');
assert(streakResult.updatedProgress.streakDays === 4, 'Streak should increase from 3 to 4 days');

// Missed days
const brokenProg = createDefaultProgress(5);
brokenProg.lastActiveDate = '2026-01-01'; // old date
const brokenResult = recordDailyActivity(brokenProg);
assert(brokenResult.updatedProgress.streakDays === 1, 'Streak should reset to 1 if user missed days');

console.log('\nAll 16 mathematical, streak, and progress unit tests PASSED cleanly!');

