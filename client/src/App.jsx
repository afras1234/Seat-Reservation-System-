import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import InternDashboard from './pages/InternDashboard';
import SeatList from './pages/SeatList';
import BookSeat from './pages/BookSeat';
import MyReservations from './pages/MyReservations';
import ManageSeats from './pages/ManageSeats';
import ManageReservations from './pages/ManageReservations';

export default function App() {
	return (
		<>
			<Navbar />
			<main className="py-6">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					<Route path="/" element={
						<ProtectedRoute>
							<InternDashboard />
						</ProtectedRoute>
					} />

					<Route path="/admin" element={
						<ProtectedRoute adminOnly>
							<AdminDashboard />
						</ProtectedRoute>
					} />

					<Route path="/seats" element={<ProtectedRoute><SeatList /></ProtectedRoute>} />
					<Route path="/book/:id" element={<ProtectedRoute><BookSeat /></ProtectedRoute>} />
					<Route path="/my-reservations" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />

					<Route path="/manage-seats" element={<ProtectedRoute adminOnly><ManageSeats /></ProtectedRoute>} />
					<Route path="/manage-reservations" element={<ProtectedRoute adminOnly><ManageReservations /></ProtectedRoute>} />

					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
		</>
	);
}

