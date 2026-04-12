const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Event = require('../models/Event');
const Message = require('../models/Message');

const router = express.Router();

// Get all events
router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find().populate('creator', 'name').sort('-date');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create event (Admin or Student/Alumni can create?)
router.post('/', protect, async (req, res) => {
  try {
    const payload = req.body;
    
    // Fallback `date` to `startDate` if available
    if (payload.startDate && !payload.date) payload.date = payload.startDate;

    const event = new Event({
      ...payload,
      creator: req.user.id
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Join Event
router.put('/:id/join', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      if (!event.attendees.includes(req.user.id)) {
        event.attendees.push(req.user.id);
        await event.save();

        // Send a notification to the user
        const notificationMsg = new Message({
          sender: event.creator,
          receiver: req.user.id,
          text: `Notification: You have successfully RSVP'd to the event "${event.title}". Please make sure to attend on time at ${event.location}.`
        });
        await notificationMsg.save();
      }
      res.json({ message: 'Joined event successfully' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
