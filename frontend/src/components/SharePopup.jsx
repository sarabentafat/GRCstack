import React from "react";
import facebook from "../assets/icons/facebook.png";
import instagram from "../assets/icons/instagram.png"
import messenger from "../assets/icons/messenger.png"
import { FaLink } from "react-icons/fa";


// Function to handle sharing on different platforms
const handleShare = (platform, url) => {
  let shareUrl = "";

  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`;
      break;
    case "messenger":
      shareUrl = `https://www.facebook.com/dialog/send?app_id=YOUR_APP_ID&link=${encodeURIComponent(
        url
      )}&redirect_uri=${encodeURIComponent(url)}`;
      break;
    case "whatsapp":
      shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
      break;
    case "instagram":
      shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(url)}`;
      break;
    case "copy":
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
      return;
    default:
      return;
  }

  window.open(shareUrl, "_blank", "noopener,noreferrer");
};

const SharePopup = ({ url, onClose }) => {
  return (
    <div className=" ">
      <div className="bg-white dark:bg-second py-2 px-2 flex  rounded-lg shadow">
        <div className="flex  gap-4">
          <div className="relative inline-block group">
            <button
              onClick={() => handleShare("copy", url)}
              className="text-white  rounded-lg focus:outline-none h-full flex items-center"
            >
              <FaLink className="text-gray-500" />
            </button>

            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Copy Link
            </div>
          </div>
          <button
            onClick={() => handleShare("facebook", url)}
            className="flex items-center gap-2   text-white rounded-lg"
          >
            <img src={facebook} alt="facebook" className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleShare("messenger", url)}
            className="flex items-center gap-2  text-white rounded-lg"
          >
            <img src={messenger} alt="messenger" className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleShare("instagram", url)}
            className="flex items-center gap-2  text-white rounded-lg"
          >
            <img src={instagram} alt={instagram} className="w-6 h-6" />
          </button>


        </div>
      </div>
    </div>
  );
};

export default SharePopup;
