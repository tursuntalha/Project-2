const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const chromaService = require('../services/chromaService');

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query is required' });

  const vectorResults = await chromaService.searchSimilar(q, 10);
  const semanticResults = [];
  const similarityScores = [];

  if (vectorResults.ids[0]?.length > 0) {
    for (let i = 0; i < vectorResults.ids[0].length; i++) {
      const productId = vectorResults.ids[0][i];
      const score = 1 - (vectorResults.distances[0][i] || 0);
      similarityScores.push({ productId, score });
      if (score >= 0.5) {
        const product = await Product.findById(productId);
        if (product) semanticResults.push({ ...product.toObject(), similarityScore: score });
      }
    }
  }

  let fallbackResults = [];
  if (semanticResults.length === 0 || semanticResults.some(r => r.similarityScore < 0.5)) {
    fallbackResults = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).limit(10);
  }

  res.json({
    semantic: semanticResults,
    fallback: fallbackResults,
    similarityScores,
    query: q,
  });
});

module.exports = router;
