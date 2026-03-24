import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue'],
      default: 'pending',
    },
    submissions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
