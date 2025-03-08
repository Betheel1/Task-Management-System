import React, { useEffect, useState } from "react";
import { useProject } from "../contexts/ProjectContext";
import axios from "../../axiosConfig";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
const Todos = () => {
  const { selectedProject } = useProject();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  console.log(user);
  useEffect(() => {
    if (selectedProject) {
      const fetchTodos = async () => {
        try {
          const response = await axios.get(
            `/api/v1/tasks/?project=${selectedProject._id}&status=todos`
          );
          setTasks(response.data.data.tasks);
        } catch (error) {
          console.error("Error fetching todos:", error);
        }
      };

      fetchTodos();
    }
  }, [selectedProject]);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/auth/getUsers"); // Adjust the endpoint
        setUsers(response.data.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to assign a user to a task
  const handleAssign = async (taskId, userId) => {
    try {
      const response = await axios.patch(`/api/v1/tasks/${taskId}/assign`, {
        assignedTo: userId,
      });
      // Update the state to reflect the change
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { ...task, assignedTo: response.data.data.assignedTo }
            : task
        )
      );
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <p className="text-gray-600 mb-6">Manage your pending tasks here.</p>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-500">
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">Priority: {task.priority}</p>
            <p className="text-sm text-gray-500">
              Assigned To: {task.assignedTo?.name || "Unassigned"} (
              {task.assignedTo?.email || "N/A"})
            </p>

            {/* Dropdown for Assigning Task */}
            {user.role === "manager" && (
              <select
                className="mt-2 p-2 border rounded"
                onChange={(e) => handleAssign(task._id, e.target.value)}
                value={task.assignedTo?._id || ""}
              >
                <option value="">Select Assignee</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;
