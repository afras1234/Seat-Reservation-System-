const Seat = require('../models/Seat');

exports.createSeat = async (req, res) => {
  try {
    const { seatNumber, location, status, notes } = req.body;
    if (!seatNumber) return res.status(400).json({ message: 'seatNumber required' });
    const exists = await Seat.findOne({ seatNumber });
    if (exists) return res.status(400).json({ message: 'Seat number already exists' });
    const seat = await Seat.create({ seatNumber, location, status, notes });
    res.json(seat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSeats = async (req, res) => {
  try {
    const seats = await Seat.find().sort('seatNumber');
    res.json(seats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSeat = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(seat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSeat = async (req, res) => {
  try {
    await Seat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Seat deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
