// routes/taskRoutes.js
const express = require("express");
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for tasks
router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

// Assign a task to a user
router.patch("/:id/assign", taskController.assignTask);

// Update task status
router.patch("/:id/status", taskController.updateTaskStatus);

// Get tasks by project ID
router.get("/project/:projectId", taskController.getTasksByProjectId);

module.exports = router;
