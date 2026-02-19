'use client';

import React, { useState } from 'react';
import { Send, Sparkles, Loader2, Bot, FileText, User } from 'lucide-react';

interface AIChatPanelProps {
    onSendMessage: (message: string) => Promise<void>;
    isProcessing: boolean;
}

export default function AIChatPanel({ onSendMessage, isProcessing }: AIChatPanelProps) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: "Hi! I'm your AI design assistant. I can help you customize this template. Try asking me to change colors, add sections, or move things around!" }
    ]);

    const handleSend = async () => {
        if (!input.trim() || isProcessing) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        try {
            await onSendMessage(userMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: "Done! How's that look?" }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I ran into an issue making that change. Please try again." }]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Header - Matches Chat Page */}
            <div className="h-20 flex items-center px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#01334c] flex items-center justify-center shadow-lg shadow-[#01334c]/20 ring-4 ring-[#01334c]/5">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-[#01334c] tracking-tight">ProfileArchitect</h2>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                            Design Assistant
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div
                            className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center shadow-md ${msg.role === 'user'
                                ? 'bg-[#01334c] ring-4 ring-[#01334c]/10'
                                : 'bg-slate-50 border border-slate-100'
                                }`}
                        >
                            {msg.role === 'user' ? (
                                <User className="w-4 h-4 text-white" />
                            ) : (
                                <Bot className="w-4 h-4 text-[#01334c]" />
                            )}
                        </div>

                        {/* Bubble */}
                        <div
                            className={`max-w-[280px] px-5 py-3.5 text-[14px] leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-[#01334c] text-white rounded-3xl rounded-tr-none shadow-[#01334c]/20'
                                : 'bg-slate-50 text-slate-600 border border-slate-100 rounded-3xl rounded-tl-none'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isProcessing && (
                    <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-[#01334c]" />
                        </div>
                        <div className="bg-slate-50 border border-slate-100 text-slate-500 rounded-3xl rounded-tl-none px-5 py-3.5 flex items-center gap-2 shadow-sm">
                            <Loader2 className="w-4 h-4 animate-spin text-[#01334c]" />
                            <span className="text-sm font-medium">Refining...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-5 border-t border-slate-100 bg-white">
                <div className="relative shadow-sm rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-[#01334c] focus-within:ring-1 focus-within:ring-[#01334c]/10 transition-all duration-200">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Make the header blue..."
                        className="w-full bg-transparent px-5 py-4 text-sm focus:outline-none text-slate-900 placeholder:text-slate-400 pr-12 rounded-2xl"
                        disabled={isProcessing}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isProcessing}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#01334c] text-white disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 opacity-100 hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#01334c]/10"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
