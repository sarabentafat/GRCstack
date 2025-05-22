"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Printer,
  Mail,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
} from "lucide-react";

const AuditReportGenerator = ({ auditData, onClose}) => {
    const safeOnClose = typeof onClose === "function" ? onClose : () => {};
  const [reportFormat, setReportFormat] = useState("pdf");
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includeFindings, setIncludeFindings] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Calculate statistics for the report
  const stats = {
    totalControls: 40,
    compliant: 12,
    nonCompliant: 5,
    inProgress: 8,
    notStarted: 15,
    complianceRate: 30,
    highRiskFindings: 2,
    mediumRiskFindings: 3,
    lowRiskFindings: 1,
  };

  const generateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const dummyLink = document.createElement("a");
      dummyLink.href = "#";
      dummyLink.setAttribute(
        "download",
        `${auditData?.name || "Audit"}-Report.${reportFormat}`
      );
      dummyLink.click();
      safeOnClose(); // safe call
    }, 2000);
  };

  const handleClose = () => {
    safeOnClose(); // safe call
  };
  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Generate Audit Roadmap Report
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Rest of the component remains the same */}
        <div className="p-6 space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <h3 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">
              Report Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Audit Name:</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {auditData?.name || "Unnamed Audit"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Framework:</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {auditData?.frameworkId?.name}{" "}
                  {auditData?.frameworkId?.version}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  Date Generated:
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  Compliance Rate:
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {stats.complianceRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Report Options
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Report Format
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked={reportFormat === "pdf"}
                      onChange={() => setReportFormat("pdf")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      PDF
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="xlsx"
                      checked={reportFormat === "xlsx"}
                      onChange={() => setReportFormat("xlsx")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Excel
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="docx"
                      checked={reportFormat === "docx"}
                      onChange={() => setReportFormat("docx")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Word
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Report Content
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeEvidence}
                      onChange={() => setIncludeEvidence(!includeEvidence)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Include Evidence
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeFindings}
                      onChange={() => setIncludeFindings(!includeFindings)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Include Findings
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeRecommendations}
                      onChange={() =>
                        setIncludeRecommendations(!includeRecommendations)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Include Recommendations
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
              Report Preview
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Compliance Summary
                </h4>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800 text-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-green-700 dark:text-green-400">
                    {stats.compliant}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-500">
                    Compliant
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800 text-center">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-red-700 dark:text-red-400">
                    {stats.nonCompliant}
                  </div>
                  <div className="text-xs text-red-600 dark:text-red-500">
                    Non-Compliant
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 text-center">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                    {stats.inProgress}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-500">
                    In Progress
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-600 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    {stats.notStarted}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Not Started
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      High Risk Findings: {stats.highRiskFindings}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Medium Risk Findings: {stats.mediumRiskFindings}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Low Risk Findings: {stats.lowRiskFindings}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <div className="flex space-x-2">
            <button
              className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm flex items-center hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm flex items-center hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
              <Printer className="h-4 w-4 mr-1" />
              Print Preview
            </button>
            <button className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm flex items-center hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
              <Mail className="h-4 w-4 mr-1" />
              Email Report
            </button>
          </div>

          <button
            className={`px-4 py-2 bg-indigo-600 text-white rounded text-sm flex items-center hover:bg-indigo-700 transition-colors ${
              generating ? "opacity-75 cursor-not-allowed" : ""
            }`}
            onClick={generateReport}
            disabled={generating}
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-1" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditReportGenerator;
