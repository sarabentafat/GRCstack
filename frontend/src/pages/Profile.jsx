"use client";

import { useEffect, useState } from "react";

const Profile = ({ profileId }) => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [localPackets, setLocalPackets] = useState([]);
  const [authUser, setAuthUser] = useState({ _id: "user123" }); // Mock user data

  useEffect(() => {
    // Mock function to fetch user profile
    const fetchUserProfile = async (id) => {
      try {
        // Simulate API call
        setTimeout(() => {
          setUserProfile({
            username: "Mohamed Belaili",
            bio: "Student",
            profilePic: { url: "/placeholder.svg?height=96&width=96" },
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };


    fetchUserProfile(profileId);
    fetchPackets(profileId);
  }, [profileId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="text-black dark:text-white lg:w-[80%] mx-auto p-4">
      {/* Profile Section */}
      <div className="rounded-lg p-6 flex flex-col justify-between items-center text-center bg-white dark:bg-gray-800 shadow-sm mb-6">
        <img
          className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
          src={
            userProfile?.profilePic?.url ||
            "/placeholder.svg?height=96&width=96"
          }
          alt="Profile"
        />
        <div className="mt-4">
          <h1 className="font-bold text-xl">
            {userProfile?.username || "Dr Mohamed Belaili"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {userProfile?.bio || "Student"}
          </p>
        </div>
      </div>


    </div>
  );
};

export default Profile;
