import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import logo from "../assets/images/brainy.svg";
import desktop from "../assets/images/desktop.png";
import phone from "../assets/images/phone.png";
const Home = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
    const rtlClass = isRtl ? "dir-rtl text-right" : "text-left";
  const [language, setLanguage] = useState(i18n.language || "en");
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <div className={`w-[65%] mx-auto `}>
      <div
        className="h-screen 
      
      container mx-auto"
      >
        {/* Navigation Bar */}
        <nav className="py-4">
          {/* Desktop Menu */}
          <div className="hidden     md:flex  justify-between items-center">
            <div className="flex items-center  gap-1">
              <img src={logo} alt="logo" className="w-8 h-8" />
              <div className="font-bold text-xl text-bluemain">Brainy</div>
            </div>

            {/* <Link to="/" className="hover:underline">
              {t("home.home")}
            </Link> */}
            <div className="flex justify-between items-center  gap-8 font-semibold">
              {" "}
              <Link to="/about" className="hover:text-bluemain">
                {t("home.about")}
              </Link>
              <Link to="/services" className="hover:text-bluemain">
                {t("home.services")}
              </Link>
              <Link to="/contact" className="hover:text-bluemain">
                {t("home.contact")}
              </Link>
            </div>

            <div className="flex justify-between items-center gap-2">
              {" "}
              <LanguageSwitcher />
              <Link
                to="login"
                className="px-6 bg-bluemain text-white rounded-lg py-2"
              >
                {t("home.login")}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex justify-between gap-1 mx-2">
            {" "}
            <div className="md:hidden flex ">
              <div className="flex f items-center  gap-1">
                <img src={logo} alt="logo" className="w-8 h-8" />
                <div className="font-bold text-xl text-bluemain">Brainy</div>
              </div>
              <div className="">
                <LanguageSwitcher />
              </div>
            </div>
            <button
              className="md:hidden text-xl"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
          {/* Mobile Menu Backdrop */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={toggleMobileMenu}
            ></div>
          )}
          {/* Mobile Menu */}
          <div
            className={`md:hidden fixed top-16 right-0 bg-white shadow-lg rounded-lg w-64 z-20 transition-transform transform ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Link
              to="/"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={toggleMobileMenu}
            >
              {t("home.home")}
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={toggleMobileMenu}
            >
              {t("home.about")}
            </Link>
            <Link
              to="/services"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={toggleMobileMenu}
            >
              {t("home.services")}
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={toggleMobileMenu}
            >
              {t("home.contact")}
            </Link>
            <Link
              to="login"
              className="block px-4 py-2 bg-bluemain text-white rounded-lg text-center"
              onClick={toggleMobileMenu}
            >
              {t("home.login")}
            </Link>
          </div>
        </nav>

        {/* Main Content  */}
        <div
          className={`flex h-full flex-col items-start ${
            isRtl ? "md:flex-row-reverse" : "md:flex-row"
          } `}
        >
          <div className="md:w-1/2   mt-[100px] text-center md:text-left mb-10 md:mb-0">
            <h1
              className={`font-bold text-6xl xl:text-7xl  mb-4 ${
                isRtl ? "dir-rtl text-right" : "text-left"
              }`}
            >
              {t("home.welcome")}
            </h1>

            <h3 className={`text-lg md:text-4xl mt-10 xl mb-5 ${rtlClass} `}>
              {t("home.learning_description")}
            </h3>
            <p className={`mb-10 ${rtlClass} text-2xl`}>
              {t("home.platform_description")}
            </p>
            <Link to="signup" className=" text-white rounded-lg py-3 px-7 mx-2">
              {t("home.signup")}
            </Link>
          </div>
          <div className="z-40 h-[80%] mt-[200px]">
            <img src={phone} alt="desktop" className=" ml-10 h-[80%]" />
          </div>
          <div
            className={`absolute top-0 mt-[200px] mr-20 ${
              isRtl ? "left-[-250px]" : "right-[-250px]"
            }`}
          >
            <img src={desktop} alt="desktop" className="w-[800px] h-[550px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
