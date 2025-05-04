import React, { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";

const initialThreats = [
  {
    id: 1,
    name: "Phishing Attack",
    category: "Cybersecurity",
    likelihood: "High",
    impact: "Major",
    riskLevel: "High",
    controlMeasures: "Email filtering, user training",
    complianceRelevance: "GDPR, HIPAA",
    status: "Active",
    owner: "Security Team",
  },
  {
    id: 2,
    name: "Data Breach",
    category: "Cybersecurity",
    likelihood: "Medium",
    impact: "Catastrophic",
    riskLevel: "High",
    controlMeasures: "Encryption, multi-factor authentication",
    complianceRelevance: "GDPR, PCI DSS",
    status: "Monitoring",
    owner: "IT Team",
  },
  {
    id: 3,
    name: "Insider Threat",
    category: "Operational",
    likelihood: "Medium",
    impact: "Major",
    riskLevel: "High",
    controlMeasures: "Access controls, user activity monitoring",
    complianceRelevance: "NIST, ISO 27001",
    status: "Active",
    owner: "HR Team",
  },
];

const Threats = () => {
  const [threats, setThreats] = useState(initialThreats);

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this threat?"
    );
    if (confirmed) {
      setThreats(threats.filter((threat) => threat.id !== id));
    }
  };

  const handleView = (id) => {
    // navigate to the threat details page
    console.log(`Viewing threat with ID: ${id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Threat Catalog</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Threat Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Likelihood</th>
              <th className="border px-4 py-2">Impact</th>
              <th className="border px-4 py-2">Risk Level</th>
              <th className="border px-4 py-2">Control Measures</th>
              <th className="border px-4 py-2">Compliance</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Owner</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {threats.length > 0 ? (
              threats.map((threat) => (
                <tr key={threat.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{threat.name}</td>
                  <td className="border px-4 py-2">{threat.category}</td>
                  <td className="border px-4 py-2">{threat.likelihood}</td>
                  <td className="border px-4 py-2">{threat.impact}</td>
                  <td className="border px-4 py-2">{threat.riskLevel}</td>
                  <td className="border px-4 py-2">{threat.controlMeasures}</td>
                  <td className="border px-4 py-2">
                    {threat.complianceRelevance}
                  </td>
                  <td className="border px-4 py-2">{threat.status}</td>
                  <td className="border px-4 py-2">{threat.owner}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleView(threat.id)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(threat.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No threats found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Threats;
