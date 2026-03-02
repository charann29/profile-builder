'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Infinity, Timer, Linkedin, Handshake } from 'lucide-react';

const props = [
    {
        icon: Infinity,
        title: 'Unlimited Free Drafts',
        desc: 'Build, tweak, and perfect your professional narrative as many times as you need. Free to use for unlimited generations.',
        delay: 0.1
    },
    {
        icon: Timer,
        title: '2 Minutes Maximum',
        desc: 'Stop wasting hours on formatting. Our AI engine builds a comprehensive, executive-ready profile in less than 120 seconds.',
        delay: 0.2
    },
    {
        icon: Linkedin,
        title: 'Instant Data Sync',
        desc: 'Connect your public LinkedIn URL and automatically pull your entire career history directly into our secure builder.',
        delay: 0.3
    },
    {
        icon: Handshake,
        title: 'Close Deals Instantly',
        desc: 'Command respect and build trust from the first interaction. Send this profile ahead of meetings and increase your close rate.',
        delay: 0.4
    }
];

export default function ValueProps() {
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
        <section id="value" ref={sectionRef} className="py-24 bg-[#0A0A0A] text-white relative overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-20">
                    <h2
                        className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 transition-all duration-700"
                        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
                    >
                        The ultimate <span className="text-red-500">unfair advantage.</span>
                    </h2>
                    <p
                        className="text-gray-400 text-lg max-w-2xl mx-auto font-medium transition-all duration-700 delay-100"
                        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
                    >
                        We've engineered the perfect tool for business owners who want premium results without the premium time investment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {props.map((prop, idx) => {
                        const Icon = prop.icon;
                        return (
                            <div
                                key={idx}
                                className="group relative bg-[#111] border border-white/10 hover:border-red-500/50 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(239,68,68,0.1)] overflow-hidden"
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(40px)',
                                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${prop.delay}s`
                                }}
                            >
                                {/* Glowing background effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-red-600/0 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center mb-6 shadow-[0_4px_20px_rgba(220,38,38,0.4)] group-hover:scale-110 transition-transform duration-500">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{prop.title}</h3>
                                    <p className="text-gray-400 leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
                                        {prop.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
