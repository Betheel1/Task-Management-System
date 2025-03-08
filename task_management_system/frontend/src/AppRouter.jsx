import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Todos from "./pages/Todos";
import Completed from "./pages/Completed";
import InProgress from "./pages/InProgress";
import TeamManagement from "./pages/Team";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Tasks from "./pages/Tasks";
import LandingPage from "./components/landing";

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect to Login by default */}
      <Route path="/" element={<Navigate to="/landing" />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Protected Routes (Require Authentication) */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="todos" element={<Todos />} />
        <Route path="completed" element={<Completed />} />
        <Route path="in-progress" element={<InProgress />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
