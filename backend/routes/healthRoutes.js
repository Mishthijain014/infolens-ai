const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 503).json({
    success: isConnected,
    message: isConnected
      ? "InfoLens API is running"
      : "Database connection unavailable",
    database: isConnected ? "connected" : "disconnected",
  });
});

module.exports = router;