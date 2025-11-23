const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticate = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// create reservation - intern (or admin can create with internId)
router.post('/', authenticate, reservationController.createReservation);

// user's reservations
router.get('/me', authenticate, reservationController.getReservationsForUser);

// cancel reservation
router.put('/cancel/:id', authenticate, reservationController.cancelReservation);

// public check-in by code (QR will point here)
router.get('/checkin/:code', reservationController.checkInByCode);

// modify reservation
router.put('/:id', authenticate, reservationController.modifyReservation);

// admin view all reservations
router.get('/', authenticate, allowRoles('admin'), reservationController.getAllReservations);

module.exports = router;
