"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Bell, User, Award, Diamond } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/apiCalls/authApiCall";

const Nav = () => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState("light");
  const authUser = useSelector((state) => state.auth.user);
  console.log("Auth User:", authUser);
const handlelogout = () => {
  dispatch(logoutUser());
  // Handle logout logic here }
}
  const [userProfile, setUserProfile] = useState({
    username:authUser?.username,
    profilePic:authUser.profilePic.url,
    streak: 5,
    score: 350,
  });

  // // Mock user ID for demo purposes
  const userId = authUser?._id;

  useEffect(() => {
    // Get theme from localStorage on component mount
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;

    // Mock API call to fetch user profile
    const fetchUserProfile = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/users/${userId}/profile`);
        // const data = await response.json();
        // setUserProfile(data);

        // For demo, we'll just use the mock data
        setTimeout(() => {
          setUserProfile({
            username:authUser?.username || "John Doe",
            profilePic:authUser?.profilePic?.url,
            streak: 5,
            score: 350,
          });
        }, 500);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-800 shadow-sm py-3 px-4 fixed top-0 right-0 z-10">
      <div className="max-w-7xl mx-auto flex  justify-end items-center space-x-4">
        {/* Logo/Brand */}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-700" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-400" />
            )}
          </button>


          {/* User Profile */}
          <div className="relative group">
            <button
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              aria-label="Open user menu"
            >
              <img
                src={
                  userProfile.profilePic||
                  "/placeholder.svg?height=56&width=56"
                }
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-800"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                {userProfile.username}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-200 dark:border-gray-700">
              <a
                href={`/profile/${userId}`}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Your Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Settings
              </a>
              <a
                href="/audits"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Your Audits
              </a>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <a
                href="/"
                onClick={handlelogout}
                className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                Sign out
              </a>
            </div>
          </div>
        </div>
   
    </nav>
  );
};

export default Nav;
