
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const listUsers = async () => {
    await connectDB();
    const users = await User.find({});
    console.log('--- USERS ---');
    users.forEach(u => {
        console.log(`ID: ${u._id}, Email: ${u.email}`);
    });
    console.log('--- END ---');
    process.exit();
};

listUsers();
