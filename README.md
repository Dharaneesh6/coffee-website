# 🛍️ Luminia — Full-Stack E-Commerce Platform

Premium Apple-style e-commerce platform built with React, Node.js, and MongoDB Atlas.

---

## ✨ Features

### Storefront
- 🎨 **Apple-style UI** — Premium design with smooth Framer Motion animations
- ⚡ **Performance** — Lazy-loaded pages, React Query caching, optimized images
- 🔍 **Search & Filter** — Full-text MongoDB search, category/price/sort filters
- 🛒 **Cart & Wishlist** — Persisted via Zustand + localStorage
- 💳 **Checkout** — 3-step flow (Shipping → Payment → Review)
- ⭐ **Reviews** — Star ratings, verified purchase badges
- 📦 **Order Tracking** — Real-time status timeline with events
- 👤 **User Account** — Profile, saved addresses, order history

### Admin Dashboard (`/admin`)
- 📊 **Analytics** — Revenue charts, order trends, top products (Recharts)
- 📦 **Product Management** — Add, edit, delete products with image preview
- 🧾 **Order Management** — Status updates, tracking numbers, filtering
- 👥 **User Management** — View users, block/unblock accounts

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Install all dependencies
npm run install:all
```

### 2. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/luminia?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
ADMIN_SECRET=your_admin_secret_here
```

**Get your MongoDB Atlas URI:**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Click **Connect → Drivers → Node.js**
4. Copy the connection string, replace `<password>`

### 3. Seed Database

```bash
npm run seed
```

This creates:
- ✅ 30+ products across 10 categories
- ✅ 10 categories
- ✅ Admin account: `admin@luminia.com` / `Admin@123456`

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
npm run dev:backend

# Terminal 2 — Frontend (port 3000)
npm run dev:frontend
```

Open **http://localhost:3000**

---

## 🗂️ Project Structure

```
luminia/
├── backend/
│   ├── models/          # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── Category.js
│   ├── routes/          # Express API routes
│   │   ├── auth.js      # Login, register, JWT
│   │   ├── products.js  # CRUD + search
│   │   ├── orders.js    # Order lifecycle
│   │   ├── users.js     # Profile, addresses
│   │   ├── reviews.js   # Product reviews
│   │   ├── admin.js     # Analytics stats
│   │   └── categories.js
│   ├── middleware/
│   │   └── auth.js      # JWT + role guards
│   ├── seed/
│   │   └── seedData.js  # 30 products + admin user
│   ├── server.js
│   └── .env
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── HomePage.jsx        # Hero slider, categories, product rows
        │   ├── ProductPage.jsx     # Detail, reviews, similar products
        │   ├── CategoryPage.jsx    # Filtered product grid
        │   ├── CartPage.jsx        # Cart + checkout flow
        │   ├── LoginPage.jsx       # Auth (login + register)
        │   ├── ProfilePage.jsx     # Account settings, addresses
        │   ├── OrdersPage.jsx      # Order history + detail
        │   ├── WishlistPage.jsx
        │   └── admin/
        │       ├── AdminLayout.jsx     # Collapsible sidebar
        │       ├── AdminDashboard.jsx  # Charts + KPIs
        │       ├── AdminProducts.jsx   # Product CRUD
        │       ├── AdminOrders.jsx     # Order management
        │       └── AdminUsers.jsx      # User management
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx      # Sticky nav with search
        │   │   └── PageLoader.jsx  # Shared UI components
        │   └── cart/
        │       └── CartDrawer.jsx  # Slide-in cart
        ├── context/
        │   └── store.js            # Zustand: auth + cart + wishlist
        └── utils/
            └── api.js              # Axios instance + all API calls
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login, get JWT |
| GET | `/api/auth/me` | User | Current user |
| GET | `/api/products` | — | List with filters |
| GET | `/api/products/:id` | — | Single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Remove product |
| POST | `/api/orders` | User | Place order |
| GET | `/api/orders/my-orders` | User | My orders |
| PUT | `/api/orders/:id/status` | Admin | Update status |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/users` | Admin | All users |

---

## 🔐 Admin Access

```
URL:      http://localhost:3000/admin
Email:    admin@luminia.com
Password: Admin@123456
```

To promote any user to admin, run:
```bash
curl -X POST http://localhost:5000/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"pass","adminSecret":"luminia_admin_secret_2024"}'
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS |
| State | Zustand (cart, auth, wishlist) |
| Data fetching | TanStack Query (caching, pagination) |
| Animations | Framer Motion |
| Charts | Recharts |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| Icons | Lucide React |

---

## 📦 Adding Your Own Products

Edit `backend/seed/seedData.js` — add to the `products` array:

```js
{
  title: 'Your Product',
  description: 'Product description',
  price: 99.99,
  discountPercentage: 10,   // optional
  category: 'electronics',  // must match a category slug
  brand: 'Your Brand',
  stock: 50,
  thumbnail: 'https://your-image-url.jpg',
  images: ['https://img1.jpg', 'https://img2.jpg'],
  tags: ['tag1', 'tag2'],
  isFeatured: true           // shows in featured section
}
```

Then run `npm run seed` again.

---

## 🌍 Production Deployment

1. **Frontend** → Build with `npm run build`, deploy to Vercel/Netlify
2. **Backend** → Deploy to Railway/Render, set `NODE_ENV=production`
3. Set `FRONTEND_URL` env var in backend to your frontend domain
4. Update Vite proxy in `vite.config.js` or use env vars for API URL

---

*Built with ❤️ — Luminia E-Commerce*
