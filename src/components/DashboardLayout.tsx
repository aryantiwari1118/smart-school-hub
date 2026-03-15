import { useState } from "react";
import AppSidebar from "./AppSidebar";
import TopNavbar from "./TopNavbar";

type UserRole = "admin" | "teacher" | "student" | "parent";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} role={role.charAt(0).toUpperCase() + role.slice(1)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
