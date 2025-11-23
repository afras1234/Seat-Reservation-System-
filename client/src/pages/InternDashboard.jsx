import React, {useEffect,useState} from 'react';
import api from '../api/api';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';

export default function InternDashboard(){
  const [seatsCount, setSeatsCount] = useState(0);
  const [myReservations, setMyReservations] = useState([]);

  useEffect(()=>{ load(); },[]);

  async function load(){
    const [seatsRes, myRes] = await Promise.all([api.get('/seats'), api.get('/reservations/me')]);
    setSeatsCount(seatsRes.data.filter(s=>s.status==='available').length);
    setMyReservations(myRes.data);
  }

  return (
    <div className="container-max px-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, Intern!</h1>

      <div className="stat-grid mb-6">
        <StatCard title="Available Seats" value={seatsCount} icon="✅" />
        <StatCard title="Upcoming Reservations" value={myReservations.filter(r=>r.status==='active').length} icon="📅" />
        <StatCard title="Active Reservation" value={myReservations.filter(r=>r.status==='active').length>0?1:0} icon="🟢" />
        <StatCard title="Past Reservations" value={myReservations.filter(r=>r.status!=='active').length} icon="🕒" />
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Upcoming Reservation</h2>
        {myReservations.length === 0 ? <div>No upcoming reservations</div> : (
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Seat</th><th>Time Slot</th><th></th></tr>
            </thead>
            <tbody>
              {myReservations.map(r=>(
                <tr key={r._id}>
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">{r.seat?.seatNumber}</td>
                  <td className="px-4 py-3">{r.timeSlot}</td>
                  <td className="px-4 py-3"><Link to={`/book/${r.seat?._id}`} className="btn btn-blue">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
