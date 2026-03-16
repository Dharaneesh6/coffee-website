const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  thumbnail: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  variant: Object
});

const trackingEventSchema = new mongoose.Schema({
  status: String,
  description: String,
  location: String,
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' }
  },
  pricing: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 5 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  payment: {
    method: { type: String, enum: ['card', 'cod', 'upi', 'netbanking'], required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingNumber: String,
  trackingEvents: [trackingEventSchema],
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  notes: String
}, { timestamps: true });

// Auto-generate order ID
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `LMN-${String(count + 1001).padStart(6, '0')}`;
    // Set estimated delivery (5-7 days)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 6);
    this.estimatedDelivery = deliveryDate;
    // Add initial tracking event
    this.trackingEvents = [{
      status: 'Order Placed',
      description: 'Your order has been placed successfully',
      timestamp: new Date()
    }];
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
