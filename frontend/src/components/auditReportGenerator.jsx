"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";
import {
  FaFileAlt,
  FaDownload,
  FaEnvelope,
  FaPrint,
  FaCog,
  FaChartBar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaTimes,
} from "react-icons/fa";

// Enhanced PDF generation function
const generateEnhancedPDFReport = (auditData,stats, options) => {
  console.log("Generating enhanced PDF report with options:", options);
  console.log("Audit Data:", auditData);
  console.log("Statistics:", stats);
  const doc = new jsPDF();
  let yPosition = 20;

  // // Calculate statistics
  // const stats = calculateAuditStats(auditData);

  // Add header with logo and branding
  addPDFHeader(doc, options, auditData);
  yPosition = 60;

  // Add executive summary if requested
  if (options?.includeSummary) {
    yPosition = addExecutiveSummary(doc, auditData, stats, yPosition);
  }

  // Add charts if requested
  if (options?.includeCharts) {
    yPosition = addChartsSection(doc, stats, yPosition);
  }

  // Add detailed findings table
  yPosition = addDetailedFindings(doc, auditData, options, yPosition);

  // Add recommendations if requested
  if (options?.includeRecommendations) {
    addRecommendationsSection(doc, auditData, yPosition);
  }

  // Add footer to all pages
  addPDFFooter(doc, options);

  // Save the PDF
  const fileName = `${auditData.name.replace(
    /[^a-z0-9]/gi,
    "_"
  )}_Audit_Report_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};


const addPDFHeader = (doc, options, auditData) => {
  // Header background
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 50, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(options?.reportTitle || "Audit Compliance Report", 14, 25);

  // Subtitle
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`${auditData.name} - ${auditData.frameworkId.name}`, 14, 35);

  // Company name
  if (options?.companyName) {
    doc.setFontSize(10);
    doc.text(options.companyName, 14, 45);
  }

  // Reset text color
  doc.setTextColor(0, 0, 0);
};

const addExecutiveSummary = (doc, auditData, stats, yPosition) => {
  if (!stats) {
    console.error("addExecutiveSummary: stats object is missing or undefined");
    return yPosition;
  }
console.log("Adding Executive Summary with stats:", stats);
  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 14, yPosition);
  yPosition += 15;

  // Provide default values if some stats fields are missing
  const summaryData = [
    ["Total Controls", (stats.totalControls ?? 0).toString()],
    ["Compliant", (stats.compliant ?? 0).toString()],
    ["Non-Compliant", (stats.nonCompliant ?? 0).toString()],
    ["In progress", (stats.inProgress ?? 0).toString()],
    ["Not Started", (stats.notStarted ?? 0).toString()],
    ["Compliance Rate", `${(stats.compliancePercentage ?? 0).toFixed(2)}%`],
  ];

  autoTable(doc, {
    head: [["Metric", "Value"]],
    body: summaryData,
    startY: yPosition,
    theme: "striped",
    headStyles: { fillColor: [52, 152, 219] },
    margin: { left: 14, right: 14 },
    tableWidth: "auto",
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40, halign: "center" },
    },
  });

  return doc.lastAutoTable.finalY + 20;
};


const addChartsSection = (doc, stats, yPosition) => {
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Compliance Overview", 14, yPosition);
  yPosition += 20;

  // Simple bar chart representation
  const chartData = [
    { label: "Compliant", value: stats.compliant, color: [46, 204, 113] },
    { label: "Non-Compliant", value: stats.nonCompliant, color: [231, 76, 60] },
    { label: "Partial", value: stats.partial, color: [241, 196, 15] },
    { label: "Not Assessed", value: stats.notAssessed, color: [149, 165, 166] },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));
  const barHeight = 15;
  const barSpacing = 25;

  chartData.forEach((item, index) => {
    const barWidth = (item.value / maxValue) * 120;
    const y = yPosition + index * barSpacing;

    // Draw bar
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.rect(14, y, barWidth, barHeight, "F");

    // Add label and value
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`${item.label}: ${item.value}`, 140, y + 10);
  });

  return yPosition + chartData.length * barSpacing + 20;
};

const addDetailedFindings = (doc, auditData, options, yPosition) => {
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Findings", 14, yPosition);
  yPosition += 15;

  // Prepare table data with enhanced structure
  const tableData = [];
  const processLevel = (items, parentPath = "") => {
    items.forEach((item) => {
      const currentPath = parentPath
        ? `${parentPath}.${item.identifier}`
        : item.identifier;

      tableData.push({
        identifier: item.identifier || "N/A",
        title: item.title || "Untitled",
        status: item.status || "not-assessed",
        content: item.content || "No content provided",
        path: currentPath,
      });

      if (item.children) {
        processLevel(item.children, currentPath);
      }
    });
  };

  if (auditData.frameworkId?.levels) {
    processLevel(auditData.frameworkId.levels);
  }

  // Enhanced table with better styling
  autoTable(doc, {
    head: [["ID", "Control/Requirement", "Status", "Description"]],
    body: tableData.map((row) => [
      row.identifier,
      row.title,
      row.status.toUpperCase(),
      row.content.length > 100
        ? row.content.substring(0, 100) + "..."
        : row.content,
    ]),
    startY: yPosition,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 4,
      overflow: "linebreak",
      lineColor: [200, 200, 200],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 25, halign: "center" },
      1: { cellWidth: 60 },
      2: { cellWidth: 30, halign: "center" },
      3: { cellWidth: 75 },
    },
    didParseCell: (data) => {
      if (data.column.index === 2 && data.section === "body") {
        const status = data.cell.text[0]?.toLowerCase();
        switch (status) {
          case "compliant":
            data.cell.styles.fillColor = [46, 204, 113];
            data.cell.styles.textColor = [255, 255, 255];
            break;
          case "non-compliant":
            data.cell.styles.fillColor = [231, 76, 60];
            data.cell.styles.textColor = [255, 255, 255];
            break;
          case "partial":
            data.cell.styles.fillColor = [241, 196, 15];
            data.cell.styles.textColor = [0, 0, 0];
            break;
          case "not-assessed":
            data.cell.styles.fillColor = [149, 165, 166];
            data.cell.styles.textColor = [255, 255, 255];
            break;
        }
      }
    },
  });

  return doc.lastAutoTable.finalY + 20;
};

const addRecommendationsSection = (doc, auditData, yPosition) => {
  doc.addPage();
  yPosition = 20;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Recommendations", 14, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  const recommendations = [
    "Implement regular compliance monitoring procedures",
    "Establish clear documentation standards for all controls",
    "Conduct periodic internal audits to maintain compliance",
    "Provide comprehensive staff training on compliance requirements",
    "Develop and test incident response procedures",
    "Create a compliance dashboard for real-time monitoring",
    "Establish regular review cycles for all policies and procedures",
  ];

  recommendations.forEach((rec, index) => {
    doc.text(`${index + 1}. ${rec}`, 14, yPosition);
    yPosition += 10;
  });
};

const addPDFFooter = (doc, options) => {
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 280, 196, 280);

    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 285);
    doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: "right" });

    if (options?.companyName) {
      doc.text(options?.companyName, 105, 285, { align: "center" });
    }
  }
};

const AuditReportGenerator = ({ auditData,stats, onClose }) => {
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [reportOptions, setReportOptions] = useState({
    includeCharts: true,
    includeSummary: true,
    includeRecommendations: true,
    includeEvidence: false,
    template: "standard",
    companyName: "",
    reportTitle: "Audit Compliance Report",
    customNotes: "",
  });

  const complianceRate = stats.compliancePercentage;

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));
      generateEnhancedPDFReport(auditData,stats, reportOptions);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setGenerating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "compliant":
        return <FaCheckCircle className="h-4 w-4 text-green-500" />;
      case "non-compliant":
        return <FaTimesCircle className="h-4 w-4 text-red-500" />;
      case "partial":
        return <FaExclamationTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <FaClock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      compliant: "bg-green-100 text-green-800 border-green-200",
      "non-compliant": "bg-red-100 text-red-800 border-red-200",
      partial: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "not-assessed": "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${
          colors[status] || colors["not-assessed"]
        }`}
      >
        {status.replace("-", " ").toUpperCase()}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaFileAlt className="h-6 w-6" />
                Enhanced Audit Report Generator
              </h1>
              <p className="text-gray-600 mt-1">
                Generate comprehensive audit reports with professional styling
                and customizable options
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
              >
                <FaTimes className="h-4 w-4" />
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Overview */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md border">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Audit Overview
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Audit Name
                  </label>
                  <p className="text-sm text-gray-600">
                    {auditData?.name || "Unnamed Audit"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Framework
                  </label>
                  <p className="text-sm text-gray-600">
                    {auditData?.frameworkId?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Audit ID
                  </label>
                  <p className="text-sm text-gray-600 font-mono">
                    {auditData?._id || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Generated
                  </label>
                  <p className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="text-sm text-gray-600">
                  {auditData?.description || "No description provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Statistics */}
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaChartBar className="h-5 w-5" />
              Compliance Overview
            </h2>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {complianceRate}%
                </div>
                <p className="text-sm text-gray-600">Overall Compliance</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${complianceRate}%` }}
                ></div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Compliant</span>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {stats.compliant}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaTimesCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Non-Compliant</span>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {stats.nonCompliant}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaExclamationTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">In progress</span>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    {stats.inProgress}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaClock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Not Started</span>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {stats.notStarted}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("preview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "preview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaEye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaCog className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={() => setActiveTab("generate")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "generate"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaDownload className="h-4 w-4" />
              Generate
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "preview" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Report Preview
                </h3>
                <p className="text-gray-600 mb-4">
                  Preview of the controls that will be included in your report
                </p>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {auditData?.frameworkId?.levels?.map((level, levelIndex) => (
                  <div key={levelIndex} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">
                        {level.identifier}: {level.title}
                      </h4>
                      {getStatusBadge(level.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {level.content}
                    </p>

                    {level.children && (
                      <div className="space-y-2 ml-4">
                        {level.children.map((principle, principleIndex) => (
                          <div
                            key={principleIndex}
                            className="border-l-2 border-gray-200 pl-4"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="text-sm font-medium">
                                {principle.identifier}: {principle.title}
                              </h5>
                              {getStatusIcon(principle.status)}
                            </div>
                            <p className="text-xs text-gray-600">
                              {principle.content}
                            </p>

                            {principle.children && (
                              <div className="space-y-1 ml-4 mt-2">
                                {principle.children.map(
                                  (control, controlIndex) => (
                                    <div
                                      key={controlIndex}
                                      className="flex items-center justify-between text-xs"
                                    >
                                      <span>
                                        {control.identifier}: {control.title}
                                      </span>
                                      {getStatusIcon(control.status)}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Report Configuration
                </h3>
                <p className="text-gray-600 mb-4">
                  Customize your report settings and branding
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="reportTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Report Title
                  </label>
                  <input
                    id="reportTitle"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={reportOptions?.reportTitle}
                    onChange={(e) =>
                      setReportOptions((prev) => ({
                        ...prev,
                        reportTitle: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={reportOptions?.companyName}
                    onChange={(e) =>
                      setReportOptions((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="template"
                  className="block text-sm font-medium text-gray-700"
                >
                  Report Template
                </label>
                <select
                  id="template"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={reportOptions?.template}
                  onChange={(e) =>
                    setReportOptions((prev) => ({
                      ...prev,
                      template: e.target.value,
                    }))
                  }
                >
                  <option value="standard">Standard Report</option>
                  <option value="executive">Executive Summary</option>
                  <option value="detailed">Detailed Analysis</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Report Sections
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="includeSummary"
                      className="text-sm text-gray-700"
                    >
                      Executive Summary
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="includeSummary"
                        type="checkbox"
                        className="sr-only peer"
                        checked={reportOptions?.includeSummary}
                        onChange={(e) =>
                          setReportOptions((prev) => ({
                            ...prev,
                            includeSummary: e.target.checked,
                          }))
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="includeCharts"
                      className="text-sm text-gray-700"
                    >
                      Charts & Visualizations
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="includeCharts"
                        type="checkbox"
                        className="sr-only peer"
                        checked={reportOptions?.includeCharts}
                        onChange={(e) =>
                          setReportOptions((prev) => ({
                            ...prev,
                            includeCharts: e.target.checked,
                          }))
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="includeRecommendations"
                      className="text-sm text-gray-700"
                    >
                      Recommendations
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="includeRecommendations"
                        type="checkbox"
                        className="sr-only peer"
                        checked={reportOptions?.includeRecommendations}
                        onChange={(e) =>
                          setReportOptions((prev) => ({
                            ...prev,
                            includeRecommendations: e.target.checked,
                          }))
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="includeEvidence"
                      className="text-sm text-gray-700"
                    >
                      Evidence & Documentation
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="includeEvidence"
                        type="checkbox"
                        className="sr-only peer"
                        checked={reportOptions?.includeEvidence}
                        onChange={(e) =>
                          setReportOptions((prev) => ({
                            ...prev,
                            includeEvidence: e.target.checked,
                          }))
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="customNotes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Custom Notes
                </label>
                <textarea
                  id="customNotes"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any custom notes or comments for the report..."
                  value={reportOptions?.customNotes}
                  onChange={(e) =>
                    setReportOptions((prev) => ({
                      ...prev,
                      customNotes: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          {activeTab === "generate" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Generate Report
                </h3>
                <p className="text-gray-600 mb-4">
                  Ready to generate your professional audit report
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="font-semibold">PDF Report</h4>
                      <p className="text-sm text-gray-600">
                        Comprehensive PDF document
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="h-8 w-8 text-green-500" />
                    <div>
                      <h4 className="font-semibold">Email Report</h4>
                      <p className="text-sm text-gray-600">Send via email</p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FaPrint className="h-8 w-8 text-purple-500" />
                    <div>
                      <h4 className="font-semibold">Print Ready</h4>
                      <p className="text-sm text-gray-600">
                        Optimized for printing
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {generating && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">
                      Generating your professional report...
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleGenerateReport}
                  disabled={generating}
                  className={`flex-1 px-6 py-3 rounded-md text-white font-semibold flex items-center justify-center gap-2 ${
                    generating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  }`}
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaDownload className="h-4 w-4" />
                      Generate Enhanced PDF Report
                    </>
                  )}
                </button>
                <button
                  disabled={generating}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
                >
                  <FaEnvelope className="h-4 w-4" />
                  Email
                </button>
                <button
                  disabled={generating}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
                >
                  <FaPrint className="h-4 w-4" />
                  Print
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditReportGenerator;
