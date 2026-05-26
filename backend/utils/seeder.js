import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

dotenv.config();

const productsData = [
  {
    title: "AeroSound Max ANC Headphones",
    description: "Immerse yourself in pure auditory bliss with active noise cancelling, plush memory foam earcups, 40-hour wireless battery life, and high-fidelity 40mm dynamic audio drivers. Perfect for music enthusiasts, long flights, and professional studio editing.",
    price: 249.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    stock: 25,
    rating: 4.8,
    reviewsCount: 34
  },
  {
    title: "Chrono 2.0 Premium Smartwatch",
    description: "Sleek, scratch-resistant AMOLED circular display featuring real-time biometric metrics, heart-rate tracking, sleep analyzer, GPS tracking, and a premium black leather strap. Offers 14 days of standby battery and water resistance up to 50 meters.",
    price: 189.50,
    category: "Wearables",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    stock: 15,
    rating: 4.6,
    reviewsCount: 22
  },
  {
    title: "Lumina Glow Ambient Smart Lamp",
    description: "Bring modern artistic lighting into your living room or study. Emits over 16 million colors with dimmable warmth control. Integrates seamlessly with Smart Home systems and supports ambient rhythmic lighting that synchronizes with your audio.",
    price: 69.99,
    category: "Home Decor",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    stock: 40,
    rating: 4.5,
    reviewsCount: 18
  },
  {
    title: "Nomad Canvas Minimalist Backpack",
    description: "Crafted from weather-resistant heavy-duty waxed canvas and top-grain leather straps. Includes a padded 16-inch laptop compartment, hidden security pockets, dual water bottle holders, and ergonomic ventilated shoulder padding for maximum travel comfort.",
    price: 110.00,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    stock: 30,
    rating: 4.7,
    reviewsCount: 41
  },
  {
    title: "Apex mechanical gaming keyboard",
    description: "Engineered for speed, durability, and satisfying acoustics. Built with tactile hot-swappable brown mechanical switches, custom double-shot PBT keycaps, an aircraft-grade aluminum top cover, and per-key customizable dynamic RGB lighting profiles.",
    price: 129.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    stock: 8,
    rating: 4.9,
    reviewsCount: 57
  },
  {
    title: "Voyager Wireless Charging Dock",
    description: "Sleek matte-black weighted wireless charging pad that refuels your smartphone, smartwatch, and earbuds simultaneously. Features intelligent overcharge temperature protection, safe foreign object detection, and fits beautifully on any office desk.",
    price: 49.99,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    rating: 4.4,
    reviewsCount: 15
  },
  {
    title: "Aura True Wireless Earbuds",
    description: "Ultra-compact active sweatproof earbuds equipped with Bluetooth 5.3, instant-pairing magnetic charging case, crystal-clear quad mic calls, and custom acoustic tuning for detailed, punchy bass performance. Ideal for workouts and busy commutes.",
    price: 89.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    stock: 22,
    rating: 4.5,
    reviewsCount: 29
  },
  {
    title: "HydroFlow Insulated Matte Bottle",
    description: "Keep your beverages icy cold for up to 24 hours or steaming hot for 12 hours. Constructed with premium food-grade 18/8 stainless steel, a double-wall vacuum seal, sweat-free exterior matte finish, and a leakproof sports straw cap.",
    price: 34.50,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    stock: 100,
    rating: 4.8,
    reviewsCount: 88
  },
  {
    title: "Spectra Ergonomic Executive Desk Chair",
    description: "Designed for supreme back support during long hours of computer work. Offers a high-back breathable mesh framework, adjustable three-dimensional armrests, pneumatic lift height controls, smooth nylon caster wheels, and a relaxing tilt locking mechanism.",
    price: 320.00,
    category: "Home Decor",
    imageUrl: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80",
    stock: 5,
    rating: 4.7,
    reviewsCount: 13
  }
];

const seedDatabase = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommercedb';
    console.log(`Connecting to ${connStr} for seeding...`);
    
    await mongoose.connect(connStr);
    console.log('Connected to database for seeding process.');

    // 1. Purge Existing Databases
    console.log('Purging previous catalogs, users, carts, and order tables...');
    await Product.deleteMany({});
    await User.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log('Database cleared.');

    // 2. Insert Testing Accounts
    console.log('Generating default test accounts...');
    
    // Seed Standard Customer
    const testUser = await User.create({
      name: 'Jane Doe',
      email: 'user@example.com',
      password: 'userpassword123', // Will be hashed by pre-save schema hook
      role: 'user',
    });
    console.log('Seeded User Account: user@example.com / userpassword123');

    // Seed Administrator
    const testAdmin = await User.create({
      name: 'Admin Boss',
      email: 'admin@example.com',
      password: 'adminpassword123', // Will be hashed by pre-save schema hook
      role: 'admin',
    });
    console.log('Seeded Admin Account: admin@example.com / adminpassword123');

    // 3. Populate Products Catalog
    console.log(`Injecting ${productsData.length} premium products into the database...`);
    const seededProducts = await Product.insertMany(productsData);
    console.log('Products catalog successfully seeded!');

    // 4. Create an Initial Cart for standard user (Jane Doe) with 1 item
    console.log('Initializing user cart state...');
    await Cart.create({
      userId: testUser._id,
      items: [
        {
          productId: seededProducts[0]._id, // AeroSound Headphones
          quantity: 1,
        },
      ],
    });
    console.log('Initial user cart preloaded with 1 item.');

    // 5. Create an initial sample order for user
    console.log('Creating sample order transaction...');
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    await Order.create({
      orderId: `ORD-${dateStr}-SEEDED`,
      userId: testUser._id,
      items: [
        {
          productId: seededProducts[1]._id, // Chrono smartwatch
          quantity: 1,
          price: seededProducts[1].price,
        },
      ],
      shippingAddress: {
        street: '123 Smart Way',
        city: 'Silicon Valley',
        state: 'CA',
        zipCode: '94025',
      },
      totalAmount: seededProducts[1].price,
      paymentStatus: 'Paid',
      orderStatus: 'Shipped', // Set as Shipped so they see tracking in progress!
    });
    console.log('Seeded a completed transaction history for Jane Doe.');

    console.log('Database Seeding Completed Successfully! Exiting.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process encountered an error:', error);
    process.exit(1);
  }
};

seedDatabase();
