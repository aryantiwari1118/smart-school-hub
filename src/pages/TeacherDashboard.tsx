import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { teacherSchedule, classAttendanceSummary, activityUploads } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Upload, Clock, CheckCircle, AlertCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const statusIcon = {
  completed: <CheckCircle className="h-4 w-4 text-success" />,
  "in-progress": <PlayCircle className="h-4 w-4 text-primary" />,
  upcoming: <Clock className="h-4 w-4 text-muted-foreground" />,
};

const TeacherDashboard = () => {
  const { toast } = useToast();

  // assignments/activities state for teacher uploads
  const [uploads, setUploads] = useState<typeof activityUploads>(activityUploads);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newUpload, setNewUpload] = useState<{
    title: string;
    subject: string;
    dueDate?: string;
    file?: File | null;
  }>({ title: "", subject: "", dueDate: "", file: null });

  const handleUploadAssignment = () => {
    if (!newUpload.title || !newUpload.subject) {
      toast({
        title: "Missing Fields",
        description: "Please fill in title and subject before uploading.",
        variant: "destructive" as const,
      });
      return;
    }

    const nextId = Math.max(...uploads.map(u => u.id), 0) + 1;
    const uploadDate = new Date().toISOString().split("T")[0];
    const item = {
      id: nextId,
      title: newUpload.title,
      subject: newUpload.subject,
      uploadDate,
      status: "pending" as const,
      submissions: 0,
      dueDate: newUpload.dueDate,
      description: newUpload.title,
      fileName: newUpload.file?.name || "",
    };

    setUploads([...uploads, item]);
    setNewUpload({ title: "", subject: "", dueDate: "", file: null });
    setIsUploadDialogOpen(false);

    toast({
      title: "Assignment Uploaded",
      description: `${item.title} has been uploaded successfully.`,
    });
  };

  const handleExport = () => {
    const exportData = classAttendanceSummary.map(cls => ({
      "Class": cls.class,
      "Total Students": cls.total,
      "Present": cls.present,
      "Absent": cls.absent,
      "Attendance Rate": `${cls.rate}%`,
    }));
    
    exportToCSV("teacher-dashboard", exportData);
    toast({
      title: "Export Complete",
      description: "Class attendance data exported to CSV successfully.",
    });
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
            <p className="text-sm text-muted-foreground">Good morning, Mr. Rajesh Kumar</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExport} className="gap-1">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button className="gap-2">
              <PlayCircle className="h-4 w-4" /> Start Attendance
            </Button>
          </div>
        </div>

        {/* Today's Schedule */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teacherSchedule.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  {statusIcon[item.status]}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{item.subject}</span>
                      <Badge variant="outline" className="text-xs">{item.class}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.time} · {item.room}</p>
                  </div>
                  <Badge
                    variant={item.status === "completed" ? "default" : item.status === "in-progress" ? "default" : "secondary"}
                    className="text-xs capitalize shrink-0"
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Class Attendance Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classAttendanceSummary.map((cls) => (
            <Card key={cls.class} className="animate-scale-in">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">Class {cls.class}</span>
                  <span className="text-lg font-bold text-primary">{cls.rate}%</span>
                </div>
                <Progress value={cls.rate} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Present: {cls.present}</span>
                  <span>Absent: {cls.absent}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Uploads */}
        <Card className="animate-slide-up">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Curriculum Activities</CardTitle>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Upload className="h-3.5 w-3.5" /> Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload New Assignment</DialogTitle>
                  <DialogDescription>
                    Provide assignment details and attach a file
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Assignment name"
                      value={newUpload.title}
                      onChange={(e) => setNewUpload({ ...newUpload, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={newUpload.subject} onValueChange={(value) => setNewUpload({ ...newUpload, subject: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newUpload.dueDate || ""}
                      onChange={(e) => setNewUpload({ ...newUpload, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">Attachment</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setNewUpload({ ...newUpload, file: e.target.files?.[0] || null })}
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUploadAssignment}>
                      Upload
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploads.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    item.status === "completed" ? "bg-success/10" : item.status === "pending" ? "bg-warning/10" : "bg-destructive/10"
                  }`}>
                    {item.status === "completed" ? <CheckCircle className="h-4 w-4 text-success" /> :
                     item.status === "pending" ? <Clock className="h-4 w-4 text-warning" /> :
                     <AlertCircle className="h-4 w-4 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.subject} · {item.uploadDate}</p>
                    {item.fileName && (
                      <p className="text-xs text-muted-foreground mt-1">File: {item.fileName}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <Badge
                      variant={item.status === "completed" ? "default" : item.status === "pending" ? "secondary" : "destructive"}
                      className="text-xs capitalize"
                    >
                      {item.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{item.submissions} submissions</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
