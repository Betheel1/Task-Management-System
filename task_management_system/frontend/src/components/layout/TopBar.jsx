import React, { useState, useEffect, useContext } from "react";
import { useProject } from "../../contexts/ProjectContext";
import axios from "../../../axiosConfig";
import { FaBell, FaUserCircle } from "react-icons/fa";
import io from "socket.io-client";
import { decodeToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
const socket = io("http://localhost:5000"); // Connect to the Socket.IO server
const Topbar = () => {
  const { projects, selectedProject, selectProject, refreshProjects } =
    useProject();
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [members, setMembers] = useState([]); // Array of selected member IDs
  const [users, setUsers] = useState([]); // List of all users
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  // Fetch notifications from the backend
  // const handleProjectChange = (event) => {
  //   const projectId = event.target.value;
  //   selectProject(projectId);
  // };

  // Fetch all users for the members dropdown
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/v1/auth/getUsers");
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle form submission
  const handleCreateProject = async () => {
    try {
      await axios.post("/api/v1/project", {
        name: projectName,
        description,
        deadline,
        schedule: {
          startDate,
          endDate,
        },
        members, // Array of selected member IDs
      });

      // Clear form fields
      setProjectName("");
      setDescription("");
      setDeadline("");
      setStartDate("");
      setEndDate("");
      setMembers([]);

      // Show success message
      setSuccessMessage("Project created successfully!");
      setErrorMessage("");

      // Refresh the project list
      refreshProjects();
      // Close the modal after 2 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      setErrorMessage("Failed to create project. Please try again.");
      setSuccessMessage("");
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/v1/notifications");
      const fetchedNotifications = response.data.data.notifications;
      setNotifications(fetchedNotifications);
      const unread = fetchedNotifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/v1/notifications/${notificationId}/mark-as-read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/v1/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Fetch notifications and set up Socket.IO listeners
  useEffect(() => {
    fetchNotifications();

    // Join the user's room for real-time notifications
    const userToken = decodeToken(); // Replace with the actual user ID (e.g., from auth context)
    socket.emit("joinUserRoom", userToken.id);

    // Listen for real-time notifications
    socket.on("receiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Clean up the listener on unmount
    return () => {
      socket.off("receiveNotification");
    };
  }, []);

  return (
    <div className="w-full top-0 z-100 bg-gray-900 text-white flex justify-between items-center p-4 shadow-md">
      {/* Project Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm">Project:</label>
        <select
          value={selectedProject?._id || ""}
          onChange={(e) => selectProject(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
          title="select your project"
        >
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
        {user?.role === "manager" && (
          <button
            title="create  project"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={() => {
              setIsModalOpen(true);
              fetchUsers();
            }}
          >
            + Create Project
          </button>
        )}
      </div>

      {/* Notifications and User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-gray-400 hover:text-white focus:outline-none relative"
            title="view notifications"
          >
            <FaBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg z-50">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                <ul>
                  {notifications.length === 0 ? (
                    <li className="p-2 text-gray-600">No new notifications</li>
                  ) : (
                    notifications.map((notification) => (
                      <li
                        key={notification._id}
                        className={`p-2 flex justify-between items-center ${
                          notification.read ? "bg-gray-100" : "bg-blue-100"
                        }`}
                      >
                        <span
                          title="mark as read"
                          className="cursor-pointer"
                          onClick={() => markAsRead(notification._id)}
                        >
                          {notification.message}
                        </span>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteNotification(notification._id)}
                        >
                          ✖
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="p-2 flex items-center gap-2 text-gray-400 hover:text-white focus:outline-none"
          >
            <FaUserCircle size={24} />
            <p className="text-sm font-medium">{user.name}</p>
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
              <ul>
                <li className="p-2 hover:bg-gray-100">Profile</li>
                <li className="p-2 hover:bg-gray-100">Settings</li>
                <li
                  onClick={() => {
                    localStorage.removeItem("authToken"),
                      prompt("are you sure you want to logout"),
                      navigate("/login");
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white text-black p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Project</h2>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {errorMessage}
              </div>
            )}

            {/* Project Name */}
            <label className="block text-sm font-medium mb-1">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />

            {/* Description */}
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />

            {/* Deadline */}
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input
              type="date"
              placeholder="Deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />

            {/* Schedule - Start Date */}
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />

            {/* Schedule - End Date */}
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />

            {/* Members */}
            <label className="block text-sm font-medium mb-1">Members</label>
            <select
              multiple
              value={members}
              onChange={(e) => {
                // Convert selected options to an array of values
                const selectedMembers = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setMembers(selectedMembers);
              }}
              className="w-full p-2 border rounded-md mb-4"
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                onClick={handleCreateProject}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
