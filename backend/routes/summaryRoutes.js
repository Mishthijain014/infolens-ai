
const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createSummary } = require("../controllers/summaryController");

const router = express.Router();

router.post("/generate", protect, createSummary);

module.exports = router;
