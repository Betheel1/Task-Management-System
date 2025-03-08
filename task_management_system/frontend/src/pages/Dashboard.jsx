import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import StatCard from "../components/shared/StatCard";
import { useProject } from "../contexts/ProjectContext";
import axios from "../../axiosConfig";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const { selectedProject } = useProject();
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completed: 0,
    tasksInProgress: 0,
    todos: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch tasks and update statistics
  const fetchTaskStats = async () => {
    if (!selectedProject) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/v1/tasks/project/${selectedProject._id}`
      );

      const tasks = response.data.data.tasks;
      setTasks(tasks);

      const totalTasks = tasks.length;
      const completed = tasks.filter(
        (task) => task.status === "completed"
      ).length;
      const tasksInProgress = tasks.filter(
        (task) => task.status === "in progress"
      ).length;
      const todos = tasks.filter((task) => task.status === "todos").length;

      setTaskStats({ totalTasks, completed, tasksInProgress, todos });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskStats();
  }, [selectedProject]);

  // Socket event listeners
  useEffect(() => {
    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
      fetchTaskStats();
    });

    socket.on("taskDeleted", (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      fetchTaskStats();
    });

    socket.on("taskCreated", (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      fetchTaskStats();
    });

    return () => {
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      socket.off("taskCreated");
    };
  }, []);

  const confirmDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeletePopup(true);
  };

  // Update task details
  const handleTaskUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = { ...editTask };
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );

      const response = await axios.patch(
        `http://localhost:5000/api/v1/tasks/${editTask._id}`,
        editTask
      );

      socket.emit("updateTask", response.data.data.task);
      setEditTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskToDelete)
      ); // Remove immediately
      await axios.delete(`http://localhost:5000/api/v1/tasks/${taskToDelete}`);
      socket.emit("deleteTask", taskToDelete);
      setShowDeletePopup(false);
      setTaskToDelete(null);
      fetchTaskStats(); // Update statistics
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="TOTAL TASKS"
          value={taskStats.totalTasks}
          unit="tasks"
        />
        <StatCard
          title="COMPLETED TASKS"
          value={taskStats.completed}
          unit="tasks"
        />
        <StatCard
          title="TASKS IN PROGRESS"
          value={taskStats.tasksInProgress}
          unit="tasks"
        />
        <StatCard title="TODOS" value={taskStats.todos} unit="tasks" />
      </div>

      {/* Loading state */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task._id} className="mb-4 p-4 border rounded">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Status: {task.status}</p>
                  <p>Priority: {task.priority}</p>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => setEditTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => confirmDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this task?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={deleteTask}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <form onSubmit={handleTaskUpdate}>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                onClick={() => setEditTask(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
