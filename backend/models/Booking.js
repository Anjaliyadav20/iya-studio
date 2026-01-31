import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    service_type: {
      type: String,
      enum: ['neon_tattoo', 'glitter_hair_spray', 'glitter_face_art', 'glitter_eye_art', 'bold_stone_designs', 'uv_body_paint', 'body_jewels', 'temporary_tattoos_premium', 'festival_face_gems'],
      required: true,
    },
    preferred_date: Date,
    preferred_time_slot: String,
    additional_info: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
