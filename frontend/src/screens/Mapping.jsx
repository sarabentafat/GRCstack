"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  AlertCircle,
  X,
  CheckCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import * as XLSX from "xlsx";

const Mapping = () => {
  // Framework data states
  const [frameworkA, setFrameworkA] = useState(null); // Parsed JSON
  const [frameworkB, setFrameworkB] = useState(null); // Parsed JSON
  const [frameworkAFile, setFrameworkAFile] = useState(null); // Raw File
  const [frameworkBFile, setFrameworkBFile] = useState(null); // Raw File

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [mappingProgress, setMappingProgress] = useState(0);

  // Preview states
  const [showPreviewA, setShowPreviewA] = useState(false);
  const [showPreviewB, setShowPreviewB] = useState(false);

  // Refs for file inputs
  const fileInputARef = useRef(null);
  const fileInputBRef = useRef(null);

  // Validate file type and size
  const validateFile = (file) => {
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        message: "Invalid file type. Please upload an Excel file (.xlsx, .xls)",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        message: "File is too large. Maximum size is 10MB",
      };
    }

    return { valid: true };
  };

  const handleFileUpload = (e, setFramework, setFile, isFrameworkA) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setErrors((prev) => ({
        ...prev,
        [isFrameworkA ? "frameworkA" : "frameworkB"]: validation.message,
      }));
      return;
    }

    // Clear any previous errors
    setErrors((prev) => ({
      ...prev,
      [isFrameworkA ? "frameworkA" : "frameworkB"]: null,
    }));

    setFile(file); // Store file

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (jsonData.length === 0) {
          setErrors((prev) => ({
            ...prev,
            [isFrameworkA ? "frameworkA" : "frameworkB"]:
              "The uploaded file contains no data",
          }));
          return;
        }

        setFramework(jsonData);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          [isFrameworkA ? "frameworkA" : "frameworkB"]:
            "Failed to parse Excel file. Please check the file format.",
        }));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!frameworkA) newErrors.frameworkA = "Please upload Framework A";
    if (!frameworkB) newErrors.frameworkB = "Please upload Framework B";
    if (!name.trim()) newErrors.name = "Please enter a mapping name";
    if (!description.trim())
      newErrors.description = "Please enter a description";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMapping = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMappingProgress(0);
    setSuccess(false);

    // Create form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file1", frameworkAFile);
    formData.append("file2", frameworkBFile);

    try {
      // Simulate progress for demo purposes
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress > 100) {
            progress = 100;
            clearInterval(interval);
          }
          setMappingProgress(Math.floor(progress));
        }, 500);
        return interval;
      };

      const progressInterval = simulateProgress();

      // In a real app, you would use your dispatch here
      // await dispatch(mapFramework(formData));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      clearInterval(progressInterval);
      setMappingProgress(100);
      setSuccess(true);

      // Reset form after successful mapping
      setTimeout(() => {
        setFrameworkA(null);
        setFrameworkB(null);
        setFrameworkAFile(null);
        setFrameworkBFile(null);
        setName("");
        setDescription("");
        setLoading(false);
        setSuccess(false);
        setMappingProgress(0);
      }, 2000);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Mapping failed. Please try again.",
      }));
      setLoading(false);
    }
  };

  const resetFile = (isFrameworkA) => {
    if (isFrameworkA) {
      setFrameworkA(null);
      setFrameworkAFile(null);
      if (fileInputARef.current) fileInputARef.current.value = "";
    } else {
      setFrameworkB(null);
      setFrameworkBFile(null);
      if (fileInputBRef.current) fileInputBRef.current.value = "";
    }

    setErrors((prev) => ({
      ...prev,
      [isFrameworkA ? "frameworkA" : "frameworkB"]: null,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Framework Mapping Tool
          </h2>
          <p className="text-center mt-2 text-blue-100">
            Map controls between two GRC frameworks for comprehensive compliance
            management
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* General error message */}
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
              <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-red-700 dark:text-red-400 font-medium">
                  Error
                </p>
                <p className="text-red-600 dark:text-red-300 text-sm">
                  {errors.general}
                </p>
              </div>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start">
              <CheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-green-700 dark:text-green-400 font-medium">
                  Success
                </p>
                <p className="text-green-600 dark:text-green-300 text-sm">
                  Frameworks have been successfully mapped!
                </p>
              </div>
            </div>
          )}

          {/* Framework Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Framework A */}
            <div
              className={`border rounded-xl p-6 transition ${
                errors.frameworkA
                  ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                  : frameworkA
                  ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                {frameworkA ? (
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <FileSpreadsheet className="text-green-600 dark:text-green-400 w-8 h-8" />
                  </div>
                ) : (
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <UploadCloud className="text-blue-600 dark:text-blue-400 w-8 h-8" />
                  </div>
                )}

                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {frameworkA ? "Framework A Uploaded" : "Upload Framework A"}
                  </h3>

                  {frameworkA ? (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        ✓ {frameworkA.length} controls loaded
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {frameworkAFile?.name}
                      </p>

                      <div className="flex justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowPreviewA(!showPreviewA)}
                          className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800/50 transition"
                        >
                          {showPreviewA ? "Hide Preview" : "Preview"}
                        </button>
                        <button
                          type="button"
                          onClick={() => resetFile(true)}
                          className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        >
                          Replace
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Upload your first compliance framework
                    </p>
                  )}
                </div>

                {!frameworkA && (
                  <>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      className="hidden"
                      id="frameworkA"
                      ref={fileInputARef}
                      onChange={(e) =>
                        handleFileUpload(
                          e,
                          setFrameworkA,
                          setFrameworkAFile,
                          true
                        )
                      }
                    />
                    <label
                      htmlFor="frameworkA"
                      className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Select Excel File
                    </label>
                  </>
                )}

                {errors.frameworkA && (
                  <div className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.frameworkA}
                  </div>
                )}
              </div>

              {/* Preview for Framework A */}
              {showPreviewA && frameworkA && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Framework Preview (First 3 controls)
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3 max-h-40 overflow-y-auto text-xs">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          {Object.keys(frameworkA[0])
                            .slice(0, 3)
                            .map((key) => (
                              <th
                                key={key}
                                className="px-2 py-1 text-left text-gray-600 dark:text-gray-400"
                              >
                                {key}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {frameworkA.slice(0, 3).map((row, index) => (
                          <tr key={index}>
                            {Object.keys(row)
                              .slice(0, 3)
                              .map((key) => (
                                <td
                                  key={key}
                                  className="px-2 py-1 text-gray-800 dark:text-gray-200 truncate max-w-[150px]"
                                >
                                  {row[key]}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Framework B */}
            <div
              className={`border rounded-xl p-6 transition ${
                errors.frameworkB
                  ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                  : frameworkB
                  ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                {frameworkB ? (
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <FileSpreadsheet className="text-green-600 dark:text-green-400 w-8 h-8" />
                  </div>
                ) : (
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                    <UploadCloud className="text-purple-600 dark:text-purple-400 w-8 h-8" />
                  </div>
                )}

                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {frameworkB ? "Framework B Uploaded" : "Upload Framework B"}
                  </h3>

                  {frameworkB ? (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        ✓ {frameworkB.length} controls loaded
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {frameworkBFile?.name}
                      </p>

                      <div className="flex justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowPreviewB(!showPreviewB)}
                          className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800/50 transition"
                        >
                          {showPreviewB ? "Hide Preview" : "Preview"}
                        </button>
                        <button
                          type="button"
                          onClick={() => resetFile(false)}
                          className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        >
                          Replace
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Upload your second compliance framework
                    </p>
                  )}
                </div>

                {!frameworkB && (
                  <>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      className="hidden"
                      id="frameworkB"
                      ref={fileInputBRef}
                      onChange={(e) =>
                        handleFileUpload(
                          e,
                          setFrameworkB,
                          setFrameworkBFile,
                          false
                        )
                      }
                    />
                    <label
                      htmlFor="frameworkB"
                      className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Select Excel File
                    </label>
                  </>
                )}

                {errors.frameworkB && (
                  <div className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.frameworkB}
                  </div>
                )}
              </div>

              {/* Preview for Framework B */}
              {showPreviewB && frameworkB && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Framework Preview (First 3 controls)
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3 max-h-40 overflow-y-auto text-xs">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          {Object.keys(frameworkB[0])
                            .slice(0, 3)
                            .map((key) => (
                              <th
                                key={key}
                                className="px-2 py-1 text-left text-gray-600 dark:text-gray-400"
                              >
                                {key}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {frameworkB.slice(0, 3).map((row, index) => (
                          <tr key={index}>
                            {Object.keys(row)
                              .slice(0, 3)
                              .map((key) => (
                                <td
                                  key={key}
                                  className="px-2 py-1 text-gray-800 dark:text-gray-200 truncate max-w-[150px]"
                                >
                                  {row[key]}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mapping Direction Indicator */}
          {frameworkA && frameworkB && (
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Framework A
                </div>
                <ArrowRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Framework B
                </div>
              </div>
            </div>
          )}

          {/* Mapping Details Form */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="mapping-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Mapping Name
              </label>
              <input
                id="mapping-name"
                type="text"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.name
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="e.g., ISO 27001 to NIST CSF Mapping"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="mapping-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Mapping Description
              </label>
              <textarea
                id="mapping-description"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.description
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Describe the purpose and scope of this mapping..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Mapping Progress */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  Mapping in progress...
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {mappingProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${mappingProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This may take a few minutes depending on the size of your
                frameworks
              </p>
            </div>
          )}

          {/* Start Mapping Button */}
          <div className="text-center pt-4">
            <button
              onClick={handleMapping}
              className={`px-6 py-3 rounded-md text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : frameworkA && frameworkB
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500"
                  : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
              }`}
              disabled={loading || !frameworkA || !frameworkB}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Processing Mapping
                </span>
              ) : (
                "Generate Framework Mapping"
              )}
            </button>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {frameworkA && frameworkB
                ? `Ready to map ${frameworkA.length} controls to ${frameworkB.length} controls`
                : "Upload both frameworks to begin mapping"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapping;
