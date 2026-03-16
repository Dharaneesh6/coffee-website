const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: String,
  options: [{ label: String, value: String, priceModifier: { type: Number, default: 0 } }]
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
  category: { type: String, required: true, index: true },
  brand: { type: String, default: '' },
  stock: { type: Number, required: true, min: 0, default: 0 },
  thumbnail: { type: String, required: true },
  images: [String],
  tags: [String],
  variants: [variantSchema],
  specifications: { type: Map, of: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  sku: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Text index for search
productSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  return this.price * (1 - this.discountPercentage / 100);
});

// Auto-generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
