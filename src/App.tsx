import React, { useState, useEffect } from 'react';
import { getStoredProgress, saveProgress } from './services/storageService';
import { UserProgress, ModuleStage } from './types';
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

type AppView = 'dashboard' | 'curriculum' | 'lesson' | 'playgrounds' | 'missions' | 'mythbusters' | 'formulas';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(getStoredProgress);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string>('foundations_1');
  const [activePlaygroundId, setActivePlaygroundId] = useState<string>('vectors');

  // Modals
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorContextPrompt, setTutorContextPrompt] = useState<string>('');

  // Save progress on changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const activeLesson = LESSONS[activeLessonId] || LESSONS['foundations_1'];

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

  const handleCompleteQuiz = (score: number, earnedXp: number) => {
    setProgress(prev => {
      const isAlreadyCompleted = prev.completedLessonIds.includes(activeLessonId);
      const nextCompleted = isAlreadyCompleted
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, activeLessonId];

      const currentStageModule = activeLesson.moduleId;
      const currentMastery = prev.masteryScores[currentStageModule] || 0;
      const nextMastery = Math.min(100, currentMastery + 15);

      return {
        ...prev,
        xp: prev.xp + earnedXp,
        completedLessonIds: nextCompleted,
        masteryScores: {
          ...prev.masteryScores,
          [currentStageModule]: nextMastery,
        },
      };
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
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + earnedXp,
      completedMissions: [...prev.completedMissions, missionId],
    }));
  };

  const handleCompleteDiagnostic = (recommendedStage: ModuleStage) => {
    setProgress(prev => ({
      ...prev,
      diagnosticTaken: true,
      recommendedStage,
    }));
    // Route to appropriate lesson
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={view => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        onOpenTutor={() => handleOpenTutorWithPrompt()}
        progress={progress}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentView === 'dashboard' && (
          <Dashboard
            progress={progress}
            onSelectLesson={handleSelectLesson}
            onOpenMissions={() => setCurrentView('missions')}
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            onOpenPlayground={handleOpenPlayground}
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
          />
        )}

        {currentView === 'mythbusters' && (
          <MythBustersView />
        )}

        {currentView === 'formulas' && (
          <FormulaSheetView />
        )}
      </main>

      {/* Modals */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onCompleteDiagnostic={handleCompleteDiagnostic}
      />

      <AiTutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        currentLessonTitle={activeLesson?.title}
        currentTopic={activeLesson?.moduleId}
        currentFormula={activeLesson?.keyFormula}
        initialPrompt={tutorContextPrompt}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">MathVerse AI</span>
            <span>·</span>
            <span>Interactive Mathematics for Artificial Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsDiagnosticOpen(true)} className="hover:text-cyan-300 transition-colors">
              Diagnostic Assessment
            </button>
            <button onClick={() => setCurrentView('formulas')} className="hover:text-cyan-300 transition-colors">
              Formula Sheet
            </button>
            <button onClick={() => setCurrentView('mythbusters')} className="hover:text-cyan-300 transition-colors">
              Myth Busters
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
