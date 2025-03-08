// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a task title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a task description"],
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId ,
    ref: "User",
  default:null
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
    required: [true, "Please provide a task deadline"],
  },
  status: {
    type: String,
    enum: ["todos", "in progress", "completed"],
    default: "todos",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
