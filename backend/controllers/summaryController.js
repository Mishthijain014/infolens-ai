
const { generateSummary } = require("../services/geminiService");

const createSummary = async (req, res) => {
  try {
    const { text, summaryType = "short" } = req.body;

    if (typeof text !== "string" || text.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message: "At least 100 characters of article text are required",
      });
    }

    if (!["short", "detailed"].includes(summaryType)) {
      return res.status(400).json({
        success: false,
        message: "Summary type must be short or detailed",
      });
    }

    const result = await generateSummary(text, summaryType);

    return res.status(200).json({
      success: true,
      message: "Summary generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Gemini summarization error:", error.message);

    const status =
    error.status === 413 ? 413 :
    error.status === 429 ? 429 :
    error.status === 503 ? 503 : 502;

  return res.status(status).json({
    success: false,
    message:
      status === 413
        ? error.message
        : status === 429
        ? "Gemini rate limit reached. Try again later."
        : status === 503
        ? "Gemini is temporarily unavailable."
        : "Unable to generate summary",
  });
  }
};

module.exports = { createSummary };
