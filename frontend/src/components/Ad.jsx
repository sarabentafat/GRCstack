import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const Ad = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div className="bg-bluemain p-1 flex justify-around items-center text-white">
        <div></div>
        <div>{t("ad.message")}</div>
        <button onClick={handleClose} className="">
          <AiOutlineClose />
        </button>
      </div>
    )
  );
};

export default Ad;
