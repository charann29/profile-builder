"use client";

import React, { useEffect, useState, useRef } from 'react';
import { renderProfile } from '@/app/lib/default-content';
import { Download, Share2, Loader2, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Using React.use to unwrap params since Next.js 15
    const { id } = React.use(params);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/public-profile/${id}`);
                if (!res.ok) {
                    throw new Error('Profile not found or access denied');
                }
                const data = await res.json();
                setProfileData(data.profile_data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    // Handle Responsive Scaling for A4 size on Mobile
    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.clientWidth;
            // A4 pixel width is ~794px at 96 DPI. Add a little padding (e.g. 32px)
            const padding = 32;
            const availableWidth = containerWidth - padding;

            if (availableWidth < 794) {
                setScale(availableWidth / 794);
            } else {
                setScale(1);
            }
        };

        handleResize(); // Initial call
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [loading, profileData]);

    const downloadPDF = async () => {
        try {
            setDownloading(true);
            const html2pdf = (await import('html2pdf.js')).default;
            const element = document.getElementById('printableArea');
            if (!element) throw new Error("Document area not loaded");

            const opt = {
                margin: 0,
                filename: `${profileData?.fullName?.replace(/\s+/g, '-') || 'Profile'}-Resume.pdf`,
                image: { type: 'jpeg' as const, quality: 1.0 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    windowWidth: 794 // A4 width at 96 DPI
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-[#01334c] animate-spin" />
                    <p className="text-slate-500 font-medium">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <Share2 className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Profile Not Found</h1>
                <p className="text-slate-500 max-w-sm mb-6">
                    This profile link may be broken, deleted, or you don't have permission to view it.
                </p>
                <a href="/" className="px-6 py-3 bg-[#01334c] text-white rounded-xl font-bold hover:bg-[#024466] transition-colors">
                    Create Your Own Profile
                </a>
            </div>
        );
    }

    const htmlContent = renderProfile(profileData);

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center">
            {/* Top Navigation Bar */}
            <div className="w-full bg-[#01334c] border-b border-[#024466] sticky top-0 z-50 shadow-md">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center group">
                        <Image
                            src="/logo.png"
                            alt="ProfileBuilder"
                            width={160}
                            height={40}
                            className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
                            unoptimized
                            priority
                        />
                    </Link>

                    {/* Desktop / Mobile Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link
                            href="/chat"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-colors border border-white/10"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Your Own</span>
                        </Link>

                        <button
                            onClick={downloadPDF}
                            disabled={downloading}
                            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white hover:bg-slate-100 text-[#01334c] rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-70"
                        >
                            {downloading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="hidden sm:inline">Generating...</span>
                                    <span className="sm:hidden">PDF...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Download PDF</span>
                                    <span className="sm:hidden">PDF</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile CTA Strip below header */}
                <div className="sm:hidden bg-[#024466] border-t border-[#0a6b8a] px-4 py-3 flex justify-center shadow-inner">
                    <Link
                        href="/chat"
                        className="flex items-center justify-center gap-1.5 w-full text-white font-bold text-[13px]"
                    >
                        Want a profile like this? <span className="underline decoration-2 underline-offset-2 text-[#60a5fa] hover:text-white transition-colors">Create yours free</span>
                    </Link>
                </div>
            </div>

            {/* Document Viewer */}
            <div
                ref={containerRef}
                className="w-full flex-1 overflow-x-hidden py-8 sm:py-12 px-0 sm:px-4 flex justify-center flex-col items-center pb-24 relative"
            >
                {/* Background decorative elements */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center">
                    <div className="w-full max-w-5xl h-full relative">
                        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-40"></div>
                        <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 bg-[#01334c]/5 rounded-full blur-[80px] opacity-60"></div>
                    </div>
                </div>

                {/* The Page Container that applies scaling */}
                <div
                    className="relative transition-transform duration-200 ease-out origin-top flex justify-center"
                    style={{
                        transform: `scale(${scale})`,
                        width: '794px', // Forced fixed width for scaling context
                        marginBottom: scale < 1 ? `-${(1 - scale) * 1122}px` : '0' // Roughly compensate A4 height
                    }}
                >
                    <div
                        id="printableArea"
                        className="a4-page shadow-2xl relative z-10 shrink-0"
                        dangerouslySetInnerHTML={{
                            __html: typeof window !== 'undefined' ?
                                require('dompurify').sanitize(htmlContent) : htmlContent
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
