"use client";

import { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getframeworkById } from "../redux/apiCalls/frameworkApiCall";

// Memoized LevelItem component for better performance
const LevelItem = memo(({ level, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isUnknown = level.identifier?.toLowerCase().startsWith("unknown");
  const isUnknownContent = level.content
    ?.toLowerCase()
    .startsWith("no content");
  const hasChildren = level.children && level.children.length > 0;

  return (
    <li className="mb-2">
      <div
        className={`flex items-start gap-2 ${
          hasChildren
            ? "cursor-pointer hover:bg-gray-50 rounded p-1 -ml-1"
            : "p-1"
        }`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        role={hasChildren ? "button" : undefined}
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        {hasChildren && (
          <span
            className="text-gray-500 mt-0.5 w-4 flex-shrink-0"
            aria-hidden="true"
          >
            {isOpen ? "▼" : "▶"}
          </span>
        )}
        <div className="flex-1">
          {!isUnknown && level.identifier && (
            <span className="font-semibold text-gray-900">
              {level.identifier}{" "}
            </span>
          )}
          {!isUnknownContent && level.content && (
            <span className="text-gray-700">{level.content} </span>
          )}
          <span className="text-gray-800">{level.title}</span>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className={`pl-${Math.min(4, 6)} mt-1`}>
          <RenderLevels levels={level.children} depth={depth + 1} />
        </div>
      )}
    </li>
  );
});

// Memoized RenderLevels component for better performance
const RenderLevels = memo(({ levels, depth = 0 }) => {
  if (!levels || levels.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic pl-4 py-2">
        No levels available
      </p>
    );
  }

  return (
    <ul className="list-none space-y-1">
      {levels.map((level, index) => (
        <LevelItem
          key={level.identifier || `level-${index}`}
          level={level}
          depth={depth}
        />
      ))}
    </ul>
  );
});

// Reusable section component
const InfoSection = ({ title, content }) => (
  <div className="border-b border-gray-100 pb-4">
    <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-700">{content || "Not available"}</p>
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

const Framework = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [expandAll, setExpandAll] = useState(false);

  // Get framework data and loading state from Redux
  const {
    framework: frameworkData,
    loading,
    error,
  } = useSelector((state) => state.framework);

  useEffect(() => {
    if (id) {
      dispatch(getframeworkById(id));
    }
  }, [dispatch, id]);

  // Handle expand/collapse all levels
  useEffect(() => {
    if (expandAll) {
      // This is just a flag - the actual implementation would need to be more complex
      // to properly expand all levels
      const timer = setTimeout(() => setExpandAll(false), 100);
      return () => clearTimeout(timer);
    }
  }, [expandAll]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!frameworkData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">No data available</h2>
          <p>The requested framework could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {frameworkData.name}
        </h1>

        <button
          onClick={() => setExpandAll(true)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors"
        >
          Expand All Levels
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 space-y-5">
        <InfoSection title="Version" content={frameworkData.version} />
        <InfoSection
          title="Publisher / Provider"
          content={frameworkData.publisher}
        />
        <InfoSection title="Description" content={frameworkData.description} />

        <div className="pt-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Levels</h2>
          <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[600px]">
            <RenderLevels levels={frameworkData.levels} expandAll={expandAll} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Framework;
