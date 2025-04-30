import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <div >
      {/* Navigation Bar */}
      <nav className="flex flex-wrap items-center justify-between py-4 relative">
        <div className="font-bold text-xl text-bluemain">Brainy</div>
        {/* Desktop Menu */}
        <div className="hidden md:flex w-[60%] justify-between items-center">
          <LanguageSwitcher />
          <Link to="/" className="hover:underline">
            {t("home")}
          </Link>

          <Link to="/about" className="hover:underline">
            {t("about")}
          </Link>
          <Link to="/services" className="hover:underline">
            {t("services")}
          </Link>
          <Link to="/contact" className="hover:underline">
            {t("contact")}
          </Link>
          <Link
            to="login"
            className="px-6 bg-bluemain text-white rounded-lg py-2"
          >
            {t("login")}
          </Link>
        </div>
        {/* Mobile Menu Button */}
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
            {t("home")}
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 hover:bg-gray-200"
            onClick={toggleMobileMenu}
          >
            {t("about")}
          </Link>
          <Link
            to="/services"
            className="block px-4 py-2 hover:bg-gray-200"
            onClick={toggleMobileMenu}
          >
            {t("services")}
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 hover:bg-gray-200"
            onClick={toggleMobileMenu}
          >
            {t("contact")}
          </Link>
          <Link
            to="login"
            className="block px-4 py-2 bg-bluemain text-white rounded-lg text-center"
            onClick={toggleMobileMenu}
          >
            {t("login")}
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
