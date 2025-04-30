import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import correctSoundFile from "../assets/sounds/co.mp3";
import incorrectSoundFile from "../assets/sounds/inco.mp3";
import { useDispatch, useSelector } from "react-redux";
import { addPoints } from "../redux/apiCalls/profileApiCall";
import { MdOutlineSettings } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { toggleStarQuestion } from "../redux/apiCalls/packetApiCall";

const Quiz = ({ questions, onClose,packet }) => {
  const points = 50;
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const totalScore = useSelector((state) => state.profile.totalScore);
  const [questionsa, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [correctSound, setCorrectSound] = useState(null);
  const [incorrectSound, setIncorrectSound] = useState(null);
  const [responses, setResponses] = useState([]);
  const [pointsAdded, setPointsAdded] = useState(0);
   const isStarred = (question) => {
     return question.starredBy.includes(authUser?._id);
   };
  const handleToggleStar = (questionId) => {
    // Update local state first
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === questionId
          ? {
              ...q,
              starredBy: q.starredBy.includes(authUser._id)
                ? q.starredBy.filter((id) => id !== authUser._id)
                : [...q.starredBy, authUser._id],
            }
          : q
      )
    );
    console.log(questionId)
    // Dispatch the action to update the server
    dispatch(toggleStarQuestion(packet._id, questionId));
  };
  // State for settings popup visibility
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const correctAudio = new Audio(correctSoundFile);
    const incorrectAudio = new Audio();

    correctAudio.onerror = () => console.log("Failed to load correct sound");
    incorrectAudio.onerror = () =>
      console.log("Failed to load incorrect sound");

    setCorrectSound(correctAudio);
    setIncorrectSound(incorrectAudio);

    return () => {
      correctAudio.src = "";
      incorrectAudio.src = "";
    };
  }, []);

  const handleAnswerClick = (index) => {
    setSelected(index);
    setShowCorrect(true);
    const isCorrect = questions[currentQuestionIndex].options[index].isCorrect;

    setResponses((prev) => [
      ...prev,
      { questionIndex: currentQuestionIndex, isCorrect },
    ]);

    if (isCorrect) {
      correctSound?.play().catch((error) => console.log(error));
    } else {
      incorrectSound?.play().catch((error) => console.log(error));
    }
  };

  const handleNextClick = () => {
    setSelected(null);
    setShowCorrect(false);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const calculateStatistics = () => {
    const correctAnswers = responses.filter(
      (response) => response.isCorrect
    ).length;
    const totalQuestions = questions.length;
    return {
      correctAnswers,
      totalQuestions,
      score: Math.round((correctAnswers / totalQuestions) * 100),
    };
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isQuizCompleted = currentQuestionIndex >= totalQuestions;
  const { correctAnswers, score } = calculateStatistics();

  useEffect(() => {
    if (isQuizCompleted && score === 100 && authUser?._id) {
      dispatch(addPoints(authUser._id, points)).then((response) => {
        if (response) {
          setPointsAdded(points);
        }
      });
    }
  }, [isQuizCompleted, score, authUser, dispatch]);

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="h-full  w-full dark:bg-main">
      <div className="flex text-gray-500 font-bold justify-between text-xl items-center px-8 py-4">
        <div>Learn</div>
        <div>
          <p>
            {currentQuestionIndex + 1}/{totalQuestions}
          </p>
        </div>
        <div className="flex">
          {/* Settings Button */}
          <button onClick={() => setShowSettings(true)}>
            <MdOutlineSettings size={24} />
          </button>
          <button onClick={onClose}>
            <FaTimes size={24} />
          </button>
        </div>
      </div>

      {/* Settings Popup */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-main p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <button onClick={() => setShowSettings(false)}>
                <FaTimes size={24} />
              </button>
            </div>
            <div>
              {/* Settings content goes here */}
              <p className="mb-2">Adjust your quiz settings here.</p>
              {/* Add your settings options like toggles, sliders, etc. */}
            </div>
          </div>
        </div>
      )}

      <div className="flex h-full flex-col items-center justify-center">
        <div className="w-full  h-full dark:bg-main rounded-lg dark:border-0 flex flex-col justify-center items-center">
          {isQuizCompleted ? (
            <div className="bg-white p-4 rounded-lg mx-4 text-center">
              <p className="mb-4 text-3xl text-green-600 font-bold">
                Bravo pour votre révision !
              </p>
              <div className="text-xl mt-4 ">
                <div className="mt-4 flex items-center gap-4">
                  <CircularProgressbar
                    className="w-48"
                    value={score}
                    text={`${score}%`}
                    styles={buildStyles({
                      pathColor: score >= 75 ? "green" : "green",
                      textColor: "black",
                      trailColor: "lightgreen",
                    })}
                  />
                  <div className="font-bold text-2xl flex flex-col justify-start">
                    <p className="text-green-500">{correctAnswers} Correct</p>
                    <p className="text-red-500 ml-3">
                      {totalQuestions - correctAnswers} Incorrect
                    </p>
                  </div>
                </div>
                {score === 100 && (
                  <>
                    <p className="mt-4 text-green-600 font-bold">
                      Points ajoutés : +{points}
                    </p>
                    <p className="mt-4 text-green-600 font-bold">
                      Score total : {totalScore + points}
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className="mt-6 px-20 font-semibold py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                Close Quiz
              </button>
            </div>
          ) : (
            <div className="  min-w-[80%] max-w-[80%] md:min-w-[60%]  bg-white text-center dark:bg-second   p-4 h-[60%] flex flex-col justify-between shadow rounded-lg">
              <button
                onClick={() => handleToggleStar(currentQuestion._id)}
                className=" flex justify-end "
              >
                {isStarred(currentQuestion) ? (
                  <FaStar size={18} className="text-yellow-500" />
                ) : (
                  <FaRegStar size={18} className="text-gray-500" />
                )}
              </button>
              <div className="flex  flex-col h-full  min-w-full justify-center items-center">
                <div className=" text-sm md:text-xl lg:text-2xl mb-8 min-w-full ">
                  <div> {currentQuestion.questionText}</div>
                </div>
                <div className="flex  h-fit justify-center items-center mb-5">
                  {currentQuestion.questionPic.publicId != null && (
                    <img
                      className="w-48"
                      src={currentQuestion.questionPic.url}
                      alt=""
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option._id}
                    onClick={() => handleAnswerClick(index)}
                    className={`block text-sm lg:text-2xl w-full dark:bg-third bg-blue-50 px-4 py-4 text-left rounded-lg transition-all duration-300 ${
                      showCorrect
                        ? option.isCorrect
                          ? "border border-green-500 bg-green-50"
                          : index === selected
                          ? "border border-red-500 bg-red-50"
                          : ""
                        : "border-gray-300 hover:bg-gray-200"
                    }`}
                    disabled={showCorrect}
                  >
                    {option.optionText}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!isQuizCompleted && (
            <div
              className={`${
                showCorrect ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500`}
            >
              <button
                onClick={handleNextClick}
                className="mt-6 px-20 font-semibold py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
