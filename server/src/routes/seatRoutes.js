const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');
const authenticate = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// public: list seats
router.get('/', seatController.getSeats);

// admin-only CRUD
router.post('/', authenticate, allowRoles('admin'), seatController.createSeat);
router.put('/:id', authenticate, allowRoles('admin'), seatController.updateSeat);
router.delete('/:id', authenticate, allowRoles('admin'), seatController.deleteSeat);

module.exports = router;
