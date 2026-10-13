import React, { useState, useEffect } from 'react';
import {
  getStoredProgress,
  saveProgress,
  getCurrentUser,
  setCurrentUser,
  getRegisteredUsers,
  registerUser,
  loginUser,
  logoutUser,
  recordDailyActivity,
  getStreakInfo,
  getTodayDateString,
  getYesterdayDateString,
} from './services/storageService';
import { UserProgress, UserAccount, ModuleStage, StreakInfo } from './types';
import { LESSONS } from './data/curriculumData';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import CurriculumView from './components/curriculum/CurriculumView';
import LessonView from './components/lesson/LessonView';
import PlaygroundsHubView from './components/playgrounds/PlaygroundsHubView';
import MissionsView from './components/gamification/MissionsView';
import MythBustersView from './components/gamification/MythBustersView';
import FormulaSheetView from './components/revision/FormulaSheetView';
import DiagnosticModal from './components/diagnostic/DiagnosticModal';
import AiTutorModal from './components/tutor/AiTutorModal';
import StreakModal from './components/streak/StreakModal';
import AuthModal from './components/auth/AuthModal';
import MathToCodeModal from './components/revision/MathToCodeModal';
import AiMathGymModal from './components/gamification/AiMathGymModal';
import GitHubSyncModal from './components/common/GitHubSyncModal';
import confetti from 'canvas-confetti';

type AppView = 'dashboard' | 'curriculum' | 'lesson' | 'playgrounds' | 'missions' | 'mythbusters' | 'formulas';

