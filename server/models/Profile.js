import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },
    profilePicture: {
      type: String,
      default: null
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    address: {
      type: String,
      maxlength: 200,
      default: ''
    },
    city: {
      type: String,
      maxlength: 50,
      default: ''
    },
    state: {
      type: String,
      maxlength: 50,
      default: ''
    },
    country: {
      type: String,
      maxlength: 50,
      default: ''
    },
    pinCode: {
      type: String,
      maxlength: 20,
      default: ''
    },
    phoneAlternate: {
      type: String,
      maxlength: 15,
      default: ''
    },
    parentName: {
      type: String,
      maxlength: 100,
      default: ''
    },
    parentPhone: {
      type: String,
      maxlength: 15,
      default: ''
    },
    qualification: {
      type: String,
      maxlength: 100,
      default: ''
    },
    specialization: {
      type: String,
      maxlength: 100,
      default: ''
    },
    experience: {
      type: Number,
      default: 0
    },
    department: {
      type: String,
      maxlength: 100,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
