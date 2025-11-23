import React from 'react';

/*
props:
 - seat: { _id, seatNumber, location, status }
 - onBook(seat): function
*/
export default function SeatRow({ seat, onBook }) {
  const booked = seat.status !== 'available';
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">{seat.seatNumber}</td>
      <td className="px-4 py-3">{seat.location}</td>
      <td className="px-4 py-3">{seat.timeSlot || '09:00 - 17:00'}</td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onBook(seat)}
          disabled={booked}
          className={`btn ${booked ? 'bg-gray-400 cursor-not-allowed' : 'btn-blue'}`}
        >
          {booked ? 'Booked' : 'Book'}
        </button>
      </td>
    </tr>
  );
}
