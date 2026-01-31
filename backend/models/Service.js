import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    service_type: {
      type: String,
      required: true,
    },
    price_range: String,
    image_url: { type: String, default: '' },
    features: [{ type: String }],
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
