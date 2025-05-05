import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getauditFromProjectById } from "../redux/apiCalls/auditApiCall";
import { useDispatch, useSelector } from "react-redux";

const Audit = () => {
  const dispatch = useDispatch();
  const { id, auditId } = useParams();

const RenderLevels = ({ levels, depth = 0 }) => {
  if (!levels || levels.length === 0) {
    return <li className="text-sm text-gray-700">No levels available</li>;
  }

  return (
    <ul className={`ml-${depth * 4} list-none text-sm text-gray-800`}>
      {levels.map((level) => (
        <LevelItem key={level.identifier} level={level} depth={depth} />
      ))}
    </ul>
  );
};

const LevelItem = ({ level, depth }) => {
  const [open, setOpen] = useState(false);
 const isUnknown = level.identifier.toLowerCase().startsWith("unknown");
 const isUnknownC = level.content.toLowerCase().startsWith("no content");
  const hasChildren = level.children && level.children.length > 0;

  return (
    <li className="mb-1">
      <div
        className="cursor-pointer flex items-center space-x-1"
        onClick={() => hasChildren && setOpen(!open)}
      >
        {hasChildren && <span className="text-xs">{open ? "▼" : "▶"}</span>}
        <span>{" "}
          {!isUnknown && <span className="font-bold"> {level.identifier} {" "}</span>}{
            !isUnknownC && <span>{level.content}</span>}
          
          {level.title}
        </span>
      </div>

      {hasChildren && open && (
        <RenderLevels levels={level.children} depth={depth + 1} />
      )}
    </li>
  );
};
  useEffect(() => {
    dispatch(getauditFromProjectById(id, auditId));
  }, [dispatch]);
  const auditData = useSelector((state) => state.audit.audit);
  console.log(auditData);


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{auditData?.name}</h1>

      <div className="bg-white shadow rounded-xl p-4 border space-y-2">

        <div>
          <h2 className="text-lg font-semibold">Scope</h2>
          {/* <p className="text-sm text-gray-700">{audit.scope}</p> */}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Objectives</h2>
          {/* <p className="text-sm text-gray-700">{audit.objectives}</p> */}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Schedule</h2>
          <p className="text-sm text-gray-700">
            {/* Start: {auditData.schedule.start} <br />
            End: {auditData.schedule.end} */}
          </p>
        </div>

        <div >
          <div >
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Framework</h2>
              <p className="text-sm text-gray-600">{auditData?.frameworkId?.name}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Description
              </h2>
              <p className="text-sm text-gray-600">
                {auditData?.frameworkId.description || "No description provided"}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Audit Date
              </h2>
              <p className="text-sm text-gray-600">
                {/* {new Date(auditData.auditDate).toLocaleDateString() ||
                  "Not specified"} */}
              </p>
            </div>
            <div>
              {/* <h2 className="text-lg font-semibold text-gray-700">Findings</h2>
              {auditData.findings && auditData.findings.length > 0 ? (
                <ul className="list-disc ml-6 text-sm text-gray-600">
                  {audit.findings.map((finding) => (
                    <li key={finding._id}>
                      Level ID: {finding.levelId}, Status: {finding.status}
                      {finding.evidence && finding.evidence.length > 0 && (
                        <ul className="list-circle ml-6">
                          {finding.evidence.map((ev) => (
                            <li key={ev._id}>
                              <a
                                href={ev.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {ev.name}
                              </a>{" "}
                              (Uploaded:{" "}
                              {new Date(ev.uploadedAt).toLocaleDateString()})
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No findings recorded</p>
              )} */}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Controls</h2>
              <RenderLevels levels={auditData?.frameworkId?.levels} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;
