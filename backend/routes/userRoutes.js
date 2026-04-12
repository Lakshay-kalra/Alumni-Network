const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Get logical user profile
router.get('/profile/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('mentoredStudents', 'name email branch')
      .select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Profile
router.put('/profile/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure users can only update their own profile unless they are admin
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    user.name = req.body.name || user.name;
    user.branch = req.body.branch || user.branch;
    user.graduationYear = req.body.graduationYear || user.graduationYear;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;
    
    // Alumni fields
    if (req.body.contactNumber !== undefined) user.contactNumber = req.body.contactNumber;
    if (req.body.designation !== undefined) user.designation = req.body.designation;
    if (req.body.organisation !== undefined) user.organisation = req.body.organisation;
    if (req.body.personalMatchingInfo !== undefined) user.personalMatchingInfo = req.body.personalMatchingInfo;
    if (req.body.shortBio !== undefined) user.shortBio = req.body.shortBio;
    if (req.body.areaOfExpertise !== undefined) user.areaOfExpertise = req.body.areaOfExpertise;
    if (req.body.areasOfInterest !== undefined) user.areasOfInterest = req.body.areasOfInterest;
    if (req.body.mentoringStatus !== undefined) user.mentoringStatus = req.body.mentoringStatus;
    if (req.body.mentoredStudents !== undefined) user.mentoredStudents = req.body.mentoredStudents;

    if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;
    if (req.body.linkedin || req.body.github || req.body.twitter || req.body.linkedinProfile) {
      if (req.body.linkedinProfile) user.linkedinProfile = req.body.linkedinProfile;
      user.socialLinks = {
        linkedin: req.body.linkedin || req.body.linkedinProfile || user.socialLinks?.linkedin,
        github: req.body.github || user.socialLinks?.github,
        twitter: req.body.twitter || user.socialLinks?.twitter,
      };
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all users (Search & Discovery)
router.get('/', protect, async (req, res) => {
  try {
    const keyword = req.query.keyword ? {
      name: {
        $regex: req.query.keyword,
        $options: 'i'
      }
    } : {};
    
    // Check branch or graduationYear filters
    const filter = { ...keyword };
    if (req.query.branch) filter.branch = req.query.branch;
    if (req.query.graduationYear) filter.graduationYear = req.query.graduationYear;
    if (req.query.role) filter.role = req.query.role;

    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Toggle mentor student
router.post('/mentor/:studentId', protect, async (req, res) => {
  try {
    const alumni = await User.findById(req.user.id);
    const student = await User.findById(req.params.studentId);

    if (!alumni || alumni.role !== 'alumni') {
      return res.status(401).json({ message: 'Only alumni can mentor students' });
    }
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found or incompatible role' });
    }

    const isMentoring = alumni.mentoredStudents.some(id => id.toString() === student._id.toString());
    if (isMentoring) {
       alumni.mentoredStudents = alumni.mentoredStudents.filter(id => id.toString() !== student._id.toString());
    } else {
       alumni.mentoredStudents.push(student._id);
    }
    await alumni.save();
    
    // Return array of ids for simplicity parsing
    res.json(alumni.mentoredStudents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
