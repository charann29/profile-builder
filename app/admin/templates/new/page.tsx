'use client';

import React, { useState, useEffect } from 'react';
import EditorPreview from '@/app/components/editor/EditorPreview';
import { useProfileStore } from '@/app/lib/store';
import { Save, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewTemplatePage() {
    const router = useRouter();
    const { profileData } = useProfileStore();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        category: 'Simple',
        width: 794,
        height: 1123,
        html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; padding: 40px; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>{{fullName}}</h1>
    <p>{{tagline}}</p>
</body>
</html>`
    });

    // Auto-generate ID from name
    useEffect(() => {
        if (formData.name && !formData.id) {
            const generatedId = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            setFormData(prev => ({ ...prev, id: generatedId }));
        }
    }, [formData.name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    dimensions: { width: Number(formData.width), height: Number(formData.height) }
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create template');
            }

            setMessage({ type: 'success', text: 'Template created successfully! Redirecting...' });

            // Redirect after delay
            setTimeout(() => {
                router.push('/templates');
            }, 1500);

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
            {/* Sidebar / Form Area */}
            <div className="w-[400px] border-r border-slate-200 bg-white flex flex-col h-screen overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/templates" className="text-slate-400 hover:text-slate-600">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-[#01334c]">New Template</h1>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Create a new HTML template.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#01334c] focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Modern Resume"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">ID (Unique)</label>
                            <input
                                type="text"
                                required
                                value={formData.id}
                                onChange={e => setFormData({ ...formData, id: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            >
                                <option value="Simple">Simple</option>
                                <option value="Professional">Professional</option>
                                <option value="Creative">Creative</option>
                                <option value="Academic">Academic</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Width (px)</label>
                                <input
                                    type="number"
                                    value={formData.width}
                                    onChange={e => setFormData({ ...formData, width: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Height (px)</label>
                                <input
                                    type="number"
                                    value={formData.height}
                                    onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">HTML Content</label>
                            <textarea
                                value={formData.html}
                                onChange={e => setFormData({ ...formData, html: e.target.value })}
                                className="w-full h-64 px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs bg-slate-900 text-slate-100 focus:ring-2 focus:ring-[#01334c] outline-none"
                                spellCheck={false}
                            />
                            <p className="text-xs text-slate-500 mt-1">Use Handlebars syntax: {`{{fullName}}`}</p>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg flex items-start gap-2 text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
                            {message.text}
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-200 flex gap-3">
                        <Link href="/templates" className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 text-center">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-[#01334c] text-white rounded-lg font-medium hover:bg-[#024466] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Template'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Live Preview Area */}
            <div className="flex-1 bg-slate-100 flex flex-col overflow-hidden relative">
                <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-500 border border-slate-200">
                    Live Preview
                </div>
                <EditorPreview
                    html={formData.html}
                    data={{
                        ...profileData,
                        fullName: profileData.fullName || 'John Doe',
                        tagline: profileData.tagline || 'Software Engineer',
                    }}
                    onHtmlChange={(newHtml) => setFormData(prev => ({ ...prev, html: newHtml }))}
                    width={Number(formData.width)}
                    height={Number(formData.height)}
                />
            </div>
        </div>
    );
}
