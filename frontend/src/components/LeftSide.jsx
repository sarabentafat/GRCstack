import React, { useState } from "react";
import { HiOutlineFolderOpen } from "react-icons/hi2";
import { GiImperialCrown } from "react-icons/gi";
import { MdOutlineReportProblem } from "react-icons/md";
import { BsClipboardCheck } from "react-icons/bs";
import { TbMapSearch } from "react-icons/tb";
import { PiBooksBold } from "react-icons/pi";
import {
  IoSettingsOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoChevronDown,
  IoChevronUp,
} from "react-icons/io5";
import { Link, Outlet, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import logo from "../assets/images/brainy.svg";
import { useTranslation } from "react-i18next";

const LeftSide = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("/accueil");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsSidebarOpen(false);
  };

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const linkClasses = (path) =>
    `py-3 flex px-10 items-center justify-between ${
      activeLink === path
        ? "bg-blue-50 dark:bg-main border-l-4 border-blue-500 text-blue-500"
        : "hover:bg-blue-50 hover:border-l-4 hover:border-blue-500 hover:text-blue-500 dark:hover:bg-main dark:hover:border-blue-900"
    }`;

  return (
    <div className="min-h-screen h-full dark:bg-gray-900 bg-blue-50 dark:text-white flex">
      {/* Hamburger menu */}
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
        className={`fixed top-0 left-0 w-[250px] bg-white text-gray-500 dark:bg-second dark:text-white h-screen pt-10 font-bold transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-[20%] z-30`}
      >
        <div className="flex text-2xl justify-center gap-1 items-center mb-14 text-blue-500">
          <img src={logo} alt="logo" className="w-8" />
          Grcstack
        </div>

        {/* Projects with dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("projects")}
            className={linkClasses("/user/accueil")}
          >
            <div className="flex items-center gap-2">
              <HiOutlineFolderOpen size={25} />
              {t("Projects")}
            </div>
            {openDropdown === "projects" ? <IoChevronUp /> : <IoChevronDown />}
          </button>
          {openDropdown === "projects" && (
            <div className="ml-12 flex flex-col text-sm text-gray-600 dark:text-white gap-2">
              <Link
                to="/user/project/1"
                onClick={() => handleLinkClick("/user/project1")}
              >
                Project 1
              </Link>
              <Link
                to="/user/project2"
                onClick={() => handleLinkClick("/user/project2")}
              >
                Project 2
              </Link>
            </div>
          )}
        </div>

        {/* Governance */}
        <Link
          to="/user/classes"
          className={linkClasses("/user/classes")}
          onClick={() => handleLinkClick("/user/classes")}
        >
          <div className="flex items-center gap-2">
            <GiImperialCrown size={25} />
            {t("Governnce")}
          </div>
        </Link>

        {/* Risk */}
        <Link
          to="/user/documents"
          className={linkClasses("/user/documents")}
          onClick={() => handleLinkClick("/user/documents")}
        >
          <div className="flex items-center gap-2">
            <MdOutlineReportProblem size={25} />
            {t("Risk")}
          </div>
        </Link>

        {/* Compliance with dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("compliance")}
            className={linkClasses("/user/favorite")}
          >
            <div className="flex items-center gap-2">
              <BsClipboardCheck size={25} />
              {t("Compliance")}
            </div>
            {openDropdown === "compliance" ? (
              <IoChevronUp />
            ) : (
              <IoChevronDown />
            )}
          </button>
          {openDropdown === "compliance" && (
            <div className="ml-12 flex flex-col text-sm text-gray-600 dark:text-white gap-2">
              <Link
                to="/user/audits"
                onClick={() => handleLinkClick("/user/audits")}
              >
                Audits
              </Link>
              <Link
                to="/user/evidences"
                onClick={() => handleLinkClick("/user/evidences")}
              >
                Evidences
              </Link>
            </div>
          )}
        </div>

        {/* Settings */}
        <Link
          to="/user/settings"
          className={linkClasses("/user/settings")}
          onClick={() => handleLinkClick("/user/settings")}
        >
          <div className="flex items-center gap-2">
            <IoSettingsOutline size={25} />
            {t("leftside.settings")}
          </div>
        </Link>

        {/* Mapping */}
        <Link
          to="/user/mapping"
          className={linkClasses("/user/shop")}
          onClick={() => handleLinkClick("/user/shop")}
        >
          <div className="flex items-center gap-2">
            <TbMapSearch size={25} />
            {t("Mapping")}
          </div>
        </Link>

        {/* Catalogue with dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("catalogue")}
            className={linkClasses("/user/catalogue")}
          >
            <div className="flex items-center gap-2">
              <PiBooksBold size={25} />
              {t("Catalogue")}
            </div>
            {openDropdown === "catalogue" ? <IoChevronUp /> : <IoChevronDown />}
          </button>
          {openDropdown === "catalogue" && (
            <div className="ml-12 flex flex-col text-sm text-gray-600 dark:text-white gap-2">
              <Link
                to="/user/libraries"
                onClick={() => handleLinkClick("/user/libraries")}
              >
                Libraries
              </Link>
              <Link
                to="/user/threats"
                onClick={() => handleLinkClick("/user/threats")}
              >
                Threats
              </Link>
              <Link
                to="/user/frameworks"
                onClick={() => handleLinkClick("/user/frameworks")}
              >
                Frameworks
              </Link>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="pt-44 flex px-10 items-center text-red-500">
          <LogoutButton />
        </div>
      </div>

      {/* Main content */}
      <div className="w-full dark:bg-main lg:w-[80%] py-28 px-10 ml-0 lg:ml-[20%]">
        <Outlet />
      </div>
    </div>
  );
};

export default LeftSide;
