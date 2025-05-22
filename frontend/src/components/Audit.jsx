"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  HelpCircle,
  Info,
  Layers,
  Loader2,
  Upload,
  XCircle,
} from "lucide-react";
import AuditReportGenerator from "./auditReportGenerator";
import { useDispatch, useSelector } from "react-redux";
import FocusMode from "./focus-mode";
import EvidenceUpload from "./evidence-upload";
import RecommendationPanel from "./recommendation-panel";
import { useParams } from "react-router-dom";
import { getauditFromProjectById } from "../redux/apiCalls/auditApiCall";

const statusColors = {
  "Not Started": "bg-gray-100 text-gray-600 border-gray-300",
  Evidence: "bg-blue-100 text-blue-600 border-blue-300",
  Compliant: "bg-green-100 text-green-600 border-green-300",
  "Non-Compliant": "bg-red-100 text-red-600 border-red-300",
  "Not Applicable": "bg-purple-100 text-purple-600 border-purple-300",
};

const statusIcons = {
  "Not Started": <Clock className="h-4 w-4" />,
  "In Progress": <Loader2 className="h-4 w-4 animate-spin" />,
  Compliant: <CheckCircle2 className="h-4 w-4" />,
  "Non-Compliant": <XCircle className="h-4 w-4" />,
  "Not Applicable": <HelpCircle className="h-4 w-4" />,
};

