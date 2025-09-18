// backend/controllers/sweetController.js
import Sweet from '../models/sweet.js';
import User from '../models/user.js';

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

// @route   GET /api/sweets/search
// @desc    Search for sweets
// @access  Public
export const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }
    
    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/sweets/:id
// @desc    Update a sweet
// @access  Private
export const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ msg: 'Sweet not found' });

    const { name, category, price, quantity } = req.body;
    sweet.name = name || sweet.name;
    sweet.category = category || sweet.category;
    sweet.price = price || sweet.price;
    sweet.quantity = quantity || sweet.quantity;

    await sweet.save();
    res.json(sweet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE /api/sweets/:id
// @desc    Delete a sweet (Admin only)
// @access  Private
export const deleteSweet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admin role required' });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ msg: 'Sweet not found' });

    await sweet.deleteOne();
    res.json({ msg: 'Sweet removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};