import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    nav('/login');
  };

  return (
    <header className="topbar">
      <div className="container-max flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-lg font-semibold">Intern Seat Reservation System</div>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-white/90">Dashboard</Link>
            <Link to="/seats" className="text-white/90">View Seats</Link>
            {user?.role === 'intern' && <Link to="/my-reservations" className="text-white/90">My Reservations</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="text-white/90">Admin Dashboard</Link>}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-white/90">{user.name}</div>
              <button onClick={logout} className="btn btn-blue">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white/90">Login</Link>
              <Link to="/register" className="text-white/90">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
