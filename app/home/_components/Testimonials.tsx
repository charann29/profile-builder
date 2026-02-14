'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Aarav Patel',
        role: 'Product Manager at Razorpay',
        initials: 'AP',
        gradient: 'from-violet-500 to-purple-600',
        rating: 5,
        text: '"I went from a cluttered LinkedIn summary to a stunning one-pager in under 60 seconds. The AI suggestions were spot-on and saved me hours of writing."',
    },
    {
        name: 'Maria Gonzalez',
        role: 'UX Designer at Figma',
        initials: 'MG',
        gradient: 'from-rose-400 to-pink-500',
        rating: 5,
        text: '"The design quality is incredible — it looks like I hired a professional designer. I\'ve already shared it with three recruiters and got amazing feedback."',
    },
    {
        name: 'David Chen',
        role: 'Senior Engineer at Stripe',
        initials: 'DC',
        gradient: 'from-blue-500 to-indigo-600',
        rating: 5,
        text: '"Finally, a tool that understands how to present technical achievements. The AI reworded my bullet points and made them genuinely impactful."',
    },
];

export default function Testimonials() {
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
        <section id="testimonials" ref={sectionRef} className="py-28 bg-white text-[#03334c] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-indigo-50/30 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative">
                {/* Section Header */}
                <div
                    className="text-center max-w-3xl mx-auto mb-16 space-y-5"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#03334c]/[0.05] border border-[#03334c]/10 text-xs font-bold tracking-wider text-[#03334c] uppercase">
                        <Star className="w-3.5 h-3.5" />
                        <span>Loved by Professionals</span>
                    </div>
                    <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-tight leading-tight">
                        Don&apos;t just take our word for it.
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
                        Thousands of professionals trust ProfileBuilder to present their best selves.
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, idx) => {
                        const delay = idx * 0.12;

                        return (
                            <div
                                key={idx}
                                className="group relative bg-white rounded-2xl p-7 border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1"
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(30px)',
                                    transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
                                }}
                            >
                                {/* Quote icon */}
                                <div className="absolute top-6 right-6 text-slate-100 group-hover:text-slate-200 transition-colors">
                                    <Quote className="w-8 h-8" />
                                </div>

                                {/* Stars */}
                                <div className="flex items-center gap-0.5 mb-5">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

                                {/* Quote text */}
                                <p className="text-sm text-slate-600 leading-relaxed mb-6">{testimonial.text}</p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-5 border-t border-slate-50">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                                        {testimonial.initials}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-[#03334c]">{testimonial.name}</div>
                                        <div className="text-xs text-slate-400">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
