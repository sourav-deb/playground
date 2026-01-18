import React, { useState, useEffect } from 'react';
import { GameHeader } from '@/components/GameHeader';
import { GameChoice } from '@/components/GameChoice';
import { GameResult } from '@/components/GameResult';
import { GameModeSelection } from '@/components/GameModeSelection';
import { GameOver } from '@/components/GameOver';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { IntelligentBot, determineWinner } from '@/utils/gameLogic';
import { Home } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const bot = new IntelligentBot();

export const RPSGame = () => {
    const navigate = useNavigate();
    const [gamePhase, setGamePhase] = useState('menu'); // menu, playing, gameOver
    const [gameState, setGameState] = useState('waiting'); // waiting, result
    const [totalMoves, setTotalMoves] = useState(0);
    const [currentMove, setCurrentMove] = useState(0);
    const [playerChoice, setPlayerChoice] = useState(null);
    const [botChoice, setBotChoice] = useState(null);
    const [result, setResult] = useState(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [botScore, setBotScore] = useState(0);
    const [prediction, setPrediction] = useState(null);
    const [confidence, setConfidence] = useState(0);
    const [moveHistory, setMoveHistory] = useState([]);

    // Update prediction before each game
    useEffect(() => {
        if (gameState === 'waiting' && moveHistory.length > 0) {
            const { prediction: pred, confidence: conf } = bot.predictNextMove();
            setPrediction(pred);
            setConfidence(conf);
        }
    }, [gameState, moveHistory]);

    // Auto-progress to next move after showing result
    useEffect(() => {
        if (gameState === 'result' && currentMove < totalMoves) {
            const timer = setTimeout(() => {
                setGameState('waiting');
                setPlayerChoice(null);
                setBotChoice(null);
                setResult(null);
            }, 2500); // Show result for 2.5 seconds

            return () => clearTimeout(timer);
        } else if (gameState === 'result' && currentMove >= totalMoves) {
            // Game is over
            const timer = setTimeout(() => {
                setGamePhase('gameOver');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [gameState, currentMove, totalMoves]);

    const handleSelectMode = (moves) => {
        setTotalMoves(moves);
        setGamePhase('playing');
        setCurrentMove(0);
        setPlayerScore(0);
        setBotScore(0);
        setMoveHistory([]);
        setPrediction(null);
        setConfidence(0);
        bot.reset();
        toast.success(`${moves}-Move Game Started! 🎮`);
    };

    const handlePlayerChoice = (choice) => {
        if (gameState !== 'waiting') return;

        setPlayerChoice(choice);

        // Bot makes its move (countering prediction)
        const botMove = bot.makeMove();
        setBotChoice(botMove);

        // Add player move to history
        bot.addMove(choice);
        setMoveHistory(bot.getHistory());

        // Determine winner
        const gameResult = determineWinner(choice, botMove);
        setResult(gameResult);

        // Update scores
        if (gameResult === 'win') {
            setPlayerScore(prev => prev + 1);
        } else if (gameResult === 'lose') {
            setBotScore(prev => prev + 1);
        }

        setCurrentMove(prev => prev + 1);
        setGameState('result');
    };

    const handlePlayAgain = () => {
        setGamePhase('playing');
        setGameState('waiting');
        setCurrentMove(0);
        setPlayerChoice(null);
        setBotChoice(null);
        setResult(null);
        setPlayerScore(0);
        setBotScore(0);
        setMoveHistory([]);
        setPrediction(null);
        setConfidence(0);
        bot.reset();
        toast.success('New game started! 🎮');
    };

    const handleBackToMenu = () => {
        setGamePhase('menu');
        setGameState('waiting');
        setTotalMoves(0);
        setCurrentMove(0);
        setPlayerChoice(null);
        setBotChoice(null);
        setResult(null);
        setPlayerScore(0);
        setBotScore(0);
        setMoveHistory([]);
        setPrediction(null);
        setConfidence(0);
        bot.reset();
    };

    const handleExitGame = () => {
        navigate('/');
    };

    // Render game mode selection
    if (gamePhase === 'menu') {
        return (
            <div className="min-h-screen">
                <Toaster position="top-center" richColors theme="dark" />
                {/* Navigation Bar for Menu */}
                <div className="absolute top-0 left-0 p-4 z-50">
                    <Button
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                        onClick={handleExitGame}
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Back to Home
                    </Button>
                </div>
                <GameModeSelection
                    onSelectMode={handleSelectMode}
                />
            </div>
        );
    }

    // Render game over screen
    if (gamePhase === 'gameOver') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Toaster position="top-center" richColors theme="dark" />
                <GameOver
                    playerScore={playerScore}
                    botScore={botScore}
                    totalMoves={totalMoves}
                    onPlayAgain={handlePlayAgain}
                    onBackToMenu={handleBackToMenu}
                />
            </div>
        );
    }

    // Render game playing screen
    return (
        <div className="min-h-screen w-full py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <Toaster position="top-center" richColors theme="dark" />

            <div className="max-w-7xl w-full space-y-8 animate-in fade-in duration-500">
                {/* Top Navigation */}
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-full backdrop-blur-md border border-white/10">
                    <Button
                        onClick={handleBackToMenu}
                        variant="ghost"
                        size="sm"
                        className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full px-6"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Exit Challenge
                    </Button>

                    <div className="flex items-center gap-4 px-4">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                            Progress
                        </span>
                        <div className="w-32 sm:w-64">
                            <Progress value={(currentMove / totalMoves) * 100} className="h-2 bg-white/10" indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500" />
                        </div>
                        <span className="text-sm font-mono text-white/80">
                            {currentMove}/{totalMoves}
                        </span>
                    </div>
                </div>

                {/* Header with Scores */}
                <GameHeader
                    playerScore={playerScore}
                    botScore={botScore}
                    gamesPlayed={currentMove}
                />

                {/* Main Game Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Game Choices */}
                    <div className="lg:col-span-2 h-full">
                        <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden h-full flex flex-col justify-center">
                            {/* Ambient Background */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

                            <div className="relative z-10 space-y-12">
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                        {gameState === 'waiting' ? 'CHOOSE YOUR WEAPON' : 'ROUND COMPLETE'}
                                    </h2>
                                    <p className="text-slate-400 font-medium">
                                        {gameState === 'waiting' ? 'Outsmart the AI to claim victory' : 'Analyzing battle results...'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                                    <GameChoice
                                        choice="rock"
                                        onClick={() => handlePlayerChoice('rock')}
                                        disabled={gameState !== 'waiting'}
                                        isSelected={playerChoice === 'rock'}
                                        isWinner={result === 'win' && playerChoice === 'rock'}
                                        isLoser={result === 'lose' && playerChoice === 'rock'}
                                    />
                                    <GameChoice
                                        choice="paper"
                                        onClick={() => handlePlayerChoice('paper')}
                                        disabled={gameState !== 'waiting'}
                                        isSelected={playerChoice === 'paper'}
                                        isWinner={result === 'win' && playerChoice === 'paper'}
                                        isLoser={result === 'lose' && playerChoice === 'paper'}
                                    />
                                    <GameChoice
                                        choice="scissors"
                                        onClick={() => handlePlayerChoice('scissors')}
                                        disabled={gameState !== 'waiting'}
                                        isSelected={playerChoice === 'scissors'}
                                        isWinner={result === 'win' && playerChoice === 'scissors'}
                                        isLoser={result === 'lose' && playerChoice === 'scissors'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bot Analysis / Game Result Area */}
                    <div className="lg:col-span-1 h-full">
                        <div className="h-full hover:transform hover:scale-105 transition-transform duration-300">
                            <GameResult
                                result={result}
                                playerChoice={playerChoice}
                                botChoice={botChoice}
                                gameState={gameState}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
