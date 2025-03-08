import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./AppRouter";
import { ProjectProvider } from "./contexts/ProjectContext";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

const App = () => {
  return (
    <Router>
      <AuthProvider>
        {" "}
        {/* Wrap AuthProvider first */}
        <ProjectProvider>
          <AppRouter />
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
