import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPoints } from "../redux/apiCalls/profileApiCall";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import gem from "../assets/icons/gem.png"
import { MdOutlineSettings } from "react-icons/md";
import { FaTimes } from "react-icons/fa"; // Import the close icon
const Test = ({ questions, onClose }) => {
  const points = 50;
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const totalScore = useSelector((state) => state.profile.totalScore);

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [pointsAdded, setPointsAdded] = useState(0);

  // Handle option selection
  const handleOptionChange = (questionId, optionId) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionId] || [];
      const updatedAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter((id) => id !== optionId)
        : [...currentAnswers, optionId];
      return { ...prevAnswers, [questionId]: updatedAnswers };
    });
  };

  // Submit the test and calculate results
  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((question) => {
      const selectedOptions = answers[question._id] || [];
      const correctOptions = question.options
        .filter((option) => option.isCorrect)
        .map((option) => option._id);

      if (
        correctOptions.length === selectedOptions.length &&
        correctOptions.every((id) => selectedOptions.includes(id))
      ) {
        correctCount++;
      }
    });

    const calculatedScore = (correctCount / questions.length) * 100;
    setCorrectAnswers(correctCount);
    setTotalQuestions(questions.length);
    setScore(calculatedScore);
    setShowResult(true);

    // Add points if score is 100 and user is authenticated
    if (calculatedScore === 100 && authUser?._id) {
      dispatch(addPoints(authUser._id, points)).then((response) => {
        if (response) {
          setPointsAdded(points);
        }
      });
    }
  };

  // Get encouraging message based on score
  const getEncouragingMessage = () => {
    if (score >= 80) return "Excellent travail !";
    if (score >= 60) return "Bon effort !";
    if (score >= 40) return "Continuez comme ça !";
    return "Ne vous découragez pas !";
  };

  if (showResult) {
    const progressBarStyle = buildStyles({
      pathColor: score >= 75 ? "green" : "green",
      textColor: "green",
      trailColor: "lightgreen",
    });

    return (
      <div className=" overflow-auto h-full w-full">
        <div className="flex  text-gray-500 font-bold justify-between text-xl items-center px-8 py-4">
          <div>Learn</div>
          <div>
            <p>{/* {currentQuestionIndex + 1}/{totalQuestions} */}</p>
          </div>
          <div className="flex">
            <MdOutlineSettings size={24} />
            <button onClick={onClose}>
              <FaTimes size={24} />
            </button>
          </div>
        </div>
        <div className="px-8 py-4 h-full ">
          <div className=" h-[70%] flex justify-center items-center ">
            <div>
              {" "}
              <p className="text-4xl mb-10 font-bold text-green-500 ">
                {getEncouragingMessage()}
              </p>
              <div className="mt-4 flex items-center  gap-4">
                <CircularProgressbar
                  className="w-48 "
                  value={score}
                  text={`${score.toFixed(2)}% `}
                  styles={progressBarStyle}
                />
                <div className="  font-bold text-2xl flex flex-col justify-start">
                  <p className="text-green-500">{correctAnswers} Correct</p>
                  <p className="text-red-500">
                    {totalQuestions - correctAnswers} Incorrect
                  </p>
                </div>
              </div>
              {score === 100 && (
                <div className="mt-4 text-green-600 font-bold">
                  <div className="flex text-blue-500 text-xl items-center  justify-end">
                    <p className=""> Points ajoutés :</p>
                    <img className="w-10" src={gem} alt="" />{" "}
                    <p className=" text-wl">+{points}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="py-2 md:w-[80%] lg:w-[60%] mx-auto">
            {" "}
            <h2 className="md:text-3xl font-bold mb-4">Vos réponses</h2>
            {questions.map((question) => (
              <div
                key={question._id}
                className="mb-3 flex flex-col justify-between dark:bg-main  bg-white p-6 rounded-xl shadow"
              >
                <div className="flex justify-center items-center flex-col py-2 ">
                  {" "}
                  <h3 className="md:text-xl  mb-2">{question.questionText}</h3>
                  {question.questionPic.publicId && (
                    <img
                      className="w-40 mb-4"
                      src={question.questionPic.url}
                      alt=""
                    />
                  )}
                </div>
                <div className="grid grid-cols-2  gap-2 ">
                  {question.options.map((option) => (
                    <div
                      key={option._id}
                      className={`p-2 border rounded ${
                        option.isCorrect
                          ? "bg-green-200 dark:bg-green-800 border-green-500"
                          : answers[question._id]?.includes(option._id)
                          ? "bg-red-200 border-red-500 dark:bg-red-800"
                          : "border-gray-200"
                      }`}
                    >
                      <p>{option.optionText}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto w-full ">
      <div className="flex  text-gray-500 font-bold justify-between text-xl items-center px-8 py-4">
        <div>Learn</div>
        <div>
          <p>{/* {currentQuestionIndex + 1}/{totalQuestions} */}</p>
        </div>
        <div className="flex">
          <MdOutlineSettings size={24} />
          <button onClick={onClose}>
            <FaTimes size={24} />
          </button>
        </div>
      </div>
      <div className="  h-full   text-lg font-medium w-[80%] lg:w-[60%] mx-auto">
        {questions.map((question) => (
          <div
            key={question._id}
            className="mb-3 text-center shadow bg-white dark:bg-second p-10 rounded-xl"
          >
            <h3 className="md:text-xl  py-2 mb-2">{question.questionText}</h3>
            <div className="flex justify-center">
              {" "}
              {question.questionPic.publicId && (
                <img
                  className="w-40 mb-4"
                  src={question.questionPic.url}
                  alt=""
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 ">
              {question.options.map((option) => (
                <div
                  key={option._id}
                  onClick={() => handleOptionChange(question._id, option._id)}
                  className={`  text-base p-4 bg-blue-50 dark:bg-main  rounded-lg cursor-pointer ${
                    answers[question._id]?.includes(option._id)
                      ? "border-bluemain border "
                      : ""
                  }`}
                >
                  {option.optionText}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-blue-500 text-white rounded-md mt-4 font-bold mb-10"
        >
          Soumettre
        </button>
      </div>
    </div>
  );
};

export default Test;
