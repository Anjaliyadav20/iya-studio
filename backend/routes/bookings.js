import Booking from '../models/Booking.js';

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, location, service_type, preferred_date, preferred_time_slot, additional_info } = req.body;

    if (!name || !email || !phone || !location || !service_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const booking = new Booking({
      name,
      email,
      phone,
      location,
      service_type,
      preferred_date,
      preferred_time_slot,
      additional_info,
      status: 'pending',
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: booking._id,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};
