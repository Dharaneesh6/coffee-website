import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlistStore, useCartStore } from '../context/store';
import { ProductCard, EmptyState } from '../components/common/PageLoader';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  const handleMoveToCart = (product) => {
    addItem(product);
    toggle(product);
    openCart();
    toast.success('Moved to cart');
  };

  return (
    <main className="pt-14 bg-gray-50 min-h-screen">
      <div className="page-container py-10">
        <h1 className="section-title mb-8">Wishlist <span className="text-gray-400 font-normal text-2xl">({items.length})</span></h1>
        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save items you love to your wishlist."
            action={<Link to="/" className="btn-primary">Explore Products</Link>}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <Link to={`/product/${product._id}`}>
                  <ProductCard product={product} />
                </Link>
                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 text-xs btn-primary py-2"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggle(product)}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
