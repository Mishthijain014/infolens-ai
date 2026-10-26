
const express = require("express");
const protect = require("../middleware/authMiddleware");
const { extractFromUrl } = require("../controllers/articleController");

const router = express.Router();

router.post("/extract", protect, extractFromUrl);

module.exports = router;
