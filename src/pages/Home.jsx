import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, Gamepad2, ArrowRight, Zap, Trophy, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0F172A] relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0F172A] to-[#0F172A]" />
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="relative z-10 max-w-5xl w-full space-y-16">

                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-in slide-in-from-top-4 fade-in duration-700">
                        <Gamepad2 className="w-4 h-4" />
                        <span>Game Hub v1.0</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
                        ARCADE<span className="text-blue-500">.AI</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
                        Experience next-gen classic games powered by adaptive artificial intelligence.
                    </p>
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">

                    {/* RPS Card */}
                    <div
                        className="group relative h-96 rounded-3xl bg-slate-900/40 border border-white/5 overflow-hidden backdrop-blur-sm transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
                        onClick={() => navigate('/rps')}
                    >
                        {/* Card Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <Brain className="w-8 h-8 text-white" />
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">RPS AI</h3>
                                    <p className="text-slate-400 font-medium">Rock Paper Scissors vs Adaptive Neural Net</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2 flex-wrap">
                                    <Badge icon={Zap} label="Fast Paced" />
                                    <Badge icon={Trophy} label="Ranked" />
                                </div>

                                <div className="flex items-center gap-2 text-blue-400 font-bold group-hover:text-white transition-colors">
                                    PLAY NOW <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon Card 1 -> 1024 */}
                    <div
                        className="group relative h-96 rounded-3xl bg-slate-900/40 border border-white/5 overflow-hidden backdrop-blur-sm transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 cursor-pointer"
                        onClick={() => navigate('/1024')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <div className="grid grid-cols-2 gap-1 p-1">
                                        <div className="w-4 h-4 bg-white/30 rounded-sm" />
                                        <div className="w-4 h-4 bg-white/30 rounded-sm" />
                                        <div className="w-4 h-4 bg-white/30 rounded-sm" />
                                        <div className="w-4 h-4 bg-white rounded-sm" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">1024</h3>
                                    <p className="text-slate-400 font-medium">Join tiles to reach the ultimate number!</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2 flex-wrap">
                                    <Badge icon={Brain} label="Puzzle" />
                                    <Badge icon={Trophy} label="Strategy" />
                                </div>

                                <div className="flex items-center gap-2 text-yellow-400 font-bold group-hover:text-white transition-colors">
                                    PLAY NOW <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon Card 2 -> Semantris */}
                    <div
                        className="group relative h-96 rounded-3xl bg-slate-900/40 border border-white/5 overflow-hidden backdrop-blur-sm transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer"
                        onClick={() => navigate('/semantris')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Semantris</h3>
                                    <p className="text-slate-400 font-medium">Word association arcade.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2 flex-wrap">
                                    <Badge icon={Brain} label="AI" />
                                    <Badge icon={Zap} label="Speed" />
                                </div>

                                <div className="flex items-center gap-2 text-cyan-400 font-bold group-hover:text-white transition-colors">
                                    PLAY NOW <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const Badge = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-bold text-slate-300">
        <Icon className="w-3 h-3" />
        {label}
    </div>
);

const ComingSoonCard = ({ title, icon: Icon }) => (
    <div className="relative h-96 rounded-3xl bg-slate-900/20 border border-white/5 overflow-hidden backdrop-blur-sm grayscale opacity-60">
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shadow-lg">
                    <Icon className="w-8 h-8 text-slate-500" />
                </div>

                <div>
                    <h3 className="text-3xl font-bold text-slate-500 mb-2">{title}</h3>
                    <p className="text-slate-600 font-medium">Coming Soon</p>
                </div>
            </div>
            <div className="px-4 py-2 rounded-full border border-slate-700/50 self-start text-xs font-bold text-slate-600">
                IN DEVELOPMENT
            </div>
        </div>
    </div>
);
