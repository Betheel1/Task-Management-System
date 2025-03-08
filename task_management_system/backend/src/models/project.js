// models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a project name"],
  },
  description: {
    type: String,
    required: [true, "Please provide a project description"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: [true, "Please provide a project deadline"],
  },
  status: {
    type: String,
    enum: ["not started", "in progress", "completed"],
    default: "not started",
  },
  schedule: {
    startDate: {
      type: Date,
      required: [true, "Please provide a start date for the project"],
    },
    endDate: {
      type: Date,
      required: [true, "Please provide an end date for the project"],
    },
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
