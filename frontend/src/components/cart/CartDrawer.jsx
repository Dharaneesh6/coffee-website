import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore, useAuthStore } from '../../context/store';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getShipping, getTax, getTotal, getItemCount } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const discountedPrice = (item) => item.price * (1 - (item.discountPercentage || 0) / 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-apple-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={20} className="text-apple-gray-dark" />
                <h2 className="font-semibold text-apple-gray-dark">Cart</h2>
                {getItemCount() > 0 && (
                  <span className="badge bg-apple-blue text-white">{getItemCount()}</span>
                )}
              </div>
              <button onClick={closeCart} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center pb-20">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <p className="text-apple-gray-dark font-medium mb-1">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mb-6">Add some products to get started</p>
                  <button onClick={closeCart} className="btn-primary text-sm px-5 py-2.5">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 p-3 bg-gray-50 rounded-2xl"
                  >
                    <Link to={`/product/${item._id}`} onClick={closeCart} className="flex-shrink-0">
                      <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-contain rounded-xl bg-white p-1" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item._id}`} onClick={closeCart}>
                        <p className="text-sm font-medium text-apple-gray-dark line-clamp-2 leading-tight">{item.title}</p>
                      </Link>
                      <p className="text-apple-blue font-semibold text-sm mt-1">
                        ${discountedPrice(item).toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2 bg-white rounded-full px-2 py-1 border border-gray-200">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-gray-500 hover:text-apple-gray-dark transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="text-gray-500 hover:text-apple-gray-dark transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item._id)} className="text-gray-300 hover:text-red-400 transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span>{getShipping() === 0 ? <span className="text-green-500">Free</span> : `$${getShipping().toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax (18%)</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-apple-gray-dark text-base pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center space-x-2">
                  <span>Checkout</span>
                  <ArrowRight size={16} />
                </button>
                <Link to="/cart" onClick={closeCart} className="block text-center text-sm text-apple-blue hover:underline">
                  View full cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
