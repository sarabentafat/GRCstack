import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePacket,
  fetchPacketById,
  toggleLikePacket,
  toggleStarQuestion,
} from "../redux/apiCalls/packetApiCall";
import Flashcard from "../components/FlashCard";
import Quiz from "../pages/Quiz";
import MatchingGame from "../components/MatchingGame";
import Test from "../components/Test";
import { FaStar, FaRegStar } from "react-icons/fa";
import SharePopup from "../components/SharePopup";
import ConfirmDeletePopup from "../components/ConfirmDeletePopup";
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf"; // Import jsPDF library
import "jspdf-autotable"; // For table formatting
const Book = () => {
  const { t } = useTranslation(); // Initialize translation

  //share
  const [showSharePopup, setShowSharePopup] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const packetUrl = `https://quizzfrontend-web.vercel.app/user/packet/${id}`; // Replace with your actual URL

  const dispatch = useDispatch();
  const [activeComponent, setActiveComponent] = useState(null);
  const { packet } = useSelector((state) => state.packet);
  const [Packet, setPacket] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [questions, setQuestions] = useState([]);
  // PDF Export Function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Packet: ${packet?.name || "No Name"}`, 20, 20);

    if (packet?.questions?.length > 0) {
      doc.setFontSize(14);
      doc.text("Questions and Answers:", 20, 30);

      packet.questions.forEach((question, index) => {
        const yOffset = 40 + index * 20;
        doc.text(`${index + 1}. ${question.questionText}`, 20, yOffset);
        const correctAnswer = question.options.find(
          (option) => option.isCorrect
        );
        if (correctAnswer) {
          doc.text(`Answer: ${correctAnswer.optionText}`, 20, yOffset + 10);
        }
      });
    } else {
      doc.text("No questions available", 20, 40);
    }

    doc.save(`${packet?.name || "Packet"}.pdf`);
  };
  const handleProfileClick = () => {
    navigate(`/user/profile/${packet.user.id}`);
  };

  useEffect(() => {
    dispatch(fetchPacketById(id));
    console.log(packet);
    setPacket(packet);
  }, [id, dispatch]);

  useEffect(() => {
    if (packet) {
      setQuestions(packet.questions);
    }
    console.log(packet);
  }, [packet]);

  const handleComponentClick = (component) => {
    setActiveComponent(component);
    renderComponent(component);
  };

  const handleClose = () => {
    setActiveComponent(null);
  };

  const handleToggleStar = (questionId) => {
    // Update local state first
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === questionId
          ? {
              ...q,
              starredBy: q.starredBy.includes(user._id)
                ? q.starredBy.filter((id) => id !== user._id)
                : [...q.starredBy, user._id],
            }
          : q
      )
    );
    // Dispatch the action to update the server
    dispatch(toggleStarQuestion(packet._id, questionId));
  };
  // Function to check if the current user has liked this packet
  const isMarked = () => {
    return packet?.likes?.includes(user?._id);
  };

  const isStarred = (question) => {
    return question.starredBy.includes(user?._id);
  };
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleOptionsClick = () => {
    setOptionsVisible(!isOptionsVisible);
  };
  const handleDeleteClick = () => {
    setPopupVisible(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deletePacket(packet._id));
    setPopupVisible(false);
    navigate("/user/accueil");
  };

  const handleCancelDelete = () => {
    setPopupVisible(false);
  };
  const handleLikeClick = () => {
    console.log(packet._id);
    dispatch(toggleLikePacket(packet._id));
  };

  const renderComponent = () => {
    if (!packet) return null;
    switch (activeComponent) {
      case "Flashcards":
        return (
          <Flashcard
            questions={questions}
            onClose={handleClose}
            packetId={packet._id}
          />
        );
      case "Quiz":
        return (
          <Quiz questions={questions} onClose={handleClose} packet={packet} />
        );
      case "MatchingGame":
        return <MatchingGame questions={questions} onClose={handleClose} />;
      case "Test":
        return <Test questions={questions} onClose={handleClose} />;
      default:
        return null;
    }
  };

  // if (loading) return <div>Loading...</div>;

  return (
    <div className="lg:w-[80%]">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-semibold md:font-bold ">
          {packet?.name || t("loading")}
        </h1>
        <div className="flex justify-end items-center gap-1">
          {isMarked() ? (
            <FaBookmark
              className="cursor-pointer text-blue-500"
              size={20}
              onClick={handleLikeClick}
            />
          ) : (
            <FaRegBookmark
              className="cursor-pointer text-gray-500"
              size={20}
              onClick={handleLikeClick}
            />
          )}
        </div>
      </div>

      {activeComponent && (
        <div className="fixed dark:text-white dark:bg-main bg-blue-50 inset-0 flex justify-center items-center z-50">
          <div className="h-full w-full flex justify-center items-center">
            {renderComponent()}
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center mb-4 bg-white dark:bg-second rounded-lg p-6 shadow-lg">
        {/* Left image container */}
        <div className="flex-shrink-0 w-full md:w-48">
          <img
            src="https://th.bing.com/th/id/OIP.YtVZeAaRWQAjKlSQSQsa5gAAAA?rs=1&pid=ImgDetMain"
            alt="Cover"
            className="w-full object-cover rounded-lg"
          />
        </div>
        {/* Right content container */}
        <div className="mt-4 md:mt-0 md:ml-6 flex-1">
          {packet?.packetPic?.publicId && (
            <div className="mb-4">
              <img
                src={packet.packetPic.url}
                alt="Packet"
                className="w-32 mx-auto md:mx-0 rounded-lg"
              />
            </div>
          )}
          <div className="text-center md:text-left">
            <p className="mb-2 text-gray-600 dark:text-gray-300">
              {packet.description}
            </p>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Author E
            </h1>
            <h2 className="text-md font-bold text-gray-500">2023</h2>
          </div>
        </div>
      </div>

      <div className="text-sm md:text-xl flex justify-between gap-1 mb-2">
        {["Flashcards", "Quiz", "MatchingGame", "Test"].map((component) => (
          <div
            key={component}
            onClick={() => handleComponentClick(component)}
            className="bg-blue-500 w-full flex justify-center text-xs md:text-xl px-1 text-white rounded-lg py-2 cursor-pointer"
          >
            <div>{t(`packet.${component}`)}</div>
          </div>
        ))}
      </div>
      {packet ? (
        <div>
          <div className="flex justify-between items-center">
            <div
              className="flex cursor-pointer items-center gap-1 my-2"
              onClick={handleProfileClick}
            >
              {packet?.user?.profilePic?.url && (
                <img
                  className="w-12 h-12 rounded-full"
                  src={packet?.user.profilePic.url}
                  alt="profileuser"
                />
              )}
              {packet.user?.username && (
                <div>
                  <p className="text-xs text-gray-600">
                    {t("packet.createdBy")}
                  </p>
                  <p className="font-bold"> {packet?.user.username}</p>
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <div
                className="relative inline-block"
                onMouseEnter={() => setShowSharePopup(true)}
                onMouseLeave={() => setShowSharePopup(false)}
              >
                <div className="relative inline-block">
                  <button className="text-gray-500 border border-gray-400 text-sm py-2 px-4 rounded-lg flex items-center gap-1">
                    {t("packet.share")}
                  </button>
                  {/* More SharePopup and Options logic... */}
                </div>
                {showSharePopup && (
                  <div className=" absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 w-max  text-white text-sm py-2 px-4 rounded-lg opacity-100 transition-opacity duration-300">
                    <SharePopup
                      url={packetUrl}
                      onClose={() => setShowSharePopup(false)}
                    />
                  </div>
                )}
              </div>
              <div className="relative ">
                <div
                  onClick={handleOptionsClick}
                  className="text-gray-500  h-full cursor-pointer font-extrabold border border-gray-400 rounded-lg px-2"
                >
                  ...
                </div>

                {isOptionsVisible && (
                  <div className="absolute right-0 dark:bg-second bg-white shadow-lg border border-gray-400 rounded-lg mt-2">
                    <ul className="">
                      {user._id === packet.user.id && (
                        <li
                          onClick={handleDeleteClick}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-third   px-4 py-2 rounded-lg"
                        >
                          Delete
                        </li>
                      )}
                      {user._id === packet.user.id && (
                        <li className="cursor-pointer hover:bg-gray-100  dark:hover:bg-third px-4 py-2 rounded-lg">
                          <Link to={`/user/packet/edit/${packet._id}`}>
                            {" "}
                            edit
                          </Link>
                        </li>
                      )}

                      <li
                        onClick={exportToPDF}
                        className="cursor-pointer hover:bg-gray-100  dark:hover:bg-third px-4 py-2 rounded-lg"
                      >
                        Export
                      </li>

                      {/* Add more options here as needed */}
                    </ul>
                  </div>
                )}

                <ConfirmDeletePopup
                  isVisible={isPopupVisible}
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCancelDelete}
                />
              </div>
            </div>
          </div>
          <h1 className="text-xl font-semibold md:font-bold mt-4">
            {t("packet.questions")}
          </h1>
          <div className="mt-2 text-sm md:text-md flex flex-col gap-1 ">
            {questions.map((question) => (
              <div
                key={question?._id}
                className="rounded-lg p-4 flex gap-1 w-full dark:bg-second bg-white shadow"
              >
                <div className="flex-none w-3/5 md:p-4  ">
                  {question.questionText}
                  {question.questionPic?.publicId && (
                    <img
                      src={question.questionPic.url}
                      alt="question"
                      className="w-12 h-12"
                    />
                  )}
                </div>
                <div className="flex w-2/5 md:p-4 justify-between">
                  {question.options
                    .filter((option) => option.isCorrect)
                    .map((option) => (
                      <p key={option._id}>{option.optionText}</p>
                    ))}
                  <button
                    onClick={() => handleToggleStar(question._id)}
                    className="ml-2"
                  >
                    {isStarred(question) ? (
                      <FaStar size={18} className="text-yellow-500" />
                    ) : (
                      <FaRegStar size={18} className="text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-lg text-gray-600">
          {t("packet.noData")}
        </div>
      )}
    </div>
  );
};

export default Book;
