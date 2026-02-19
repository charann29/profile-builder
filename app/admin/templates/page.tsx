'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Trash2, Edit, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminTemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        const { data, error } = await supabase
            .from('templates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching templates:', error);
        } else {
            setTemplates(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            // Call API to delete (because we might want to delete files too? 
            // Or just delete from DB since we are moving away from files).
            // Let's us DB directly for now if we don't care about files anymore, 
            // OR use API if we want to clean up. 
            // Since we migrated to DB-first, let's just delete from DB.
            // But wait, RLS might block client-side delete if not authenticated as admin.
            // So we should use an API route that uses Service Role Key.

            const res = await fetch(`/api/admin/templates?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setTemplates(prev => prev.filter(t => t.id !== id));
            } else {
                alert('Failed to delete template');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#01334c]">Templates Admin</h1>
                        <p className="text-slate-500">Manage your profile templates</p>
                    </div>
                    <Link href="/admin/templates/new" className="bg-[#01334c] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#024466] transition-colors">
                        <Plus className="w-4 h-4" />
                        Add New Template
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Dimensions</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {templates.map(template => (
                                <tr key={template.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#01334c]">{template.name}</td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{template.id}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                            {template.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {template.dimensions?.width} x {template.dimensions?.height}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/design/${template.id}`} target="_blank" className="p-2 text-slate-400 hover:text-[#01334c] hover:bg-slate-100 rounded-lg transition-colors" title="Preview">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/admin/templates/${template.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(template.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
