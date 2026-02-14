'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#03334c] text-slate-300 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-serif text-xl font-bold text-white">
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-[#03334c] text-xs font-bold">
                            P
                        </div>
                        ProfileBuilder
                    </div>
                    <p className="text-sm opacity-60">© 2026 ProfileBuilder. All rights reserved.</p>
                </div>

                <div className="flex gap-6 text-sm font-medium">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                </div>

                <div className="flex gap-4">
                    <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <Github className="w-4 h-4" />
                    </a>
                </div>

            </div>
        </footer>
    );
}
