import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import { FaTimes, FaStar, FaRegStar } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addPoints, updateStreak } from "../redux/apiCalls/profileApiCall";
import gem from "../assets/icons/gem.png";
import circle from "../assets/icons/circle.png"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./FlipCard.css";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import Streak from "./Streak";
import { toggleStarQuestion } from "../redux/apiCalls/packetApiCall";
import { FaArrowLeft } from "react-icons/fa";
const Flashcard = ({ questions, onClose,packetId }) => {
    const [clicked, setClicked] = useState(false);
    const [initialRender, setInitialRender] = useState(true);
      const [showArrows, setShowArrows] = useState(true);
      const [showArrowsSmartLearning,setArrowsSmartLearning]=useState(false)

      // Toggle the arrow display when the Smart learning button is clicked
      const handleSmartLearningClick = () => {
        console.log("hhh")
        setShowArrows(!showArrows);
        setArrowsSmartLearning(!showArrowsSmartLearning)
      };


  // Effect to change the state after the first render and set a timer to hide the message
  useEffect(() => {
    if (initialRender) {
      setTimeout(() => {
        setInitialRender(false); // Disable the animation after 3 seconds
      
      }, 3000); // Keep the pulse effect for 3 seconds
    }
  }, [initialRender]);

  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const totalScore = useSelector((state) => state.profile.totalScore);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [borderColor, setBorderColor] = useState("");
  const [responses, setResponses] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [pointsAdded, setPointsAdded] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false); // State for filter popup
  const [onlyStarred, setOnlyStarred] = useState(false); // State for filter option
 
  const points = 10;
    const [questionsa, setQuestions] = useState([]);
  const isAlreadyStreak = useSelector((state) => state.profile.isAlready);
   const isStarred = (question) => {
     return question?.starredBy?.includes(authUser?._id);
   };
 
  const handleToggleStar = (questionId) => {
    console.log(questionId)

 
    // Update local state first
    setQuestions((prevQuestions) =>
  
      prevQuestions.map((q) =>
            
        q._id === questionId
          ? {
              ...q,
              starredBy: q.starredBy?.includes(authUser._id)
                ? q.starredBy.filter((id) => id !== authUser._id)
                : [...q.starredBy, authUser._id],
            }
          : q
      )
    );
    // Dispatch the action to update the server
    dispatch(toggleStarQuestion(packetId, questionId));
  };
  useEffect(() => {
    if (authUser?._id && showStats) {
      if (dispatch(addPoints(authUser._id, points))) {
        setPointsAdded(points);
      }
      dispatch(updateStreak(authUser._id));
      console.log(isAlreadyStreak);
      if (!isAlreadyStreak) {
        console.log("Streak updated");
        addStreak();
      }
    }
  }, [dispatch, authUser?._id, showStats]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const addStreak = () => {
    setVisible(true);
  };

  const handleFadeOut = () => {
 nextQuestion();
  
  };
    const handleFade = () => {
      beforeQuestion();
    };

  const nextQuestion = () => {
    const newIndex = currentQuestionIndex + 1;
    if (newIndex < filteredQuestions.length) {
      setCurrentQuestionIndex(newIndex);
      setIsFlipped(false);
    } else {
      setShowStats(true);
    }
  };
    const beforeQuestion = () => {
      const newIndex = currentQuestionIndex - 1;
      if (newIndex < filteredQuestions.length) {
        setCurrentQuestionIndex(newIndex);
        setIsFlipped(false);
      } else {
        setShowStats(true);
      }
    };

  const calculateStatistics = () => {
    const correctAnswers = responses.filter((response) => response).length;
    const totalQuestions = filteredQuestions.length;
    return {
      correctAnswers,
      totalQuestions,
      score: Math.round((correctAnswers / totalQuestions) * 100),
    };
  };

  const filteredQuestions = onlyStarred
    ? questions.filter((question) => question.starredBy?.includes(authUser._id))
    : questions;

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const totalQuestions = filteredQuestions.length;

  const handleFilterChange = (filterStarred) => {
    setOnlyStarred(filterStarred);
    setShowFilterPopup(false); // Close popup after selection
    setCurrentQuestionIndex(0); // Reset question index
  };

  if (showStats) {
    const { correctAnswers, totalQuestions, score } = calculateStatistics();
    return (
      <div className="w-full h-full ">
        <div className="flex  text-gray-500 font-bold justify-between text-xl items-center px-8 py-4">
          <div>Learn</div>
          <div>
            <p>
              {currentQuestionIndex + 1}/{totalQuestions}
            </p>
          </div>
          <div className="flex">
            <MdOutlineSettings
              className="cursor-pointer"
              size={24}
              onClick={() => setShowFilterPopup(true)}
            />
            <button onClick={onClose}>
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <Streak
          message="Vous avez atteint une nouvelle streak!"
          visible={visible}
        />

        <div className="absolute dark:text-white h-screen flex justify-center items-center top-8 left-1 w-full text-blue-600 text-xl">
          <div className="text-center">
            <p className="mb-12 text-5xl text-green-600 font-bold">
              Bravo pour votre révision !
            </p>
            <p>Continue a aprendre
              or a random quote here idk</p> 
            {/* <div className="mt-4 flex items-center gap-4">
              <CircularProgressbar
                className="w-48"
                value={score}
                text={`${score}%`}
                styles={buildStyles({
                  pathColor: score >= 75 ? "green" : "green",
                  textColor: "green",
                  trailColor: "lightgreen",
                })}
              />
              <div className="font-bold text-2xl flex flex-col justify-start">
                <p className="text-green-500">{correctAnswers} Correct</p>
                <p className="text-red-500 ml-3">
                  {totalQuestions - correctAnswers} Incorrect
                </p>
              </div>
            </div> */}
            <div className="flex gap-1 justify-end">
              <div className="flex items-center">
                <img className="w-10" src={gem} alt="gem" />
                <p className="font-bold text-blue-500 text-2xl">
                  +{points} points
                </p>
              </div>
            </div>
            {/* <div>
              <p className="mt-4 text-black dark:text-white font-bold">
                Nouveau Score: + {totalScore + pointsAdded}
              </p>
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {/* Display Yes and No arrows if Smart Learning button is clicked */}

      <div className="flex text-gray-500 font-bold justify-between text-xl items-center px-8 py-4">
        <div>Learn</div>

        <div className="flex flex-col items-center">
          <button
            onClick={handleSmartLearningClick}
            className={`flex gap-1 justify-center items-center border-2 rounded-xl p-2 transition-all duration-300 ${
              clicked
                ? "border-gray-400 text-gray-400 bg-gray-100"
                : initialRender
                ? "border-bluemain text-bluemain bg-blue-100 animate-pulse" // Add pulse animation to attract attention
                : "border-gray-400 text-gray-400 bg-gray-100"
            } hover:border-bluemain hover:text-bluemain hover:bg-blue-50 hover:scale-105`} // Slight scaling on hover for effect
          >
            <img src={circle} alt="" className="w-6" />
            Smart learning
          </button>
        </div>
        <div className="flex">
          <MdOutlineSettings
            className="cursor-pointer"
            size={24}
            onClick={() => setShowFilterPopup(true)}
          />
          <button onClick={onClose}>
            <FaTimes size={24} />
          </button>
        </div>
      </div>

      <div className="flex h-full justify-center items-center ">
        <div className="flex  h-full w-full flex-col mt-5 items-center">
          <div
            className={`relative w-[60%]  h-[70%] perspective-1000 cursor-pointer`}
            onClick={handleFlip}
          >
            <div
              className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                isFlipped ? "rotate-y-180" : "rotate-y-0"
              }`}
            >
              {/* Backside */}
              <div className="absolute flex flex-col justify-between transition-transform duration-500 transform-style-preserve-3d w-full h-full shadow rounded-lg bg-white text-black dark:bg-second dark:text-white text-xl transform">
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click event from reaching the parent
                      handleToggleStar(currentQuestion._id);
                    }}
                    className="ml-2"
                  >
                    {isStarred(currentQuestion) ? (
                      <FaStar size={18} className="text-yellow-500" />
                    ) : (
                      <FaRegStar size={18} className="text-gray-500" />
                    )}
                  </button>
                </div>
                <div className="text-center rotate-y-180 p-5 h-[80%] flex justify-center items-center">
                  <div className="lg:text-4xl">
                    {
                      currentQuestion?.options.find(
                        (option) => option.isCorrect
                      ).optionText
                    }
                  </div>
                </div>
                <div className="rotate-y-180 dark:bg-third dark:text-gray-400 text-sm p-2 flex justify-center text-gray-500 bg-gray-50 rounded-b-lg">
                  Cliquez pour retourner ici hhh
                </div>
              </div>

              {/* Frontside */}
              <div className="absolute w-full h-full shadow rounded-lg bg-white dark:bg-second dark:text-white text-black flex flex-col justify-between text-xl backface-hidden">
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStar(currentQuestion._id);
                    }}
                    className="ml-2 w-full flex justify-end pr-5 pt-3"
                  >
                    {isStarred(currentQuestion) ? (
                      <FaStar size={18} className="text-yellow-500" />
                    ) : (
                      <FaRegStar size={18} className="text-gray-500 " />
                    )}
                  </button>
                </div>
                <div className="text-center p-5 h-[80%] flex flex-col justify-center items-center">
                  <div className=" text-md  lg:text-4xl">
                    {currentQuestion?.questionText}
                  </div>
                  {currentQuestion.questionPic?.publicId && (
                    <img
                      src={currentQuestion?.questionPic?.url}
                      alt="question"
                      className=" h-28 w-28"
                    />
                  )}
                </div>
                <div className="dark:bg-third dark:text-gray-400 text-sm p-2 flex justify-center text-gray-500 bg-gray-50 rounded-b-lg">
                  Cliquez pour retourner
                </div>
              </div>
            </div>
          </div>
          {/* Arrows*/}
          {showArrows && (
            <div className="flex mt-2 gap-2 items-center">
              {/* Left Arrow */}
              <button
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    handleFade();
                  }
                }}
                className={`p-3 w-14 h-14 border-2 transition-colors duration-500 dark:bg-third rounded-full flex items-center justify-center ${
                  currentQuestionIndex === 0
                    ? "text-gray-300 cursor-default"
                    : "text-gray-500 dark:hover:bg-gray-500"
                }`}
                disabled={currentQuestionIndex === 0}
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <p className="text-gray-500 font-semibold">
                  {currentQuestionIndex + 1}/{totalQuestions}
                </p>
              </div>
              {/* Right Arrow */}
              <button
                onClick={() => {
                  if (currentQuestionIndex < totalQuestions - 1) {
                    handleFadeOut();
                  }
                }}
                className={`p-3 w-14 h-14 border-2 transition-colors duration-500 dark:bg-third rounded-full flex items-center justify-center ${
                  currentQuestionIndex === totalQuestions - 1
                    ? "text-gray-300 cursor-default"
                    : "text-gray-500 dark:hover:bg-gray-500"
                }`}
                disabled={currentQuestionIndex === totalQuestions - 1}
              >
                <FaArrowRight size={20} />
              </button>
            </div>
          )}
          {showArrowsSmartLearning && (
            <div className="flex mt-2 gap-2 items-center ">
              <button
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    handleFade();
                  }
                }}
                className={`p-3 hover:bg-red-500 hover:text-white border-2 border-red-400 font-bold transition-colors duration-500 dark:bg-third rounded-full flex items-center justify-center ${
                  currentQuestionIndex === 0
                    ? "text-gray-500 cursor-default"
                    : "text-red-500 dark:hover:bg-gray-500"
                }`}
                disabled={currentQuestionIndex === 0}
              >
                <AiOutlineClose size={20} /> Still Learning 
              </button>
              <div>
                <p className="text-gray-500 font-semibold">
                  {currentQuestionIndex + 1}/{totalQuestions}
                </p>
              </div>
              <button
                onClick={() => {
                  if (currentQuestionIndex < totalQuestions - 1) {
                    handleFadeOut();
                  }
                }}
                className={`p-3  border-2 border-green-400 font-bold px-7 hover:bg-green-400 hover:text-white transition-colors duration-500 dark:bg-third rounded-full flex items-center justify-center ${
                  currentQuestionIndex === totalQuestions - 1
                    ? "text-gray-300 cursor-default"
                    : "text-green-500 dark:hover:bg-gray-500"
                }`}
                disabled={currentQuestionIndex === totalQuestions - 1}
              >
                <AiOutlineCheck size={20} />Knew it 
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Popup */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-second p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Filter Questions</h2>
            <button
              className="w-full gap-1  items-center mb-2 py-2 flex px-4 bg-bluemain text-white rounded-lg"
              onClick={() => handleFilterChange(true)}
            >
              Show Only Starred Questions <FaStar className="text-yellow-500" />
            </button>
            <button
              className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg"
              onClick={() => handleFilterChange(false)}
            >
              Show All Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
