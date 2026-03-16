import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <main className="pt-14 min-h-screen flex items-center justify-center bg-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
        <p className="text-9xl font-bold text-gray-100">404</p>
        <h1 className="text-2xl font-bold text-apple-gray-dark -mt-4 mb-3">Page not found</h1>
        <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </motion.div>
    </main>
  );
}
