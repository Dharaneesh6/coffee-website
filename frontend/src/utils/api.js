import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luminia_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('luminia_token');
      localStorage.removeItem('luminia_user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// API service methods
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data),
  adminRegister: (data) => api.post('/auth/admin/register', data)
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  getByCategory: (cat) => api.get(`/products/category/${cat}`),
  getCategories: () => api.get('/products/categories/list'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  myOrders: (params) => api.get('/orders/my-orders', { params }),
  getOne: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data)
};

export const reviewsAPI = {
  getForProduct: (productId) => api.get(`/reviews/product/${productId}`),
  submit: (productId, data) => api.post(`/reviews/product/${productId}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  getAll: () => api.get('/reviews')
};

export const usersAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  addAddress: (data) => api.post('/users/addresses', data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  toggleWishlist: (productId) => api.post(`/users/wishlist/${productId}`),
  getAll: (params) => api.get('/users', { params }),
  toggleStatus: (id) => api.put(`/users/${id}/toggle-status`)
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats')
};

export default api;
