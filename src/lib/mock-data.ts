// Mock data for the Smart Curriculum Activity & Attendance System

export const adminStats = [
  { label: "Total Students", value: "2,847", trend: "+12%", icon: "Users" as const },
  { label: "Total Teachers", value: "156", trend: "+3%", icon: "GraduationCap" as const },
  { label: "Active Classes", value: "84", trend: "+5%", icon: "BookOpen" as const },
  { label: "Attendance Rate", value: "92.4%", trend: "+2.1%", icon: "CheckCircle" as const },
];

export const recentActivity = [
  { id: 1, action: "New student registered", user: "Priya Sharma", time: "2 min ago", type: "info" as const },
  { id: 2, action: "Attendance marked for Class 10-A", user: "Mr. Rajesh Kumar", time: "15 min ago", type: "success" as const },
  { id: 3, action: "Curriculum updated for Physics", user: "Dr. Anita Verma", time: "1 hr ago", type: "info" as const },
  { id: 4, action: "Low attendance alert: Class 8-B", user: "System", time: "2 hrs ago", type: "warning" as const },
  { id: 5, action: "New teacher onboarded", user: "Admin", time: "3 hrs ago", type: "success" as const },
];

export const attendanceTrendData = [
  { month: "Aug", rate: 88 },
  { month: "Sep", rate: 91 },
  { month: "Oct", rate: 89 },
  { month: "Nov", rate: 93 },
  { month: "Dec", rate: 87 },
  { month: "Jan", rate: 92 },
  { month: "Feb", rate: 94 },
];

export const enrollmentData = [
  { name: "Class 1-5", students: 820 },
  { name: "Class 6-8", students: 640 },
  { name: "Class 9-10", students: 580 },
  { name: "Class 11-12", students: 420 },
  { name: "Engineering", students: 387 },
];

export const usersTableData = [
  { id: 1, name: "Priya Sharma", email: "priya@school.edu", role: "Student", class: "10-A", status: "Active" },
  { id: 2, name: "Rajesh Kumar", email: "rajesh@school.edu", role: "Teacher", class: "Mathematics", status: "Active" },
  { id: 3, name: "Anita Verma", email: "anita@school.edu", role: "Teacher", class: "Physics", status: "Active" },
  { id: 4, name: "Arjun Patel", email: "arjun@school.edu", role: "Student", class: "12-B", status: "Inactive" },
  { id: 5, name: "Meera Nair", email: "meera@school.edu", role: "Parent", class: "—", status: "Active" },
  { id: 6, name: "Vikram Singh", email: "vikram@school.edu", role: "Student", class: "9-C", status: "Active" },
  { id: 7, name: "Sneha Das", email: "sneha@school.edu", role: "Teacher", class: "Chemistry", status: "Active" },
  { id: 8, name: "Amit Gupta", email: "amit@school.edu", role: "Admin", class: "—", status: "Active" },
];

export const teacherSchedule = [
  { id: 1, time: "8:00 AM", subject: "Mathematics", class: "10-A", room: "Room 201", status: "completed" as const },
  { id: 2, time: "9:00 AM", subject: "Mathematics", class: "9-B", room: "Room 105", status: "in-progress" as const },
  { id: 3, time: "10:30 AM", subject: "Advanced Math", class: "12-A", room: "Room 301", status: "upcoming" as const },
  { id: 4, time: "12:00 PM", subject: "Mathematics", class: "8-C", room: "Room 102", status: "upcoming" as const },
  { id: 5, time: "2:00 PM", subject: "Statistics", class: "11-B", room: "Lab 3", status: "upcoming" as const },
];

export const classAttendanceSummary = [
  { class: "10-A", total: 45, present: 42, absent: 3, rate: 93.3 },
  { class: "9-B", total: 40, present: 36, absent: 4, rate: 90.0 },
  { class: "12-A", total: 35, present: 33, absent: 2, rate: 94.3 },
  { class: "8-C", total: 48, present: 44, absent: 4, rate: 91.7 },
];

export const studentAttendance = {
  totalDays: 180,
  present: 168,
  absent: 8,
  late: 4,
  percentage: 93.3,
};

export const subjectProgress = [
  { subject: "Mathematics", progress: 78, grade: "A" },
  { subject: "Physics", progress: 85, grade: "A+" },
  { subject: "Chemistry", progress: 72, grade: "B+" },
  { subject: "English", progress: 90, grade: "A+" },
  { subject: "Computer Science", progress: 88, grade: "A" },
];

export const studentTimeline = [
  { id: 1, title: "Physics Assignment Submitted", description: "Thermodynamics - Chapter 5", time: "Today, 2:30 PM", type: "submission" as const },
  { id: 2, title: "Mathematics Quiz Score", description: "Scored 92/100 in Calculus Quiz", time: "Yesterday, 4:00 PM", type: "grade" as const },
  { id: 3, title: "Chemistry Lab Report", description: "Pending submission - Due tomorrow", time: "Due: Feb 10", type: "deadline" as const },
  { id: 4, title: "English Essay Graded", description: "Received A+ for Essay on Climate Change", time: "Feb 6, 3:00 PM", type: "grade" as const },
  { id: 5, title: "Attendance Warning", description: "3 absences in January", time: "Feb 1", type: "alert" as const },
];

