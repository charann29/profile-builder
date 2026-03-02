'use client';

import React, { useEffect, useState } from 'react';
import { useProfileStore } from '@/app/lib/store';
import EditorPreview from '@/app/components/editor/EditorPreview';
import AIChatPanel from '@/app/components/editor/AIChatPanel';
import { ChevronLeft, Save, Sparkles } from 'lucide-react';
import DownloadOptions from '@/app/components/editor/DownloadOptions';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { supabase } from '@/app/lib/supabase';
import AuthModal from '@/app/components/AuthModal';
import UseMyDataModal from '@/app/components/editor/UseMyDataModal';
import { saveProfile } from '@/app/lib/db';

export default function DesignEditorPage() {
    const { profileData, user, setUser, showAuthModal, setShowAuthModal, setPendingAction, messages, addMessage, activeProfileId, setActiveProfileId } = useProfileStore();
    const params = useParams();
    const router = useRouter();
    const templateId = params.templateId as string;

    const [currentHtml, setCurrentHtml] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(true);

    const [templateMeta, setTemplateMeta] = useState<any>(null);
    const [showUseMyDataModal, setShowUseMyDataModal] = useState(false);
    const [hasSeenModal, setHasSeenModal] = useState(false);

    // Sync Auth Status
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [setUser]);

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

                    if (!hasSeenModal) {
                        setShowUseMyDataModal(true);
                        setHasSeenModal(true);
                    }
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
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/ai-edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
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

    const handleAutoFill = async () => {
        setIsGenerating(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const prompt = "Act as an expert designer. Carefully replace all placeholder names, job titles, and sample descriptions in this template with the actual user data provided. Keep all HTML tags, classes, and inline styles EXACTLY the same. If a field from the user data is missing, leave the placeholder or remove the text gracefully. Remove any remaining Handlebars placeholders that couldn't be filled.";

            const res = await fetch('/api/ai-edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    html: currentHtml,
                    prompt,
                    userData: profileData
                })
            });
            const data = await res.json();
            if (data.html) {
                setCurrentHtml(data.html);
                setShowUseMyDataModal(false);

                if (user) {
                    const botMsg = {
                        sender: 'bot' as 'bot', // Type casting to literal
                        text: `I've successfully customized the ${templateMeta?.name || 'template'} with your profile data. You can find it saved in your history.`
                    };
                    addMessage(botMsg);

                    try {
                        const allMessages = [...messages, botMsg];
                        const saved = await saveProfile(
                            user.id,
                            profileData,
                            allMessages,
                            data.html,
                            activeProfileId || undefined
                        );
                        if (saved && !activeProfileId) {
                            setActiveProfileId(saved.id);
                        }
                    } catch (err) {
                        console.error("Auto-save failed:", err);
                    }
                }
            }
        } catch (error) {
            console.error("AI Auto-fill failed:", error);
            alert("Failed to auto-fill data.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Listen for messages from iframe
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [templateImageId, setTemplateImageId] = useState<string | null>(null);

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
                }
            } else if (event.data.type === 'DOWNLOAD_ERROR') {
                console.error("Download error from iframe:", event.data.error);
                alert("Failed to generate file. Please try again.");
                setIsGenerating(false);
            } else if (event.data.type === 'IMAGE_CLICK') {
                // Open file picker
                setTemplateImageId(event.data.imageId);
                if (fileInputRef.current) {
                    fileInputRef.current.click();
                }
            } else if (event.data.type === 'DOWNLOAD_BLOCKED') {
                alert("Please replace all default images with your own before downloading.");
                setIsGenerating(false);
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !templateImageId) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            // Send back to iframe
            const iframe = document.getElementById('template-preview-iframe') as HTMLIFrameElement;
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'REPLACE_IMAGE',
                    imageId: templateImageId,
                    newSrc: base64
                }, '*');
            }
            // Clear input
            if (fileInputRef.current) fileInputRef.current.value = '';
            setTemplateImageId(null);
        };
        reader.readAsDataURL(file);
    };

    const requireAuth = (action: () => void) => {
        if (!user) {
            setPendingAction(() => action);
            setShowAuthModal(true);
            return false;
        }
        return true;
    };

    const handleDownload = async (format: 'html' | 'png' | 'pdf') => {
        if (!requireAuth(() => handleDownload(format))) return;
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
            } else if (format === 'png') {
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
            } else if (format === 'pdf') {
                const iframe = document.getElementById('template-preview-iframe') as HTMLIFrameElement;
                if (!iframe || !iframe.contentWindow || !iframe.contentDocument) {
                    throw new Error("Preview not ready");
                }

                iframe.contentWindow.postMessage({ type: 'PREPARE_FOR_PDF' }, '*');
                // Brief wait for UI states in iframe to hide
                await new Promise(resolve => setTimeout(resolve, 200));

                const element = iframe.contentDocument.documentElement;

                const html2pdf = (await import("html2pdf.js")).default;
                const opt = {
                    margin: 0,
                    filename: `${fileName}.pdf`,
                    image: { type: "jpeg" as const, quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        letterRendering: true,
                        scrollY: 0,
                        scrollX: 0,
                        backgroundColor: "#ffffff",
                        window: iframe.contentWindow
                    },
                    jsPDF: {
                        unit: "mm",
                        format: "a4",
                        orientation: "portrait" as const,
                        compress: true,
                    },
                    pagebreak: {
                        mode: ["avoid-all", "css", "legacy"] as string[],
                        before: ".pdf-page-break",
                    },
                };

                const pdfObj = await html2pdf()
                    .set(opt)
                    .from(element)
                    .toPdf()
                    .get("pdf");

                const totalPages = pdfObj.internal.getNumberOfPages();
                if (totalPages > 2) {
                    for (let i = totalPages; i > 2; i--) {
                        pdfObj.deletePage(i);
                    }
                }

                pdfObj.save(`${fileName}.pdf`);
                setIsGenerating(false);
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

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowUseMyDataModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-[#01334c] bg-white border border-[#01334c]/20 hover:bg-[#01334c]/5 rounded-xl text-sm font-semibold transition-all shadow-sm"
                    >
                        <Sparkles className="w-4 h-4" /> Auto-Fill Data
                    </button>
                    <button
                        onClick={async () => {
                            if (!user) {
                                setPendingAction(() => () => { });
                                setShowAuthModal(true);
                                return;
                            }
                            try {
                                const saved = await saveProfile(
                                    user.id,
                                    profileData,
                                    messages,
                                    currentHtml,
                                    activeProfileId || undefined
                                );
                                if (saved && !activeProfileId) {
                                    setActiveProfileId(saved.id);
                                }
                                alert("Draft saved successfully!");
                            } catch (err) {
                                console.error("Manual save failed", err);
                                alert("Failed to save draft.");
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#01334c] rounded-xl text-sm font-semibold transition-all shadow-sm"
                    >
                        <Save className="w-4 h-4" /> Save Draft
                    </button>
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

                    {/* Floating Action Button for Quick Image Upload */}
                    <button
                        onClick={() => {
                            const iframe = document.getElementById('template-preview-iframe') as HTMLIFrameElement;
                            if (iframe && iframe.contentWindow) {
                                iframe.contentWindow.postMessage({ type: 'TRIGGER_PRIMARY_IMAGE_CLICK' }, '*');
                            }
                        }}
                        className="absolute bottom-6 left-6 z-50 flex items-center gap-2 px-5 py-3 bg-[#01334c] text-white rounded-full shadow-lg hover:bg-[#024466] hover:scale-105 transition-all text-sm font-bold"
                        title="Upload Photo"
                    >
                        <span>📷</span>
                        <span>Upload Photo</span>
                    </button>
                </div>
            </div>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/webp, image/gif, .png, .jpg, .jpeg, .webp, .gif"
                onChange={handleImageUpload}
            />
            {/* Auth Modal for guest prompt */}
            {showAuthModal && <AuthModal />}
            <UseMyDataModal
                isOpen={showUseMyDataModal}
                onClose={() => setShowUseMyDataModal(false)}
                onConfirm={handleAutoFill}
                isGenerating={isGenerating}
                hasData={!!(profileData?.fullName || profileData?.expertiseAreas?.length)}
            />
        </div>
    );
}
