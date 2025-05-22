"use client";

import { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  HelpCircle,
  Upload,
  AlertTriangle,
} from "lucide-react";

const statusColors = {
  "Not Started": "bg-gray-100 text-gray-600 border-gray-300",
  "In Progress": "bg-blue-100 text-blue-600 border-blue-300",
  Compliant: "bg-green-100 text-green-600 border-green-300",
  "Non-Compliant": "bg-red-100 text-red-600 border-red-300",
  "Not Applicable": "bg-purple-100 text-purple-600 border-purple-300",
};

const statusIcons = {
  "Not Started": <Loader2 className="h-4 w-4" />,
  "In Progress": <Loader2 className="h-4 w-4 animate-spin" />,
  Compliant: <CheckCircle2 className="h-4 w-4" />,
  "Non-Compliant": <XCircle className="h-4 w-4" />,
  "Not Applicable": <HelpCircle className="h-4 w-4" />,
};

const FocusMode = ({
  auditData,
  onClose,
  updateControlStatus,
  addEvidence,
}) => {
  const [ratableControls, setRatableControls] = useState([]);
  const [activeControl, setActiveControl] = useState(null);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    const extractRatableControls = (levels, parentTitle = "") => {
      let controls = [];

      if (!levels) return controls;

      levels.forEach((level) => {
        const fullTitle = parentTitle
          ? `${parentTitle} > ${level.title}`
          : level.title;

        // ✅ Only push levels that are ratable
        if (level.is_ratable) {
          controls.push({
            ...level,
            fullTitle,
          });
        }

        // Continue extracting from children regardless
        if (level.children && level.children.length > 0) {
          controls = [
            ...controls,
            ...extractRatableControls(level.children, fullTitle),
          ];
        }
      });

      return controls;
    };

    const controls = extractRatableControls(auditData?.frameworkId?.levels);
    setRatableControls(controls);

    if (controls.length > 0) {
      setActiveControl(controls[0]);
      setCurrentStatus(controls[0].status || "Not Started");
    }
  }, [auditData]);
  
  const handleStatusChange = (status) => {
    setCurrentStatus(status);
    updateControlStatus(activeControl.identifier, status);
  };

  const handleEvidenceUpload = () => {
    if (!evidenceFile) return;

    const evidence = {
      file: evidenceFile,
      description: evidenceDescription,
      uploadedAt: new Date().toISOString(),
    };

    addEvidence(activeControl.identifier, evidence);
    setEvidenceFile(null);
    setEvidenceDescription("");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  const handleNextControl = () => {
    const currentIndex = ratableControls.findIndex(
      (c) => c.identifier === activeControl.identifier
    );
    if (currentIndex < ratableControls.length - 1) {
      setActiveControl(ratableControls[currentIndex + 1]);
      setCurrentStatus(
        ratableControls[currentIndex + 1].status || "Not Started"
      );
      setEvidenceFile(null);
      setEvidenceDescription("");
    }
  };

  const handlePreviousControl = () => {
    const currentIndex = ratableControls.findIndex(
      (c) => c.identifier === activeControl.identifier
    );
    if (currentIndex > 0) {
      setActiveControl(ratableControls[currentIndex - 1]);
      setCurrentStatus(
        ratableControls[currentIndex - 1].status || "Not Started"
      );
      setEvidenceFile(null);
      setEvidenceDescription("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Focus Mode: All Controls</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {ratableControls.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <AlertTriangle className="h-12 w-12 mb-4" />
              <p className="text-lg">No controls found in this audit.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Control{" "}
                    {ratableControls.findIndex(
                      (c) => c.identifier === activeControl?.identifier
                    ) + 1}{" "}
                    of {ratableControls.length}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePreviousControl}
                    disabled={
                      ratableControls.findIndex(
                        (c) => c.identifier === activeControl?.identifier
                      ) === 0
                    }
                    className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextControl}
                    disabled={
                      ratableControls.findIndex(
                        (c) => c.identifier === activeControl?.identifier
                      ) ===
                      ratableControls.length - 1
                    }
                    className="px-3 py-1.5 text-sm bg-indigo-100 rounded-lg text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
                  >
                    Next
                  </button>
                </div>
              </div>

              {activeControl && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-indigo-700 dark:text-indigo-400">
                        {activeControl.identifier}
                      </span>
                      <div
                        className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 border ${statusColors[currentStatus]}`}
                      >
                        {statusIcons[currentStatus]}
                        <span>{currentStatus}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {activeControl.title}
                    </h3>
                    {activeControl.fullTitle && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Path: {activeControl.fullTitle}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Control Description
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      {activeControl.content !== "No content provided"
                        ? activeControl.content
                        : "No detailed description available for this control."}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recommendations
                    </h4>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-600 dark:text-gray-400">
                        {/* Mock recommendations based on control ID */}
                        {activeControl.identifier.includes("1")
                          ? "Ensure firewall configurations are properly documented and reviewed quarterly. Implement network segmentation to isolate cardholder data environment."
                          : activeControl.identifier.includes("2")
                          ? "Implement strong password policies with minimum 12 characters and complexity requirements. Remove default vendor accounts and passwords."
                          : activeControl.identifier.includes("3")
                          ? "Encrypt transmission of cardholder data across open, public networks using strong cryptography and security protocols."
                          : "Implement security controls according to industry best practices and maintain documentation of compliance."}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Update Status
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleStatusChange("Compliant")}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-1 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Compliant
                      </button>

                      <button
                        onClick={() => handleStatusChange("Non-Compliant")}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-1 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                      >
                        <XCircle className="h-4 w-4" />
                        Non-Compliant
                      </button>

                      <button
                        onClick={() => handleStatusChange("In Progress")}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-1 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                      >
                        <Loader2 className="h-4 w-4" />
                        In Progress
                      </button>

                      <button
                        onClick={() => handleStatusChange("Not Applicable")}
                        className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-1 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40"
                      >
                        <HelpCircle className="h-4 w-4" />
                        Not Applicable
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Evidence
                    </h4>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Evidence Description
                        </label>
                        <input
                          type="text"
                          value={evidenceDescription}
                          onChange={(e) =>
                            setEvidenceDescription(e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Describe this evidence..."
                        />
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          File
                        </label>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-indigo-900/20 dark:file:text-indigo-400"
                        />
                      </div>

                      <button
                        onClick={handleEvidenceUpload}
                        disabled={!evidenceFile}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Evidence
                      </button>
                    </div>
                  </div>

                  {activeControl.evidence &&
                    activeControl.evidence.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Existing Evidence
                        </h4>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {activeControl.evidence.map((ev, index) => (
                              <li
                                key={index}
                                className="py-2 flex justify-between items-center"
                              >
                                <div>
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {ev.name || "Evidence file"}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Uploaded:{" "}
                                    {new Date(
                                      ev.uploadedAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <a
                                  href={ev.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  View
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
