import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdKeyboardArrowDown } from "react-icons/md";
const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng); // Save language to localStorage
    setIsOpen(false);
  };

  // Ensure i18n.language has a default value
  const currentLanguage = i18n.language || "en";

  return (
    <div className="relative z-40">
      <button
        onClick={toggleDropdown}
        className=" flex  justify-between items-center px-2 py-1 border border-1  border-bluemain  rounded-lg "
      >
        {currentLanguage.toUpperCase()}
        <MdKeyboardArrowDown className="text-bluemain"/>
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
          <li>
            <button
              className="block px-4 py-2 text-left w-full hover:bg-gray-100"
              onClick={() => changeLanguage("en")}
            >
              {t("language.english", { defaultValue: "English" })}
            </button>
          </li>
          <li>
            <button
              className="block px-4 py-1 text-left w-full hover:bg-gray-100"
              onClick={() => changeLanguage("ar")}
            >
              {t("language.arabic", { defaultValue: "العربية" })}
            </button>
          </li>
          <li>
            <button
              className="block px-4 py-2 text-left w-full hover:bg-gray-100"
              onClick={() => changeLanguage("fr")}
            >
              {t("language.french", { defaultValue: "Français" })}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
