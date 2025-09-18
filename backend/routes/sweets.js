// backend/routes/sweets.js
import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import { createSweet, getAllSweets, searchSweets, updateSweet, deleteSweet } from '../controllers/sweetController.js';

// @route   POST /api/sweets
// @desc    Create a new sweet
// @access  Private
router.post('/', auth, createSweet);

// @route   GET /api/sweets
// @desc    Get all sweets
// @access  Public
router.get('/', getAllSweets);

// @route   GET /api/sweets/search
// @desc    Search for sweets
// @access  Public
router.get('/search', searchSweets);

// @route   PUT /api/sweets/:id
// @desc    Update a sweet
// @access  Private
router.put('/:id', auth, updateSweet);

// @route   DELETE /api/sweets/:id
// @desc    Delete a sweet (Admin only)
// @access  Private
router.delete('/:id', auth, deleteSweet);

export default router;