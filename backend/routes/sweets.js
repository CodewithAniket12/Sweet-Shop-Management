// backend/routes/sweets.js
import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import { createSweet, getAllSweets } from '../controllers/sweetController.js';

// @route   POST /api/sweets
// @desc    Create a new sweet
// @access  Private
router.post('/', auth, createSweet);

// @route   GET /api/sweets
// @desc    Get all sweets
// @access  Public
router.get('/', getAllSweets);

export default router;