import React from "react";

const Video = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Courses</h2>{" "}
      {/* Add heading here */}
      <iframe
        src="https://drive.google.com/file/d/1P3hb5NcRKNiLFgADqE-iBjf-999bGEdL/preview"
        className="w-full max-w-4xl h-auto aspect-video shadow-lg rounded-lg border-none"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Embedded Google Drive Video"
      ></iframe>
    </div>
  );
};

export default Video;
