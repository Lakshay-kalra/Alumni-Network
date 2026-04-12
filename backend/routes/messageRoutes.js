const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Message = require('../models/Message');

const router = express.Router();

// Get conversation with a specific user
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ],
    }).sort('createdAt');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Save a new message (in addition to sockets we save via HTTP)
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      text,
    });

    const createdMessage = await message.save();
    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// List users the current user has chatted with
router.get('/conversations/list', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    }).populate('sender', 'name profilePicture').populate('receiver', 'name profilePicture');
    
    // Extract unique users
    const userMap = new Map();
    messages.forEach(msg => {
      let otherUser = msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender;
      if (otherUser && !userMap.has(otherUser._id.toString())) {
        userMap.set(otherUser._id.toString(), otherUser);
      }
    });

    res.json(Array.from(userMap.values()));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
