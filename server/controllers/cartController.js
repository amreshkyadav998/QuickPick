// server/controllers/cartController.js
const User = require('../models/userModel');
const Item = require('../models/itemsModel');
const asyncHandler = require('express-async-handler');

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { itemId, quantity = 1 } = req.body;

  // Check if item exists
  const item = await Item.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Find user and update cart
  const user = await User.findById(req.user.id);
  
  // Check if item already in cart
  const existingCartItem = user.cart.find(
    (cartItem) => cartItem.item.toString() === itemId
  );

  if (existingCartItem) {
    // Update quantity if item exists
    existingCartItem.quantity += parseInt(quantity);
  } else {
    // Add new item to cart
    user.cart.push({ item: itemId, quantity: parseInt(quantity) });
  }

  await user.save();

  // Return updated cart with populated item details
  const updatedUser = await User.findById(req.user.id).populate('cart.item');
  
  res.status(200).json(updatedUser.cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  // Find user and update cart
  const user = await User.findById(req.user.id);
  
  // Filter out the item to remove
  user.cart = user.cart.filter(
    (cartItem) => cartItem.item.toString() !== itemId
  );

  await user.save();

  // Return updated cart with populated item details
  const updatedUser = await User.findById(req.user.id).populate('cart.item');
  
  res.status(200).json(updatedUser.cart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    res.status(400);
    throw new Error('Quantity must be greater than 0');
  }

  // Find user
  const user = await User.findById(req.user.id);
  
  // Find the cart item to update
  const cartItem = user.cart.find(
    (item) => item.item.toString() === itemId
  );

  if (!cartItem) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  // Update quantity
  cartItem.quantity = parseInt(quantity);
  await user.save();

  // Return updated cart with populated item details
  const updatedUser = await User.findById(req.user.id).populate('cart.item');
  
  res.status(200).json(updatedUser.cart);
});

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.item');
  
  res.status(200).json(user.cart);
});

module.exports = {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart
};