import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import authRoutes from './routes/index.js';
import bookingsRoutes from './routes/bookings.index.js';
import galleryRoutes from './routes/gallery.index.js';
import servicesRoutes from './routes/services.index.js';
import previousWorkRoutes from './routes/previousWork.index.js';

// Initialize environment variables ASAP
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '15mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/previous-work', previousWorkRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', database: 'MongoDB' });
});

// Error handling - send actual error message so frontend can show it
app.use((err, req, res, next) => {
  const stack = err.stack || '';
  const message = err.message || 'Internal server error';
  const errorLog = `[${new Date().toISOString()}] ${message}\n${stack}\n\n`;

  try {
    fs.appendFileSync(path.join(__dirname, 'error.log'), errorLog);
  } catch (logErr) {
    console.error('Failed to write to log file:', logErr);
  }

  console.error(err.stack);
  if (message.includes('entity too large') || message.includes('payload')) {
    res.status(413).json({ error: 'Image too large. Please use a smaller image (under 2MB) or paste an image URL instead.' });
  } else {
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
