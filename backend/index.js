import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import sweetRoutes from './routes/sweets.js';

const app = express();

// --- Middleware ---
// Allows requests from other origins (like your future frontend)
app.use(cors());
// Allows the server to understand JSON data sent in requests
app.use(express.json());


// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// --- Routes ---
// A simple test route
app.get('/', (req, res) => res.send('Sweet Shop API is Running'));

// Plug in the authentication routes
app.use('/api/auth', authRoutes);

// Plug in the sweets routes
app.use('/api/sweets', sweetRoutes);


// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;