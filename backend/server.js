require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const fileRoutes = require("./routes/fileRoutes");

const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));
app.use("/api/auth", authRoutes);

app.use("/api/health", healthRoutes);

app.use("/api/articles", articleRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/api/insights", insightsRoutes);

app.use("/api/analyses", analysisRoutes);

app.use("/api/files", fileRoutes);


const multer = require("multer");

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "File size must not exceed 10 MB."
          : err.message,
    });
  }

  if (err) {
    console.error("Upload error:", err.message);

    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed.",
    });
  }

  next();
});


const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`InfoLens backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();