// controllers/taskController.js
const Task = require("../models/task");
const AppError = require("../utils/appError");
const asyncWrapper = require("../utils/asyncWraper");
const Notification=require("../models/notification")

const getTasksByProjectId = asyncWrapper(async (req, res, next) => {
  const { projectId } = req.params;

  // Fetch tasks for the project
  const tasks = await Task.find({ project: projectId })
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  });
});
const createTask = asyncWrapper(async (req, res, next) => {
  const { title, description, project, assignedTo, deadline, priority } =
    req.body;

  if (!title || !description || !project || !deadline) {
    return next(
      new AppError(
        "Please provide title, description, project, and deadline",
        400
      )
    );
  }

  const task = await Task.create({
    title,
    description,
    project,
    assignedTo: assignedTo || null, // Ensure null is stored if no user is assigned
    createdBy: req.user._id,
    deadline,
    priority,
  });

  // Create a notification if a user is assigned
  if (assignedTo) {
    const notification = await Notification.create({
      user: assignedTo,
      message: `You have been assigned a new task: ${task.title}`,
      link: `/tasks/${task._id}`,
    });

    // Emit the notification to the assigned user
    const io = req.app.get("socketio");
    io.to(assignedTo.toString()).emit("receiveNotification", notification);
  }

  res.status(201).json({
    status: "success",
    data: { task },
  });
});



// Get all tasks
const getAllTasks = asyncWrapper(async (req, res, next) => {
  const { project, status, priority } = req.query;
  
  const filter = {};

  // Filter by project
  if (project) {
    filter.project = project;
  }

  // Filter by status
  if (status) {
    filter.status = status;
  }

  // Filter by priority
  if (priority) {
    filter.priority = priority;
  }

  const tasks = await Task.find(filter)
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

// Get a single task by ID
const getTask = asyncWrapper(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

// Update a task
const updateTask = asyncWrapper(async (req, res, next) => {
  const { title, description, assignedTo, deadline, status, priority } =
    req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { title, description, assignedTo, deadline, status, priority },
    {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    }
  )
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

// Delete a task
const deleteTask = asyncWrapper(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Assign a task to a user
// controllers/taskController.js


// Assign a task to a user
const assignTask = asyncWrapper(async (req, res, next) => {
  const { assignedTo } = req.body;

  if (!assignedTo) {
    return next(
      new AppError("Please provide a user to assign the task to", 400)
    );
  }

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { assignedTo },
    { new: true, runValidators: true }
  )
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  // Create a notification for the assigned user
  const notification = await Notification.create({
    user: assignedTo,
    message: `You have been assigned a new task: ${task.title}`,
    link: `/tasks/${task._id}`,
  });

  // Emit the notification to the assigned user
  const io = req.app.get("socketio");
  io.to(assignedTo.toString()).emit("receiveNotification", notification);

  res.status(200).json({
    status: "success",
    data: { task },
  });
});

// Update task status
const updateTaskStatus = asyncWrapper(async (req, res, next) => {
  const { status } = req.body;
  console.log(req.body)
  const task = await Task.findById(req.params.id);

  if (!task) return next(new AppError("Task not found", 404));

  if (task.assignedTo.toString() !== req.user._id.toString()) {
    return next(new AppError("You can only update tasks assigned to you", 403));
  }

  task.status = status;
  await task.save();

  res.status(200).json({ status: "success", data: { task } });
});


module.exports = {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  getTasksByProjectId, // Add this to the exports
};