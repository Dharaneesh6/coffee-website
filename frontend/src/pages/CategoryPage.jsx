import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid, List, Search } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { ProductCard, SkeletonCard, SectionHeader, EmptyState } from '../components/common/PageLoader';
import { useCartStore } from '../context/store';
import toast from 'react-hot-toast';

// ─── CategoryPage ──────────────────────────────────────────────────────────────
export function CategoryPage() {
  const { category } = useParams();
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const { addItem, openCart } = useCartStore();

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, sort, page],
    queryFn: () => productsAPI.getAll({ category, sort, page, limit: 20 })
  });

  const title = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <main className="pt-14 min-h-screen">
      <div className="page-container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-gray-400 mb-1 capitalize">{category}</p>
            <h1 className="section-title">{title}</h1>
            {data && <p className="text-sm text-gray-400 mt-1">{data.total} products</p>}
          </div>
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="input-field w-auto px-3 py-2 text-sm"
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Top Rated</option>
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : (data?.products || []).map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link to={`/product/${product._id}`}>
                  <ProductCard product={product} />
                </Link>
              </motion.div>
            ))
          }
        </div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${p === page ? 'bg-apple-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ─── SearchPage ────────────────────────────────────────────────────────────────
export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [sort, setSort] = useState('default');

  const { data, isLoading } = useQuery({
    queryKey: ['search', q, sort],
    queryFn: () => productsAPI.getAll({ search: q, sort, limit: 40 }),
    enabled: !!q
  });

  return (
    <main className="pt-14 min-h-screen">
      <div className="page-container py-10">
        <div className="mb-8">
          <h1 className="section-title">
            {q ? `Results for "${q}"` : 'Search Products'}
          </h1>
          {data && <p className="text-sm text-gray-400 mt-1">{data.total} results found</p>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : (data?.products || []).map(product => (
              <Link key={product._id} to={`/product/${product._id}`}>
                <ProductCard product={product} />
              </Link>
            ))
          }
        </div>
        {data?.products?.length === 0 && (
          <EmptyState
            icon={Search}
            title="No results found"
            description={`We couldn't find anything for "${q}". Try a different search.`}
          />
        )}
      </div>
    </main>
  );
}

export default CategoryPage;
