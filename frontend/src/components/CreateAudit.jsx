"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAudit } from "../redux/apiCalls/auditApiCall";

const CreateAudit = ({ projectId, toggleModal }) => {
  const frameworks = useSelector((state) => state.framework.frameworks);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newAudit, setNewAudit] = useState({
    name: "",
    status: "Pending",
    framework: frameworks[0]?.name || "",
    description: "",
    scope: "",
    objectives: "",
    startDate: "",
    endDate: "",
    assignedTo: "",
    priority: "Medium",
  });

  const dispatch = useDispatch();

  // Reset framework selection when frameworks change
  useEffect(() => {
    if (frameworks.length > 0 && !newAudit.framework) {
      setNewAudit((prev) => ({
        ...prev,
        framework: frameworks[0]?.name || "",
      }));
    }
  }, [frameworks, newAudit.framework]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAudit({ ...newAudit, [name]: value });

    // Clear validation error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newAudit.name.trim()) {
      newErrors.name = "Audit name is required";
    }

    if (!newAudit.framework) {
      newErrors.framework = "Please select a framework";
    }

    if (
      newAudit.startDate &&
      newAudit.endDate &&
      new Date(newAudit.startDate) > new Date(newAudit.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const auditData = {
        name: newAudit.name,
        frameworkId: frameworks.find((fw) => fw.name === newAudit.framework)
          ?._id,
        description: newAudit.description,
        scope: newAudit.scope,
        objectives: newAudit.objectives,
        status: newAudit.status,
        startDate: newAudit.startDate || undefined,
        endDate: newAudit.endDate || undefined,
        assignedTo: newAudit.assignedTo || undefined,
        priority: newAudit.priority,
      };

      await dispatch(createAudit(projectId, auditData));

      // Reset the form after save
      setNewAudit({
        name: "",
        status: "Pending",
        framework: frameworks[0]?.name || "",
        description: "",
        scope: "",
        objectives: "",
        startDate: "",
        endDate: "",
        assignedTo: "",
        priority: "Medium",
      });

      toggleModal(); // Close the modal
    } catch (error) {
      console.error("Error creating audit:", error);
      setErrors({ submit: "Failed to create audit. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="border-b border-gray-200 pb-4">
      
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to create a new audit for your project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audit Name */}
        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Audit Name <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              id="name"
              name="name"
              value={newAudit.name}
              onChange={handleChange}
              className={`block w-full px-4 py-3 border ${
                errors.name
                  ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2`}
              placeholder="Enter audit name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Framework */}
        <div>
          <label
            htmlFor="framework"
            className="block text-sm font-medium text-gray-700"
          >
            Framework <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <select
              id="framework"
              name="framework"
              value={newAudit.framework}
              onChange={handleChange}
              className={`block w-full px-4 py-3 border ${
                errors.framework
                  ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } rounded-md shadow-sm focus:outline-none focus:ring-2`}
            >
              <option value="" disabled>
                Select a framework
              </option>
              {frameworks.map((framework) => (
                <option key={framework._id} value={framework.name}>
                  {framework.name}
                </option>
              ))}
            </select>
            {errors.framework && (
              <p className="mt-1 text-sm text-red-600">{errors.framework}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <select
              id="status"
              name="status"
              value={newAudit.status}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <select
              id="priority"
              name="priority"
              value={newAudit.priority}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={newAudit.startDate}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={newAudit.endDate}
              onChange={handleChange}
              className={`block w-full px-4 py-3 border ${
                errors.endDate
                  ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } rounded-md shadow-sm focus:outline-none focus:ring-2`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <label
            htmlFor="assignedTo"
            className="block text-sm font-medium text-gray-700"
          >
            Assigned To
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={newAudit.assignedTo}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2"
              placeholder="Enter assignee name"
            />
          </div>
        </div>

        {/* Description */}
        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={newAudit.description}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2"
              placeholder="Provide a brief description of the audit"
            />
          </div>
        </div>

        {/* Scope */}
        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="scope"
            className="block text-sm font-medium text-gray-700"
          >
            Scope
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <textarea
              id="scope"
              name="scope"
              rows={3}
              value={newAudit.scope}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2"
              placeholder="Define the scope of this audit"
            />
          </div>
        </div>

        {/* Objectives */}
        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="objectives"
            className="block text-sm font-medium text-gray-700"
          >
            Objectives
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <textarea
              id="objectives"
              name="objectives"
              rows={3}
              value={newAudit.objectives}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2"
              placeholder="List the key objectives of this audit"
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={toggleModal}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? (
            <>
              <svg
                className="w-4 h-4 mr-2 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </>
          ) : (
            "Create Audit"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateAudit;
