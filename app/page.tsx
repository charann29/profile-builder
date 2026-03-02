import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X, Building2, CheckCircle, Sparkles } from 'lucide-react';
import { agentsData } from './_data/agents';
import MasterNavbar from './_components/MasterNavbar';
import Footer from './home/_components/Footer';

export default function MasterLandingPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-red-600 selection:text-white font-inter">
            <MasterNavbar />

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-red-600/[0.15] to-transparent blur-[120px]" />
                <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-red-800/[0.1] to-transparent blur-[100px]" />
                <div
                    className="absolute inset-0 opacity-[0.2]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 lg:pt-48 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 text-center">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(239,68,68,0.1)] mb-8 mx-auto">
                        <Building2 className="w-4 h-4" />
                        <span>World's First Human-less AI Financial Consultant Firm</span>
                    </div>

                    <h1 className="text-[3rem] sm:text-[4.5rem] lg:text-[5.5rem] font-black leading-[1.1] tracking-tight text-white mb-6">
                        Your Complete <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                            Financial AI Suite
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
                        From startup incorporation and business modeling to proposal building and tax filing. One intelligent umbrella for all your financial and operational needs.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="#agents"
                            className="group px-8 py-4 rounded-xl text-[16px] font-bold bg-white text-black hover:bg-gray-200 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            Explore All AI Agents
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Agents Grid Placement */}
            <section id="agents" className="relative z-10 py-24 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Meet Your <span className="text-red-500">AI Partners</span></h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Purpose-built agents designed to handle specific business and financial operations instantly.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agentsData.map((agent) => (
                            <div key={agent.id} className="group relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:bg-[#111] hover:border-red-500/50 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(239,68,68,0.2)]">

                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-red-500/10 rounded-xl group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                                        {agent.icon}
                                    </div>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-wider text-gray-400 uppercase">
                                        {agent.badge}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">{agent.title}</h3>
                                <p className="text-gray-400 mb-6 flex-grow">{agent.description}</p>

                                <div className="space-y-2 mb-8 mt-auto">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Key Capabilities</p>
                                    {agentsData.find(a => a.id === agent.id)?.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                            <CheckCircle className="w-4 h-4 text-red-500/70" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <Link href={`#${agent.id}-demo`} className="pt-6 border-t border-white/10 flex items-center justify-between text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                                    See it in action
                                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Agent Showcases */}
            <section className="relative z-10 py-24">
                <div className="max-w-7xl mx-auto px-6 space-y-32">
                    {agentsData.map((agent, index) => (
                        <div key={agent.id} id={`${agent.id}-demo`} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}>

                            {/* Left/Right Text Content */}
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold tracking-wide">
                                    {agent.icon}
                                    {agent.title}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                    See how the <span className="text-red-500">{agent.title.split(' ')[0]}</span> agent works in real-time.
                                </h3>
                                <p className="text-lg text-gray-400">
                                    {agent.description}
                                </p>

                                {agent.link !== "#" ? (
                                    <Link href={agent.link} target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                                        Try It Now Live
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all cursor-not-allowed border border-white/10">
                                        Coming Soon
                                    </button>
                                )}
                            </div>

                            {/* Right/Left Interactive Chat Simulation */}
                            <div className="flex-1 w-full max-w-lg">
                                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                    {/* Window Header */}
                                    <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                        </div>
                                        <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 text-red-500" /> {agent.title} Terminal
                                        </div>
                                    </div>

                                    {/* Chat Body */}
                                    <div className="p-6 space-y-4 min-h-[250px] bg-[url('/grid-pattern.svg')] bg-center flex flex-col justify-center">
                                        {/* Split the example text by newline to simulate user/AI conversation */}
                                        {agent.example.split('\n').map((line, i) => {
                                            const isUser = line.toLowerCase().startsWith('user:') || i === 0 && !line.includes(':');
                                            const text = line.replace(/^(User|AI):\s*/i, '');

                                            if (!text) return null;

                                            return (
                                                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                                                        ? 'bg-white/10 text-white rounded-br-none border border-white/5'
                                                        : 'bg-red-950/40 text-red-100 rounded-bl-none border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                                        }`}>
                                                        {text}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Input Footer */}
                                    <div className="p-4 border-t border-white/10 bg-black/40">
                                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                                            <div className="flex-1 text-sm text-gray-500 font-mono">Type your request...</div>
                                            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center opacity-50">
                                                <ArrowRight className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
>>>>>>> a254bc2 (feat: adding new master landing page)
}
