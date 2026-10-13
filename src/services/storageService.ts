import { UserProgress } from '../types';

const STORAGE_KEY = 'mathverse_user_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 120,
  level: 1,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: ['foundations_1'],
  masteryScores: {
    foundations: 40,
    linear_algebra: 25,
    calculus: 10,
    probability: 0,
    statistics: 0,
    optimization: 0,
    machine_learning: 0,
  },
  savedNotes: {
    foundations_1: 'Remember: log(ab) = log(a) + log(b). This turns multiplication into addition, which prevents numerical underflow in machine learning probabilities!'
  },
  bookmarks: ['linear_algebra_1'],
  unlockedAchievements: ['first_steps'],
  diagnosticTaken: false,
  recommendedStage: 1,
  completedMissions: [],
};

export const getStoredProgress = (): UserProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch (e) {
    console.error('Failed to parse user progress:', e);
    return DEFAULT_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
};

export const calculateLevel = (xp: number): { level: number; title: string; nextLevelXp: number; progressPercent: number } => {
  const levels = [
    { level: 1, title: 'Novice Geometer', minXp: 0, maxXp: 300 },
    { level: 2, title: 'Vector Apprentice', minXp: 300, maxXp: 750 },
    { level: 3, title: 'Matrix Architect', minXp: 750, maxXp: 1400 },
    { level: 4, title: 'Calculus Cartographer', minXp: 1400, maxXp: 2200 },
    { level: 5, title: 'Gradient Navigator', minXp: 2200, maxXp: 3200 },
    { level: 6, title: 'Bayesian Strategist', minXp: 3200, maxXp: 4500 },
    { level: 7, title: 'Statistical Inference Master', minXp: 4500, maxXp: 6000 },
    { level: 8, title: 'Convex Optimizer', minXp: 6000, maxXp: 8000 },
    { level: 9, title: 'Neural Architect', minXp: 8000, maxXp: 10500 },
    { level: 10, title: 'Deep Learning Sovereign', minXp: 10500, maxXp: 15000 },
  ];

  const current = levels.find(l => xp >= l.minXp && xp < l.maxXp) || levels[levels.length - 1];
  const range = current.maxXp - current.minXp;
  const progressInLevel = Math.max(0, xp - current.minXp);
  const progressPercent = Math.min(100, Math.round((progressInLevel / range) * 100));

  return {
    level: current.level,
    title: current.title,
    nextLevelXp: current.maxXp,
    progressPercent,
  };
};
