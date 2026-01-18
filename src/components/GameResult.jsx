import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import rockImg from '@/assets/stone.png';
import paperImg from '@/assets/paper.png';
import scissorsImg from '@/assets/scissor.png';

export const GameResult = ({ result, playerChoice, botChoice, gameState }) => {
  const [show, setShow] = useState(false);
  const [revealBot, setRevealBot] = useState(false);

  useEffect(() => {
    if (gameState === 'waiting') {
      setRevealBot(false);
      return;
    }

    setShow(true);
    // Delay bot reveal
    const timer = setTimeout(() => {
      setRevealBot(true);
    }, 1000); // 1 second delay
    return () => {
      setShow(false);
      clearTimeout(timer);
    };
  }, [result, gameState]);

  if (!result && gameState !== 'waiting') return null;

  const images = {
    rock: rockImg,
    paper: paperImg,
    scissors: scissorsImg,
  };

  const resultConfig = {
    win: {
      title: "VICTORY",
      subtitle: "You crushed the machine!",
      color: "text-green-400",
      gradient: "from-green-400 to-emerald-600",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      icon: Trophy,
    },
    lose: {
      title: "DEFEAT",
      subtitle: "The AI outsmarted you...",
      color: "text-red-400",
      gradient: "from-red-400 to-rose-600",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: Zap,
    },
    tie: {
      title: "DRAW",
      subtitle: "Great minds think alike",
      color: "text-yellow-400",
      gradient: "from-yellow-400 to-amber-600",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      icon: Sparkles,
    },
    waiting: {
      title: "READY",
      subtitle: "Choose your weapon",
      color: "text-slate-400",
      gradient: "from-slate-400 to-slate-600",
      bg: "bg-slate-500/10",
      border: "border-slate-500/10",
      icon: Sparkles, // Or any default icon
    }
  };

  const currentStatus = (gameState === 'waiting' || !result) ? 'waiting' : result;
  const config = resultConfig[currentStatus];
  const Icon = config.icon;

  return (
    <div className={cn(
      "glass-card p-8 md:p-12 rounded-3xl text-center space-y-8 animate-in fade-in zoom-in duration-300 h-full flex flex-col justify-center",
      (gameState === 'result' && revealBot) ? config.border : "border-white/5"
    )}>
      {/* Result Header */}
      <div className={cn("space-y-2 transition-all duration-500", (gameState === 'waiting') ? "opacity-50" : "opacity-100")}>
        <div className={cn(
          "inline-flex p-4 rounded-full mb-4",
          gameState === 'result' && "animate-bounce",
          config.bg
        )}>
          <Icon className={cn("w-12 h-12", config.color)} />
        </div>
        <h2 className={cn(
          "text-5xl md:text-7xl font-black tracking-tighter uppercase",
          "text-transparent bg-clip-text bg-gradient-to-r",
          config.gradient
        )}>
          {gameState === 'result' && revealBot ? config.title : (gameState === 'waiting' ? 'READY' : '...')}
        </h2>
        <p className="text-xl text-slate-400 font-medium tracking-wide">
          {config.subtitle}
        </p>
      </div>

      {/* Versus Display */}
      <div className="flex items-center justify-center gap-4 md:gap-12 py-4">
        {/* Player */}
        <div className="space-y-3">
          <div className={cn(
            "w-24 h-24 md:w-32 md:h-32 rounded-full glass-panel p-4 transition-all duration-500",
            (gameState === 'result' && result === 'win' && revealBot) ? "ring-4 ring-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]" : "opacity-80"
          )}>
            {playerChoice ? (
              <img src={images[playerChoice]} alt="You" className="w-full h-full object-contain animate-in zoom-in" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">?</div>
            )}
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">You</p>
        </div>

        {/* VS Badge */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20" />
          <span className="relative text-2xl md:text-4xl font-black italic text-slate-700">VS</span>
        </div>

        {/* Bot */}
        <div className="space-y-3">
          <div className={cn(
            "w-24 h-24 md:w-32 md:h-32 rounded-full glass-panel p-4 flex items-center justify-center transition-all duration-500",
            (gameState === 'result' && revealBot)
              ? (result === 'lose' ? "ring-4 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]" : "opacity-80")
              : "bg-slate-800/50"
          )}>
            {revealBot && botChoice ? (
              <img src={images[botChoice]} alt="Bot" className="w-full h-full object-contain animate-in zoom-in duration-300" />
            ) : (
              <span className="text-4xl opacity-50">🤖</span>
            )}
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Bot</p>
        </div>
      </div>
    </div>
  );
};