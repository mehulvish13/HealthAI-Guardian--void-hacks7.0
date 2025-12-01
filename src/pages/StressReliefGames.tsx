import { useState, useEffect, useCallback } from 'react';
import { Wind, RotateCcw, Trophy, Star, Heart, Sparkles, Leaf, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type GameType = 'breathing' | 'bubble' | 'zen' | null;

export default function StressReliefGames() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Stress Relief Games</h1>
        <p className="text-muted-foreground mt-2">
          Relax and unwind with calming activities designed to reduce stress and anxiety
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Moon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalMinutes}</p>
            <p className="text-xs text-muted-foreground">Minutes Relaxed</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{sessionsCompleted}</p>
            <p className="text-xs text-muted-foreground">Sessions Done</p>
          </div>
        </div>
      </div>

      {!selectedGame ? (
        <GameSelection onSelect={setSelectedGame} />
      ) : (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setSelectedGame(null)} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Back to Activities
          </Button>
          
          {selectedGame === 'breathing' && (
            <BreathingExercise 
              onComplete={(minutes) => {
                setTotalMinutes(prev => prev + minutes);
                setSessionsCompleted(prev => prev + 1);
              }}
            />
          )}
          {selectedGame === 'bubble' && (
            <BubblePop 
              onComplete={(minutes) => {
                setTotalMinutes(prev => prev + minutes);
                setSessionsCompleted(prev => prev + 1);
              }}
            />
          )}
          {selectedGame === 'zen' && (
            <ZenGarden 
              onComplete={(minutes) => {
                setTotalMinutes(prev => prev + minutes);
                setSessionsCompleted(prev => prev + 1);
              }}
            />
          )}
        </div>
      )}

      {/* Info Card */}
      <div className="bg-success/5 rounded-xl p-4 border border-success/20">
        <h4 className="font-medium text-foreground mb-2">💚 Benefits of Relaxation</h4>
        <p className="text-sm text-muted-foreground">
          Regular relaxation exercises can lower cortisol levels, reduce blood pressure, 
          improve sleep quality, and boost overall mental well-being.
        </p>
      </div>
    </div>
  );
}

