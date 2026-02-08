import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const inspectDB = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI.replace(/:[^:]+@/, ':****@'));
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        console.log('📦 Database Name:', db.databaseName);

        const collections = await db.listCollections().toArray();
        console.log('\n📚 Collections:');
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(` - ${col.name}: ${count} documents`);
            if (count > 0) {
                const sample = await db.collection(col.name).findOne();
                console.log(`   Sample ID: ${sample._id}`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error inspecting database:', err);
        process.exit(1);
    }
};

inspectDB();
