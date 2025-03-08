import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useProject } from "../contexts/ProjectContext";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for the menu toggle

const Sidebar = ({ userRole }) => {
  const { selectedProject } = useProject();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  const menuItems = [
    { path: "/todos", label: "To-Dos" },
    { path: "/completed", label: "Completed" },
    { path: "/tasks", label: "Tasks" },
    { path: "/in-progress", label: "In Progress" },
  ];

  if (userRole === "manager") {
    menuItems.push({ path: "/team", label: "Team Management" });
    menuItems.unshift({ path: "/dashboard", label: "Dashboard" });
  }

  return (
    <>
      {/* Menu Icon for Small Screens */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-19 left-3 z-50 p-2 bg-gray-800 text-white rounded-lg md:hidden"
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:top-0 md:w-64 h-[calc(100vh-4rem)] flex flex-col p-4 z-40`}
      >
        <h2 className="text-lg font-semibold mb-4">{selectedProject?.name}</h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded transition ${
                  isActive ? "bg-blue-600" : "hover:bg-blue-500"
                }`
              }
              onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click (for small screens)
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay for Small Screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)} // Close sidebar when clicking outside
        />
      )}
    </>
  );
};

export default Sidebar;
