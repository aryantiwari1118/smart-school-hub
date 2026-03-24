import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      default: 40,
    },
  },
  { timestamps: true }
);

const Class = mongoose.model('Class', classSchema);
export default Class;
