import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import {
  ShoppingCart,
  User as UserIcon,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Sliders,
  ShoppingBag,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `font-medium transition-colors text-sm hover:text-brand-500 dark:hover:text-brand-400 ${
      isActive
        ? 'text-brand-600 dark:text-brand-400 font-semibold'
        : 'text-gray-600 dark:text-gray-300'
    }`;

  return (
    <nav className="sticky top-0 z-40 w-full glass-nav transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-500 text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Zenith<span className="text-brand-500">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Link Items */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={navLinkClass}>
              Shop
            </NavLink>
            {user && (
              <>
                <NavLink to="/orders" className={navLinkClass}>
                  My Orders
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400 border border-brand-200/50 dark:border-brand-900/30 hover:bg-brand-100 transition-colors">
                <Sliders className="w-3.5 h-3.5" />
                Admin Panel
              </NavLink>
            )}
          </div>

          {/* Toolbar Utilities (Theme toggler, Cart status bubble, Profile controls) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white bg-gray-100/50 dark:bg-darkbg-surface hover:bg-gray-100 dark:hover:bg-darkbg-border border border-gray-200/40 dark:border-white/5 transition-all duration-300"
              aria-label="Toggle visual theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 rotate-0 scale-100 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 rotate-0 scale-100 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Shopping Cart Indicator Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white bg-gray-100/50 dark:bg-darkbg-surface hover:bg-gray-100 dark:hover:bg-darkbg-border border border-gray-200/40 dark:border-white/5 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-premium animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login / Profile Drodown switch */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-darkbg-border">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-premium group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white max-w-[100px] truncate leading-none">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-gray-400 capitalize">
                      {user.role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 rounded-xl shadow-premium hover:shadow-premium-hover transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburg Control Menu Trigger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-300 bg-gray-100/50 dark:bg-darkbg-surface hover:bg-gray-100 dark:hover:bg-darkbg-border"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/cart" className="relative p-2 rounded-lg text-gray-500 dark:text-gray-300 bg-gray-100/50 dark:bg-darkbg-surface">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white shadow-premium">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100/50 dark:bg-darkbg-surface"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-x-0 border-b border-t border-gray-200/50 dark:border-white/5 animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 text-left">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkbg-surface"
            >
              Shop
            </Link>
            {user && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkbg-surface"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkbg-surface"
                >
                  Profile
                </Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-bold text-brand-600 dark:text-brand-400 hover:bg-gray-100 dark:hover:bg-darkbg-surface"
              >
                Admin Panel
              </Link>
            )}

            {user ? (
              <div className="pt-4 mt-2 border-t border-gray-200 dark:border-darkbg-border flex flex-col gap-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                      {user.name}
                    </h4>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-rose-200 dark:border-rose-900/40 text-rose-500 rounded-lg font-medium hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-2 border-t border-gray-200 dark:border-darkbg-border flex flex-col gap-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkbg-surface rounded-lg border border-gray-300 dark:border-gray-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-premium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
