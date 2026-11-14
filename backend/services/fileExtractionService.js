
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

const extractPDF = async (buffer) => {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
};

const extractDOCX = async (buffer) => {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};

const extractTXT = (buffer) => {
  return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
};

const extractFileText = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("No file provided.");
  }

  const extension = path.extname(file.originalname).toLowerCase();
  const buffer = file.buffer;

  // Verify actual file signatures.
  if (extension === ".pdf") {
    if (buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
      throw new Error("Invalid PDF file.");
    }
  }

  if (extension === ".docx") {
    const zipSignature = buffer.subarray(0, 4).toString("hex");

    if (zipSignature !== "504b0304") {
      throw new Error("Invalid DOCX file.");
    }
  }

  let text;

  switch (extension) {
    case ".pdf":
      text = await extractPDF(buffer);
      break;

    case ".docx":
      text = await extractDOCX(buffer);
      break;

    case ".txt":
      text = extractTXT(buffer);
      break;

    default:
      throw new Error("Unsupported file type.");
  }

  const cleanedText = text
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!cleanedText) {
    throw new Error(
      "No readable text found in this file. Scanned PDFs are not supported yet."
    );
  }

  return {
    text: cleanedText,
    fileName: file.originalname,
    fileType: extension.slice(1),
    wordCount: cleanedText.split(/\s+/).length,
  };
};

module.exports = { extractFileText };
