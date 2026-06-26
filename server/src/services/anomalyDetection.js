const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');

async function checkAnomalies() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600_000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600_000);
  const anomalies = [];

  const products = await Product.find({});
  for (const product of products) {
    const recentOrders = await Order.countDocuments({
      'items.product': product._id,
      createdAt: { $gte: sevenDaysAgo },
    });
    const historicalOrders = await Order.countDocuments({
      'items.product': product._id,
      createdAt: { $gte: thirtyDaysAgo, $lt: sevenDaysAgo },
    });

    const recentVelocity = recentOrders / 7;
    const historicalVelocity = historicalOrders / 23;

    if (historicalVelocity > 0) {
      const deviation = (recentVelocity - historicalVelocity) / historicalVelocity;
      if (Math.abs(deviation) > 2) {
        anomalies.push({
          productId: product._id,
          productName: product.name,
          recentVelocity,
          historicalVelocity,
          deviation,
          type: deviation > 0 ? 'spike' : 'drop',
        });
      }
    }
  }

  if (anomalies.length > 0) {
    console.log('Anomalies detected:', anomalies);
  }
  return anomalies;
}

router.get('/', async (req, res) => {
  try {
    const anomalies = await checkAnomalies();
    res.json(anomalies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.checkAnomalies = checkAnomalies;
