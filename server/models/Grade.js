import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    score: {
      type: Number,
    },
    grade: {
      type: String,
    },
    type: {
      type: String,
      enum: ['quiz', 'assignment', 'exam', 'overall'],
      default: 'overall',
    },
  },
  { timestamps: true }
);

const Grade = mongoose.model('Grade', gradeSchema);
export default Grade;
