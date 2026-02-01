
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Service from '../models/Service.js';
import Gallery from '../models/Gallery.js';
import PreviousWork from '../models/PreviousWork.js';

// Config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.argv[2] || process.env.MONGODB_URI;
if (!uri) {
    console.error("❌ No MONGODB_URI found in .env or arguments");
    process.exit(1);
}

const servicesData = [
    {
        name: "Neon Glow Tattoos",
        description: "UV-reactive temporary tattoos that glow vividly under blacklight, perfect for night parties, festivals, and high-energy events.",
        price_range: "₹500 – ₹2000",
        service_type: "neon_tattoo",
        image_url: "neon.jpeg",
        features: ["Glow in Dark", "Skin Safe", "Waterproof"]
    },
    {
        name: "Glittery Hair Glam",
        description: "Premium glitter hair styling in multiple shades to add instant sparkle and elevate your entire look.",
        price_range: "₹300 – ₹800",
        service_type: "glitter_hair_spray",
        image_url: "glitter_hair.jpg",
        features: ["Washable", "Non-damaging", "Vibrant Colors"]
    },
    {
        name: "Crystal Face Art",
        description: "Elegant face art embellished with stones and glitter accents for a refined, magical appearance.",
        price_range: "₹400 – ₹1500",
        service_type: "glitter_face_art",
        image_url: "faceglitter.jpg",
        features: ["Intricate Designs", "Hypoallergenic", "Long Lasting"]
    },
    {
        name: "Glitter Eye Luxe",
        description: "High-impact glitter and gem eye designs crafted to make your eyes the center of attention.",
        price_range: "₹350 – ₹1200",
        service_type: "glitter_eye_art",
        image_url: "slide3_eyelook.jpg",
        features: ["Bold Look", "Custom Styles", "Expert Application"]
    },
    {
        name: "Highlight Your Bones",
        description: "Intricate stone and crystal body designs that add elegance and sparkle to special occasions.",
        price_range: "₹600 – ₹2500",
        service_type: "bold_stone_designs",
        image_url: "neckstone.jpg",
        features: ["Premium Stones", "Elegant", "Reusable Options"]
    },
    {
        name: "Sparkle Your Veins",
        description: "Bold full-glitter designs for hair and body, created to shine, sparkle, and stand out.",
        price_range: "₹600 – ₹2000",
        service_type: "festival_face_gems",
        image_url: "glitterart.jpeg",
        features: ["Full Coverage", "Festival Ready", "Stand Out"]
    },
];

const galleryData = servicesData.map(s => ({
    title: s.name,
    description: s.description,
    media_urls: [s.image_url],
    media_type: 'image',
    service_type: s.service_type,
    is_featured: true,
    event_type: 'other'
}));

const previousWorkData = [
    {
        title: "Sunburn Festival 2023",
        description: "An incredible night of music and glow at Sunburn! Our Neon Tattoos were the talk of the event.",
        media_urls: ["slider1_Container.jpg", "slider2_neongirl.jpg"],
        media_type: "image",
        event_type: "festival",
        location: "Goa, India",
        is_featured: true
    },
    {
        title: "Vogue Bridal Shoot",
        description: "Elegant bridal face jewels and glitter accents for a high-fashion photoshoot.",
        media_urls: ["slide3_eyelook.jpg", "butterfly.jpg"],
        media_type: "image",
        event_type: "photoshoot",
        location: "Mumbai, India",
        is_featured: true
    },
    {
        title: "Neon Rave Night",
        description: "Full body UV paint and neon art for a high-energy corporate rave.",
        media_urls: ["neon.jpeg"],
        media_type: "image",
        event_type: "raves",
        location: "Bangalore, India",
        is_featured: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('📦 Connected to MongoDB');

        // Wipe old data
        await Service.deleteMany({});
        await Gallery.deleteMany({});
        await PreviousWork.deleteMany({});

        // Insert
        await Service.insertMany(servicesData);
        await Gallery.insertMany(galleryData);
        await PreviousWork.insertMany(previousWorkData);

        console.log('✅ Database seeded successfully with Service, Gallery, and PreviousWork items');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
