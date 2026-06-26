const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const chromaService = require('../services/chromaService');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

async function ollamaGenerate(prompt, system = '') {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'qwen2.5:7b', system, prompt, stream: false }),
  });
  const data = await res.json();
  return data.response;
}

router.post('/generate-description', authMiddleware, adminOnly, async (req, res) => {
  const { name, specs, category, price } = req.body;
  const prompt = `Product name: ${name}\nSpecifications:\n${specs.join('\n')}\nCategory: ${category}\nPrice: $${price}\n\nGenerate a product description with:\n1. An engaging title (different from the name)\n2. A 150-word compelling description\n3. 5 key feature bullets\n\nFormat as JSON with keys: title, description, features (array)`;
  const system = 'You are an expert e-commerce copywriter. Generate compelling product descriptions in Turkish where appropriate.';
  try {
    const response = await ollamaGenerate(prompt, system);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: name, description: response, features: [] };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/recommend', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const similar = await chromaService.searchSimilar(`${product.name} ${product.description} ${product.category}`, 6);
  const recommendations = [];
  if (similar.ids[0]) {
    for (const id of similar.ids[0].slice(1)) {
      const p = await Product.findById(id);
      if (p) recommendations.push(p);
    }
  }

  const prompt = `User is viewing: ${product.name} (${product.category}, $${product.price})\n\nSimilar products:\n${recommendations.map(r => `- ${r.name} (${r.category}, $${r.price})`).join('\n')}\n\nFor each recommended product, write a 1-2 sentence explanation in Turkish why this user might like it. Format as JSON array with keys: product_name, explanation.`;
  const system = 'You are a helpful e-commerce recommendation assistant. Explain recommendations in Turkish.';
  try {
    const response = await ollamaGenerate(prompt, system);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    const explanations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    res.json({ recommendations: recommendations.map((r, i) => ({ ...r.toObject(), explanation: explanations[i]?.explanation || '' })) });
  } catch {
    res.json({ recommendations });
  }
});

module.exports = router;
