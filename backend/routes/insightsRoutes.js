
const express = require("express");
const protect = require("../middleware/authMiddleware");

const { createInsights } = require("../controllers/insightsController");
const { askQuestion } = require("../controllers/qaController");

const router = express.Router();

router.post("/generate", protect, createInsights);
router.post("/ask", protect, askQuestion);

module.exports = router;
