
const mongoose = require("mongoose");
const Analysis = require("../models/Analysis");

// 1. Save a new analysis
const saveAnalysis = async (req, res) => {
  try {
    const {
      title,
      sourceUrl,
      extractedText,
      summary,
      summaryType,
      insights,
      qaHistory,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof sourceUrl !== "string" ||
      !/^https?:\/\/\S+$/i.test(sourceUrl) ||
      typeof extractedText !== "string" ||
      !extractedText.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid title, source URL and extracted text are required.",
      });
    }

    const analysis = await Analysis.create({
      user: req.user._id,
      title,
      sourceUrl,
      sourceType: "article",
      extractedText,
      summary,
      summaryType,
      insights,
      qaHistory,
    });

    return res.status(201).json({
      success: true,
      message: "Analysis saved successfully",
      data: analysis,
    });
  } catch (error) {
    console.error("Save analysis error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save analysis",
    });
  }
};

// 2. Get logged-in user's analysis history
const getMyAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({
      user: req.user._id,
    })
      .select("-extractedText -qaHistory")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: analyses.length,
      data: analyses,
    });
  } catch (error) {
    console.error("Get analyses error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch analysis history",
    });
  }
};

// 3. Get one saved analysis
const getAnalysisById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid analysis ID",
      });
    }

    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Get analysis error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch analysis",
    });
  }
};

// 4. Update a saved analysis
const updateAnalysis = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid analysis ID",
      });
    }

    const allowedFields = [
      "summary",
      "summaryType",
      "insights",
      "qaHistory",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const analysis = await Analysis.findOneAndUpdate(
  {
    _id: req.params.id,
    user: req.user._id,
  },
  { $set: updates },
  {
    returnDocument: "after",
    runValidators: true,
  }
);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Analysis updated successfully",
      data: analysis,
    });
  } catch (error) {
    console.error("Update analysis error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update analysis",
    });
  }
};

// 5. Delete a saved analysis
const deleteAnalysis = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid analysis ID",
      });
    }

    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Analysis deleted successfully",
    });
  } catch (error) {
    console.error("Delete analysis error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete analysis",
    });
  }
};

module.exports = {
  saveAnalysis,
  getMyAnalyses,
  getAnalysisById,
  updateAnalysis,
  deleteAnalysis,
};
