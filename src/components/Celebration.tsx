import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CelebrationProps {
  show: boolean;
  onPlayAgain: () => void;
}

const Celebration = ({ show, onPlayAgain }: CelebrationProps) => {
  const [balloons, setBalloons] = useState<{ id: number; x: number; color: string }[]>([]);
  const [stars, setStars] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  const balloonColors = [
    "hsl(0 70% 55%)",      // Red
    "hsl(45 100% 60%)",    // Yellow
    "hsl(120 50% 50%)",    // Green
    "hsl(200 80% 60%)",    // Blue
    "hsl(280 60% 60%)",    // Purple
    "hsl(30 100% 60%)",    // Orange
  ];

  useEffect(() => {
    if (show) {
      // Generate balloons
      const newBalloons = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
      }));
      setBalloons(newBalloons);

      // Generate stars
      const newStars = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setStars(newStars);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ background: "hsla(200, 80%, 70%, 0.95)" }}
        >
          {/* Floating Balloons */}
          {balloons.map((balloon) => (
            <motion.div
              key={balloon.id}
              className="absolute bottom-0"
              style={{ left: `${balloon.x}%` }}
              initial={{ y: "100vh" }}
              animate={{ y: "-100vh" }}
              transition={{
                duration: 4 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
            >
              <svg width="50" height="70" viewBox="0 0 50 70">
                <ellipse cx="25" cy="25" rx="22" ry="25" fill={balloon.color} />
                <path
                  d="M25 50 Q25 55 23 70"
                  stroke="hsl(25 30% 40%)"
                  strokeWidth="2"
                  fill="none"
                />
                <ellipse cx="25" cy="25" rx="8" ry="10" fill="hsla(0, 0%, 100%, 0.3)" />
              </svg>
            </motion.div>
          ))}

          {/* Sparkling Stars */}
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 1, 1.5, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: star.delay,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
                <path
                  d="M20 0 L23 15 L40 20 L23 25 L20 40 L17 25 L0 20 L17 15 Z"
                  fill="hsl(45 100% 60%)"
                />
              </svg>
            </motion.div>
          ))}

          {/* Bells */}
          <motion.div
            className="absolute top-8 left-8"
            animate={{ rotate: [0, 15, -15, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60">
              <path
                d="M30 5 C30 5 20 10 20 25 L15 45 L45 45 L40 25 C40 10 30 5 30 5"
                fill="hsl(45 100% 50%)"
                stroke="hsl(35 80% 40%)"
                strokeWidth="2"
              />
              <circle cx="30" cy="48" r="5" fill="hsl(35 80% 40%)" />
              <ellipse cx="30" cy="5" rx="4" ry="3" fill="hsl(35 80% 40%)" />
            </svg>
          </motion.div>

          <motion.div
            className="absolute top-8 right-8"
            animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5, delay: 0.25 }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60">
              <path
                d="M30 5 C30 5 20 10 20 25 L15 45 L45 45 L40 25 C40 10 30 5 30 5"
                fill="hsl(45 100% 50%)"
                stroke="hsl(35 80% 40%)"
                strokeWidth="2"
              />
              <circle cx="30" cy="48" r="5" fill="hsl(35 80% 40%)" />
              <ellipse cx="30" cy="5" rx="4" ry="3" fill="hsl(35 80% 40%)" />
            </svg>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="text-center z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.3,
            }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-display font-bold mb-8 text-sunny drop-shadow-lg"
              style={{
                textShadow: "4px 4px 0 hsl(35 80% 45%), 8px 8px 0 hsl(30 70% 40%)",
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            >
              WELL DONE!
            </motion.h1>

            <motion.div
              className="flex justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {["🌟", "🎉", "⭐", "🎊", "✨"].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="text-4xl md:text-5xl"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>

            <motion.button
              className="go-button text-xl md:text-2xl"
              onClick={onPlayAgain}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Again! 🔄
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Celebration;
