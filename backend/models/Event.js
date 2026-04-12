const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  club: { type: String, default: '' },
  eventType: { type: String, default: '' },
  status: { type: String, default: 'Published' },
  date: { type: Date, required: true }, // Maintains backward compatibility
  endDate: { type: Date },
  registrationDeadline: { type: Date },
  locationType: { type: String, enum: ['In-Person', 'Online'], default: 'In-Person' },
  location: { type: String, required: true },
  building: { type: String, default: '' },
  fullAddress: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  gallery: [{ type: String }],
  isPaid: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true },
  participationType: { type: String, enum: ['Individual', 'Team', 'Both'], default: 'Individual' },
  maxCapacity: { type: Number, default: null },
  itinerary: [{ time: { type: String }, activity: { type: String } }],
  contactPersons: [{ name: { type: String }, email: { type: String }, phone: { type: String } }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
