// routes/projectRoutes.js
const express = require("express");
const projectController = require("../controllers/projectController");
const authController = require("../controllers/authController");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for projects
router
  .route("/")
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route("/:id")
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);
router.post("/:id/add-member", projectController.addMember);
router.post("/:id/remove-member", projectController.removeMember);
router.get("/:id/team-members", projectController.getProjectTeamMembers);

module.exports = router;
