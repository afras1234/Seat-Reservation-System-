/**
 * Run: npm run seed
 * Creates an admin user (from .env ADMIN_EMAIL/ADMIN_PASSWORD)
 * and inserts default seats if they don't exist.
 */

require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Seat = require('../models/Seat');
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function seed() {
  await connectDB();

  // create admin user
  let admin = await User.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    admin = await User.create({ name: 'Admin', email: ADMIN_EMAIL, password: hashed, role: 'admin' });
    console.log('Admin user created:', ADMIN_EMAIL);
  } else {
    console.log('Admin already exists');
  }

  // create default seats (A1..A10, B1..B5 example matching UI)
  const count = await Seat.countDocuments();
  if (count === 0) {
    const seats = [];
    for (let i=1;i<=10;i++) seats.push({ seatNumber: `A${i}`, location: `Room ${((i-1)%3)+1}` });
    for (let i=1;i<=5;i++) seats.push({ seatNumber: `B${i}`, location: `Room ${((i-1)%3)+1}` });
    await Seat.insertMany(seats);
    console.log('Default seats created:', seats.length);
  } else {
    console.log('Seats already present:', count);
  }

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
