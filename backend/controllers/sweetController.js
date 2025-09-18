// backend/controllers/sweetController.js
import Sweet from '../models/sweet.js';

// @route   POST /api/sweets
// @desc    Create a new sweet
// @access  Private
export const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    const newSweet = new Sweet({
      name,
      category,
      price,
      quantity,
    });

    const sweet = await newSweet.save();
    res.status(201).json(sweet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/sweets
// @desc    Get all sweets
// @access  Public
export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};