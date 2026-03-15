import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { syllabusData, activityUploads } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, CheckCircle, Clock, AlertCircle, BookOpen, Filter, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storage, exportToCSV } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Activity {
  id: number;
  title: string;
  subject: string;
  uploadDate: string;
  status: "completed" | "pending" | "overdue";
  submissions: number;
  dueDate?: string;
  description?: string;
  fileName?: string;
}

const statusColor = {
  "on-track": "text-success bg-success/10",
  "behind": "text-destructive bg-destructive/10",
  "ahead": "text-primary bg-primary/10",
};

const CurriculumPage = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState<{ title: string; subject: string; dueDate: string; file?: File | null }>({ title: "", subject: "", dueDate: "", file: null });
  const [activities, setActivities] = useState<Activity[]>(() => 
    storage.get("curriculumActivities", activityUploads) || activityUploads
  );

  useEffect(() => {
    storage.set("curriculumActivities", activities);
  }, [activities]);

  const handleUploadActivity = () => {
    if (!newActivity.title || !newActivity.subject) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive" as const,
      });
      return;
    }

    const activity: Activity = {
      id: Math.max(...activities.map(a => a.id), 0) + 1,
      title: newActivity.title,
      subject: newActivity.subject,
      uploadDate: new Date().toISOString().split('T')[0],
      status: "pending" as const,
      submissions: 0,
      dueDate: newActivity.dueDate,
      description: `Activity uploaded for ${newActivity.subject}`,
      fileName: newActivity.file?.name || "",
    };

    setActivities([...activities, activity]);
    setNewActivity({ title: "", subject: "", dueDate: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Activity Uploaded",
      description: `${newActivity.title} has been uploaded successfully.`,
    });
  };

  const handleDeleteActivity = (id: number) => {
    const activity = activities.find(a => a.id === id);
    setActivities(activities.filter(a => a.id !== id));
    toast({
      title: "Activity Deleted",
      description: `${activity?.title} has been deleted.`,
      variant: "destructive" as const,
    });
  };

  const handleExport = () => {
    const exportData = filteredActivities.map(a => ({
      "Title": a.title,
      "Subject": a.subject,
      "Upload Date": a.uploadDate,
      "Due Date": a.dueDate || "N/A",
      "Status": a.status,
      "Submissions": a.submissions,
    }));
    
    exportToCSV("curriculum-activities", exportData);
    toast({
      title: "Export Complete",
      description: "Activity data exported to CSV successfully.",
    });
  };

  const filteredActivities = selectedSubject === "all" 
    ? activities 
    : activities.filter(a => a.subject === selectedSubject);

  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.status === "completed").length;
  const overdueActivities = activities.filter(a => a.status === "overdue").length;
  const avgSubmissions = totalActivities > 0 
    ? Math.round(activities.reduce((sum, a) => sum + a.submissions, 0) / totalActivities)
    : 0;

  const subjects = Array.from(new Set(activities.map(a => a.subject)));

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Curriculum Management</h1>
            <p className="text-sm text-muted-foreground">Track syllabus progress and manage activities</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-32 h-8">
                <Filter className="h-3.5 w-3.5 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={handleExport} className="gap-1">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Upload className="h-4 w-4" /> Upload Activity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload New Activity</DialogTitle>
                  <DialogDescription>
                    Create a new curriculum activity for your students
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Activity Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Calculus Worksheet Set 4"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={newActivity.subject} onValueChange={(value) => setNewActivity({...newActivity, subject: value})}>
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
                      value={newActivity.dueDate}
                      onChange={(e) => setNewActivity({...newActivity, dueDate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Attachment</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setNewActivity({...newActivity, file: e.target.files?.[0] || null})}
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUploadActivity}>
                      Upload Activity
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Completion Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-primary">{totalActivities}</p>
              <p className="text-xs text-muted-foreground">Total Activities</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-success">{completedActivities}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-warning">{avgSubmissions}</p>
              <p className="text-xs text-muted-foreground">Avg Submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-destructive">{overdueActivities}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
        </div>

        {/* Syllabus Tracker */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Syllabus Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {syllabusData.map((item) => (
              <div key={item.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.chapter} · Due: {item.dueDate}</p>
                  </div>
                  <Badge className={`text-xs capitalize ${statusColor[item.status]}`} variant="outline">
                    {item.status.replace("-", " ")}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={item.progress} className="h-2 flex-1" />
                  <span className="text-sm font-semibold text-primary">{item.progress}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity Uploads */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">
              Activity Uploads {selectedSubject !== "all" && `- ${selectedSubject}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No activities found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredActivities.map((item) => (
                  <div key={item.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                        item.status === "completed" ? "bg-success/10" : item.status === "pending" ? "bg-warning/10" : "bg-destructive/10"
                      }`}>
                        {item.status === "completed" ? <CheckCircle className="h-4 w-4 text-success" /> :
                         item.status === "pending" ? <Clock className="h-4 w-4 text-warning" /> :
                         <AlertCircle className="h-4 w-4 text-destructive" />}
                      </div>
                      <div className="flex gap-1">
                        <Badge
                          variant={item.status === "completed" ? "default" : item.status === "pending" ? "secondary" : "destructive"}
                          className="text-xs capitalize"
                        >
                          {item.status}
                        </Badge>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{item.title}&quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-2 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDeleteActivity(item.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.subject} · {item.uploadDate}</p>
                    {item.fileName && (
                      <p className="text-xs text-muted-foreground mt-1">File: {item.fileName}</p>
                    )}
                      {item.dueDate && (
                        <p className="text-xs text-muted-foreground mt-1">Due: {item.dueDate}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.submissions} submissions</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CurriculumPage;
