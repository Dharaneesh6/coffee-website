import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../context/store';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users }
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (item) => item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  return (
    <div className="flex min-h-screen bg-gray-50 pt-14">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed left-0 top-14 bottom-0 bg-white border-r border-gray-100 z-40 flex flex-col overflow-hidden shadow-sm"
      >
        {/* Toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <div className="w-6 h-6 bg-apple-gray-dark rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="font-semibold text-sm text-apple-gray-dark">Admin</span>
            </motion.div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors ${collapsed ? 'mx-auto' : ''}`}
          >
            {collapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
            const active = isActive({ to, exact });
            return (
              <Link
                key={to}
                to={to}
                title={collapsed ? label : ''}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative
                  ${active ? 'bg-apple-blue text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-apple-gray-dark'}`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium">
                    {label}
                  </motion.span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-apple-gray-dark text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 p-3">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-2 mb-2">
              <p className="text-xs font-medium text-apple-gray-dark truncate">{user?.firstName || user?.email}</p>
              <p className="text-[10px] text-gray-400">Administrator</p>
            </motion.div>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign Out' : ''}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all text-sm ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.main
        animate={{ marginLeft: collapsed ? 64 : 220 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex-1 p-6 min-w-0"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <span>Admin</span>
          {location.pathname !== '/admin' && (
            <>
              <ChevronRight size={14} />
              <span className="text-apple-gray-dark font-medium capitalize">
                {location.pathname.split('/').pop()}
              </span>
            </>
          )}
        </div>
        <Outlet />
      </motion.main>
    </div>
  );
}
