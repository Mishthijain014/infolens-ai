
const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  saveAnalysis,
  getMyAnalyses,
  getAnalysisById,
  updateAnalysis,
  deleteAnalysis,
} = require("../controllers/analysisController");

const router = express.Router();

// Save a new analysis
router.post("/", protect, saveAnalysis);

// Get logged-in user's saved analyses
router.get("/", protect, getMyAnalyses);

// Get a specific saved analysis
router.get("/:id", protect, getAnalysisById);

// Update a saved analysis
router.patch("/:id", protect, updateAnalysis);

// Delete a saved analysis
router.delete("/:id", protect, deleteAnalysis);

module.exports = router;
