import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash, FaFilter } from "react-icons/fa";
import { getFrameworks } from "../redux/apiCalls/frameworkSlice";
import { useDispatch, useSelector } from "react-redux";

const Frameworks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");


  useEffect(() => {
    dispatch(getFrameworks());
  }, [dispatch]);
  console.log('bonjou')
  const frameworkss = useSelector((state) => state.framework.frameworks);
  console.log("********frameworkssaaaaaaa", frameworkss);
  const handleDelete = (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this framework?"
    );
    if (confirmed) {
      // You should implement delete logic via redux or API
      console.log("Delete framework with ID:", _id);
    }
  };

  const handleView = (_id) => {
    navigate(`/user/frameworks/${_id}`);
  };

  const providers = [
    ...new Set(frameworkss?.map((fw) => fw.provider || "Unknown")),
  ];
  const languages = [
    ...new Set(frameworkss?.map((fw) => fw.language || "Unknown")),
  ];

  const filteredFrameworks = frameworkss?.filter((fw) => {
    const matchesText =
      fw.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      fw.provider?.toLowerCase().includes(filterText.toLowerCase());
    const matchesProvider = providerFilter
      ? fw.provider === providerFilter
      : true;
    const matchesLanguage = languageFilter
      ? fw.language === languageFilter
      : true;
    return matchesText && matchesProvider && matchesLanguage;
  });

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or provider"
          className="p-2 border rounded"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Providers</option>
          {providers?.map((prov, idx) => (
            <option key={idx} value={prov}>
              {prov}
            </option>
          ))}
        </select>
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Languages</option>
          {languages?.map((lang, idx) => (
            <option key={idx} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full border table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Version</th>
            <th className="p-2 border">Provider</th>
            <th className="p-2 border">Language</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFrameworks?.map((fw) => (
            <tr key={fw._id}>
              <td className="p-2 border">{fw.name}</td>
              <td className="p-2 border">{fw.version}</td>
              <td className="p-2 border">{fw.provider}</td>
              <td className="p-2 border">{fw.language}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleView(fw._id)}
                  className="text-blue-600"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDelete(fw._id)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Frameworks;
