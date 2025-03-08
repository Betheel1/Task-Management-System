// controllers/notificationController.js
const Notification = require("../models/notification");
const AppError = require("../utils/appError");
const asyncWrapper = require("../utils/asyncWraper");

// Get all notifications for a user
const getNotifications = asyncWrapper(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    results: notifications.length,
    data: {
      notifications,
    },
  });
});

// Mark a notification as read
const markAsRead = asyncWrapper(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      notification,
    },
  });
});

// Delete a notification
const deleteNotification = asyncWrapper(async (req, res, next) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
};
