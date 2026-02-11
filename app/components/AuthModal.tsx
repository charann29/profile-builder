'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useProfileStore } from '../lib/store';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60_000; // 60 seconds

export default function AuthModal() {
    const { setShowAuthModal, setUser, pendingAction, setPendingAction } = useProfileStore();

    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Rate limiting state
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockedUntil, setLockedUntil] = useState<number | null>(null);

    const handleClose = () => {
        setShowAuthModal(false);
        setPendingAction(null);
    };

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        // Execute the pending action if any
        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
            // OAuth will redirect, so no need to handle success here
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };

    const isLockedOut = lockedUntil !== null && Date.now() < lockedUntil;

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check lockout
        if (isLockedOut) {
            const remainingSec = Math.ceil(((lockedUntil ?? 0) - Date.now()) / 1000);
            setError(`Too many failed attempts. Please try again in ${remainingSec} seconds.`);
            return;
        }

        // Client-side validation (can't be bypassed like HTML minLength)
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (mode === 'signup' && fullName.trim().length < 1) {
            setError('Please enter your name.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email: trimmedEmail,
                    password,
                    options: {
                        data: { full_name: fullName.trim() },
                    },
                });
                if (error) throw error;

                if (data.user && !data.session) {
                    setSuccessMessage('Check your email for a confirmation link!');
                    return;
                }

                if (data.user) {
                    setUser(data.user);
                    setFailedAttempts(0);
                    handleAuthSuccess();
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: trimmedEmail,
                    password,
                });
                if (error) throw error;

                if (data.user) {
                    setUser(data.user);
                    setFailedAttempts(0);
                    handleAuthSuccess();
                }
            }
        } catch (err: unknown) {
            const newCount = failedAttempts + 1;
            setFailedAttempts(newCount);
            if (newCount >= MAX_ATTEMPTS) {
                setLockedUntil(Date.now() + LOCKOUT_DURATION_MS);
                setError(`Too many failed attempts. You are locked out for 60 seconds.`);
            } else {
                setError(err instanceof Error ? err.message : 'Authentication failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/20 w-full max-w-md mx-4 overflow-hidden border border-slate-100 animate-slide-up">

                {/* Header */}
                <div className="bg-gradient-to-br from-[#01334c] to-[#024466] px-8 py-8 text-center relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 ring-4 ring-white/10 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-white/60 mt-1.5 font-medium">
                        {mode === 'login' ? 'Sign in to continue building your profile' : 'Sign up to start building your profile'}
                    </p>
                </div>

                {/* Body */}
                <div className="px-8 py-8 space-y-5">

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 animate-fade-in">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl px-4 py-3 animate-fade-in">
                            <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Google OAuth Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        {mode === 'signup' && (
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <User className="w-4 h-4 text-slate-400 group-focus-within:text-[#01334c] transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full name"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#01334c]/20 focus:border-[#01334c] transition-all group-hover:bg-white group-hover:shadow-md"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-[#01334c] transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#01334c]/20 focus:border-[#01334c] transition-all group-hover:bg-white group-hover:shadow-md"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-[#01334c] transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                minLength={6}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#01334c]/20 focus:border-[#01334c] transition-all group-hover:bg-white group-hover:shadow-md"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || isLockedOut}
                            className="w-full py-3.5 rounded-xl bg-[#01334c] hover:bg-[#024466] disabled:opacity-50 disabled:hover:bg-[#01334c] text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#01334c]/20 hover:shadow-[#01334c]/40 active:scale-[0.98] flex items-center justify-center gap-2.5"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="text-center pt-1">
                        <button
                            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccessMessage(''); }}
                            className="text-xs font-medium text-slate-400 hover:text-[#01334c] transition-colors"
                        >
                            {mode === 'login'
                                ? "Don't have an account? Sign up"
                                : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
