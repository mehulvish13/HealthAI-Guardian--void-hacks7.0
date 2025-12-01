import { useState, useEffect, useCallback } from 'react';
import { Brain, RotateCcw, Trophy, Star, Clock, Zap, Grid3X3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type GameType = 'memory' | 'pattern' | 'sequence' | null;

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🧠', '❤️', '🌟', '🎯', '🔔', '🌈', '🎨', '🎭'];

export default function CognitiveGames() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Cognitive Training Games</h1>
        <p className="text-muted-foreground mt-2">
          Exercise your brain with fun games designed to improve memory and cognitive function
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalScore}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{gamesPlayed}</p>
            <p className="text-xs text-muted-foreground">Games Played</p>
          </div>
        </div>
      </div>

      {!selectedGame ? (
        <GameSelection onSelect={setSelectedGame} />
      ) : (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setSelectedGame(null)} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Back to Games
          </Button>
          
          {selectedGame === 'memory' && (
            <MemoryGame 
              onComplete={(score) => {
                setTotalScore(prev => prev + score);
                setGamesPlayed(prev => prev + 1);
              }}
            />
          )}
          {selectedGame === 'pattern' && (
            <PatternGame 
              onComplete={(score) => {
                setTotalScore(prev => prev + score);
                setGamesPlayed(prev => prev + 1);
              }}
            />
          )}
          {selectedGame === 'sequence' && (
            <SequenceGame 
              onComplete={(score) => {
                setTotalScore(prev => prev + score);
                setGamesPlayed(prev => prev + 1);
              }}
            />
          )}
        </div>
      )}

      {/* Info Card */}
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
        <h4 className="font-medium text-foreground mb-2">🧠 Why Cognitive Games?</h4>
        <p className="text-sm text-muted-foreground">
          Regular brain training can help maintain cognitive function and may reduce the risk of 
          cognitive decline. These games target memory, attention, and pattern recognition skills.
        </p>
      </div>
    </div>
  );
}

