import React, { useState } from "react";

// Sample data structure for evidence (this could be fetched from a database)
const initialEvidenceData = [
  {
    id: 1,
    control: "ISO 27001: A.9.2.3",
    type: "Audit Report",
    description:
      "Audit report validating the implementation of user access controls.",
    status: "Verified",
    owner: "John Doe",
    uploadDate: "2025-04-20",
    expirationDate: "2026-04-20",
  },
  {
    id: 2,
    control: "PCI DSS: 3.2",
    type: "Security Logs",
    description: "Security logs showing encryption of sensitive data.",
    status: "Pending",
    owner: "Jane Smith",
    uploadDate: "2025-04-25",
    expirationDate: "2026-04-25",
  },
];

const Evidences = () => {
  const [evidences, setEvidences] = useState(initialEvidenceData);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Evidence Catalog
      </h1>
      <table className="min-w-full bg-gray-100 table-auto rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-3 px-6 text-left">Control</th>
            <th className="py-3 px-6 text-left">Evidence Type</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Owner</th>
            <th className="py-3 px-6 text-left">Upload Date</th>
            <th className="py-3 px-6 text-left">Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {evidences.map((evidence) => (
            <tr key={evidence.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-6">{evidence.control}</td>
              <td className="py-3 px-6">{evidence.type}</td>
              <td className="py-3 px-6">{evidence.description}</td>
              <td className="py-3 px-6">
                <span
                  className={`px-3 py-1 rounded-full text-white ${
                    evidence.status === "Verified"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {evidence.status}
                </span>
              </td>
              <td className="py-3 px-6">{evidence.owner}</td>
              <td className="py-3 px-6">{evidence.uploadDate}</td>
              <td className="py-3 px-6">{evidence.expirationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-6 py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Add Evidence
      </button>
    </div>
  );
};

export default Evidences;
