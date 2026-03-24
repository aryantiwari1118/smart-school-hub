import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FileText, Award, Clock, AlertTriangle, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/utils";
import { useState, useEffect } from "react";

const timelineIcon: Record<string, any> = {
  submission: <FileText className="h-4 w-4 text-primary" />,
  grade: <Award className="h-4 w-4 text-success" />,
  deadline: <Clock className="h-4 w-4 text-warning" />,
  alert: <AlertTriangle className="h-4 w-4 text-destructive" />,
};

const StudentDashboard = () => {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/student');
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
      <DashboardLayout role="student">
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const { studentAttendance, subjectProgress, studentTimeline } = data;

  const donutData = [
    { name: "Present", value: studentAttendance.present, color: "hsl(var(--success))" },
    { name: "Absent", value: studentAttendance.absent, color: "hsl(var(--destructive))" },
    { name: "Late", value: studentAttendance.late, color: "hsl(var(--warning))" },
  ];

  const handleExport = () => {
    const exportData = [
      {
        "Metric": "Attendance",
        "Value": `${studentAttendance.percentage}%`,
        "Present": studentAttendance.present,
        "Absent": studentAttendance.absent,
        "Late": studentAttendance.late,
      },
      ...subjectProgress.map((s: any) => ({
        "Metric": s.subject,
        "Value": `${s.progress}%`,
        "Grade": s.grade,
      })),
    ];
    
    exportToCSV("student-dashboard", exportData);
    toast({
      title: "Export Complete",
      description: "Your dashboard data has been exported to CSV.",
    });
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Alex Student · Class 10-A</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleExport} className="gap-1">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Attendance Donut */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="text-base">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {donutData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{studentAttendance.percentage}%</p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-success" /> Present: {studentAttendance.present}</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-destructive" /> Absent: {studentAttendance.absent}</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-warning" /> Late: {studentAttendance.late}</span>
              </div>
            </CardContent>
          </Card>

          {/* Subject Progress */}
          <Card className="lg:col-span-2 animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base">Subject-wise Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectProgress.map((sub: any) => (
                <div key={sub.subject} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{sub.subject}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{sub.grade}</Badge>
                      <span className="text-sm font-semibold text-primary">{sub.progress}%</span>
                    </div>
                  </div>
                  <Progress value={sub.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentTimeline.map((item: any) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                    {timelineIcon[item.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
