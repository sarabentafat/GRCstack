import React from "react";
import gem from "../assets/icons/gem.png";
import { useTranslation } from "react-i18next";

const Store = () => {
  const { t } = useTranslation();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-6">
        {t("store.title")}
      </h1>
      <p className="text-center text-lg text-blue-600 mb-8">{t("store.welcome")}</p>
      <div className="flex justify-center mb-6">
        <img className="w-14" src={gem} alt={t("store.gemIconAlt")} />
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
        {/* Plan Premium d'un mois */}
        <div className="bg-white dark:bg-second border border-blue-300 rounded-lg shadow-lg p-6 max-w-xs mx-auto transform transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-center text-blue-700 mb-4">
            {t("store.planOneMonth.title")}
          </h2>
          <p className="text-center text-blue-500 mb-4">
            {t("store.planOneMonth.description")}
          </p>
          <p className="text-center text-blue-600 font-bold mb-4">
            {t("store.planOneMonth.price")}
          </p>
          <div className="flex justify-center">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition">
              {t("store.buy")}
            </button>
          </div>
        </div>

        {/* Plan Premium de trois mois */}
        <div className="bg-white dark:bg-second border border-green-300 rounded-lg shadow-lg p-6 max-w-xs mx-auto transform transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-center text-green-700 mb-4">
            {t("store.planThreeMonths.title")}
          </h2>
          <p className="text-center text-green-500 mb-4">
            {t("store.planThreeMonths.description")}
          </p>
          <p className="text-center text-green-600 font-bold mb-4">
            {t("store.planThreeMonths.price")}
          </p>
          <div className="flex justify-center">
            <button className="bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700 transition">
              {t("store.buy")}
            </button>
          </div>
        </div>

        {/* Plan Premium de six mois */}
        <div className="bg-white dark:bg-second border border-red-300 rounded-lg shadow-lg p-6 max-w-xs mx-auto transform transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-center text-red-700 mb-4">
            {t("store.planSixMonths.title")}
          </h2>
          <p className="text-center text-red-500 mb-4">
            {t("store.planSixMonths.description")}
          </p>
          <p className="text-center text-red-600 font-bold mb-4">
            {t("store.planSixMonths.price")}
          </p>
          <div className="flex justify-center">
            <button className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700 transition">
              {t("store.buy")}
            </button>
          </div>
        </div>
      </div>

      {/* Section pour convertir les gemmes */}
      <div className="bg-white dark:bg-second border border-yellow-300 rounded-lg shadow-lg p-6 max-w-xs mx-auto">
        <h2 className="text-2xl font-semibold text-center text-yellow-700 mb-4">
          {t("store.convertGems.title")}
        </h2>
        <p className="text-center text-yellow-600 mb-4">
          {t("store.convertGems.description")}
        </p>

        <div className="flex flex-col gap-4">
          {/* Option de conversion en Plan Premium d'un mois */}
          <div className="flex justify-between items-center border-t border-yellow-200 pt-4">
            <span className="text-yellow-700">
              {t("store.convertGems.oneMonth.title")}
            </span>
            <span className="text-yellow-600">
              {t("store.convertGems.oneMonth.gems")}
            </span>
            <button className="bg-yellow-600 text-white py-1 px-3 rounded-lg shadow hover:bg-yellow-700 transition">
              {t("store.convstore.ert")}
            </button>
          </div>

          {/* Option de conversion en Plan Premium de trois mois */}
          <div className="flex justify-between items-center border-t border-yellow-200 pt-4">
            <span className="text-yellow-700">
              {t("store.convertGems.threeMonths.title")}
            </span>
            <span className="text-yellow-600">
              {t("store.convertGems.threeMonths.gems")}
            </span>
            <button className="bg-yellow-600 text-white py-1 px-3 rounded-lg shadow hover:bg-yellow-700 transition">
              {t("store.convert")}
            </button>
          </div>

          {/* Option de conversion en Plan Premium de six mois */}
          <div className="flex justify-between items-center border-t border-yellow-200 pt-4">
            <span className="text-yellow-700">
              {t("store.convertGems.sixMonths.title")}
            </span>
            <span className="text-yellow-600">
              {t("store.convertGems.sixMonths.gems")}
            </span>
            <button className="bg-yellow-600 text-white py-1 px-3 rounded-lg shadow hover:bg-yellow-700 transition">
              {t("store.convert")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
