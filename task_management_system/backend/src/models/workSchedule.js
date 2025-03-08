// models/WorkSchedule.js
const mongoose = require("mongoose");

const workScheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: Date,
    required: [true, "Please provide a start time"],
  },
  endTime: {
    type: Date,
    required: [true, "Please provide an end time"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WorkSchedule = mongoose.model("WorkSchedule", workScheduleSchema);

module.exports = WorkSchedule;