export default function App() {
  const [currentUserState, setCurrentUserState] = useState<UserAccount>(getCurrentUser);
  const [allUsersState, setAllUsersState] = useState<UserAccount[]>(getRegisteredUsers);
  const [progress, setProgress] = useState<UserProgress>(() => getStoredProgress(getCurrentUser().id));

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string>('foundations_1');
  const [activePlaygroundId, setActivePlaygroundId] = useState<string>('vectors');

  // Modals
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCodeLabOpen, setIsCodeLabOpen] = useState(false);
  const [isGymOpen, setIsGymOpen] = useState(false);
  const [isGitHubSyncOpen, setIsGitHubSyncOpen] = useState(false);
  const [tutorContextPrompt, setTutorContextPrompt] = useState<string>('');

  // Persist progress changes for the active user
  useEffect(() => {
    saveProgress(progress, currentUserState.id);
  }, [progress, currentUserState.id]);

  const activeLesson = LESSONS[activeLessonId] || LESSONS['foundations_1'];
  const streakInfo: StreakInfo = getStreakInfo(progress);

  // Handlers
  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPlayground = (playgroundId: string) => {
    setActivePlaygroundId(playgroundId);
    setCurrentView('playgrounds');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called on learning activity (quiz, mission, etc)
  const applyDailyActivity = (baseProgress: UserProgress) => {
    const { updatedProgress, isNewDayStreak, streakIncremented } = recordDailyActivity(baseProgress);
    if (streakIncremented) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    return updatedProgress;
  };

  const handleCompleteQuiz = (score: number, earnedXp: number) => {
    setProgress(prev => {
      const isAlreadyCompleted = prev.completedLessonIds.includes(activeLessonId);
      const nextCompleted = isAlreadyCompleted
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, activeLessonId];

      const currentStageModule = activeLesson.moduleId;
      const currentMastery = prev.masteryScores[currentStageModule] || 0;
      const nextMastery = Math.min(100, currentMastery + 15);

      const withQuizProgress: UserProgress = {
        ...prev,
        xp: prev.xp + earnedXp,
        completedLessonIds: nextCompleted,
        masteryScores: {
          ...prev.masteryScores,
          [currentStageModule]: nextMastery,
        },
      };

      // Automatically update Daily Streak
      return applyDailyActivity(withQuizProgress);
    });
  };

  const handleSaveNote = (note: string) => {
    setProgress(prev => ({
      ...prev,
      savedNotes: {
        ...prev.savedNotes,
        [activeLessonId]: note,
      },
    }));
  };

  const handleToggleBookmark = () => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarks.includes(activeLessonId);
      const nextBookmarks = isBookmarked
        ? prev.bookmarks.filter(b => b !== activeLessonId)
        : [...prev.bookmarks, activeLessonId];
      return { ...prev, bookmarks: nextBookmarks };
    });
  };

  const handleCompleteMission = (missionId: string, earnedXp: number) => {
    setProgress(prev => {
      const withMission: UserProgress = {
        ...prev,
        xp: prev.xp + earnedXp,
        completedMissions: [...prev.completedMissions, missionId],
      };
      // Automatically update Daily Streak
      return applyDailyActivity(withMission);
    });
  };

  const handleCompleteDiagnostic = (recommendedStage: ModuleStage) => {
    setProgress(prev => ({
      ...prev,
      diagnosticTaken: true,
      recommendedStage,
    }));
    if (recommendedStage === 1) setActiveLessonId('foundations_1');
    else if (recommendedStage === 2) setActiveLessonId('linear_algebra_1');
    else if (recommendedStage === 3) setActiveLessonId('calculus_1');
    else setActiveLessonId('probability_1');
    setCurrentView('lesson');
  };

  const handleOpenTutorWithPrompt = (prompt?: string) => {
    setTutorContextPrompt(prompt || '');
    setIsTutorOpen(true);
  };

  // Streak manual simulation / logging
  const handleSimulateStreakActivity = () => {
    setProgress(prev => {
      const today = getTodayDateString();
      const nextStreak = prev.streakDays + 1;
      const dates = prev.activityDates ? [...prev.activityDates] : [];
      if (!dates.includes(today)) dates.push(today);

      confetti({ particleCount: 70, spread: 60 });

      return {
        ...prev,
        streakDays: nextStreak,
        longestStreak: Math.max(prev.longestStreak, nextStreak),
        lastActiveDate: today,
        activityDates: dates,
        totalActiveDays: dates.length,
        xp: prev.xp + 25,
      };
    });
  };

  // Auth Handlers
  const handleLogin = (email: string, password = ''): boolean => {
    const user = loginUser(email, password);
    if (!user) return false;
    setCurrentUserState(user);
    const loadedProgress = getStoredProgress(user.id);
    setProgress(loadedProgress);
    return true;
  };

  const handleRegister = (name: string, email: string, password = '', avatar = 'turing') => {
    const newUser = registerUser(name, email, password, avatar);
    setCurrentUserState(newUser);
    setAllUsersState(getRegisteredUsers());
    const loadedProgress = getStoredProgress(newUser.id);
    setProgress(loadedProgress);
  };

  const handleSelectUser = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    const loadedProgress = getStoredProgress(user.id);
    setProgress(loadedProgress);
  };

  const handleLogout = () => {
    logoutUser();
    const guestUser = getCurrentUser();
    setCurrentUserState(guestUser);
    const loadedProgress = getStoredProgress(guestUser.id);
    setProgress(loadedProgress);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navbar with Daily Streak Counter and User Profile */}
      <Navbar
        currentView={currentView}
        onNavigate={view => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        onOpenTutor={() => handleOpenTutorWithPrompt()}
        onOpenStreak={() => setIsStreakModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCodeLab={() => setIsCodeLabOpen(true)}
        onOpenGym={() => setIsGymOpen(true)}
        onOpenGitHubSync={() => setIsGitHubSyncOpen(true)}
        progress={progress}
        currentUser={currentUserState}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentView === 'dashboard' && (
          <Dashboard
            progress={progress}
            currentUser={currentUserState}
            onSelectLesson={handleSelectLesson}
            onOpenMissions={() => setCurrentView('missions')}
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            onOpenPlayground={handleOpenPlayground}
            onOpenStreak={() => setIsStreakModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenCodeLab={() => setIsCodeLabOpen(true)}
            onOpenGym={() => setIsGymOpen(true)}
            onOpenGitHubSync={() => setIsGitHubSyncOpen(true)}
          />
        )}

        {currentView === 'curriculum' && (
          <CurriculumView
            progress={progress}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {currentView === 'lesson' && activeLesson && (
          <LessonView
            lesson={activeLesson}
            savedNote={progress.savedNotes[activeLessonId] || ''}
            isBookmarked={progress.bookmarks.includes(activeLessonId)}
            onSaveNote={handleSaveNote}
            onToggleBookmark={handleToggleBookmark}
            onCompleteQuiz={handleCompleteQuiz}
            onOpenTutor={handleOpenTutorWithPrompt}
          />
        )}

        {currentView === 'playgrounds' && (
          <PlaygroundsHubView initialPlayground={activePlaygroundId} />
        )}

        {currentView === 'missions' && (
          <MissionsView
            completedMissions={progress.completedMissions}
            onCompleteMission={handleCompleteMission}
            onOpenGym={() => setIsGymOpen(true)}
          />
        )}

        {currentView === 'mythbusters' && (
          <MythBustersView />
        )}

        {currentView === 'formulas' && (
          <FormulaSheetView onOpenCodeLab={() => setIsCodeLabOpen(true)} />
        )}
      </main>

      {/* Daily Streak Modal */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        streakInfo={streakInfo}
        onSimulateActivity={handleSimulateStreakActivity}
      />

      {/* User Authentication & Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUserState}
        allUsers={allUsersState}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSelectUser={handleSelectUser}
        onLogout={handleLogout}
      />

      {/* Diagnostic Assessment Modal */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onCompleteDiagnostic={handleCompleteDiagnostic}
      />

      {/* AI Tutor Companion Modal */}
      <AiTutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        currentLessonTitle={activeLesson?.title}
        currentTopic={activeLesson?.moduleId}
        currentFormula={activeLesson?.keyFormula}
        initialPrompt={tutorContextPrompt}
      />

      {/* Math-to-Code Converter (PyTorch & NumPy) */}
      <MathToCodeModal
        isOpen={isCodeLabOpen}
        onClose={() => setIsCodeLabOpen(false)}
        onEarnXp={(xp) => setProgress(p => applyDailyActivity({ ...p, xp: p.xp + xp }))}
      />

      {/* AI Math Gym Challenge Generator */}
      <AiMathGymModal
        isOpen={isGymOpen}
        onClose={() => setIsGymOpen(false)}
        onQuestionCompleted={(xp) => setProgress(p => applyDailyActivity({ ...p, xp: p.xp + xp }))}
      />

      {/* GitHub Repository Sync & Push */}
      <GitHubSyncModal
        isOpen={isGitHubSyncOpen}
        onClose={() => setIsGitHubSyncOpen(false)}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">MathVerse AI</span>
            <span>·</span>
            <span>Interactive Mathematics for Artificial Intelligence</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button onClick={() => setIsCodeLabOpen(true)} className="hover:text-cyan-400 transition-colors">
              PyTorch Lab
            </button>
            <button onClick={() => setIsGymOpen(true)} className="hover:text-amber-400 transition-colors">
              AI Math Gym
            </button>
            <button onClick={() => setIsGitHubSyncOpen(true)} className="hover:text-emerald-400 transition-colors">
              GitHub Sync
            </button>
            <button onClick={() => setIsStreakModalOpen(true)} className="hover:text-rose-400 transition-colors flex items-center gap-1">
              Streak: {progress.streakDays}d
            </button>
            <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-cyan-300 transition-colors">
              Account: {currentUserState.name.split(' ')[0]}
            </button>
            <button onClick={() => setIsDiagnosticOpen(true)} className="hover:text-cyan-300 transition-colors">
              Diagnostic Test
            </button>
            <button onClick={() => setCurrentView('formulas')} className="hover:text-cyan-300 transition-colors">
              Formula Sheet
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

