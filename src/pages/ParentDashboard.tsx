import DashboardLayout from "@/components/DashboardLayout";
import { studentAttendance, subjectProgress, parentNotifications, parentMessages } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, AlertTriangle, Info, MessageSquare, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/utils";

const notiIcon = {
  success: <CheckCircle className="h-4 w-4 text-success" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
  info: <Info className="h-4 w-4 text-info" />,
};

const ParentDashboard = () => {
  const { toast } = useToast();

  const handleExport = () => {
    const exportData = [
      {
        "Metric": "Attendance",
        "Value": `${studentAttendance.percentage}%`,
        "Present": studentAttendance.present,
        "Absent": studentAttendance.absent,
      },
      ...subjectProgress.map(s => ({
        "Metric": s.subject,
        "Value": `${s.progress}%`,
        "Grade": s.grade,
      })),
    ];
    
    exportToCSV("parent-dashboard", exportData);
    toast({
      title: "Export Complete",
      description: "Your child's dashboard data has been exported.",
    });
  };

  return (
    <DashboardLayout role="parent">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Parent Dashboard</h1>
            <p className="text-sm text-muted-foreground">Monitoring: Priya Sharma · Class 10-A</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleExport} className="gap-1">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Attendance Overview */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="text-base">Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="relative inline-flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="10"
                    strokeDasharray={`${studentAttendance.percentage * 3.14} ${314 - studentAttendance.percentage * 3.14}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-2xl font-bold">{studentAttendance.percentage}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-semibold text-success">{studentAttendance.present}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-destructive">{studentAttendance.absent}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-warning">{studentAttendance.late}</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card className="lg:col-span-2 animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base">Subject Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectProgress.map((sub) => (
                <div key={sub.subject} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{sub.subject}</span>
                    <Badge variant="outline" className="text-xs">{sub.grade}</Badge>
                  </div>
                  <Progress value={sub.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Notifications */}
          <Card className="animate-slide-up">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {parentNotifications.filter(n => !n.read).length} new
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {parentNotifications.map((noti) => (
                <div key={noti.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  noti.read ? "bg-muted/30" : "bg-primary/5 border border-primary/10"
                }`}>
                  <div className="mt-0.5">{notiIcon[noti.type]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{noti.title}</p>
                    <p className="text-xs text-muted-foreground">{noti.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{noti.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="animate-slide-up">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Messages from Teachers
              </CardTitle>
              <Button size="sm" variant="outline">Reply</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {parentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{msg.from}</p>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-xs font-medium text-primary">{msg.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{msg.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
