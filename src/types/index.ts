export type ModuleStage = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  type: 'multiple-choice' | 'numerical' | 'conceptual';
  numericalAnswer?: number;
  tolerance?: number;
  hints: string[];
  explanation: string;
  misconceptionExplanation?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  stage: ModuleStage;
  title: string;
  summary: string;
  estimatedMinutes: number;
  xpReward: number;
  prerequisites: string[];
  
  // Structured Lesson Experience
  whyItMatters: string;
  everydayAnalogy: string;
  intuitiveExplanation: string;
  mathematicalDefinition: string; // LaTeX formatted
  keyFormula: string; // Main LaTeX formula
  symbolsExplained: { symbol: string; meaning: string }[];
  workedExample: {
    problem: string;
    steps: { stepTitle: string; explanation: string; math: string }[];
    finalResult: string;
  };
  aiApplication: {
    title: string;
    description: string;
    algorithm: string;
  };
  revisionSummary: {
    keyTakeaway: string;
    formula: string;
    commonMistake: string;
  };
  
  interactiveType?: 'vectors' | 'matrices' | 'derivatives' | 'gradient_descent' | 'probability' | 'statistics' | 'neural_network' | 'loss_functions' | 'pca';
  quiz: QuizQuestion[];
}

export interface ModuleInfo {
  id: string;
  stage: ModuleStage;
  title: string;
  description: string;
  iconName: string;
  lessonIds: string[];
}

export interface UserProgress {
  xp: number;
  level: number;
  streakDays: number;
  longestStreak: number;
  totalActiveDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  activityDates: string[]; // List of YYYY-MM-DD strings
  completedLessonIds: string[];
  masteryScores: Record<string, number>; // 0 to 100 per module ID
  savedNotes: Record<string, string>; // lessonId -> markdown note
  bookmarks: string[];
  unlockedAchievements: string[];
  diagnosticTaken: boolean;
  recommendedStage: ModuleStage;
  completedMissions: string[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string; // e.g. 'turing', 'lovelace', 'euler', 'gauss', 'ramanujan'
  role?: string;
  createdAt: string;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  lastActiveDate: string;
  isActiveToday: boolean;
  weeklyHistory: { dayName: string; dateStr: string; isActive: boolean; isToday: boolean }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'mastery' | 'streak' | 'playground' | 'quiz';
  requiredXp?: number;
  unlocked: boolean;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: 'playground' | 'lesson' | 'quiz' | 'boss';
  targetPlayground?: string;
  isCompleted: boolean;
}

export interface MythBusterItem {
  id: string;
  title: string;
  trap: string;
  myth: string;
  reality: string;
  mathExplanation: string;
  aiImpact: string;
}

export interface FormulaCard {
  id: string;
  name: string;
  topic: string;
  formula: string; // LaTeX
  meaning: string;
  aiUse: string;
  example: string;
}

