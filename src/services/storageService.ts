import { UserProgress, UserAccount, StreakInfo } from '../types';

const PROGRESS_KEY_PREFIX = 'mathverse_user_progress_';
const ACTIVE_USER_KEY = 'mathverse_active_user_v1';
const ALL_USERS_KEY = 'mathverse_registered_users_v1';

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'user_turing',
    name: 'Alex Turing',
    email: 'alex.turing@mathverse.ai',
    avatar: 'turing',
    role: 'Vector Apprentice',
    createdAt: '2026-09-01',
  },
  {
    id: 'user_lovelace',
    name: 'Ada Lovelace',
    email: 'ada.lovelace@mathverse.ai',
    avatar: 'lovelace',
    role: 'Algorithm Pioneer',
    createdAt: '2026-09-10',
  },
  {
    id: 'user_gauss',
    name: 'Carl Gauss',
    email: 'carl.gauss@mathverse.ai',
    avatar: 'gauss',
    role: 'Prince of Mathematics',
    createdAt: '2026-10-01',
  },
];

export function getTodayDateString(d = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getTodayDateString(yesterday);
}

// Generate default progress
export const createDefaultProgress = (daysActive = 3): UserProgress => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const d3 = new Date();
  d3.setDate(d3.getDate() - 2);
  const twoDaysAgo = getTodayDateString(d3);

  const dates = daysActive >= 3 ? [twoDaysAgo, yesterday, today] : [today];

  return {
    xp: 240,
    level: 1,
    streakDays: daysActive,
    longestStreak: Math.max(daysActive, 5),
    totalActiveDays: dates.length,
    lastActiveDate: today,
    activityDates: dates,
    completedLessonIds: ['foundations_1'],
    masteryScores: {
      foundations: 45,
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
};

/* --- USER AUTHENTICATION MANAGEMENT --- */

export const getRegisteredUsers = (): UserAccount[] => {
  try {
    const raw = localStorage.getItem(ALL_USERS_KEY);
    if (!raw) {
      localStorage.setItem(ALL_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
  } catch (e) {
    console.error('Failed to parse registered users:', e);
    return DEFAULT_USERS;
  }
};

export const getCurrentUser = (): UserAccount => {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    if (!raw) {
      const users = getRegisteredUsers();
      const defaultUser = users[0];
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse current user:', e);
    return DEFAULT_USERS[0];
  }
};

export const setCurrentUser = (user: UserAccount): void => {
  try {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save current user:', e);
  }
};

export const registerUser = (name: string, email: string, password = '', avatar = 'turing'): UserAccount => {
  const users = getRegisteredUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: UserAccount = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    avatar,
    role: 'Novice Geometer',
    createdAt: getTodayDateString(),
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(updatedUsers));
  setCurrentUser(newUser);

  // Initialize their progress
  const initialProgress = createDefaultProgress(1);
  saveProgress(initialProgress, newUser.id);

  return newUser;
};

export const loginUser = (email: string, password = ''): UserAccount | null => {
  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return null;

  // In demo environment, password check
  if (user.password && user.password !== password) {
    return null;
  }

  setCurrentUser(user);
  return user;
};

export const logoutUser = (): void => {
  // Switch to guest or default user
  const users = getRegisteredUsers();
  const fallback = users[0] || DEFAULT_USERS[0];
  setCurrentUser(fallback);
};

/* --- PROGRESS & STREAK MANAGEMENT --- */

export const getStoredProgress = (userId?: string): UserProgress => {
  const uid = userId || getCurrentUser().id;
  const key = `${PROGRESS_KEY_PREFIX}${uid}`;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = createDefaultProgress(3);
      saveProgress(initial, uid);
      return initial;
    }
    const parsed = JSON.parse(raw);
    const defaults = createDefaultProgress();
    return {
      ...defaults,
      ...parsed,
      activityDates: parsed.activityDates || [getTodayDateString()],
      longestStreak: parsed.longestStreak || Math.max(parsed.streakDays || 1, 3),
      totalActiveDays: (parsed.activityDates || []).length || 1,
    };
  } catch (e) {
    console.error('Failed to parse user progress:', e);
    return createDefaultProgress();
  }
};

export const saveProgress = (progress: UserProgress, userId?: string): void => {
  const uid = userId || getCurrentUser().id;
  const key = `${PROGRESS_KEY_PREFIX}${uid}`;
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
};

/**
 * Updates daily streak automatically whenever the user performs any learning action
 * (e.g. finishes a lesson, completes a quiz, runs an experiment, solves a challenge).
 */
export function recordDailyActivity(currentProgress: UserProgress): {
  updatedProgress: UserProgress;
  isNewDayStreak: boolean;
  streakIncremented: boolean;
} {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const activityDates = currentProgress.activityDates ? [...currentProgress.activityDates] : [];
  if (!activityDates.includes(today)) {
    activityDates.push(today);
  }

  // Already logged today
  if (currentProgress.lastActiveDate === today) {
    const updated: UserProgress = {
      ...currentProgress,
      activityDates,
      totalActiveDays: activityDates.length,
    };
    return { updatedProgress: updated, isNewDayStreak: false, streakIncremented: false };
  }

  // If last active was yesterday, streak increments!
  if (currentProgress.lastActiveDate === yesterday) {
    const nextStreak = currentProgress.streakDays + 1;
    const nextLongest = Math.max(currentProgress.longestStreak, nextStreak);
    const updated: UserProgress = {
      ...currentProgress,
      streakDays: nextStreak,
      longestStreak: nextLongest,
      lastActiveDate: today,
      activityDates,
      totalActiveDays: activityDates.length,
    };
    return { updatedProgress: updated, isNewDayStreak: true, streakIncremented: true };
  }

  // Otherwise, streak was broken (missed at least 1 day), resets to 1
  const updated: UserProgress = {
    ...currentProgress,
    streakDays: 1,
    longestStreak: Math.max(currentProgress.longestStreak, 1),
    lastActiveDate: today,
    activityDates,
    totalActiveDays: activityDates.length,
  };
  return { updatedProgress: updated, isNewDayStreak: true, streakIncremented: false };
}

/**
 * Calculates last 7 days history for UI presentation in streak modals and widgets
 */
export function getStreakInfo(progress: UserProgress): StreakInfo {
  const today = getTodayDateString();
  const activitySet = new Set(progress.activityDates || []);

  const weeklyHistory = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getTodayDateString(d);
    const dayName = daysOfWeek[d.getDay()];
    const isToday = dateStr === today;
    const isActive = activitySet.has(dateStr);

    weeklyHistory.push({
      dayName,
      dateStr,
      isActive,
      isToday,
    });
  }

  return {
    currentStreak: progress.streakDays,
    longestStreak: progress.longestStreak || progress.streakDays,
    totalActiveDays: (progress.activityDates || []).length || 1,
    lastActiveDate: progress.lastActiveDate,
    isActiveToday: progress.lastActiveDate === today,
    weeklyHistory,
  };
}

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
