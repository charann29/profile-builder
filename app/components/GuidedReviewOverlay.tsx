'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    Check,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    SkipForward,
    Pencil,
    Linkedin,
    Plus,
    X,
    Trash2,
    Sparkles,
    Loader2,
    MessageSquare
} from 'lucide-react';
import { ProfileData } from '../lib/schema';
import { enhanceProfileSection } from '../lib/groq';

// ────────────────────────────────────────────────────────────────────────────────
// Section configuration
// ────────────────────────────────────────────────────────────────────────────────

interface ReviewSection {
    id: string;
    label: string;
    description: string;
    emptyPrompt: string;
    selector: string;
    scrollSelector?: string;
    fields: (keyof ProfileData)[];
    hasData: (data: Partial<ProfileData>) => boolean;
    guidance: string;
    tips: string[];
    examples?: string[];
}

const REVIEW_SECTIONS: ReviewSection[] = [
    {
        id: 'identity',
        label: 'Your Identity',
        description: "Here's how your name and title will appear on your profile.",
        emptyPrompt: "We didn't find your name or title on LinkedIn. Add them now?",
        selector: '.header-container',
        fields: ['fullName', 'professionalTitle', 'topHighlights', 'tagline'],
        hasData: (d) => !!(d.fullName || d.professionalTitle || d.tagline),
        guidance: 'This is the first thing people see — your name, title, and 3 standout highlights. These must hook the reader instantly.',
        tips: [
            'Highlights should include numbers & impact (e.g., "Trained 15,000+ Professionals")',
            'Professional title = qualifications (CA, MBA, CFA)',
            'Use power verbs: Led, Built, Scaled, Pioneered',
        ],
        examples: [
            '"Trained 15,000+ Business Owners"',
            '"Virtual CFO | Startup Strategist"',
            '"Helped 500+ Startups with Compliance"',
        ],
    },
    {
        id: 'story',
        label: 'Your Story',
        description: "This is your personal elevator pitch — your 'About Me' section.",
        emptyPrompt: "No about section found. Want to write a quick intro?",
        selector: '.prompt-box',
        fields: ['aboutMe', 'personalStory30'],
        hasData: (d) => !!((d.aboutMe && d.aboutMe.length > 20) || d.personalStory30),
        guidance: 'Your About Me is 3-4 powerful sentences about your journey. The Personal Story is a single 30-word elevator pitch.',
        tips: [
            'Apply the "So What?" test — every sentence must answer why someone should care',
            'Personal Story = one powerful line about your journey',
            'Match your tone: formal for CAs/lawyers, bold for entrepreneurs',
        ],
        examples: [
            '"From son of a farmer to the CEO of a 50-crore company"',
            '"Started with ₹10,000 savings, now helping 1000+ businesses"',
            '"Left a cushy corporate job to follow my passion"',
        ],
    },
    {
        id: 'expertise',
        label: 'Your Expertise',
        description: 'These are the key areas of expertise we identified.',
        emptyPrompt: 'No expertise areas found. Add your core skills?',
        selector: '.roles-section',
        fields: ['expertiseAreas', 'expertiseDescriptions'],
        hasData: (d) => !!(d.expertiseAreas && d.expertiseAreas.length > 0),
        guidance: 'Up to 5 core expertise areas, each 3 words max. These define what you\'re known for professionally.',
        tips: [
            'Be specific: "Growth Strategy" beats "Business Consulting"',
            'Use industry keywords that clients search for',
            'Max 5 areas — quality over quantity',
        ],
    },
    {
        id: 'career',
        label: 'Your Career',
        description: 'Your work history and brands you\'ve been associated with.',
        emptyPrompt: 'No work experience found. Add your positions?',
        selector: '.brands-section',
        fields: ['positions'],
        hasData: (d) => !!(d.positions && d.positions.length > 0),
        guidance: 'Showcase the brands and companies you\'ve worked with — your roles, durations, and key contributions.',
        tips: [
            'Lead with your most impressive role',
            'Include company name, title, and duration',
            'Up to 10 brands — focus on the ones that build credibility',
        ],
    },
    {
        id: 'links',
        label: 'Your Links',
        description: 'Social profiles and websites connected to you.',
        emptyPrompt: 'No social links found. Add your profiles?',
        selector: '.social-links',
        scrollSelector: '.header-container',
        fields: ['socialLinks'],
        hasData: (d) => !!(d.socialLinks?.linkedin || d.socialLinks?.website || d.socialLinks?.instagram || d.socialLinks?.twitter || d.socialLinks?.youtube || d.socialLinks?.facebook || d.socialLinks?.companyWebsite),
        guidance: 'Social links verify your professional presence. LinkedIn is the most important — add your website and other platforms too.',
        tips: [
            'LinkedIn is primary and strongly recommended',
            'A personal website adds professional credibility',
            'Instagram, YouTube, and podcasts showcase your personal brand',
        ],
    },
    {
        id: 'contact',
        label: 'Contact Info',
        description: 'How people can reach you.',
        emptyPrompt: 'No contact details found. Add your email or phone?',
        selector: '.contact-section',
        fields: ['contact'],
        hasData: (d) => !!(d.contact?.emailPrimary || d.contact?.phonePrimary),
        guidance: 'This is how people will reach out to you directly — your professional email and phone number.',
        tips: [
            'Use a professional email (avoid generic Gmail if possible)',
            'Double-check for typos — this is your direct contact',
        ],
    },
];

