const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/seats', require('./routes/seatRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB connect failed', err);
    process.exit(1);
  });
