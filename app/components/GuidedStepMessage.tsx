'use client';

import React, { useState, useEffect } from 'react';
import {
    Check,
    ChevronRight,
    Plus,
    X,
    Trash2,
    Sparkles,
    ArrowRight,
    Edit3
} from 'lucide-react';
import { ProfileData } from '../lib/schema';

// ────────────────────────────────────────────────────────────────────────────────
// Section configuration
// ────────────────────────────────────────────────────────────────────────────────

interface ReviewSection {
    id: string;
    label: string;
    description: string;
    fields: (keyof ProfileData)[];
    guidance: string;
    tips: string[];
    icon: React.ReactNode;
}

export const REVIEW_SECTIONS: ReviewSection[] = [
    {
        id: 'identity',
        label: 'Identity',
        description: "Let's set your professional foundation.",
        fields: ['fullName', 'professionalTitle', 'tagline', 'profilePhoto', 'topHighlights'],
        guidance: 'Your name and title are the first things people see.',
        tips: ['Use a clear professional title', 'Highlights should be punchy', 'Tagline defines your value'],
        icon: <div className="text-blue-500">🆔</div>
    },
    {
        id: 'story',
        label: 'My Story',
        description: "What's your unique journey?",
        fields: ['aboutMe', 'personalStory30'],
        guidance: 'A compelling story sets you apart.',
        tips: ['Keep the elevator pitch under 30 words', 'Focus on your "why"'],
        icon: <div className="text-amber-500">📖</div>
    },
    {
        id: 'expertise',
        label: 'Expertise',
        description: "What are your core powers?",
        fields: ['expertiseAreas', 'expertiseDescriptions'],
        guidance: 'List up to 5 key areas you excel in.',
        tips: ['Be specific with skills', 'Add brief context for each area'],
        icon: <div className="text-emerald-500">⚡</div>
    },
    {
        id: 'career',
        label: 'Career & Brands',
        description: "Where have you made an impact?",
        fields: ['positions'],
        guidance: 'Focus on recent and relevant experience.',
        tips: ['Highlight your role and company', 'Keep dates accurate'],
        icon: <div className="text-purple-500">💼</div>
    },
    {
        id: 'impact',
        label: 'Impact Created',
        description: "What's your track record of success?",
        fields: ['impactHeadline', 'impactStory', 'professionSpecificImpact'],
        guidance: 'Quantify your achievements with data and results.',
        tips: ['Use metrics and percentages', 'Focus on outcomes'],
        icon: <div className="text-rose-500">🚀</div>
    },
    {
        id: 'awards',
        label: 'Awards & Recognition',
        description: "What honors have you received?",
        fields: ['awards', 'mediaFeatures'],
        guidance: 'Social proof builds trust and credibility.',
        tips: ['Include organization and year', 'Mention media features'],
        icon: <div className="text-yellow-500">🏆</div>
    },
    {
        id: 'links',
        label: 'Presence',
        description: "Where can people find you?",
        fields: ['socialLinks'],
        guidance: 'Connect your professional world.',
        tips: ['LinkedIn is essential', 'Ensure links works'],
        icon: <div className="text-sky-500">🔗</div>
    },
    {
        id: 'contact',
        label: 'Contact',
        description: "How should people reach you?",
        fields: ['contact'],
        guidance: 'Make it easy to get in touch.',
        tips: ['Double check your email', 'Phone number is optional but helpful'],
        icon: <div className="text-rose-500">📞</div>
    },
];

interface GuidedStepMessageProps {
    sectionId: string;
    profileData: Partial<ProfileData>;
    isActive: boolean;
    onUpdate: (data: Partial<ProfileData>) => void;
    onComplete: () => void;
}

