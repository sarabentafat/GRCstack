import React from "react";
import { useParams } from "react-router-dom";

const Audit = () => {
  const { projectId, auditId } = useParams();

  // Mocked audit data (replace with real backend call later)
  const audit = {
    id: auditId,
    name: "SWIFT CSCF Audit",
    standards: ["SWIFT CSCF v2023", "ISO 27001"],
    scope: "All critical banking systems involved in international transfers.",
    objectives:
      "Evaluate compliance with SWIFT security controls and identify vulnerabilities.",
    schedule: {
      start: "2025-05-10",
      end: "2025-05-20",
    },
    controls: [
      "CSP Control 1.1: Restrict Internet Access",
      "CSP Control 2.3: Multi-factor Authentication",
      "CSP Control 6.1: Logging and Monitoring",
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{audit.name}</h1>

      <div className="bg-white shadow rounded-xl p-4 border space-y-2">
        <div>
          <h2 className="text-lg font-semibold">Standards</h2>
          <ul className="list-disc ml-6 text-sm text-gray-700">
            {audit.standards.map((std, i) => (
              <li key={i}>{std}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Scope</h2>
          <p className="text-sm text-gray-700">{audit.scope}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Objectives</h2>
          <p className="text-sm text-gray-700">{audit.objectives}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Schedule</h2>
          <p className="text-sm text-gray-700">
            Start: {audit.schedule.start} <br />
            End: {audit.schedule.end}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Controls</h2>
          <ul className="list-disc ml-6 text-sm text-gray-700">
            {audit.controls.map((ctrl, i) => (
              <li key={i}>{ctrl}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Audit;
