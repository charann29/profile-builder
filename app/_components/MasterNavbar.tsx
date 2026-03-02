'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function MasterNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
            ? 'bg-[#050505]/90 backdrop-blur-md shadow-[0_4px_30px_-10px_rgba(0,0,0,0.8)] border-b border-white/10'
            : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[76px]">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <Image src="/logo.png" alt="OnEasy Logo" width={140} height={40} className="h-8 w-auto object-contain" unoptimized priority />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-2">
                    {[
                        { label: 'Agents', href: '#agents' },
                        { label: 'How It Works', href: '#how-it-works' },
                    ].map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="px-4 py-2 text-[14px] font-semibold text-gray-300 hover:text-white transition-all relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-red-500 hover:after:w-1/2 after:transition-all after:duration-300"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="#"
                        className="text-[14px] font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                        Log In
                    </Link>
                    <Link
                        href="#agents"
                        className="px-6 py-2.5 rounded-xl text-[14px] font-bold bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-105 flex items-center gap-2"
                    >
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#0A0A0A] border-t border-white/10 shadow-2xl absolute w-full left-0">
                    <div className="px-6 py-6 space-y-2">
                        {['Agents', 'How It Works'].map((label) => (
                            <a
                                key={label}
                                href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                                className="block px-4 py-3 text-base font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {label}
                            </a>
                        ))}
                        <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                            <Link href="#" className="px-4 py-3 text-base font-semibold text-center text-white bg-white/5 rounded-xl hover:bg-white/10">Log In</Link>
                            <Link href="#agents" className="px-4 py-3 text-base font-bold bg-red-600 text-white rounded-xl text-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">Get Started</Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
