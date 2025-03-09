// server/controllers/wishlistController.js
const User = require('../models/userModel');
const Item = require('../models/itemsModel');
const asyncHandler = require('express-async-handler');

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { itemId } = req.body;

  // Check if item exists
  const item = await Item.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Find user
  const user = await User.findById(req.user.id);
  
  // Check if item already in wishlist
  if (user.wishlist.includes(itemId)) {
    res.status(400);
    throw new Error('Item already in wishlist');
  }

  // Add item to wishlist
  user.wishlist.push(itemId);
  await user.save();

  // Return updated wishlist with populated item details
  const updatedUser = await User.findById(req.user.id).populate('wishlist');
  
  res.status(200).json(updatedUser.wishlist);
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:itemId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  // Find user
  const user = await User.findById(req.user.id);
  
  // Remove item from wishlist
  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== itemId
  );

  await user.save();

  // Return updated wishlist with populated item details
  const updatedUser = await User.findById(req.user.id).populate('wishlist');
  
  res.status(200).json(updatedUser.wishlist);
});

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist');
  
  res.status(200).json(user.wishlist);
});

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist
};
