"use client";

import React, { useState } from "react";
import { X, Copy, Check, Download, Share2, Globe, ExternalLink } from "lucide-react";
import QRCode from "react-qr-code";

interface SharePopupProps {
    isOpen: boolean;
    onClose: () => void;
    profileUrl: string;
}

export default function SharePopup({ isOpen, onClose, profileUrl }: SharePopupProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    const handleDownloadQR = () => {
        const svg = document.getElementById("profile-qr-code");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        // Scale up for better quality download
        canvas.width = 1000;
        canvas.height = 1000;

        img.onload = () => {
            if (!ctx) return;
            // White background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Draw QR centered with padding
            ctx.drawImage(img, 100, 100, 800, 800);

            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = "my-profile-qr.png";
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
                onClick={onClose}
            />

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-900/20 z-50 overflow-hidden animate-slide-up border border-slate-100 flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#01334c]/10 flex items-center justify-center text-[#01334c]">
                            <Share2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-slate-800 leading-tight">Share Profile</h2>
                            <p className="text-xs text-slate-500 font-medium">Anyone with the link can view</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col items-center">
                    {/* QR Code */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
                        <QRCode
                            id="profile-qr-code"
                            value={profileUrl}
                            size={180}
                            level="H"
                            fgColor="#01334c"
                        />
                    </div>

                    <button
                        onClick={handleDownloadQR}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold transition-colors mb-8"
                    >
                        <Download className="w-4 h-4" />
                        Download QR
                    </button>

                    {/* Link Section */}
                    <div className="w-full space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            Public URL
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-600 font-medium truncate select-all">
                                {profileUrl}
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`flex-shrink-0 p-3 rounded-xl flex items-center justify-center transition-all ${copied
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                        : "bg-[#01334c] text-white hover:bg-[#024466] shadow-sm shadow-[#01334c]/20 hover:shadow-[#01334c]/30 active:scale-95"
                                    }`}
                                title="Copy Link"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium max-w-[240px]">
                        This link gives read-only access to your generated profile PDF.
                    </p>
                    <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-[#01334c] hover:underline"
                    >
                        Preview
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </>
    );
}