export default function GuidedStepMessage({
    sectionId,
    profileData,
    isActive,
    onUpdate,
    onComplete,
}: GuidedStepMessageProps) {
    const section = REVIEW_SECTIONS.find(s => s.id === sectionId);
    const [localData, setLocalData] = useState<Partial<ProfileData>>({});
    const [isDirty, setIsDirty] = useState(false);

    // Initialize and sync local data from profile data
    useEffect(() => {
        if (isActive) {
            const initial: Partial<ProfileData> = {};
            section?.fields.forEach(field => {
                // @ts-ignore
                initial[field] = JSON.parse(JSON.stringify(profileData[field] || (field === 'socialLinks' || field === 'contact' ? {} : [])));
            });

            // Handle primitives explicitly if needed
            if (sectionId === 'identity') {
                initial.fullName = profileData.fullName;
                initial.professionalTitle = profileData.professionalTitle;
                initial.tagline = profileData.tagline;
                initial.profilePhoto = profileData.profilePhoto;
                initial.topHighlights = [...(profileData.topHighlights || [])];
            } else if (sectionId === 'story') {
                initial.aboutMe = profileData.aboutMe;
                initial.personalStory30 = profileData.personalStory30;
            }

            // Only update if data is effectively different to avoid cursor jumps on deep equal (simple check for now)
            // For now, we trust that profileData only changes when AI updates it or user saves previous steps.
            setLocalData(initial);
        }
    }, [isActive, sectionId, profileData, section]);

    if (!section) return <div className="p-4 text-red-500 bg-red-50 rounded-lg text-sm">Error: Section not found</div>;

    const handleSave = () => {
        onUpdate(localData);
        onComplete();
    };

    const updateLocal = (field: keyof ProfileData, value: any) => {
        setLocalData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const updateNested = (parent: keyof ProfileData, key: string, value: string) => {
        setLocalData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent] as any || {}),
                [key]: value
            }
        }));
        setIsDirty(true);
    };


    // ── Input Components ─────────────────────────────────────────────────────

    const ModernInput = ({ label, value, onChange, placeholder, type = "text" }: any) => (
        <div className="group">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1 transition-colors group-focus-within:text-[#01334c]">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    value={value || ''}
                    onChange={onChange}
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#01334c]/10 focus:border-[#01334c] focus:bg-white transition-all shadow-sm"
                    placeholder={placeholder}
                />
                {type === 'text' && value && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-[#01334c]/40">
                        <Edit3 size={12} />
                    </div>
                )}
            </div>
        </div>
    );

    const ModernTextarea = ({ label, value, onChange, placeholder, rows = 3 }: any) => (
        <div className="group">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1 transition-colors group-focus-within:text-[#01334c]">{label}</label>
            <textarea
                value={value || ''}
                onChange={onChange}
                rows={rows}
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#01334c]/10 focus:border-[#01334c] focus:bg-white transition-all shadow-sm resize-none"
                placeholder={placeholder}
            />
        </div>
    );

    const ModernSelect = ({ label, value, onChange, options }: any) => (
        <div className="group">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1 transition-colors group-focus-within:text-[#01334c]">{label}</label>
            <div className="relative">
                <select
                    value={value || ''}
                    onChange={onChange}
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#01334c]/10 focus:border-[#01334c] focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                >
                    <option value="" disabled>Select an option</option>
                    {options.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight className="rotate-90" size={14} />
                </div>
            </div>
        </div>
    );

    // ── Render Content ───────────────────────────────────────────────────────

    const renderFields = () => {
        switch (sectionId) {
            case 'identity':
                return (
                    <div className="space-y-4 animate-slide-in">
                        <ModernInput
                            label="Full Name"
                            value={localData.fullName}
                            onChange={(e: any) => updateLocal('fullName', e.target.value)}
                            placeholder="Your Name"
                        />
                        <ModernInput
                            label="Professional Title"
                            value={localData.professionalTitle}
                            onChange={(e: any) => updateLocal('professionalTitle', e.target.value)}
                            placeholder="e.g. Senior Product Designer"
                        />
                        <ModernInput
                            label="Tagline"
                            value={localData.tagline}
                            onChange={(e: any) => updateLocal('tagline', e.target.value)}
                            placeholder="e.g. Building digital products that matter"
                        />
                        <ModernInput
                            label="Profile Photo URL"
                            value={localData.profilePhoto}
                            onChange={(e: any) => updateLocal('profilePhoto', e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                        />
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Key Highlights</label>
                            {(localData.topHighlights || []).map((h, i) => (
                                <div key={i} className="flex gap-2 group">
                                    <input
                                        value={h}
                                        onChange={e => {
                                            const newH = [...(localData.topHighlights || [])];
                                            newH[i] = e.target.value;
                                            updateLocal('topHighlights', newH);
                                        }}
                                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#01334c] shadow-sm transition-all"
                                        placeholder="Add a highlight..."
                                    />
                                    <button
                                        onClick={() => {
                                            const newH = [...(localData.topHighlights || [])];
                                            newH.splice(i, 1);
                                            updateLocal('topHighlights', newH);
                                        }}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {(localData.topHighlights || []).length < 3 && (
                                <button
                                    onClick={() => updateLocal('topHighlights', [...(localData.topHighlights || []), ''])}
                                    className="text-xs text-[#01334c] font-semibold flex items-center gap-1.5 hover:bg-[#01334c]/5 px-3 py-2 rounded-lg transition-colors w-full justify-center border border-dashed border-[#01334c]/20"
                                >
                                    <Plus size={14} /> Add Highlight
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'story':
                return (
                    <div className="space-y-4 animate-slide-in">
                        <ModernSelect
                            label="Story Arc"
                            value={localData.storyType}
                            onChange={(e: any) => updateLocal('storyType', e.target.value)}
                            options={["Rise", "Pivot", "Impact", "Mission"]}
                        />
                        <ModernTextarea
                            label="About Me (Detailed)"
                            value={localData.aboutMe}
                            onChange={(e: any) => updateLocal('aboutMe', e.target.value)}
                            rows={5}
                            placeholder="Share your professional journey, passions, and goals..."
                        />
                        <ModernTextarea
                            label="Elevator Pitch (30 Words)"
                            value={localData.personalStory30}
                            onChange={(e: any) => updateLocal('personalStory30', e.target.value)}
                            rows={3}
                            placeholder="The short, punchy version for quick intros..."
                        />
                    </div>
                );

            case 'expertise':
                return (
                    <div className="space-y-3 animate-slide-in">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Core Competencies</label>
                        <div className="space-y-2">
                            {(localData.expertiseAreas || []).map((area, i) => (
                                <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm relative group hover:border-[#01334c]/30 transition-all">
                                    <button
                                        onClick={() => {
                                            const newA = [...(localData.expertiseAreas || [])];
                                            const newD = [...(localData.expertiseDescriptions || [])];
                                            newA.splice(i, 1);
                                            newD.splice(i, 1);
                                            updateLocal('expertiseAreas', newA);
                                            updateLocal('expertiseDescriptions', newD);
                                        }}
                                        className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                                    >
                                        <X size={12} />
                                    </button>
                                    <input
                                        value={area}
                                        onChange={e => {
                                            const newA = [...(localData.expertiseAreas || [])];
                                            newA[i] = e.target.value;
                                            updateLocal('expertiseAreas', newA);
                                        }}
                                        className="w-full font-bold text-[#01334c] border-b border-transparent focus:border-[#01334c]/20 outline-none text-sm mb-1 bg-transparent placeholder-slate-300"
                                        placeholder="Area Name"
                                    />
                                    <input
                                        value={(localData.expertiseDescriptions || [])[i] || ''}
                                        onChange={e => {
                                            const newD = [...(localData.expertiseDescriptions || [])];
                                            while (newD.length <= i) newD.push('');
                                            newD[i] = e.target.value;
                                            updateLocal('expertiseDescriptions', newD);
                                        }}
                                        className="w-full text-xs text-slate-500 border-b border-transparent focus:border-slate-200 outline-none bg-transparent placeholder-slate-300"
                                        placeholder="Brief description..."
                                    />
                                </div>
                            ))}
                            {(localData.expertiseAreas || []).length < 5 && (
                                <button
                                    onClick={() => {
                                        updateLocal('expertiseAreas', [...(localData.expertiseAreas || []), '']);
                                        updateLocal('expertiseDescriptions', [...(localData.expertiseDescriptions || []), '']);
                                    }}
                                    className="text-xs text-[#01334c] font-semibold flex items-center gap-1.5 hover:bg-[#01334c]/5 px-3 py-2 rounded-lg transition-colors w-full justify-center border border-dashed border-[#01334c]/20"
                                >
                                    <Plus size={14} /> Add Expertise
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'career':
                return (
                    <div className="space-y-3 animate-slide-in">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Experience</label>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            {(localData.positions || []).map((pos, i) => (
                                <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm relative group hover:shadow-md transition-all">
                                    <button
                                        onClick={() => {
                                            const newP = [...(localData.positions || [])];
                                            newP.splice(i, 1);
                                            updateLocal('positions', newP);
                                        }}
                                        className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                                    >
                                        <X size={12} />
                                    </button>
                                    <div className="grid grid-cols-1 gap-2">
                                        <input
                                            value={pos.title}
                                            onChange={e => {
                                                const newP = [...(localData.positions || [])];
                                                newP[i] = { ...newP[i], title: e.target.value };
                                                updateLocal('positions', newP);
                                            }}
                                            className="w-full text-sm font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 placeholder-slate-300"
                                            placeholder="Job Title"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                value={pos.company}
                                                onChange={e => {
                                                    const newP = [...(localData.positions || [])];
                                                    newP[i] = { ...newP[i], company: e.target.value };
                                                    updateLocal('positions', newP);
                                                }}
                                                className="w-full text-xs text-[#01334c] font-medium bg-slate-50 rounded px-2 py-1 border border-transparent focus:border-slate-200 focus:bg-white transition-colors placeholder-slate-400"
                                                placeholder="Company"
                                            />
                                            <input
                                                value={pos.duration || ''}
                                                onChange={e => {
                                                    const newP = [...(localData.positions || [])];
                                                    newP[i] = { ...newP[i], duration: e.target.value };
                                                    updateLocal('positions', newP);
                                                }}
                                                className="w-24 text-xs text-slate-500 bg-slate-50 rounded px-2 py-1 border border-transparent focus:border-slate-200 focus:bg-white transition-colors placeholder-slate-400 text-center"
                                                placeholder="Duration"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => updateLocal('positions', [...(localData.positions || []), { title: '', company: '', duration: '' }])}
                                className="text-xs text-[#01334c] font-semibold flex items-center gap-1.5 hover:bg-[#01334c]/5 px-3 py-2 rounded-lg transition-colors w-full justify-center border border-dashed border-[#01334c]/20"
                            >
                                <Plus size={14} /> Add Role
                            </button>
                        </div>
                    </div>
                );
            case 'links':
                return (
                    <div className="space-y-3 animate-slide-in">
                        {['linkedin', 'website', 'twitter', 'instagram'].map(key => (
                            <ModernInput
                                key={key}
                                label={key}
                                value={(localData.socialLinks as any)?.[key]}
                                onChange={(e: any) => updateNested('socialLinks', key, e.target.value)}
                                placeholder={`https://${key}.com/...`}
                            />
                        ))}
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-4 animate-slide-in">
                        <ModernInput
                            label="Email Address"
                            value={(localData.contact as any)?.emailPrimary}
                            onChange={(e: any) => updateNested('contact', 'emailPrimary', e.target.value)}
                            type="email"
                            placeholder="you@example.com"
                        />
                        <ModernInput
                            label="Phone Number"
                            value={(localData.contact as any)?.phonePrimary}
                            onChange={(e: any) => updateNested('contact', 'phonePrimary', e.target.value)}
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                );

            case 'impact':
                return (
                    <div className="space-y-4 animate-slide-in">
                        <ModernInput
                            label="Impact Headline"
                            value={localData.impactHeadline}
                            onChange={(e: any) => updateLocal('impactHeadline', e.target.value)}
                            placeholder="e.g. Generated $2M in new revenue"
                        />
                        <ModernTextarea
                            label="Impact Story"
                            value={localData.impactStory}
                            onChange={(e: any) => updateLocal('impactStory', e.target.value)}
                            rows={5}
                            placeholder="Describe your achievements and how you reached them..."
                        />
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Metrics</label>
                            {Object.entries(localData.professionSpecificImpact || {}).map(([key, val], i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500">{key}</div>
                                    <input
                                        value={val as string}
                                        onChange={e => {
                                            const current = { ...(localData.professionSpecificImpact || {}) };
                                            current[key] = e.target.value;
                                            updateLocal('professionSpecificImpact', current);
                                        }}
                                        className="flex-[2] bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#01334c] shadow-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'awards':
                return (
                    <div className="space-y-4 animate-slide-in">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Awards</label>
                            {(localData.awards || []).map((a, i) => (
                                <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm relative group">
                                    <button
                                        onClick={() => {
                                            const newA = [...(localData.awards || [])];
                                            newA.splice(i, 1);
                                            updateLocal('awards', newA);
                                        }}
                                        className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1"
                                    >
                                        <X size={12} />
                                    </button>
                                    <input
                                        value={a.title}
                                        onChange={e => {
                                            const newA = [...(localData.awards || [])];
                                            newA[i] = { ...newA[i], title: e.target.value };
                                            updateLocal('awards', newA);
                                        }}
                                        className="w-full font-bold text-slate-800 text-sm mb-1 outline-none"
                                        placeholder="Award Title"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            value={a.organization || ''}
                                            onChange={e => {
                                                const newA = [...(localData.awards || [])];
                                                newA[i] = { ...newA[i], organization: e.target.value };
                                                updateLocal('awards', newA);
                                            }}
                                            className="flex-1 text-xs text-slate-500 outline-none"
                                            placeholder="Organization"
                                        />
                                        <input
                                            value={a.year || ''}
                                            onChange={e => {
                                                const newA = [...(localData.awards || [])];
                                                newA[i] = { ...newA[i], year: e.target.value };
                                                updateLocal('awards', newA);
                                            }}
                                            className="w-16 text-xs text-slate-400 outline-none text-right"
                                            placeholder="Year"
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => updateLocal('awards', [...(localData.awards || []), { title: '', organization: '', year: '' }])}
                                className="text-xs text-[#01334c] font-semibold py-2 rounded-lg w-full border border-dashed border-[#01334c]/20"
                            >
                                + Add Award
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Media Features</label>
                            {(localData.mediaFeatures || []).map((m, i) => (
                                <div key={i} className="flex gap-2 group">
                                    <input
                                        value={m.name}
                                        onChange={e => {
                                            const newM = [...(localData.mediaFeatures || [])];
                                            newM[i] = { ...newM[i], name: e.target.value };
                                            updateLocal('mediaFeatures', newM);
                                        }}
                                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#01334c]"
                                        placeholder="Name"
                                    />
                                    <button
                                        onClick={() => {
                                            const newM = [...(localData.mediaFeatures || [])];
                                            newM.splice(i, 1);
                                            updateLocal('mediaFeatures', newM);
                                        }}
                                        className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => updateLocal('mediaFeatures', [...(localData.mediaFeatures || []), { name: '', url: '' }])}
                                className="text-xs text-[#01334c] font-semibold py-2 rounded-lg w-full border border-dashed border-[#01334c]/20"
                            >
                                + Add Media
                            </button>
                        </div>
                    </div>
                );

            default:
                return <div className="text-slate-400 italic text-center text-sm py-4">No fields to edit for this section.</div>;
        }
    };

    if (!isActive) {
        return (
            <div className="group w-full max-w-sm bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 shadow-sm opacity-60 hover:opacity-100 transition-all cursor-default select-none">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                        <Check size={14} strokeWidth={3} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">{section.label}</h3>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Completed</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-xl border-2 border-[#01334c]/10 rounded-3xl shadow-2xl shadow-[#01334c]/20 ring-4 ring-white/50 animate-pop-in overflow-hidden transform hover:scale-[1.01] transition-transform duration-500 relative">
            {/* Wizard Badge */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#01334c] via-[#0284c7] to-[#01334c]"></div>

            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-b from-slate-50 to-white/50 border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-2 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#01334c]/5 text-[#01334c] text-[9px] font-black uppercase tracking-widest border border-[#01334c]/10">
                        <Sparkles size={10} className="text-[#01334c]" />
                        Profile Wizard
                    </span>
                </div>

                <div className="flex items-start gap-5 mt-2">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-100 flex items-center justify-center text-2xl shrink-0">
                        {section.icon}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{section.label}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">{section.description}</p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 pb-2">
                {renderFields()}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                <p className="text-[10px] text-slate-400 font-medium italic truncate max-w-[50%]">
                    💡 {section.tips[0]}
                </p>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#01334c] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#01334c]/20 hover:bg-[#024466] hover:scale-105 active:scale-95 transition-all group"
                >
                    <span>Next</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
}

