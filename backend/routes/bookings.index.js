import express from 'express';
import { getBookings, createBooking, updateBookingStatus } from './bookings.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getBookings);
router.post('/', createBooking);
router.patch('/:id', authenticateToken, updateBookingStatus);

export default router;
