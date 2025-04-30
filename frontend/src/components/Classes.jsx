import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPacketsUsers } from "../redux/apiCalls/packetApiCall";
import CardPacket from "../components/CardPacket";
import { useTranslation } from "react-i18next";
import ScrollBooks from "./ScrollBooks";

const Classes = () => {
  const { t } = useTranslation();
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllPacketsUsers());
  }, [dispatch]);

  const packets = useSelector((state) => state.packet.packets);

  return (
    <div className="lg:w-[80%]">
      <div className="flex justify-between items-center mt-4">
      
        <h1 className="text-xl mb-2 font-bold">{t("classes.title")}</h1>
        <div>See All</div>
      </div>

      {/* Horizontally scrollable CardPacket section */}
      <div className="overflow-x-auto whitespace-nowrap px-2 scrollbar-hide">
        <div className="flex gap-4">
          {packets?.map((packet) => (
            <div key={packet._id} className="inline-block min-w-[200px]">
              <CardPacket packet={packet} profileId={packet.user.id} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <h1 className="text-xl mb-2 font-bold mt-4">{t("Books")}</h1>
        <h1>See All</h1>
      </div>
      <ScrollBooks />
    </div>
  );
};

export default Classes;

