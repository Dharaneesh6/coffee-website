import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X, Image } from 'lucide-react';
import { productsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const EMPTY_PRODUCT = {
  title: '', description: '', price: '', discountPercentage: 0,
  category: 'smartphones', brand: '', stock: '', thumbnail: '',
  images: '', tags: '', isFeatured: false, isActive: true
};

const CATEGORIES = ['smartphones','laptops','audio','cameras','accessories','fashion','home-living','sports','beauty','books'];

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product ? {
    ...product,
    images: Array.isArray(product.images) ? product.images.join('\n') : product.images || '',
    tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || ''
  } : EMPTY_PRODUCT);
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        discountPercentage: Number(form.discountPercentage),
        stock: Number(form.stock),
        images: typeof form.images === 'string' ? form.images.split('\n').map(s => s.trim()).filter(Boolean) : form.images,
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : form.tags
      };
      await onSave(data);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-apple-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white rounded-t-3xl flex items-center justify-between px-7 py-5 border-b border-gray-100 z-10">
          <h2 className="font-bold text-apple-gray-dark text-lg">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
          {/* Thumbnail preview */}
          {form.thumbnail && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <img src={form.thumbnail} alt="" className="w-14 h-14 object-contain rounded-xl" />
              <p className="text-xs text-gray-400 truncate">{form.thumbnail}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Product Title *</label>
              <input required value={form.title} onChange={e => set('title', e.target.value)} className="input-field text-sm" placeholder="e.g. iPhone 15 Pro Max" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Brand</label>
              <input value={form.brand} onChange={e => set('brand', e.target.value)} className="input-field text-sm" placeholder="Apple, Samsung..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category *</label>
              <select required value={form.category} onChange={e => set('category', e.target.value)} className="input-field text-sm">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Price ($) *</label>
              <input required type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Discount (%)</label>
              <input type="number" min="0" max="100" value={form.discountPercentage} onChange={e => set('discountPercentage', e.target.value)} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Stock *</label>
              <input required type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} className="input-field text-sm" />
            </div>
            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="rounded" />
                Featured
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="rounded" />
                Active
              </label>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description *</label>
              <textarea required value={form.description} onChange={e => set('description', e.target.value)} className="input-field text-sm h-24 resize-none" placeholder="Product description..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Thumbnail URL *</label>
              <input required value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)} className="input-field text-sm" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Additional Images (one URL per line)</label>
              <textarea value={form.images} onChange={e => set('images', e.target.value)} className="input-field text-sm h-20 resize-none" placeholder="https://image1.jpg&#10;https://image2.jpg" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} className="input-field text-sm" placeholder="apple, iphone, 5g" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Saving...' : (product ? 'Save Changes' : 'Add Product')}</button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | 'add' | product object
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search, category, page],
    queryFn: () => productsAPI.getAll({ search: search || undefined, category: category !== 'all' ? category : undefined, page, limit: 12 })
  });

  const createMutation = useMutation({
    mutationFn: (data) => productsAPI.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['admin-products']); toast.success('Product created'); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productsAPI.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['admin-products']); toast.success('Product updated'); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productsAPI.delete(id),
    onSuccess: () => { queryClient.invalidateQueries(['admin-products']); toast.success('Product removed'); setDeleteConfirm(null); }
  });

  const handleSave = async (formData) => {
    if (modal === 'add') {
      await createMutation.mutateAsync(formData);
    } else {
      await updateMutation.mutateAsync({ id: modal._id, data: formData });
    }
  };

  const products = data?.products || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-apple-gray-dark">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{data?.total || 0} total products</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="input-field text-sm pl-9 py-2"
          />
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="input-field text-sm w-auto py-2 px-3">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
        </select>
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-56 rounded-2xl" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Package className="mx-auto mb-3 opacity-30" size={40} />
          <p>No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-card overflow-hidden group"
            >
              <div className="relative aspect-square bg-gray-50">
                <img src={product.thumbnail} alt={product.title} className="w-full h-full object-contain p-3" />
                {!product.isActive && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <span className="badge bg-gray-100 text-gray-500">Inactive</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal(product)} className="p-1.5 bg-white rounded-lg shadow text-apple-blue hover:bg-blue-50 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setDeleteConfirm(product)} className="p-1.5 bg-white rounded-lg shadow text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                {product.isFeatured && <span className="absolute top-2 left-2 badge bg-apple-blue text-white text-[10px]">Featured</span>}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 uppercase">{product.category}</p>
                <p className="text-sm font-medium text-apple-gray-dark line-clamp-2 leading-tight mt-0.5">{product.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-sm">${product.price}</span>
                  <span className={`text-xs ${product.stock > 10 ? 'text-green-500' : product.stock > 0 ? 'text-orange-500' : 'text-red-400'}`}>
                    {product.stock > 0 ? `${product.stock} left` : 'Out'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${p === page ? 'bg-apple-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Product modal */}
      <AnimatePresence>
        {modal && (
          <ProductModal
            product={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-apple-xl text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="font-bold text-apple-gray-dark mb-2">Remove Product?</h3>
              <p className="text-sm text-gray-400 mb-6 line-clamp-2">{deleteConfirm.title}</p>
              <div className="flex gap-3">
                <button onClick={() => deleteMutation.mutate(deleteConfirm._id)} disabled={deleteMutation.isPending}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-colors">
                  {deleteMutation.isPending ? 'Removing...' : 'Remove'}
                </button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary text-sm">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
