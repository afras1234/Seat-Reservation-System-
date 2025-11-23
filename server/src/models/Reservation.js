const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  intern: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seat: { type: mongoose.Schema.Types.ObjectId, ref: 'Seat', required: true },
  date: { type: String, required: true },        // 'YYYY-MM-DD'
  timeSlot: { type: String, required: true },    // '09:00-12:00' etc
  status: { type: String, enum: ['active','cancelled','completed'], default: 'active' },
  assignedByAdmin: { type: Boolean, default: false },
  checkInCode: { type: String, required: false, index: true },
  checkedIn: { type: Boolean, default: false },
  checkInTime: { type: Date }
}, { timestamps: true });

// index to help double-book check
ReservationSchema.index({ seat: 1, date: 1, timeSlot: 1, status: 1 });

module.exports = mongoose.model('Reservation', ReservationSchema);
