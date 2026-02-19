'use client';

import React, { useEffect, useState } from 'react';
import { useProfileStore } from '@/app/lib/store';
import EditorPreview from '@/app/components/editor/EditorPreview';
import AIChatPanel from '@/app/components/editor/AIChatPanel';
import { ChevronLeft, Save } from 'lucide-react';
import DownloadOptions from '@/app/components/editor/DownloadOptions';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';


export default function DesignEditorPage() {
    const params = useParams();
    const router = useRouter();
    const templateId = params.templateId as string;

    const { profileData } = useProfileStore();
    const [currentHtml, setCurrentHtml] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(true);

    const [templateMeta, setTemplateMeta] = useState<any>(null);

    // Load template content
    useEffect(() => {
        if (!templateId) return;

        const loadTemplate = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/template/${templateId}`);
                if (!res.ok) throw new Error("Template not found");

                const data = await res.json();

                // Set meta
                setTemplateMeta({
                    id: data.id,
                    name: data.name, // Ensure API returns these
                    dimensions: data.dimensions
                });

                if (data.html) {
                    // Initial compile with Handlebars
                    const Handlebars = (await import('handlebars')).default;
                    const template = Handlebars.compile(data.html);

                    const displayData = {
                        ...profileData,
                        fullName: profileData.fullName || 'Your Name',
                        tagline: profileData.tagline || 'Your Professional Title',
                    };

                    const rendered = template(displayData);
                    setCurrentHtml(rendered);
                }
            } catch (error) {
                console.error("Error loading template:", error);
                // Optionally redirect to templates page on error
            } finally {
                setLoading(false);
            }
        };

        loadTemplate();
    }, [templateId, profileData]);

    const handleAiEdit = async (prompt: string) => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/ai-edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    html: currentHtml, // Send the current state of HTML
                    prompt,
                    userData: profileData
                })
            });
            const data = await res.json();
            if (data.html) {
                setCurrentHtml(data.html);
            }
        } catch (error) {
            console.error("AI Edit failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Listen for download ready from iframe
    useEffect(() => {
        const handler = async (event: MessageEvent) => {
            if (event.data.type === 'DOWNLOAD_READY') {
                const { format, dataUrl, fileName } = event.data;

                if (format === 'png') {
                    const a = document.createElement('a');
                    a.href = dataUrl;
                    a.download = `${fileName}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setIsGenerating(false);
                } else if (format === 'pdf') {
                    // Generate PDF from the received PNG data URL
                    try {
                        const { jsPDF } = (await import('jspdf'));
                        const pdf = new jsPDF({
                            orientation: 'portrait',
                            unit: 'mm',
                            format: 'a4'
                        });

                        const imgProps = pdf.getImageProperties(dataUrl);
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
                        pdf.save(`${fileName}.pdf`);
                    } catch (e) {
                        console.error("PDF Generation failed", e);
                        alert("PDF Generation failed");
                    } finally {
                        setIsGenerating(false);
                    }
                }
            } else if (event.data.type === 'DOWNLOAD_ERROR') {
                console.error("Download error from iframe:", event.data.error);
                alert("Failed to generate file. Please try again.");
                setIsGenerating(false);
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    const handleDownload = async (format: 'html' | 'png' | 'pdf') => {
        setIsGenerating(true);
        try {
            const fileName = `${profileData.fullName || 'profile'}-${templateId}`;

            if (format === 'html') {
                const blob = new Blob([currentHtml], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setIsGenerating(false);
            } else {
                // Request iframe to generate the image
                const iframe = document.getElementById('template-preview-iframe') as HTMLIFrameElement;
                if (!iframe || !iframe.contentWindow) {
                    throw new Error("Preview not ready");
                }

                iframe.contentWindow.postMessage({
                    type: 'GENERATE_DOWNLOAD',
                    format,
                    fileName
                }, '*');
            }
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to initiate download.");
            setIsGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50 text-[#01334c]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-[#01334c] border-t-transparent animate-spin"></div>
                    <p className="font-medium">Loading Studio...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans text-slate-900 selection:bg-[#01334c] selection:text-white">
            {/* Toolbar */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <Link
                        href="/templates"
                        className="text-slate-500 hover:text-[#01334c] flex items-center gap-2 text-sm font-semibold transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Templates
                    </Link>
                    <div className="w-px h-5 bg-slate-200"></div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[#01334c] text-lg capitalize tracking-tight">
                            {templateMeta?.name || templateId}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-100">
                            Editor Active
                        </span>
                    </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#01334c] rounded-xl text-sm font-semibold transition-all shadow-sm">
                    <Save className="w-4 h-4" /> Save Draft
                </button>
                <div className="flex items-center gap-3">
                    <DownloadOptions onDownload={handleDownload} isDownloading={isGenerating} />
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* AI Sidebar - Left */}
                <div className="w-[420px] shrink-0 border-r border-slate-200 bg-white shadow-xl shadow-slate-200/50 z-10 relative">
                    <AIChatPanel onSendMessage={handleAiEdit} isProcessing={isGenerating} />
                </div>

                {/* Visual Editor Area - Right */}
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    {/* Editor Canvas - EditorPreview handles the scaling and centering internally */}
                    <EditorPreview
                        html={currentHtml}
                        data={profileData}
                        onHtmlChange={setCurrentHtml}
                        width={templateMeta?.dimensions?.width}
                        height={templateMeta?.dimensions?.height}
                    />
                </div>
            </div>
        </div>
    );
}
