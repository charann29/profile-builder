'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bot, FileText, Check, Download, Linkedin, Zap, Palette, Shield } from 'lucide-react';

const features = [
    {
        icon: Bot,
        title: 'AI Content Polishing',
        desc: 'Our advanced AI rewrites your bullet points into powerful, results-driven impact statements. It applies the "So What?" test to every line.',
        color: '#03334c',
        bgColor: 'rgba(3, 51, 76, 0.06)',
        hoverBorder: 'hover:border-[#03334c]/20',
        large: true,
        demo: {
            before: 'Managed a team of 5 engineers',
            after: 'Led a high-performance team of 5, increasing product delivery speed by 40%',
        },
    },
    {
        icon: Linkedin,
        title: 'LinkedIn Import',
        desc: "Don't start from scratch. Pull all your career data from LinkedIn in one click.",
        color: '#0077b5',
        bgColor: 'rgba(0, 119, 181, 0.08)',
        hoverBorder: 'hover:border-[#0077b5]/25',
        large: false,
    },
    {
        icon: Check,
        title: 'ATS Optimized',
        desc: 'Clean semantic structure ensures Applicant Tracking Systems parse your profile perfectly.',
        color: '#059669',
        bgColor: 'rgba(5, 150, 105, 0.08)',
        hoverBorder: 'hover:border-emerald-500/25',
        large: false,
    },
    {
        icon: Download,
        title: 'Print-Ready PDF',
        desc: 'Export high-resolution A4 PDFs that look amazing on screen and in print. No awkward page breaks.',
        color: '#03334c',
        bgColor: 'rgba(3, 51, 76, 0.06)',
        hoverBorder: 'hover:border-[#03334c]/20',
        large: true,
    },
    {
        icon: Palette,
        title: 'Beautiful Design',
        desc: 'Professionally designed templates that make you stand out from generic resumes.',
        color: '#7c3aed',
        bgColor: 'rgba(124, 58, 237, 0.08)',
        hoverBorder: 'hover:border-violet-500/25',
        large: false,
    },
    {
        icon: Shield,
        title: 'Private & Secure',
        desc: 'Your data stays yours. We never sell or share your personal information with third parties.',
        color: '#0369a1',
        bgColor: 'rgba(3, 105, 161, 0.08)',
        hoverBorder: 'hover:border-sky-600/25',
        large: false,
    },
];

export default function Features() {
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
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="features" ref={sectionRef} className="py-28 bg-slate-50/50 text-[#03334c] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#03334c]/[0.02] to-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative">
                {/* Section Header */}
                <div
                    className="text-center max-w-3xl mx-auto mb-20 space-y-5"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#03334c]/[0.05] border border-[#03334c]/10 text-xs font-bold tracking-wider text-[#03334c] uppercase">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Powerful Features</span>
                    </div>
                    <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-tight leading-tight">
                        More than just a resume.{' '}
                        <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#03334c] to-blue-600">
                            A smart AI profile.
                        </span>
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
                        Our AI Personal Profile Generator analyzes your career history and rebuilds it into a compelling, professional narrative.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        const delay = idx * 0.1;

                        return (
                            <div
                                key={idx}
                                className={`
                                    ${feature.large ? 'md:col-span-2' : ''}
                                    group relative bg-white rounded-2xl p-7 border border-slate-100 
                                    ${feature.hoverBorder} hover:shadow-xl hover:shadow-slate-200/50 
                                    transition-all duration-500 hover:-translate-y-1 overflow-hidden
                                `}
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(30px)',
                                    transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
                                }}
                            >
                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                                <div className="relative z-10 h-full flex flex-col">
                                    {/* Icon */}
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                                        style={{ backgroundColor: feature.bgColor }}
                                    >
                                        <Icon className="w-5.5 h-5.5" style={{ color: feature.color }} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-bold text-[#03334c] mb-2">{feature.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>

                                    {/* AI Demo (for the large card) */}
                                    {feature.demo && (
                                        <div className="mt-6 bg-slate-50 rounded-xl p-5 border border-slate-100 relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-l-xl" />
                                            <div className="pl-3 space-y-2.5">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-[10px] font-bold text-red-400 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">Before</span>
                                                    <span className="text-xs text-slate-400 line-through">{feature.demo.before}</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">After</span>
                                                    <span className="text-xs text-[#03334c] font-semibold">{feature.demo.after}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
