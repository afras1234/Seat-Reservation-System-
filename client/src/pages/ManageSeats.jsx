import React, {useState} from 'react';
import api from '../api/api';

export default function ManageSeats({ seats, refresh }) {
  const [seatNumber, setSeatNumber] = useState('');
  const [location, setLocation] = useState('');

  const add = async () => {
    await api.post('/seats', { seatNumber, location });
    setSeatNumber(''); setLocation('');
    refresh();
  };

  const remove = async (id) => {
    if (!confirm('Delete seat?')) return;
    await api.delete(`/seats/${id}`);
    refresh();
  };

  return (
    <div className="card">
      <h3 className="text-xl mb-3">All Seats</h3>

      <div className="mb-4">
        <input placeholder="Seat number" value={seatNumber} onChange={e=>setSeatNumber(e.target.value)} className="p-2 border rounded mr-2" />
        <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} className="p-2 border rounded mr-2" />
        <button className="btn btn-blue" onClick={add}>Add Seat</button>
      </div>

      <table className="table">
        <thead><tr><th>Seat</th><th>Location</th><th></th></tr></thead>
        <tbody>
          {seats.map(s => (
            <tr key={s._id}>
              <td className="px-4 py-3">{s.seatNumber}</td>
              <td className="px-4 py-3">{s.location}</td>
              <td className="px-4 py-3"><button className="btn btn-danger" onClick={()=>remove(s._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
