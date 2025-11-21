const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    locationText: String,

    category: String,
    priority: String,
    status: { type: String, default: "Open" },

    reportedBy: String,
    department: String,
    assignee: String,

    classificationReason: String,
    priorityReason: String
  },
  { timestamps: true }
);


module.exports = mongoose.model("Issue", issueSchema);
