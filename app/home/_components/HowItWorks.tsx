'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            num: "01",
            title: "Connect LinkedIn",
            desc: "Paste your LinkedIn profile URL. We securely extract your experience, skills, and education."
        },
        {
            num: "02",
            title: "AI Enhancement",
            desc: "Review the extracted data. Our AI suggests improvements to make your achievements sound more impactful."
        },
        {
            num: "03",
            title: "Download & Share",
            desc: "Export your perfectly formatted profile as a PDF. Ready to apply, pitch, or share."
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white text-[#03334c]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#03334c] mb-4">How it works</h2>
                    <p className="text-slate-500">Three simple steps to a better professional profile.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">

                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[2px] bg-slate-100 z-0"></div>

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-20 h-20 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center mb-6 group-hover:border-[#03334c] transition-colors duration-500 shadow-xl shadow-slate-200">
                                <span className="text-2xl font-bold text-slate-300 group-hover:text-[#03334c] transition-colors">{step.num}</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#03334c] mb-3">{step.title}</h3>
                            <p className="text-slate-500 max-w-xs leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold bg-[#03334c] text-white hover:bg-[#02283b] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#03334c]/20"
                    >
                        Start Building Now <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
