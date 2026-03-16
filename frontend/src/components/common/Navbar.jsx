import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X, Package, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuthStore, useCartStore, useWishlistStore } from '../../context/store';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
  const { getItemCount, openCart } = useCartStore();
  const { count: wishCount } = useWishlistStore();
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const cartCount = getItemCount();
  const isAdminUser = isAdmin();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileOpen ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-white/80 backdrop-blur-md'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-apple-gray-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-apple-gray-dark text-lg tracking-tight">Luminia</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { to: '/category/smartphones', label: 'Phones' },
              { to: '/category/laptops', label: 'Laptops' },
              { to: '/category/audio', label: 'Audio' },
              { to: '/category/cameras', label: 'Cameras' },
              { to: '/category/accessories', label: 'Accessories' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="nav-link">{label}</Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-1">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.querySelector('input')?.focus(), 100); }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-apple-gray-dark"
              >
                <Search size={18} />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={handleSearch}
                    className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-apple-lg border border-gray-100 overflow-hidden"
                  >
                    <div className="flex items-center px-4 py-3">
                      <Search size={16} className="text-gray-400 mr-3 flex-shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 text-sm outline-none text-apple-gray-dark placeholder-gray-400"
                        autoFocus
                      />
                      {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 ml-2">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-apple-gray-dark">
              <Heart size={18} />
              {wishCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishCount()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-apple-gray-dark"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-apple-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-1.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-apple-blue rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown size={14} className="text-gray-500" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-apple-lg border border-gray-100 overflow-hidden py-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-apple-gray-dark truncate">
                          {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        {isAdminUser && <span className="badge bg-orange-100 text-orange-700 mt-1">Admin</span>}
                      </div>
                      {[
                        { to: '/profile', icon: Settings, label: 'Account Settings' },
                        { to: '/orders', icon: Package, label: 'My Orders' },
                      ].map(({ to, icon: Icon, label }) => (
                        <Link key={to} to={to} className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-apple-gray-dark">
                          <Icon size={15} className="text-gray-400" />
                          <span>{label}</span>
                        </Link>
                      ))}
                      {isAdminUser && (
                        <Link to="/admin" className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-orange-600 font-medium">
                          <Settings size={15} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1">
                        <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-red-500">
                          <LogOut size={15} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1.5 px-3 py-1.5 bg-apple-gray-dark text-white text-sm font-medium rounded-full hover:bg-black transition-colors">
                <User size={14} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-100 py-4 space-y-1"
            >
              {[
                { to: '/category/smartphones', label: 'Smartphones' },
                { to: '/category/laptops', label: 'Laptops' },
                { to: '/category/audio', label: 'Audio' },
                { to: '/category/cameras', label: 'Cameras' },
                { to: '/category/accessories', label: 'Accessories' },
                { to: '/category/fashion', label: 'Fashion' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="block px-4 py-3 text-apple-gray-dark font-medium hover:bg-gray-50 rounded-xl transition-colors">
                  {label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
