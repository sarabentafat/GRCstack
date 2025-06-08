const XLSX = require("xlsx");
const Framework = require("../models/Framework");
const fs = require("fs").promises;
const fss = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data"); // ✅ use npm form-data package
const FrameworkMapping = require("../models/FrameworkMapping"); // make sure path is correct
const { default: mongoose } = require("mongoose");
const Audit = require("../models/Audit");

const parseExcelRowsToTree = (rows) => {
  const tree = [];
  const parents = {};

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    if (!row || row.length === 0 || row.every((cell) => !cell)) {
      console.warn(`Skipping empty row at index ${i}`);
      continue;
    }

    const [
      level,
      level_name,
      identifier,
      title,
      content,
      is_ratable,
      question,
      evidence_recommendation,
    ] = row;
    

    const levelNum =
      level != null && !isNaN(parseInt(level, 10)) ? parseInt(level, 10) : 1;
    const safeIdentifier = identifier
      ? identifier.toString().trim()
      : `unknown_${i}`;
    const safeContent = content
      ? content.toString().trim()
      : "No content provided";

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
      _id: new mongoose.Types.ObjectId(), // ✅ Add _id directly
      level: levelNum,
      level_name: level_name ? level_name.toString().trim() : "",
      identifier: safeIdentifier,
      title: title ? title.toString().trim() : "",
      content: safeContent,
      is_ratable:
        is_ratable === "VRAI" || is_ratable === true || is_ratable === "true",
      status: "Not Started",
      evidence: [],
      question,
      evidence_recommendation,
      children: [],
    };

    let parentLevel = levelNum - 1;
    let parent = parents[parentLevel];

    while (parentLevel > 0 && !parent) {
      parentLevel--;
      parent = parents[parentLevel];
    }

    if (levelNum === 1 || !parent) {
      tree.push(node);
    } else {
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
      question: ["question","questions", "query", "inquiry", "prompt"],
      evidence_recommendation: [
        "evidence_recommendation",
        "evidence",
        "recommendation",
        "suggestion",
        "advice",
      ],
    };
    console.log("Header Map:", headerMap);

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

    // Add _id to each level
    const levelsWithIds = levelsTree.map((level) => ({
      ...level,
      _id: new mongoose.Types.ObjectId(),
    }));

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
    const frameworks = await Framework.find({ owner: req.userId }).select('-levels');
    res.status(200).json(frameworks);
  } catch (error) {
    console.error("Error fetching frameworks:", error);
    res
      .status(500)
      .json({ message: "Error fetching frameworks", error: error.message });
  }
};


const getFrameworkById = async (req, res) => {
  try {
    const { id } = req.params;
    const framework = await Framework.findById(id);

    if (!framework) {
      return res.status(404).json({ message: "Framework not found" });
    }

    res.status(200).json(framework);
  } catch (error) {
    console.error("Error fetching framework:", error);
    res
      .status(500)
      .json({ message: "Error fetching framework", error: error.message });
  }
};
const mappedFramework = async (req, res) => {
  try {
    const { name, description } = req.body;

    const file1 = req.files?.file1?.[0];
    const file2 = req.files?.file2?.[0];

    if (!file1 || !file2) {
      return res.status(400).json({ message: "Two Excel files are required." });
    }

    // Prepare files to send to Python
    const form = new FormData();
    form.append("file_a", file1.buffer, {
      filename: file1.originalname,
      contentType: file1.mimetype,
    });
    form.append("file_b", file2.buffer, {
      filename: file2.originalname,
      contentType: file2.mimetype,
    });

    // Call Python backend to map
    const response = await axios.post("http://127.0.0.1:8000/map", form, {
      headers: form.getHeaders(),
      responseType: "arraybuffer", // because it returns Excel
    });

    // Parse mapped Excel file
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

    const dataRows = rows.slice(1);

    const mappings = dataRows.map((row) => ({
      frameworkA_id: row[1] || "",
      frameworkA_title: row[2] || "",
      frameworkA_content: row[3] || "",
      frameworkB_id: row[4] || "",
      frameworkB_title: row[5] || "",
      frameworkB_content: row[6] || "",
      similarity: parseFloat(String(row[7]).replace(",", ".")) || 0,
    }));

    if (!mappings.length) {
      return res
        .status(400)
        .json({ message: "No valid mappings found in file." });
    }

    // Save to DB
    const frameworkMapping = new FrameworkMapping({
      name: name?.trim() || "Mapped Framework",
      description: description?.trim() || "",
      user: req.user._id,
      frameworkA: { name: file1.originalname },
      frameworkB: { name: file2.originalname },
      mappings,
    });

    await frameworkMapping.save();

    // Send Excel as downloadable file and JSON
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=mapped_framework.xlsx"
    );

    res.status(201).json({
      message: "Mapped framework created successfully",
      mapping: frameworkMapping,
      excelFile: Buffer.from(response.data).toString("base64"), // to allow frontend download
    });
  } catch (error) {
    console.error("Mapped Framework Error:", error);
    res.status(500).json({
      message: "Failed to map and save framework",
      error: error.message,
    });
  }
};

const createAuditFromMapping = async (req, res) => {
  console.log("Starting audit creation...");

  const { projectId } = req.params;
  const { sourceAuditId, targetFrameworkId } = req.body;

  console.log("Inputs:", { projectId, sourceAuditId, targetFrameworkId });

  try {
    const sourceAudit = await Audit.findById(sourceAuditId);
    if (!sourceAudit) {
      return res.status(404).json({ message: "Source audit not found." });
    }

    const sourceFramework = await Framework.findById(sourceAudit.frameworkId);
    if (!sourceFramework) {
      return res.status(404).json({ message: "Source framework not found." });
    }

    const targetFramework = await Framework.findById(targetFrameworkId);
    if (!targetFramework) {
      return res.status(404).json({ message: "Target framework not found." });
    }

    // Directly using the original levels structure without flattening it
    const formattedSource = { levels: sourceFramework.levels };
    const formattedTarget = { levels: targetFramework.levels };

    // Set up temporary directory to store the JSON files
    const tempDir = path.join(__dirname, "temp");
    await fs.mkdir(tempDir, { recursive: true });

    const timestamp = Date.now();
    const sourceFilePath = path.join(tempDir, `source_${timestamp}.json`);
    const targetFilePath = path.join(tempDir, `target_${timestamp}.json`);

    // Write the JSON files with the appropriate structure
    await fs.writeFile(
      sourceFilePath,
      JSON.stringify(formattedSource, null, 2)
    );
    await fs.writeFile(
      targetFilePath,
      JSON.stringify(formattedTarget, null, 2)
    );
    console.log("Files written:", sourceFilePath, targetFilePath);

    // Prepare form data for API request
    const form = new FormData();
    form.append("file_a", fss.createReadStream(sourceFilePath));
    form.append("file_b", fss.createReadStream(targetFilePath));

    // Send request to the mapping service
    const response = await axios.post("http://127.0.0.1:8000/map_json", form, {
      headers: form.getHeaders(),
      timeout: 60000, // 60 seconds timeout
    });

    console.log(
      "Mapping received. Number of mappings:",
      response.data.mappings.length
    );

    // Respond with the mappings
    res.status(200).json({
      message: "Mapping received",
      mappings: response.data.mappings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while fetching the mapping or creating the audit.",
      error: error.message,
    });
  }
};


module.exports = {
  uploadFramework,
  getFrameworks,
  mappedFramework,
  getFrameworkById,
  createAuditFromMapping,
};
