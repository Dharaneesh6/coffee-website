import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { useWishlistStore } from '../../context/store';

// Page loader
export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-gray-200 border-t-apple-blue rounded-full"
      />
    </div>
  );
}

// Skeleton card
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton h-56 w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-5 w-1/3 rounded mt-3" />
      </div>
    </div>
  );
}

// Star rating
export function StarRating({ rating = 0, size = 14, showValue = false, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}
            fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
      {showValue && <span className="text-xs text-gray-500 font-medium">{Number(rating).toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-gray-400">({count.toLocaleString()})</span>}
    </div>
  );
}

// Product card
export function ProductCard({ product, onAddToCart, className = '' }) {
  const { toggle, isWished } = useWishlistStore();
  const wished = isWished(product._id);
  const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
  const fallbackImage = 'https://via.placeholder.com/600x600?text=No+Image';
  const primaryImage = product.thumbnail || (Array.isArray(product.images) && product.images[0]) || fallbackImage;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`card card-hover group cursor-pointer ${className}`}
    >
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            if (e.target.src !== fallbackImage) {
              e.target.src = fallbackImage;
            }
          }}
          
        />
        {product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 badge bg-red-500 text-white text-[10px]">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product); }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${wished ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100'}`}
        >
          <Heart size={14} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-4">
        {product.brand && <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{product.brand}</p>}
        <h3 className="text-sm font-medium text-apple-gray-dark line-clamp-2 mt-0.5 leading-snug">{product.title}</h3>
        <StarRating rating={product.rating} count={product.reviewCount} size={11} className="mt-1" />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-apple-gray-dark">${discountedPrice.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          {product.stock === 0 && <span className="text-xs text-red-400">Out of stock</span>}
        </div>
      </div>
    </motion.div>
  );
}

// Section header
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// Empty state
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {Icon && <Icon size={28} className="text-gray-300" />}
      </div>
      <h3 className="font-semibold text-apple-gray-dark mb-1">{title}</h3>
      {description && <p className="text-gray-400 text-sm max-w-xs">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// Badge
export function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    processing: 'bg-purple-50 text-purple-700',
    shipped: 'bg-indigo-50 text-indigo-700',
    out_for_delivery: 'bg-orange-50 text-orange-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-600',
    returned: 'bg-gray-100 text-gray-600'
  };
  const labels = {
    pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing',
    shipped: 'Shipped', out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
    cancelled: 'Cancelled', returned: 'Returned'
  };
  return (
    <span className={`badge ${styles[status] || 'bg-gray-100 text-gray-600'} capitalize`}>
      {labels[status] || status}
    </span>
  );
}
