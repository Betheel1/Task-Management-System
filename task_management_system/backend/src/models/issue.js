// models/Issue.js
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide an issue title"],
  },
  description: {
    type: String,
    required: [true, "Please provide an issue description"],
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["open", "in progress", "resolved"],
    default: "open",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
