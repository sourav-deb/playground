import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, RotateCcw, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { initializeGrid, move, addRandomTile, checkGameOver, checkWin } from './logic';
import { Toaster, toast } from 'sonner';

export const Game1024 = () => {
    const navigate = useNavigate();
    const [grid, setGrid] = useState(initializeGrid());
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(() => {
        return parseInt(localStorage.getItem('1024-best-score')) || 0;
    });
    const [gameState, setGameState] = useState('playing');

    useEffect(() => {
        if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem('1024-best-score', score.toString());
        }
    }, [score, bestScore]);

    const handleKeyDown = useCallback((e) => {
        if (gameState !== 'playing') return;

        const key = e.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            e.preventDefault();
            const result = move(grid, key);

            if (result.moved) {
                const newGrid = result.grid;
                // Intro delay for new tile spawn could be nice, but instant for now
                setTimeout(() => {
                    addRandomTile(newGrid);
                    setGrid([...newGrid]); // Force React update
                }, 150); // Small delay to let slide finish before spawn logic (optional) check?

                // Note: Standard 2048 spawns *after* move. 
                // We update grid immediately for slide, but spawn needs to be in there?
                // Actually, typically you setGrid(movedState), then add tile.
                // Our move() returns the moved grid. 
                // Let's add tile immediately to avoid complex two-step state if not using specialized anim library.
                // Revert to immediate add for responsiveness.
                // const finalGrid = newGrid;
                // addRandomTile(finalGrid);

                // Let's stick to the previous immediate logic but ensure newGrid is new ref
                // Wait, I commented out the delay logic above. Using immediate logic:
                // addRandomTile(newGrid);
                setGrid(newGrid);
                setScore(prev => prev + result.score);

                // Check win/loss
                if (checkWin(newGrid) && gameState !== 'won') {
                    setGameState('won');
                } else if (checkGameOver(newGrid)) {
                    setGameState('over');
                }
            }
        }
    }, [grid, gameState]);

    // Separate useEffect for adding tile after move? 
    // Usually standard: Move -> setGrid (animates) -> 100ms later -> Add Tile -> setGrid.
    // Let's keep it simple first: Immediate add.
    // However, if we add immediately, the new tile pops in at the same time others are sliding.

    // Correction: `move` returns valid grid. `logic.js` was updated to clone structure.
    // `addRandomTile` mutates it.
    // Refined Handler:
    const safeHandleKeyDown = useCallback((e) => {
        if (gameState !== 'playing') return;
        const key = e.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            e.preventDefault();
            const result = move(grid, key);
            if (result.moved) {
                setGrid(result.grid); // Start Slide
                setScore(prev => prev + result.score);

                // Spawn new tile after short delay to allow slide to look clean
                setTimeout(() => {
                    const withNewTile = result.grid.map(row => [...row]); // Shallow clone
                    addRandomTile(withNewTile);
                    setGrid(withNewTile);

                    if (checkWin(withNewTile) && gameState !== 'won') {
                        setGameState('won');
                    } else if (checkGameOver(withNewTile)) {
                        setGameState('over');
                    }
                }, 200);
            }
        }
    }, [grid, gameState]);

    useEffect(() => {
        window.addEventListener('keydown', safeHandleKeyDown);
        return () => window.removeEventListener('keydown', safeHandleKeyDown);
    }, [safeHandleKeyDown]);


    const resetGame = () => {
        setGrid(initializeGrid());
        setScore(0);
        setGameState('playing');
        toast.info("Game Reset! Good Luck.");
    };

    const getTileColor = (value) => {
        const colors = {
            2: "bg-slate-200 text-slate-800 shadow-sm",
            4: "bg-orange-100 text-slate-800 shadow-sm",
            8: "bg-orange-300 text-white shadow-md",
            16: "bg-orange-500 text-white shadow-md",
            32: "bg-orange-600 text-white shadow-lg",
            64: "bg-red-500 text-white shadow-lg",
            128: "bg-yellow-300 text-slate-900 shadow-xl",
            256: "bg-yellow-400 text-slate-900 shadow-xl",
            512: "bg-yellow-500 text-white shadow-2xl",
            1024: "bg-gradient-to-br from-yellow-400 to-yellow-600 ring-4 ring-yellow-200 shadow-2xl animate-pulse",
        };
        return colors[value] || "bg-slate-900 text-white";
    };

    // Flatten grid to render tiles absolutely
    const tiles = [];
    grid.forEach((row, r) => {
        row.forEach((tile, c) => {
            if (tile) {
                tiles.push({ ...tile, r, c });
            }
        });
    });

    return (
        <div className="min-h-screen w-full bg-[#0F172A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <Toaster position="top-center" richColors theme="dark" />

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-[#0F172A] to-[#0F172A] pointer-events-none" />

            <div className="max-w-md w-full space-y-8 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h1 className="text-6xl font-black text-white tracking-tighter">1024</h1>
                        <p className="text-slate-400 font-medium">Join the numbers!</p>
                    </div>
                    <div className="flex gap-4">
                        <ScoreBox label="SCORE" value={score} />
                        <ScoreBox label="BEST" value={bestScore} />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-between items-center bg-white/5 p-2 rounded-full backdrop-blur-md border border-white/10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/')}
                        className="text-slate-300 hover:text-white rounded-full"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Home
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetGame}
                        className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-full"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        New Game
                    </Button>
                </div>

                {/* Game Board Container */}
                <div className="relative glass-panel p-4 rounded-2xl aspect-square select-none touch-none">
                    {/* Background Grid */}
                    <div className="absolute inset-0 p-4">
                        <div className="w-full h-full bg-slate-900/50 rounded-xl relative flex flex-wrap content-start">
                            {Array(16).fill(null).map((_, i) => (
                                <div key={i} className="w-1/4 h-1/4 p-2">
                                    <div className="w-full h-full bg-slate-800/50 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Foreground Tiles (Absolute Layer) */}
                    <div className="absolute inset-0 p-4 pointer-events-none">
                        <div className="w-full h-full relative">
                            {tiles.map((tile) => (
                                <div
                                    key={tile.id}
                                    className="absolute w-1/4 h-1/4 p-2 transition-transform duration-100 ease-in-out will-change-transform"
                                    style={{
                                        transform: `translate(${tile.c * 100}%, ${tile.r * 100}%)`,
                                        zIndex: tile.merged ? 20 : 10,
                                    }}
                                >
                                    {/* Actual visible tile */}
                                    <div
                                        className={cn(
                                            "w-full h-full rounded-lg flex items-center justify-center text-3xl font-bold shadow-sm",
                                            getTileColor(tile.value),
                                            tile.isNew ? "animate-in zoom-in duration-200" : ""
                                        )}
                                    >
                                        {tile.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Overlay */}
                    {gameState !== 'playing' && (
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in duration-500 z-50">
                            {gameState === 'won' ? (
                                <div className="space-y-4">
                                    <Crown className="w-20 h-20 text-yellow-500 mx-auto animate-bounce" />
                                    <h2 className="text-5xl font-black text-white">YOU WON!</h2>
                                    <p className="text-yellow-200 text-lg">You reached 1024!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-6xl">💀</div>
                                    <h2 className="text-4xl font-black text-white">GAME OVER</h2>
                                    <p className="text-slate-400">No moves left!</p>
                                </div>
                            )}
                            <Button
                                onClick={resetGame}
                                className="bg-white text-slate-900 hover:bg-slate-200 text-lg px-8 py-6 rounded-full font-bold shadow-lg shadow-white/10"
                            >
                                Play Again
                            </Button>
                        </div>
                    )}
                </div>
                <div className="text-center text-slate-500 text-sm">Use arrow keys</div>
            </div>
        </div>
    );
};

const ScoreBox = ({ label, value }) => (
    <div className="bg-slate-800/80 backdrop-blur rounded-lg px-4 py-2 min-w-[80px] text-center border border-white/5">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
        <div className="text-xl font-black text-white">{value}</div>
    </div>
);
