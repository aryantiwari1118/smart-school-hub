import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    timeString: {
      type: String, // E.g. "2 min ago" for keeping mock parity for now
    }
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
