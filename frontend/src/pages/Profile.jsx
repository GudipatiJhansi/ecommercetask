import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Mail, Shield, Calendar, Heart, Award, Sparkles } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const wishlistedItems = user.wishlist || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white transition-colors duration-300 py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-10">
          Account Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white dark:bg-darkbg-surface rounded-3xl border border-gray-100 dark:border-darkbg-border p-6 shadow-premium relative overflow-hidden">
              
              {/* Decorative backgrounds */}
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-brand-500 to-indigo-600 z-0"></div>
              
              {/* Avatar circle */}
              <div className="relative z-10 flex flex-col items-center mt-8">
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-darkbg-surface bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center font-bold text-4xl shadow-premium mb-4">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                
                <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-0.5">
                  {user.name}
                </h2>
                
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-200/30">
                  <Award className="w-3 h-3" />
                  {user.role} Member
                </span>
              </div>

              {/* Profile Details List */}
              <div className="mt-8 space-y-4 pt-6 border-t border-gray-50 dark:border-darkbg-border text-sm">
                
                {/* Email details */}
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4.5 h-4.5 text-brand-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Email Address</span>
                    <span className="truncate block font-medium text-gray-800 dark:text-gray-200">{user.email}</span>
                  </div>
                </div>

                {/* Role Details */}
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Shield className="w-4.5 h-4.5 text-brand-500 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Permissions Level</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{user.role} Status</span>
                  </div>
                </div>

                {/* Account Age Details */}
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4.5 h-4.5 text-brand-500 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Member Since</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Simulated Loyalty tier promo */}
            <div className="p-5 bg-gradient-to-br from-brand-600 to-violet-800 rounded-3xl border border-brand-500/20 text-white text-left shadow-premium flex gap-4 items-start relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full pointer-events-none"></div>
              <Sparkles className="w-8 h-8 text-brand-200 flex-shrink-0 animate-pulse mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-sm mb-1">Zenith Premium Status</h4>
                <p className="text-[10px] text-brand-100 leading-relaxed">
                  You are unlocking elite member pricing and early access drops. Standard free shipping is unlocked on all orders over $150.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Wishlist feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-150 dark:border-darkbg-border pb-3">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                My Wishlist ({wishlistedItems.length})
              </h2>
            </div>

            {wishlistedItems.length === 0 ? (
              <section className="bg-white dark:bg-darkbg-surface p-12 rounded-3xl border border-gray-100 dark:border-darkbg-border text-center">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg text-gray-800 dark:text-white">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-6 max-w-xs mx-auto leading-relaxed">
                  Save products you are interested in by tapping the heart icon overlaying any card in the catalog.
                </p>
                <a
                  href="/"
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-premium text-xs"
                >
                  Browse Storefront
                </a>
              </section>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlistedItems.map((product) => {
                  // Ensure product object is valid (wishlist might be populated)
                  if (!product || typeof product !== 'object') return null;
                  return <ProductCard key={product._id} product={product} />;
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
