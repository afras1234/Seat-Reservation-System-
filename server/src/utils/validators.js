const moment = require('moment');

// validate date in YYYY-MM-DD
function isValidDate(date) {
  return moment(date, 'YYYY-MM-DD', true).isValid();
}

// ensure booking at least 1 hour ahead (compare start time)
function validateBookingDateTime(dateString, timeSlotStart) {
  const now = moment();
  const booking = moment(`${dateString} ${timeSlotStart}`, 'YYYY-MM-DD HH:mm');
  if (!booking.isValid()) return { ok: false, msg: 'Invalid date/time format' };
  if (booking.isBefore(now)) return { ok: false, msg: 'Cannot book past date/time' };
  if (booking.diff(now, 'minutes') < 60) return { ok: false, msg: 'Reservations must be at least 1 hour in advance' };
  return { ok: true };
}

module.exports = { isValidDate, validateBookingDateTime };
