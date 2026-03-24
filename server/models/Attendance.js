import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'holiday'],
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance for the same student on the same day
attendanceSchema.index({ date: 1, studentId: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
