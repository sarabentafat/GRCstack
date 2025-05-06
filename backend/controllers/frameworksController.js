const XLSX = require("xlsx");
const Framework = require("../models/Framework");

const axios = require("axios");
const FormData = require("form-data"); // ✅ use npm form-data package

const parseExcelRowsToTree = (rows) => {
  const tree = [];
  const parents = {};

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    if (!row || row.length === 0 || row.every((cell) => !cell)) {
      console.warn(`Skipping empty row at index ${i}`);
      continue;
    }

    const [level, level_name, identifier, title, content, is_ratable] = row;

    // Provide defaults for missing required fields
    const levelNum =
      level != null && !isNaN(parseInt(level, 10)) ? parseInt(level, 10) : 1; // Default to level 1 if missing or invalid
    const safeIdentifier = identifier
      ? identifier.toString().trim()
      : `unknown_${i}`; // Default identifier if missing
    const safeContent = content
      ? content.toString().trim()
      : "No content provided"; // Default content if missing

    // Log if defaults were used
    if (level == null || isNaN(parseInt(level, 10))) {
      console.warn(`Row ${i}: Missing or invalid level, defaulting to 1`);
    }
    if (!identifier) {
      console.warn(
        `Row ${i}: Missing identifier, defaulting to ${safeIdentifier}`
      );
    }
    if (!content) {
      console.warn(
        `Row ${i}: Missing content, defaulting to "No content provided"`
      );
    }

    const node = {
      level: levelNum,
      level_name: level_name ? level_name.toString().trim() : "",
      identifier: safeIdentifier,
      title: title ? title.toString().trim() : "",
      content: safeContent,
      is_ratable:
        is_ratable === "VRAI" || is_ratable === true || is_ratable === "true",
      status: "Not Started",
      evidence: [],
      children: [],
    };

    // Find the nearest available parent if the direct parent is missing
    let parentLevel = levelNum - 1;
    let parent = parents[parentLevel];

    // If no direct parent, look for the nearest parent level (e.g., level 1 for a level 3)
    while (parentLevel > 0 && !parent) {
      parentLevel--;
      parent = parents[parentLevel];
    }

    if (levelNum === 1 || !parent) {
      // If level 1 or no parent found, add to the root tree
      tree.push(node);
    } else {
      // Add to the nearest parent's children
      parent.children.push(node);
    }

    parents[levelNum] = node;
  }

  return tree;
};

const uploadFramework = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    console.log("File uploaded:", req.file.originalname);

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      blankrows: false,
    });

    if (rows.length <= 1) {
      return res
        .status(400)
        .json({ message: "Excel file is empty or contains only headers." });
    }

    const headerMap = {
      level: ["level", "lvl", "tier", "stage", "rank"],
      level_name: [
        "level_name",
        "levelname",
        "name",
        "level name",
        "category",
        "group",
      ],
      identifier: ["identifier", "id", "code", "ref", "reference"],
      title: ["title", "name", "heading", "label", "caption"],
      content: ["content", "description", "text", "details", "info"],
      is_ratable: [
        "is_ratable",
        "ratable",
        "isratable",
        "rateable",
        "evaluable",
      ],
    };

    const rawHeaders = rows[0];
    const headers = rawHeaders.map((h) => h?.toString().toLowerCase().trim());
    console.log("Raw Headers:", rawHeaders);
    console.log("Normalized Headers:", headers);

    const mappedHeaders = Object.keys(headerMap).map((expected) => {
      const aliases = headerMap[expected];
      const found = headers.find((h) => h === expected || aliases.includes(h));
      return { expected, found, index: found ? headers.indexOf(found) : -1 };
    });

    const missingHeaders = mappedHeaders.filter((h) => h.index === -1);
    if (missingHeaders.length > 0) {
      return res.status(400).json({
        message: `Invalid Excel file structure. Missing headers: ${missingHeaders
          .map((h) => h.expected)
          .join(", ")}. Found headers: ${headers.join(
          ", "
        )} (Raw: ${rawHeaders.join(", ")})`,
      });
    }

    const levelsTree = parseExcelRowsToTree(rows);

    if (levelsTree.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid data parsed from Excel file." });
    }


    const framework = new Framework({
      name: req.body.name?.trim() || "Untitled Framework",
      description: req.body.description?.trim() || "",
      user: req.user._id,
      levels: levelsTree,
      version: req.body.version?.trim() || "1.0",
      provider: req.body.provider?.trim() || "Unknown",
      language: req.body.language?.trim() || "en",

    });

    await framework.save();
    res
      .status(201)
      .json({ message: "Framework uploaded successfully", framework });
  } catch (error) {
    console.error("Upload Error:", error);
    res
      .status(500)
      .json({ message: "Error uploading framework", error: error.message });
  }
};

const getFrameworks = async (req, res) => {
  try {
    // if (!req.userId) {
    //   return res.status(401).json({ message: "User not authenticated." });
    // }

    const frameworks = await Framework.find({ owner: req.userId });
    res.status(200).json(frameworks);
  } catch (error) {
    console.error("Error fetching frameworks:", error);
    res
      .status(500)
      .json({ message: "Error fetching frameworks", error: error.message });
  }
};

const mappedFramework = async (req, res) => {
  try {
    const { name, description, provider, version, language } = req.body;

    const file1 = req.files?.file1?.[0];
    const file2 = req.files?.file2?.[0];

    if (!file1 || !file2) {
      return res.status(400).json({ message: "Two Excel files are required." });
    }

    // ✅ Use the correct field names: file_a and file_b
    const form = new FormData();
    form.append("file_a", file1.buffer, {
      filename: file1.originalname,
      contentType: file1.mimetype,
    });
    form.append("file_b", file2.buffer, {
      filename: file2.originalname,
      contentType: file2.mimetype,
    });

    const response = await axios.post("http://127.0.0.1:8000/map", form, {
      headers: form.getHeaders(),
      responseType: "arraybuffer",
    });

    const workbook = XLSX.read(response.data, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      blankrows: false,
    });

    if (rows.length <= 1) {
      return res
        .status(400)
        .json({ message: "Mapped file is empty or only contains headers." });
    }

    const levelsTree = parseExcelRowsToTree(rows);

    if (!levelsTree || levelsTree.length === 0) {
      return res.status(400).json({ message: "Parsed data is empty." });
    }

    const framework = new Framework({
      name: name?.trim() || "Mapped Framework",
      description: description?.trim() || "",
      user: req.user._id,
      levels: levelsTree,
      version: version?.trim() || "1.0",
      provider: provider?.trim() || "Mapping Engine",
      language: language?.trim() || "en",
    });

    console.log("file1 name:", file1.originalname);
    console.log("file2 name:", file2.originalname);
    console.log("file1 type:", file1.mimetype);
    console.log("form headers:", form.getHeaders());

    await framework.save();

    res.status(201).json({
      message: "Mapped framework created successfully",
      framework,
    });
  } catch (error) {
    console.error("Mapped Framework Error:", error);
    res.status(500).json({
      message: "Failed to map and save framework",
      error: error.message,
    });
  }
};

module.exports = {
  uploadFramework,
  getFrameworks,
  mappedFramework,
};
