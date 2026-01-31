
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
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

const updateAdmin = async () => {
    await connectDB();

    const emailToUpdate = 'imprint.your.aura@gmail.com';
    const newPassword = 'Imprint@2003';
    const emailToDelete = 'admin@iya.art';

    // 1. Update Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findOneAndUpdate(
        { email: emailToUpdate },
        { password: hashedPassword },
        { new: true }
    );

    if (updatedUser) {
        console.log(`✅ Success: Password updated for ${emailToUpdate}`);
    } else {
        console.log(`❌ Error: User ${emailToUpdate} not found! Creating it now...`);
        const newUser = new User({ email: emailToUpdate, password: hashedPassword });
        await newUser.save();
        console.log(`✅ Success: Created admin ${emailToUpdate}`);
    }

    // 2. Delete the extra admin
    const deleted = await User.findOneAndDelete({ email: emailToDelete });
    if (deleted) {
        console.log(`🗑️ Deleted: ${emailToDelete}`);
    } else {
        console.log(`ℹ️ Info: ${emailToDelete} was already deleted or not found.`);
    }

    process.exit();
};

updateAdmin();
