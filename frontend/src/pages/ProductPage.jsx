import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Zap, ChevronLeft, Shield, Truck, RefreshCw, Plus, Minus } from 'lucide-react';
import { productsAPI, reviewsAPI } from '../utils/api';
import { useCartStore, useWishlistStore, useAuthStore } from '../context/store';
import { StarRating, SkeletonCard, ProductCard } from '../components/common/PageLoader';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ open: false, rating: 5, comment: '' });
  const { addItem, openCart } = useCartStore();
  const { toggle, isWished } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getOne(id)
  });

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsAPI.getForProduct(id)
  });

  const { data: similarData } = useQuery({
    queryKey: ['similar', productData?.product?.category],
    queryFn: () => productsAPI.getByCategory(productData.product.category),
    enabled: !!productData?.product?.category
  });

  if (isLoading) {
    return (
      <main className="pt-14">
        <div className="page-container py-12">
          <div className="grid md:grid-cols-2 gap-16 animate-pulse">
            <div className="skeleton aspect-square rounded-3xl" />
            <div className="space-y-4">
              <div className="skeleton h-6 w-2/3 rounded" />
              <div className="skeleton h-10 w-full rounded" />
              <div className="skeleton h-8 w-1/3 rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  const product = productData?.product;
  if (!product) return <div className="pt-14 page-container py-20 text-center text-gray-400">Product not found.</div>;

  const images = product.images?.length ? product.images : [product.thumbnail];
  const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
  const reviews = reviewsData?.reviews || [];
  const similar = (similarData?.products || []).filter(p => p._id !== product._id).slice(0, 5);

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) { navigate('/login?redirect=/checkout'); return; }
    addItem(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await reviewsAPI.submit(id, { rating: reviewForm.rating, comment: reviewForm.comment });
      toast.success('Review submitted!');
      setReviewForm({ open: false, rating: 5, comment: '' });
      refetchReviews();
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    }
  };

  return (
    <main className="pt-14 bg-white">
      <div className="page-container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-apple-gray-dark transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-apple-gray-dark transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-apple-gray-dark truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center"
            >
              <img
                src={images[selectedImg]}
                alt={product.title}
                className="w-full h-full object-contain p-8"
              />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${i === selectedImg ? 'border-apple-blue' : 'border-transparent bg-gray-50'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {product.brand && <p className="text-sm text-apple-blue font-semibold uppercase tracking-wide">{product.brand}</p>}
            <h1 className="text-3xl font-bold text-apple-gray-dark leading-tight">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} size={16} showValue />
              <span className="text-sm text-gray-400">({product.reviewCount?.toLocaleString() || reviews.length} reviews)</span>
              <span className="text-green-500 text-sm font-medium">{product.sold?.toLocaleString()} sold</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-apple-gray-dark">${discountedPrice.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-xl text-gray-300 line-through">${product.price.toFixed(2)}</span>
                  <span className="badge bg-red-100 text-red-600">Save {Math.round(product.discountPercentage)}%</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className={`inline-flex items-center gap-2 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>

            <p className="text-gray-500 leading-relaxed">{product.description}</p>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-apple-gray-dark">Quantity</span>
                <div className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-gray-500 hover:text-apple-gray-dark">
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="text-gray-500 hover:text-apple-gray-dark">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Zap size={16} />
                Buy Now
              </button>
              <button
                onClick={() => toggle(product)}
                className={`p-3 rounded-full border transition-all ${isWished(product._id) ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-200 text-gray-400'}`}
              >
                <Heart size={18} fill={isWished(product._id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {[
                { icon: Truck, label: 'Free shipping', sub: 'On orders $999+' },
                { icon: RefreshCw, label: '30-day returns', sub: 'Hassle-free' },
                { icon: Shield, label: 'Secure checkout', sub: 'SSL encrypted' }
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1 p-3 bg-gray-50 rounded-2xl">
                  <Icon size={16} className="text-apple-blue" />
                  <span className="text-xs font-medium text-apple-gray-dark">{label}</span>
                  <span className="text-[10px] text-gray-400">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-20 border-t border-gray-100 pt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={product.rating} size={18} showValue />
                <span className="text-gray-400 text-sm">Based on {reviews.length} reviews</span>
              </div>
            </div>
            <button
              onClick={() => isAuthenticated ? setReviewForm(f => ({ ...f, open: !f.open })) : navigate('/login')}
              className="btn-primary text-sm"
            >
              Write a Review
            </button>
          </div>

          {/* Review form */}
          {reviewForm.open && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleReviewSubmit}
              className="mb-8 p-6 bg-gray-50 rounded-2xl space-y-4"
            >
              <h3 className="font-semibold text-apple-gray-dark">Your Review</h3>
              <div>
                <p className="text-sm text-gray-500 mb-2">Rating</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
                      <Star size={24} className={s <= reviewForm.rating ? 'text-amber-400' : 'text-gray-200'} fill={s <= reviewForm.rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                required
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                placeholder="Share your experience..."
                className="input-field h-28 resize-none"
              />
              <div className="flex gap-3">
                <button type="submit" className="btn-primary text-sm">Submit Review</button>
                <button type="button" onClick={() => setReviewForm(f => ({ ...f, open: false }))} className="btn-secondary text-sm">Cancel</button>
              </div>
            </motion.form>
          )}

          {/* Review list */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="pb-6 border-b border-gray-100 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-apple-blue/10 rounded-full flex items-center justify-center text-apple-blue font-semibold text-sm flex-shrink-0">
                      {review.user?.firstName?.[0] || review.user?.email?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-apple-gray-dark">
                          {review.user?.firstName ? `${review.user.firstName} ${review.user.lastName || ''}`.trim() : 'Customer'}
                        </span>
                        <StarRating rating={review.rating} size={12} />
                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      {review.title && <p className="font-medium text-sm mt-1">{review.title}</p>}
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Similar products */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {similar.map(p => (
                <Link key={p._id} to={`/product/${p._id}`}>
                  <ProductCard product={p} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