// ────────────────────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────────────────────

interface GuidedReviewOverlayProps {
    profileData: Partial<ProfileData>;
    onUpdateField: (field: keyof ProfileData, value: unknown) => void;
    onMerge: (data: Partial<ProfileData>) => void;
    onComplete: () => void;
    previewContainerId: string;
}

// ────────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────────

export default function GuidedReviewOverlay({
    profileData,
    onUpdateField,
    onMerge,
    onComplete,
    previewContainerId,
}: GuidedReviewOverlayProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightRect, setHighlightRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [highlightVisible, setHighlightVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [localEdits, setLocalEdits] = useState<Partial<ProfileData>>({});
    const [mounted, setMounted] = useState(false);
    const [cardKey, setCardKey] = useState(0);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<Partial<ProfileData> | null>(null);
    const [userInstructions, setUserInstructions] = useState('');
    const cardBodyRef = useRef<HTMLDivElement>(null);
    const navDebounceRef = useRef(false);
    const rafRef = useRef<number>(0);

    // Draggable state
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            setPosition({
                x: e.clientX - dragStartRef.current.x,
                y: e.clientY - dragStartRef.current.y
            });
        };
        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const section = REVIEW_SECTIONS[currentStep];
    const totalSteps = REVIEW_SECTIONS.length;

    // Ensure we only render portal on client
    useEffect(() => { setMounted(true); }, []);

    // ── Compute highlight rect relative to viewport ─────────────────────────
    const computeHighlight = useCallback(() => {
        const container = document.getElementById(previewContainerId);
        if (!container) return;

        const el = container.querySelector(section.selector);
        if (!el) {
            setHighlightRect(null);
            return;
        }

        const rect = el.getBoundingClientRect();
        const padding = 8;

        setHighlightRect({
            top: rect.top - padding,
            left: rect.left - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
        });
    }, [previewContainerId, section.selector]);

    // ── Scroll preview so the target section is visible ──────────────────────
    const scrollToSection = useCallback(() => {
        const scrollArea = document.getElementById('docScrollArea');
        const container = document.getElementById(previewContainerId);
        if (!scrollArea || !container) return;

        const scrollSelector = section.scrollSelector || section.selector;
        const el = container.querySelector(scrollSelector);
        if (!el) return;

        const elRect = el.getBoundingClientRect();
        const scrollRect = scrollArea.getBoundingClientRect();

        // If the element is not fully visible within the scroll area, scroll it into view
        if (elRect.top < scrollRect.top + 20 || elRect.bottom > scrollRect.bottom - 20) {
            // Calculate how much we need to scroll
            const scrollOffset = elRect.top - scrollRect.top - 60;
            scrollArea.scrollBy({ top: scrollOffset, behavior: 'smooth' });
        }

        // Recompute highlight after scroll settles
        setTimeout(computeHighlight, 500);
    }, [section, previewContainerId, computeHighlight]);

    // ── On step change ──────────────────────────────────────────────────────
    useEffect(() => {
        setLocalEdits({});
        setAiSuggestion(null);
        setUserInstructions('');

        // 1. Briefly hide the highlight (opacity fade-out via CSS transition)
        setHighlightVisible(false);

        // 2. After a short pause, scroll to the new section
        const t1 = setTimeout(() => {
            scrollToSection();
        }, 80);

        // 3. After scroll starts, compute position and fade highlight in
        const t2 = setTimeout(() => {
            computeHighlight();
            setHighlightVisible(true);
            setCardKey(prev => prev + 1); // Re-trigger card entry animation
        }, 350);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [currentStep, scrollToSection, computeHighlight]);

    // ── Continuously track position (handles scroll, resize, data changes) ──
    useEffect(() => {
        let running = true;
        const tick = () => {
            if (!running) return;
            computeHighlight();
            rafRef.current = requestAnimationFrame(tick);
        };
        // Start immediately — no delay
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            running = false;
            cancelAnimationFrame(rafRef.current);
        };
    }, [computeHighlight]);

    // ── Keyboard navigation ─────────────────────────────────────────────────
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Don't intercept if user is typing in an input/textarea
            const tag = (e.target as HTMLElement).tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;

            if (e.key === 'Escape') { e.preventDefault(); handleSkipAll(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);

    // ── Navigation ──────────────────────────────────────────────────────────
    const goNext = useCallback(() => {
        if (navDebounceRef.current) return;
        navDebounceRef.current = true;

        // Apply pending edits
        if (Object.keys(localEdits).length > 0) {
            onMerge(localEdits);
            setLocalEdits({});
        }

        if (currentStep < totalSteps - 1) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsTransitioning(false);
            }, 300);
        } else {
            onComplete();
        }

        setTimeout(() => { navDebounceRef.current = false; }, 500);
    }, [currentStep, totalSteps, localEdits, onMerge, onComplete]);

    const goPrev = useCallback(() => {
        if (navDebounceRef.current || currentStep === 0) return;
        navDebounceRef.current = true;

        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentStep(prev => prev - 1);
            setIsTransitioning(false);
        }, 300);

        setTimeout(() => { navDebounceRef.current = false; }, 500);
    }, [currentStep]);

    const handleSkipAll = useCallback(() => { onComplete(); }, [onComplete]);

    // ── Local edit helpers ──────────────────────────────────────────────────
    const getFieldValue = (field: keyof ProfileData) => {
        if (field in localEdits) return localEdits[field];
        return profileData[field];
    };

    const setFieldValue = (field: keyof ProfileData, value: unknown) => {
        setLocalEdits(prev => ({ ...prev, [field]: value }));
        onUpdateField(field, value);
    };

    const setNestedValue = (parent: string, field: string, value: string) => {
        const current = (getFieldValue(parent as keyof ProfileData) || {}) as Record<string, unknown>;
        const updated = { ...current, [field]: value };
        setFieldValue(parent as keyof ProfileData, updated);
    };

    // ── Handle AI Enhancement ───────────────────────────────────────────────
    const handleEnhance = async () => {
        setIsEnhancing(true);
        try {
            // Merge local edits with current profile data to capture "Edited" state
            const currentData = { ...profileData, ...localEdits };
            const result = await enhanceProfileSection(section.id, currentData, userInstructions);
            if (result && Object.keys(result).length > 0) {
                setAiSuggestion(result);
            }
        } catch (err) {
            console.error('AI enhance failed:', err);
        } finally {
            setIsEnhancing(false);
        }
    };


    // ── Render section-specific edit fields ──────────────────────────────────
    const renderEditFields = () => {
        switch (section.id) {
            case 'identity':
                return (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                value={(getFieldValue('fullName') as string) || ''}
                                onChange={(e) => setFieldValue('fullName', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#01334c] focus:bg-white outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Professional Title</label>
                            <input
                                type="text"
                                value={(getFieldValue('professionalTitle') as string) || ''}
                                onChange={(e) => setFieldValue('professionalTitle', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#01334c] focus:bg-white outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tagline / Headline</label>
                            <textarea
                                value={(getFieldValue('tagline') as string) || ''}
                                onChange={(e) => setFieldValue('tagline', e.target.value)}
                                value={(getFieldValue('tagline') as string) || ''}
                                onChange={(e) => setFieldValue('tagline', e.target.value)}
                                placeholder="Your magnetic headline"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#01334c] focus:bg-white outline-none transition-all resize-none"
                                rows={2}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Highlights</label>
                            {((getFieldValue('topHighlights') as string[]) || []).map((h, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={h}
                                        value={h}
                                        onChange={(e) => {
                                            const highlights = [...((getFieldValue('topHighlights') as string[]) || [])];
                                            highlights[i] = e.target.value;
                                            setFieldValue('topHighlights', highlights);
                                        }}
                                        placeholder="Highlight achievement"
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#01334c] focus:bg-white outline-none transition-all"
                                    />
                                    <button
                                        onClick={() => {
                                            const highlights = [...((getFieldValue('topHighlights') as string[]) || [])];
                                            highlights.splice(i, 1);
                                            setFieldValue('topHighlights', highlights);
                                        }}
                                        className="p-1 text-slate-300 hover:text-red-500"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                            {((getFieldValue('topHighlights') as string[]) || []).length < 3 && (
                                <button
                                    onClick={() => {
                                        const highlights = [...((getFieldValue('topHighlights') as string[]) || []), ''];
                                        setFieldValue('topHighlights', highlights);
                                    }}
                                    className="flex items-center gap-1 text-xs text-[#01334c] hover:bg-[#01334c]/5 px-2 py-1.5 rounded-lg border border-dashed border-[#01334c]/30 w-full justify-center transition-all"
                                >
                                    <Plus className="w-3 h-3" /> Add highlight
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'story':
                return (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">About Me</label>
                            <textarea
                                value={(getFieldValue('aboutMe') as string) || ''}
                                onChange={(e) => setFieldValue('aboutMe', e.target.value)}
                                rows={6}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#01334c] focus:bg-white outline-none resize-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Personal Story (30 Words)</label>
                            <textarea
                                value={(getFieldValue('personalStory30') as string) || ''}
                                onChange={(e) => setFieldValue('personalStory30', e.target.value)}
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#01334c] focus:bg-white outline-none resize-none transition-all"
                            />
                        </div>
                    </div>
                );

            case 'expertise':
                return (
                    <div className="space-y-3 animate-fade-in-up">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expertise Areas</label>
                        <div className="space-y-2.5">
                            {((getFieldValue('expertiseAreas') as string[]) || []).map((area, i) => (
                                <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 group relative hover:bg-white hover:shadow-sm transition-all">
                                    <button
                                        onClick={() => {
                                            const areas = [...((getFieldValue('expertiseAreas') as string[]) || [])];
                                            const descs = [...((getFieldValue('expertiseDescriptions') as string[]) || [])];
                                            areas.splice(i, 1);
                                            descs.splice(i, 1);
                                            setFieldValue('expertiseAreas', areas);
                                            setFieldValue('expertiseDescriptions', descs);
                                        }}
                                        className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <input
                                        type="text"
                                        value={area}
                                        onChange={(e) => {
                                            const areas = [...((getFieldValue('expertiseAreas') as string[]) || [])];
                                            areas[i] = e.target.value;
                                            setFieldValue('expertiseAreas', areas);
                                        }}
                                        placeholder="Role title (e.g. Digital Marketing)"
                                        className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#01334c] placeholder-slate-400"
                                    />
                                    <input
                                        type="text"
                                        value={((getFieldValue('expertiseDescriptions') as string[]) || [])[i] || ''}
                                        onChange={(e) => {
                                            const descs = [...((getFieldValue('expertiseDescriptions') as string[]) || [])];
                                            // Ensure array is long enough
                                            while (descs.length <= i) descs.push('');
                                            descs[i] = e.target.value;
                                            setFieldValue('expertiseDescriptions', descs);
                                        }}
                                        placeholder="Short description"
                                        className="w-full bg-transparent border-none outline-none text-xs text-slate-500 mt-1 placeholder-slate-300"
                                    />
                                </div>
                            ))}
                        </div>
                        {((getFieldValue('expertiseAreas') as string[]) || []).length < 5 && (
                            <button
                                onClick={() => {
                                    const areas = [...((getFieldValue('expertiseAreas') as string[]) || []), ''];
                                    const descs = [...((getFieldValue('expertiseDescriptions') as string[]) || []), ''];
                                    setFieldValue('expertiseAreas', areas);
                                    setFieldValue('expertiseDescriptions', descs);
                                }}
                                className="flex items-center gap-1 text-xs text-[#01334c] hover:bg-[#01334c]/5 px-2 py-2 rounded-lg w-full justify-center border border-dashed border-[#01334c]/30"
                            >
                                <Plus className="w-3 h-3" /> Add expertise
                            </button>
                        )}
                    </div>
                );

            case 'career': {
                const positions = ((getFieldValue('positions') as ProfileData['positions']) || []);
                return (
                    <div className="space-y-3 animate-fade-in-up">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Work Positions</label>
                        <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                            {positions.map((pos, i) => (
                                <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 relative group hover:bg-white hover:shadow-sm transition-all">
                                    <button
                                        onClick={() => {
                                            const updated = [...positions];
                                            updated.splice(i, 1);
                                            setFieldValue('positions', updated);
                                        }}
                                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={pos.title}
                                            onChange={(e) => {
                                                const updated = [...positions];
                                                updated[i] = { ...pos, title: e.target.value };
                                                setFieldValue('positions', updated);
                                            }}
                                            placeholder="Job Title"
                                            className="bg-white border border-slate-100 rounded px-2 py-1.5 text-xs focus:border-[#01334c] outline-none font-medium text-slate-700"
                                        />
                                        <input
                                            type="text"
                                            value={pos.company}
                                            onChange={(e) => {
                                                const updated = [...positions];
                                                updated[i] = { ...pos, company: e.target.value };
                                                setFieldValue('positions', updated);
                                            }}
                                            placeholder="Company"
                                            className="bg-white border border-slate-100 rounded px-2 py-1.5 text-xs focus:border-[#01334c] outline-none text-slate-600"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={pos.duration || ''}
                                        onChange={(e) => {
                                            const updated = [...positions];
                                            updated[i] = { ...pos, duration: e.target.value };
                                            setFieldValue('positions', updated);
                                        }}
                                        placeholder="Duration (e.g. Jan 2020 - Present)"
                                        className="w-full bg-white border border-slate-100 rounded px-2 py-1.5 text-xs mt-2 focus:border-[#01334c] outline-none text-slate-500"
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                const updated = [...positions, { title: '', company: '', duration: '' }];
                                setFieldValue('positions', updated);
                            }}
                            className="flex items-center gap-1 text-xs text-[#01334c] hover:bg-[#01334c]/5 px-2 py-2 rounded-lg w-full justify-center border border-dashed border-[#01334c]/30"
                        >
                            <Plus className="w-3 h-3" /> Add position
                        </button>
                    </div>
                );
            }

            case 'links': {
                const links = (getFieldValue('socialLinks') || {}) as Record<string, string>;
                const linkFields = [
                    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
                    { key: 'website', label: 'Website', placeholder: 'https://yoursite.com' },
                    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
                    { key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/...' },
                    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@...' },
                    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
                    { key: 'companyWebsite', label: 'Company Website', placeholder: 'https://company.com' },
                ];
                return (
                    <div className="space-y-3 animate-fade-in-up">
                        {linkFields.map((lf) => (
                            <div key={lf.key} className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lf.label}</label>
                                <input
                                    type="url"
                                    value={links[lf.key] || ''}
                                    onChange={(e) => setNestedValue('socialLinks', lf.key, e.target.value)}
                                    placeholder={lf.placeholder}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#01334c] focus:bg-white outline-none transition-all"
                                />
                            </div>
                        ))}
                    </div>
                );
            }

            case 'contact': {
                const contact = (getFieldValue('contact') || {}) as Record<string, unknown>;
                return (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={(contact.emailPrimary as string) || ''}
                                onChange={(e) => setNestedValue('contact', 'emailPrimary', e.target.value)}
                                placeholder="you@email.com"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#01334c] focus:bg-white outline-none transition-all"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                            <input
                                type="tel"
                                value={(contact.phonePrimary as string) || ''}
                                onChange={(e) => setNestedValue('contact', 'phonePrimary', e.target.value)}
                                placeholder="+91 12345 67890"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#01334c] focus:bg-white outline-none transition-all"
                            />
                        </div>
                    </div>
                );
            }

            default:
                return null;
        }
    };

    // ── Portal content ──────────────────────────────────────────────────────
    const overlayContent = (
        <>
            {/* 
                Single persistent spotlight element. 
            */}
            <div
                className="guided-highlight-ring"
                style={{
                    position: 'fixed',
                    top: highlightRect?.top ?? 0,
                    left: highlightRect?.left ?? 0,
                    width: highlightRect?.width ?? '100vw',
                    height: highlightRect?.height ?? '100vh',
                    borderRadius: highlightRect ? 14 : 0,
                    boxShadow: highlightRect
                        ? '0 0 0 9999px rgba(15, 23, 42, 0.4), 0 0 30px rgba(1, 51, 76, 0.15)'
                        : '0 0 0 0 rgba(15, 23, 42, 0.4)',
                    opacity: highlightVisible && highlightRect ? 1 : highlightRect ? 0.3 : 0.8,
                    zIndex: 9998,
                    pointerEvents: 'none',
                    transition: 'top 0.5s cubic-bezier(0.4,0,0.2,1), left 0.5s cubic-bezier(0.4,0,0.2,1), width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, border-radius 0.4s ease',
                }}
            />

            {/* Click blocker */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    pointerEvents: 'all',
                    background: 'transparent',
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 
                   Full Size Floating Card (Center Aligned, 900px) 
                   Added key to re-trigger animation on section change
                */}
                <div
                    key={cardKey}
                    className={`bg-white rounded-3xl shadow-2xl shadow-slate-900/40 border border-slate-200 overflow-hidden w-full max-w-[900px] h-[600px] flex flex-col mx-4 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* Header */}
                    <div
                        className="bg-gradient-to-r from-[#01334c] to-[#024466] px-8 py-5 flex-shrink-0 flex items-center justify-between cursor-move select-none"
                        onMouseDown={handleMouseDown}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                <Linkedin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight">{section.label}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-white/60 font-medium">Step {currentStep + 1} of {totalSteps}</span>
                                    <div className="flex items-center gap-1">
                                        {REVIEW_SECTIONS.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-1.5 h-1.5 rounded-full ${i === currentStep ? 'bg-white' : 'bg-white/20'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSkipAll}
                            className="text-xs text-white/50 hover:text-white font-medium transition-colors flex items-center gap-1"
                        >
                            <SkipForward className="w-3.5 h-3.5" />
                            Skip All
                        </button>
                    </div>

                    {/* Main Content Areas (Grid) */}
                    <div className="flex-1 flex overflow-hidden">

                        {/* LEFT COLUMN: Guidance & Context (40%) */}
                        <div className="w-[40%] bg-slate-50/80 border-r border-slate-100 p-8 overflow-y-auto">
                            <div className="sticky top-0 space-y-6">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200 mb-3">
                                        <Sparkles className="w-3 h-3" />
                                        Expert Guidance
                                    </span>
                                    <p className="text-slate-700 font-medium leading-relaxed">
                                        {section.description}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">What goes here?</h4>
                                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                        <p className="text-sm text-slate-600 leading-relaxed mb-4">{section.guidance}</p>

                                        <div className="space-y-2">
                                            {section.tips.map((tip, i) => (
                                                <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                                                    <span>{tip}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {section.examples && section.examples.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Great Examples</h4>
                                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2">
                                            {section.examples.map((ex, i) => (
                                                <p key={i} className="text-xs text-emerald-800/80 italic border-l-2 border-emerald-300 pl-3 py-0.5">
                                                    "{ex}"
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Edit & Enhance (60%) */}
                        <div className="flex-1 bg-white p-8 overflow-y-auto relative flex flex-col">

                            {/* AI Suggestion Overlay */}
                            {aiSuggestion && (
                                <div className="mb-6 bg-violet-50 border border-violet-100 rounded-2xl p-5 animate-fade-in-up shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-violet-900">AI Enhancement Ready</h4>
                                            <p className="text-xs text-violet-600">Review the suggested improvements below</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4 bg-white/60 rounded-xl p-3 max-h-48 overflow-y-auto custom-scrollbar border border-violet-100/50">
                                        {Object.entries(aiSuggestion).map(([key, value]) => (
                                            <div key={key} className="text-xs text-slate-700">
                                                <span className="font-bold text-violet-700 uppercase tracking-wider text-[10px] mr-2">{key}:</span>
                                                <span className="leading-relaxed">{typeof value === 'string' ? value : Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                onMerge(aiSuggestion);
                                                setAiSuggestion(null);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 active:scale-95"
                                        >
                                            <Check className="w-3.5 h-3.5" /> Accept & Use
                                        </button>
                                        <button
                                            onClick={() => setAiSuggestion(null)}
                                            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
                                        >
                                            Discard
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Main Input Fields */}
                            <div className="flex-1">
                                {renderEditFields()}
                            </div>

                            {/* AI Action Area - Moved to Footer */}

                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex items-center justify-between flex-shrink-0 gap-4">
                        <button
                            onClick={goPrev}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors bg-white border border-slate-200 shadow-sm ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed opacity-50' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>

                        {/* Centered AI Controls */}
                        <div className="flex-1 flex items-center gap-2 max-w-lg">
                            <input
                                type="text"
                                value={userInstructions}
                                onChange={(e) => setUserInstructions(e.target.value)}
                                placeholder="AI Instructions..."
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 outline-none transition-all placeholder-slate-400"
                                onKeyDown={(e) => { if (e.key === 'Enter') handleEnhance(); }}
                            />
                            <button
                                onClick={handleEnhance}
                                disabled={isEnhancing}
                                className="px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-md shadow-violet-200 hover:shadow-violet-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-wait whitespace-nowrap"
                            >
                                {isEnhancing ? (
                                    <><Loader2 className="w-3 h-3 animate-spin" /> Enhancing</>
                                ) : (
                                    <><Sparkles className="w-3 h-3" /> Enhance</>
                                )}
                            </button>
                        </div>

                        <button
                            onClick={goNext}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#01334c] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#01334c]/20 hover:bg-[#024466] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                        >
                            {currentStep === totalSteps - 1 ? (
                                <><Check className="w-4 h-4" /> Finish</>
                            ) : (
                                <>Next <ChevronRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );

    // ── Render via portal to document.body (avoids flex layout interference) ─
    if (!mounted) return null;
    return createPortal(overlayContent, document.body);
}
