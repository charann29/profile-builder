'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, CheckCheck, Clock } from 'lucide-react';

export default function ChatSimulation() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [messagesVisible, setMessagesVisible] = useState(0);

    // Continuous loop simulation
    useEffect(() => {
        let isMounted = true;

        const playSequence = async () => {
            while (isMounted) {
                // Reset chat
                setMessagesVisible(0);
                await new Promise(r => setTimeout(r, 1000));
                if (!isMounted) break;

                // Msg 1 - User Panic
                setMessagesVisible(1);
                await new Promise(r => setTimeout(r, 1500));
                if (!isMounted) break;

                // Typing Indicator 1
                setMessagesVisible(2);
                await new Promise(r => setTimeout(r, 1500));
                if (!isMounted) break;

                // Msg 2 - System Reply
                setMessagesVisible(3);
                await new Promise(r => setTimeout(r, 1500));
                if (!isMounted) break;

                // Typing Indicator 2
                setMessagesVisible(4);
                await new Promise(r => setTimeout(r, 1500));
                if (!isMounted) break;

                // Msg 3 - Cost
                setMessagesVisible(5);
                await new Promise(r => setTimeout(r, 2500));
                if (!isMounted) break;

                // Typing Indicator 3 (User typing)
                setMessagesVisible(6);
                await new Promise(r => setTimeout(r, 1500));
                if (!isMounted) break;

                // Msg 4 - User Reply
                setMessagesVisible(7);
                await new Promise(r => setTimeout(r, 2500));
                if (!isMounted) break;

                // Typing Indicator 4
                setMessagesVisible(8);
                await new Promise(r => setTimeout(r, 1500));
                if (!isMounted) break;

                // Msg 5 - System final
                setMessagesVisible(9);

                // Wait before restarting loop
                await new Promise(r => setTimeout(r, 5000));
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    playSequence();
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            isMounted = false;
            observer.disconnect();
        };
    }, []);

    // Reference to auto-scroll chat
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messagesVisible]);

    return (
        <section id="chat-simulation" ref={sectionRef} className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-600/[0.05] rounded-full blur-[150px]" />
                <div
                    className="absolute inset-0 opacity-[0.2]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #222 1.5px, transparent 1.5px)',
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-bold tracking-wider text-red-500 uppercase shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                        <Clock className="w-3.5 h-3.5 text-red-500" />
                        <span>Speed Is Everything</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                        Don't let hours of formatting <br /> <span className="text-red-500">kill your deal.</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                        Opportunities move fast. When a potential partner or client asks for your profile, they expect it immediately. We make sure you're ready in minutes, not days.
                    </p>
                </div>

                {/* Phone Mockup Animation */}
                <div className="flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-[340px] h-[650px] bg-black border-[8px] border-[#1A1A1A] rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(239,68,68,0.15)] overflow-hidden">

                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#1A1A1A] rounded-b-3xl z-20"></div>

                        {/* Chat Header */}
                        <div className="absolute top-0 w-full h-24 bg-[#111] border-b border-white/10 flex items-end px-6 pb-4 z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                                    <span className="text-xs font-bold text-white">JB</span>
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">James (Client)</div>
                                    <div className="text-red-500 text-xs font-medium">Online</div>
                                </div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div ref={chatContainerRef} className="absolute inset-0 pt-28 pb-20 px-4 bg-[#0A0A0A] flex flex-col gap-4 overflow-y-auto hidden-scrollbar scroll-smooth">

                            {/* Message 1 (Left - User Panic) */}
                            <div
                                className={`flex flex-col items-start transition-all duration-500 transform ${messagesVisible >= 1 ? 'translate-x-0 opacity-100 max-h-40' : '-translate-x-8 opacity-0 max-h-0 overflow-hidden'}`}
                            >
                                <div className="bg-[#1A1A1A] border border-white/5 text-gray-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                                    Hey I have got an offer and need to send my profile to the client ASAP! 😰
                                </div>
                                <span className="text-[10px] text-gray-600 mt-1 ml-1 font-medium">10:42 AM</span>
                            </div>

                            {/* Typing Indicator 1 */}
                            <div className={`transition-all duration-300 ${messagesVisible === 2 ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                <div className="flex items-center gap-1.5 bg-red-600/20 text-red-500 w-fit px-4 py-3 rounded-2xl rounded-tr-sm border border-red-500/20 self-end ml-auto">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>

                            {/* Message 2 (Right - Solution) */}
                            <div
                                className={`flex flex-col items-end transition-all duration-500 transform ${messagesVisible >= 3 ? 'translate-x-0 opacity-100 max-h-40' : 'translate-x-8 opacity-0 max-h-0 overflow-hidden'}`}
                            >
                                <div className="bg-red-600 border border-red-500 text-white text-sm px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-[0_4px_15px_rgba(220,38,38,0.3)]">
                                    Do not worry, it's just two minutes. It will not take hours. ⚡️
                                </div>
                            </div>

                            {/* Typing Indicator 2 */}
                            <div className={`transition-all duration-300 ${messagesVisible === 4 ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                <div className="flex items-center gap-1.5 bg-red-600/20 text-red-500 w-fit px-4 py-3 rounded-2xl rounded-tr-sm border border-red-500/20 self-end ml-auto mt-[-8px]">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>

                            {/* Message 3 (Right - Cost) */}
                            <div
                                className={`flex flex-col items-end transition-all duration-500 transform ${messagesVisible >= 5 ? 'translate-x-0 opacity-100 max-h-40' : 'translate-x-8 opacity-0 max-h-0 overflow-hidden'} ${messagesVisible >= 4 ? 'mt-[-8px]' : ''}`}
                            >
                                <div className="bg-red-600 border border-red-500 text-white text-sm px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-[0_4px_15px_rgba(220,38,38,0.3)]">
                                    It will cost us only Rs 99 for preparing the executive profile.
                                </div>
                                <div className="flex items-center gap-1 mt-1 mr-1">
                                    <span className="text-[10px] text-gray-500 font-medium">10:43 AM</span>
                                    <CheckCheck className="w-3 h-3 text-red-500" />
                                </div>
                            </div>

                            {/* Typing Indicator 3 (JB typing) */}
                            <div className={`transition-all duration-300 ${messagesVisible === 6 ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                <div className="flex items-center gap-1.5 bg-[#1A1A1A] w-fit px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 mr-auto">
                                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>

                            {/* Message 4 (Left) */}
                            <div
                                className={`flex flex-col items-start transition-all duration-500 transform ${messagesVisible >= 7 ? 'translate-x-0 opacity-100 max-h-40' : '-translate-x-8 opacity-0 max-h-0 overflow-hidden'}`}
                            >
                                <div className="bg-[#1A1A1A] border border-white/5 text-gray-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                                    That's amazing! Linking my LinkedIn now. 🚀
                                </div>
                            </div>

                            {/* Typing Indicator 4 */}
                            <div className={`transition-all duration-300 ${messagesVisible === 8 ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                <div className="flex items-center gap-1.5 bg-red-600/20 text-red-500 w-fit px-4 py-3 rounded-2xl rounded-tr-sm border border-red-500/20 self-end ml-auto mt-[-8px]">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>

                            {/* Message 5 (Right) */}
                            <div
                                className={`flex flex-col items-end transition-all duration-500 transform ${messagesVisible >= 9 ? 'translate-x-0 opacity-100 max-h-40' : 'translate-x-8 opacity-0 max-h-0 overflow-hidden'}`}
                            >
                                <div className="bg-red-600 border border-red-500 text-white text-sm px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-[0_4px_15px_rgba(220,38,38,0.3)]">
                                    Go close that deal! 🤝
                                </div>
                                <div className="flex items-center gap-1 mt-1 mr-1 pb-4">
                                    <span className="text-[10px] text-gray-500 font-medium">10:45 AM</span>
                                    <CheckCheck className="w-3 h-3 text-red-500" />
                                </div>
                            </div>

                        </div>

                        {/* Chat Input Footer */}
                        <div className="absolute bottom-0 w-full h-20 bg-[#0A0A0A]/80 backdrop-blur-md border-t border-white/10 flex items-center px-4 z-10 transition-transform">
                            <div className="w-full h-10 bg-[#1A1A1A] rounded-full border border-white/5 flex items-center px-4 justify-between">
                                <span className="text-gray-500 text-sm">Message...</span>
                                <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors">
                                    <Send className="w-3 h-3 text-white -ml-0.5" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
