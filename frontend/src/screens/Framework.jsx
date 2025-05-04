import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const Framework = () => {
  const [data, setData] = useState([]);
  const [openLevel1, setOpenLevel1] = useState(null);
  const [openLevel2, setOpenLevel2] = useState(null);

  // Embedded JSON data
  const frameworkData = [
    {
      level: 1,
      level_name: "objective",
      identifier: "",
      title: "Secure your environment",
      content: "",
      is_ratable: "FALSE",
      level2: [
        {
          level: 2,
          level_name: "principale",
          identifier: "1",
          title:
            "Restrict Internet Access and Protect Critical Systems from General IT Environment",
          content: "",
          is_ratable: "FALSE",
          level3: [
            {
              level: 3,
              level_name: "controle",
              identifier: "1.1",
              title: "Swift Environment Protection",
              content:
                "Ensure the protection of the user’s Swift infrastructure from potentially compromised elements of the general IT environment and external environment.",
              is_ratable: "VRAI",
            },
            {
              level: 3,
              level_name: "controle",
              identifier: "1.2",
              title: "Operating System Privileged Account Control",
              content:
                "Restrict and control the allocation and usage of administrator-level operating system accounts.",
              is_ratable: "FALSE",
            },
          ],
        },
      ],
    },
    {
      level: 1,
      level_name: "objective",
      identifier: "",
      title: "Reduce Attack Surface and Vulnerabilities",
      content: "",
      is_ratable: "FALSE",
      level2: [
        {
          level: 2,
          level_name: "principale",
          identifier: "2",
          title: "Patch Operating Systems and Applications",
          content: "",
          is_ratable: "FALSE",
          level3: [
            {
              level: 3,
              level_name: "controle",
              identifier: "2.1",
              title: "Patch Management",
              content:
                "Ensure regular patching of software and systems to reduce vulnerabilities.",
              is_ratable: "VRAI",
            },
            {
              level: 3,
              level_name: "controle",
              identifier: "2.1",
              title: "Patch Management",
              content:
                "Ensure regular patching of software and systems to reduce vulnerabilities.",
              is_ratable: "VRAI",
            },
          ],
        },
        {
          level: 2,
          level_name: "principale",
          identifier: "2",
          title: "Patch Operating Systems and Applications",
          content: "",
          is_ratable: "FALSE",
          level3: [
            {
              level: 3,
              level_name: "controle",
              identifier: "2.1",
              title: "Patch Management",
              content:
                "Ensure regular patching of software and systems to reduce vulnerabilities.",
              is_ratable: "VRAI",
            },
            {
              level: 3,
              level_name: "controle",
              identifier: "2.1",
              title: "Patch Management",
              content:
                "Ensure regular patching of software and systems to reduce vulnerabilities.",
              is_ratable: "VRAI",
            },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    setData(frameworkData);
  }, []);

  const toggleLevel1 = (index) => {
    setOpenLevel1(openLevel1 === index ? null : index);
    setOpenLevel2(null);
  };

  const toggleLevel2 = (index) => {
    setOpenLevel2(openLevel2 === index ? null : index);
  };

  return (
    <div className="p-6  min-h-screen space-y-6">
     <div>Audit name 1</div>
     <div>Verion 2</div>
     <div>publisher/provider</div>
      {data.map((level1Data, level1Index) => (
        <div
          key={level1Index}
          className="bg-white  border rounded-xl shadow p-4"
        >
          <div
            className="cursor-pointer flex items-center justify-between text-xl font-semibold text-gray-800"
            onClick={() => toggleLevel1(level1Index)}
          >
            <span>{level1Data.title}</span>
            {openLevel1 === level1Index ? <ChevronDown /> : <ChevronRight />}
          </div>

          {openLevel1 === level1Index && (
            <div className="mt-3 ml-4 space-y-3">
              {level1Data.level2.map((level2Data, level2Index) => (
                <div key={level2Index} className="pl-2">
                  <div
                    className="cursor-pointer flex items-center justify-between text-lg font-medium text-gray-700"
                    onClick={() => toggleLevel2(level2Index)}
                  >
                    <span>{level2Data.title}</span>
                    {openLevel2 === level2Index ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </div>

                  {openLevel2 === level2Index && (
                    <div className="ml-6 mt-2 space-y-3 border-l border-gray-200 pl-4">
                      {level2Data.level3.map((level3Data, level3Index) => (
                        <div key={level3Index} className="text-sm">
                          <h5 className="font-semibold text-gray-800">
                            {level3Data.title}
                          </h5>
                          <p className="text-gray-600">{level3Data.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Framework;
