import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookOpen,
  BarChart3,
  Settings,
  GraduationCap,
  ClipboardList,
  MessageSquare,
  UserCircle,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type UserRole = "admin" | "teacher" | "student" | "parent";

interface AppSidebarProps {
  role: UserRole;
  open: boolean;
  onClose?: () => void;
}

const menuByRole: Record<UserRole, { title: string; url: string; icon: React.ElementType }[]> = {
  admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Attendance", url: "/attendance", icon: CalendarCheck },
    { title: "Curriculum", url: "/curriculum", icon: BookOpen },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ],
  teacher: [
    { title: "Dashboard", url: "/teacher", icon: LayoutDashboard },
    { title: "Attendance", url: "/attendance", icon: CalendarCheck },
    { title: "Curriculum", url: "/curriculum", icon: BookOpen },
    { title: "Reports", url: "/analytics", icon: ClipboardList },
  ],
  student: [
    { title: "Dashboard", url: "/student", icon: LayoutDashboard },
    { title: "Attendance", url: "/attendance", icon: CalendarCheck },
    { title: "Subjects", url: "/curriculum", icon: BookOpen },
    { title: "Grades", url: "/analytics", icon: GraduationCap },
  ],
  parent: [
    { title: "Dashboard", url: "/parent", icon: LayoutDashboard },
    { title: "Attendance", url: "/attendance", icon: CalendarCheck },
    { title: "Performance", url: "/analytics", icon: BarChart3 },
    { title: "Messages", url: "/parent/messages", icon: MessageSquare },
  ],
};

const AppSidebar = ({ role, open, onClose }: AppSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const items = menuByRole[role];

  return (
    <>
      {/* Overlay on mobile */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-accent-foreground">SmartEdu</h1>
            <p className="text-[10px] text-sidebar-foreground/60 capitalize">{role} Portal</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === `/${role}`}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeClassName="bg-sidebar-accent text-sidebar-primary"
              onClick={onClose}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          <button 
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            onClick={() => {
              navigate("/admin/settings");
              onClose?.();
            }}
          >
            <UserCircle className="h-4.5 w-4.5" />
            <span>Profile</span>
          </button>
          <button
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            onClick={() => navigate("/login")}
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
