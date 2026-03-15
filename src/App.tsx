import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import AttendancePage from "./pages/AttendancePage";
import CurriculumPage from "./pages/CurriculumPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import MessagesPage from "./pages/MessagesPage";
import NotFound from "./pages/NotFound";
import { getUser, getAuthToken } from "@/lib/api";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ 
  element, 
  requiredRole 
}: { 
  element: React.ReactElement; 
  requiredRole: string 
}) => {
  const navigate = useNavigate();
  const user = getUser();
  const token = getAuthToken();

  useEffect(() => {
    // Check if user is authenticated and has correct role
    if (!token || !user) {
      navigate("/login", { replace: true });
      return;
    }

    // Check if user role matches required role
    if (user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
      // Redirect to user's correct dashboard
      navigate(`/${user.role?.toLowerCase()}`, { replace: true });
      return;
    }
  }, [user, token, requiredRole, navigate]);

  // If user exists and role matches, render the element
  if (token && user && user.role?.toLowerCase() === requiredRole.toLowerCase()) {
    return element;
  }

  // Otherwise return null (component will navigate away)
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin" 
            element={<ProtectedRoute element={<AdminDashboard />} requiredRole="Admin" />} 
          />
          <Route 
            path="/teacher" 
            element={<ProtectedRoute element={<TeacherDashboard />} requiredRole="Teacher" />} 
          />
          <Route 
            path="/student" 
            element={<ProtectedRoute element={<StudentDashboard />} requiredRole="Student" />} 
          />
          <Route 
            path="/parent" 
            element={<ProtectedRoute element={<ParentDashboard />} requiredRole="Parent" />} 
          />
          <Route 
            path="/attendance" 
            element={<ProtectedRoute element={<AttendancePage />} requiredRole="Teacher" />} 
          />
          <Route 
            path="/curriculum" 
            element={<ProtectedRoute element={<CurriculumPage />} requiredRole="Teacher" />} 
          />
          <Route 
            path="/analytics" 
            element={<ProtectedRoute element={<AnalyticsPage />} requiredRole="Admin" />} 
          />
          <Route 
            path="/admin/settings" 
            element={<ProtectedRoute element={<SettingsPage />} requiredRole="Admin" />} 
          />
          <Route 
            path="/admin/users" 
            element={<ProtectedRoute element={<UsersPage />} requiredRole="Admin" />} 
          />
          <Route 
            path="/parent/messages" 
            element={<ProtectedRoute element={<MessagesPage />} requiredRole="Parent" />} 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
