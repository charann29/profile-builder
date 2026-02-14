'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        q: "Is this free to use?",
        a: "Yes! You can build and download your profile completely for free during our beta period."
    },
    {
        q: "Does it work with any LinkedIn profile?",
        a: "Yes, as long as the profile is public, our engine can extract the details. You can also edit and add details manually."
    },
    {
        q: "Is my data secure?",
        a: "Absolutely. We only use your data to generate the profile. We do not sell or share your personal information with third parties."
    },
    {
        q: "Can I edit the content after importing?",
        a: "Yes, you have full control. You can edit every section, and even use our AI to help rewrite specific parts."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 bg-slate-50 text-[#03334c]">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-center mb-12 text-[#03334c]">
                    Frequently asked questions
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-semibold text-lg text-[#03334c]">{faq.q}</span>
                                {openIndex === idx ? <ChevronUp className="w-5 h-5 text-[#03334c]" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </button>

                            <div
                                className={`px-6 text-slate-500 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                {faq.a}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
