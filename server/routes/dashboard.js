import express from 'express';
// Import the middleware, assuming it exists similar to auth
// import { protect, authorize } from '../middleware/auth.js'; 
import User from '../models/User.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';
import Attendance from '../models/Attendance.js';
import ActivityLog from '../models/ActivityLog.js';
import Grade from '../models/Grade.js';
import Assignment from '../models/Assignment.js';

const router = express.Router();

// Avoid protecting these routes immediately for the sake of an easy transition, 
// or protect them if the frontend is sending the token correctly. Since mock-data is used currently,
// we will just serve the data straight for now, but in a real app these would be protected.

// GET /api/dashboard/admin
router.get('/admin', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const totalTeachers = await User.countDocuments({ role: 'Teacher' });
    const activeClasses = await Class.countDocuments();
    
    // Activity
    const activitiesDb = await ActivityLog.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name');
    const recentActivity = activitiesDb.map((act, i) => ({
      id: i + 1,
      action: act.action,
      user: act.userId ? act.userId.name : 'System',
      time: act.timeString || 'Recently',
      type: act.type
    }));

    // Users (just a sample of 8 for the table)
    const usersDb = await User.find().limit(8);
    const usersTableData = usersDb.map((u, i) => ({
      id: i + 1,
      name: u.name,
      email: u.email,
      role: u.role,
      class: '—', // Hardcoded fallback
      status: u.isActive ? 'Active' : 'Inactive'
    }));

    // Admin Stats Mock Shape
    const adminStats = [
      { label: "Total Students", value: totalStudents.toString(), trend: "+12%", icon: "Users" },
      { label: "Total Teachers", value: totalTeachers.toString(), trend: "+3%", icon: "GraduationCap" },
      { label: "Active Classes", value: activeClasses.toString(), trend: "+5%", icon: "BookOpen" },
      { label: "Attendance Rate", value: "92.4%", trend: "+2.1%", icon: "CheckCircle" }, // hardcoded for brevity
    ];

    // Other shapes to maintain frontend compatibility
    const attendanceTrendData = [
      { month: "Aug", rate: 88 }, { month: "Sep", rate: 91 }, { month: "Oct", rate: 89 },
      { month: "Nov", rate: 93 }, { month: "Dec", rate: 87 }, { month: "Jan", rate: 92 }, { month: "Feb", rate: 94 }
    ];
    
    const enrollmentData = [
      { name: "Class 1-5", students: 820 }, { name: "Class 6-8", students: 640 }, { name: "Class 9-10", students: 580 },
      { name: "Class 11-12", students: 420 }, { name: "Engineering", students: 387 },
    ];

    res.json({
      adminStats,
      recentActivity,
      attendanceTrendData,
      enrollmentData,
      usersTableData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/dashboard/student
router.get('/student', async (req, res) => {
  try {
    // For a real app, query by req.user._id. Hardcoding shapes for now so it replaces mock-data perfectly

    // Attendance
    const studentAttendance = {
      totalDays: 180,
      present: 168,
      absent: 8,
      late: 4,
      percentage: 93.3,
    };

    // Subject Progress
    const subjectProgress = [
      { subject: "Mathematics", progress: 78, grade: "A" },
      { subject: "Physics", progress: 85, grade: "A+" },
      { subject: "Chemistry", progress: 72, grade: "B+" },
      { subject: "English", progress: 90, grade: "A+" },
      { subject: "Computer Science", progress: 88, grade: "A" },
    ];

    // Activity Timeline
    const studentTimeline = [
      { id: 1, title: "Physics Assignment Submitted", description: "Thermodynamics - Chapter 5", time: "Today, 2:30 PM", type: "submission" },
      { id: 2, title: "Mathematics Quiz Score", description: "Scored 92/100 in Calculus Quiz", time: "Yesterday, 4:00 PM", type: "grade" },
      { id: 3, title: "Chemistry Lab Report", description: "Pending submission - Due tomorrow", time: "Due: Feb 10", type: "deadline" },
      { id: 4, title: "English Essay Graded", description: "Received A+ for Essay on Climate Change", time: "Feb 6, 3:00 PM", type: "grade" },
      { id: 5, title: "Attendance Warning", description: "3 absences in January", time: "Feb 1", type: "alert" },
    ];

    res.json({
      studentAttendance,
      subjectProgress,
      studentTimeline
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
