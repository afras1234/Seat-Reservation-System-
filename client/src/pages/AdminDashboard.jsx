import React, {useEffect,useState} from 'react';
import api from '../api/api';
import StatCard from '../components/StatCard';
import ManageSeats from './ManageSeats';
import ManageReservations from './ManageReservations';

export default function AdminDashboard(){
  const [seats, setSeats] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(()=>{ load(); },[]);

  async function load(){
    const s = await api.get('/seats'); setSeats(s.data);
    const r = await api.get('/reservations'); setReservations(r.data);
  }

  return (
    <div className="container-max px-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
      <div className="stat-grid mb-6">
        <StatCard title="Total Seats" value={seats.length} icon="🪑" />
        <StatCard title="Available Seats" value={seats.filter(s=>s.status==='available').length} icon="✅" />
        <StatCard title="Reservations Today" value={reservations.length} icon="📅" />
        <StatCard title="Active Reservations" value={reservations.filter(r=>r.status==='active').length} icon="⚡" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ManageSeats seats={seats} refresh={load} />
        <ManageReservations reservations={reservations} refresh={load} />
      </div>
    </div>
  );
}
