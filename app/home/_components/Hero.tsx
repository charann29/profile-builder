'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Sparkles } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-white text-[#03334c] selection:bg-[#03334c] selection:text-white">

            {/* Background Gradients (Subtle) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#03334c] rounded-full blur-[120px] opacity-[0.03] animate-pulse-slow"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-40 animate-pulse-slow delay-1000"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-[#03334c]">
                    <div className="w-8 h-8 bg-[#03334c] rounded-lg flex items-center justify-center text-white text-lg shadow-lg shadow-[#03334c]/20">
                        P
                    </div>
                    <span>ProfileBuilder</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                    <a href="#features" className="hover:text-[#03334c] transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-[#03334c] transition-colors">How it Works</a>
                    <a href="#faq" className="hover:text-[#03334c] transition-colors">FAQ</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="hidden sm:flex px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:text-[#03334c] hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/"
                        className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#03334c] hover:bg-[#02283b] text-white shadow-lg shadow-[#03334c]/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        Build Profile <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Column: Text */}
                <div className="space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#03334c]/5 border border-[#03334c]/10 text-[#03334c] text-xs font-bold tracking-wide uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>The World's #1 AI Profile Generator</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-[1.1] text-[#03334c]">
                        Meet Your New <br />
                        <span className="relative inline-block">
                            <span className="relative z-10">AI Personal Profile.</span>
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-100/50 -z-10 skew-x-[-12deg]"></span>
                        </span>
                    </h1>

                    <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                        The ultimate <strong>AI Personal Profile Generator</strong>. Turn your scattered LinkedIn data into a stunning, world-class professional one-pager in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Link
                            href="/"
                            className="px-8 py-4 rounded-full text-base font-bold bg-[#03334c] text-white hover:bg-[#02283b] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#03334c]/20 flex items-center justify-center gap-2"
                        >
                            Start for Free
                        </Link>
                        <a
                            href="#how-it-works"
                            className="px-8 py-4 rounded-full text-base font-bold bg-white text-[#03334c] border border-slate-200 hover:border-[#03334c]/30 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                        >
                            See How It Works
                        </a>
                    </div>

                    <div className="flex items-center gap-6 pt-8 border-t border-slate-100">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden relative shadow-sm`}>
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                                        U{i}
                                    </div>
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-[#03334c] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                +2k
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Trusted by 2,000+ professionals</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visual */}
                <div className="relative group perspective-1000 pl-4 lg:pl-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#03334c]/5 to-blue-500/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative transform transition-all duration-700 hover:rotate-y-[-5deg] hover:rotate-x-[5deg] preserve-3d">
                        {/* Main Card */}
                        <div className="relative bg-white rounded-2xl p-2 shadow-2xl border border-slate-100 overflow-hidden">
                            {/* Header Bar */}
                            <div className="h-6 bg-slate-50 rounded-t-lg border-b border-slate-100 flex items-center px-3 gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                            </div>
                            {/* Content Mockup */}
                            <div className="bg-white p-6 aspect-[1/1.414] relative overflow-hidden flex flex-col gap-6">
                                {/* Profile Header */}
                                <div className="flex items-start gap-5 border-b border-slate-50 pb-6">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 shrink-0 border border-slate-100"></div>
                                    <div className="space-y-2.5 w-full pt-1">
                                        <div className="w-3/4 h-5 bg-[#03334c] rounded-md opacity-90"></div>
                                        <div className="w-1/2 h-3.5 bg-slate-200 rounded-md"></div>
                                        <div className="flex gap-2 mt-1">
                                            <div className="w-16 h-2 bg-slate-100 rounded-full"></div>
                                            <div className="w-16 h-2 bg-slate-100 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Body Content */}
                                <div className="space-y-5">
                                    <div className="space-y-2.5">
                                        <div className="w-1/4 h-3 bg-slate-200 rounded uppercase text-[10px] tracking-wider">About</div>
                                        <div className="w-full h-2 bg-slate-50 rounded"></div>
                                        <div className="w-full h-2 bg-slate-50 rounded"></div>
                                        <div className="w-5/6 h-2 bg-slate-50 rounded"></div>
                                    </div>
                                    <div className="space-y-4 pt-2">
                                        <div className="w-1/4 h-3 bg-slate-200 rounded uppercase text-[10px] tracking-wider">Experience</div>
                                        {[1, 2].map(i => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <div className="w-8 h-8 rounded bg-slate-50 shrink-0 border border-slate-50"></div>
                                                <div className="w-full space-y-1.5">
                                                    <div className="w-2/3 h-2.5 bg-slate-200 rounded"></div>
                                                    <div className="w-1/2 h-2 bg-slate-100 rounded"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute bottom-6 right-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3 rounded-xl border border-slate-50 flex items-center gap-3 animate-bounce-subtle">
                                    <div className="w-9 h-9 rounded-full bg-[#03334c]/10 flex items-center justify-center text-[#03334c]">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-[#03334c]">ATS Optimized</div>
                                        <div className="text-[10px] text-slate-500">Readability Score: 98%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements around the card */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#03334c]/5 rounded-2xl rotate-12 -z-10"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-50 rounded-full -z-10"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