export const parentNotifications = [
  { id: 1, title: "Attendance Alert", message: "Your child was absent on Feb 5th", time: "2 hrs ago", read: false, type: "warning" as const },
  { id: 2, title: "Grade Update", message: "Priya scored 92/100 in Math Quiz", time: "Yesterday", read: false, type: "success" as const },
  { id: 3, title: "Message from Teacher", message: "Mr. Kumar: Please check homework completion", time: "2 days ago", read: true, type: "info" as const },
  { id: 4, title: "Fee Reminder", message: "Second term fee due by Feb 15", time: "3 days ago", read: true, type: "warning" as const },
];

export const parentMessages = [
  { id: 1, from: "Mr. Rajesh Kumar", subject: "Mathematics Performance", message: "Priya is doing well in class but needs to practice more problems.", time: "Feb 7", avatar: "RK" },
  { id: 2, from: "Dr. Anita Verma", subject: "Physics Lab", message: "Excellent work on the recent lab experiment. Keep it up!", time: "Feb 5", avatar: "AV" },
  { id: 3, from: "Mrs. Sneha Das", subject: "Chemistry Homework", message: "Please ensure the assignment is submitted by Friday.", time: "Feb 3", avatar: "SD" },
];

export const attendanceStudentList = [
  { id: 1, name: "Aarav Mehta", rollNo: "001", status: "present" as const },
  { id: 2, name: "Bhavya Singh", rollNo: "002", status: "present" as const },
  { id: 3, name: "Chitra Reddy", rollNo: "003", status: "absent" as const },
  { id: 4, name: "Dhruv Patel", rollNo: "004", status: "present" as const },
  { id: 5, name: "Esha Gupta", rollNo: "005", status: "present" as const },
  { id: 6, name: "Farhan Khan", rollNo: "006", status: "late" as const },
  { id: 7, name: "Gauri Sharma", rollNo: "007", status: "present" as const },
  { id: 8, name: "Harsh Joshi", rollNo: "008", status: "present" as const },
  { id: 9, name: "Isha Nair", rollNo: "009", status: "absent" as const },
  { id: 10, name: "Jay Desai", rollNo: "010", status: "present" as const },
];

export const calendarAttendance: Record<string, "present" | "absent" | "late" | "holiday"> = {
  "2026-02-02": "present",
  "2026-02-03": "present",
  "2026-02-04": "present",
  "2026-02-05": "absent",
  "2026-02-06": "present",
  "2026-02-07": "holiday",
  "2026-02-08": "holiday",
  "2026-02-09": "present",
};

export const syllabusData = [
  { id: 1, subject: "Mathematics", chapter: "Calculus", progress: 85, status: "on-track" as const, dueDate: "Mar 15" },
  { id: 2, subject: "Physics", chapter: "Electromagnetism", progress: 60, status: "on-track" as const, dueDate: "Mar 20" },
  { id: 3, subject: "Chemistry", chapter: "Organic Chemistry", progress: 45, status: "behind" as const, dueDate: "Feb 28" },
  { id: 4, subject: "English", chapter: "Shakespeare Studies", progress: 92, status: "ahead" as const, dueDate: "Apr 1" },
  { id: 5, subject: "Computer Science", chapter: "Data Structures", progress: 70, status: "on-track" as const, dueDate: "Mar 25" },
];

export const activityUploads = [
  { id: 1, title: "Calculus Worksheet Set 4", subject: "Mathematics", uploadDate: "Feb 8", status: "completed" as const, submissions: 42, fileName: "", description: "Calculus worksheets" },
  { id: 2, title: "EM Wave Experiment", subject: "Physics", uploadDate: "Feb 7", status: "pending" as const, submissions: 28, fileName: "", description: "Experiment instructions" },
  { id: 3, title: "Organic Reactions Quiz", subject: "Chemistry", uploadDate: "Feb 5", status: "overdue" as const, submissions: 15, fileName: "", description: "Quiz paper" },
  { id: 4, title: "Essay: Modern Literature", subject: "English", uploadDate: "Feb 9", status: "pending" as const, submissions: 0, fileName: "", description: "Essay prompt" },
  { id: 5, title: "Binary Search Implementation", subject: "Computer Science", uploadDate: "Feb 6", status: "completed" as const, submissions: 38, fileName: "", description: "Assignment code file" },
];

export const performanceDistribution = [
  { range: "90-100", students: 120, label: "Excellent" },
  { range: "80-89", students: 280, label: "Good" },
  { range: "70-79", students: 350, label: "Average" },
  { range: "60-69", students: 180, label: "Below Avg" },
  { range: "Below 60", students: 95, label: "At Risk" },
];

export const riskStudents = [
  { id: 1, name: "Chitra Reddy", class: "10-A", attendance: 62, grade: "D", risk: "high" as const },
  { id: 2, name: "Farhan Khan", class: "9-B", attendance: 71, grade: "C", risk: "medium" as const },
  { id: 3, name: "Isha Nair", class: "10-A", attendance: 58, grade: "D", risk: "high" as const },
  { id: 4, name: "Nikhil Jain", class: "12-B", attendance: 74, grade: "C+", risk: "medium" as const },
  { id: 5, name: "Pooja Agarwal", class: "8-C", attendance: 68, grade: "C", risk: "medium" as const },
];
