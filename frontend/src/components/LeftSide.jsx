import React, { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { MdGroups } from "react-icons/md";
import { FaBookmark, FaStore } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi2";
import logo from "../assets/images/brainy.svg"
import {
  IoSettingsOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { Link, Outlet, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useTranslation } from "react-i18next";

const LeftSide = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("/accueil");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsSidebarOpen(false); // Close sidebar when a link is clicked
  };

  const linkClasses = (path) =>
    `py-3 flex px-10 items-center ${
      activeLink === path
        ? "bg-blue-50 dark:bg-main border-l-4 border-blue-500 text-blue-500"
        : "hover:bg-blue-50 hover:border-l-4 hover:border-blue-500 hover:text-blue-500 dark:hover:bg-main dark:hover:border-blue-900"
    }`;

  return (
    <div className="min-h-screen h-full dark:bg-gray-900 bg-blue-50 dark:text-white flex">
      {/* Hamburger menu for smaller screens */}
      <div className="lg:hidden p-4 fixed top-5 left-1 z-40">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? (
            <IoCloseOutline size={30} />
          ) : (
            <IoMenuOutline size={35} />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-[250px] bg-white  text-gray-500  dark:bg-second dark:text-white h-screen pt-10 font-bold transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-[20%] z-30`}
      >
        <div className="flex text-2xl  justify-center gap-1 items-center mb-14 text-blue-500">
        <img src={logo} alt="" className="w-8" />
          {t("Brainy")}
        </div>
        <Link
          to="accueil"
          className={linkClasses("/accueil")}
          onClick={() => handleLinkClick("/accueil")}
        >
          <AiFillHome size={25} />
          <div className="ml-2">{t("leftside.home")}</div>
        </Link>
        <Link
          to="classes"
          className={linkClasses("/classes")}
          onClick={() => handleLinkClick("/classes")}
        >
          <MdGroups size={25} />
          <div className="ml-2">{t("leftside.explore")}</div>
        </Link>
        <Link
          to="documents"
          className={linkClasses("/documents")}
          onClick={() => handleLinkClick("/documents")}
        >
          <HiDocumentText size={25} />
          <div className="ml-2">{t("leftside.modules")}</div>
        </Link>
        <Link
          to="favorite"
          onClick={() => handleLinkClick("/favorite")}
          className="py-3 flex px-10 items-center hover:bg-blue-50  hover:border-l-4 hover:text-blue-500 hover:border-blue-500 dark:hover:bg-main dark:hover:border-blue-900"
        >
          <FaBookmark size={25} />
          <div className="ml-2">{t("leftside.favorites")}</div>
        </Link>
        <Link
          to="settings"
          className={linkClasses("/settings")}
          onClick={() => handleLinkClick("/settings")}
        >
          <IoSettingsOutline size={25} />
          <div className="ml-2">{t("leftside.settings")}</div>
        </Link>
        <Link
          to="shop"
          className={linkClasses("/shop")}
          onClick={() => handleLinkClick("/shop")}
        >
          <FaStore size={25} />
          <div className="ml-2">{t("leftside.shop")}</div>
        </Link>
        <div className="pt-44 flex px-10 items-center text-red-500">
          <LogoutButton />
        </div>
      </div>

      {/* Main content area */}
      <div className="w-full dark:bg-main lg:w-[80%] py-28 px-10 ml-0 lg:ml-[20%]">
        <Outlet />
      </div>
    </div>
  );
};

export default LeftSide;
