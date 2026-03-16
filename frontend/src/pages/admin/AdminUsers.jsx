import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, UserCheck, UserX, Shield, Users } from 'lucide-react';
import { usersAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, page],
    queryFn: () => usersAPI.getAll({ search: search || undefined, page, limit: 20 })
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => usersAPI.toggleStatus(id),
    onSuccess: () => { queryClient.invalidateQueries(['admin-users']); toast.success('User status updated'); }
  });

  const users = data?.users || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-apple-gray-dark">Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">{data?.total || 0} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="input-field text-sm pl-9 py-2"
        />
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Users className="mx-auto mb-3 opacity-30" size={36} />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                {['User', 'Email', 'Phone', 'Role', 'Joined', 'Last Login', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-gray-50 hover:bg-gray-50/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue font-semibold text-xs flex-shrink-0">
                        {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-medium text-apple-gray-dark">
                        {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[180px]">
                    <span className="truncate block">{user.email}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${user.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'} flex items-center gap-1 w-fit`}>
                      {user.role === 'admin' && <Shield size={10} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                      {user.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => toggleMutation.mutate(user._id)}
                        disabled={toggleMutation.isPending}
                        title={user.isActive ? 'Block user' : 'Unblock user'}
                        className={`p-1.5 rounded-lg transition-all ${user.isActive ? 'text-red-400 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                      >
                        {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    )}
                  </td>
                </motion.tr>
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
    </div>
  );
}
