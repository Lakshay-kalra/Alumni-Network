const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin'], default: 'student' },
  contactNumber: { type: String, default: '' },
  linkedinProfile: { type: String, default: '' },
  designation: { type: String, default: '' },
  organisation: { type: String, default: '' },
  branch: { type: String },
  graduationYear: { type: Number },
  personalMatchingInfo: { type: String, default: '' },
  shortBio: { type: String, default: '' },
  areaOfExpertise: { type: String, default: '' },
  areasOfInterest: [{ type: String }],
  mentoringStatus: { type: String, enum: ['Available to Mentor', 'Currently Mentoring', 'Not Mentoring'], default: 'Not Mentoring' },
  mentoredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    twitter: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
