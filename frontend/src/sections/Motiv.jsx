import React from "react";
import { useTranslation } from "react-i18next";
import { FaRocket, FaChartLine, FaBook } from "react-icons/fa";

const Motiv = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white text-gray-800 py-16 px-6 md:py-24 md:px-12 rounded-lg shadow-xl">
      <div className="w-[65%] mx-auto text-center">
        <h1
          data-aos="zoom-out"
          className="text-3xl md:text-5xl font-extrabold mb-6"
        >
          {t("motiv.get_better_grades")}
        </h1>
        <p data-aos="zoom-out" className="text-lg md:text-xl mb-12">
          {t("motiv.discover_enhanced_learning")}
        </p>

        <div
          data-aos="zoom-out"
          className="flex flex-col md:flex-row justify-center gap-4 mb-5"
        >
          {/* Train and Track Progress */}
          <div className="flex flex-col items-center rounded-lg p-6 shadow bg-blue-50">
            <FaRocket className="text-bluemain text-4xl mb-4" />
            <h2 className="text-xl font-bold mb-2">
              {t("motiv.train_and_track")}
            </h2>
            <p className="text-base">{t("motiv.optimize_studies")}</p>
          </div>

          {/* Millions of Trusted Courses */}
          <div className="flex flex-col items-center shadow rounded-lg p-6 bg-[#F0FFF3]">
            <FaChartLine className="text-green-500 text-4xl mb-4" />
            <h2 className="text-xl font-bold mb-2">
              {t("motiv.millions_of_courses")}
            </h2>
            <p className="text-base">{t("motiv.combined_power")}</p>
          </div>

          {/* New Feature */}
          <div className="flex flex-col items-center shadow rounded-lg p-6 bg-blue-50">
            <FaBook className="text-bluemain text-4xl mb-4" />
            <h2 className="text-xl font-bold mb-2">
              {t("motiv.optimize_studies")}
            </h2>
            <p className="text-base">{t("motiv.advanced_tools")}</p>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Motiv;
