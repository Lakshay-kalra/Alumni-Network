const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  isImportant: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // typically an admin
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
