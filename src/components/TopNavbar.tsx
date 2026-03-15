import { Bell, Search, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getUser } from "@/lib/api";

interface TopNavbarProps {
  onMenuClick?: () => void;
  role?: string;
}

const notifications = [
  { id: 1, title: "Low Attendance Alert", message: "Class 8-B below 75% threshold", time: "15 min" },
  { id: 2, title: "New Registration", message: "5 new students registered today", time: "1 hour" },
  { id: 3, title: "Report Ready", message: "Monthly analytics report generated", time: "2 hours" },
];

const TopNavbar = ({ onMenuClick, role = "Admin" }: TopNavbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getUser();
  const displayName = user?.email || role;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const handleNotificationClick = (notification: any) => {
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card px-4 shadow-sm">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search students, classes..." 
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 h-8 text-xs" 
          />
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                {notifications.length}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary" className="text-xs">{notifications.length} new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notif) => (
              <DropdownMenuItem 
                key={notif.id}
                className="flex flex-col items-start gap-1 py-2.5 px-3 cursor-pointer hover:bg-muted"
                onClick={() => handleNotificationClick(notif)}
              >
                <span className="font-medium text-sm">{notif.title}</span>
                <span className="text-xs text-muted-foreground">{notif.message}</span>
                <span className="text-xs text-muted-foreground/70 mt-1">{notif.time} ago</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-muted-foreground justify-center py-2">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2 h-8">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {role[0]}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start min-w-0">
                <span className="text-xs font-medium truncate">{role}</span>
                <span className="text-[10px] text-muted-foreground truncate max-w-24">
                  {displayName.split("@")[0]}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/settings")} className="cursor-pointer">
              <span className="flex items-center gap-2">
                Profile Settings
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-destructive cursor-pointer flex items-center gap-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavbar;
