import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidSun } from "react-icons/bi";
import { IoNotificationsOutline } from "react-icons/io5";
import profilePic from "../assets/images/profile.jfif";
import { Link } from "react-router-dom";
import flame from "../assets/icons/flame.png";
import score from "../assets/icons/gem.png";
import { getUserMainProfile, getUserProfile } from "../redux/apiCalls/profileApiCall"; // Adjust the import path as needed

const Nav = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [localUserProfile, setLocalUserProfile] = useState(null); // Local state for user profile

  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const streak = useSelector((state) => state.profile.streakLength);
  console.log(streak);
  const userProfile = useSelector((state) => state.profile.mainProfile);
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (authUser?._id) {
      dispatch(getUserMainProfile(authUser?._id));
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    setLocalUserProfile(userProfile); // Update local state when userProfile changes
  }, [userProfile]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Handle null values for userProfile data
  const profile = localUserProfile || {};

  return (
    <div className="flex z-0 font-semibold w-[80%] justify-evenly items-center flex-row py-2 mt-5 absolute right-0 top-0">
      <div className="md:w-[50%]">
        {/* <input
          type="text"
          className="w-full rounded p-2"
          placeholder="search"
        /> */}
      </div>

      <div onClick={toggleTheme}>
        <BiSolidSun size={27} className="cursor-pointer" />
      </div>
      <div className="w-7 flex justify-center items-center">
        <img src={flame} alt="flame" />
        <p className="text-[#F4702E] font-bold">{streak}</p>
      </div>
      <div className="flex gap-1 items-center">
        <img className="w-7" src={score} alt="score" />
        <div>
          <p className="text-blue-600">
            {profile?.statistics?.totalScore || 0}
          </p>
        </div>
      </div>
      <Link to={"notifications"} className="relative">
        <IoNotificationsOutline size={27} className="text-blue-500" />
        <div className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded"></div>
      </Link>

      <Link to={`profile/${authUser?._id}`} className="flex items-center">
        <img
          src={profile?.profilePic?.url || profilePic}
          alt="profile"
          className="rounded-full w-14 h-14"
        />
        <h1 className="ml-2 hidden md:block ">{profile?.username || "User"}</h1>
      </Link>
    </div>
  );
};

export default Nav;
