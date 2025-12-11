import { useState } from "react";
import PuzzleGame from "@/components/PuzzleGame";
import PuzzleSelector, { PuzzleOption } from "@/components/PuzzleSelector";
import { Helmet } from "react-helmet";

const Index = () => {
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleOption | null>(null);

  return (
    <>
      <Helmet>
        <title>Jigsaw Puzzles - Fun Games for Kids</title>
        <meta name="description" content="Fun and colorful jigsaw puzzle games for children. Choose from farmyard, playground, dinosaurs and more! Drag and drop pieces to complete the picture!" />
      </Helmet>
      {selectedPuzzle ? (
        <PuzzleGame puzzle={selectedPuzzle} onBack={() => setSelectedPuzzle(null)} />
      ) : (
        <PuzzleSelector onSelect={setSelectedPuzzle} />
      )}
    </>
  );
};

export default Index;
