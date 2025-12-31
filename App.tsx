
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import { createGrid, checkCollision, rotate } from './utils';
import { COLS, ROWS, TETROMINOS, getRandomTetromino, LEVEL_SPEEDS, THEMES } from './constants';
import { Piece } from './types';
import { getTetrisTip } from './services/geminiService';
import { Trophy, Zap, Ghost, RefreshCw, Info, Mountain, Heart, Diamond, Star, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [grid, setGrid] = useState<(string | 0)[][]>(createGrid());
  const [activePiece, setActivePiece] = useState<Piece>(getRandomTetromino());
  const [nextPiece, setNextPiece] = useState<Piece>(getRandomTetromino());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [aiHint, setAiHint] = useState("¡Bienvenido a Neon Tetris!");
  const [currentTheme, setCurrentTheme] = useState('earth');

  const gameLoopRef = useRef<number | null>(null);

  // Ref to always have the latest drop function in the game loop without restarting the interval
  const dropRef = useRef<() => void>(() => { });

  // Update theme colors
  useEffect(() => {
    const theme = THEMES[currentTheme];
    if (theme) {
      Object.keys(THEMES).forEach(id => {
        document.body.classList.remove(`theme-${id}`);
      });
      document.body.classList.add(`theme-${currentTheme}`);
      Object.entries(theme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value);
      });
    }
  }, [currentTheme]);

  // AI Update
  useEffect(() => {
    const fetchTip = async () => {
      const tip = await getTetrisTip(score, level);
      setAiHint(tip);
    };
    if (level > 1 || gameOver) {
      fetchTip();
    }
  }, [level, gameOver]);

  const mergePiece = useCallback(() => {
    const newGrid = grid.map(row => [...row]);
    activePiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const gridY = y + activePiece.pos.y;
          const gridX = x + activePiece.pos.x;
          if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
            newGrid[gridY][gridX] = activePiece.type;
          }
        }
      });
    });

    let linesCleared = 0;
    const sweptGrid = newGrid.reduce((acc, row) => {
      if (row.every(cell => cell !== 0)) {
        linesCleared += 1;
        acc.unshift(Array(COLS).fill(0));
        return acc;
      }
      acc.push(row);
      return acc;
    }, [] as (string | 0)[][]);

    if (linesCleared > 0) {
      const newScore = score + (linesCleared * 10);
      setScore(newScore);
      const newLevel = Math.min(10, Math.floor(newScore / 50) + 1);
      setLevel(newLevel);
    }

    setGrid(sweptGrid);

    const nextP = nextPiece;
    if (checkCollision(nextP, sweptGrid, { x: 0, y: 0 })) {
      setGameOver(true);
      return;
    }

    setActivePiece(nextP);
    setNextPiece(getRandomTetromino());
  }, [activePiece, grid, nextPiece, score]);

  const drop = useCallback(() => {
    if (gameOver || isPaused) return;

    if (!checkCollision(activePiece, grid, { x: 0, y: 1 })) {
      setActivePiece(prev => ({
        ...prev,
        pos: { ...prev.pos, y: prev.pos.y + 1 },
      }));
    } else {
      mergePiece();
    }
  }, [activePiece, grid, gameOver, isPaused, mergePiece]);

  // Update dropRef every time drop changes
  useEffect(() => {
    dropRef.current = drop;
  }, [drop]);

  const move = (dir: number) => {
    if (!checkCollision(activePiece, grid, { x: dir, y: 0 })) {
      setActivePiece(prev => ({
        ...prev,
        pos: { ...prev.pos, x: prev.pos.x + dir },
      }));
    }
  };

  const handleRotate = () => {
    const clonedPiece = JSON.parse(JSON.stringify(activePiece));
    clonedPiece.shape = rotate(clonedPiece.shape, 1);

    let offset = 1;
    while (checkCollision(clonedPiece, grid, { x: 0, y: 0 })) {
      clonedPiece.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPiece.shape[0].length) return;
    }
    setActivePiece(clonedPiece);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowDown') drop();
      if (e.key === 'ArrowUp') handleRotate();
      if (e.key === 'p' || e.key === 'P') setIsPaused(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePiece, grid, gameOver, drop]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused) {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      return;
    }

    const interval = LEVEL_SPEEDS[level - 1];
    gameLoopRef.current = window.setInterval(() => {
      dropRef.current();
    }, interval);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [level, gameOver, isPaused]);

  const displayGrid = grid.map(row => [...row]);
  activePiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const gridY = y + activePiece.pos.y;
        const gridX = x + activePiece.pos.x;
        if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
          displayGrid[gridY][gridX] = activePiece.type;
        }
      }
    });
  });

  const resetGame = () => {
    setGrid(createGrid());
    setActivePiece(getRandomTetromino());
    setNextPiece(getRandomTetromino());
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setAiHint("¡Suerte en esta nueva partida!");
  };

  const themeIcons = {
    earth: <Mountain size={18} />,
    pink: <Heart size={18} />,
    metallic: <Diamond size={18} />,
    space: <Star size={18} />,
    planets: <Globe size={18} />,
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />

      <header className="mb-6 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-orbitron neon-text-cyan font-bold tracking-widest flex items-center gap-4">
          NEON TETRIS
        </h1>
        <p className="text-gray-400 mt-2 font-medium tracking-wider uppercase text-sm">Difficulty Level: {level}/10</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 items-start z-10 w-full max-w-6xl justify-center">
        <div className="hidden md:flex flex-col gap-6 w-48">
          <div className="p-4 bg-white/5 neon-border rounded-xl backdrop-blur-md">
            <div className="text-[10px] font-orbitron text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
              <RefreshCw size={12} className="animate-spin-slow" /> ESCOGE TU PIEL
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(THEMES) as Array<keyof typeof themeIcons>).map(themeId => (
                <button
                  key={themeId}
                  onClick={() => setCurrentTheme(themeId)}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all ${currentTheme === themeId
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      : 'bg-white/5 text-gray-500 border border-transparent hover:bg-white/10 hover:text-gray-300'
                    }`}
                  title={THEMES[themeId].name}
                >
                  {themeIcons[themeId]}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white/5 neon-border rounded-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
              <Trophy size={20} />
              <span className="font-orbitron text-sm">SCORE</span>
            </div>
            <div className="text-3xl font-orbitron">{score.toString().padStart(6, '0')}</div>
          </div>
          <div className="p-4 bg-white/5 neon-border rounded-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2 text-purple-400">
              <Zap size={20} />
              <span className="font-orbitron text-sm">LEVEL</span>
            </div>
            <div className="text-3xl font-orbitron">{level}</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2 text-yellow-400">
              <Info size={20} />
              <span className="font-orbitron text-sm">TIPS</span>
            </div>
            <div className="text-sm italic text-gray-300 leading-relaxed">
              {aiHint}
            </div>
          </div>
        </div>

        <div className="relative group">
          <Board grid={displayGrid} />
          {(isPaused || gameOver) && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg border border-white/10">
              {gameOver ? (
                <>
                  <h2 className="text-4xl font-orbitron text-red-500 mb-4 animate-pulse">GAME OVER</h2>
                  <div className="text-xl text-gray-300 mb-8">Score: {score}</div>
                  <button onClick={resetGame} className="flex items-center gap-3 px-8 py-3 bg-cyan-600/30 border border-cyan-500 rounded-full hover:bg-cyan-500/50 transition-all font-orbitron text-lg text-white">
                    <RefreshCw size={24} /> REPLAY
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-orbitron text-yellow-500 mb-8">PAUSED</h2>
                  <button onClick={() => setIsPaused(false)} className="px-12 py-4 bg-yellow-600/30 border border-yellow-500 rounded-full hover:bg-yellow-500/50 transition-all font-orbitron text-xl text-white">
                    RESUME
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-row md:flex-col gap-6 w-full md:w-48 justify-center items-center">
          <div className="p-4 bg-white/5 neon-border rounded-xl backdrop-blur-md w-32 md:w-full min-h-[140px] flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-4 text-emerald-400 self-start">
              <Ghost size={20} />
              <span className="font-orbitron text-xs">NEXT</span>
            </div>
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${nextPiece.shape.length}, minmax(0, 1fr))`
              }}
            >
              {nextPiece.shape.map((row, y) =>
                row.map((cell, x) => (
                  <div key={`${y}-${x}`} className={`w-4 h-4 md:w-5 md:h-5 ${cell !== 0 ? `block-${nextPiece.type} border border-white/20` : 'bg-transparent'}`} />
                ))
              )}
            </div>
          </div>

          <div className="md:hidden flex flex-col gap-2 flex-1">
            <div className="flex justify-between p-2 bg-white/5 rounded-lg border border-white/10">
              <span className="text-xs font-orbitron text-cyan-400">SCORE</span>
              <span className="text-sm font-orbitron">{score}</span>
            </div>
            <div className="flex justify-between p-2 bg-white/5 rounded-lg border border-white/10">
              <span className="text-xs font-orbitron text-purple-400">LEVEL</span>
              <span className="text-sm font-orbitron">{level}</span>
            </div>
            <div className="flex gap-2 mt-1 overflow-x-auto pb-1 no-scrollbar">
              {(Object.keys(THEMES) as Array<keyof typeof themeIcons>).map(themeId => (
                <button
                  key={themeId}
                  onClick={() => setCurrentTheme(themeId)}
                  className={`p-2 min-w-[36px] rounded-lg flex items-center justify-center transition-all ${currentTheme === themeId ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-white/5 text-gray-500'
                    }`}
                >
                  {themeIcons[themeId]}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block text-xs text-gray-500 mt-4 leading-relaxed font-medium">
            <p className="mb-2 text-cyan-500">CONTROLS:</p>
            <p>← → : Move</p>
            <p>↑ : Rotate</p>
            <p>↓ : Drop</p>
            <p>P : Pause</p>
          </div>
        </div>
      </div>

      <Controls
        onMove={move}
        onRotate={handleRotate}
        onDrop={drop}
        onPause={() => setIsPaused(!isPaused)}
        isPaused={isPaused}
      />

      <footer className="mt-8 text-gray-600 text-[10px] uppercase tracking-widest font-bold">
        Built with Gemini Intelligence • 2024
      </footer>
    </div>
  );
};

export default App;
