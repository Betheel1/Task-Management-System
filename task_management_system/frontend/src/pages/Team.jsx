import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig"; // Adjust the import path as needed
import { useProject } from "../contexts/ProjectContext";

const TeamManagement = () => {
  const [users, setUsers] = useState([]); // All users
  const [teamMembers, setTeamMembers] = useState([]); // Current team members
  const [selectedUser, setSelectedUser] = useState(""); // Selected user to add
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { selectedProject } = useProject();

  // Fetch all users and current team members
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersResponse = await axios.get("/api/v1/auth/getUsers");
        setUsers(usersResponse.data.data.users);

        // Fetch team members for the selected project
        if (selectedProject) {
          const teamResponse = await axios.get(
            `/api/v1/project/${selectedProject._id}/team-members`
          );
          setTeamMembers(teamResponse.data.data.members);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProject]);

  // Handle adding a user to the team
  const handleAddUser = async () => {
    if (!selectedUser) {
      setError("Please select a user to add.");
      return;
    }

    try {
      // Add user to the project
      await axios.post(`/api/v1/project/${selectedProject._id}/add-member`, {
        userId: selectedUser,
      });

      // Refresh the team members list
      const teamResponse = await axios.get(
        `/api/v1/project/${selectedProject._id}/team-members`
      );
      setTeamMembers(teamResponse.data.data.members);

      // Clear selected user and error
      setSelectedUser("");
      setError("");
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user. Please try again.");
    }
  };

  // Handle removing a user from the team
  const handleRemoveUser = async (userId) => {
    try {
      // Remove user from the project
      await axios.post(`/api/v1/project/${selectedProject._id}/remove-member`, {
        userId,
      });

      // Refresh the team members list
      const teamResponse = await axios.get(
        `/api/v1/project/${selectedProject._id}/team-members`
      );
      setTeamMembers(teamResponse.data.data.members);
    } catch (err) {
      console.error("Error removing user:", err);
      setError("Failed to remove user. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Team Management</h1>
      <p className="text-gray-600 mb-6">Add or remove team members here.</p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add User Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a Team Member</h2>
        <div className="flex gap-4">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-2 border rounded-md flex-1"
          >
            <option value="">Select a user</option>
            {users
              .filter(
                (user) => !teamMembers.some((member) => member._id === user._id)
              )
              .map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
          </select>
          <button
            onClick={handleAddUser}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Current Team Members Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Current Team Members</h2>
        {teamMembers.length === 0 ? (
          <p className="text-gray-600">No team members added yet.</p>
        ) : (
          <ul className="space-y-2">
            {teamMembers.map((member) => (
              <li
                key={member._id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <span>
                  {member.name} ({member.email})
                </span>
                <button
                  onClick={() => handleRemoveUser(member._id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
