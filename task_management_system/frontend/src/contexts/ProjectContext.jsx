// src/contexts/ProjectContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "../../axiosConfig";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch all projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/project"
        );
        setProjects(response.data.data.projects);
        console.log(response.data.data.projects);
        // Set the most recent project as the default selected project
        if (response.data.data.projects?.length > 0) {
          setSelectedProject(response.data.data.projects[0]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Function to update the selected project
  const selectProject = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    setSelectedProject(project);
  };
  const refreshProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/project");
      setProjects(response.data.data.projects);

      if (response.data.data.projects?.length > 0) {
        setSelectedProject(response.data.data.projects[0]);
      }
    } catch (error) {
      console.error("Error refreshing projects:", error);
      setError("Failed to refresh projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        selectProject,
        loading,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => React.useContext(ProjectContext);
