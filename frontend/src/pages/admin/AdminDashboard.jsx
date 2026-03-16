import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingBag, Users, Package, DollarSign, ArrowUpRight } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { StatusBadge } from '../../components/common/PageLoader';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const STATUS_COLORS = { pending:'#ff9500', confirmed:'#0071e3', processing:'#5856d6', shipped:'#34aadc', out_for_delivery:'#ff6b00', delivered:'#30d158', cancelled:'#ff3b30', returned:'#8e8e93' };

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-apple-gray-dark mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminAPI.getStats(),
    refetchInterval: 60000
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="skeleton h-72 rounded-2xl" />
          <div className="skeleton h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  const monthlyData = (stats.monthlyRevenue || []).map(item => ({
    name: MONTH_NAMES[(item._id?.month || 1) - 1],
    revenue: Math.round(item.revenue || 0),
    orders: item.orders || 0
  }));

  const statusData = (stats.ordersByStatus || []).map(item => ({
    name: item._id?.replace(/_/g, ' ') || 'unknown',
    value: item.count,
    color: STATUS_COLORS[item._id] || '#8e8e93'
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-apple-gray-dark">Dashboard</h1>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${Number(stats.totalRevenue || 0).toLocaleString()}`} sub={`Avg. $${Number(stats.avgOrderValue || 0).toFixed(0)} per order`} color="bg-apple-blue" delay={0} />
        <StatCard icon={ShoppingBag} label="Total Orders" value={(stats.totalOrders || 0).toLocaleString()} color="bg-purple-500" delay={0.05} />
        <StatCard icon={Users} label="Customers" value={(stats.totalUsers || 0).toLocaleString()} color="bg-green-500" delay={0.1} />
        <StatCard icon={Package} label="Products" value={(stats.totalProducts || 0).toLocaleString()} sub={`${stats.totalReviews || 0} reviews`} color="bg-orange-500" delay={0.15} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold text-apple-gray-dark mb-5">Revenue & Orders (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8e8e93' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8e8e93' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#0071e3" strokeWidth={2.5} dot={{ r: 4, fill: '#0071e3' }} name="Revenue ($)" />
              <Line type="monotone" dataKey="orders" stroke="#30d158" strokeWidth={2} dot={{ r: 3, fill: '#30d158' }} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold text-apple-gray-dark mb-5">Order Status</h2>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {statusData.slice(0, 5).map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-gray-500 capitalize">{item.name}</span>
                    </div>
                    <span className="font-semibold text-apple-gray-dark">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No orders yet</div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top products */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold text-apple-gray-dark mb-4">Top Products</h2>
          <div className="space-y-3">
            {(stats.topProducts || []).length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No sales data yet</p>
            ) : (
              (stats.topProducts || []).map((product, i) => (
                <div key={product._id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                  <img src={product.thumbnail} alt="" className="w-10 h-10 object-contain rounded-xl bg-gray-50 p-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-apple-gray-dark line-clamp-1">{product.title}</p>
                    <p className="text-xs text-gray-400">{product.sold || 0} sold · ${product.price}</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
                    <ArrowUpRight size={12} />
                    {product.rating?.toFixed(1)}★
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold text-apple-gray-dark mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {(stats.recentOrders || []).length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No orders yet</p>
            ) : (
              (stats.recentOrders || []).map(order => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-apple-gray-dark">{order.orderId}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[180px]">
                      {order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ''}`.trim() : order.user?.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={order.status} />
                    <p className="text-xs text-gray-400 mt-1">${order.pricing?.total?.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
