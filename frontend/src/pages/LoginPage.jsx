import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../utils/api';
import { useAuthStore } from '../context/store';
import toast from 'react-hot-toast';

function AuthPage({ isLogin }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const validate = () => {
    const e = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'At least 6 characters';
    if (!isLogin) {
      if (!form.firstName) e.firstName = 'Required';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fn = isLogin ? authAPI.login : authAPI.register;
      const res = await fn(form);
      login(res.user, res.token);
      toast.success(isLogin ? `Welcome back, ${res.user.firstName || res.user.email}!` : 'Account created!');
      navigate(redirect);
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-14 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-apple-lg p-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-apple-gray-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <h1 className="text-2xl font-bold text-apple-gray-dark">{isLogin ? 'Welcome back' : 'Create account'}</h1>
          <p className="text-gray-400 text-sm mt-1">{isLogin ? 'Sign in to your Luminia account' : 'Join Luminia today'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              {[{ key: 'firstName', label: 'First Name' }, { key: 'lastName', label: 'Last Name' }].map(({ key, label }) => (
                <div key={key}>
                  <input
                    type="text"
                    placeholder={label}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className={`input-field text-sm ${errors[key] ? 'border-red-400' : ''}`}
                  />
                  {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                </div>
              ))}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className={`input-field text-sm ${errors.email ? 'border-red-400' : ''}`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className={`input-field text-sm pr-10 ${errors.password ? 'border-red-400' : ''}`}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 text-sm">
            {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? `/register${redirect !== '/' ? `?redirect=${redirect}` : ''}` : `/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
            className="text-apple-blue font-medium hover:underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

export function LoginPage() { return <AuthPage isLogin={true} />; }
export function RegisterPage() { return <AuthPage isLogin={false} />; }
export default LoginPage;
