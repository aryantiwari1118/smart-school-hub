import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';
import Attendance from '../models/Attendance.js';
import Assignment from '../models/Assignment.js';
import Grade from '../models/Grade.js';
import ActivityLog from '../models/ActivityLog.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-school-hub';

const seedDashboards = async () => {
  try {
    console.log('Connecting to MongoDB...', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // 1. Clear existing Dashboard Data (DO NOT CLEAR USERS)
    console.log('Clearing old dashboard data...');
    await Class.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});
    await Assignment.deleteMany({});
    await Grade.deleteMany({});
    await ActivityLog.deleteMany({});

    // 2. Fetch Users to relate
    const admin = await User.findOne({ role: 'Admin' });
    const teacher = await User.findOne({ role: 'Teacher' });
    const student = await User.findOne({ role: 'Student' });
    
    if (!admin || !teacher || !student) {
      console.log('Database missing default users! Please start the server once to initialize default users.');
      process.exit(1);
    }

    // 3. Create Classes
    console.log('Seeding Classes...');
    const createdClasses = await Class.insertMany([
      { name: '10-A', capacity: 45 },
      { name: '9-B', capacity: 40 },
      { name: '12-A', capacity: 35 },
      { name: '8-C', capacity: 48 },
    ]);
    const class10A = createdClasses[0]._id;

    // 4. Create Subjects
    console.log('Seeding Subjects...');
    const createdSubjects = await Subject.insertMany([
      { name: 'Mathematics', classId: class10A, teacherId: teacher._id },
      { name: 'Physics', classId: class10A, teacherId: teacher._id },
      { name: 'Chemistry', classId: class10A, teacherId: teacher._id },
      { name: 'English', classId: class10A, teacherId: teacher._id },
      { name: 'Computer Science', classId: class10A, teacherId: teacher._id },
    ]);

    // 5. Create Attendance for Student
    console.log('Seeding Attendance...');
    // We'll just seed a realistic summary by making 168 present, 8 absent, 4 late? 
    // Actually, just a few recent logs to prove it works.
    await Attendance.create({
      date: new Date(),
      classId: class10A,
      studentId: student._id,
      status: 'present'
    });

    // 6. Create Grades (Subject Progress)
    console.log('Seeding Grades...');
    await Grade.insertMany([
      { studentId: student._id, subjectId: createdSubjects[0]._id, score: 78, grade: 'A', type: 'overall' },
      { studentId: student._id, subjectId: createdSubjects[1]._id, score: 85, grade: 'A+', type: 'overall' },
      { studentId: student._id, subjectId: createdSubjects[2]._id, score: 72, grade: 'B+', type: 'overall' },
      { studentId: student._id, subjectId: createdSubjects[3]._id, score: 90, grade: 'A+', type: 'overall' },
      { studentId: student._id, subjectId: createdSubjects[4]._id, score: 88, grade: 'A', type: 'overall' },
    ]);

    // 7. Activity Logs
    console.log('Seeding Activity Logs...');
    await ActivityLog.insertMany([
      { action: 'New student registered', targetUserId: student._id, timeString: '2 min ago', type: 'info' },
      { action: 'Attendance marked for Class 10-A', userId: teacher._id, timeString: '15 min ago', type: 'success' },
      { action: 'Curriculum updated for Physics', userId: teacher._id, timeString: '1 hr ago', type: 'info' },
      { action: 'Low attendance alert: Class 8-B', timeString: '2 hrs ago', type: 'warning' },
      { action: 'New teacher onboarded', userId: admin._id, timeString: '3 hrs ago', type: 'success' },
    ]);

    console.log('✅ Dashboard Data Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDashboards();
