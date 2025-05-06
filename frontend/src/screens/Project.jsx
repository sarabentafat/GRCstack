import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { getProjectById } from "../redux/apiCalls/projectApiCall";
import { useDispatch, useSelector } from "react-redux";
import CreateAudit from "../components/CreateAudit";

const Progress = ({ value }) => (
  <div className="w-full h-3 bg-gray-200 rounded-full">
    <div
      className="h-3 bg-blue-600 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

const Project = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getProjectById(id));
  }, [dispatch, id]);

  const project = useSelector((state) => state.project.project) || {
    audits: [],
  };
  console.log('hhh',project)
  const [showModal, setShowModal] = useState(false);

  const totalAudits = project?.audits?.length || 0;
  const completedAudits =
    project?.audits?.filter((a) => a.status === "Completed").length || 0;
  const progressPercentage =
    totalAudits === 0 ? 0 : Math.round((completedAudits / totalAudits) * 100);

  const handleSaveAudit = (newAudit) => {
    const newId = project.audits.length + 1;
    const updatedProject = {
      ...project,
      audits: [...project.audits, { id: newId, ...newAudit }],
    };
    dispatch({ type: "UPDATE_PROJECT", payload: updatedProject });
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project?.name}</h1>
        <button
          onClick={toggleModal}
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <CreateAudit
            projectId={id}
              frameworks={project?.frameworks || []}
              handleSaveAudit={handleSaveAudit}
              toggleModal={toggleModal}
            />
            {/* <button
              onClick={toggleModal}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button> */}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {project?.audits?.map((audit) => (
          <Link
            to={`/user/project/${id}/audit/${audit._id}`}
            key={audit.id}
            className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{audit.name}</h2>
              <p className="text-sm text-gray-500">
                Framework: {audit.frameworkId.name}
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
    </div>
  );
};

export default Project;