const Audit = () => {
  const { id, auditId } = useParams();
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  console.log(id, auditId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedLevels, setExpandedLevels] = useState({});
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [filterRatableOnly, setFilterRatableOnly] = useState(false);

  const dispatch = useDispatch();
  const auditData = useSelector((state) => state.audit.audit);

  useEffect(() => {
    dispatch(getauditFromProjectById(id, auditId));
    setLoading(false);
  }, [dispatch, id, auditId]);

  const toggleLevel = (identifier) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [identifier]: !prev[identifier],
    }));
  };

  const toggleRecommendations = (level) => {
    setSelectedLevel(level);
    setShowRecommendations(!showRecommendations);
  };

  const updateControlStatus = async (levelId, newStatus) => {
    try {
      // Mock API call - just update the state directly
      // In a real app, you would dispatch a Redux action here
      dispatch({
        type: "UPDATE_CONTROL_STATUS",
        payload: { levelId, newStatus },
      });
    } catch (error) {
      console.error("Error updating control status:", error);
    }
  };

  const addEvidence = async (levelId, evidence) => {
    try {
      // Mock API call - just update the state directly
      // In a real app, you would dispatch a Redux action here
      const mockEvidenceUrl = URL.createObjectURL(evidence);

      dispatch({
        type: "ADD_EVIDENCE",
        payload: { levelId, evidenceUrl: mockEvidenceUrl },
      });
    } catch (error) {
      console.error("Error adding evidence:", error);
    }
  };

  const LevelItem = ({ level, depth = 0 }) => {
    const isUnknown = level.identifier?.toLowerCase().startsWith("unknown");
    const isUnknownC = level.content?.toLowerCase().startsWith("no content");
    const hasChildren = level.children && level.children.length > 0;
    const isExpanded = expandedLevels[level.identifier];
    const isRatable = level.is_ratable;

    return (
      <div className="mb-3">
        <div
          className={`p-3 rounded-lg border ${
            isRatable
              ? "border-indigo-200 bg-indigo-50 dark:bg-indigo-900/10 dark:border-indigo-800"
              : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
          }`}
        >
          <div className="flex items-start justify-between">
            <div
              className="flex items-start gap-2 cursor-pointer"
              onClick={() => hasChildren && toggleLevel(level.identifier)}
            >
              {hasChildren && (
                <button className="mt-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 p-1 rounded">
                  <Layers className="h-4 w-4" />
                </button>
              )}

              <div>
                <div className="flex items-center gap-2">
                  {!isUnknown && (
                    <span className="font-medium text-indigo-700 dark:text-indigo-300">
                      {level.identifier}
                    </span>
                  )}

                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {level.title}
                  </span>
                </div>

                {!isUnknownC && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {level.content}
                  </p>
                )}
              </div>
            </div>

            {!isRatable && (
              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 border ${
                    statusColors[level.status] || statusColors["Not Started"]
                  }`}
                >
                  {statusIcons[level.status] || statusIcons["Not Started"]}
                  <span>{level.status}</span>
                </div>

                <button
                  onClick={() => toggleRecommendations(level)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {isRatable && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  updateControlStatus(level.identifier, "Compliant")
                }
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 flex items-center gap-1 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
              >
                <CheckCircle2 className="h-3 w-3" />
                Mark Compliant
              </button>

              <button
                onClick={() =>
                  updateControlStatus(level.identifier, "Non-Compliant")
                }
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 flex items-center gap-1 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
              >
                <XCircle className="h-3 w-3" />
                Mark Non-Compliant
              </button>

              <button
                onClick={() =>
                  updateControlStatus(level.identifier, "In Progress")
                }
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 flex items-center gap-1 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
              >
                <Loader2 className="h-3 w-3" />
                In Progress
              </button>

              <button
                onClick={() =>
                  updateControlStatus(level.identifier, "Not Applicable")
                }
                className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 flex items-center gap-1 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40"
              >
                <HelpCircle className="h-3 w-3" />
                Not Applicable
              </button>

              <EvidenceUpload
                levelId={level.identifier}
                onUpload={(evidence) => addEvidence(level.identifier, evidence)}
                existingEvidence={level.evidence || []}
              />
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-6 mt-2 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
            {level.children.map((child) => {
              const isUnknown = child.identifier
                ?.toLowerCase()
                .startsWith("unknown");
              const isUnknownC = child.content
                ?.toLowerCase()
                .startsWith("no content");
              const hasGrandChildren =
                child.children && child.children.length > 0;

              const isExpandedChild = expandedLevels[child.identifier];
              const isRatable = child.is_ratable;
              console.log(isRatable);
              console.log(child.level);
              return (
                <div key={child.identifier} className="mb-3">
                  <div
                    className={`p-3 rounded-lg border ${
                      isRatable
                        ? "border-indigo-200 bg-indigo-50 dark:bg-indigo-900/10 dark:border-indigo-800"
                        : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() =>
                          hasGrandChildren && toggleLevel(child.identifier)
                        }
                      >
                        {hasGrandChildren && (
                          <button className="mt-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 p-1 rounded">
                            {isExpandedChild ? (
                              <Layers className="h-4 w-4" />
                            ) : (
                              <Layers className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            {!isUnknown && (
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                {child.identifier}
                              </span>
                            )}
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {child.title}kk
                            </span>
                          </div>

                          {!isUnknownC && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {child.content}
                            </p>
                          )}
                        </div>
                      </div>

                      {!isRatable && (
                        <div className="flex items-center gap-2">
                          <div
                            className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 border ${
                              statusColors[child.status] ||
                              statusColors["Not Started"]
                            }`}
                          >
                            {statusIcons[child.status] ||
                              statusIcons["Not Started"]}
                            <span>{child.status}</span>
                          </div>

                          <button
                            onClick={() => toggleRecommendations(child)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/20"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isRatable && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            updateControlStatus(child.identifier, "Compliant")
                          }
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 flex items-center gap-1 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Mark Compliant
                        </button>

                        <button
                          onClick={() =>
                            updateControlStatus(
                              child.identifier,
                              "Non-Compliant"
                            )
                          }
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 flex items-center gap-1 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                        >
                          <XCircle className="h-3 w-3" />
                          Mark Non-Compliant
                        </button>

                        <button
                          onClick={() =>
                            updateControlStatus(child.identifier, "In Progress")
                          }
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 flex items-center gap-1 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                        >
                          <Loader2 className="h-3 w-3" />
                          In Progress
                        </button>

                        <button
                          onClick={() =>
                            updateControlStatus(
                              child.identifier,
                              "Not Applicable"
                            )
                          }
                          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 flex items-center gap-1 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40"
                        >
                          <HelpCircle className="h-3 w-3" />
                          Not Applicable
                        </button>

                        <EvidenceUpload
                          levelId={child.identifier}
                          onUpload={(evidence) =>
                            addEvidence(child.identifier, evidence)
                          }
                          existingEvidence={child.evidence || []}
                        />
                      </div>
                    )}
                  </div>

                  {/* recursive children here */}
                  {hasGrandChildren && isExpandedChild && (
                    <div className="ml-6 mt-2 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                      {/* 🌀 Recursive call again (same pattern, just pasted back recursively) */}
                      {child.children.map((grandChild) => {
                        // 👇 paste this whole block again here for deeper levels (or loop this recursively again if you prefer)
                        return (
                          <div
                            className={`p-3 rounded-lg border ${
                              isRatable
                                ? "border-indigo-200 bg-indigo-50 dark:bg-indigo-900/10 dark:border-indigo-800"
                                : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div
                                className="flex items-start gap-2 cursor-pointer"
                                onClick={() =>
                                  hasGrandChildren &&
                                  toggleLevel(child.identifier)
                                }
                              >
                                {hasGrandChildren && (
                                  <button className="mt-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 p-1 rounded">
                                    {isExpandedChild ? (
                                      <Layers className="h-4 w-4" />
                                    ) : (
                                      <Layers className="h-4 w-4" />
                                    )}
                                  </button>
                                )}

                                <div>
                                  <div className="flex items-center gap-2">
                                    {!isUnknown && (
                                      <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                        {child.identifier}
                                      </span>
                                    )}
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                      {child.title}kk
                                    </span>
                                  </div>

                                  {!isUnknownC && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                      {child.content}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {!isRatable && (
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 border ${
                                      statusColors[child.status] ||
                                      statusColors["Not Started"]
                                    }`}
                                  >
                                    {statusIcons[child.status] ||
                                      statusIcons["Not Started"]}
                                    <span>{child.status}</span>
                                  </div>

                                  <button
                                    onClick={() => toggleRecommendations(child)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/20"
                                  >
                                    <Info className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {isRatable && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                  onClick={() =>
                                    updateControlStatus(
                                      child.identifier,
                                      "Compliant"
                                    )
                                  }
                                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 flex items-center gap-1 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  Mark Compliant
                                </button>

                                <button
                                  onClick={() =>
                                    updateControlStatus(
                                      child.identifier,
                                      "Non-Compliant"
                                    )
                                  }
                                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 flex items-center gap-1 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                                >
                                  <XCircle className="h-3 w-3" />
                                  Mark Non-Compliant
                                </button>

                                <button
                                  onClick={() =>
                                    updateControlStatus(
                                      child.identifier,
                                      "In Progress"
                                    )
                                  }
                                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 flex items-center gap-1 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                                >
                                  <Loader2 className="h-3 w-3" />
                                  In Progress
                                </button>

                                <button
                                  onClick={() =>
                                    updateControlStatus(
                                      child.identifier,
                                      "Not Applicable"
                                    )
                                  }
                                  className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 flex items-center gap-1 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40"
                                >
                                  <HelpCircle className="h-3 w-3" />
                                  Not Applicable
                                </button>

                                <EvidenceUpload
                                  levelId={child.identifier}
                                  onUpload={(evidence) =>
                                    addEvidence(child.identifier, evidence)
                                  }
                                  existingEvidence={child.evidence || []}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const RenderLevels = ({ levels, depth = 0 }) => {
    const [openLevels, setOpenLevels] = useState({});

    const toggleLevel = (id) => {
      setOpenLevels((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    if (!levels || levels.length === 0) {
      return <li className="text-sm text-gray-700">No levels available</li>;
    }

    return (
      <ul className={`ml-${depth * 4} list-none text-sm text-gray-800`}>
        {levels.map((level) => {
          const isUnknown = level.identifier
            .toLowerCase()
            .startsWith("unknown");
          const isUnknownC = level.content
            .toLowerCase()
            .startsWith("no content");
          const hasChildren = level.children && level.children.length > 0;
          const isOpen = openLevels[level.identifier] || false;

          return (
            <li key={level.identifier} className="mb-3">
              <div
                className={`p-3 rounded-lg border ${
                  level.isRatable
                    ? "border-indigo-200 bg-indigo-50 dark:bg-indigo-900/10 dark:border-indigo-800"
                    : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
                } hover:shadow-sm transition-all duration-150`}
              >
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => hasChildren && toggleLevel(level.identifier)}
                >
                  <div className="flex items-start gap-2">
                    {hasChildren && (
                      <button className="mt-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 p-1 rounded-full w-5 h-5 flex items-center justify-center">
                        <span className="text-xs">{isOpen ? "▼" : "▶"}</span>
                      </button>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        {!isUnknown && (
                          <span className="font-medium text-indigo-700 dark:text-indigo-300">
                            {level.identifier}
                          </span>
                        )}
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {level.title}
                        </span>
                      </div>

                      {!isUnknownC && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {level.content}
                        </p>
                      )}
                    </div>
                  </div>

                  {!level.isRatable && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 border shadow-sm ${
                          statusColors[level.status] ||
                          statusColors["Not Started"]
                        }`}
                      >
                        {statusIcons[level.status] ||
                          statusIcons["Not Started"]}
                        <span>{level.status}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRecommendations(level);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {hasChildren && isOpen && (
                <div className="ml-6 mt-2 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                  <RenderLevels levels={level.children} depth={depth + 1} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-lg text-gray-600">
          Loading audit data...
        </span>
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-red-700 flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>Failed to load audit data. Please try again.</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{auditData?.name}</h1>
            <p className="mt-2 text-indigo-100">{auditData?.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFocusMode(true)}
              className="px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 flex items-center gap-2 shadow-sm"
            >
              <Filter className="h-4 w-4" />
              Focus Mode
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-white/20 px-3 py-2 rounded-lg">
            <span className="text-xs text-indigo-100">Framework</span>
            <p className="font-medium">
              {auditData?.frameworkId?.name} {auditData?.frameworkId?.version}
            </p>
          </div>
          <div className="bg-white/20 px-3 py-2 rounded-lg">
            <span className="text-xs text-indigo-100">Scope</span>
            <p className="font-medium">{auditData?.scope}</p>
          </div>
          <div className="bg-white/20 px-3 py-2 rounded-lg">
            <span className="text-xs text-indigo-100">Objectives</span>
            <p className="font-medium">{auditData?.objectives}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "overview"
                ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("controls")}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "controls"
                ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Controls
          </button>
          <button
            onClick={() => setActiveTab("evidence")}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "evidence"
                ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Evidence
          </button>
          <button
            onClick={() => setActiveTab("findings")}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "findings"
                ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Findings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Audit Details
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Framework
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200">
                      {auditData?.frameworkId?.name} (
                      {auditData?.frameworkId?.version})
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200">
                      {auditData?.frameworkId?.description ||
                        "No description provided"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Language
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200">
                      {auditData?.frameworkId?.language || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Provider
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200">
                      {auditData?.frameworkId?.provider || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Audit Progress
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  {/* Mock progress data - would be calculated from actual control statuses */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">
                          Overall Completion
                        </span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          45%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                        <div
                          className="bg-indigo-500 h-2.5 rounded-full"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-lg dark:bg-green-900/20">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Compliant
                              </div>
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                12
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-red-100 p-2 rounded-lg dark:bg-red-900/20">
                              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Non-Compliant
                              </div>
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                5
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-lg dark:bg-blue-900/20">
                              <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                In Progress
                              </div>
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                8
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-lg dark:bg-gray-700">
                              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Not Started
                              </div>
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                15
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Recent Activity
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="space-y-3">
                  {/* Mock activity data */}
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900/20">
                      <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-medium">John Doe</span> uploaded
                        evidence for control{" "}
                        <span className="font-medium">PCI DSS 1.2.1</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Today at 10:30 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="bg-green-100 p-2 rounded-full dark:bg-green-900/20">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-medium">Sarah Johnson</span>{" "}
                        marked control{" "}
                        <span className="font-medium">PCI DSS 2.1.3</span> as
                        Compliant
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Yesterday at 3:45 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="bg-red-100 p-2 rounded-full dark:bg-red-900/20">
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-medium">Mike Williams</span>{" "}
                        marked control{" "}
                        <span className="font-medium">PCI DSS 3.4.1</span> as
                        Non-Compliant
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        May 20, 2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "controls" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Controls
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg flex items-center gap-1 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <button
                  onClick={() => setShowReportGenerator(true)}
                  className="px-3 py-1.5 text-sm bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-1 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                >
                  <FileText className="h-4 w-4" />
                  Export Roadmap
                </button>
              </div>
            </div>
            {showReportGenerator && (
              <AuditReportGenerator
                auditData={auditData}
                onClose={() => setShowReportGenerator(false)}
              />
            )}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="mb-4 flex flex-wrap gap-2">
                <div className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg flex items-center gap-1 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
                  <span className="font-medium">Status:</span> All
                </div>
                <div className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg flex items-center gap-1 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
                  <span className="font-medium">Level:</span> All
                </div>
                <button
                  onClick={() => setFilterRatableOnly(!filterRatableOnly)}
                  className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                    filterRatableOnly
                      ? "bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-900/10 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                      : "bg-white border border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  }`}
                >
                  <span className="font-medium">Show:</span>{" "}
                  {filterRatableOnly ? "Ratable Only" : "All Controls"}
                </button>
              </div>

              <RenderLevels levels={auditData?.frameworkId?.levels} />
            </div>
          </div>
        )}

        {activeTab === "evidence" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Evidence Repository
            </h2>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              {/* Mock evidence data */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Control ID
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        File Name
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Uploaded By
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Date
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        PCI DSS 1.2.1
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        firewall_config.pdf
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        John Doe
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        May 21, 2024
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          View
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        PCI DSS 2.1.3
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        password_policy.docx
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        Sarah Johnson
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        May 20, 2024
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          View
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        PCI DSS 3.4.1
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        encryption_standards.pdf
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        Mike Williams
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        May 19, 2024
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "findings" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Audit Findings
            </h2>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              {/* Mock findings data */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        Finding #1: Inadequate Firewall Configuration
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Related to control: PCI DSS 1.2.1
                      </p>
                      <div className="mt-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          The current firewall configuration does not adequately
                          restrict inbound and outbound traffic to only
                          necessary protocols.
                        </p>
                      </div>
                    </div>
                    <div className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                      High Risk
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recommendation
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Update firewall rules to restrict traffic to only
                      necessary protocols and services according to documented
                      business needs.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        Finding #2: Weak Password Policy
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Related to control: PCI DSS 2.1.3
                      </p>
                      <div className="mt-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Current password policy does not enforce sufficient
                          complexity requirements and allows passwords to be
                          reused too frequently.
                        </p>
                      </div>
                    </div>
                    <div className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                      Medium Risk
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recommendation
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Update password policy to require minimum 12 characters
                      with complexity and implement a password history of at
                      least 12 previous passwords.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Focus Mode Dialog */}
      {showFocusMode && (
        <FocusMode
          auditData={auditData}
          onClose={() => setShowFocusMode(false)}
          updateControlStatus={updateControlStatus}
          addEvidence={addEvidence}
        />
      )}

      {/* Recommendations Panel */}
      {showRecommendations && selectedLevel && (
        <RecommendationPanel
          level={selectedLevel}
          onClose={() => setShowRecommendations(false)}
        />
      )}
    </div>
  );
};

export default Audit;
