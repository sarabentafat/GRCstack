import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

// Sample frameworks (these can be fetched from the backend or stored in your app state)
const frameworks = [
  { id: 1, name: "ISO 27001" },
  { id: 2, name: "PCI DSS" },
  { id: 3, name: "GDPR" },
  { id: 4, name: "SWIFT CSCF" },
];

const Progress = ({ value }) => (
  <div className="w-full h-3 bg-gray-200 rounded-full">
    <div
      className="h-3 bg-blue-600 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

const Project = () => {
  const { id: projectId } = useParams(); // Use `useParams()` to get the project ID
  const [project, setProject] = useState({
    name: "Banking Compliance Project",
    audits: [
      {
        id: 1,
        name: "SWIFT CSCF Audit",
        status: "Completed",
        framework: "SWIFT CSCF",
      },
      {
        id: 2,
        name: "PCI DSS Audit",
        status: "In Progress",
        framework: "PCI DSS",
      },
      {
        id: 3,
        name: "ISO 27001 Audit",
        status: "Pending",
        framework: "ISO 27001",
      },
      { id: 4, name: "GDPR Audit", status: "Completed", framework: "GDPR" },
    ],
  });

  const [showModal, setShowModal] = useState(false);
  const [newAudit, setNewAudit] = useState({
    name: "",
    status: "Pending",
    framework: "ISO 27001", // Default to the first framework
  });

  const totalAudits = project.audits.length;
  const completedAudits = project.audits.filter(
    (a) => a.status === "Completed"
  ).length;
  const progressPercentage =
    totalAudits === 0 ? 0 : Math.round((completedAudits / totalAudits) * 100);

  const handleAddAudit = () => {
    setShowModal(true);
  };

  const handleSaveAudit = () => {
    const newId = project.audits.length + 1;
    const updatedProject = {
      ...project,
      audits: [...project.audits, { id: newId, ...newAudit }],
    };
    setProject(updatedProject);
    setNewAudit({ name: "", status: "Pending", framework: "ISO 27001" });
    setShowModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <button
          onClick={handleAddAudit}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
        >
          <FaPlus /> Add New Audit
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-1">
          <p className="text-gray-700 text-sm font-medium">
            {completedAudits} of {totalAudits} audits completed
          </p>
          <p className="text-sm text-gray-500">{progressPercentage} %</p>
        </div>
        <Progress value={progressPercentage} />
      </div>

      <div className="space-y-4">
        {project.audits.map((audit) => (
          <Link
            to={`/user/project/${projectId}/audit/${audit.id}`}
            key={audit.id}
            className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{audit.name}</h2>
              <p className="text-sm text-gray-500">Status: {audit.status}</p>
              <p className="text-sm text-gray-500">
                Framework: {audit.framework}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                audit.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : audit.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {audit.status}
            </div>
          </Link>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Audit</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Audit Name</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={newAudit.name}
                  onChange={(e) =>
                    setNewAudit({ ...newAudit, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={newAudit.status}
                  onChange={(e) =>
                    setNewAudit({ ...newAudit, status: e.target.value })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Framework</label>
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={newAudit.framework}
                  onChange={(e) =>
                    setNewAudit({ ...newAudit, framework: e.target.value })
                  }
                >
                  {frameworks.map((framework) => (
                    <option key={framework.id} value={framework.name}>
                      {framework.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAudit}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
