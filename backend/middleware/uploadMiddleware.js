
const multer = require("multer");

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const allowedTypes = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".txt": "text/plain",
};

const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedTypes[extension]) {
    return cb(
      new Error("Only PDF, DOCX and TXT files are allowed.")
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});

module.exports = upload;
