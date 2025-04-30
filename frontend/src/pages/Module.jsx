import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchModuleById } from "../redux/apiCalls/moduleApiCall";

const Module = () => {
  const { moduleId } = useParams();
  const dispatch = useDispatch();
  const [expandedPacketId, setExpandedPacketId] = useState(null); // State to manage expanded packet

  useEffect(() => {
    dispatch(fetchModuleById(moduleId));
  }, [dispatch, moduleId]);

  const module = useSelector((state) => state.module.module);

  // Function to truncate description
  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return {
        text: words.slice(0, wordLimit).join(" ") + "...",
        isTruncated: true,
      };
    } else {
      return {
        text: description,
        isTruncated: false,
      };
    }
  };

  // Render packets with description limitation
  const renderPackets = () => {
    return module?.packets.map((packet) => {
      const { text, isTruncated } = truncateDescription(packet.description, 24);

      return (
        <Link
          to={`${packet._id}`}
          key={packet._id}
          className="flex justify-center text-center "
        >
          <div className="rounded-lg p-4  border-grey-500 dark:border-gray-500 border-gray-300  bg-white dark:bg-second  shadow-lg min-h-[250px] max-h-[350px] overflow-hidden ">
            <div className="flex flex-col h-full">
              <h1 className="font-bold text-lg text-start p-2">
                {packet.name}
              </h1>
              <p className="dark:text-gray-700 bg-blue-100 text-xs w-fit mb-1 mt-1 rounded-xl py-1 px-3 font-semibold">
                {packet?.questions.length} questions
              </p>
              <div className="flex-grow flex flex-col justify-between ">
                <div className="text-start">
                  <div className="flex justify-center items-center ">
                    <img
                      className="w-[100px] h-[100px]"
                      src={packet.packetPic.url}
                      alt=""
                    />
                  </div>
                  {text}

                  {isTruncated && (
                    <button
                      onClick={() => setExpandedPacketId(packet._id)}
                      className="text-blue-500 font-semibold"
                    >
                      Read More
                    </button>
                  )}
                  {expandedPacketId === packet._id && (
                    <div>
                      <p>{packet.description}</p>
                      <button
                        onClick={() => setExpandedPacketId(null)}
                        className="text-blue-500 font-semibold"
                      >
                        Read Less
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  };

  return (
    <div className="">
      <h1 className="font-bold text-xl mb-3">{module?.name}</h1>
      <div className="grid lg:grid-cols-2 gap-3">{renderPackets()}</div>
    </div>
  );
};

export default Module;
