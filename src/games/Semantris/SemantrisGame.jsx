import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home, Zap, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchTopicWords, checkSemanticMatch, getRandomTopic, loadModel } from './semanticData';
import { Toaster, toast } from 'sonner';

const MAX_WORDS = 10;
const GRAVITY_SPEED_INITIAL = 3000;
const GRAVITY_SPEED_MIN = 1000;

export const SemantrisGame = () => {
    const navigate = useNavigate();
    const [words, setWords] = useState([]); // Active words on screen
    const [wordDeck, setWordDeck] = useState([]); // Upcoming words
    const [currentTopic, setCurrentTopic] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameState, setGameState] = useState('loading'); // loading, playing, gameOver
    const [isThinking, setIsThinking] = useState(false); // Creating AI effect

    const [loadingMessage, setLoadingMessage] = useState('Initializing...');

    const gameLoopRef = useRef();
    const inputRef = useRef(null);

    // Initial Load
    useEffect(() => {
        const init = async () => {
            setLoadingMessage('Loading Neural Network (25MB)...');
            try {
                // Pre-load TensorFlow Model
                await loadModel();

                setLoadingMessage('Fetching Words...');
                await startNewGame();
            } catch (err) {
                console.error(err);
                toast.error("Failed to load AI Model");
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startNewGame = async () => {
        setGameState('loading');
        setWords([]);
        setScore(0);
        setLevel(1);
        setInputValue('');

        // Fetch 3 random distinct topics for initial deck
        const t1 = getRandomTopic();
        let t2 = getRandomTopic();
        while (t1 === t2) t2 = getRandomTopic(); // Ensure distinct

        const [d1, d2] = await Promise.all([
            fetchTopicWords(t1),
            fetchTopicWords(t2)
        ]);

        // Combine and shuffle
        let initialDeck = [...d1.words, ...d2.words];
        initialDeck = shuffleArray(initialDeck);

        setWordDeck(initialDeck);
        setCurrentTopic("Multi-Threaded"); // General label since it's mixed

        // Spawn initial words
        const initial = initialDeck.slice(0, 3).map(w => createWordObj(w, 'mixed'));
        setWords(initial);
        setWordDeck(prev => prev.slice(3));

        setGameState('playing');
        toast.info("System Initialized: Multi-Topic Mode");
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const createWordObj = (text, category) => ({
        id: Math.random().toString(36).substr(2, 9),
        text,
        category,
        isMatched: false,
    });

    // Replenish deck if low
    const checkReplenish = async () => {
        // If deck is running low (< 15 words), fetch another topic
        if (wordDeck.length < 15 && gameState === 'playing') {
            const newTopic = getRandomTopic();
            // Tailored fetch without await blocking
            fetchTopicWords(newTopic).then(data => {
                setWordDeck(prev => {
                    const newWords = shuffleArray(data.words);
                    return [...prev, ...newWords];
                });
                toast.success(`Injecting Topic: ${newTopic.toUpperCase()}`, { duration: 1500 });
            });
        }
    };

    // Focus input
    useEffect(() => {
        if (gameState === 'playing' && !isThinking) {
            inputRef.current?.focus();
        }
    }, [gameState, words, isThinking]);

    // Game Loop (Gravity)
    useEffect(() => {
        if (gameState !== 'playing') return;

        const loop = setInterval(() => {
            spawnNextWord();
        }, Math.max(GRAVITY_SPEED_MIN, GRAVITY_SPEED_INITIAL - (level * 200)));

        gameLoopRef.current = loop;
        return () => clearInterval(loop);
    }, [gameState, level, wordDeck]);

    const spawnNextWord = () => {
        // Check game over
        if (words.length >= MAX_WORDS) {
            setGameState('gameOver');
            return;
        }

        // Trigger replenish check
        checkReplenish();

        setWords(prev => {
            if (prev.length >= MAX_WORDS) return prev;
            return [...prev, getNextFromDeck()];
        });
    };

    const getNextFromDeck = () => {
        let nextText = "Loading...";
        if (wordDeck.length > 0) {
            nextText = wordDeck[0];
            setWordDeck(prev => prev.slice(1));
        } else {
            nextText = "Entropy";
        }

        // Random visual category for color variety
        const visualCats = ['nature', 'tech', 'space', 'food', 'emotion', 'action'];
        const randomCat = visualCats[Math.floor(Math.random() * visualCats.length)];

        return createWordObj(nextText, randomCat);
    };

    const handleInput = async (e) => {
        if (e.key === 'Enter') {
            await processInput();
        }
    };

    const processInput = async () => {
        if (!inputValue.trim() || isThinking) return;

        setIsThinking(true);
        const currentInput = inputValue;
        setInputValue(''); // Clear immediately for UX

        // Check against API
        const result = await checkSemanticMatch(currentInput, words);

        if (result) {
            // Match found!
            triggerMatch(result.match, result.score);
        } else {
            // No match
            toast.error("No association found.", { duration: 1000 });
        }

        setIsThinking(false);
    };

    const triggerMatch = (word, scoreVal) => {
        // Visual flair
        setWords(prev => prev.map(w => w.id === word.id ? { ...w, isMatched: true } : w));

        setTimeout(() => {
            setWords(prev => prev.filter(w => w.id !== word.id));

            // Score calc: Normalize datamuse score (often 50000+) or formScore (500)
            // Let's just give fixed points + bonus
            const points = 100 + Math.floor(scoreVal / 1000);
            setScore(prev => prev + points);

            if (score > 0 && Math.floor((score + points) / 1000) > level) {
                setLevel(l => l + 1);
                toast.success("Speed Up!");
            }
        }, 300);
    };

    // Safety: If words exceed max
    useEffect(() => {
        if (words.length > MAX_WORDS) {
            setGameState('gameOver');
        }
    }, [words]);

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
                            Connected: {currentTopic ? currentTopic.toUpperCase() : '...'}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400 uppercase">Score</div>
                        <div className="text-3xl font-bold text-white tabular-nums">{score}</div>
                    </div>
                </div>

                {/* Game Area */}
                <div className="flex-1 relative bg-slate-900/50 border-x border-cyan-500/20 backdrop-blur-sm overflow-hidden flex flex-col-reverse justify-start p-4 gap-2">

                    {/* Loading State */}
                    {gameState === 'loading' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-slate-900/90 backdrop-blur-md">
                            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                            <span className="text-cyan-400 font-bold text-xl tracking-widest">{loadingMessage}</span>
                            <span className="text-slate-500 text-sm mt-2">Running TensorFlow.js</span>
                        </div>
                    )}

                    {/* Danger Zone Indicator */}
                    <div
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent transition-opacity duration-300"
                        style={{ opacity: dangerLevel > 70 ? 1 : 0 }}
                    />

                    {/* Words Stack */}
                    {words.map((word) => (
                        <div
                            key={word.id}
                            className={cn(
                                "w-full p-3 rounded bg-slate-800 border border-slate-700 text-center text-lg font-bold text-slate-200 transition-all duration-300 transform",
                                word.isMatched ? "scale-110 opacity-0 bg-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.6)]" : "animate-in slide-in-from-top-4 fade-in"
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
                            <Button onClick={startNewGame} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-6 text-xl">
                                <RefreshCw className="w-5 h-5 mr-2" />
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
                        placeholder={isThinking ? "Analyzing..." : "Type association..."}
                        disabled={isThinking || gameState !== 'playing'}
                        className="bg-slate-900/80 border-cyan-500/50 text-white placeholder:text-slate-600 h-14 pl-4 text-xl font-mono focus-visible:ring-cyan-500/50 focus-visible:border-cyan-400 disabled:opacity-50"
                        autoFocus
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isThinking ? (
                            <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
                        ) : (
                            <span className="text-xs text-slate-500 font-mono">ENTER</span>
                        )}
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
};
