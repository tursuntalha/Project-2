const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: 'text' },
  description: { type: String, required: true, index: 'text' },
  specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Home', 'Sports', 'Books'] },
  stock: { type: Number, required: true, default: 0 },
  images: [String],
  embedding: { type: [Number], default: null },
  salesVelocity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
