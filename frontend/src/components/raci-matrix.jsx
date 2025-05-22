"use client";

import { useState } from "react";
import { X, Download, Filter, Search } from "lucide-react";

const RaciMatrix = ({ auditData, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");

  // Mock RACI data - in a real app, this would come from the backend
  const roles = [
    "IT Security Manager",
    "System Administrator",
    "Compliance Officer",
    "Risk Manager",
    "IT Director",
  ];

  // Generate mock RACI data based on the framework levels
  const generateRaciData = () => {
    const extractControls = (levels) => {
      let controls = [];

      if (!levels) return controls;

      levels.forEach((level) => {
        if (level.is_ratable) {
          controls.push({
            id: level.identifier,
            title: level.title,
            raci: {
              "IT Security Manager": getRandomRaciRole(),
              "System Administrator": getRandomRaciRole(),
              "Compliance Officer": getRandomRaciRole(),
              "Risk Manager": getRandomRaciRole(),
              "IT Director": getRandomRaciRole(),
            },
          });
        }

        if (level.children && level.children.length > 0) {
          controls = [...controls, ...extractControls(level.children)];
        }
      });

      return controls;
    };

    return extractControls(auditData?.frameworkId?.levels);
  };

  const getRandomRaciRole = () => {
    const roles = ["R", "A", "C", "I", ""];
    return roles[Math.floor(Math.random() * roles.length)];
  };

  const raciData = generateRaciData();

  const filteredControls = raciData.filter((control) => {
    const matchesSearch =
      control.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.title.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterLevel === "all") return matchesSearch;

    // Filter by specific RACI role
    return matchesSearch && Object.values(control.raci).includes(filterLevel);
  });

  const getRaciColor = (role) => {
    switch (role) {
      case "R":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "A":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "C":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "I":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const handleExport = () => {
    console.log("Exporting RACI matrix...");
    // In a real app, this would generate a CSV or Excel file
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">RACI Matrix</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              RACI Legend
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-800 text-sm font-medium dark:bg-green-900/30 dark:text-green-400">
                  R
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Responsible
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 text-sm font-medium dark:bg-blue-900/30 dark:text-blue-400">
                  A
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Accountable
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium dark:bg-yellow-900/30 dark:text-yellow-400">
                  C
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Consulted
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-800 text-sm font-medium dark:bg-purple-900/30 dark:text-purple-400">
                  I
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Informed
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Search controls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="R">Responsible (R)</option>
                <option value="A">Accountable (A)</option>
                <option value="C">Consulted (C)</option>
                <option value="I">Informed (I)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 w-1/4">
                    Control ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 w-1/4">
                    Control Title
                  </th>
                  {roles.map((role) => (
                    <th
                      key={role}
                      className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                    >
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredControls.map((control) => (
                  <tr
                    key={control.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                      {control.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                      {control.title}
                    </td>
                    {roles.map((role) => (
                      <td key={role} className="py-3 px-4 text-center">
                        {control.raci[role] && (
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${getRaciColor(
                              control.raci[role]
                            )}`}
                          >
                            {control.raci[role]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaciMatrix;