function GameSelection({ onSelect }: { onSelect: (game: GameType) => void }) {
  const games = [
    {
      id: 'memory' as const,
      title: 'Memory Match',
      description: 'Find matching pairs of cards to test your short-term memory',
      icon: Grid3X3,
      color: 'primary',
      difficulty: 'Easy',
    },
    {
      id: 'pattern' as const,
      title: 'Pattern Recognition',
      description: 'Identify the pattern and select the correct next element',
      icon: Eye,
      color: 'success',
      difficulty: 'Medium',
    },
    {
      id: 'sequence' as const,
      title: 'Sequence Memory',
      description: 'Remember and repeat increasingly longer sequences',
      icon: Zap,
      color: 'warning',
      difficulty: 'Hard',
    },
  ];

  return (
    <div className="grid gap-4">
      {games.map((game) => (
        <button
          key={game.id}
          onClick={() => onSelect(game.id)}
          className="bg-card rounded-xl p-5 border border-border hover:border-primary/50 transition-all text-left group"
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
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {game.title}
                </h3>
                <span className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-full",
                  game.difficulty === 'Easy' && "bg-success/10 text-success",
                  game.difficulty === 'Medium' && "bg-warning/10 text-warning",
                  game.difficulty === 'Hard' && "bg-destructive/10 text-destructive"
                )}>
                  {game.difficulty}
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

function MemoryGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(0);

  const initializeGame = useCallback(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
    setTimer(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (!gameComplete && cards.length > 0) {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [gameComplete, cards.length]);

  const handleCardClick = (id: number) => {
    if (isChecking || flippedCards.includes(id) || cards[id].isMatched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);

      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setCards(prev => prev.map(card => 
          card.id === first || card.id === second 
            ? { ...card, isMatched: true } 
            : card
        ));
        setMatches(m => {
          const newMatches = m + 1;
          if (newMatches === emojis.length) {
            setGameComplete(true);
            const score = Math.max(100 - moves * 2 - Math.floor(timer / 5), 20);
            onComplete(score);
            toast.success(`Congratulations! +${score} points`);
          }
          return newMatches;
        });
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Memory Match</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </span>
          <span>Moves: {moves}</span>
          <span>Matches: {matches}/{emojis.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isMatched || isChecking}
            className={cn(
              "aspect-square rounded-xl text-3xl flex items-center justify-center transition-all duration-300 transform",
              card.isMatched 
                ? "bg-success/20 border-2 border-success scale-95" 
                : flippedCards.includes(card.id)
                  ? "bg-primary/20 border-2 border-primary"
                  : "bg-secondary hover:bg-secondary/80 border-2 border-border hover:scale-105"
            )}
          >
            {(flippedCards.includes(card.id) || card.isMatched) ? card.emoji : '?'}
          </button>
        ))}
      </div>

      {gameComplete && (
        <div className="text-center py-4">
          <p className="text-lg font-semibold text-success mb-2">🎉 You Won!</p>
          <p className="text-sm text-muted-foreground mb-4">
            Completed in {moves} moves and {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </p>
          <Button onClick={initializeGame}>Play Again</Button>
        </div>
      )}

      {!gameComplete && (
        <Button variant="outline" onClick={initializeGame} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Game
        </Button>
      )}
    </div>
  );
}

function PatternGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [pattern, setPattern] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⬛', '⬜'];

  const generatePattern = useCallback(() => {
    const patternLength = Math.min(3 + level, 6);
    const baseShapes = shapes.slice(0, Math.min(2 + level, shapes.length));
    
    // Create a repeating pattern
    const repeatUnit = baseShapes.slice(0, Math.min(2, baseShapes.length));
    const newPattern: string[] = [];
    for (let i = 0; i < patternLength; i++) {
      newPattern.push(repeatUnit[i % repeatUnit.length]);
    }
    
    const answer = repeatUnit[patternLength % repeatUnit.length];
    
    // Generate wrong options
    const wrongOptions = baseShapes
      .filter(s => s !== answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setPattern(newPattern);
    setCorrectAnswer(answer);
    setOptions(allOptions);
    setFeedback(null);
  }, [level]);

  useEffect(() => {
    generatePattern();
  }, [generatePattern]);

  const handleAnswer = (answer: string) => {
    if (answer === correctAnswer) {
      setFeedback('correct');
      const points = level * 10;
      setScore(s => s + points);
      toast.success(`Correct! +${points} points`);
      setTimeout(() => {
        setLevel(l => l + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      toast.error('Wrong answer! Try again');
      if (score > 0) {
        onComplete(score);
      }
      setTimeout(() => {
        setLevel(1);
        setScore(0);
        generatePattern();
      }, 1500);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Pattern Recognition</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Level: {level}</span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning" />
            {score}
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">What comes next in the pattern?</p>
        <div className="flex items-center justify-center gap-2 text-4xl mb-2">
          {pattern.map((shape, i) => (
            <span key={i} className="animate-in fade-in duration-300" style={{ animationDelay: `${i * 100}ms` }}>
              {shape}
            </span>
          ))}
          <span className={cn(
            "w-12 h-12 rounded-lg border-2 border-dashed flex items-center justify-center text-2xl",
            feedback === 'correct' && "border-success bg-success/10",
            feedback === 'wrong' && "border-destructive bg-destructive/10",
            !feedback && "border-primary"
          )}>
            {feedback === 'correct' ? correctAnswer : '?'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option)}
            disabled={feedback !== null}
            className={cn(
              "aspect-square rounded-xl text-3xl flex items-center justify-center transition-all",
              "bg-secondary hover:bg-secondary/80 border-2 border-border hover:border-primary hover:scale-105",
              feedback && option === correctAnswer && "bg-success/20 border-success"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <Progress value={(level / 10) * 100} className="h-2" />
      <p className="text-xs text-center text-muted-foreground">Progress to Level 10</p>
    </div>
  );
}

function SequenceGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);

  const colors = [
    { bg: 'bg-destructive/80', active: 'bg-destructive', border: 'border-destructive' },
    { bg: 'bg-success/80', active: 'bg-success', border: 'border-success' },
    { bg: 'bg-warning/80', active: 'bg-warning', border: 'border-warning' },
    { bg: 'bg-primary/80', active: 'bg-primary', border: 'border-primary' },
  ];

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameState('idle');
    addToSequence([]);
  };

  const addToSequence = (currentSequence: number[]) => {
    const newButton = Math.floor(Math.random() * 4);
    const newSequence = [...currentSequence, newButton];
    setSequence(newSequence);
    setGameState('showing');
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    await new Promise(r => setTimeout(r, 500));
    
    for (let i = 0; i < seq.length; i++) {
      setActiveButton(seq[i]);
      await new Promise(r => setTimeout(r, 600));
      setActiveButton(null);
      await new Promise(r => setTimeout(r, 200));
    }
    
    setIsShowingSequence(false);
    setGameState('playing');
    setPlayerSequence([]);
  };

  const handleButtonClick = (index: number) => {
    if (gameState !== 'playing') return;

    setActiveButton(index);
    setTimeout(() => setActiveButton(null), 200);

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = newPlayerSequence.length - 1;
    
    if (sequence[currentIndex] !== index) {
      setGameState('gameover');
      if (score > 0) {
        onComplete(score);
      }
      toast.error(`Game Over! You reached level ${sequence.length}`);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      const points = sequence.length * 15;
      setScore(s => s + points);
      toast.success(`Level ${sequence.length} complete! +${points} points`);
      setTimeout(() => addToSequence(sequence), 1000);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Sequence Memory</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Level: {sequence.length || 0}</span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning" />
            {score}
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {gameState === 'idle' && 'Press Start to begin'}
          {gameState === 'showing' && 'Watch the sequence...'}
          {gameState === 'playing' && 'Repeat the sequence!'}
          {gameState === 'gameover' && `Game Over! Final score: ${score}`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        {colors.map((color, i) => (
          <button
            key={i}
            onClick={() => handleButtonClick(i)}
            disabled={gameState !== 'playing'}
            className={cn(
              "aspect-square rounded-2xl transition-all duration-150 border-4",
              activeButton === i ? color.active : color.bg,
              color.border,
              activeButton === i && "scale-95 shadow-lg",
              gameState === 'playing' && "hover:scale-95 cursor-pointer"
            )}
          />
        ))}
      </div>

      <div className="flex justify-center">
        {(gameState === 'idle' || gameState === 'gameover') && (
          <Button onClick={startGame} className="gap-2">
            <Zap className="w-4 h-4" />
            {gameState === 'gameover' ? 'Play Again' : 'Start Game'}
          </Button>
        )}
      </div>

      {sequence.length > 0 && (
        <div className="space-y-1">
          <Progress value={(playerSequence.length / sequence.length) * 100} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {playerSequence.length}/{sequence.length} in sequence
          </p>
        </div>
      )}
    </div>
  );
}
