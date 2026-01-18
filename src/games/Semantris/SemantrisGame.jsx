import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Home, Zap, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRandomWord, getSimilarity } from './semanticData';
import { Toaster, toast } from 'sonner';

const BOARD_WIDTH = 100; // Percent
const MAX_WORDS = 10;
const GRAVITY_SPEED_INITIAL = 3000;
const GRAVITY_SPEED_MIN = 1000;

export const SemantrisGame = () => {
    const navigate = useNavigate();
    const [words, setWords] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameState, setGameState] = useState('playing'); // playing, gameOver
    const [lastMatchedId, setLastMatchedId] = useState(null);

    const gameLoopRef = useRef();
    const inputRef = useRef(null);

    // Initial Spawn
    useEffect(() => {
        spawnWord();
        spawnWord();
        spawnWord();
    }, []);

    // Focus input constantly
    useEffect(() => {
        if (gameState === 'playing') {
            inputRef.current?.focus();
        }
    }, [gameState, words]);

    // Game Loop (Gravity and Spawning)
    useEffect(() => {
        if (gameState !== 'playing') return;

        const loop = setInterval(() => {
            // Move words down (conceptually? Or just spawn new ones pushing old ones?)
            // Arcade style: Words stack up.
            // Let's implement: New word appears at top, pushing everything else down?
            // Or new word appears at top and falls? 
            // Tetris style: Words are blocks. New blocks fall.
            // Simplified Arcade: List of words. New word added to list. List is displayed vertically.
            // If list length > MAX, Game Over.
            setWords(prev => {
                if (prev.length >= MAX_WORDS) {
                    setGameState('gameOver');
                    return prev;
                }
                return [...prev, createWord()];
            });
        }, Math.max(GRAVITY_SPEED_MIN, GRAVITY_SPEED_INITIAL - (level * 200)));

        gameLoopRef.current = loop;
        return () => clearInterval(loop);
    }, [gameState, level]);

    const createWord = () => {
        const { text, category } = getRandomWord();
        return {
            id: Math.random().toString(36).substr(2, 9),
            text,
            category,
            isMatched: false,
        };
    };

    const spawnWord = () => {
        setWords(prev => [...prev, createWord()]);
    };

    const handleInput = (e) => {
        if (e.key === 'Enter') {
            processInput();
        }
    };

    const processInput = () => {
        if (!inputValue.trim()) return;

        // Find best match
        let bestMatch = null;
        let bestScore = -1;

        words.forEach(word => {
            const similarity = getSimilarity(inputValue, word.text, word.category);
            if (similarity > bestScore) {
                bestScore = similarity;
                bestMatch = word;
            }
        });

        // Threshold for a match
        if (bestMatch && bestScore > 50) {
            triggerMatch(bestMatch, bestScore);
            setInputValue('');
        } else {
            // Feedback for no match?
            toast.error("No association found!", { duration: 1000 });
            setInputValue(''); // Clear anyway to keep flow fast
        }
    };

    const triggerMatch = (word, similarityScore) => {
        // Visual flair
        setLastMatchedId(word.id);

        // Remove word after short delay for animation
        setWords(prev => prev.map(w => w.id === word.id ? { ...w, isMatched: true } : w));

        setTimeout(() => {
            setWords(prev => prev.filter(w => w.id !== word.id));
            setScore(prev => prev + (similarityScore * level));

            // Level up every 1000 points
            if (score > 0 && Math.floor((score + similarityScore) / 1000) > level) {
                setLevel(l => l + 1);
                toast.success("LEVEL UP! SPEED INCREASED!");
            }
        }, 300);
    };

    const resetGame = () => {
        setWords([]);
        setScore(0);
        setLevel(1);
        setGameState('playing');
        spawnWord();
        spawnWord();
        spawnWord();
    };

    // calculate danger level
    const dangerLevel = (words.length / MAX_WORDS) * 100;

    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono">
            <Toaster position="top-center" theme="dark" />

            {/* Retro Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(17,24,39,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,0.9)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="max-w-xl w-full relative z-10 flex flex-col h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-end mb-6 border-b border-cyan-500/30 pb-4">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter">
                            SEMANTRIS
                        </h1>
                        <div className="flex items-center gap-2 text-cyan-500/60 text-xs uppercase tracking-widest mt-1">
                            <Zap className="w-3 h-3" />
                            Neural Link Active
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400 uppercase">Score</div>
                        <div className="text-3xl font-bold text-white tabular-nums">{score}</div>
                    </div>
                </div>

                {/* Game Area */}
                <div className="flex-1 relative bg-slate-900/50 border-x border-cyan-500/20 backdrop-blur-sm overflow-hidden flex flex-col-reverse justify-start p-4 gap-2">
                    {/* Danger Zone Indicator */}
                    <div
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent transition-opacity duration-300"
                        style={{ opacity: dangerLevel > 70 ? 1 : 0 }}
                    />

                    {/* Words Stack (Flex-col-reverse makes bottom elements stack up) */}
                    {/* Actually standard stacking: New words fall from top? 
                        If we use a list where index 0 is bottom, then mapping reversely works?
                        Or simplify: Words are just a list. We render them.
                        Visual: Top of the screen is the "Source". Words fall DOWN.
                        If words are `[w1, w2, w3]`, w1 is oldest (bottom).
                        Flex-col-reverse:
                        - w1 (Bottom)
                        - w2
                        - w3 (Top - Newest)
                        This mimics the Arcade behavior where blocks rise? 
                        Wait, original Semantris Arcade: Blocks FALL.
                        Original Semantris Blocks: Blocks fall.
                        If blocks fall, then new blocks are added at Index 0? Or Index End?
                        If I append: `[...prev, new]`. Newest is at end.
                        If I render simply:
                        TOP
                        w3
                        w2
                        w1
                        BOTTOM
                        
                        So `flex-col` puts w1 at top. 
                        I want w3 (newest) at top? No, newest spawns at top. Oldest settles at bottom.
                        So `[oldest, ..., newest]`.
                        Render: 
                        Newest
                        ...
                        Oldest
                        
                        So `flex-col-reverse` renders:
                        Last Element (Newest) -> Top? NO.
                        flex-col-reverse: Bottom to Top.
                        First Element (Oldest) -> Bottom.
                        Last Element (Newest) -> Top.
                        PERFECT.
                    */}
                    {words.map((word) => (
                        <div
                            key={word.id}
                            className={cn(
                                "w-full p-3 rounded bg-slate-800 border border-slate-700 text-center text-lg font-bold text-slate-200 transition-all duration-300 transform",
                                word.isMatched ? "scale-110 opacity-0 bg-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.6)]" : "animate-in slide-in-from-top-4 fade-in",
                                // Category colors
                                word.category === 'nature' && "border-green-500/30 text-green-100",
                                word.category === 'food' && "border-orange-500/30 text-orange-100",
                                word.category === 'space' && "border-purple-500/30 text-purple-100",
                                word.category === 'tech' && "border-blue-500/30 text-blue-100",
                                word.category === 'emotion' && "border-pink-500/30 text-pink-100",
                                word.category === 'action' && "border-red-500/30 text-red-100",
                            )}
                        >
                            {word.text}
                        </div>
                    ))}

                    {/* Game Over Overlay */}
                    {gameState === 'gameOver' && (
                        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-50 animate-in fade-in">
                            <h2 className="text-5xl font-black text-white mb-4">SYSTEM CRASH</h2>
                            <p className="text-cyan-400 mb-8 font-mono">Buffer Overflow Detected</p>
                            <Button onClick={resetGame} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-6 text-xl">
                                REBOOT SYSTEM
                            </Button>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="mt-4 relative">
                    <Input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleInput}
                        placeholder="Type a word association..."
                        className="bg-slate-900/80 border-cyan-500/50 text-white placeholder:text-slate-600 h-14 pl-4 text-xl font-mono focus-visible:ring-cyan-500/50 focus-visible:border-cyan-400"
                        autoFocus
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                        PRESS ENTER
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center text-slate-500 text-xs font-mono uppercase">
                    <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/')}>
                        <Home className="w-3 h-3" />
                        Return to Hub
                    </div>
                    <div>
                        Capacity: {Math.round(dangerLevel)}%
                    </div>
                </div>
            </div>
        </div>
    );
}
