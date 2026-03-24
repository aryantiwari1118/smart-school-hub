import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Search, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/admin');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          toast({ title: "Error", description: "Failed to load dashboard data.", variant: "destructive" });
        }
      } catch (err) {
        toast({ title: "Error", description: "Network error fetching dashboard data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  if (loading || !data) {
    return (
      <DashboardLayout role="admin">
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const { adminStats, recentActivity, attendanceTrendData, enrollmentData, usersTableData } = data;

  const handleExport = () => {
    const exportData = usersTableData.map((user: any) => ({
      "Name": user.name,
      "Email": user.email,
      "Role": user.role,
      "Class/Subject": user.class,
      "Status": user.status,
    }));
    
    exportToCSV("admin-dashboard-users", exportData);
    toast({
      title: "Export Complete",
      description: "Dashboard data exported to CSV successfully.",
    });
  };

  const handleAddUser = () => {
    navigate("/admin/users");
  };

  const filteredUsers = usersTableData.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of your institution's performance</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-1" /> Export</Button>
            <Button size="sm" onClick={handleAddUser}><Plus className="h-4 w-4 mr-1" /> Add User</Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStats.map((stat: any, i: number) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base">Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base">Enrollment by Level</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="students" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity + Users */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Activity */}
          <Card className="lg:col-span-1 animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((item: any) => (
                <div key={item.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    item.type === "success" ? "bg-success" : item.type === "warning" ? "bg-warning" : "bg-info"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.user} · {item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="lg:col-span-2 animate-slide-up">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">User Management</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-8 h-8 w-40 text-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden md:table-cell">Class</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{user.role}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{user.class}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Active" ? "default" : "secondary"} className="text-xs">
                              {user.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
