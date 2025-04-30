import React from "react";
import { FaFire, FaPenNib, FaCrown } from "react-icons/fa"; // Import relevant icons

const Accomplissement = () => {
  const accomplishments = [
    {
      icon: <FaFire className="text-orange-500 w-8 h-8" />,
      title: "Streak Master",
      description: "7-day streak of completing quizzes.",
    },
    {
      icon: <FaPenNib className="text-green-500 w-8 h-8" />,
      title: "Top Content Creator",
      description: "Created 10+ quiz packets played by hundreds of users.",
    },
    {
      icon: <FaCrown className="text-yellow-500 w-8 h-8" />,
      title: "Quiz Champion",
      description: "Ranked #1 in the leaderboard.",
    },
    {
      icon: <FaFire className="text-blue-500 w-8 h-8" />,
      title: "Consistency Pro",
      description: "Completed quizzes consistently for 30 days.",
    },
    {
      icon: <FaPenNib className="text-purple-500 w-8 h-8" />,
      title: "Knowledge Seeker",
      description: "Completed 50+ quizzes.",
    },
  ];

  return (
    <div className="p-6 rounded-lg">
      {/* <p className="text-2xl font-bold mb-4 text-center text-gray-800">
        Accomplissements
      </p> */}
      {/* Horizontal scrollable section */}
      <div className="flex overflow-x-scroll space-x-4 scrollbar-hide p-2">
        {accomplishments.map((item, index) => (
          <div
            key={index}
            className="flex-none w-64 bg-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200 ease-out"
          >
            <div className="flex justify-center mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold text-gray-700 text-center">
              {item.title}
            </h3>
            <p className="text-gray-600 text-center">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accomplissement;
