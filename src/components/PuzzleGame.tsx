import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import farmyardImage from "@/assets/farmyard.jpg";
import Celebration from "./Celebration";

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

const ROWS = 2;
const COLS = 5;
const SNAP_THRESHOLD = 30;

const PuzzleGame = () => {
  const [gameState, setGameState] = useState<"start" | "playing" | "complete">("start");
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [pieceSize, setPieceSize] = useState({ width: 0, height: 0 });

  // Calculate dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const maxWidth = Math.min(window.innerWidth - 32, 700);
        const maxHeight = window.innerHeight * 0.5;
        const aspectRatio = 1148 / 640; // Original image aspect ratio
        
        let width = maxWidth;
        let height = width / aspectRatio;
        
        // If height is too tall, constrain by height
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
        
        setDimensions({ width, height });
        setPieceSize({ width: width / COLS, height: height / ROWS });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

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
  }, [dimensions]);

  const handleStart = () => {
    initializePuzzle();
  };

  const handlePlayAgain = () => {
    setGameState("start");
    setPieces([]);
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
        🐄 Farmyard Puzzle 🐑
      </motion.h1>

      {gameState === "playing" && (
        <motion.div
          className="mb-4 font-display text-xl md:text-2xl text-primary font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Pieces placed: {placedCount} / {ROWS * COLS}
        </motion.div>
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
              src={farmyardImage}
              alt="Farmyard scene with animals"
              className="w-full h-full object-cover"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
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
              backgroundImage: `url(${farmyardImage})`,
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
        <motion.button
          className="go-button mt-8"
          onClick={handleStart}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, y: 4 }}
        >
          Go! 🚀
        </motion.button>
      )}

      <Celebration show={gameState === "complete"} onPlayAgain={handlePlayAgain} />
    </div>
  );
};

export default PuzzleGame;
