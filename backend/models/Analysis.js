
const mongoose = require("mongoose");

const qaSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    sourceUrl: {
      type: String,
      trim: true,
      default: "",
    },

    sourceType: {
      type: String,
      enum: ["article", "youtube", "rss", "file"],
      default: "article",
    },

    extractedText: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
      default: "",
    },

    summaryType: {
      type: String,
      enum: ["short", "detailed"],
      default: "short",
    },

    insights: {
      type: String,
      default: "",
    },

    qaHistory: {
      type: [qaSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

analysisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Analysis", analysisSchema);
