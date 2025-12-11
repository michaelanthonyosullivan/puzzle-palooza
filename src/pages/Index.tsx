import PuzzleGame from "@/components/PuzzleGame";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Farmyard Puzzle - Fun Jigsaw Game for Kids</title>
        <meta name="description" content="A fun and colorful farmyard jigsaw puzzle game for children. Drag and drop pieces to complete the picture!" />
      </Helmet>
      <PuzzleGame />
    </>
  );
};

export default Index;
