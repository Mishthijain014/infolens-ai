
const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  extractUploadedFile,
} = require("../controllers/fileController");

const router = express.Router();

router.post(
  "/extract",
  protect,
  upload.single("file"),
  extractUploadedFile
);

module.exports = router;
