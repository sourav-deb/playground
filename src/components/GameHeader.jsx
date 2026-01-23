import React from 'react';
import { Trophy, Zap, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GameHeader = ({ playerScore, botScore, gamesPlayed, className }) => {
  return (
    <div className={cn("w-full space-y-8", className)}>
      {/* Title Section */}
      <div className="text-center space-y-4 relative">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />
        <h1 className="relative text-4xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-sm">
          RPS <span className="text-white/20">ARENA</span>
        </h1>
        <p className="text-sm md:text-xl text-blue-200/60 font-medium tracking-wide">
          MAN VS MACHINE
        </p>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
        <ScoreCard
          title="YOU"
          score={playerScore}
          icon={Trophy}
          color="text-blue-400"
          bg="bg-blue-500/10"
          border="border-blue-500/20"
        />
        <ScoreCard
          title="ROUND"
          score={gamesPlayed}
          icon={Zap}
          color="text-yellow-400"
          bg="bg-yellow-500/10"
          border="border-yellow-500/20"
        />
        <ScoreCard
          title="AI BOT"
          score={botScore}
          icon={Brain}
          color="text-pink-400"
          bg="bg-pink-500/10"
          border="border-pink-500/20"
        />
      </div>
    </div>
  );
};

const ScoreCard = ({ title, score, icon: Icon, color, bg, border }) => (
  <div className={cn(
    "glass-panel rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center gap-2",
    "transform transition-all duration-300 hover:scale-105 hover:bg-white/10",
    border
  )}>
    <div className={cn("p-3 rounded-xl mb-2", bg)}>
      <Icon className={cn("w-6 h-6 md:w-8 md:h-8", color)} />
    </div>
    <span className="text-xs md:text-sm font-bold tracking-widest text-slate-400">
      {title}
    </span>
    <span className={cn("text-3xl md:text-5xl font-black tabular-nums", color)}>
      {score}
    </span>
  </div>
);