import { useState } from "react";
import { motion } from "framer-motion";
import farmyardImage from "@/assets/farmyard.jpg";
import playgroundImage from "@/assets/playground.jpg";
import dinosaursImage from "@/assets/dinosaurs.jpg";
import harbourImage from "@/assets/harbour.jpg";
import fireEngineImage from "@/assets/fire-engine.jpg";
import steamTrainImage from "@/assets/steam-train.jpg";
import towerBridgeImage from "@/assets/tower-bridge.jpg";
import wildHorsesImage from "@/assets/wild-horses.jpg";

export interface PuzzleOption {
  id: string;
  name: string;
  emoji: string;
  image: string;
}

const puzzlesPage1: PuzzleOption[] = [
  { id: "farmyard", name: "Farmyard", emoji: "🐄", image: farmyardImage },
  { id: "playground", name: "Playground", emoji: "🛝", image: playgroundImage },
  { id: "dinosaurs", name: "Dinosaurs", emoji: "🦕", image: dinosaursImage },
  { id: "harbour", name: "Harbour", emoji: "⛵", image: harbourImage },
];

const puzzlesPage2: PuzzleOption[] = [
  { id: "fire-engine", name: "Fire Engine", emoji: "🚒", image: fireEngineImage },
  { id: "steam-train", name: "Steam Train", emoji: "🚂", image: steamTrainImage },
  { id: "tower-bridge", name: "Tower Bridge", emoji: "🌉", image: towerBridgeImage },
  { id: "wild-horses", name: "Wild Horses", emoji: "🐴", image: wildHorsesImage },
];

export const puzzles: PuzzleOption[] = [...puzzlesPage1, ...puzzlesPage2];

interface PuzzleSelectorProps {
  onSelect: (puzzle: PuzzleOption) => void;
}

const PuzzleSelector = ({ onSelect }: PuzzleSelectorProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const currentPuzzles = currentPage === 1 ? puzzlesPage1 : puzzlesPage2;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
      style={{ background: "linear-gradient(180deg, hsl(200 80% 75%) 0%, hsl(45 60% 90%) 100%)" }}
    >
      <motion.h1
        className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textShadow: "2px 2px 4px hsla(0, 0%, 100%, 0.5)" }}
      >
        🧩 Choose a Puzzle! 🧩
      </motion.h1>

      <motion.p
        className="font-body text-lg md:text-xl text-muted-foreground mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Tap on a picture to start playing!
      </motion.p>

      <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl">
        {currentPuzzles.map((puzzle, index) => (
          <motion.button
            key={puzzle.id}
            onClick={() => onSelect(puzzle)}
            className="relative rounded-2xl overflow-hidden group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: "0 8px 30px hsla(25, 50%, 20%, 0.25)",
            }}
          >
            <img
              src={puzzle.image}
              alt={puzzle.name}
              className="w-full aspect-square object-cover"
            />
            <div
              className="absolute inset-0 flex items-end justify-center pb-3 transition-opacity group-hover:opacity-100"
              style={{
                background: "linear-gradient(to top, hsla(0, 0%, 0%, 0.6), transparent)",
              }}
            >
              <span className="font-display text-lg md:text-2xl font-bold text-white drop-shadow-lg">
                {puzzle.emoji} {puzzle.name}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-8">
        <motion.button
          onClick={() => setCurrentPage(1)}
          className={`px-6 py-3 rounded-full font-display text-lg font-bold transition-all ${
            currentPage === 1
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-white/50 text-foreground hover:bg-white/80"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Page 1
        </motion.button>
        <motion.button
          onClick={() => setCurrentPage(2)}
          className={`px-6 py-3 rounded-full font-display text-lg font-bold transition-all ${
            currentPage === 2
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-white/50 text-foreground hover:bg-white/80"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Page 2
        </motion.button>
      </div>
    </div>
  );
};

export default PuzzleSelector;
