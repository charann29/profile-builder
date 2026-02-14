'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
    {
        q: 'Is this free to use?',
        a: 'Yes! You can build and download your profile completely for free during our beta period. No credit card required.',
    },
    {
        q: 'Does it work with any LinkedIn profile?',
        a: 'Yes, as long as the profile is public, our engine can extract all the details. You can also edit and add details manually if you prefer.',
    },
    {
        q: 'Is my data secure?',
        a: 'Absolutely. We only use your data to generate the profile. We do not sell or share your personal information with third parties. Your data is encrypted at rest and in transit.',
    },
    {
        q: 'Can I edit the content after importing?',
        a: 'Yes, you have full control over every section. You can edit fields directly, and even use our AI to help rewrite specific parts with custom instructions.',
    },
    {
        q: 'What format will my profile be in?',
        a: 'Your profile is generated as a beautifully designed A4 one-pager. You can download it as a high-resolution PDF that looks great on screen and in print.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
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
        <section id="faq" ref={sectionRef} className="py-28 bg-slate-50/50 text-[#03334c]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-20 items-start">
                    {/* Left — Header */}
                    <div
                        className="lg:sticky lg:top-32 space-y-5"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(30px)',
                            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#03334c]/[0.05] border border-[#03334c]/10 text-xs font-bold tracking-wider text-[#03334c] uppercase">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>FAQ</span>
                        </div>
                        <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-tight leading-tight">
                            Frequently asked{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#03334c] to-blue-600">
                                questions
                            </span>
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Everything you need to know about ProfileBuilder. Can&apos;t find what you&apos;re looking for? Reach out to our team.
                        </p>
                    </div>

                    {/* Right — Accordion */}
                    <div className="space-y-3">
                        {faqs.map((faq, idx) => {
                            const isOpen = openIndex === idx;
                            const delay = idx * 0.08;

                            return (
                                <div
                                    key={idx}
                                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                                        ? 'border-[#03334c]/15 shadow-lg shadow-slate-200/50'
                                        : 'border-slate-100 hover:border-slate-200 shadow-sm'
                                        }`}
                                    style={{
                                        opacity: visible ? 1 : 0,
                                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                                        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, border-color 0.3s, box-shadow 0.3s`,
                                    }}
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                                        className="w-full flex items-center justify-between p-6 text-left group"
                                    >
                                        <span className={`font-semibold transition-colors ${isOpen ? 'text-[#03334c]' : 'text-slate-700'}`}>
                                            {faq.q}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-4 transition-all duration-300 ${isOpen
                                            ? 'bg-[#03334c] text-white rotate-180'
                                            : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                                            }`}>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </button>

                                    <div
                                        style={{
                                            maxHeight: isOpen ? '200px' : '0px',
                                            opacity: isOpen ? 1 : 0,
                                            transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 text-slate-500 leading-relaxed text-[15px]">
                                            {faq.a}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
