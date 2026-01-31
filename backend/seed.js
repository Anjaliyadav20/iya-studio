import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Service from './models/Service.js';

dotenv.config();

const defaultServices = [
  { name: 'Neon Tattoos', description: 'UV-reactive temporary tattoos that glow under blacklight. Perfect for raves, club nights, festivals and themed parties.', service_type: 'neon_tattoo', price_range: '₹500 – ₹2000', image_url: '', features: ['UV Reactive', 'Waterproof', 'Lasts 3-5 days', 'Skin Safe'], is_active: true },
  { name: 'Glitter Hair Spray', description: 'Transform your hair with our premium glitter spray in gold, silver, rose, holographic and custom mixes.', service_type: 'glitter_hair_spray', price_range: '₹300 – ₹800', image_url: '', features: ['Easy Wash Out', 'Multiple Colors', 'Long Lasting', 'Hair Safe'], is_active: true },
  { name: 'Glitter Face Art', description: 'Professional face painting with glitter accents. From subtle shimmer to bold festival looks.', service_type: 'glitter_face_art', price_range: '₹400 – ₹1500', image_url: '', features: ['Custom Designs', 'Hypoallergenic', 'Photo Ready', 'Event Themes'], is_active: true },
  { name: 'Glitter Eye Art', description: 'Spectacular glitter eye makeup with fine glitters, rhinestones and gem placements.', service_type: 'glitter_eye_art', price_range: '₹350 – ₹1200', image_url: '', features: ['Gems & Crystals', 'Waterproof', 'Eye Safe', 'Long Lasting'], is_active: true },
  { name: 'Bold Stone Designs', description: 'Premium stones, crystals and gems for weddings, bridal events and high-fashion occasions.', service_type: 'bold_stone_designs', price_range: '₹600 – ₹2500', image_url: '', features: ['Premium Stones', 'Custom Patterns', 'Bridal Ready', 'Long Lasting'], is_active: true },
  { name: 'Glitter Art', description: 'Sparkling full-glitter designs for hair and body. Create magical looks for any occasion.', service_type: 'festival_face_gems', price_range: '₹600 – ₹2500', image_url: '', features: ['Custom Designs', 'Full Coverage', 'Photo Ready', 'Event Special'], is_active: true },
  { name: 'Body Art Designs', description: 'Artistic body designs combining glitter, paint and gems for fashion and body positivity.', service_type: 'body_jewels', price_range: '₹400 – ₹1800', image_url: '', features: ['Professional Art', 'Safe Application', 'Multiple Styles', 'Easy Removal'], is_active: true },
  { name: 'Hair Pearl Designs', description: 'Elegant pearl and gem hair decorations for bridal, festive and special occasions.', service_type: 'temporary_tattoos_premium', price_range: '₹500 – ₹2000', image_url: '', features: ['Premium Pearls', 'Bridal Ready', 'Long Lasting', 'Custom Designs'], is_active: true },
  { name: 'Pearl & Stone Blends', description: 'Combine the elegance of pearls with dazzling stones for a unique statement look.', service_type: 'uv_body_paint', price_range: '₹700 – ₹2800', image_url: '', features: ['Premium Materials', 'Custom Patterns', 'High Fashion', 'Event Ready'], is_active: true },
];

const seedDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/iya_studio';

    await mongoose.connect(mongoURL);
    console.log('✓ Connected to MongoDB');

    // Seed admin if not exists
    const adminExists = await User.findOne({ email: 'admin@iya.art' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin123!@#', 10);
      const admin = new User({ email: 'admin@iya.art', password: hashedPassword });
      await admin.save();
      console.log('✓ Admin user created (admin@iya.art / Admin123!@#)');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Seed services if none exist
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(defaultServices);
      console.log('✓ Default services created (' + defaultServices.length + ')');
    } else {
      console.log('✓ Services already exist (' + serviceCount + ')');
    }

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
