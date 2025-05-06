import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { mapFramework } from "../redux/apiCalls/frameworkApiCall";
import * as XLSX from "xlsx";

const Mapping = () => {
  const [frameworkA, setFrameworkA] = useState(null); // Parsed JSON
  const [frameworkB, setFrameworkB] = useState(null); // Parsed JSON
  const [frameworkAFile, setFrameworkAFile] = useState(null); // Raw File
  const [frameworkBFile, setFrameworkBFile] = useState(null); // Raw File
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.framework.loading);

  const handleFileUpload = (e, setFramework, setFile) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file); // Store file

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

  const handleMapping = () => {
    if (
      !frameworkA ||
      !frameworkB ||
      !name ||
      !description ||
      !frameworkAFile ||
      !frameworkBFile
    ) {
      alert(
        "Please upload both frameworks and provide a name and description."
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file1", frameworkAFile); // match backend name
    formData.append("file2", frameworkBFile); // match backend name

    dispatch(mapFramework(formData))
      .then(() => {
        // Reset state after successful mapping
        setFrameworkA(null);
        setFrameworkB(null);
        setFrameworkAFile(null);
        setFrameworkBFile(null);
        setName("");
        setDescription("");
      })
      .catch((error) => {
        console.error("Mapping failed", error);
      });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          🧩 Map Two GRC Frameworks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Framework A */}
          <div className="flex flex-col items-center space-y-3 border rounded-xl p-6 hover:bg-gray-50 transition">
            <UploadCloud className="text-blue-500 w-10 h-10" />
            <label className="font-semibold">Upload Framework A</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              id="frameworkA"
              onChange={(e) =>
                handleFileUpload(e, setFrameworkA, setFrameworkAFile)
              }
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

          {/* Upload Framework B */}
          <div className="flex flex-col items-center space-y-3 border rounded-xl p-6 hover:bg-gray-50 transition">
            <UploadCloud className="text-purple-500 w-10 h-10" />
            <label className="font-semibold">Upload Framework B</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              id="frameworkB"
              onChange={(e) =>
                handleFileUpload(e, setFrameworkB, setFrameworkBFile)
              }
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

        {/* Name and Description */}
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            className="p-3 border rounded-md"
            placeholder="Enter mapping (FRAMEWORK A TO FRAMWORK B)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="p-3 border rounded-md"
            placeholder="Enter Framework Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Start Mapping Button */}
        {frameworkA && frameworkB && (
          <div className="text-center">
            <button
              onClick={handleMapping}
              className={`px-6 py-2 rounded-md transition text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Mapping..." : "Start Mapping"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mapping;
