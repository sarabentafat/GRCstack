
import React, { useState } from "react";
import Flashcard from "../components/FlashCard";

const flashcards = [
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is 2 + 2?", answer: "4" },
  { question: "What is the largest ocean?", answer: "Pacific Ocean" },
  // Add more flashcards as needed
];

const  FlashCards=()=> {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [borderColor, setBorderColor] = useState("");

  const handleNextCard = () => {
    setBorderColor("");
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handleCorrect = () => {
    setBorderColor("border-green-500");
    setTimeout(handleNextCard, 500);
  };

  const handleIncorrect = () => {
    setBorderColor("border-red-500");
    setTimeout(handleNextCard, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Flashcard
        question={flashcards[currentCardIndex].question}
        answer={flashcards[currentCardIndex].answer}
        handleCorrect={handleCorrect}
        handleIncorrect={handleIncorrect}
        borderColor={borderColor}
      />
    </div>
  );
}

export default FlashCards;
