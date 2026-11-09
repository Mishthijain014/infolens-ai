
const { answerQuestion } = require("../services/qaService");

const askQuestion = async (req, res) => {
  try {
    const { text, question } = req.body;

    const result = await answerQuestion(text, question);

    return res.status(200).json({
      success: true,
      message: "Question answered successfully",
      data: result,
    });
  } catch (error) {
    console.error("AI Q&A error:", error.message);

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
        status === 400
          ? error.message
          : status === 413
          ? "Article exceeds the maximum supported length."
          : status === 429
          ? "Gemini API rate limit reached. Please try later."
          : status === 503
          ? "Gemini is temporarily unavailable. Please try again."
          : "Unable to answer the question.",
    });
  }
};

module.exports = { askQuestion };