function GameSelection({ onSelect }: { onSelect: (game: GameType) => void }) {
  const games = [
    {
      id: 'breathing' as const,
      title: 'Breathing Exercise',
      description: 'Guided breathing techniques to calm your mind and reduce anxiety',
      icon: Wind,
      color: 'primary',
      duration: '3-5 min',
    },
    {
      id: 'bubble' as const,
      title: 'Bubble Pop',
      description: 'Pop colorful bubbles in a soothing, meditative experience',
      icon: Sparkles,
      color: 'success',
      duration: '2-5 min',
    },
    {
      id: 'zen' as const,
      title: 'Zen Garden',
      description: 'Create peaceful patterns and designs in your virtual zen garden',
      icon: Leaf,
      color: 'warning',
      duration: '5-10 min',
    },
  ];

  return (
    <div className="grid gap-4">
      {games.map((game) => (
        <button
          key={game.id}
          onClick={() => onSelect(game.id)}
          className="bg-card rounded-xl p-5 border border-border hover:border-success/50 transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              game.color === 'primary' && "bg-primary/10 text-primary",
              game.color === 'success' && "bg-success/10 text-success",
              game.color === 'warning' && "bg-warning/10 text-warning"
            )}>
              <game.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground group-hover:text-success transition-colors">
                  {game.title}
                </h3>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                  {game.duration}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{game.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function BreathingExercise({ onComplete }: { onComplete: (minutes: number) => void }) {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [cycles, setCycles] = useState(0);
  const [targetCycles, setTargetCycles] = useState(4);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6,
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimer(t => {
        const newTime = t + 1;
        
        if (phase === 'inhale' && newTime >= phaseDurations.inhale) {
          setPhase('hold');
          return 0;
        }
        if (phase === 'hold' && newTime >= phaseDurations.hold) {
          setPhase('exhale');
          return 0;
        }
        if (phase === 'exhale' && newTime >= phaseDurations.exhale) {
          setCycles(c => {
            const newCycles = c + 1;
            if (newCycles >= targetCycles) {
              setIsActive(false);
              setPhase('idle');
              const minutes = Math.ceil((targetCycles * 14) / 60);
              onComplete(minutes);
              toast.success(`Great job! You completed ${targetCycles} breathing cycles.`);
              return 0;
            }
            return newCycles;
          });
          setPhase('inhale');
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, targetCycles, onComplete]);

  const startExercise = () => {
    setPhase('inhale');
    setTimer(0);
    setCycles(0);
    setIsActive(true);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('idle');
    setTimer(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Ready';
    }
  };

  const getProgress = () => {
    if (phase === 'idle') return 0;
    const duration = phaseDurations[phase];
    return (timer / duration) * 100;
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">4-4-6 Breathing</h3>
        <span className="text-sm text-muted-foreground">
          Cycle {cycles}/{targetCycles}
        </span>
      </div>

      <div className="flex flex-col items-center py-8">
        {/* Breathing circle */}
        <div className={cn(
          "relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-1000",
          phase === 'inhale' && "scale-110 bg-primary/20",
          phase === 'hold' && "scale-110 bg-warning/20",
          phase === 'exhale' && "scale-90 bg-success/20",
          phase === 'idle' && "scale-100 bg-secondary"
        )}>
          <div className={cn(
            "absolute inset-2 rounded-full transition-all duration-1000",
            phase === 'inhale' && "bg-primary/30",
            phase === 'hold' && "bg-warning/30",
            phase === 'exhale' && "bg-success/30",
            phase === 'idle' && "bg-muted"
          )} />
          <div className="relative z-10 text-center">
            <p className={cn(
              "text-2xl font-bold",
              phase === 'inhale' && "text-primary",
              phase === 'hold' && "text-warning",
              phase === 'exhale' && "text-success",
              phase === 'idle' && "text-muted-foreground"
            )}>
              {getPhaseText()}
            </p>
            {phase !== 'idle' && (
              <p className="text-4xl font-bold text-foreground mt-2">
                {phaseDurations[phase] - timer}
              </p>
            )}
          </div>
        </div>

        {/* Progress */}
        {phase !== 'idle' && (
          <div className="w-full max-w-xs mt-6 space-y-2">
            <Progress value={getProgress()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Current phase</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Cycle selector */}
      {phase === 'idle' && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">Select number of cycles:</p>
          <div className="flex justify-center gap-2">
            {[3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setTargetCycles(num)}
                className={cn(
                  "w-12 h-12 rounded-xl font-semibold transition-all",
                  targetCycles === num 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-2">
        {phase === 'idle' ? (
          <Button onClick={startExercise} className="gap-2">
            <Wind className="w-4 h-4" />
            Start Breathing
          </Button>
        ) : (
          <Button variant="outline" onClick={stopExercise}>
            Stop Exercise
          </Button>
        )}
      </div>
    </div>
  );
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  popped: boolean;
}

function BubblePop({ onComplete }: { onComplete: (minutes: number) => void }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [popped, setPopped] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);

  const colors = [
    'bg-primary/60', 'bg-success/60', 'bg-warning/60', 
    'bg-destructive/60', 'bg-secondary', 'bg-accent/60'
  ];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setBubbles(prev => {
        const filtered = prev.filter(b => !b.popped && b.y > -100);
        const moved = filtered.map(b => ({ ...b, y: b.y - 2 }));
        
        if (Math.random() > 0.7 && moved.length < 15) {
          const newBubble: Bubble = {
            id: Date.now(),
            x: Math.random() * 80 + 10,
            y: 100,
            size: Math.random() * 30 + 40,
            color: colors[Math.floor(Math.random() * colors.length)],
            popped: false,
          };
          return [...moved, newBubble];
        }
        
        return moved;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.map(b => 
      b.id === id ? { ...b, popped: true } : b
    ));
    setPopped(p => p + 1);
  };

  const startGame = () => {
    setIsActive(true);
    setBubbles([]);
    setPopped(0);
    setTimer(0);
  };

  const endSession = () => {
    setIsActive(false);
    const minutes = Math.max(1, Math.ceil(timer / 60));
    onComplete(minutes);
    toast.success(`Relaxing! You popped ${popped} bubbles in ${minutes} minute(s).`);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Bubble Pop</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Time: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span>
          <span>Popped: {popped}</span>
        </div>
      </div>

      <div className="relative h-80 bg-gradient-to-b from-primary/5 to-success/10 rounded-xl overflow-hidden">
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <Button onClick={startGame} size="lg" className="gap-2">
              <Sparkles className="w-5 h-5" />
              Start Popping
            </Button>
          </div>
        )}
        
        {bubbles.map((bubble) => !bubble.popped && (
          <button
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: bubble.size,
              height: bubble.size,
            }}
            className={cn(
              "absolute rounded-full transition-transform hover:scale-110 cursor-pointer",
              "border-2 border-white/30 shadow-lg",
              bubble.color,
              "animate-in fade-in duration-300"
            )}
          >
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/40" />
          </button>
        ))}
      </div>

      {isActive && (
        <Button variant="outline" onClick={endSession} className="w-full">
          End Session
        </Button>
      )}

      <p className="text-xs text-center text-muted-foreground">
        Tap bubbles to pop them and release stress
      </p>
    </div>
  );
}

interface Stone {
  id: number;
  x: number;
  y: number;
  type: 'stone' | 'plant' | 'water';
}

function ZenGarden({ onComplete }: { onComplete: (minutes: number) => void }) {
  const [stones, setStones] = useState<Stone[]>([]);
  const [selectedTool, setSelectedTool] = useState<'stone' | 'plant' | 'water'>('stone');
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) {
      setIsActive(true);
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setStones(prev => [...prev, {
      id: Date.now(),
      x,
      y,
      type: selectedTool,
    }]);
  };

  const clearGarden = () => {
    setStones([]);
  };

  const endSession = () => {
    const minutes = Math.max(1, Math.ceil(timer / 60));
    onComplete(minutes);
    toast.success(`Peaceful session! You spent ${minutes} minute(s) in your zen garden.`);
    setIsActive(false);
    setTimer(0);
  };

  const tools = [
    { type: 'stone' as const, emoji: '🪨', label: 'Stone' },
    { type: 'plant' as const, emoji: '🌿', label: 'Plant' },
    { type: 'water' as const, emoji: '💧', label: 'Water' },
  ];

  const getEmoji = (type: string) => {
    switch (type) {
      case 'stone': return '🪨';
      case 'plant': return '🌿';
      case 'water': return '💧';
      default: return '🪨';
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Zen Garden</h3>
        <span className="text-sm text-muted-foreground">
          Time: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
        </span>
      </div>

      {/* Tool selector */}
      <div className="flex justify-center gap-2">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setSelectedTool(tool.type)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
              selectedTool === tool.type 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-foreground hover:bg-secondary/80"
            )}
          >
            <span>{tool.emoji}</span>
            {tool.label}
          </button>
        ))}
      </div>

      {/* Garden canvas */}
      <div 
        onClick={handleCanvasClick}
        className="relative h-80 bg-gradient-to-b from-amber-100/20 to-amber-200/30 dark:from-amber-900/10 dark:to-amber-800/20 rounded-xl overflow-hidden cursor-crosshair"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px)',
        }}
      >
        {/* Sand pattern overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        
        {stones.map((stone) => (
          <div
            key={stone.id}
            style={{
              left: `${stone.x}%`,
              top: `${stone.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute text-2xl animate-in zoom-in duration-300 drop-shadow-md"
          >
            {getEmoji(stone.type)}
          </div>
        ))}

        {!isActive && stones.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Click to place elements</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={clearGarden} className="flex-1">
          Clear Garden
        </Button>
        {isActive && (
          <Button onClick={endSession} className="flex-1">
            End Session
          </Button>
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Create your peaceful space by placing stones, plants, and water features
      </p>
    </div>
  );
}
