import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getframeworkById } from "../redux/apiCalls/frameworkApiCall";

const Framework = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const frameworkData = useSelector((state) => state.framework.framework);

  useEffect(() => {
    dispatch(getframeworkById(id));
  }, [dispatch, id]);

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
    const isUnknown = level.identifier?.toLowerCase().startsWith("unknown");
    const isUnknownC = level.content?.toLowerCase().startsWith("no content");
    const hasChildren = level.children && level.children.length > 0;

    return (
      <li className="mb-1">
        <div
          className="cursor-pointer flex items-center space-x-1"
          onClick={() => hasChildren && setOpen(!open)}
        >
          {hasChildren && <span className="text-xs">{open ? "▼" : "▶"}</span>}
          <span>
            {!isUnknown && (
              <span className="font-bold">{level.identifier} </span>
            )}
            {!isUnknownC && <span>{level.content} </span>}
            {level.title}
          </span>
        </div>

        {hasChildren && open && (
          <RenderLevels levels={level.children} depth={depth + 1} />
        )}
      </li>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{frameworkData?.name}</h1>

      <div className="bg-white shadow rounded-xl p-4 border space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Version</h2>
          <p className="text-sm text-gray-700">{frameworkData?.version}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Publisher / Provider</h2>
          <p className="text-sm text-gray-700">{frameworkData?.publisher}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="text-sm text-gray-700">{frameworkData?.description}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Levels</h2>
          <RenderLevels levels={frameworkData?.levels} />
        </div>
      </div>
    </div>
  );
};

export default Framework;
