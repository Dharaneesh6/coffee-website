import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, MapPin, Save, Plus, Trash2 } from 'lucide-react';
import { usersAPI, authAPI } from '../utils/api';
import { useAuthStore } from '../context/store';
import toast from 'react-hot-toast';

const TAB_PROFILE = 'profile';
const TAB_PASSWORD = 'password';
const TAB_ADDRESSES = 'addresses';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [tab, setTab] = useState(TAB_PROFILE);
  const [profileForm, setProfileForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: 'Home', fullName: '', phone: '', address: '', city: '', state: '', postalCode: '', isDefault: false });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState(user?.addresses || []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await usersAPI.updateProfile(profileForm);
      updateUser(res.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) { toast.error('Passwords do not match'); return; }
    if (passwordForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await authAPI.updatePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password updated');
      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await usersAPI.addAddress(addressForm);
      setAddresses(res.addresses);
      setShowAddressForm(false);
      setAddressForm({ label: 'Home', fullName: '', phone: '', address: '', city: '', state: '', postalCode: '', isDefault: false });
      toast.success('Address added');
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await usersAPI.deleteAddress(id);
      setAddresses(res.addresses);
      toast.success('Address removed');
    } catch (err) {
      toast.error('Failed');
    }
  };

  const TABS = [
    { id: TAB_PROFILE, label: 'Profile', icon: User },
    { id: TAB_PASSWORD, label: 'Password', icon: Lock },
    { id: TAB_ADDRESSES, label: 'Addresses', icon: MapPin }
  ];

  return (
    <main className="pt-14 bg-gray-50 min-h-screen">
      <div className="page-container py-10">
        <h1 className="section-title mb-8">Account Settings</h1>
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl p-4 shadow-card h-fit">
            <div className="flex flex-col items-center p-4 mb-2">
              <div className="w-16 h-16 bg-apple-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <p className="font-semibold text-apple-gray-dark text-sm">{user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}</p>
              <p className="text-xs text-gray-400 truncate max-w-full">{user?.email}</p>
            </div>
            <nav className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id ? 'bg-apple-blue/10 text-apple-blue' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === TAB_PROFILE && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-8 shadow-card">
                <h2 className="font-semibold text-apple-gray-dark text-lg mb-6">Personal Information</h2>
                <form onSubmit={saveProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[{ key: 'firstName', label: 'First Name' }, { key: 'lastName', label: 'Last Name' }].map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                        <input type="text" value={profileForm[key]} onChange={e => setProfileForm(f => ({ ...f, [key]: e.target.value }))} className="input-field text-sm" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <input type="email" value={user?.email || ''} disabled className="input-field text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                    <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value.replace(/\D/, '').slice(0, 10) }))} className="input-field text-sm" maxLength={10} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary text-sm flex items-center gap-2 mt-2">
                    <Save size={14} /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </motion.div>
            )}

            {tab === TAB_PASSWORD && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-8 shadow-card">
                <h2 className="font-semibold text-apple-gray-dark text-lg mb-6">Change Password</h2>
                <form onSubmit={savePassword} className="space-y-4 max-w-sm">
                  {[
                    { key: 'currentPassword', label: 'Current Password' },
                    { key: 'newPassword', label: 'New Password' },
                    { key: 'confirm', label: 'Confirm New Password' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                      <input type="password" value={passwordForm[key]} onChange={e => setPasswordForm(f => ({ ...f, [key]: e.target.value }))} className="input-field text-sm" />
                    </div>
                  ))}
                  <button type="submit" disabled={loading} className="btn-primary text-sm">{loading ? 'Updating...' : 'Update Password'}</button>
                </form>
              </motion.div>
            )}

            {tab === TAB_ADDRESSES && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-8 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-apple-gray-dark text-lg">Saved Addresses</h2>
                  <button onClick={() => setShowAddressForm(true)} className="btn-ghost text-sm flex items-center gap-1.5">
                    <Plus size={14} /> Add Address
                  </button>
                </div>

                {showAddressForm && (
                  <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={addAddress} className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-3">
                    <h3 className="font-medium text-sm text-apple-gray-dark">New Address</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'label', label: 'Label (Home/Work)' },
                        { key: 'fullName', label: 'Full Name' },
                        { key: 'phone', label: 'Phone' },
                        { key: 'postalCode', label: 'Postal Code' },
                        { key: 'address', label: 'Street Address', span: 2 },
                        { key: 'city', label: 'City' },
                        { key: 'state', label: 'State' }
                      ].map(({ key, label, span }) => (
                        <div key={key} className={span === 2 ? 'col-span-2' : ''}>
                          <input
                            type="text"
                            placeholder={label}
                            value={addressForm[key]}
                            onChange={e => setAddressForm(f => ({ ...f, [key]: e.target.value }))}
                            className="input-field text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm(f => ({ ...f, isDefault: e.target.checked }))} className="rounded" />
                      Set as default address
                    </label>
                    <div className="flex gap-3">
                      <button type="submit" disabled={loading} className="btn-primary text-sm">Save Address</button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="btn-secondary text-sm">Cancel</button>
                    </div>
                  </motion.form>
                )}

                <div className="space-y-3">
                  {addresses.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">No saved addresses</p>
                  ) : (
                    addresses.map(addr => (
                      <div key={addr._id} className="flex items-start justify-between p-4 border border-gray-200 rounded-2xl">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="badge bg-gray-100 text-gray-600">{addr.label}</span>
                            {addr.isDefault && <span className="badge bg-green-100 text-green-600">Default</span>}
                          </div>
                          <p className="text-sm font-medium text-apple-gray-dark">{addr.fullName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{addr.address}, {addr.city}, {addr.state} {addr.postalCode}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{addr.phone}</p>
                        </div>
                        <button onClick={() => deleteAddress(addr._id)} className="text-gray-300 hover:text-red-400 transition-colors p-1.5">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
