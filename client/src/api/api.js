import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: baseURL + '/api' });

// attach token automatically
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;

/*
Expected backend endpoints used by client:
- POST /api/auth/register   {name,email,password} -> { message / user }
- POST /api/auth/login      {email,password} -> { token, user }
- GET  /api/seats           -> [ { _id, seatNumber, location, status } ]
- POST /api/reservations    -> { seatId, date, timeSlot }  (auth)
- GET  /api/reservations/me -> [ reservations for current user ] (auth)
- GET  /api/reservations    -> admin: all reservations (auth + admin)
- PUT  /api/reservations/cancel/:id -> cancel (auth)
- POST /api/seats (admin)   -> create seat (auth + admin)
*/
