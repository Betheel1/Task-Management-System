// src/pages/Completed.jsx
import React, { useEffect, useState } from "react";
import { useProject } from "../contexts/ProjectContext";
import axios from "../../axiosConfig";

const Completed = () => {
  const { selectedProject } = useProject();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (selectedProject) {
      const fetchCompletedTasks = async () => {
        try {
          const response = await axios.get(
            `/api/v1/tasks/?project=${selectedProject._id}&status=completed`
          );
          setTasks(response.data.data.tasks);
        } catch (error) {
          console.error("Error fetching completed tasks:", error);
        }
      };

      fetchCompletedTasks();
    }
  }, [selectedProject]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Completed Tasks</h1>
      <p className="text-gray-600 mb-6">View all your finished tasks here.</p>

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
              Assigned To: {task.assignedTo?.name} ({task.assignedTo?.email})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Completed;
