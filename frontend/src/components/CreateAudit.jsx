import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch to dispatch the action
import { createAudit } from "../redux/apiCalls/auditApiCall"; // Import the API call function

const CreateAudit = ({projectId,toggleModal }) => {
    
const frameworks = useSelector((state) => state.framework.frameworks);
  const [newAudit, setNewAudit] = useState({
    name: "",
    status: "Pending",
    framework: frameworks[0]?.name || "",
    description: "",
    scope: "",
    objectives: "",
  });

console.log(frameworks)
  const dispatch = useDispatch(); // Get the dispatch function

  const handleChange = (e) => {
    setNewAudit({ ...newAudit, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const auditData = {
      name: newAudit.name,
      frameworkId: frameworks.find((fw) => fw.name === newAudit.framework)?._id, // Find the framework by name and get the ID
      description: newAudit.description,
      scope: newAudit.scope,
      objectives: newAudit.objectives,
    };
    console.log(auditData)

    // Dispatch the API call to create the audit
    dispatch(createAudit(projectId,auditData));

    // Reset the form after save
    setNewAudit({
      name: "",
      status: "Pending",
      framework: frameworks[0]?.name || "",
      description: "",
      scope: "",
      objectives: "",
    });

    toggleModal(); // Close the modal
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Audit Name</label>
        <input
          type="text"
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          value={newAudit.name}
          onChange={handleChange}
          name="name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          value={newAudit.status}
          onChange={handleChange}
          name="status"
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
          onChange={handleChange}
          name="framework"
        >
          {frameworks.map((framework) => (
            <option key={framework._id} value={framework.name}>
              {framework.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description, Scope, and Objectives fields */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <input
          type="text"
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          value={newAudit.description}
          onChange={handleChange}
          name="description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Scope</label>
        <input
          type="text"
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          value={newAudit.scope}
          onChange={handleChange}
          name="scope"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Objectives</label>
        <input
          type="text"
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          value={newAudit.objectives}
          onChange={handleChange}
          name="objectives"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={toggleModal}
          className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateAudit;
