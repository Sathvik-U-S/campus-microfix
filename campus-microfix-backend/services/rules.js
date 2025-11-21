// services/rules.js

// Returns: { category: string, reason: string }
function categorizeIssue(text) {
  const t = (text || "").toLowerCase();
  const matchedKeywords = [];

  // IT-related keywords
  if (/projector/.test(t)) matchedKeywords.push("projector");
  if (/wifi|wi-fi|network|internet/.test(t)) matchedKeywords.push("wifi/network/internet");
  if (/computer|pc|system|laptop|desktop/.test(t)) matchedKeywords.push("computer/pc/system");

  if (matchedKeywords.length > 0) {
    return {
      category: "IT",
      reason: `Matched IT keywords: ${matchedKeywords.join(", ")}`
    };
  }

  // Maintenance keywords
  if (/desk|table|chair|bench|furniture/.test(t)) {
    return {
      category: "Maintenance",
      reason: "Contains furniture-related words (desk/chair/bench/table)"
    };
  }

  if (/fan|ac|air conditioner|cooler|leak|plumbing|pipe|light|bulb|tube light|door|window/.test(t)) {
    return {
      category: "Maintenance",
      reason: "Contains physical infrastructure words (fan/AC/leak/light/door/window)"
    };
  }

  // Admin / General services keywords
  if (/marker|chalk|whiteboard|duster|cleaning|washroom|toilet|timetable|schedule|id card|idcard|fees|form|register/.test(t)) {
    return {
      category: "Admin",
      reason: "Contains admin/supplies/cleaning/timetable related words"
    };
  }

  // Fallback
  return {
    category: "Other",
    reason: "Did not match any specific category keywords"
  };
}

// Returns: { priority: string, reason: string }
function prioritizeIssue({ text, affectsClass, safetyRisk }) {
  const t = (text || "").toLowerCase();

  if (safetyRisk) {
    return {
      priority: "Critical",
      reason: "Reporter flagged this as a safety risk"
    };
  }

  if (affectsClass && /projector|wifi|wi-fi|network|internet|power|electric/.test(t)) {
    return {
      priority: "High",
      reason: "Affects an ongoing class and relates to IT/power"
    };
  }

  if (/water cooler|drinking water|fan|ac|air conditioner/.test(t)) {
    return {
      priority: "Medium",
      reason: "Comfort-related issue (water/fan/AC) without safety or class flags"
    };
  }

  return {
    priority: "Low",
    reason: "No safety risk, does not affect class, and no critical keywords"
  };
}

// Still just returns department + assignee (no reason needed here)
function assignIssue(category) {
  const mapping = {
    IT: {
      department: "IT",
      assignee: "it.staff@campus.edu"
    },
    Maintenance: {
      department: "Maintenance",
      assignee: "maintenance.staff@campus.edu"
    },
    Admin: {
      department: "Admin",
      assignee: "admin.staff@campus.edu"
    },
    Other: {
      department: "Admin",
      assignee: "admin.staff@campus.edu"
    }
  };

  return mapping[category] || mapping.Other;
}

module.exports = {
  categorizeIssue,
  prioritizeIssue,
  assignIssue
};
