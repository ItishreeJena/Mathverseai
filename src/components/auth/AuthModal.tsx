import React, { useState } from 'react';
import { UserAccount } from '../../types';
import {
  X,
  User,
  Mail,
  Lock,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onLogin: (email: string, password?: string) => boolean;
  onRegister: (name: string, email: string, password?: string, avatar?: string) => void;
  onSelectUser: (user: UserAccount) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onLogin,
  onRegister,
  onSelectUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'signin' | 'signup' | 'switch'>('profile');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('turing');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const AVATARS = [
    { id: 'turing', name: 'Alan Turing', color: 'from-cyan-500 to-blue-600' },
    { id: 'lovelace', name: 'Ada Lovelace', color: 'from-pink-500 to-purple-600' },
    { id: 'euler', name: 'Leonhard Euler', color: 'from-amber-500 to-orange-600' },
    { id: 'gauss', name: 'Carl Gauss', color: 'from-emerald-500 to-teal-600' },
    { id: 'ramanujan', name: 'S. Ramanujan', color: 'from-violet-500 to-indigo-600' },
  ];

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    const success = onLogin(email, password);
    if (success) {
      setSuccessMsg('Successfully signed in!');
      confetti({ particleCount: 50, spread: 50 });
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setErrorMsg('No account found with this email. Please check your credentials or switch account.');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      onRegister(name, email, password, avatar);
      setSuccessMsg('Account created successfully!');
      confetti({ particleCount: 60, spread: 60 });
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => {
              setActiveTab('profile');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => {
              setActiveTab('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'signin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'signup'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setActiveTab('switch');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'switch'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Switch User
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-lg text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: Profile View */}
        {activeTab === 'profile' && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white truncate">{currentUser.name}</h3>
                <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/60 px-2 py-0.5 rounded">
                  {currentUser.role || 'Mathematics Explorer'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Account ID</span>
                <span className="font-mono text-slate-200 truncate block mt-0.5">{currentUser.id}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Member Since</span>
                <span className="font-mono text-slate-200 block mt-0.5">{currentUser.createdAt}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('switch')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Switch / Demo Accounts</span>
              </button>

              <button
                onClick={() => {
                  onLogout();
                  setActiveTab('signin');
                }}
                className="w-full py-2 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 rounded-lg text-xs font-semibold border border-rose-900/50 flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Sign In */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-3.5 pt-1">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Password (Optional in Demo)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
            >
              Sign In
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('switch')}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline"
              >
                Or select one of our pre-configured student demo accounts →
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Sign Up */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5 pt-1">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Katherine Johnson"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="katherine@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1.5">Mathematician Avatar Persona</label>
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map(av => (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => setAvatar(av.id)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      avatar === av.id
                        ? 'border-cyan-400 bg-slate-800 shadow'
                        : 'border-slate-800 bg-slate-950 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-8 h-8 mx-auto rounded-full bg-gradient-to-tr ${av.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {av.name.charAt(0)}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1 truncate">{av.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
            >
              Create MathVerse Account
            </button>
          </form>
        )}

        {/* TAB 4: Switch / Demo Accounts */}
        {activeTab === 'switch' && (
          <div className="space-y-2.5 pt-1">
            <p className="text-xs text-slate-400 mb-2">
              Select any profile to test isolated user learning progress, personalized notes, and separate daily streaks:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allUsers.map(u => {
                const isCurrent = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      setSuccessMsg(`Switched to ${u.name}`);
                      setTimeout(() => onClose(), 400);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-indigo-950/40 border-indigo-500/70 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
