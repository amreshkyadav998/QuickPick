// server/routes/cart.js
const express = require('express');
const router = express.Router();
const { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  getCart 
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all routes
router.use(protect);

// Get and add to cart
router.route('/')
  .get(getCart)
  .post(addToCart);

// Update and remove from cart
router.route('/:itemId')
  .put(updateCartItemQuantity)
  .delete(removeFromCart);

module.exports = router;