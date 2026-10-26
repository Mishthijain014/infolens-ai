
const { extractArticle } = require("../services/articleService");

const extractFromUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid article URL is required",
      });
    }

    const article = await extractArticle(url);

    return res.status(200).json({
      success: true,
      message: "Article extracted successfully",
      article,
    });
  } catch (error) {
  console.error("Article extraction error:", error.message);

  if (error.code === "ERR_BAD_RESPONSE" &&
      error.message.includes("maxContentLength")) {
    return res.status(413).json({
      success: false,
      message: "Article is too large to process",
    });
  }

  if (
    error.response ||
    error.code === "ECONNABORTED" ||
    error.code === "ETIMEDOUT"
  ) {
    return res.status(502).json({
      success: false,
      message: "Unable to retrieve the article from the website",
    });
  }

  return res.status(400).json({
    success: false,
    message: error.message,
  });
}
};

module.exports = { extractFromUrl };
