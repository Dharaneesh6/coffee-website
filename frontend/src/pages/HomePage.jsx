import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Shield, Truck, RefreshCw } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCartStore } from '../context/store';
import { ProductCard, SkeletonCard, SectionHeader } from '../components/common/PageLoader';
import toast from 'react-hot-toast';

const HERO_SLIDES = [
  {
    title: 'iPhone 15 Pro Max',
    subtitle: 'Titanium. So strong. So light. So Pro.',
    description: 'A17 Pro chip. A monster win for gaming.',
    cta: 'Shop Now',
    link: '/category/smartphones',
    bg: 'from-slate-900 via-blue-950 to-slate-900',
    accent: '#0071e3',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80'
  },
  {
    title: 'MacBook Pro M3 Max',
    subtitle: 'Mind-blowing. Head-turning.',
    description: 'Up to 22 hours battery. The most powerful notebook.',
    cta: 'Explore',
    link: '/category/laptops',
    bg: 'from-gray-900 via-gray-800 to-gray-900',
    accent: '#f5f5f7',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
  },
  {
    title: 'Sony WH-1000XM5',
    subtitle: 'Silence. Redefined.',
    description: 'Industry-leading noise cancellation. 30 hours battery.',
    cta: 'Listen Now',
    link: '/category/audio',
    bg: 'from-zinc-900 via-zinc-800 to-zinc-900',
    accent: '#ff9500',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
  }
];

const CATEGORIES = [
  { slug: 'smartphones', label: 'Smartphones', emoji: '📱', color: 'from-blue-50 to-blue-100' },
  { slug: 'laptops', label: 'Laptops', emoji: '💻', color: 'from-slate-50 to-slate-100' },
  { slug: 'audio', label: 'Audio', emoji: '🎧', color: 'from-purple-50 to-purple-100' },
  { slug: 'cameras', label: 'Cameras', emoji: '📷', color: 'from-amber-50 to-amber-100' },
  { slug: 'accessories', label: 'Accessories', emoji: '⌚', color: 'from-green-50 to-green-100' },
  { slug: 'fashion', label: 'Fashion', emoji: '👗', color: 'from-pink-50 to-pink-100' },
  { slug: 'home-living', label: 'Home', emoji: '🏠', color: 'from-orange-50 to-orange-100' },
  { slug: 'sports', label: 'Sports', emoji: '🏋️', color: 'from-teal-50 to-teal-100' },
  { slug: 'beauty', label: 'Beauty', emoji: '✨', color: 'from-rose-50 to-rose-100' },
  { slug: 'books', label: 'Books', emoji: '📚', color: 'from-yellow-50 to-yellow-100' },
];

function HeroSlider() {
  const [current, setCurrent] = React.useState(0);
  const timerRef = useRef(null);

  React.useEffect(() => {
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl" style={{ height: '520px' }}>
      <motion.div
        key={current}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className={`absolute inset-0 bg-gradient-to-br ${slide.bg} flex items-center`}
      >
        {/* Content */}
        <div className="relative z-10 px-12 md:px-20 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3"
          >
            New Release
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight"
          >
            {slide.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white/80 mt-3 font-light"
          >
            {slide.subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-sm text-white/60 mt-1"
          >
            {slide.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-4 mt-8"
          >
            <Link
              to={slide.link}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-apple-gray-dark font-semibold rounded-full hover:bg-gray-100 transition-all text-sm"
            >
              {slide.cta} <ArrowRight size={14} />
            </Link>
            <Link to={slide.link} className="text-white/70 hover:text-white text-sm transition-colors">
              Learn more →
            </Link>
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="absolute right-0 inset-y-0 w-1/2 hidden md:flex items-center justify-center p-10"
        >
          <img src={slide.image} alt={slide.title} className="max-h-96 w-auto object-contain drop-shadow-2xl" />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/20 to-transparent hidden md:block" />
      </motion.div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); clearInterval(timerRef.current); }}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`}
          />
        ))}
      </div>

      {/* Arrows */}
      {[{dir: -1, Icon: ChevronLeft, pos: 'left-4'}, {dir: 1, Icon: ChevronRight, pos: 'right-4'}].map(({dir, Icon, pos}) => (
        <button
          key={dir}
          onClick={() => setCurrent(c => (c + dir + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className={`absolute ${pos} top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm`}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
}

function CategoryGrid() {
  return (
    <div className="grid grid-cols-5 lg:grid-cols-10 gap-3">
      {CATEGORIES.map((cat, i) => (
        <motion.div
          key={cat.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
        >
          <Link
            to={`/category/${cat.slug}`}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl bg-gradient-to-br ${cat.color} hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-center`}
          >
            <span className="text-2xl">{cat.emoji}</span>
            <span className="text-xs font-medium text-apple-gray-dark">{cat.label}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function ProductRow({ category, title }) {
  const scrollRef = useRef(null);
  const { addItem, openCart } = useCartStore();
  const { data, isLoading } = useQuery({
    queryKey: ['products-category', category],
    queryFn: () => productsAPI.getByCategory(category),
    staleTime: 10 * 60 * 1000
  });

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  const handleAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
    toast.success(`${product.title.slice(0, 25)}... added`);
  };

  const products = data?.products || [];

  return (
    <section>
      <SectionHeader
        title={title}
        action={
          <Link to={`/category/${category}`} className="btn-ghost text-sm flex items-center gap-1">
            See all <ArrowRight size={14} />
          </Link>
        }
      />
      <div className="relative group">
        {['left', 'right'].map((dir) => (
          <button
            key={dir}
            onClick={() => scroll(dir === 'left' ? -1 : 1)}
            className={`absolute ${dir === 'left' ? '-left-4' : '-right-4'} top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-apple flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:shadow-apple-lg`}
          >
            {dir === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        ))}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 scroll-snap-x scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading
            ? Array(5).fill(0).map((_, i) => <div key={i} className="flex-shrink-0 w-56"><SkeletonCard /></div>)
            : products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="flex-shrink-0 w-56 scroll-snap-start"
              >
                <ProductCard
                  product={product}
                  onAddToCart={(e) => handleAdd(e, product)}
                />
              </Link>
            ))
          }
        </div>
      </div>
    </section>
  );
}

