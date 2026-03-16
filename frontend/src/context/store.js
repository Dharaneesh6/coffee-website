import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        localStorage.setItem('luminia_token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('luminia_token');
        localStorage.removeItem('luminia_user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),

      isAdmin: () => get().user?.role === 'admin'
    }),
    {
      name: 'luminia_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
    }
  )
);

// Cart store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(i => i._id === product._id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i._id === product._id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              )
            };
          }
          return { items: [...state.items, { ...product, quantity }] };
        });
      },

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i._id !== productId)
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: quantity <= 0
          ? state.items.filter(i => i._id !== productId)
          : state.items.map(i => i._id === productId ? { ...i, quantity } : i)
      })),

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () => get().items.reduce((sum, i) => {
        const price = i.price * (1 - (i.discountPercentage || 0) / 100);
        return sum + price * i.quantity;
      }, 0),

      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 999 ? 0 : 5;
      },

      getTax: () => get().getSubtotal() * 0.18,

      getTotal: () => {
        const sub = get().getSubtotal();
        const ship = get().getShipping();
        const tax = get().getTax();
        return sub + ship + tax;
      }
    }),
    {
      name: 'luminia_cart',
      partialize: (state) => ({ items: state.items })
    }
  )
);

// Wishlist store
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => set((state) => {
        const exists = state.items.find(i => i._id === product._id);
        return {
          items: exists
            ? state.items.filter(i => i._id !== product._id)
            : [...state.items, product]
        };
      }),
      isWished: (id) => get().items.some(i => i._id === id),
      count: () => get().items.length
    }),
    { name: 'luminia_wishlist', partialize: (s) => ({ items: s.items }) }
  )
);
