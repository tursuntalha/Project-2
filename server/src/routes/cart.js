const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart) cart = { items: [] };
  res.json(cart);
});

router.post('/add', authMiddleware, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });
  const existing = cart.items.find(i => i.product.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  res.json(cart);
});

router.post('/remove', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();
  }
  res.json(cart || { items: [] });
});

router.put('/update', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) item.quantity = quantity;
    await cart.save();
  }
  res.json(cart || { items: [] });
});

module.exports = router;
