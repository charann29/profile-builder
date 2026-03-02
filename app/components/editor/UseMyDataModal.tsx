import React from 'react';
import { Loader2, Wand2, X } from 'lucide-react';

interface UseMyDataModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onClose: () => void;
    isGenerating: boolean;
    hasData: boolean;
}

export default function UseMyDataModal({ isOpen, onConfirm, onClose, isGenerating, hasData }: UseMyDataModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/20 w-full max-w-md mx-4 overflow-hidden border border-slate-100 animate-slide-up relative">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#01334c] to-[#024466] px-8 py-8 text-center relative">
                    {!isGenerating && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    )}
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 ring-4 ring-white/10 shadow-lg">
                        <Wand2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        Auto-Fill Your Profile
                    </h2>
                    <p className="text-sm text-white/80 mt-2 font-medium">
                        Let AI instantly arrange your details into this template.
                    </p>
                </div>

                {/* Body */}
                <div className="px-8 py-8 space-y-5">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                            <div className="relative">
                                <Loader2 className="w-10 h-10 animate-spin text-[#01334c]" />
                                <div className="absolute inset-0 border-4 border-[#01334c]/20 rounded-full"></div>
                            </div>
                            <p className="text-sm font-semibold text-slate-700 animate-pulse">
                                AI is arranging your profile...
                            </p>
                        </div>
                    ) : (
                        <>
                            {!hasData && (
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-4">
                                    <p className="text-xs text-amber-800 font-medium">
                                        Your profile seems empty. You might get better results by filling out your profile first, but you can still try auto-filling with whatever data is available.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={onConfirm}
                                className="w-full py-3.5 rounded-xl bg-[#01334c] hover:bg-[#024466] text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#01334c]/20 hover:shadow-[#01334c]/40 active:scale-[0.98] flex items-center justify-center gap-2.5"
                            >
                                <Wand2 className="w-4 h-4" />
                                <span>Auto-fill using my data</span>
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-600 text-sm font-semibold transition-all duration-200 hover:shadow-md active:scale-[0.98] flex items-center justify-center text-center"
                            >
                                Start from scratch
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
