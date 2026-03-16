const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: { type: String, required: true },
  images: [String],
  isVerifiedPurchase: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

// Unique review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product rating after review
reviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const reviews = await mongoose.model('Review').find({ product: this.product, isApproved: true });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(this.product, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length
  });
});

module.exports = mongoose.model('Review', reviewSchema);
