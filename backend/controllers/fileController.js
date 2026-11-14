
const { extractFileText } = require("../services/fileExtractionService");

const extractUploadedFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file.",
      });
    }

    const extractedData = await extractFileText(req.file);

    return res.status(200).json({
      success: true,
      message: "File text extracted successfully.",
      data: extractedData,
    });
  } catch (error) {
    console.error("File extraction error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to extract file text.",
    });
  }
};

module.exports = { extractUploadedFile };
