// server/routes/wishlist.js
const express = require('express');
const router = express.Router();
const { 
  addToWishlist, 
  removeFromWishlist, 
  getWishlist 
} = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all routes
router.use(protect);

// Get and add to wishlist
router.route('/')
  .get(getWishlist)
  .post(addToWishlist);

// Remove from wishlist
router.route('/:itemId')
  .delete(removeFromWishlist);

module.exports = router;