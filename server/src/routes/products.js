const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const chromaService = require('../services/chromaService');

router.get('/', async (req, res) => {
  const { category, page = 1, limit = 20 } = req.query;
  const query = category ? { category } : {};
  const products = await Product.find(query).skip((page - 1) * limit).limit(Number(limit));
  const total = await Product.countDocuments(query);
  res.json({ products, total, page: Number(page) });
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  await chromaService.indexProduct(product);
  res.status(201).json(product);
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  await chromaService.indexProduct(product);
  res.json(product);
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  await chromaService.removeProduct(req.params.id);
  res.json({ success: true });
});

module.exports = router;
