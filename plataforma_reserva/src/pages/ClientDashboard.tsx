import { Outlet } from "react-router-dom";
import { HeaderClientDashboard } from "../components/HeaderClientDashboard";
import Sidebar from "../components/Sidebar";

export const ClientDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <HeaderClientDashboard />

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
