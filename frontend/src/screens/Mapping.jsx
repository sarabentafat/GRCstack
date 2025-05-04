import React, { useState } from "react";
import { UploadCloud, File } from "lucide-react";
import * as XLSX from "xlsx";

const Mapping = () => {
  const [frameworkA, setFrameworkA] = useState(null);
  const [frameworkB, setFrameworkB] = useState(null);

  const handleFileUpload = (e, setFramework) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setFramework(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          🧩 Map Two GRC Frameworks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload A */}
          <div className="flex flex-col items-center space-y-3 border rounded-xl p-6 hover:bg-gray-50 transition">
            <UploadCloud className="text-blue-500 w-10 h-10" />
            <label className="font-semibold">Upload Framework A</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              id="frameworkA"
              onChange={(e) => handleFileUpload(e, setFrameworkA)}
            />
            <label
              htmlFor="frameworkA"
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Choose File
            </label>
            {frameworkA && (
              <p className="text-sm text-green-600">
                ✅ {frameworkA.length} controls loaded
              </p>
            )}
          </div>

          {/* Upload B */}
          <div className="flex flex-col items-center space-y-3 border rounded-xl p-6 hover:bg-gray-50 transition">
            <UploadCloud className="text-purple-500 w-10 h-10" />
            <label className="font-semibold">Upload Framework B</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              id="frameworkB"
              onChange={(e) => handleFileUpload(e, setFrameworkB)}
            />
            <label
              htmlFor="frameworkB"
              className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              Choose File
            </label>
            {frameworkB && (
              <p className="text-sm text-green-600">
                ✅ {frameworkB.length} controls loaded
              </p>
            )}
          </div>
        </div>

        {/* Button to start mapping */}
        {frameworkA && frameworkB && (
          <div className="text-center">
            <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
              Start Mapping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mapping;
