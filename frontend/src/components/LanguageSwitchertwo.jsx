import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitchertwo= () => {
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
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2  dark:text-white rounded-lg"
      >
        {currentLanguage.toUpperCase()}
      </button>
      {isOpen && (
        <ul className="absolute mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
          <li>
            <button
              className="block px-4 py-2 text-left w-full hover:bg-gray-100"
              onClick={() => changeLanguage("en")}
            >
              {t("English", { defaultValue: "English" })}
            </button>
          </li>
          <li>
            <button
              className="block px-4 py-2 text-left w-full hover:bg-gray-100"
              onClick={() => changeLanguage("ar")}
            >
              {t("العربية", { defaultValue: "العربية" })}
            </button>
          </li>
          <li>
            <button
              className="block px-4 py-2 text-left w-full hover:bg-gray-100"
              onClick={() => changeLanguage("fr")}
            >
              {t("french", { defaultValue: "Françairs" })}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitchertwo;
