"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Trash2,
  Filter,
  ArrowUpDown,
  Search,
  Plus,
  AlertCircle,
  Loader2,
} from "lucide-react";

const Frameworks = () => {
  // State management
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        // In a real app, this would be your API call or Redux dispatch
        // await dispatch(getFrameworks());

        // Simulate API call with mock data
        setTimeout(() => {
          const mockFrameworks = [
            {
              _id: "1",
              name: "ISO 27001",
              version: "2022",
              provider: "ISO",
              language: "English",
              controlCount: 114,
            },
            {
              _id: "2",
              name: "NIST CSF",
              version: "1.1",
              provider: "NIST",
              language: "English",
              controlCount: 108,
            },
            {
              _id: "3",
              name: "PCI DSS",
              version: "4.0",
              provider: "PCI Council",
              language: "English",
              controlCount: 78,
            },
            {
              _id: "4",
              name: "HIPAA",
              version: "2023",
              provider: "HHS",
              language: "English",
              controlCount: 42,
            },
            {
              _id: "5",
              name: "SOC 2",
              version: "2017",
              provider: "AICPA",
              language: "English",
              controlCount: 64,
            },
            {
              _id: "6",
              name: "GDPR",
              version: "2018",
              provider: "EU",
              language: "Multiple",
              controlCount: 99,
            },
            {
              _id: "7",
              name: "CCPA",
              version: "2020",
              provider: "California",
              language: "English",
              controlCount: 27,
            },
            {
              _id: "8",
              name: "ISO 9001",
              version: "2015",
              provider: "ISO",
              language: "Multiple",
              controlCount: 56,
            },
            {
              _id: "9",
              name: "CMMC",
              version: "2.0",
              provider: "DoD",
              language: "English",
              controlCount: 110,
            },
            {
              _id: "10",
              name: "FedRAMP",
              version: "2023",
              provider: "GSA",
              language: "English",
              controlCount: 325,
            },
            {
              _id: "11",
              name: "CIS Controls",
              version: "8.0",
              provider: "CIS",
              language: "English",
              controlCount: 153,
            },
            {
              _id: "12",
              name: "COBIT",
              version: "2019",
              provider: "ISACA",
              language: "English",
              controlCount: 40,
            },
          ];
          setFrameworks(mockFrameworks);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load frameworks. Please try again.");
        setLoading(false);
      }
    };

    fetchFrameworks();
  }, []);

  // Derived data
  const providers = [
    ...new Set(frameworks.map((fw) => fw.provider || "Unknown")),
  ];
  const languages = [
    ...new Set(frameworks.map((fw) => fw.language || "Unknown")),
  ];

  // Filtering
  const filteredFrameworks = frameworks.filter((fw) => {
    const matchesText =
      fw.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      fw.provider?.toLowerCase().includes(filterText.toLowerCase());
    const matchesProvider = providerFilter
      ? fw.provider === providerFilter
      : true;
    const matchesLanguage = languageFilter
      ? fw.language === languageFilter
      : true;
    return matchesText && matchesProvider && matchesLanguage;
  });

  // Sorting
  const sortedFrameworks = [...filteredFrameworks].sort((a, b) => {
    let aValue = a[sortField] || "";
    let bValue = b[sortField] || "";

    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFrameworks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedFrameworks.length / itemsPerPage);

  // Event handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmation(id);
  };

  const confirmDelete = async () => {
    try {
      // In a real app, this would be your API call or Redux dispatch
      // await dispatch(deleteFramework(deleteConfirmation));

      // Simulate API call
      setFrameworks(frameworks.filter((fw) => fw._id !== deleteConfirmation));
      setDeleteConfirmation(null);
    } catch (err) {
      setError("Failed to delete framework. Please try again.");
    }
  };

  const handleView = (id) => {
    // In a real app, this would navigate to the framework detail page
    // navigate(`/user/frameworks/${id}`);
    console.log("View framework:", id);
  };

  const resetFilters = () => {
    setFilterText("");
    setProviderFilter("");
    setLanguageFilter("");
  };

  // Render helpers
  const renderSortIcon = (field) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" />;
    return sortDirection === "asc" ? (
      <ArrowUpDown className="h-4 w-4 ml-1 text-blue-600" />
    ) : (
      <ArrowUpDown className="h-4 w-4 ml-1 text-blue-600 transform rotate-180" />
    );
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Compliance Frameworks
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your organization's compliance frameworks
            </p>
          </div>
          <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add Framework
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
            <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-red-800 dark:text-red-300">{error}</p>
              <button
                className="text-red-600 dark:text-red-400 text-sm mt-1 underline"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Search and filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search frameworks..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              {(providerFilter || languageFilter) && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Provider
                  </label>
                  <select
                    value={providerFilter}
                    onChange={(e) => setProviderFilter(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Providers</option>
                    {providers.map((prov, idx) => (
                      <option key={idx} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Language
                  </label>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Languages</option>
                    {languages.map((lang, idx) => (
                      <option key={idx} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results summary */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            {loading ? (
              <span>Loading frameworks...</span>
            ) : (
              <span>
                Showing {currentItems.length} of {filteredFrameworks.length}{" "}
                frameworks
                {(filterText || providerFilter || languageFilter) &&
                  " (filtered)"}
              </span>
            )}
          </div>
        </div>

        {/* Frameworks table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading frameworks...
            </span>
          </div>
        ) : filteredFrameworks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No frameworks found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filterText || providerFilter || languageFilter
                ? "Try adjusting your search or filters"
                : "Get started by adding your first compliance framework"}
            </p>
            {filterText || providerFilter || languageFilter ? (
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Add Framework
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        {renderSortIcon("name")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("version")}
                    >
                      <div className="flex items-center">
                        Version
                        {renderSortIcon("version")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("provider")}
                    >
                      <div className="flex items-center">
                        Provider
                        {renderSortIcon("provider")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("language")}
                    >
                      <div className="flex items-center">
                        Language
                        {renderSortIcon("language")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("controlCount")}
                    >
                      <div className="flex items-center">
                        Controls
                        {renderSortIcon("controlCount")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.map((fw) => (
                    <tr
                      key={fw._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {fw.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {fw.version}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {fw.provider}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {fw.language}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {fw.controlCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleView(fw._id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
                          aria-label={`View ${fw.name}`}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(fw._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          aria-label={`Delete ${fw.name}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstItem + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredFrameworks.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredFrameworks.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          paginate(currentPage > 1 ? currentPage - 1 : 1)
                        }
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                          currentPage === 1
                            ? "text-gray-300 dark:text-gray-600"
                            : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                            currentPage === index + 1
                              ? "z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300"
                              : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          paginate(
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                          currentPage === totalPages
                            ? "text-gray-300 dark:text-gray-600"
                            : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this framework? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Frameworks;
