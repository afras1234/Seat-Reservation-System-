const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true, unique: true }, // A1, B2, etc
  location: { type: String, default: 'Main' },
  status: { type: String, enum: ['available','unavailable'], default: 'available' },
  // optional: metadata
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Seat', SeatSchema);
