import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, Plus, Minus, CreditCard, ShieldCheck } from 'lucide-react';

const Cart = () => {
  const { cart, cartSubtotal, updateQuantity, removeFromCart, loading } = useCart();

  // Custom premium checkout details: Free shipping above $150
  const shippingThreshold = 150;
  const shippingFee = cartSubtotal >= shippingThreshold || cartSubtotal === 0 ? 0 : 15.00;
  const taxRate = 0.08; // 8% tax
  const taxFee = cartSubtotal * taxRate;
  const totalAmount = cartSubtotal + shippingFee + taxFee;

  const handleQtyChange = async (productId, currentQty, delta, maxStock) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (newQty > maxStock) return;
    await updateQuantity(productId, newQty);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-darkbg py-12 px-4 transition-colors duration-300">
        <section className="max-w-md w-full text-center p-8 bg-white dark:bg-darkbg-surface rounded-3xl border border-gray-100 dark:border-darkbg-border shadow-premium">
          <div className="w-16 h-16 mx-auto bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-2xl flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Your shopping cart is empty
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-8">
            Looks like you haven't added anything to your cart yet. Explore our high-tech catalog to find your favorite products.
          </p>
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl shadow-premium hover:shadow-premium-hover transition-all"
          >
            Start Shopping
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white transition-colors duration-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white text-left mb-10">
          Shopping Cart
        </h1>

        {/* Layout split: Left item list, Right transaction summary card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          
          {/* Left Column: Cart items table */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.items.map((item) => {
              const product = item.productId;
              if (!product) return null;

              return (
                <div
                  key={product._id}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white dark:bg-darkbg-surface border border-gray-100 dark:border-darkbg-border shadow-sm transition-all hover:border-gray-200 dark:hover:border-darkbg-border"
                >
                  {/* Row Image */}
                  <Link
                    to={`/product/${product._id}`}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-darkbg-border flex-shrink-0"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {product.category}
                    </span>
                    <Link
                      to={`/product/${product._id}`}
                      className="hover:text-brand-500 transition-colors"
                    >
                      <h3 className="font-display font-bold text-base text-gray-900 dark:text-white line-clamp-1 leading-snug">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Price: ${product.price?.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 border border-gray-150 dark:border-darkbg-border rounded-xl px-2.5 py-1 bg-gray-50 dark:bg-darkbg">
                    <button
                      onClick={() => handleQtyChange(product._id, item.quantity, -1, product.stock)}
                      disabled={item.quantity <= 1 || loading}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white p-1 disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(product._id, item.quantity, 1, product.stock)}
                      disabled={item.quantity >= product.stock || loading}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white p-1 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total price row info */}
                  <div className="text-right min-w-[70px] hidden sm:block">
                    <span className="text-[10px] text-gray-400 block uppercase">Subtotal</span>
                    <span className="font-display font-extrabold text-sm text-gray-900 dark:text-white">
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove bin button */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    disabled={loading}
                    className="p-2.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>

                </div>
              );
            })}
          </div>

          {/* Right Column: Order Summary summary card */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-darkbg-surface rounded-3xl border border-gray-100 dark:border-darkbg-border p-6 shadow-premium relative overflow-hidden">
              
              <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              {/* Transaction breakdown lines */}
              <div className="space-y-4 text-sm mb-6 border-b border-gray-50 dark:border-darkbg-border pb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">${cartSubtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-500 font-bold uppercase text-[10px]">Free Shipping</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                {shippingFee > 0 && (
                  <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium">
                    💡 Add <b>${(shippingThreshold - cartSubtotal).toFixed(2)}</b> more to qualify for Free Global Express!
                  </p>
                )}

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-bold text-gray-900 dark:text-white">${taxFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-baseline mb-8">
                <span className="text-base font-bold text-gray-900 dark:text-white">Total Amount</span>
                <span className="font-display text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Checkout link button */}
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-3 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300"
              >
                <CreditCard className="w-4.5 h-4.5" />
                Proceed to Checkout
              </Link>
            </div>

            {/* Shield badge summary details */}
            <div className="flex items-center gap-3 p-4 bg-gray-100/50 dark:bg-darkbg-surface/50 border border-gray-100 dark:border-darkbg-border rounded-2xl text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>Checkout is encrypted and secured by bank-grade TLS. 30-day money-back guarantee included.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
