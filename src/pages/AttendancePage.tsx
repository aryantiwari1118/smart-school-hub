import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { attendanceStudentList, calendarAttendance, classAttendanceSummary } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Save, Calendar as CalendarIcon, Users, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, storage } from "@/lib/utils";

interface StudentAttendance {
  id: number;
  name: string;
  rollNo: string;
  status: "present" | "absent" | "late";
}

interface AttendanceRecord {
  date: string;
  class: string;
  students: StudentAttendance[];
}

const AttendancePage = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState("10-A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentAttendance[]>(attendanceStudentList);
  const [records, setRecords] = useState<AttendanceRecord[]>(() => 
    storage.get("attendanceRecords", []) || []
  );

  const presentCount = students.filter(s => s.status === "present").length;
  const absentCount = students.filter(s => s.status === "absent").length;
  const lateCount = students.filter(s => s.status === "late").length;
  const attendanceRate = students.length > 0 ? ((presentCount / students.length) * 100).toFixed(1) : 0;

  const toggleStatus = (id: number) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === id) {
          const statuses: ("present" | "absent" | "late")[] = ["present", "absent", "late"];
          const currentIndex = statuses.indexOf(s.status);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(s => ({ ...s, status: "present" as const })));
    toast({
      title: "All Marked Present",
      description: `All ${students.length} students marked as present.`,
    });
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(s => ({ ...s, status: "absent" as const })));
    toast({
      title: "All Marked Absent",
      description: `All ${students.length} students marked as absent.`,
    });
  };

  const handleSave = () => {
    const newRecord: AttendanceRecord = {
      date: selectedDate,
      class: selectedClass,
      students: [...students],
    };
    
    const existingIndex = records.findIndex(r => r.date === selectedDate && r.class === selectedClass);
    let updatedRecords: AttendanceRecord[];
    
    if (existingIndex >= 0) {
      updatedRecords = records.map((r, i) => i === existingIndex ? newRecord : r);
      toast({
        title: "Attendance Updated",
        description: `Attendance for Class ${selectedClass} on ${selectedDate} has been updated.`,
      });
    } else {
      updatedRecords = [...records, newRecord];
      toast({
        title: "Attendance Saved",
        description: `Attendance for Class ${selectedClass} on ${selectedDate} has been saved successfully.`,
      });
    }
    
    setRecords(updatedRecords);
    storage.set("attendanceRecords", updatedRecords);
  };

  const handleExport = () => {
    const exportData = students.map(s => ({
      "Roll No": s.rollNo,
      "Student Name": s.name,
      "Date": selectedDate,
      "Class": selectedClass,
      "Status": s.status.charAt(0).toUpperCase() + s.status.slice(1),
    }));
    
    exportToCSV(`attendance-${selectedClass}-${selectedDate}`, exportData);
    toast({
      title: "Export Complete",
      description: "Attendance data exported to CSV successfully.",
    });
  };

  const handleDateChange = (direction: "prev" | "next") => {
    const date = new Date(selectedDate);
    if (direction === "prev") {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "present": return "bg-success/10 text-success";
      case "absent": return "bg-destructive/10 text-destructive";
      case "late": return "bg-warning/10 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
            <p className="text-sm text-muted-foreground">Mark and manage attendance records</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExport} className="gap-1">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button size="sm" onClick={handleSave} className="gap-1">
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-lg font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-lg font-bold">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 flex items-center gap-3">
              <XCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-lg font-bold">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-warning" />
              <div>
                <p className="text-lg font-bold">{lateCount}</p>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Marking UI */}
          <Card className="lg:col-span-2 animate-slide-up">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-base">Mark Attendance</CardTitle>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full sm:w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10-A">Class 10-A</SelectItem>
                    <SelectItem value="9-B">Class 9-B</SelectItem>
                    <SelectItem value="12-A">Class 12-A</SelectItem>
                    <SelectItem value="8-C">Class 8-C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={markAllPresent} className="text-xs">
                  Mark All Present
                </Button>
                <Button size="sm" variant="outline" onClick={markAllAbsent} className="text-xs">
                  Mark All Absent
                </Button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                      student.status === "present" ? "bg-success/5 border-success/30" :
                      student.status === "absent" ? "bg-destructive/5 border-destructive/30" :
                      "bg-warning/5 border-warning/30"
                    }`}
                    onClick={() => toggleStatus(student.id)}
                  >
                    <Checkbox
                      checked={student.status === "present"}
                      className={`${getStatusColor(student.status).split(' ')[0]}`}
                      readOnly
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">Roll No: {student.rollNo}</p>
                    </div>
                    <Badge
                      className={`text-xs capitalize shrink-0 ${getStatusColor(student.status)}`}
                      variant="outline"
                    >
                      {getStatusLabel(student.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date & Calendar */}
          <Card className="animate-slide-up space-y-4">
            <CardHeader>
              <CardTitle className="text-base">Date & History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Navigation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDateChange("prev")}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-md border border-input bg-background text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDateChange("next")}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Attendance Rate: {attendanceRate}%
                </p>
              </div>

              {/* Recent Records */}
              <div className="pt-2 border-t">
                <p className="text-xs font-medium mb-2 text-muted-foreground">Recent Records</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {records.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No saved records yet</p>
                  ) : (
                    records.slice(-5).reverse().map((record, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-md bg-muted/50 text-xs hover:bg-muted cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-medium">{record.class}</p>
                            <p className="text-muted-foreground">{record.date}</p>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {record.students.filter(s => s.status === "present").length}/{record.students.length}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;
