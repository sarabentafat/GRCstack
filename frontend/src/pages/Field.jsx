import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchYearById } from "../redux/apiCalls/yearApiCall";

const Field = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchYearById(id)); // Fetch the year data based on the ID
    }
  }, [dispatch, id]);

  const year = useSelector((state) => state.year.year);

  const handleModule = (moduleId) => {
    navigate(`${moduleId}`); // Navigate to the specific module within the year
  };

  return (
    <div>
      <h1 className="font-bold mb-4 text-2xl">{year?.name}er année</h1>
      {/* Packet */}
ff
      <div className="grid  gap-2 md:grid-cols-2">
        {year?.modules && year.modules.length > 0 ? (
          <>
         
            {year.modules.map((module) => (
              <div
                className="flex cursor-pointer p-8 h-[200px]  bg-white dark:bg-second rounded-lg shadow justify-between"
                key={module._id}
                onClick={() => handleModule(module._id)}
              >
                <div className="flex justify-between gap-1 w-full">
                  <div>
                    <h1 className="font-bold text-xl">{module.name}</h1>
                    <p className="dark:text-gray-700 bg-blue-100 text-xs w-fit mb-1 mt-1 rounded-xl py-1 px-3 font-semibold">
                      {module.packets.length} packets
                    </p>
                  </div>
                  <img
                    className="w-[40%]"
                    src={module.modulePic?.url}
                    alt={module.name}
                  />
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No modules available</p>
        )}
      </div>
    </div>
  );
};

export default Field;
