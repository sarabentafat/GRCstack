import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserMainProfile,
  updateProfile,
  uploadProfilePhoto,
} from "../redux/apiCalls/profileApiCall";
import { MdEdit } from "react-icons/md";
import { fetchLevels } from "../redux/apiCalls/levelApiCall";
import LanguageSwitcher from "../components/LanguageSwitcher";
import LanguageSwitchertwo from "../components/LanguageSwitchertwo";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();
  const profile = useSelector((state) => state.profile.mainProfile);
  const [username, setUsername] = useState(profile?.username || "");

  const [email, setEmail] = useState(profile?.email || "");
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const { loading, error } = useSelector((state) => state.profile);
  const authUser = useSelector((state) => state.auth.user);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUpload = (profileid, file) => {
    if (file) {
      dispatch(uploadProfilePhoto(profileid, file));
    }
  };


  const [profilePicture, setProfilePicture] = useState(
    profile?.profilePicture || ""
  );
  const [bio, setBio] = useState(profile?.bio || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState("Public");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);

  useEffect(() => {
    dispatch(getUserMainProfile(authUser._id));

    if (
      username !== profile?.username ||
      email !== profile?.email ||
      bio !== profile?.bio ||
      password !== "" ||
      newPassword !== ""
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [
    dispatch,
    authUser._id,
    profile,
    username,
    email,
    bio,
    password,
    newPassword,

  ]);

  const handleUpdateProfile = () => {
    const profileData = {
      username,
      bio,
    };
    dispatch(updateProfile(profile._id, profileData));
  };

  const handleProfilePhotoChange = () => {
    if (newProfilePhoto) {
      dispatch(uploadProfilePhoto(profile._id, newProfilePhoto));
      setProfilePicture(URL.createObjectURL(newProfilePhoto));
      setNewProfilePhoto(null);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="md:p-4 w-full lg:w-[75%] lg:mx-auto rounded-lg">
      <h2 className="text-2xl mb-4 md:text-4xl font-bold md:mb-8">
        {t("settings.title")}
      </h2>
      <div className="text-xl border dark:border-third p-4 rounded-xl">
        <h3 className="text-lg text-gray-600 font-semibold mb-2">
          {t("settings.personalInfo")}
        </h3>
        <div>
          <p className="mb-2 font-bold">{t("settings.profilePicture")}</p>
          <div className="flex mb-8 relative w-fit">
            <img
              className="w-24 h-24 rounded-full"
              src={profile?.profilePic?.url || "/default-profile.png"}
              alt={profile?.username}
            />
            <MdEdit
              size={30}
              className="p-1 absolute end-0 text-orange-500 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div className="flex justify-between">
            <div>
              <label className="font-bold dark:text-white text-gray-700">
                {t("settings.username")}
              </label>
            </div>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 dark:bg-second mb-6 p-2 block w-full border-gray-300 rounded-md shadow-sm"
            placeholder={profile?.username || t("settings.usernamePlaceholder")}
          />
          <label className="dark:text-white font-bold text-gray-700">
            {t("settings.bio")}
          </label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 dark:bg-second h-20 p-2 block w-full mb-6 border-gray-300 rounded-md shadow-sm"
            placeholder={profile?.bio || t("settings.bioPlaceholder")}
          />
          <label className="dark:text-white font-bold text-gray-700">
            {t("settings.email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 dark:bg-second p-2 block w-full mb-6 border-gray-300 rounded-md shadow-sm"
            placeholder={profile?.email || t("settings.emailPlaceholder")}
          />
        </div>
        <div>
          <label className="font-bold dark:text-white text-gray-700">
            {t("settings.changePassword")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 dark:bg-second p-2 block w-full border-gray-300 rounded-md shadow-sm"
            placeholder={t("settings.currentPassword")}
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 dark:bg-second mb-6 p-2 block w-full border-gray-300 rounded-md shadow-sm"
            placeholder={t("settings.newPassword")}
          />
        </div>
        <div className="mb-6">
          <label className="font-bold mb-1 dark:text-white text-gray-700">
            {t("settings.changeLanguage")}
          </label>
          <LanguageSwitchertwo />
        </div>
        <div className="mb-6">
          <label className="font-bold dark:text-white text-gray-700">
            {t("settings.profileVisibility")}
          </label>
          <select
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
            className="mt-1 dark:bg-second p-2 block w-full rounded-md shadow-sm"
          >
            <option>{t("settings.public")}</option>
            <option>{t("settings.private")}</option>
          </select>
        </div>

      </div>

      {/* Modal for changing profile picture */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-second p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">
              {t("settings.changeProfilePicture")}
            </h3>
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <div className="flex justify-end">
              <button
                onClick={handleProfilePhotoChange}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                {t("settings.save")}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="ml-2 bg-gray-400 text-white py-2 px-4 rounded-md"
              >
                {t("settings.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
