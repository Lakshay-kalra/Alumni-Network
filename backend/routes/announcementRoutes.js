const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const Announcement = require('../models/Announcement');

const router = express.Router();

// Get all announcements
router.get('/', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find().populate('author', 'name').sort({ isImportant: -1, createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin posts announcement
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, message, imageUrl, isImportant } = req.body;

    const announcement = new Announcement({
      title,
      message,
      imageUrl: imageUrl || '',
      isImportant: isImportant || false,
      author: req.user.id
    });

    const createdAnnouncement = await announcement.save();
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
