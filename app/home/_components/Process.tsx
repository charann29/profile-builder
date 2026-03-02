'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Linkedin, FileText, Mic, Keyboard, Zap } from 'lucide-react';

const methods = [
    {
        id: 'linkedin',
        icon: Linkedin,
        title: 'Paste LinkedIn Link',
        desc: 'Instant data extraction from your public profile.',
        highlight: 'Fastest',
        delay: 0.1
    },
    {
        id: 'upload',
        icon: FileText,
        title: 'Upload Document',
        desc: 'Parse your existing resume or business proposal CV.',
        delay: 0.2
    },
    {
        id: 'voice',
        icon: Mic,
        title: 'Talk to It',
        desc: 'Just speak your experience and let the AI transcribe and structure it.',
        delay: 0.3
    },
    {
        id: 'typing',
        icon: Keyboard,
        title: 'Type from Scratch',
        desc: 'Guided step-by-step wizard to build your narrative.',
        delay: 0.4
    }
];

export default function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="process" ref={sectionRef} className="py-24 bg-[#0A0A0A] text-white relative overflow-hidden border-t border-white/10">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/[0.04] rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-6">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-bold tracking-wider text-red-500 uppercase shadow-[0_0_10px_rgba(239,68,68,0.1)] transition-all duration-700"
                        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
                    >
                        <Zap className="w-3.5 h-3.5 text-red-500" />
                        <span>Seamless Process</span>
                    </div>

                    <h2
                        className="text-4xl md:text-5xl font-bold tracking-tight text-white transition-all duration-700 delay-100"
                        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
                    >
                        Built in under <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">2 minutes.</span>
                    </h2>

                    <p
                        className="text-gray-400 font-medium text-xl max-w-2xl mx-auto transition-all duration-700 delay-200"
                        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
                    >
                        Skip the hours of formatting. Choose your preferred input method and watch the AI assemble your professional profile instantly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {methods.map((method, idx) => {
                        const Icon = method.icon;
                        return (
                            <div
                                key={method.id}
                                className="group relative bg-[#111] border border-white/10 hover:border-red-500/40 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(239,68,68,0.15)]"
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(40px)',
                                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${method.delay}s`
                                }}
                            >
                                {method.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 border border-red-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                                        {method.highlight}
                                    </div>
                                )}

                                <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-red-500/10 group-hover:border-red-500/30 transition-all duration-500">
                                    <Icon className="w-8 h-8 text-gray-400 group-hover:text-red-500 transition-colors duration-500" />
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2">{method.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {method.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
