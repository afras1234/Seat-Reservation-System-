import React, {useEffect,useState} from 'react';
import api from '../api/api';
import SeatRow from '../components/SeatRow';
import { useNavigate } from 'react-router-dom';

export default function SeatList(){
  const [seats, setSeats] = useState([]);
  const nav = useNavigate();

  useEffect(()=>{ api.get('/seats').then(r=>setSeats(r.data)).catch(()=>setSeats([])); },[]);

  const handleBook = (seat) => { nav(`/book/${seat._id}`); };

  return (
    <div className="container-max px-6">
      <h2 className="text-2xl mb-4">Available Seats</h2>
      <div className="card">
        <table className="table">
          <thead><tr><th>Seat Number</th><th>Location</th><th>Time Slot</th><th></th></tr></thead>
          <tbody>
            {seats.map(s => <SeatRow key={s._id} seat={s} onBook={handleBook} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
