import React from 'react';
import { ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-darkbg-surface border-t border-gray-200 dark:border-darkbg-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Bio column */}
          <div className="flex flex-col gap-4 text-left">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-500 text-white p-1.5 rounded-lg">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Zenith<span className="text-brand-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redefining your digital shopping experience with sleek curation, blazing fast delivery, and premium modern electronics.
            </p>
          </div>

          {/* Quick shop navigation link column */}
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/?category=Electronics" className="hover:text-brand-500 transition-colors">Electronics</Link></li>
              <li><Link to="/?category=Wearables" className="hover:text-brand-500 transition-colors">Wearables</Link></li>
              <li><Link to="/?category=Accessories" className="hover:text-brand-500 transition-colors">Accessories</Link></li>
              <li><Link to="/?category=Home Decor" className="hover:text-brand-500 transition-colors">Home Decor</Link></li>
            </ul>
          </div>

          {/* Account column */}
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/profile" className="hover:text-brand-500 transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-brand-500 transition-colors">Order History</Link></li>
              <li><Link to="/cart" className="hover:text-brand-500 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              Subscribe
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Subscribe to get exclusive product drops and coupon discounts.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button className="bg-brand-500 hover:bg-brand-600 text-white p-2 rounded-xl transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Separator / Copyright details */}
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; 2026 Zenith Inc. All rights reserved. Crafted with pair programming aesthetics.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> in React.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
