import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, Banknote, CheckCircle2, Package, MapPin, Clock } from 'lucide-react';
import { useCartStore, useAuthStore } from '../context/store';
import { ordersAPI, authAPI } from '../utils/api';
import { EmptyState, StatusBadge } from '../components/common/PageLoader';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// ─── CartPage ──────────────────────────────────────────────────────────────────
export function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getShipping, getTax, getTotal, getItemCount } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const discountedPrice = (item) => item.price * (1 - (item.discountPercentage || 0) / 100);

  if (items.length === 0) {
    return (
      <main className="pt-14 min-h-screen">
        <div className="page-container py-20">
          <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Add items to your cart to get started."
            action={<Link to="/" className="btn-primary">Start Shopping</Link>} />
        </div>
      </main>
    );
  }

  return (
    <main className="pt-14 bg-gray-50 min-h-screen">
      <div className="page-container py-10">
        <h1 className="section-title mb-8">Shopping Cart <span className="text-gray-400 font-normal text-2xl">({getItemCount()})</span></h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <motion.div key={item._id} layout className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-card">
                <Link to={`/product/${item._id}`}>
                  <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-contain rounded-xl bg-gray-50 p-2" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item._id}`}>
                    <h3 className="font-medium text-apple-gray-dark line-clamp-2 text-sm">{item.title}</h3>
                  </Link>
                  {item.brand && <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p>}
                  <p className="font-semibold text-apple-gray-dark mt-1">${discountedPrice(item).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-gray-400 hover:text-apple-gray-dark"><Minus size={12} /></button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="text-gray-400 hover:text-apple-gray-dark"><Plus size={12} /></button>
                </div>
                <p className="font-semibold text-apple-gray-dark w-16 text-right">${(discountedPrice(item) * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(item._id)} className="text-gray-300 hover:text-red-400 transition-colors p-1">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-card h-fit sticky top-20 space-y-4">
            <h2 className="font-semibold text-apple-gray-dark text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: `Subtotal (${getItemCount()} items)`, value: `$${getSubtotal().toFixed(2)}` },
                { label: 'Shipping', value: getShipping() === 0 ? 'Free' : `$${getShipping().toFixed(2)}` },
                { label: 'Tax (18%)', value: `$${getTax().toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-gray-500">
                  <span>{label}</span>
                  <span className={value === 'Free' ? 'text-green-500 font-medium' : ''}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-apple-gray-dark text-base pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/login?redirect=/checkout')}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            {getSubtotal() < 999 && (
              <p className="text-xs text-center text-gray-400">
                Add ${(999 - getSubtotal()).toFixed(2)} more for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── CheckoutPage ──────────────────────────────────────────────────────────────
export function CheckoutPage() {
  const { items, getSubtotal, getShipping, getTax, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({ fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(), phone: '', address: '', city: '', state: '', postalCode: '', country: 'India' });
  const [payment, setPayment] = useState({ method: 'card', number: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const e = {};
    if (!shipping.fullName) e.fullName = 'Required';
    if (!/^\d{10}$/.test(shipping.phone)) e.phone = 'Must be 10 digits';
    if (!shipping.address) e.address = 'Required';
    if (!shipping.city) e.city = 'Required';
    if (!/^\d{6}$/.test(shipping.postalCode)) e.postalCode = 'Must be 6 digits';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validateStep2 = () => {
    if (payment.method === 'cod') return true;
    const e = {};
    if (!/^\d{16}$/.test(payment.number)) e.number = 'Must be 16 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry)) e.expiry = 'Format: MM/YY';
    if (!/^\d{3,4}$/.test(payment.cvv)) e.cvv = '3-4 digits';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: shipping,
        payment: { method: payment.method }
      };
      const res = await ordersAPI.create(orderData);
      clearCart();
      setOrderPlaced(res.order);
      setStep(4);
    } catch (err) {
      toast.error(err.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 4 && orderPlaced) {
    return (
      <main className="pt-14 min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-apple-lg mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-apple-gray-dark mb-2">Order Confirmed!</h2>
          <p className="text-gray-400 text-sm mb-1">Order ID: <span className="font-semibold text-apple-gray-dark">{orderPlaced.orderId}</span></p>
          <p className="text-gray-400 text-sm mb-8">We'll send updates to your email.</p>
          <div className="flex gap-3">
            <Link to="/orders" className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"><Package size={14} />View Orders</Link>
            <Link to="/" className="flex-1 btn-secondary text-sm">Continue Shopping</Link>
          </div>
        </motion.div>
      </main>
    );
  }

  const STEPS = ['Shipping', 'Payment', 'Review'];

  return (
    <main className="pt-14 bg-gray-50 min-h-screen">
      <div className="page-container py-10">
        <h1 className="section-title mb-8">Checkout</h1>

        {/* Progress */}
        <div className="flex items-center mb-10 max-w-lg">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-apple-blue' : 'text-gray-300'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i + 1 < step ? 'bg-apple-blue border-apple-blue text-white' : i + 1 === step ? 'border-apple-blue text-apple-blue' : 'border-gray-200 text-gray-300'}`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{s}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 mx-3 transition-all ${i + 1 < step ? 'bg-apple-blue' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 1 - Shipping */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-8 shadow-card space-y-4">
                <h2 className="font-semibold text-apple-gray-dark text-lg mb-6">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'fullName', label: 'Full Name', span: 2 },
                    { key: 'phone', label: 'Phone', type: 'tel' },
                    { key: 'postalCode', label: 'Postal Code', type: 'text' },
                    { key: 'address', label: 'Address', span: 2 },
                    { key: 'city', label: 'City' },
                    { key: 'state', label: 'State' },
                  ].map(({ key, label, span, type = 'text' }) => (
                    <div key={key} className={span === 2 ? 'col-span-2' : ''}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                      <input
                        type={type}
                        value={shipping[key]}
                        onChange={e => setShipping(s => ({ ...s, [key]: e.target.value }))}
                        className={`input-field ${errors[key] ? 'border-red-400 ring-red-200' : ''}`}
                      />
                      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                    </div>
                  ))}
                </div>
                <button onClick={() => validateStep1() && setStep(2)} className="btn-primary w-full mt-4">
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Step 2 - Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-8 shadow-card space-y-4">
                <h2 className="font-semibold text-apple-gray-dark text-lg mb-6">Payment Method</h2>
                {[
                  { value: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                  { value: 'cod', label: 'Cash on Delivery', icon: Banknote }
                ].map(({ value, label, icon: Icon }) => (
                  <label key={value} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${payment.method === value ? 'border-apple-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={value} checked={payment.method === value} onChange={() => setPayment(p => ({ ...p, method: value }))} className="sr-only" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${payment.method === value ? 'border-apple-blue' : 'border-gray-300'}`}>
                      {payment.method === value && <div className="w-2 h-2 rounded-full bg-apple-blue" />}
                    </div>
                    <Icon size={18} className="text-gray-500" />
                    <span className="font-medium text-sm text-apple-gray-dark">{label}</span>
                  </label>
                ))}
                {payment.method === 'card' && (
                  <div className="space-y-3 mt-2">
                    {[
                      { key: 'number', label: 'Card Number', placeholder: '•••• •••• •••• ••••', maxLength: 16 },
                      { key: 'expiry', label: 'Expiry Date', placeholder: 'MM/YY', maxLength: 5 },
                      { key: 'cvv', label: 'CVV', placeholder: '•••', maxLength: 4 }
                    ].map(({ key, label, placeholder, maxLength }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                        <input
                          type={key === 'cvv' ? 'password' : 'text'}
                          value={payment[key]}
                          onChange={e => setPayment(p => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          maxLength={maxLength}
                          className={`input-field ${errors[key] ? 'border-red-400' : ''}`}
                        />
                        {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                  <button onClick={() => validateStep2() && setStep(3)} className="btn-primary flex-1">Review Order</button>
                </div>
              </motion.div>
            )}

            {/* Step 3 - Review */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-8 shadow-card space-y-6">
                <h2 className="font-semibold text-apple-gray-dark text-lg">Review Order</h2>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-1 text-sm">
                  <p className="font-medium text-apple-gray-dark flex items-center gap-2"><MapPin size={14} />{shipping.fullName}</p>
                  <p className="text-gray-500 pl-5">{shipping.address}, {shipping.city} {shipping.postalCode}</p>
                  <p className="text-gray-500 pl-5">{shipping.phone}</p>
                </div>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item._id} className="flex items-center gap-3">
                      <img src={item.thumbnail} alt="" className="w-12 h-12 object-contain bg-gray-50 rounded-xl p-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-apple-gray-dark line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">${(item.price * (1 - (item.discountPercentage || 0) / 100) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                  <button onClick={placeOrder} disabled={loading} className="btn-primary flex-1">
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-card h-fit sticky top-20">
            <h3 className="font-semibold text-apple-gray-dark mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Shipping</span><span className={getShipping() === 0 ? 'text-green-500' : ''}>{getShipping() === 0 ? 'Free' : `$${getShipping().toFixed(2)}`}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax (18%)</span><span>${getTax().toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-apple-gray-dark text-base pt-3 border-t border-gray-100">
                <span>Total</span><span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CartPage;
