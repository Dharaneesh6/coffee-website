const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

const categories = [
  { name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', order: 1 },
  { name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', order: 2 },
  { name: 'Audio', slug: 'audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', order: 3 },
  { name: 'Cameras', slug: 'cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', order: 4 },
  { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', order: 5 },
  { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400', order: 6 },
  { name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', order: 7 },
  { name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', order: 8 },
  { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400', order: 9 },
  { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', order: 10 }
];

const products = [
  // Smartphones
  {
    title: 'iPhone 15 Pro Max',
    description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and a 48MP camera system that captures incredible detail. Features USB 3 speeds and Action Button.',
    price: 1199.99, discountPercentage: 5, category: 'smartphones', brand: 'Apple',
    stock: 50, rating: 4.9, reviewCount: 2340, sold: 1200, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600'],
    tags: ['apple', 'iphone', '5g', 'premium']
  },
  {
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI transforms how you interact with your phone. Built-in S Pen, 200MP camera, Snapdragon 8 Gen 3, and a massive 5000mAh battery.',
    price: 1299.99, discountPercentage: 8, category: 'smartphones', brand: 'Samsung',
    stock: 35, rating: 4.8, reviewCount: 1876, sold: 980, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'],
    tags: ['samsung', 'galaxy', '5g', 'premium', 's-pen']
  },
  {
    title: 'Google Pixel 8 Pro',
    description: 'Google\'s most advanced AI phone. Best-in-class photo editing, 7 years of OS updates, and the new Google Tensor G3 chip.',
    price: 999.99, discountPercentage: 10, category: 'smartphones', brand: 'Google',
    stock: 40, rating: 4.7, reviewCount: 1120, sold: 567, isFeatured: false,
    thumbnail: 'https://images.unsplash.com/photo-1598327105854-d8ead373a578?w=600',
    images: ['https://images.unsplash.com/photo-1598327105854-d8ead373a578?w=600'],
    tags: ['google', 'pixel', 'ai', '5g']
  },
  {
    title: 'OnePlus 12',
    description: 'Hasselblad-tuned cameras, Snapdragon 8 Gen 3, 100W SUPERVOOC charging that fills your battery in 26 minutes. Speed that\'s never been seen before.',
    price: 799.99, discountPercentage: 12, category: 'smartphones', brand: 'OnePlus',
    stock: 60, rating: 4.6, reviewCount: 890, sold: 445,
    thumbnail: 'https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=600',
    images: ['https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=600'],
    tags: ['oneplus', '5g', 'fast-charging']
  },
  // Laptops
  {
    title: 'MacBook Pro 16" M3 Max',
    description: 'The most powerful MacBook Pro ever. M3 Max chip, up to 128GB unified memory, 16" Liquid Retina XDR display. For pros who push limits.',
    price: 3499.99, discountPercentage: 3, category: 'laptops', brand: 'Apple',
    stock: 20, rating: 4.9, reviewCount: 1567, sold: 430, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 'https://images.unsplash.com/photo-1611186871525-fd5f2c0800b5?w=600'],
    tags: ['apple', 'macbook', 'm3', 'professional']
  },
  {
    title: 'Dell XPS 15 OLED',
    description: 'Ultra-thin premium laptop with 3.5K OLED InfinityEdge display, Intel Core i9, NVIDIA RTX 4070, perfect for creators and professionals.',
    price: 2499.99, discountPercentage: 7, category: 'laptops', brand: 'Dell',
    stock: 25, rating: 4.7, reviewCount: 980, sold: 320, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600'],
    tags: ['dell', 'xps', 'oled', 'creator']
  },
  {
    title: 'ASUS ROG Zephyrus G16',
    description: 'The ultimate gaming laptop. AMD Ryzen 9 7945HX, RTX 4090 16GB, 240Hz QHD+ MiniLED display, and premium RGB lighting.',
    price: 2999.99, discountPercentage: 5, category: 'laptops', brand: 'ASUS',
    stock: 15, rating: 4.8, reviewCount: 756, sold: 210, isFeatured: false,
    thumbnail: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600'],
    tags: ['asus', 'gaming', 'rog', 'rtx']
  },
  {
    title: 'Lenovo ThinkPad X1 Carbon',
    description: 'The legendary business laptop. Ultra-light at just 1.12kg, Intel Core Ultra 7, military-grade durability, and all-day battery life.',
    price: 1799.99, discountPercentage: 10, category: 'laptops', brand: 'Lenovo',
    stock: 30, rating: 4.6, reviewCount: 1234, sold: 567,
    thumbnail: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600'],
    tags: ['lenovo', 'thinkpad', 'business', 'ultralight']
  },
  // Audio
  {
    title: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancelling with 8 microphones. Crystal clear hands-free calling. Up to 30-hour battery with multipoint connection.',
    price: 399.99, discountPercentage: 15, category: 'audio', brand: 'Sony',
    stock: 75, rating: 4.8, reviewCount: 3421, sold: 2100, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    tags: ['sony', 'headphones', 'noise-cancelling', 'wireless']
  },
  {
    title: 'AirPods Pro 2nd Gen',
    description: 'Rebuilt from the ground up. Adaptive Audio seamlessly transitions between Active Noise Cancellation and Transparency mode.',
    price: 249.99, discountPercentage: 5, category: 'audio', brand: 'Apple',
    stock: 100, rating: 4.7, reviewCount: 5678, sold: 4500, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600',
    images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600'],
    tags: ['apple', 'airpods', 'earbuds', 'anc']
  },
  {
    title: 'Bose QuietComfort 45',
    description: 'Bose acoustic noise cancelling technology paired with high-fidelity audio delivers crisp, powerful sound. 24-hour battery life.',
    price: 329.99, discountPercentage: 20, category: 'audio', brand: 'Bose',
    stock: 50, rating: 4.6, reviewCount: 2100, sold: 1200,
    thumbnail: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600'],
    tags: ['bose', 'headphones', 'qc45', 'noise-cancelling']
  },
  {
    title: 'JBL Charge 5 Speaker',
    description: 'Powerful portable Bluetooth speaker with impressive sound performance. IP67 waterproof, 20-hour battery, built-in power bank.',
    price: 179.99, discountPercentage: 10, category: 'audio', brand: 'JBL',
    stock: 80, rating: 4.5, reviewCount: 1890, sold: 890,
    thumbnail: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'],
    tags: ['jbl', 'bluetooth', 'waterproof', 'portable']
  },
  // Cameras
  {
    title: 'Sony Alpha A7R V',
    description: '61MP full-frame sensor, world\'s first AI-based AF system, 8-stop in-body stabilization. The most advanced mirrorless camera ever built.',
    price: 3899.99, discountPercentage: 4, category: 'cameras', brand: 'Sony',
    stock: 10, rating: 4.9, reviewCount: 456, sold: 145,
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'],
    tags: ['sony', 'mirrorless', 'fullframe', 'professional']
  },
  {
    title: 'Canon EOS R6 Mark II',
    description: '40fps burst, uncropped 4K60p video, advanced subject detection. For wedding photographers, sports, wildlife — any decisive moment.',
    price: 2499.99, discountPercentage: 6, category: 'cameras', brand: 'Canon',
    stock: 15, rating: 4.8, reviewCount: 789, sold: 234,
    thumbnail: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600',
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600'],
    tags: ['canon', 'mirrorless', 'r6', 'video']
  },
  {
    title: 'GoPro HERO12 Black',
    description: 'Capture every adventure in stunning 5.3K60 video. HyperSmooth 6.0, Max Lens Mod 2.0, waterproof to 10m, cloud backup.',
    price: 399.99, discountPercentage: 12, category: 'cameras', brand: 'GoPro',
    stock: 60, rating: 4.6, reviewCount: 2345, sold: 1890, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600',
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'],
    tags: ['gopro', 'action', 'waterproof', '4k']
  },
  // Accessories
  {
    title: 'Apple Watch Ultra 2',
    description: 'The most rugged and capable Apple Watch. Titanium case, precision dual-frequency GPS, up to 60-hour battery for the most extreme adventures.',
    price: 799.99, discountPercentage: 0, category: 'accessories', brand: 'Apple',
    stock: 30, rating: 4.8, reviewCount: 1234, sold: 567, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600',
    images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600'],
    tags: ['apple', 'watch', 'smartwatch', 'fitness']
  },
  {
    title: 'Samsung Galaxy Tab S9 Ultra',
    description: 'The ultimate large-screen Android tablet. 14.6" Dynamic AMOLED 2X, Snapdragon 8 Gen 2, included S Pen, and IP68 water resistance.',
    price: 1299.99, discountPercentage: 8, category: 'accessories', brand: 'Samsung',
    stock: 25, rating: 4.7, reviewCount: 678, sold: 234,
    thumbnail: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600',
    images: ['https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600'],
    tags: ['samsung', 'tablet', 's-pen', 'amoled']
  },
  {
    title: 'Anker 737 Power Bank 24000mAh',
    description: '24000mAh massive capacity with 140W output. Charge your MacBook Pro, iPhone, and more simultaneously. Smart digital display.',
    price: 149.99, discountPercentage: 18, category: 'accessories', brand: 'Anker',
    stock: 100, rating: 4.6, reviewCount: 3456, sold: 2340,
    thumbnail: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600',
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600'],
    tags: ['anker', 'power-bank', 'charging', 'portable']
  },
  // Fashion
  {
    title: 'Nike Air Jordan 1 Retro High',
    description: 'The OG sneaker that started it all. Premium leather upper, air cushioning, and iconic colorway. A cultural phenomenon that transcends sport.',
    price: 189.99, discountPercentage: 0, category: 'fashion', brand: 'Nike',
    stock: 45, rating: 4.8, reviewCount: 5678, sold: 3400, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    tags: ['nike', 'jordan', 'sneakers', 'retro']
  },
  {
    title: 'Levi\'s 501 Original Jeans',
    description: 'The original jeans. Straight leg, button fly, five-pocket styling. Made with Levi\'s signature rigid denim fabric. Timeless since 1873.',
    price: 79.99, discountPercentage: 15, category: 'fashion', brand: 'Levi\'s',
    stock: 80, rating: 4.5, reviewCount: 12345, sold: 8900,
    thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'],
    tags: ['levis', 'jeans', 'denim', 'classic']
  },
  {
    title: 'Ray-Ban Aviator Classic',
    description: 'Timeless since 1937. Crystal lenses for 100% UV protection, thin metal frame, available in multiple lens tints. A true icon.',
    price: 169.99, discountPercentage: 10, category: 'fashion', brand: 'Ray-Ban',
    stock: 55, rating: 4.7, reviewCount: 3456, sold: 2100,
    thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'],
    tags: ['rayban', 'sunglasses', 'aviator', 'uv-protection']
  },
  // Home & Living
  {
    title: 'Dyson V15 Detect Vacuum',
    description: 'Laser reveals invisible dust. Intelligently optimizes suction and run time. Scientific proof of a deep clean with the integrated particle counter.',
    price: 749.99, discountPercentage: 8, category: 'home-living', brand: 'Dyson',
    stock: 20, rating: 4.8, reviewCount: 2345, sold: 890, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    tags: ['dyson', 'vacuum', 'cordless', 'cleaning']
  },
  {
    title: 'Nespresso Vertuo Next Coffee',
    description: 'One touch of a button for the perfect coffee. Centrifusion technology brews 5 cup sizes from espresso to Alto. WiFi connectivity.',
    price: 199.99, discountPercentage: 20, category: 'home-living', brand: 'Nespresso',
    stock: 35, rating: 4.6, reviewCount: 1890, sold: 1200,
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'],
    tags: ['nespresso', 'coffee', 'espresso', 'kitchen']
  },
  {
    title: 'Philips Hue Starter Kit',
    description: 'Transform your home with smart lighting. 16 million colors, voice control, schedule automation, and energy monitoring. Works with Alexa & Google.',
    price: 199.99, discountPercentage: 12, category: 'home-living', brand: 'Philips',
    stock: 50, rating: 4.5, reviewCount: 3456, sold: 2300,
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    tags: ['philips', 'smart-home', 'lighting', 'hue']
  },
  // Sports
  {
    title: 'Whoop 4.0 Fitness Tracker',
    description: 'No screen, no distractions. Just actionable health data. 24/7 heart rate monitoring, sleep coaching, recovery optimization.',
    price: 239.99, discountPercentage: 0, category: 'sports', brand: 'WHOOP',
    stock: 40, rating: 4.4, reviewCount: 1234, sold: 567,
    thumbnail: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600',
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600'],
    tags: ['whoop', 'fitness', 'tracker', 'health']
  },
  {
    title: 'Peloton Bike+',
    description: 'Immersive 24" rotating HD touchscreen, auto-resistance, and access to world-class instructors. Transform your home into a cycling studio.',
    price: 2495.99, discountPercentage: 10, category: 'sports', brand: 'Peloton',
    stock: 8, rating: 4.7, reviewCount: 890, sold: 234, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'],
    tags: ['peloton', 'cycling', 'fitness', 'home-gym']
  },
  // Beauty
  {
    title: 'Dyson Airwrap Complete',
    description: 'Style with no extreme heat. Curl, wave, smooth, dry, and hide flyaways. Includes all Airwrap attachments for all hair types.',
    price: 599.99, discountPercentage: 0, category: 'beauty', brand: 'Dyson',
    stock: 25, rating: 4.7, reviewCount: 4567, sold: 2345, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600',
    images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600'],
    tags: ['dyson', 'haircare', 'styling', 'airwrap']
  },
  {
    title: 'La Mer Crème de la Mer',
    description: 'The legendary moisturizer with sea-sourced ingredient Miracle Broth at its heart. Visibly reduces fine lines, restores radiance.',
    price: 349.99, discountPercentage: 5, category: 'beauty', brand: 'La Mer',
    stock: 30, rating: 4.6, reviewCount: 2345, sold: 1234,
    thumbnail: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600',
    images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600'],
    tags: ['lamer', 'skincare', 'moisturizer', 'luxury']
  },
  // Books
  {
    title: 'Atomic Habits by James Clear',
    description: 'The #1 New York Times bestseller. Proven framework for improving every day. How tiny changes can yield remarkable results over time.',
    price: 24.99, discountPercentage: 20, category: 'books', brand: 'Penguin',
    stock: 200, rating: 4.8, reviewCount: 89012, sold: 45000, isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600',
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600'],
    tags: ['self-help', 'habits', 'bestseller', 'productivity']
  },
  {
    title: 'The Creative Act by Rick Rubin',
    description: 'A philosophy for living a creative life. From legendary music producer Rick Rubin, this is about the philosophy of creativity itself.',
    price: 29.99, discountPercentage: 15, category: 'books', brand: 'Penguin',
    stock: 150, rating: 4.7, reviewCount: 12345, sold: 8900,
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
    tags: ['creativity', 'music', 'philosophy', 'art']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing products and categories');

    // Seed categories
    await Category.insertMany(categories);
    console.log(`✅ Seeded ${categories.length} categories`);

    // Seed products
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        firstName: 'Admin',
        lastName: 'Luminia',
        email: 'admin@luminia.com',
        password: 'Admin@123456',
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created: admin@luminia.com / Admin@123456');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
