
const { generateInsights } = require("../services/insightsService");

const createInsights = async (req, res) => {
  try {
    const { text } = req.body;

    if (typeof text !== "string" || text.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message: "Article text must contain at least 100 characters",
      });
    }

    const result = await generateInsights(text);

    return res.status(200).json({
      success: true,
      message: "AI insights generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Insights generation error:", error.message);

    let status = Number(error.status || error.error?.code);

    if (!status) {
      try {
        status = JSON.parse(error.message).error?.code;
      } catch {
        status = 502;
      }
    }

    if (![400, 413, 429, 503].includes(status)) {
      status = 502;
    }

    return res.status(status).json({
      success: false,
      message:
        status === 413
          ? "Article exceeds the maximum supported length."
          : status === 400
          ? "Invalid article content."
          : status === 429
          ? "Gemini API rate limit reached. Please try later."
          : status === 503
          ? "Gemini is temporarily unavailable. Please try again."
          : "Unable to generate AI insights.",
    });
  }
};

module.exports = { createInsights };
