const Reservation = require('../models/Reservation');
const Seat = require('../models/Seat');
const { validateBookingDateTime } = require('../utils/validators');
const moment = require('moment');
const crypto = require('crypto');

// Helper: check if seat is free for date+timeSlot
async function isSeatFree(seatId, date, timeSlot) {
  const existing = await Reservation.findOne({ seat: seatId, date, timeSlot, status: 'active' });
  return !existing;
}

// Create reservation (intern or admin)
exports.createReservation = async (req, res) => {
  try {
    const { seatId, date, timeSlot, internId } = req.body;

    if (!seatId || !date || !timeSlot) return res.status(400).json({ message: 'Missing fields' });

    // validate date/time
    const start = timeSlot.split('-')[0]; // e.g. '09:00'
    const check = validateBookingDateTime(date, start);
    if (!check.ok) return res.status(400).json({ message: check.msg });

    // use internId if admin assigns on behalf, otherwise current user
    const userId = internId || req.user._id;

    // rule: a user can only reserve one seat per day
    const existingForUser = await Reservation.findOne({ intern: userId, date, status: 'active' });
    if (existingForUser) return res.status(400).json({ message: 'User already has a reservation that day' });

    // check seat exists and available
    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ message: 'Seat not found' });
    if (seat.status === 'unavailable') return res.status(400).json({ message: 'Seat unavailable' });

    // check double-booking for this seat/time
    const free = await isSeatFree(seatId, date, timeSlot);
    if (!free) return res.status(400).json({ message: 'Seat already booked for this slot' });

      // generate a random short code for QR check-in
      const code = crypto.randomBytes(6).toString('hex');

      const reservation = await Reservation.create({
        intern: userId,
        seat: seatId,
        date,
        timeSlot,
        assignedByAdmin: req.user.role === 'admin' && !!internId,
        checkInCode: code
      });

      res.json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

  // Check-in by QR code (public endpoint) - marks reservation checkedIn if valid
  exports.checkInByCode = async (req, res) => {
    try {
      const code = req.params.code;
      if (!code) return res.status(400).json({ message: 'Missing code' });

      const r = await Reservation.findOne({ checkInCode: code, status: 'active' }).populate('seat').populate('intern','name email');
      if (!r) return res.status(404).json({ message: 'Reservation not found or already checked-in/cancelled' });

      // only allow check-in on the same date
      const today = moment().format('YYYY-MM-DD');
      if (r.date !== today) return res.status(400).json({ message: 'Can only check in on the reservation date' });

      // check time slot: ensure current time is within the time slot bounds
      const [start, end] = r.timeSlot.split('-');
      const startMoment = moment(`${r.date} ${start}`, 'YYYY-MM-DD HH:mm');
      const endMoment = moment(`${r.date} ${end}`, 'YYYY-MM-DD HH:mm');
      const now = moment();
      if (now.isBefore(startMoment) || now.isAfter(endMoment)) return res.status(400).json({ message: 'Not within reserved time slot' });

      r.checkedIn = true;
      r.checkInTime = new Date();
      r.status = 'completed';
      await r.save();

      res.json({ message: 'Check-in successful', reservation: r });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Get reservations for current user
exports.getReservationsForUser = async (req, res) => {
  try {
    const list = await Reservation.find({ intern: req.user._id }).populate('seat').sort({ date: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: get all reservations with optional filters
exports.getAllReservations = async (req, res) => {
  try {
    const q = {};
    if (req.query.date) q.date = req.query.date;
    if (req.query.internId) q.intern = req.query.internId;
    const list = await Reservation.find(q).populate('seat').populate('intern','name email').sort({ date: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel reservation (owner or admin)
exports.cancelReservation = async (req, res) => {
  try {
    const r = await Reservation.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Reservation not found' });

    // only owner or admin can cancel
    if (String(r.intern) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    // only future bookings can be cancelled (optional)
    const slotStart = r.timeSlot.split('-')[0];
    const bookingMoment = moment(`${r.date} ${slotStart}`, 'YYYY-MM-DD HH:mm');
    if (bookingMoment.isBefore(moment())) return res.status(400).json({ message: 'Cannot cancel past reservation' });

    r.status = 'cancelled';
    await r.save();
    res.json({ message: 'Cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Modify reservation (owner or admin)
exports.modifyReservation = async (req, res) => {
  try {
    const r = await Reservation.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Reservation not found' });

    if (String(r.intern) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    // ensure it's future reservation
    const slotStartOld = r.timeSlot.split('-')[0];
    const bookingOld = moment(`${r.date} ${slotStartOld}`, 'YYYY-MM-DD HH:mm');
    if (bookingOld.isBefore(moment())) return res.status(400).json({ message: 'Cannot modify past reservation' });

    const { seatId, date, timeSlot } = req.body;
    if (!seatId || !date || !timeSlot) return res.status(400).json({ message: 'Missing fields' });

    const start = timeSlot.split('-')[0];
    const check = validateBookingDateTime(date, start);
    if (!check.ok) return res.status(400).json({ message: check.msg });

    // check user one-seat-per-day rule
    const existingForUser = await Reservation.findOne({ intern: r.intern, date, status:'active', _id: { $ne: r._id } });
    if (existingForUser) return res.status(400).json({ message: 'User already has a reservation that day' });

    // check seat availability
    const free = await isSeatFree(seatId, date, timeSlot);
    if (!free) return res.status(400).json({ message: 'Seat already booked for that slot' });

    r.seat = seatId;
    r.date = date;
    r.timeSlot = timeSlot;
    await r.save();
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
