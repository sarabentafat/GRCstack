import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../redux/apiCalls/profileApiCall";
import { fetchPacketsByUserId } from "../redux/apiCalls/packetApiCall";
import { fetchYearById } from "../redux/apiCalls/yearApiCall";
import { fetchSubfieldById } from "../redux/apiCalls/subfieldApiCall";
import { FaRegFolderOpen } from "react-icons/fa6";

const Documents = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility
  const [newFolderName, setNewFolderName] = useState(""); // Folder name
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const [currentYearId, setCurrentYearId] = useState(null); // Current selected year ID

  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.profile.profile);
  const authUser = useSelector((state) => state.auth.user);
  const year = useSelector((state) => state.year.year);
  const subfield = useSelector((state) => state.subfield.subfield);

  const navigate = useNavigate();

  // Fetch user profile and packets on authentication
  useEffect(() => {
    if (authUser?._id) {
      dispatch(getUserProfile(authUser._id));
      dispatch(fetchPacketsByUserId(authUser._id));
    }
  }, [dispatch, authUser]);

  // Fetch year and subfield data when user profile is loaded
  useEffect(() => {
    if (userProfile?.year?._id) {
      dispatch(fetchYearById(userProfile.year._id));
      if (userProfile.subfield?._id) {
        dispatch(fetchSubfieldById(userProfile.subfield._id));
        setCurrentYearId(userProfile.year._id);
      }
    }
  }, [dispatch, userProfile]);

  const handleCreateFolder = () => {
    console.log("New folder created:", newFolderName);
    setIsPopupOpen(false);
    setNewFolderName("");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleYearSelection = (yearId) => {
    setCurrentYearId(yearId); // Update the selected year
    dispatch(fetchYearById(yearId)); // Fetch modules for the selected year
    setIsDropdownOpen(false); // Close the dropdown
  };

  return (
    <div className="right-0 lg:w-[80%] h-full text-black dark:text-white">
      <div>
        <h1 className="font-bold text-xl md:text-2xl mb-1 dark:text-white">
          {userProfile?.subfield?.name || "Loading..."}
        </h1>
        <div className="relative inline-block">
          <h1
            className="border border-blue-100 w-fit p-1 rounded-lg bg-gray-50 cursor-pointer"
            onClick={toggleDropdown}
          >
            {year?.name || "Select a year"} année &gt;
          </h1>
          {isDropdownOpen && (
            <div className="absolute mt-2 border border-gray-300 rounded-lg bg-white shadow-md z-10">
              {/* Ensure the default year is included */}
              {userProfile?.year && (
                <div
                  className={`p-2 hover:bg-blue-100 cursor-pointer ${
                    currentYearId === userProfile.year._id ? "bg-blue-200" : ""
                  }`}
                  onClick={() => handleYearSelection(userProfile.year._id)}
                >
                  {userProfile.year.name} année (Default)
                </div>
              )}
              {subfield?.years?.length > 0 &&
                subfield.years.map((year) => (
                  <div
                    key={year._id}
                    className={`p-2 hover:bg-blue-100 cursor-pointer ${
                      currentYearId === year._id ? "bg-blue-200" : ""
                    }`}
                    onClick={() => handleYearSelection(year._id)}
                  >
                    {year.name} année
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="grid gap-2 grid-cols-3 mt-2">
          {year?.modules?.length > 0 ? (
            year.modules.map((module) => (
              <Link
                to={`field/${module._id}/${module._id}`}
                key={module._id}
                className="flex cursor-pointer p-4 bg-white dark:bg-second rounded-lg shadow justify-between"
              >
                <div className="flex justify-between gap-1 w-full">
                  <div>
                    <h1 className="font-semibold">{module.name}</h1>
                    <p className="dark:text-gray-700 bg-blue-100 text-xs w-fit mb-1 mt-1 rounded-xl py-1 px-3 font-semibold">
                      {module.packets.length} packets
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No modules available</p>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center border-b py-2 mt-2 border-blue-100">
        <h1 className="mt-5 text-xl md:text-2xl font-bold dark:text-white">
          My folders
        </h1>
        <div
          onClick={() => setIsPopupOpen(true)}
          className="font-bold text-sm md:text-xl bg-blue-500 p-3 text-white rounded-lg cursor-pointer"
        >
          Create
        </div>
      </div>
      <div className="grid grid-cols-3 mt-4">
        <div className="bg-white p-4 rounded-lg shadow dark:bg-second">
          <Link to={"folder"} className="font-semibold flex items-center gap-1">
            <FaRegFolderOpen className="text-blue-500" />
            Module1
          </Link>
          <p className="text-xs bg-blue-100 text-gray-900 p-1 px-2 rounded-xl w-fit">
            +50 items
          </p>
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-second p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Folder</h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="bg-gray-300 dark:bg-gray-700 p-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
