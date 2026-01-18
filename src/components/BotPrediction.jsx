import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BotPrediction = ({ prediction, confidence, moveHistory }) => {
  const predictionColors = {
    rock: 'from-orange-500 to-orange-600 shadow-orange-500/50',
    paper: 'from-blue-500 to-blue-600 shadow-blue-500/50',
    scissors: 'from-green-500 to-green-600 shadow-green-500/50',
  };

  const getRecentPattern = () => {
    if (moveHistory.length < 3) return 'Analyzing patterns...';
    const recent = moveHistory.slice(-3).map(m => m.charAt(0).toUpperCase()).join(' → ');
    return recent;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Brain className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Neural Net</h3>
          <p className="text-xs text-purple-300 font-medium uppercase tracking-wider">Prediction Engine</p>
        </div>
      </div>

      {/* Main Prediction Display */}
      <div className="relative group">
        <div className={cn(
          "absolute inset-0 blur-xl opacity-20 transition-all duration-500 group-hover:opacity-40",
          prediction ? "bg-purple-500" : "bg-slate-500"
        )} />

        <div className="relative glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-400">Predicted Move</span>
            {prediction && (
              <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                {confidence}% Confidence
              </Badge>
            )}
          </div>

          {prediction ? (
            <div className="text-center py-2">
              <div className={cn(
                "inline-block px-6 py-2 rounded-lg text-2xl font-black uppercase tracking-widest text-white shadow-lg bg-gradient-to-r",
                predictionColors[prediction]
              )}>
                {prediction}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500 font-mono text-sm">
              WAITING FOR INPUT...
            </div>
          )}

          {/* Confidence Bar */}
          <div className="space-y-2">
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Data */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-3">
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Detected Pattern</span>
        </div>
        <div className="font-mono text-sm text-white/80 bg-black/20 p-3 rounded-lg border border-white/5 text-center">
          {getRecentPattern()}
        </div>
      </div>
    </div>
  );
};