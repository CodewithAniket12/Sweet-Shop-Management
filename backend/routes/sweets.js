import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

import { 
  createSweet, 
  getAllSweets, 
  searchSweets, 
  updateSweet, 
  deleteSweet,
  purchaseSweet,
  restockSweet
} from '../controllers/sweetController.js';

// --- Public Routes --- (Anyone can access)
router.get('/', getAllSweets);
router.get('/search', searchSweets);

// --- Protected User Routes --- (Must be logged in)
router.post('/:id/purchase', auth, purchaseSweet);

// --- Protected Admin Routes --- (Must be logged in as an Admin)
router.post('/', [auth, admin], createSweet);
router.put('/:id', [auth, admin], updateSweet);
router.delete('/:id', [auth, admin], deleteSweet);
router.post('/:id/restock', [auth, admin], restockSweet);

export default router;