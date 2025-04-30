import React, { useState, useEffect } from "react";
import fire from "../assets/icons/flame.png";
import confetti from "../assets/icons/confetti.png"; // Assuming you have a confetti icon

const Streak = ({ message = "Streak!", visible, duration = 3000 }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      // Hide the streak after the specified duration
      const hideTimeout = setTimeout(() => {
        setShow(false);
      }, duration);
      return () => clearTimeout(hideTimeout);
    } else {
      // Handle the smooth disappearance when `visible` changes to false
      const fadeOutTimeout = setTimeout(() => {
        setShow(false);
      }, 500); // Adjust this delay as needed
      return () => clearTimeout(fadeOutTimeout);
    }
  }, [visible, duration]);

  return (
    <div
      className={`fixed z-50 font-bold flex items-center justify-center bottom-10 right-4 border-2 p-4 border-orange-500 text-orange-500 bg-orange-200 rounded-lg shadow-lg 
      transition-opacity duration-700 ease-in-out transform ${
        show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}
    >
      {/* Main Streak Icon */}
      {/* animate-pulse */}
      <img src={fire} alt="streak" className="w-14 mr-2 " />
      {/* Streak Message */}
      {message}
      {/* Confetti Icons */}
      <div className="absolute top-[-15px] right-0   flex items-center justify-center space-x-2 pointer-events-none">
        <img
          src={confetti}
          alt="confetti"
          className="w-14 h-14 animate-bounce"
          style={{
            animationDuration: "1s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      </div>
    </div>
  );
};

export default Streak;