function FeaturedBanner() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[
        {
          title: 'AirPods Pro', subtitle: 'Adaptive Audio. Now everywhere.',
          bg: 'bg-gradient-to-br from-gray-900 to-gray-700',
          img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80',
          link: '/category/audio', cta: 'Shop AirPods', textLight: true
        },
        {
          title: 'Apple Watch Ultra 2', subtitle: 'Precision. Endurance. Adventure.',
          bg: 'bg-gradient-to-br from-amber-50 to-orange-100',
          img: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80',
          link: '/category/accessories', cta: 'Explore Watch', textLight: false
        }
      ].map((item) => (
        <motion.div
          key={item.title}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className={`${item.bg} rounded-3xl p-8 flex items-center justify-between overflow-hidden min-h-[220px]`}
        >
          <div>
            <h3 className={`text-2xl font-bold ${item.textLight ? 'text-white' : 'text-apple-gray-dark'}`}>{item.title}</h3>
            <p className={`text-sm mt-1 ${item.textLight ? 'text-white/70' : 'text-gray-500'}`}>{item.subtitle}</p>
            <Link
              to={item.link}
              className={`inline-flex items-center gap-2 mt-5 text-sm font-medium ${item.textLight ? 'text-white/90 hover:text-white' : 'text-apple-blue hover:underline'}`}
            >
              {item.cta} <ArrowRight size={13} />
            </Link>
          </div>
          <img src={item.img} alt={item.title} className="h-36 w-auto object-contain" />
        </motion.div>
      ))}
    </div>
  );
}

function TrustBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { icon: Truck, title: 'Free Shipping', desc: 'On orders over $999' },
        { icon: Shield, title: 'Secure Payments', desc: 'SSL encrypted checkout' },
        { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
        { icon: Zap, title: 'Fast Delivery', desc: '2-5 business days' }
      ].map(({ icon: Icon, title, desc }) => (
        <div key={title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
          <div className="p-2 bg-white rounded-xl shadow-sm flex-shrink-0">
            <Icon size={18} className="text-apple-blue" />
          </div>
          <div>
            <p className="text-sm font-semibold text-apple-gray-dark">{title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: featuredData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsAPI.getAll({ featured: true, limit: 8 }),
    staleTime: 10 * 60 * 1000
  });

  const { addItem, openCart } = useCartStore();
  const navigate = useNavigate();

  const handleAddFeatured = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
    toast.success('Added to cart');
  };

  return (
    <main className="pt-14">
      {/* Hero */}
      <section className="page-container py-6">
        <HeroSlider />
      </section>

      {/* Categories */}
      <section className="page-container py-8">
        <CategoryGrid />
      </section>

      {/* Trust bar */}
      <section className="page-container py-4">
        <TrustBar />
      </section>

      {/* Featured products */}
      <section className="page-container py-12">
        <SectionHeader title="Featured" subtitle="Handpicked just for you" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {(featuredData?.products || []).map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={`/product/${product._id}`}>
                <ProductCard product={product} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Banner */}
      <section className="page-container py-6">
        <FeaturedBanner />
      </section>

      {/* Category rows */}
      <div className="page-container space-y-14 py-12">
        <ProductRow category="smartphones" title="Smartphones" />
        <ProductRow category="laptops" title="Laptops" />
        <ProductRow category="audio" title="Audio" />
        <ProductRow category="cameras" title="Cameras" />
        <ProductRow category="fashion" title="Fashion" />
      </div>

      {/* Footer */}
      <footer className="bg-apple-gray mt-16 border-t border-gray-200">
        <div className="page-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            {[
              { title: 'Shop', links: ['Smartphones', 'Laptops', 'Audio', 'Cameras', 'Accessories'] },
              { title: 'Support', links: ['Contact Us', 'Order Tracking', 'Returns & Refunds', 'FAQ'] },
              { title: 'Company', links: ['About', 'Careers', 'Press', 'Blog'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy'] }
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-semibold text-apple-gray-dark mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map(l => (
                    <li key={l}><Link to="#" className="text-gray-400 hover:text-apple-gray-dark transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-apple-gray-dark rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">L</span>
              </div>
              <span className="font-semibold text-apple-gray-dark">Luminia</span>
            </div>
            <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Luminia, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
