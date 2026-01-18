import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Zap, Flame, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GameModeSelection = ({ onSelectMode }) => {
  const modes = [
    {
      moves: 20,
      label: 'Quick Match',
      description: 'Fast-paced warmup',
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-400',
      border: 'hover:border-cyan-400/50',
      shadow: 'hover:shadow-cyan-500/20'
    },
    {
      moves: 50,
      label: 'Standard Battle',
      description: 'Pattern recognition test',
      icon: Trophy,
      gradient: 'from-purple-500 to-pink-500',
      border: 'hover:border-purple-400/50',
      shadow: 'hover:shadow-purple-500/20'
    },
    {
      moves: 100,
      label: 'Epic Challenge',
      description: 'Ultimate endurance test',
      icon: Flame,
      gradient: 'from-orange-500 to-red-500',
      border: 'hover:border-orange-400/50',
      shadow: 'hover:shadow-orange-500/20'
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 relative">
        <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />
        <h1 className="relative text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 drop-shadow-2xl">
          RPS <span className="text-blue-500">AI</span>
        </h1>
        <p className="relative text-xl md:text-2xl text-slate-400 font-medium tracking-wide max-w-2xl mx-auto">
          Challenge an <span className="text-blue-400 font-bold">Adaptive AI</span> that learns from your moves.
          Can you outsmart the machine?
        </p>
      </div>

      {/* Mode Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl relative z-10">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.moves}
              onClick={() => onSelectMode(mode.moves)}
              className={cn(
                "group relative overflow-hidden rounded-3xl text-left bg-slate-900/40 backdrop-blur-md border border-white/5",
                "transition-all duration-500 hover:-translate-y-2",
                mode.border,
                mode.shadow,
                "hover:shadow-2xl"
              )}
            >
              <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br", mode.gradient)}
              />

              <div className="p-8 space-y-6">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                  "bg-gradient-to-br",
                  mode.gradient
                )}>
                  <Icon className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                    {mode.label}
                  </h3>
                  <p className="text-slate-400 font-medium">{mode.description}</p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                  <span className="text-3xl font-black text-white/90">
                    {mode.moves}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">
                    MOVES
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tech Specs */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-8">
        <TechSpec icon={Brain} label="Pattern Recognition" />
        <TechSpec icon={Zap} label="Real-time Adaptation" />
        <TechSpec icon={Trophy} label="Score Tracking" />
      </div>
    </div>
  );
};

const TechSpec = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
    <Icon className="w-5 h-5 text-blue-400" />
    <span className="text-sm font-bold text-slate-300 tracking-wide">{label}</span>
  </div>
);