// routes/issueRoutes.js
const express = require("express");
const issueController = require("../controllers/issueController");
const authController = require("../controllers/authController");
const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for issues
router
  .route("/")
  .get(issueController.getAllIssues)
  .post(issueController.createIssue);

router
  .route("/:id")
  .get(issueController.getIssue)
  .patch(issueController.updateIssue)
  .delete(issueController.deleteIssue);

module.exports = router;
