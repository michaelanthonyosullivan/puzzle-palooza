import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Celebration from "./Celebration";
import { PuzzleOption } from "./PuzzleSelector";
import { unlockAudio, playSnap } from "@/hooks/useCelebrationSound";

interface PuzzlePiece {
  id: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  isPlaced: boolean;
  row: number;
  col: number;
}

interface Difficulty {
  id: string;
  name: string;
  rows: number;
  cols: number;
}

const DIFFICULTIES: Difficulty[] = [
  { id: "easy", name: "Easy", rows: 2, cols: 3 },
  { id: "medium", name: "Medium", rows: 3, cols: 4 },
  { id: "hard", name: "Hard", rows: 4, cols: 5 },
];

const SNAP_THRESHOLD_RATIO = 0.4;

// Format seconds as M:SS
const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// Award 1-3 stars based on time per piece (easy/medium/hard have different piece counts)
const getStars = (seconds: number, pieceCount: number): number => {
  const perPiece = seconds / pieceCount;
  if (perPiece <= 4) return 3;
  if (perPiece <= 8) return 2;
  return 1;
};

interface PuzzleGameProps {
  puzzle: PuzzleOption;
  onBack: () => void;
  onNext: () => void;
}

const PuzzleGame = ({ puzzle, onBack, onNext }: PuzzleGameProps) => {
  const [gameState, setGameState] = useState<"start" | "playing" | "complete">("start");
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [pieceSize, setPieceSize] = useState({ width: 0, height: 0 });
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES[0]);
  const [elapsed, setElapsed] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const ROWS = difficulty.rows;
  const COLS = difficulty.cols;
  const SNAP_THRESHOLD = Math.min(pieceSize.width, pieceSize.height) * SNAP_THRESHOLD_RATIO;

  // Load image and get its natural aspect ratio
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageAspectRatio(img.naturalWidth / img.naturalHeight);
    };
    img.src = puzzle.image;
  }, [puzzle.image]);

  // Calculate dimensions based on container size and actual image aspect ratio
  useEffect(() => {
    if (!imageAspectRatio) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const maxWidth = Math.min(window.innerWidth - 32, 700);
        const maxHeight = window.innerHeight * 0.5;
        
        let width = maxWidth;
        let height = width / imageAspectRatio;
        
        // If height is too tall, constrain by height
        if (height > maxHeight) {
          height = maxHeight;
          width = height * imageAspectRatio;
        }
        
        setDimensions({ width, height });
        setPieceSize({ width: width / COLS, height: height / ROWS });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [imageAspectRatio, ROWS, COLS]);

  const initializePuzzle = useCallback(() => {
    const newPieces: PuzzlePiece[] = [];
    const { width, height } = dimensions;
    const pw = width / COLS;
    const ph = height / ROWS;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const id = row * COLS + col;
        const correctX = col * pw;
        const correctY = row * ph;

        // Scatter pieces randomly around the play area
        const scatterX = Math.random() * (width - pw);
        const scatterY = height + 50 + Math.random() * 200;

        newPieces.push({
          id,
          correctX,
          correctY,
          currentX: scatterX,
          currentY: scatterY,
          isPlaced: false,
          row,
          col,
        });
      }
    }

    // Shuffle the pieces array
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i].currentX, newPieces[j].currentX] = [newPieces[j].currentX, newPieces[i].currentX];
      [newPieces[i].currentY, newPieces[j].currentY] = [newPieces[j].currentY, newPieces[i].currentY];
    }

    setPieces(newPieces);
    setGameState("playing");
  }, [dimensions, difficulty]);

  // Load best time for this puzzle from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`puzzle-best-${puzzle.id}`);
    setBestTime(stored ? Number(stored) : null);
  }, [puzzle.id]);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setElapsed(0);
    stopTimer();
    timerIntervalRef.current = window.setInterval(() => {
      if (startTimeRef.current !== null) {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);
    const handleStart = () => {
      // Unlock audio on iOS/mobile - must happen in user interaction handler
      unlockAudio();
      startTimer();
      initializePuzzle();
    };

    const handlePlayAgain = () => {
      setGameState("start");
      setPieces([]);
      stopTimer();
      setElapsed(0);
    };

  const handleBackToMenu = () => {
    onBack();
  };

  const handleSelectDifficulty = (d: Difficulty) => {
    setDifficulty(d);
  };

  const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, pieceId: number) => {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece || piece.isPlaced) return;

    e.preventDefault();
    const pos = getEventPosition(e);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggingPiece(pieceId);
    setDragOffset({
      x: pos.x - rect.left - piece.currentX,
      y: pos.y - rect.top - piece.currentY,
    });
  };

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (draggingPiece === null) return;

      const pos = "touches" in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const newX = pos.x - rect.left - dragOffset.x;
      const newY = pos.y - rect.top - dragOffset.y;

      setPieces((prev) =>
        prev.map((p) =>
          p.id === draggingPiece
            ? { ...p, currentX: newX, currentY: newY }
            : p
        )
      );
    },
    [draggingPiece, dragOffset]
  );

  const handleDragEnd = useCallback(() => {
    if (draggingPiece === null) return;

    setPieces((prev) => {
      const updated = prev.map((piece) => {
        if (piece.id !== draggingPiece) return piece;

        const dx = Math.abs(piece.currentX - piece.correctX);
        const dy = Math.abs(piece.currentY - piece.correctY);

        if (dx < SNAP_THRESHOLD && dy < SNAP_THRESHOLD) {
          playSnap();
          return {
            ...piece,
            currentX: piece.correctX,
            currentY: piece.correctY,
            isPlaced: true,
          };
        }
        return piece;
      });

      // Check if puzzle is complete
      const isComplete = updated.every((p) => p.isPlaced);
      if (isComplete) {
        stopTimer();
        const finalTime = startTimeRef.current
          ? Math.floor((Date.now() - startTimeRef.current) / 1000)
          : elapsed;
        setElapsed(finalTime);
        // Save best time (lower is better)
        setBestTime((prevBest) => {
          if (prevBest === null || finalTime < prevBest) {
            localStorage.setItem(`puzzle-best-${puzzle.id}`, String(finalTime));
            return finalTime;
          }
          return prevBest;
        });
        setTimeout(() => setGameState("complete"), 300);
      }

      return updated;
    });

    setDraggingPiece(null);
  }, [draggingPiece]);

  useEffect(() => {
    if (draggingPiece !== null) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("touchend", handleDragEnd);

      return () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDragMove);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [draggingPiece, handleDragMove, handleDragEnd]);

  const placedCount = pieces.filter((p) => p.isPlaced).length;

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
      style={{ background: "linear-gradient(180deg, hsl(200 80% 75%) 0%, hsl(45 60% 90%) 100%)" }}
    >
      <motion.h1
        className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textShadow: "2px 2px 4px hsla(0, 0%, 100%, 0.5)" }}
      >
        {puzzle.emoji} {puzzle.name} Puzzle {puzzle.emoji}
      </motion.h1>

      {gameState === "playing" && (
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            onClick={handleBackToMenu}
            className="font-display text-lg font-bold px-5 py-2 rounded-full transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "hsl(var(--muted))",
              color: "hsl(var(--muted-foreground))",
              boxShadow: "0 4px 15px hsla(0, 0%, 0%, 0.1)",
            }}
          >
            ← Menu
          </motion.button>
          <motion.div
            className="font-display text-xl md:text-2xl text-primary font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Pieces placed: {placedCount} / {ROWS * COLS} · ⏱ {formatTime(elapsed)}
          </motion.div>
        </div>
      )}

      <div
        className="relative bg-card rounded-3xl overflow-visible"
        style={{
          width: dimensions.width,
          height: gameState === "playing" ? dimensions.height + 300 : dimensions.height,
          boxShadow: "0 12px 40px hsla(25, 50%, 20%, 0.2)",
          transition: "height 0.5s ease",
        }}
      >
        {/* Puzzle Target Area */}
        <div
          className="absolute top-0 left-0 rounded-2xl overflow-hidden"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            background: gameState === "playing" ? "hsla(45, 30%, 85%, 0.5)" : "transparent",
            border: gameState === "playing" ? "4px dashed hsla(25, 50%, 50%, 0.3)" : "none",
          }}
        >
          {gameState === "start" && (
            <motion.img
              src={puzzle.image}
              alt={puzzle.name}
              className="w-full h-full object-cover"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Onionskin template - shows faded original image as guide */}
          {gameState === "playing" && (
            <img
              src={puzzle.image}
              alt="Guide"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ opacity: 0.2 }}
            />
          )}

          {/* Grid overlay for placement hints */}
          {gameState === "playing" && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: ROWS * COLS }).map((_, i) => {
                const row = Math.floor(i / COLS);
                const col = i % COLS;
                const piece = pieces.find((p) => p.row === row && p.col === col);
                return (
                  <div
                    key={i}
                    className="absolute border border-dashed transition-colors duration-300"
                    style={{
                      left: col * pieceSize.width,
                      top: row * pieceSize.height,
                      width: pieceSize.width,
                      height: pieceSize.height,
                      borderColor: piece?.isPlaced
                        ? "transparent"
                        : "hsla(25, 50%, 50%, 0.2)",
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Puzzle Pieces */}
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            className={`puzzle-piece ${piece.isPlaced ? "correct" : ""}`}
            style={{
              width: pieceSize.width,
              height: pieceSize.height,
              left: piece.currentX,
              top: piece.currentY,
              zIndex: draggingPiece === piece.id ? 100 : piece.isPlaced ? 1 : 10,
              backgroundImage: `url(${puzzle.image})`,
              backgroundSize: `${dimensions.width}px ${dimensions.height}px`,
              backgroundPosition: `-${piece.col * pieceSize.width}px -${piece.row * pieceSize.height}px`,
              touchAction: "none",
            }}
            initial={{ scale: 0, rotate: Math.random() * 20 - 10 }}
            animate={{
              scale: 1,
              rotate: piece.isPlaced ? 0 : 0,
              boxShadow: piece.isPlaced
                ? "none"
                : draggingPiece === piece.id
                ? "0 12px 30px hsla(25, 50%, 20%, 0.4)"
                : "0 4px 12px hsla(25, 50%, 20%, 0.3)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onMouseDown={(e) => handleDragStart(e, piece.id)}
            onTouchStart={(e) => handleDragStart(e, piece.id)}
          />
        ))}
      </div>

      {gameState === "start" && (
        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold text-foreground">Difficulty:</span>
            {DIFFICULTIES.map((d) => (
              <motion.button
                key={d.id}
                onClick={() => handleSelectDifficulty(d)}
                className={`px-5 py-2 rounded-full font-display text-lg font-bold transition-all ${
                  difficulty.id === d.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-white/50 text-foreground hover:bg-white/80"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {d.name}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-4">
            <motion.button
              className="px-6 py-3 rounded-full font-display text-lg font-bold transition-all"
              onClick={handleBackToMenu}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "hsl(var(--muted))",
                color: "hsl(var(--muted-foreground))",
                boxShadow: "0 4px 15px hsla(0, 0%, 0%, 0.1)",
              }}
            >
              ← Back
            </motion.button>
            <motion.button
              className="go-button"
              onClick={handleStart}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95, y: 4 }}
            >
              Go! 🚀
            </motion.button>
          </div>
        </div>
      )}

      <Celebration
        show={gameState === "complete"}
        onPlayAgain={handlePlayAgain}
        onNext={onNext}
        time={elapsed}
        bestTime={bestTime}
        stars={getStars(elapsed, ROWS * COLS)}
      />
    </div>
  );
};

export default PuzzleGame;
