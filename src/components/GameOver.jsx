import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Home, RotateCcw, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GameOver = ({ playerScore, botScore, totalMoves, onPlayAgain, onBackToMenu }) => {
  const isWinner = playerScore > botScore;
  const isTie = playerScore === botScore;

  const winRate = totalMoves > 0 ? Math.round((playerScore / totalMoves) * 100) : 0;

  return (
    <div className="relative w-full max-w-4xl p-8 animate-in fade-in zoom-in duration-500">
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 blur-[100px] opacity-30 rounded-full",
        isWinner ? "bg-green-500" : isTie ? "bg-yellow-500" : "bg-red-500"
      )} />

      <div className="relative glass-card p-12 rounded-3xl border-2 border-white/10 text-center space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center animate-bounce shadow-2xl",
              isWinner ? "bg-green-500 text-white" : isTie ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
            )}>
              <Trophy className="w-12 h-12" />
            </div>
          </div>
          <h1 className={cn(
            "text-6xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r",
            isWinner ? "from-green-400 to-emerald-600" : isTie ? "from-yellow-400 to-amber-600" : "from-red-400 to-rose-600"
          )}>
            {isWinner ? "Victory!" : isTie ? "Draw!" : "Defeat"}
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            {isWinner ? "You conquered the AI!" : isTie ? "A perfect match of minds." : "The machine prevails this time."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          <StatCard
            label="Your Score"
            value={playerScore}
            color="text-green-400"
            bg="bg-green-500/10"
            border="border-green-500/20"
          />
          <StatCard
            label="Win Rate"
            value={`${winRate}%`}
            icon={TrendingUp}
            color="text-blue-400"
            bg="bg-blue-500/10"
            border="border-blue-500/20"
          />
          <StatCard
            label="Bot Score"
            value={botScore}
            color="text-red-400"
            bg="bg-red-500/10"
            border="border-red-500/20"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={onPlayAgain}
            size="lg"
            className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          <Button
            onClick={onBackToMenu}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl border-2 hover:bg-white/10"
          >
            <Home className="w-5 h-5 mr-2" />
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, bg, border }) => (
  <div className={cn(
    "glass-panel p-6 rounded-2xl space-y-2 hover:bg-white/5 transition-colors",
    border
  )}>
    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </div>
    <div className={cn("text-4xl lg:text-5xl font-black", color)}>
      {value}
    </div>
  </div>
);