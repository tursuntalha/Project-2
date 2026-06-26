const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('items.product').sort('-createdAt');
  res.json(orders);
});

router.post('/checkout', authMiddleware, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const order = await Order.create({
    user: req.user.id,
    items: cart.items.map(i => ({ product: i.product._id, quantity: i.quantity, price: i.product.price })),
    total,
    address: req.body.address,
    status: 'paid',
  });
  await User.findByIdAndUpdate(req.user.id, {
    $push: { purchaseHistory: { $each: cart.items.map(i => ({ product: i.product._id, date: new Date() })) } },
    $set: { 'preferences.preferredCategories': [...new Set(cart.items.map(i => i.product.category))] },
  });
  await Cart.findByIdAndDelete(cart._id);
  res.status(201).json(order);
});

module.exports = router;
