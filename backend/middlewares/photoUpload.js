const path = require("path");
const multer = require("multer");

// Configure photo storage
const photoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../images")); // Set your desired upload directory
    },
    filename: function (req, file, cb) {
        if (file) {
            // Generate a unique filename based on timestamp and original filename
            cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
        } else {
            cb(null, false);
        }
    },
});

// Photo upload middleware
const photoUpload = multer({
    storage: photoStorage,
    fileFilter: function (req, file, cb) {
        // Check if the file is an image (you can customize this check)
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb({ message: "Unsupported file format" }, false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 4 }, // Limit file size to 1 MB
});

module.exports = photoUpload;
