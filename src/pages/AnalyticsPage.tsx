import DashboardLayout from "@/components/DashboardLayout";
import { attendanceTrendData, performanceDistribution, riskStudents } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertTriangle, Users, Award } from "lucide-react";

const AnalyticsPage = () => {
  const totalStudents = performanceDistribution.reduce((sum, d) => sum + d.students, 0);
  const atRisk = riskStudents.length;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Insights</h1>
          <p className="text-sm text-muted-foreground">AI-powered analytics and risk predictions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="animate-scale-in">
            <CardContent className="pt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">92.4%</p>
                <p className="text-xs text-muted-foreground">Avg Attendance</p>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-scale-in">
            <CardContent className="pt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xl font-bold">78.5%</p>
                <p className="text-xs text-muted-foreground">Avg Performance</p>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-scale-in">
            <CardContent className="pt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-xl font-bold">{totalStudents}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-scale-in">
            <CardContent className="pt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xl font-bold">{atRisk}</p>
                <p className="text-xs text-muted-foreground">At-Risk Students</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base">Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base">Performance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={performanceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="students" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Risk Prediction */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Risk Prediction — Students Below 75% Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-4 p-3 rounded-lg border hover:shadow-sm transition-shadow">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${
                    student.risk === "high" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                  }`}>
                    {student.attendance}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">Class {student.class} · Grade: {student.grade}</p>
                  </div>
                  <Badge
                    variant={student.risk === "high" ? "destructive" : "secondary"}
                    className="text-xs capitalize"
                  >
                    {student.risk} risk
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
