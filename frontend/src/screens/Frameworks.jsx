import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash, FaFilter } from "react-icons/fa";

const initialFrameworks = [
  {
    id: 1,
    name: "PCI DSS",
    version: "v4.0",
    category: "Compliance",
    publisher: "PCI Council",
    totalControls: 200,
    language: "English",
  },
  {
    id: 1,
    name: "PCI DSS",
    version: "v4.0",
    category: "Compliance",
    publisher: "PCI Council",
    totalControls: 200,
    language: "French",
  },
  {
    id: 2,
    name: "SWIFT CSCF",
    version: "2023",
    category: "Security",
    publisher: "SWIFT",
    totalControls: 31,
    language: "English",
  },
  {
    id: 3,
    name: "ISO 27001",
    version: "2013",
    category: "Compliance",
    publisher: "ISO",
    totalControls: 114,
    language: "English",
  },
  {
    id: 4,
    name: "NIST CSF",
    version: "1.1",
    category: "Security",
    publisher: "NIST",
    totalControls: 108,
    language: "English",
  },
  {
    id: 5,
    name: "COBIT 5",
    version: "5.0",
    category: "Governance",
    publisher: "ISACA",
    totalControls: 37,
    language: "English",
  },
  {
    id: 6,
    name: "HIPAA",
    version: "2013",
    category: "Healthcare",
    publisher: "HHS",
    totalControls: 84,
    language: "English",
  },
  {
    id: 7,
    name: "GDPR",
    version: "2018",
    category: "Privacy",
    publisher: "EU",
    totalControls: 99,
    language: "English",
  },
  {
    id: 8,
    name: "SOC 2",
    version: "2022",
    category: "Assurance",
    publisher: "AICPA",
    totalControls: 64,
    language: "English",
  },
  {
    id: 9,
    name: "FedRAMP",
    version: "Rev.5",
    category: "Government",
    publisher: "GSA",
    totalControls: 325,
    language: "English",
  },
  {
    id: 10,
    name: "CIS Controls",
    version: "v8",
    category: "Security",
    publisher: "CIS",
    totalControls: 153,
    language: "English",
  },
  // Algerian frameworks
  {
    id: 11,
    name: "Algerian Cybersecurity Framework",
    version: "2023",
    category: "Security",
    publisher: "Algerian Government",
    totalControls: 120,
    language: "Arabic",
  },
  {
    id: 12,
    name: "Algerian Data Protection Act",
    version: "2021",
    category: "Privacy",
    publisher: "Algerian Government",
    totalControls: 45,
    language: "Arabic",
  },
  {
    id: 13,
    name: "Algerian Financial Security Framework",
    version: "2022",
    category: "Compliance",
    publisher: "Bank of Algeria",
    totalControls: 60,
    language: "Arabic",
  },
  // More international frameworks
  {
    id: 14,
    name: "ITIL",
    version: "v4",
    category: "Service Management",
    publisher: "AXELOS",
    totalControls: 34,
    language: "English",
  },
  {
    id: 15,
    name: "ISO 22301",
    version: "2019",
    category: "Business Continuity",
    publisher: "ISO",
    totalControls: 97,
    language: "English",
  },
  {
    id: 16,
    name: "CMMI",
    version: "v2.0",
    category: "Process Improvement",
    publisher: "CMMI Institute",
    totalControls: 30,
    language: "English",
  },
  {
    id: 17,
    name: "FISMA",
    version: "Rev.5",
    category: "Government",
    publisher: "NIST",
    totalControls: 325,
    language: "English",
  },
  {
    id: 18,
    name: "ISO 9001",
    version: "2015",
    category: "Quality Management",
    publisher: "ISO",
    totalControls: 92,
    language: "English",
  },
  {
    id: 19,
    name: "NERC CIP",
    version: "2021",
    category: "Energy",
    publisher: "NERC",
    totalControls: 80,
    language: "English",
  },
  {
    id: 20,
    name: "OECD Privacy Guidelines",
    version: "2020",
    category: "Privacy",
    publisher: "OECD",
    totalControls: 85,
    language: "English",
  },
  {
    id: 21,
    name: "BIS Cybersecurity Framework",
    version: "2021",
    category: "Cybersecurity",
    publisher: "Bureau of Indian Standards",
    totalControls: 112,
    language: "English",
  },
  {
    id: 22,
    name: "Australian Privacy Principles (APPs)",
    version: "2020",
    category: "Privacy",
    publisher: "OAIC",
    totalControls: 13,
    language: "English",
  },
];

const Frameworks = () => {
  const [frameworks, setFrameworks] = useState(initialFrameworks);
  const [filterText, setFilterText] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this framework?"
    );
    if (confirmed) {
      setFrameworks(frameworks.filter((fw) => fw.id !== id));
    }
  };

  const handleView = (id) => {
    navigate(`/user/frameworks/${id}`);
  };

  const publishers = [...new Set(frameworks.map((fw) => fw.publisher))];
  const languages = [...new Set(frameworks.map((fw) => fw.language))];

  const filteredFrameworks = frameworks.filter((fw) => {
    const matchesText =
      fw.name.toLowerCase().includes(filterText.toLowerCase()) ||
      fw.category.toLowerCase().includes(filterText.toLowerCase()) ||
      fw.publisher.toLowerCase().includes(filterText.toLowerCase());
    const matchesPublisher = publisherFilter
      ? fw.publisher === publisherFilter
      : true;
    const matchesLanguage = languageFilter
      ? fw.language === languageFilter
      : true;
    return matchesText && matchesPublisher && matchesLanguage;
  });

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            className="border px-3 py-2 rounded"
            value={publisherFilter}
            onChange={(e) => setPublisherFilter(e.target.value)}
          >
            <option value="">All Publishers</option>
            {publishers.map((pub, idx) => (
              <option key={idx} value={pub}>
                {pub}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            className="border px-3 py-2 rounded"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="">All Languages</option>
            {languages.map((lang, idx) => (
              <option key={idx} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Filter by name, category or publisher..."
          className="border px-4 py-2 rounded w-full sm:max-w-sm"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => alert("Add Framework feature to be implemented")}
        >
          + Add Framework
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Version</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Publisher</th>
              <th className="border px-4 py-2">Language</th>
              <th className="border px-4 py-2">Total Controls</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFrameworks.length > 0 ? (
              filteredFrameworks.map((fw) => (
                <tr key={fw.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{fw.name}</td>
                  <td className="border px-4 py-2">{fw.version}</td>
                  <td className="border px-4 py-2">{fw.category}</td>
                  <td className="border px-4 py-2">{fw.publisher}</td>
                  <td className="border px-4 py-2">{fw.language}</td>
                  <td className="border px-4 py-2">{fw.totalControls}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleView(fw.id)}
                      className="text-blue-500"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(fw.id)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No frameworks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Frameworks;
