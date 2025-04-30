const fs = require("fs/promises");
const Framework = require("../models/Framework.js");

const transformFrameworkData = (rows) => {
  const groupedData = [];
  let currentLevel1 = null;
  let currentLevel2 = null;

  rows.forEach((row) => {
    const [level, level_name, identifier, title, content, is_ratable] = row;

    if (level === 1 || level === "1") {
      if (currentLevel1) {
        groupedData.push(currentLevel1);
      }
      currentLevel1 = {
        level: 1,
        level_name,
        identifier,
        title,
        content: content || "",
        is_ratable: is_ratable === "true" || is_ratable === true,
        level2: [],
      };
      currentLevel2 = null;
    }

    if ((level === 2 || level === "2") && currentLevel1) {
      currentLevel2 = {
        level: 2,
        level_name,
        identifier,
        title,
        content: content || "",
        is_ratable: is_ratable === "true" || is_ratable === true,
        level3: [],
      };
      currentLevel1.level2.push(currentLevel2);
    }

    if ((level === 3 || level === "3") && currentLevel2) {
      currentLevel2.level3.push({
        level: 3,
        level_name,
        identifier,
        title,
        content: content || "",
        is_ratable: is_ratable === "true" || is_ratable === true,
      });
    }
  });

  if (currentLevel1) {
    groupedData.push(currentLevel1);
  }

  return groupedData;
};

const uploadFramework = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Dynamically import xlsx
    const XLSX = (await import("xlsx")).default;

    const workbook = XLSX.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    await fs.unlink(file.path).catch((err) => {
      console.warn("Failed to delete file:", err);
    });

    const transformedData = transformFrameworkData(jsonData);

    // Optional: Save to DB if Framework model is used
    // const mongoose = (await import("mongoose")).default;
    // await Framework.create(transformedData);

    return res.status(200).json({ framework: transformedData });
  } catch (error) {
    console.error("Error in uploadFramework:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { uploadFramework };
