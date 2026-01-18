import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import rockImg from '@/assets/stone.png';
import paperImg from '@/assets/paper.png';
import scissorsImg from '@/assets/scissor.png';

export const GameChoice = ({ choice, onClick, disabled, isSelected, isWinner, isLoser, className }) => {
  const images = {
    rock: rockImg,
    paper: paperImg,
    scissors: scissorsImg,
  };

  const glowColors = {
    rock: 'rgba(234, 88, 12, 0.6)', // Orange
    paper: 'rgba(56, 189, 248, 0.6)', // Blue
    scissors: 'rgba(34, 197, 94, 0.6)', // Green
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-500 group border-0',
        'glass-card hover:bg-white/10',
        disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:-translate-y-2',
        isSelected && 'ring-2 ring-primary bg-white/10 scale-105',
        isWinner && 'ring-4 ring-green-500 scale-110 z-10 animate-pulse-glow',
        isLoser && 'opacity-40 scale-95 blur-[1px]',
        className
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${glowColors[choice]} 0%, transparent 70%)`
        }}
      />

      <div className="relative z-10 p-6 flex flex-col items-center gap-4">
        <div className={cn(
          "relative w-32 h-32 transition-transform duration-500 drop-shadow-2xl",
          !disabled && "group-hover:scale-110 group-hover:rotate-6",
          isSelected && "scale-110 rotate-12",
          isWinner && "animate-bounce"
        )}>
          <img
            src={images[choice]}
            alt={choice}
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>

        <span className={cn(
          "text-xl font-bold uppercase tracking-wider",
          "text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400",
          isSelected && "text-primary from-primary to-primary/50"
        )}>
          {choice}
        </span>
      </div>
    </Card>
  );
};