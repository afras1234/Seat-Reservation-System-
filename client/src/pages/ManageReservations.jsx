import React from 'react';
import api from '../api/api';

export default function ManageReservations({ reservations, refresh }) {
  const assign = async (id) => {
    // example: admin can change status / assign seat - implement backend accordingly
    alert('Implement admin assignment logic on backend.');
  };

  return (
    <div className="card">
      <h3 className="text-xl mb-3">Manage Reservations</h3>

      <table className="table">
        <thead><tr><th>Date</th><th>Intern</th><th>Seat</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {reservations.map(r => (
            <tr key={r._id}>
              <td className="px-4 py-3">{r.date}</td>
              <td className="px-4 py-3">{r.intern?.name}</td>
              <td className="px-4 py-3">{r.seat?.seatNumber}</td>
              <td className="px-4 py-3">{r.status}</td>
              <td className="px-4 py-3"><button className="btn btn-blue" onClick={()=>assign(r._id)}>Assign</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
