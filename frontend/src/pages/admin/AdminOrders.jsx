import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Package } from 'lucide-react';
import { ordersAPI } from '../../utils/api';
import { StatusBadge } from '../../components/common/PageLoader';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['pending','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','returned'];

function OrderDetailModal({ order, onClose, onUpdateStatus }) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [description, setDescription] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (newStatus === order.status && !trackingNumber && !description) { onClose(); return; }
    setUpdating(true);
    try {
      await onUpdateStatus(order._id, { status: newStatus, trackingNumber, description });
      toast.success('Order updated');
      onClose();
    } catch { toast.error('Failed to update'); }
    finally { setUpdating(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-apple-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-apple-gray-dark">{order.orderId}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="px-7 py-5 space-y-5">
          {/* Customer */}
          <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-1">
            <p className="font-semibold text-apple-gray-dark">
              {order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ''}`.trim() : 'Customer'}
            </p>
            <p className="text-gray-400">{order.user?.email}</p>
            <p className="text-gray-400 mt-2">{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
            <p className="text-gray-400">{order.shippingAddress?.phone}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Items</p>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item._id} className="flex items-center gap-3 py-2">
                  <img src={item.thumbnail} alt="" className="w-10 h-10 rounded-xl bg-gray-50 object-contain p-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} · ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold text-sm">
              <span>Total</span>
              <span>${order.pricing?.total?.toFixed(2)}</span>
            </div>
          </div>

          {/* Update status */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Update Status</p>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field text-sm">
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tracking Number</label>
              <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="input-field text-sm" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Note / Description</label>
              <input value={description} onChange={e => setDescription(e.target.value)} className="input-field text-sm" placeholder="Optional update message" />
            </div>
            <button onClick={handleUpdate} disabled={updating} className="btn-primary w-full text-sm">
              {updating ? 'Updating...' : 'Update Order'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', search, statusFilter, page],
    queryFn: () => ordersAPI.getAll({ search: search || undefined, status: statusFilter, page, limit: 15 })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => ordersAPI.updateStatus(id, data),
    onSuccess: () => queryClient.invalidateQueries(['admin-orders'])
  });

  const orders = data?.orders || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-apple-gray-dark">Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">{data?.total || 0} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search order ID..." className="input-field text-sm pl-9 py-2" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', ...ORDER_STATUSES].map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${statusFilter === s ? 'bg-apple-blue text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Package className="mx-auto mb-3 opacity-30" size={36} />
            <p className="text-sm">No orders found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                {['Order', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="px-4 py-3 font-semibold text-apple-gray-dark">{order.orderId}</td>
                  <td className="px-4 py-3 max-w-[150px]">
                    <p className="font-medium text-apple-gray-dark truncate">
                      {order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ''}`.trim() : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-500">{order.items?.length}</td>
                  <td className="px-4 py-3 font-semibold text-apple-gray-dark">${order.pricing?.total?.toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize text-gray-500">{order.payment?.method === 'cod' ? 'COD' : 'Card'}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3">
                    <button className="text-apple-blue hover:underline text-xs font-medium">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${p === page ? 'bg-apple-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Order detail modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={(id, data) => updateMutation.mutateAsync({ id, data })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
