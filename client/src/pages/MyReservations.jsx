import React, {useEffect,useState} from 'react';
import api from '../api/api';
import Modal from '../components/Modal';
import { toDataURL } from 'qrcode';

export default function MyReservations(){
  const [reservations, setReservations] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrTitle, setQrTitle] = useState('');
  useEffect(()=>{ api.get('/reservations/me').then(r=>setReservations(r.data)).catch(()=>setReservations([])); },[]);

  const cancel = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    await api.put(`/reservations/cancel/${id}`);
    setReservations(prev => prev.filter(p => p._id !== id));
  };

  const showQrFor = async (reservation) => {
    // build check-in URL pointing to backend API
    const code = reservation.checkInCode;
    if (!code) return alert('No check-in code for this reservation');
    const backend = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const url = `${backend}/api/reservations/checkin/${code}`;
    try {
      const dataUrl = await toDataURL(url, { margin: 1, width: 300 });
      setQrDataUrl(dataUrl);
      setQrTitle(`Check-in QR for ${reservation.date} (${reservation.timeSlot})`);
      setShowQR(true);
    } catch (err) {
      console.error('QR gen failed', err);
      alert('Failed to generate QR');
    }
  };

  return (
    <div className="container-max px-6">
      <h2 className="text-2xl mb-4">My Reservations</h2>
      <div className="card">
        <table className="table">
          <thead><tr><th>Date</th><th>Seat</th><th>Time</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r._id}>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">{r.seat?.seatNumber}</td>
                <td className="px-4 py-3">{r.timeSlot}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3">
                  {r.status==='active' && (
                    <>
                      <button className="btn btn-danger mr-2" onClick={()=>cancel(r._id)}>Cancel</button>
                      <button className="btn btn-blue" onClick={()=>showQrFor(r)}>Show QR</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showQR && (
        <Modal title={qrTitle} onClose={() => setShowQR(false)}>
          <div className="flex flex-col items-center">
            <img src={qrDataUrl} alt="QR code" />
            <div className="mt-3 text-sm break-all">Scan this QR to check in or open it on a device that can scan QR codes.</div>
          </div>
        </Modal>
      )}
    </div>
  );
}
