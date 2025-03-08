// controllers/projectController.js
const Project = require("../models/project");
const AppError = require("../utils/appError");
const asyncWrapper = require("../utils/asyncWraper");

// Create a new project
const addMember = asyncWrapper(async (req, res, next) => {
  const { userId } = req.body;
  const projectId = req.params.id;

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  // Check if the user is already a member
  if (project.members.includes(userId)) {
    return next(new AppError("User is already a member", 400));
  }

  // Add the user to the project
  project.members.push(userId);
  await project.save();

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});
const getProjectTeamMembers = asyncWrapper(async (req, res, next) => {
  const projectId = req.params.id;

  // Fetch the project and populate the members field
  const project = await Project.findById(projectId).populate(
    "members",
    "name email"
  );

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  // Return the team members
  res.status(200).json({
    status: "success",
    data: {
      members: project.members,
    },
  });
});
// Remove a member from the project
const removeMember = asyncWrapper(async (req, res, next) => {
  const { userId } = req.body;
  const projectId = req.params.id;

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  // Remove the user from the project
  project.members = project.members.filter(
    (member) => member.toString() !== userId
  );
  await project.save();

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});
const createProject = asyncWrapper(async (req, res, next) => {
  const { name, description, deadline, schedule, members } = req.body;
console.log(members)
  if (
    !name ||
    !description ||
    !deadline ||
    !schedule?.startDate ||
    !schedule?.endDate
  ) {
    return next(
      new AppError(
        "Please provide name, description, deadline, and schedule (startDate and endDate)",
        400
      )
    );
  }

  const project = await Project.create({
    name,
    description,
    deadline,
    schedule,
    members,
    createdBy: req.user._id, // Assuming user is authenticated and `req.user` is set
  });

  res.status(201).json({
    status: "success",
    data: {
      project,
    },
  });
});
// Get all projects
const getAllProjects = asyncWrapper(async (req, res, next) => {
  const projects = await Project.find().populate(
    "createdBy",
    "name email"
  );

  res.status(200).json({
    status: "success",
    results: projects.length,
    data: {
      projects,
    },
  });
});

// Get a single project by ID
const getProject = asyncWrapper(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate(
    "createdBy",
    "name email"
  );

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});

// Update a project
const updateProject = asyncWrapper(async (req, res, next) => {
  const { name, description, deadline, status } = req.body;

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { name, description, deadline, status },
    {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    }
  );

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});

// Delete a project
const deleteProject = asyncWrapper(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectTeamMembers,
};
