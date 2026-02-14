'use client';

import React from 'react';
import { Bot, FileText, Check, Download, Linkedin, Zap } from 'lucide-react';

export default function Features() {
    return (
        <section id="features" className="py-24 bg-slate-50 text-[#03334c] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
                        More than just a resume. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#03334c] to-blue-600">A smart AI profile.</span>
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        Our AI Personal Profile Generator analyzes your career history and rebuilds it into a compelling narrative.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

                    {/* Card 1: AI Polish (Large) */}
                    <div className="md:col-span-2 row-span-1 bg-white rounded-3xl p-8 border border-slate-200 hover:border-[#03334c]/20 hover:shadow-xl hover:shadow-[#03334c]/5 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#03334c]/[0.02] to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-[#03334c]/10 text-[#03334c] flex items-center justify-center mb-6">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-[#03334c]">AI Content Polishing</h3>
                                <p className="text-slate-500">Our advanced AI rewrites your boring bullet points into powerful, results-driven impact statements. It applies the "So What?" test to every line.</p>
                            </div>
                            <div className="mt-6 bg-slate-50 rounded-xl p-5 border border-slate-100 font-mono text-xs text-slate-600 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400 rounded-l-xl"></div>
                                <div className="mb-2 text-slate-400 line-through pl-2">Managed a team of 5</div>
                                <div className="text-[#03334c] font-semibold pl-2">→ Led a high-performance team of 5, increasing output by 40%</div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: LinkedIn Sync */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-[#0077b5]/30 hover:shadow-xl hover:shadow-[#0077b5]/10 transition-all group relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-50 rounded-full group-hover:bg-blue-100/50 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center mb-6">
                                <Linkedin className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-[#03334c]">Instant Import</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Don't start from scratch. Pull all your data from LinkedIn in one click.</p>
                        </div>
                    </div>

                    {/* Card 3: ATS Friendly */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/10 transition-all group relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center mb-6">
                                <Check className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-[#03334c]">ATS Optimized</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Clean code and standard layout ensure Applicant Tracking Systems read your profile perfectly.</p>
                        </div>
                    </div>

                    {/* Card 4: PDF Export (Large) */}
                    <div className="md:col-span-2 row-span-1 bg-white rounded-3xl p-8 border border-slate-200 hover:border-[#03334c]/20 hover:shadow-xl hover:shadow-[#03334c]/5 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tl from-[#03334c]/[0.02] to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-[#03334c]/10 text-[#03334c] flex items-center justify-center mb-6">
                                    <Download className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-[#03334c]">Print-Ready PDF</h3>
                                <p className="text-slate-500">Export high-resolution A4 PDFs that look amazing on screen and in print. No more awkward page breaks.</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg shadow-sm p-3 transform rotate-3 group-hover:rotate-0 transition-all duration-500 border border-slate-100">
                                <div className="h-40 bg-white rounded border border-slate-200 w-full shadow-inner flex flex-col gap-2 p-3">
                                    <div className="w-1/2 h-2 bg-slate-200 rounded"></div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                                    <div className="w-3/4 h-1.5 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
