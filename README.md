# Zenith | Premium Full-Stack E-Commerce Platform

Zenith is a modern, responsive, feature-rich, and beginner-friendly E-Commerce online shopping portal built using **React.js, Node.js + Express.js, and MongoDB**.

Featuring premium user-centric aesthetics, class-based dark/light theme toggling, multi-criteria category selectors, instant keyword catalog search, real-time stock limits tracking, interactive checkout flows, and a **visual, step-by-step shipment tracking pipeline**. It also boasts a full administrative operations board for real-time inventory management and shipment status changes.

---

## ⚡ Key Features

- **Storefront & Catalog**: Custom slide grids with zoom effects, average buyer rating tallies, text query catalog filters, and wishlist controls.
- **Unified Global State**: Seamless coordination across 4 dedicated context layers (Theme, Auth, Cart, and Toast notifications) using React Context API.
- **Cart & checkout validation**: Transactional cart controllers that check stock levels, deduct inventory upon purchase, clear cart states, and simulated shipping wavers for high-value carts.
- **Shipment progress timeline**: Beautiful visual timeline tracking shipping states (`Placed -> Shipped -> Delivered`) dynamically updated by admins.
- **Admin Dashboard**: Analytics cards charting sales aggregates, catalog sizes, transaction volume, and clients count, paired with dropdown shipment status controllers.
- **Inventory CRUD**: Interactive modals supporting real-time catalog additions, stock increments, image swaps, and deletions.
- **Auth Security**: Passwords hashed using `bcryptjs` and routes guarded by robust JWT token parsing middlewares (supporting Admin vs. Customer levels).

---

## 📂 Project Structure

```
ecommercetask/
├── backend/                  # REST API Express Service
│   ├── config/               # Database Mongoose connection layer
│   ├── controllers/          # Business logic controllers (Auth, Products, Cart, Orders)
│   ├── middleware/           # Route authorization guards & token validation
│   ├── models/               # MongoDB Document Schemas (User, Product, Cart, Order)
│   ├── routes/               # API route maps (POST/GET/PUT/DELETE mappings)
│   ├── utils/                # Catalog seeder scripts
│   ├── .env.example          # Sample configurations template
│   ├── server.js             # Main server entrypoint
│   └── vercel.json           # Vercel serverless deployment specifications
│
└── frontend/                 # Client SPA React Service
    ├── public/               # Public assets
    ├── src/
    │   ├── components/       # Reusable layout elements (Navbar, Footer, ProductCard, Guards)
    │   ├── context/          # State managers (ThemeContext, AuthContext, CartContext, ToastContext)
    │   ├── pages/            # View sheets (Home, ProductDetails, Cart, Checkout, Track, Profile, Admin)
    │   ├── App.jsx           # App routing trees
    │   ├── index.css         # Tailwind & custom scrollbar scroll styles
    │   └── main.jsx          # DOM entry node
    ├── tailwind.config.js    # Customized theme palettes
    └── vite.config.js        # Vite port configurations & CORS API proxy rules
```

---

## 🚀 Step-by-Step Local Setup

Follow these simple instructions to launch the platform locally:

### 1. Prerequisites
Ensure you have **Node.js** (v18+ recommended) and **MongoDB** installed and running on your system.

### 2. Configure the Backend Service
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create your local environment configuration file:
   - Duplicate `.env.example` and name the new file `.env`:
     ```bash
     copy .env.example .env
     ```
   - Ensure `MONGO_URI` is correctly pointing to your running MongoDB instance (e.g. `mongodb://127.0.0.1:27017/ecommercedb`).

4. **Seed the Database (CRITICAL)**:
   - Run our automatic seeder script to instantly purge legacy files, build test user profiles, and load beautiful catalog products:
     ```bash
     npm run seed
     ```

5. Launch the backend API server:
   ```bash
   npm run dev
   ```
   *The Express server will start listening on port `5000`.*

---

### 3. Configure the Frontend Service
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *Vite will compile files and start the client on `http://localhost:5173`.*

---

## 🔑 Pre-Seeded Testing Accounts

No registration is required to start exploring the platform. Our seeding process creates two default accounts pre-filled with order histories:

### 👤 Standard Customer Account
- **Email**: `user@example.com`
- **Password**: `userpassword123`
*Use this account to browse catalogs, add items to cart, place orders, and view visual shipping progress indicators.*

### 🛡️ Administrator Account
- **Email**: `admin@example.com`
- **Password**: `adminpassword123`
*Use this account to view analytical stats, change shipment delivery statuses, edit prices, delete items, and add new products to the catalog.*

---

## ☁️ Deployment Ready

Both packages are structured for rapid deployment:
- **Frontend**: Deploy `frontend/` folder to **Vercel** as a static Vite compilation project.
- **Backend**: Deploy `backend/` folder to **Vercel** (using the provided `vercel.json` and exported express `default app` in `server.js`) OR to **Render/Railway** as a web service.
- **Database**: Connects instantly to cloud **MongoDB Atlas** by replacing `MONGO_URI` in your production environments.
