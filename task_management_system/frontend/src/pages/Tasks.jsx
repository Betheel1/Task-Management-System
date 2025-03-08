import React, { useState, useEffect, useContext } from "react";
import axios from "../../axiosConfig";
import TaskCreationForm from "./TaskCreationForm";
import { useProject } from "../contexts/ProjectContext";
import { decodeToken } from "../utils/decodeToken";
import { AuthContext } from "../contexts/AuthContext";
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { selectedProject } = useProject();
  const { user } = useContext(AuthContext);
  const userId = decodeToken().id;

  // Fetch tasks from the backend
  useEffect(() => {
    if (!selectedProject || !selectedProject._id) {
      setError("No project selected.");
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `/api/v1/tasks/project/${selectedProject._id}`
        );
        setTasks(response.data.data.tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to fetch tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedProject]);

  // Add a new task to the list
  const onCreateTask = (newTask) => {
    setTasks([...tasks, { ...newTask, status: "todos" }]);
  };

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.patch(`/api/v1/tasks/${taskId}/status`, {
        status: newStatus,
      });
      console.log("API Response:", response.data);

      // Update the task status in the UI
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      setError("");
    } catch (err) {
      console.error("Error updating task status:", err);
      setError("Failed to update task status. Please try again.");
    }
  };

  if (!selectedProject || !selectedProject._id) {
    return <div className="text-center py-4">No project selected.</div>;
  }

  if (loading) return <div className="text-center py-4">Loading tasks...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  // Define columns
  const columns = [
    { id: "todos", title: "To Do" },
    { id: "in progress", title: "In Progress" },
    { id: "completed", title: "Completed" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h2>Move a task to your desired status</h2>
      {user.role === "manager" && (
        <button
          onClick={() => setIsTaskFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-6 w-full md:w-auto"
        >
          Create Task
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-gray-100 p-4 rounded-lg min-h-[300px] shadow-md"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              {column.title}
            </h3>
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-4 mb-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition"
                >
                  <h4 className="font-medium text-gray-800">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-600">
                    Assigned to: {task.assignedTo?.name || "Unassigned"}
                  </p>
                  <p className="text-sm text-gray-600">Status: {task.status}</p>

                  {/* Dropdown to move task to a new status (only for assignee) */}
                  {task.assignedTo?._id === user.id && (
                    <div className="mt-2">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTaskStatus(task._id, e.target.value)
                        }
                        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {columns.map((col) => (
                          <option key={col.id} value={col.id}>
                            Move to {col.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>

      <TaskCreationForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onCreateTask={onCreateTask}
        projectId={selectedProject._id}
      />
    </div>
  );
};

export default Tasks;
