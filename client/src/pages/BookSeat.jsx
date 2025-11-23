import React, {useEffect,useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function BookSeat(){
  const { id } = useParams(); // seat id
  const nav = useNavigate();
  const [seat, setSeat] = useState(null);
  const [date,setDate] = useState('');
  const [timeSlot,setTimeSlot] = useState('09:00-17:00');
  const [msg,setMsg] = useState('');

  useEffect(()=>{
    if (id) api.get('/seats').then(r => {
      const s = r.data.find(x => x._id === id);
      setSeat(s || null);
    });
  },[id]);

  const submit = async (e) => {
    e.preventDefault();
    try{
      await api.post('/reservations', { seatId: seat._id, date, timeSlot });
      setMsg('Booked successfully');
      setTimeout(()=>nav('/my-reservations'),1000);
    } catch(err){
      setMsg(err.response?.data?.message || 'Failed to book');
    }
  };

  if (!seat) return <div className="container-max px-6">Loading...</div>;

  return (
    <div className="container-max px-6">
      <div className="card max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Book a Seat</h2>
        {msg && <div className="mb-3 text-red-600">{msg}</div>}
        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Seat</label>
            <input className="w-full p-2 border rounded" value={`${seat.seatNumber} - ${seat.location}`} disabled />
          </div>
          <div>
            <label className="block text-sm mb-1">Time Slot</label>
            <select value={timeSlot} onChange={e=>setTimeSlot(e.target.value)} className="w-full p-2 border rounded">
              <option>09:00-12:00</option>
              <option>13:00-17:00</option>
            </select>
          </div>
          <div className="col-span-2">
            <button className="w-full btn btn-blue">Book Seat</button>
          </div>
        </form>
      </div>
    </div>
  );
}
