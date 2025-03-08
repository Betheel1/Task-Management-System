// controllers/issueController.js
const Issue = require("../models/issue");
const Task = require("../models/task");
const Notification = require("../models/Notification");
const AppError = require("../utils/appError");
const asyncWrapper = require("../utils/asyncWraper");

// Create a new issue
const createIssue = asyncWrapper(async (req, res, next) => {
  const { title, description, task, priority } = req.body;

  if (!title || !description || !task) {
    return next(
      new AppError("Please provide title, description, and task", 400)
    );
  }

  const issue = await Issue.create({
    title,
    description,
    task,
    reportedBy: req.user._id, // Assuming user is authenticated and `req.user` is set
    priority,
  });

  // Notify the task's assigned user about the new issue
  const taskDetails = await Task.findById(task).populate(
    "assignedTo",
    "name email"
  );
  if (taskDetails && taskDetails.assignedTo) {
    const notification = await Notification.create({
      user: taskDetails.assignedTo._id,
      message: `A new issue has been reported for the task: ${taskDetails.title}`,
      link: `/tasks/${taskDetails._id}`, // Link to the task
    });

    // Emit a real-time notification to the assigned user (if online)
    const io = req.app.get("socketio"); // Get the Socket.IO instance
    io.to(taskDetails.assignedTo._id.toString()).emit(
      "notification",
      notification
    );
  }

  res.status(201).json({
    status: "success",
    data: {
      issue,
    },
  });
});

// Get all issues
const getAllIssues = asyncWrapper(async (req, res, next) => {
  const { task, status, priority } = req.query;
  const filter = {};

  // Filter by task
  if (task) {
    filter.task = task;
  }

  // Filter by status
  if (status) {
    filter.status = status;
  }

  // Filter by priority
  if (priority) {
    filter.priority = priority;
  }

  const issues = await Issue.find(filter)
    .populate("task", "title")
    .populate("reportedBy", "name email");

  res.status(200).json({
    status: "success",
    results: issues.length,
    data: {
      issues,
    },
  });
});

// Get a single issue by ID
const getIssue = asyncWrapper(async (req, res, next) => {
  const issue = await Issue.findById(req.params.id)
    .populate("task", "title")
    .populate("reportedBy", "name email");

  if (!issue) {
    return next(new AppError("Issue not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      issue,
    },
  });
});

// Update an issue
const updateIssue = asyncWrapper(async (req, res, next) => {
  const { title, description, status, priority } = req.body;

  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { title, description, status, priority },
    {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    }
  )
    .populate("task", "title")
    .populate("reportedBy", "name email");

  if (!issue) {
    return next(new AppError("Issue not found", 404));
  }

  // Notify the task's assigned user about the issue update
  const taskDetails = await Task.findById(issue.task).populate(
    "assignedTo",
    "name email"
  );
  if (taskDetails && taskDetails.assignedTo) {
    const notification = await Notification.create({
      user: taskDetails.assignedTo._id,
      message: `An issue has been updated for the task: ${taskDetails.title}`,
      link: `/tasks/${taskDetails._id}`, // Link to the task
    });

    // Emit a real-time notification to the assigned user (if online)
    const io = req.app.get("socketio"); // Get the Socket.IO instance
    io.to(taskDetails.assignedTo._id.toString()).emit(
      "notification",
      notification
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      issue,
    },
  });
});

// Delete an issue
const deleteIssue = asyncWrapper(async (req, res, next) => {
  const issue = await Issue.findByIdAndDelete(req.params.id);

  if (!issue) {
    return next(new AppError("Issue not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createIssue,
  getAllIssues,
  getIssue,
  updateIssue,
  deleteIssue,
};
