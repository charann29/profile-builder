'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, FileCode, FileImage, FileText, ChevronDown } from 'lucide-react';

interface DownloadOptionsProps {
    onDownload: (format: 'html' | 'png' | 'pdf') => void;
    isDownloading: boolean;
}

export default function DownloadOptions({ onDownload, isDownloading }: DownloadOptionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (format: 'html' | 'png' | 'pdf') => {
        onDownload(format);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isDownloading}
                className={`flex items-center gap-2 px-5 py-2 bg-[#01334c] hover:bg-[#0a6b8a] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#01334c]/20 hover:shadow-[#01334c]/30 hover:-translate-y-0.5 transition-all ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}
            >
                {isDownloading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4" />
                        Download
                        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                        <button
                            onClick={() => handleSelect('html')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 rounded-lg text-slate-700 hover:text-[#01334c] transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                <FileCode className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="block text-sm font-semibold">HTML Source</span>
                                <span className="block text-[10px] text-slate-400 font-medium">Web-ready file</span>
                            </div>
                        </button>

                        <button
                            onClick={() => handleSelect('png')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 rounded-lg text-slate-700 hover:text-[#01334c] transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <FileImage className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="block text-sm font-semibold">PNG Image</span>
                                <span className="block text-[10px] text-slate-400 font-medium">High-res image</span>
                            </div>
                        </button>

                        <button
                            onClick={() => handleSelect('pdf')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 rounded-lg text-slate-700 hover:text-[#01334c] transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="block text-sm font-semibold">PDF Document</span>
                                <span className="block text-[10px] text-slate-400 font-medium">Standard A4 format</span>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
