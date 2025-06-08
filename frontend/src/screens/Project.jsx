"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProjectById } from "../redux/apiCalls/projectApiCall";
import CreateAudit from "../components/CreateAudit";

// Icons
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
      clipRule="evenodd"
    />
  </svg>
);

const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Progress component with animation
const Progress = ({ value }) => (
  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
    <div
      className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${value}%` }}
    />
  </div>
);

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Planned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

// Stat card component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    </div>
  </div>
);

const Project = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        await dispatch(getProjectById(id));
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [dispatch, id]);

  const project = useSelector((state) => state.project.project) || {
    audits: [],
    frameworks: [],
    createdAt: new Date().toISOString(),
  };

  const totalAudits = project?.audits?.length || 0;
  const completedAudits =
    project?.audits?.filter((a) => a.status === "Completed").length || 0;
  const inProgressAudits =
    project?.audits?.filter((a) => a.status === "In Progress").length || 0;
  const plannedAudits = totalAudits - completedAudits - inProgressAudits;
  const progressPercentage =
    totalAudits === 0 ? 0 : Math.round((completedAudits / totalAudits) * 100);

  const handleSaveAudit = (newAudit) => {
    const newId = project.audits.length + 1;
    const updatedProject = {
      ...project,
      audits: [...project.audits, { id: newId, ...newAudit }],
    };
    dispatch({ type: "UPDATE_PROJECT", payload: updatedProject });
    setShowModal(false);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Filter and sort audits
  const filteredAudits = project?.audits
    ?.filter((audit) => {
      const matchesStatus =
        filterStatus === "All" || audit.status === filterStatus;
      const matchesSearch =
        searchTerm === "" ||
        audit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (audit.frameworkId?.name &&
          audit.frameworkId.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Project Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                  Audits
                  </h1>

                </div>


              </div>
              <button
                onClick={toggleModal}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors mt-4 md:mt-0"
              >
                <PlusIcon /> Add New Audit
              </button>
            </div>

            {/* Progress Section */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-700 font-medium">
                  Audit Completion Progress
                </p>
                <p className="text-sm font-semibold">
                  {completedAudits} of {totalAudits} audits completed (
                  {progressPercentage}%)
                </p>
              </div>
              <Progress value={progressPercentage} />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Audits"
              value={totalAudits}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
              color="bg-indigo-100"
            />
            <StatCard
              title="Completed Audits"
              value={completedAudits}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              color="bg-green-100"
            />
            <StatCard
              title="In Progress Audits"
              value={inProgressAudits}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              color="bg-yellow-100"
            />
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="search" className="sr-only">
                  Search audits
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search audits by name or framework..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-auto">
                  <label htmlFor="filter" className="sr-only">
                    Filter by status
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FilterIcon />
                    </div>
                    <select
                      id="filter"
                      className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Planned">Planned</option>
                    </select>
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <label htmlFor="sort" className="sr-only">
                    Sort by
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SortIcon />
                    </div>
                    <select
                      id="sort"
                      className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audits List */}
          <div className="space-y-4">
            {filteredAudits?.length > 0 ? (
              filteredAudits.map((audit) => (
                <Link
                  to={`/user/project/${id}/audit/${audit._id}`}
                  key={audit._id || audit.id}
                  className="block p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-3 md:mb-0">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        {audit.name}
                      </h2>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Framework: {audit.frameworkId?.name || "Unknown"}
                        </div>
                        {audit.createdAt && (
                          <div className="flex items-center">
                            <CalendarIcon />
                            <span className="ml-1">
                              {formatDate(audit.createdAt)}
                            </span>
                          </div>
                        )}
                        {audit.assignedTo && (
                          <div className="flex items-center">
                            <UserIcon />
                            <span className="ml-1">
                              Assigned to: {audit.assignedTo}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {audit.dueDate && (
                        <div className="text-sm text-gray-500">
                          Due: {formatDate(audit.dueDate)}
                        </div>
                      )}
                      <StatusBadge status={audit.status} />
                    </div>
                  </div>

                  {audit.progress !== undefined && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Audit Progress</span>
                        <span>{audit.progress}%</span>
                      </div>
                      <Progress value={audit.progress} />
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No audits found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterStatus !== "All"
                    ? "Try changing your search or filter criteria"
                    : "Get started by creating your first audit"}
                </p>
                <button
                  onClick={toggleModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon />
                  <span className="ml-2">Create New Audit</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Create Audit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Create New Audit
              </h3>
              <button
                onClick={toggleModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6">
              <CreateAudit
                projectId={id}
                frameworks={project?.frameworks || []}
                handleSaveAudit={handleSaveAudit}
                toggleModal={toggleModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
