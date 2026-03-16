import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, ChevronRight, MapPin, CreditCard, CheckCircle2, Truck, Clock, X } from 'lucide-react';
import { ordersAPI } from '../utils/api';
import { StatusBadge, EmptyState } from '../components/common/PageLoader';

// ─── OrdersPage ────────────────────────────────────────────────────────────────
export function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersAPI.myOrders({ limit: 20 })
  });

  const orders = data?.orders || [];

  if (isLoading) {
    return (
      <main className="pt-14 min-h-screen">
        <div className="page-container py-10">
          <div className="h-8 w-40 skeleton rounded mb-8" />
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-28 skeleton rounded-2xl" />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-14 bg-gray-50 min-h-screen">
      <div className="page-container py-10">
        <h1 className="section-title mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order, it will appear here."
            action={<Link to="/" className="btn-primary">Start Shopping</Link>}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl shadow-card overflow-hidden"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Order</p>
                      <p className="font-semibold text-apple-gray-dark">{order.orderId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                      <p className="font-medium text-apple-gray-dark">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
                      <p className="font-semibold text-apple-gray-dark">${order.pricing.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <StatusBadge status={order.status} />
                    <Link to={`/orders/${order._id}`} className="flex items-center gap-1 text-apple-blue text-sm hover:underline font-medium">
                      Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="px-6 py-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {order.items.slice(0, 4).map(item => (
                      <div key={item._id} className="flex items-center gap-3">
                        <img src={item.thumbnail} alt={item.title} className="w-12 h-12 object-contain bg-gray-50 rounded-xl p-1" />
                        <div>
                          <p className="text-sm font-medium text-apple-gray-dark line-clamp-1 max-w-xs">{item.title}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity} · ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <span className="text-xs text-gray-400 ml-2">+{order.items.length - 4} more</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ─── OrderDetailPage ───────────────────────────────────────────────────────────
export function OrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersAPI.getOne(id)
  });

  if (isLoading) {
    return (
      <main className="pt-14 min-h-screen">
        <div className="page-container py-10">
          <div className="animate-pulse space-y-4">
            <div className="skeleton h-8 w-48 rounded" />
            <div className="skeleton h-40 rounded-2xl" />
            <div className="skeleton h-64 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  const order = data?.order;
  if (!order) return <div className="pt-14 page-container py-20 text-center text-gray-400">Order not found.</div>;

  const STATUS_STEPS = [
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
  ];

  const statusIndex = STATUS_STEPS.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <main className="pt-14 bg-gray-50 min-h-screen">
      <div className="page-container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Order {order.orderId}</h1>
            <p className="text-sm text-gray-400 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Tracking */}
            {!isCancelled && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="font-semibold text-apple-gray-dark mb-6 text-sm uppercase tracking-wide">Order Progress</h2>
                <div className="relative">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100" />
                  <div
                    className="absolute top-4 left-4 h-0.5 bg-apple-blue transition-all duration-700"
                    style={{ width: `${statusIndex >= 0 ? (statusIndex / (STATUS_STEPS.length - 1)) * 100 : 0}%`, right: 'auto', maxWidth: 'calc(100% - 32px)' }}
                  />
                  <div className="relative flex justify-between">
                    {STATUS_STEPS.map((step, i) => {
                      const done = i <= statusIndex;
                      const Icon = step.icon;
                      return (
                        <div key={step.key} className="flex flex-col items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all z-10 bg-white ${done ? 'border-apple-blue bg-apple-blue' : 'border-gray-200'}`}>
                            <Icon size={14} className={done ? 'text-white' : 'text-gray-300'} />
                          </div>
                          <span className={`text-xs font-medium text-center hidden sm:block ${done ? 'text-apple-blue' : 'text-gray-300'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {order.estimatedDelivery && order.status !== 'delivered' && (
                  <p className="text-xs text-gray-400 mt-5 flex items-center gap-2">
                    <Clock size={12} />
                    Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="font-semibold text-apple-gray-dark mb-4 text-sm uppercase tracking-wide">Items Ordered</h2>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item._id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-contain bg-gray-50 rounded-xl p-2" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-apple-gray-dark">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm text-apple-gray-dark">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Events */}
            {order.trackingEvents?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="font-semibold text-apple-gray-dark mb-4 text-sm uppercase tracking-wide">Tracking History</h2>
                <div className="space-y-4 relative">
                  <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-gray-100" />
                  {[...order.trackingEvents].reverse().map((ev, i) => (
                    <div key={i} className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-apple-blue z-10" />
                      <p className="text-sm font-medium text-apple-gray-dark">{ev.status}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{ev.description}</p>
                      <p className="text-xs text-gray-300 mt-0.5">{new Date(ev.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-card space-y-3 text-sm">
              <h2 className="font-semibold text-apple-gray-dark text-sm uppercase tracking-wide">Delivery Address</h2>
              <div className="flex items-start gap-2 text-gray-500">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                <div>
                  <p className="font-medium text-apple-gray-dark">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card space-y-3 text-sm">
              <h2 className="font-semibold text-apple-gray-dark text-sm uppercase tracking-wide">Payment</h2>
              <div className="flex items-center gap-2 text-gray-500">
                <CreditCard size={14} className="text-gray-400" />
                <span className="capitalize">{order.payment.method === 'cod' ? 'Cash on Delivery' : 'Card'}</span>
                <span className={`badge ${order.payment.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {order.payment.status}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card space-y-2 text-sm">
              <h2 className="font-semibold text-apple-gray-dark text-sm uppercase tracking-wide mb-3">Order Total</h2>
              {[
                { label: 'Subtotal', value: `$${order.pricing.subtotal.toFixed(2)}` },
                { label: 'Shipping', value: order.pricing.shipping === 0 ? 'Free' : `$${order.pricing.shipping.toFixed(2)}` },
                { label: 'Tax', value: `$${order.pricing.tax.toFixed(2)}` }
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-gray-500">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-apple-gray-dark pt-2 border-t border-gray-100 text-base">
                <span>Total</span>
                <span>${order.pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrdersPage;
