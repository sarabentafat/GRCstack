"use client";

import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ClipboardCheck,
  Crown,
  FolderOpen,
  LogOut,
  MapPin,
  Menu,
  Settings,
  Shield,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { logoutUser } from "../redux/apiCalls/authApiCall";
import { useDispatch } from "react-redux";

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
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };
  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const linkClasses = (path) =>
    `py-3 flex px-6 items-center justify-between rounded-lg transition-all duration-200 ${
      activeLink === path
        ? "bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 text-indigo-600 dark:text-indigo-400 font-medium"
        : "hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/10 dark:hover:text-indigo-400"
    }`;

  return (
    <div className="min-h-screen h-full dark:bg-gray-900 bg-gray-50 dark:text-white flex">
      {/* Hamburger menu */}
      <div className="lg:hidden fixed top-4 left-4 z-40 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-900/20 p-1 rounded-md"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-[280px] bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-200 h-screen pt-6 shadow-lg transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-[20%] z-30 overflow-y-auto`}
      >
        {/* Logo */}
        <div className="flex text-2xl justify-center gap-1 items-center mb-10 px-6">
          <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            SmartGRC
          </span>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1 px-3">
          {/* Projects */}
          <Link
            to="/user/projects"
            className={linkClasses("/user/projects")}
            onClick={() => handleLinkClick("/user/projects")}
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5" />
              <span>{t("Projects")}</span>
            </div>
          </Link>

          {/* Governance */}
          <Link
            to="/user/classes"
            className={linkClasses("/user/classes")}
            onClick={() => handleLinkClick("/user/classes")}
          >
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5" />
              <span>{t("Governance")}</span>
            </div>
          </Link>

          {/* Risk */}
          <Link
            to="/user/documents"
            className={linkClasses("/user/documents")}
            onClick={() => handleLinkClick("/user/documents")}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5" />
              <span>{t("Risk")}</span>
            </div>
          </Link>

          {/* Compliance with dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("compliance")}
              className={`w-full text-left ${linkClasses("/user/compliance")}`}
            >
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5" />
                <span>{t("Compliance")}</span>
              </div>
              {openDropdown === "compliance" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {openDropdown === "compliance" && (
              <div className="ml-9 mt-1 space-y-1 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800">
                <Link
                  to="/user/audits"
                  onClick={() => handleLinkClick("/user/audits")}
                  className="block py-2 px-3 text-sm rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Audits
                </Link>
                <Link
                  to="/user/evidences"
                  onClick={() => handleLinkClick("/user/evidences")}
                  className="block py-2 px-3 text-sm rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Evidences
                </Link>
              </div>
            )}
          </div>

          {/* Mapping */}
          <Link
            to="/user/mapping"
            className={linkClasses("/user/mapping")}
            onClick={() => handleLinkClick("/user/mapping")}
          >
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5" />
              <span>{t("Mapping")}</span>
            </div>
          </Link>

          {/* Catalogue with dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("catalogue")}
              className={`w-full text-left ${linkClasses("/user/catalogue")}`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5" />
                <span>{t("Catalogue")}</span>
              </div>
              {openDropdown === "catalogue" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {openDropdown === "catalogue" && (
              <div className="ml-9 mt-1 space-y-1 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800">
                <Link
                  to="/user/libraries"
                  onClick={() => handleLinkClick("/user/libraries")}
                  className="block py-2 px-3 text-sm rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Libraries
                </Link>
                <Link
                  to="/user/threats"
                  onClick={() => handleLinkClick("/user/threats")}
                  className="block py-2 px-3 text-sm rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Threats
                </Link>
                <Link
                  to="/user/frameworks"
                  onClick={() => handleLinkClick("/user/frameworks")}
                  className="block py-2 px-3 text-sm rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Frameworks
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
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5" />
              <span>{t("leftside.settings")}</span>
            </div>
          </Link>
        </div>

        {/* Logout */}
        <div className="absolute bottom-8 w-full px-6">
          <div
            to={"/"}
            className="flex items-center gap-3 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 py-3 px-6 w-full rounded-lg hover:bg-red-50 dark:hover:bg-gray-900/10 transition-colors"
          >
            <LogOut onClick={handleLogout}  className="h-5 w-5" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full dark:bg-gray-900 lg:w-[80%] py-20 px-6 md:px-10 ml-0 lg:ml-[20%]">
        <Outlet />
      </div>
    </div>
  );
};

export default LeftSide;
