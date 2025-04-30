import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import logo from "../assets/images/brainy.svg";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-50 text-gray-700 py-8">
      <div className="w-[65%] mx-auto px-4">
        {/* Footer Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <img src={logo} alt="Brainy Logo" className="w-8 h-8 mr-2" />
              <span className="text-2xl font-bold text-bluemain">Brainy</span>
            </div>
            <p className="text-gray-600">{t("footer.aboutBrainy")}</p>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t("footer.aboutUs")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-bluemain transition duration-300"
                >
                  {t("footer.aboutBrainy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-bluemain transition duration-300"
                >
                  {t("footer.howItWorks")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-bluemain transition duration-300"
                >
                  {t("footer.advertise")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-bluemain transition duration-300"
                >
                  {t("footer.getApp")}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t("footer.resources")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-bluemain transition duration-300"
                >
                  {t("footer.helpCenter")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-bluemain transition duration-300"
                >
                  {t("footer.privacyPolicy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-bluemain transition duration-300"
                >
                  {t("footer.termsOfService")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t("footer.contact")}
            </h3>
            <div className="flex mt-4 space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-bluemain transition duration-300"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-bluemain transition duration-300"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-bluemain transition duration-300"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-bluemain transition duration-300"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* App Store and Language Selector */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4">
            <a href="#" className="block">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png"
                alt="Google Play"
                className="h-12"
              />
            </a>
          </div>
          <div className="mt-4 md:mt-0">
            <select className="border rounded p-2">
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 mt-8 text-sm">
          {t("footer.copyright", { year: currentYear })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
