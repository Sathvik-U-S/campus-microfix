// routes/issues.js

const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const {
  categorizeIssue,
  prioritizeIssue,
  assignIssue
} = require("../services/rules");

// -----------------------------------------------------
// CREATE ISSUE (POST)
// -----------------------------------------------------

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      locationText,
      reportedBy,
      affectsClass,
      safetyRisk
    } = req.body;

    // Basic validation
    if (!title || !description || !reportedBy) {
      return res.status(400).json({
        error: "title, description, and reportedBy are required"
      });
    }

    const text = `${title} ${description}`;

    // Categorization + reasons
    const { category, reason: classificationReason } = categorizeIssue(text);

    // Priority + reasons
    const { priority, reason: priorityReason } = prioritizeIssue({
      text,
      affectsClass,
      safetyRisk
    });

    // Assignment
    const { department, assignee } = assignIssue(category);

    // Save in DB
    const issue = await Issue.create({
      title,
      description,
      locationText,
      reportedBy,
      category,
      priority,
      department,
      assignee,
      classificationReason,
      priorityReason,
      status: "Open"
    });

    res.status(201).json(issue);
  } catch (err) {
    console.error("❌ Error creating issue:", err);
    res.status(500).json({ error: "Failed to create issue" });
  }
});

// -----------------------------------------------------
// LIST ISSUES (GET)
// -----------------------------------------------------

router.get("/", async (req, res) => {
  try {
    const { department, reportedBy, status } = req.query;

    const filter = {};
    if (department) filter.department = department;
    if (reportedBy) filter.reportedBy = reportedBy;
    if (status) filter.status = status;

    const issues = await Issue.find(filter).sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    console.error("❌ Error fetching issues:", err);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

// -----------------------------------------------------
// UPDATE ISSUE (PATCH) - STAFF ONLY
// -----------------------------------------------------

router.patch("/:id", async (req, res) => {
  try {
    // Staff Access Check
    const staffKey = req.headers["x-staff-key"];

    if (!staffKey || staffKey !== process.env.STAFF_API_KEY) {
      return res
        .status(403)
        .json({ error: "Forbidden: staff access required" });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(updatedIssue);
  } catch (err) {
    console.error("❌ Error updating issue:", err);
    res.status(500).json({ error: "Failed to update issue" });
  }
});

module.exports = router;
