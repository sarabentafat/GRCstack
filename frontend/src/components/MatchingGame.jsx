import React, { useState, useEffect } from "react";
import shuffle from "lodash/shuffle";
import game from "../assets/images/game.svg";
import { MdOutlineSettings } from "react-icons/md";
import { FaTimes } from "react-icons/fa";

const calculateRounds = (numQuestions) => {
  return Math.ceil(numQuestions / 5); // Example: 5 questions per round
};

const MatchingGame = ({ questions, onClose }) => {
  const [matchedItem,setMatchedItem]=useState(1)
  const [allMatched, setAllMatched] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [matches, setMatches] = useState({});
  const [feedback, setFeedback] = useState({});
  const [shuffledItems, setShuffledItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800000); // Default 30min par default
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [rounds, setRounds] = useState(1); // Default 1 round
  const [currentRound, setCurrentRound] = useState(1); // Track current round
  const [customTimer, setCustomTimer] = useState(30); // Custom timer input value
  const [showPopup, setShowPopup] = useState(false); // State for controlling the popup visibility
  const [isPaused, setIsPaused] = useState(false); // State for controlling the pause
  const [disappearingItems, setDisappearingItems] = useState([]); // State to track items to disappear

  const resetGame = () => {
    setSelectedItems([]);
    setMatches({});
    setFeedback({});
    setIsProcessing(false);
    setDisappearingItems([]);
    const numQuestionsPerRound = 5; // Number of questions per round
    const startIndex = (currentRound - 1) * numQuestionsPerRound;
    const endIndex = startIndex + numQuestionsPerRound;

    const currentRoundQuestions = questions.slice(startIndex, endIndex);
    const currentRoundItems = shuffle([
      ...currentRoundQuestions.map((q) => ({ ...q, key: `question-${q._id}` })),
      ...currentRoundQuestions.flatMap((q) =>
        q.options
          .filter((o) => o.isCorrect)
          .map((o, i) => ({ ...o, key: `answer-${q._id}-${i}` }))
      ),
    ]);
    setShuffledItems(currentRoundItems);
    setShowPopup(false);
  };

  useEffect(() => {
    if (gameStarted) {
      resetGame();
    }
  }, [gameStarted, currentRound]);

useEffect(() => {
  if (allMatched){
    setGameOver(true)
  }
    if (gameStarted && !allMatched) {
      if (timeLeft <= 0) {
        setGameOver(true); // Set gameOver state to true
        setTimeLeft(0); // Make sure timeLeft doesn't go below 0
      } else {
        const timerId = setInterval(() => {
          setTimeLeft((prev) => Math.max(prev - 100, 0)); // Decrease by 100 ms
        }, 100); // Interval set to 100 ms

        return () => clearInterval(timerId); // Clear interval on cleanup
      }
    }
}, [timeLeft, gameStarted, isPaused]);

  useEffect(() => {
    const numRounds = calculateRounds(questions.length);
    setRounds(numRounds);
  }, [questions]);

  const handleSelect = (item) => {
    if (isProcessing || selectedItems.length >= 2 || gameOver) return;

    const newSelectedItems = [...selectedItems, item];
    setSelectedItems(newSelectedItems);

    if (newSelectedItems.length === 2) {
      setIsProcessing(true);
      checkMatch(newSelectedItems[0], newSelectedItems[1]);
    }
  };

 
const formatTime = (newTimeMilliseconds) => {
  const minutes = Math.floor(newTimeMilliseconds / 1000 / 60);
  const seconds = Math.floor((newTimeMilliseconds / 1000) % 60); // Seconds relative to minutes
  const milliseconds = newTimeMilliseconds % 1000; // Extract milliseconds

  // Pad seconds and milliseconds for consistent formatting (e.g., 01:09:123)
  const paddedSeconds = String(seconds).padStart(2, "0");
  const paddedMilliseconds = String(milliseconds).padStart(3, "0");

  return `${minutes}:${paddedSeconds}:${paddedMilliseconds}`;
};




  const checkMatch = (item1, item2) => {
    const questionId1 = item1.key.split("-")[1];
    const questionId2 = item2.key.split("-")[1];

    const isSameQuestion = questionId1 === questionId2;
    const isAnswer1 = !item1.key.startsWith("question");
    const isAnswer2 = !item2.key.startsWith("question");

    const isCorrectMatch =
      (isAnswer1 && isAnswer2 && isSameQuestion) ||
      (isAnswer1 && !isAnswer2 && item2.key.includes(questionId1)) ||
      (isAnswer2 && !isAnswer1 && item1.key.includes(questionId2));

    if (isCorrectMatch) {
      
       setMatchedItem((prevMatchedItem) => prevMatchedItem + 1);
      console.log(matchedItem);
      setMatches((prevMatches) => ({
        ...prevMatches,
        [item1.key]: item2.key,
        [item2.key]: item1.key,
      }));
      setDisappearingItems((prev) => [...prev, item1.key, item2.key]);
    }

    setFeedback({ item1, item2, isMatch: isCorrectMatch });

    setTimeout(() => {
      setSelectedItems([]);
      setIsProcessing(false);
    }, 1000);

    const allPairsMatched = questions.length === matchedItem;
  setAllMatched(allPairsMatched);
  
    if (allPairsMatched) {
       
         setGameOver(false);
      
      setIsPaused()
      if (currentRound < rounds) {
        setCurrentRound((prevRound) => prevRound + 1);
        resetGame();
      } else {
        setGameOver(true);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(customTimer*60*1000);
  };

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
    setIsPaused((prev) => !prev);
  };
const handleTimeChange = (value) => {
  const numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    setCustomTimer(numericValue); // Update state with a valid number
  }
};



  // const getMatchedPairs = () => {
  //   return Object.entries(matches).reduce((acc, [key, value]) => {
  //     if (key.startsWith("question")) {
  //       const question = shuffledItems.find((item) => item.key === key);
  //       const answer = shuffledItems.find((item) => item.key === value);
  //       if (question && answer) {
  //         acc.push({ question, answer });
  //       }
  //     }
  //     return acc;
  //   }, []);
  // };

  useEffect(() => {

    if (Object.keys(matches).length === questions.length * 2) {
      console.log("length",Object.keys(matches).length)
      setAllMatched(true);
        setGameOver(true);

    }
  }, [matches]);

  return (
    <div className="h-full w-full relative">
      <div className="flex text-gray-500 font-bold justify-between text-xl items-center px-8 py-4">
        <div>Learn</div>
        <div>
          <p>
            Round : {currentRound} / {rounds}
            <p className="text-sm text-bluemain">{formatTime(timeLeft)}</p>
          </p>
        </div>
        <div className="flex">
          <MdOutlineSettings
            className="cursor-pointer"
            onClick={togglePopup}
            size={24}
          />
          <button onClick={onClose}>
            <FaTimes size={24} />
          </button>
        </div>
      </div>
      {!gameStarted ? (
        <div className="flex items-center justify-center h-full mx-5 text-center">
          <div className="flex gap-6 flex-col justify-center items-center">
            <img src={game} alt="game" className="w-48" />
            <h1 className="text-xl font-bold">Prêt à jouer ?</h1>
            <div>
              <p className="text-lg">
                Associez tous les termes à leurs définitions aussi vite que
                possible
              </p>
            </div>
            <form>
              <div>
                <label className="block">Nombre de rounds :</label>
                <input
                  type="number"
                  value={rounds}
                  onChange={(e) => setRounds(parseInt(e.target.value, 10))}
                  className="px-2 py-1 rounded dark:bg-second"
                  readOnly
                />
              </div>
              <div>
                <label className="block">Durée du timer (en minutes) :</label>
                <input
                  type="number"
                  value={customTimer}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="px-2 py-1 rounded dark:bg-second"
                />
              </div>
            </form>
            <button
              onClick={startGame}
              className="px-24 font-semibold py-4 bg-blue-500 text-white rounded-lg"
            >
              Commencer
            </button>
          </div>
        </div>
      ) : (
        <div className=" w-[90%] md:w-[75%] mt-10 mx-auto  h-[80%]">
          <div className="grid h-full  grid-cols-3 lg:grid-cols-4 gap-3  ">
            {shuffledItems.map(
              (item) =>
                item &&
                item.key && (
                  <div
                    key={item.key}
                    onClick={() => handleSelect(item)}
                    className={`  ${
                      disappearingItems.includes(item.key)
                        ? "bg-green-50 dark:bg-green-950 border-green-500 opacity-0 transition-opacity duration-1000 ease-out"
                        : "bg-white dark:bg-second"
                    } ${
                      selectedItems.includes(item)
                        ? "border border-blue-500 "
                        : ""
                    } flex   justify-center items-center shadow text-center text-sm p-5 rounded-md cursor-pointer`}
                  >
                    {item.key.startsWith("question")
                      ? item.questionText
                      : item.optionText}
                  </div>
                )
            )}
          </div>
          {gameOver && (
            <div className="absolute top-20  w-full h-screen bg-blue-50  flex items-center justify-center">
              <div className="text-center bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Jeu terminé !</h2>
                <p className="text-lg">
                  Félicitations ! Vous avez terminé le jeu.
                </p>
                <p className="text-lg">Résultats :</p>
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setGameOver(false);
                    setCurrentRound(1);
                    setAllMatched(false);
                  }}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Rejouer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="dark:bg-second bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Paramètres du jeu</h2>
            <form>
              <div className="mb-4">
                <label className="block mb-2">
                  Durée du timer (en secondes) :
                </label>
                <input
                  type="number"
                  value={customTimer}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="px-2 py-1 rounded dark:bg-second"
                />
              </div>
            </form>
            <button
              onClick={togglePopup}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingGame;
