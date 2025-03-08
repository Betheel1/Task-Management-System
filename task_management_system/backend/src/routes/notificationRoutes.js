// routes/notificationRoutes.js
const express = require("express");
const notificationController = require("../controllers/notificationController");
const authController = require("../controllers/authController");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for notifications
router.get("/", notificationController.getNotifications);
router.patch("/:id/mark-as-read", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
