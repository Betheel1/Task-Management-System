import Sidebar from "../../pages/Sidebar";
import Topbar from "./TopBar";
import { Outlet } from "react-router-dom";
import { decodeToken } from "../../utils/decodeToken";
const Layout = () => {
  const userRole = decodeToken().role;
  console.log("user role is", userRole);
  return (
    <div className="flex flex-col h-screen">
      {/* Topbar */}
      <Topbar />

      {/* Main Content and Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar userRole={userRole} />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
