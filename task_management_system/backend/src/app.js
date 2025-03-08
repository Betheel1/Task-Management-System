const express = require("express");
const dotenv = require("dotenv");
const cors=require('cors')
const connectDB = require("./utils/db");
const  errorHandler  = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/authRoutes");
const projectRoutes=require('./routes/projectRoutes')
const taskRouter=require('./routes/taskRoutes')
const issueRouter = require("./routes/issueRoutes");
const notificationRouter=require('./routes/notificationRoutes')
dotenv.config();

const app = express();

connectDB();
app.use(express.json()); 
app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend URL (e.g., React app's URL)
    methods: ["GET", "POST", "PATCH","DELETE","PUT"],
    credentials: true, // Enable cookies if needed
  })
);
// Define routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/issues", issueRouter);
app.use('/api/v1/project',projectRoutes)
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use(errorHandler);

module.exports = app;
