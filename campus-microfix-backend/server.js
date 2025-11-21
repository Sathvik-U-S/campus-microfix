// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// --- middlewares ---
app.use(cors());
app.use(express.json());

// --- routes ---
const issueRoutes = require("./routes/issues");
app.use("/api/issues", issueRoutes);

// --- test route ---
app.get("/", (req, res) => {
  res.send("Campus Microfix API is running");
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

console.log("🚀 Starting backend...");
console.log("🔗 Mongo URI:", MONGO_URI ? "found" : "MISSING!");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// just in case there are hidden promise errors
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
