import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleLikePacket } from "../redux/apiCalls/packetApiCall";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const CardPacket = ({ packet }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  const handleCardClick = () => {
    navigate(`/user/packet/${packet._id}`);
  };

  const handleProfileClick = () => {
    navigate(`/user/profile/${packet.user._id}`);
  };

  const handleLikeClick = () => {
    dispatch(toggleLikePacket(packet._id));
  };

  const isMarked = () => {
    return packet?.likes?.includes(authUser?._id);
  };

  const truncateDescription = (desc, maxLength = 100) => {
    if (!desc) return "";
    if (desc.length <= maxLength) return desc;
    return (
      <>
        {desc.substring(0, maxLength)}...
        <span
          className="text-blue-500 ml-1 hover:underline"
          onClick={handleCardClick}
        >
          Read more
        </span>
      </>
    );
  };

  return (
    <div className="shadow dark:bg-second bg-white border-gray-200 p-4 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <div onClick={handleCardClick}>
        <h2 className="font-semibold text-xl mb-2">{packet?.name}</h2>
        <p className="bg-blue-100 dark:text-third text-sm w-fit rounded-xl py-1 px-2 font-semibold">
          {packet?.questions.length} questions
        </p>
        {/* <p className="mb-2 text-sm text-gray-700">
          {truncateDescription(packet?.description)}
        </p> */}
      </div>

      <div className="flex justify-between items-center mt-10">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleProfileClick}
        >
          <img
            className="w-10 h-10 rounded-full"
            src={packet?.user?.profilePic?.url || "/default-profile.png"}
            alt=""
          />
          <p className="font-semibold">{packet?.user?.username}</p>
        </div>

        <div className="flex justify-end items-center gap-1">
          {isMarked() ? (
            <FaBookmark
              className="cursor-pointer text-blue-500"
              size={20}
              onClick={handleLikeClick}
            />
          ) : (
            <FaRegBookmark
              className="cursor-pointer"
              size={20}
              onClick={handleLikeClick}
            />
          )}
          <p>{packet?.likes?.length}</p>
        </div>
      </div>
    </div>
  );
};

export default CardPacket;
