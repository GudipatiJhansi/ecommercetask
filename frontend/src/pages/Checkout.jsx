import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, Truck, CreditCard, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Free shipping above $150
  const shippingFee = cartSubtotal >= 150 ? 0 : 15.00;
  const taxFee = cartSubtotal * 0.08;
  const totalAmount = cartSubtotal + shippingFee + taxFee;

  // Protect Checkout: If cart is empty, boot back to cart page!
  useEffect(() => {
    if (!submitting && cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate, submitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode) {
      showToast('Please provide all shipping address fields.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const shippingAddress = { street, city, state, zipCode };

      // Call API to create order
      const { data } = await axios.post('/api/orders', { shippingAddress });
      
      showToast(`Order placed successfully! Tracking ID: ${data.orderId}`, 'success');
      
      // Clear shopping cart state locally since database cleared it
      clearCart();

      // Redirect to Order tracking dashboard
      navigate('/orders');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to place order. Please review stock limits.';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white transition-colors duration-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 mb-8 transition-colors text-left w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white text-left mb-10">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          
          {/* Left Column: Shipping Address Form */}
          <div className="lg:col-span-2">
            <section className="bg-white dark:bg-darkbg-surface p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-darkbg-border shadow-premium">
              <div className="flex items-center gap-3 border-b border-gray-50 dark:border-darkbg-border pb-4 mb-6">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/30 text-brand-500 flex items-center justify-center">
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Shipping Address
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Street Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Luxury Avenue"
                    required
                    className="w-full px-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  />
                </div>

                {/* City, State, Zip Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Silicon Valley"
                      required
                      className="w-full px-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
                    />
                  </div>

                  {/* State */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="CA"
                      required
                      className="w-full px-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
                    />
                  </div>

                  {/* Zip Code */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Zip / Postal Code
                    </label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="94025"
                      required
                      className="w-full px-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 dark:border-darkbg-border flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                    <span>Your products are backed by lifetime purchase coverage.</span>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-premium hover:shadow-premium-hover transition-all duration-300"
                  >
                    <CreditCard className="w-4.5 h-4.5" />
                    {submitting ? 'Processing Transaction...' : 'Place Secure Order'}
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Right Column: Mini Invoice summary */}
          <div className="flex flex-col gap-6">
            <section className="bg-white dark:bg-darkbg-surface p-6 rounded-3xl border border-gray-100 dark:border-darkbg-border shadow-premium relative overflow-hidden">
              <h3 className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Items Summary
              </h3>

              {/* Items List */}
              <div className="space-y-4 mb-6 border-b border-gray-50 dark:border-darkbg-border pb-6 max-h-60 overflow-y-auto">
                {cart.items.map((item) => {
                  const product = item.productId;
                  if (!product) return null;

                  return (
                    <div key={product._id} className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-darkbg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-darkbg-border">
                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                          {product.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 block">
                          Qty: {item.quantity} &times; ${product.price?.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        ${(product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Invoice lines */}
              <div className="space-y-3 text-xs mb-6 border-b border-gray-50 dark:border-darkbg-border pb-6 text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span className="font-bold text-gray-900 dark:text-white">${taxFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Order Total</span>
                <span className="font-display text-xl font-extrabold text-brand-600 dark:text-brand-400">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </section>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;
