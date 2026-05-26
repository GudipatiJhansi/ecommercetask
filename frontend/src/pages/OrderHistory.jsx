import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Clock, Truck, CheckCircle2, AlertTriangle, Calendar, MapPin, Hash, ShoppingBag } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/orders/my-orders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to load user orders history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-darkbg py-12 px-4 transition-colors duration-300">
        <section className="max-w-md w-full text-center p-8 bg-white dark:bg-darkbg-surface rounded-3xl border border-gray-100 dark:border-darkbg-border shadow-premium">
          <div className="w-16 h-16 mx-auto bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-2xl flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            No order history found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-8">
            You haven't placed any orders with Zenith yet. Fill up your shopping cart and complete checkouts to see tracking logs.
          </p>
          <a
            href="/"
            className="w-full inline-flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl shadow-premium hover:shadow-premium-hover transition-all"
          >
            Explore Curation
          </a>
        </section>
      </div>
    );
  }

  // Delivery Visual tracking configuration helper
  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white transition-colors duration-300 py-10 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-10">
          My Order History
        </h1>

        {/* Orders List Container */}
        <div className="space-y-8">
          {orders.map((order) => {
            const activeStep = getStatusStep(order.orderStatus);
            const isCancelled = order.orderStatus === 'Cancelled';

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-darkbg-surface rounded-3xl border border-gray-100 dark:border-darkbg-border shadow-premium overflow-hidden transition-all duration-300 hover:border-gray-200"
              >
                {/* Order card Top header strip */}
                <div className="bg-gray-50/50 dark:bg-darkbg/40 border-b border-gray-50 dark:border-darkbg-border p-5 sm:px-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex flex-wrap gap-4 text-xs">
                    
                    {/* Unique OrderId block */}
                    <div className="flex items-center gap-1.5 bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-lg text-brand-700 dark:text-brand-400 font-semibold font-display">
                      <Hash className="w-3.5 h-3.5" />
                      <span>{order.orderId}</span>
                    </div>

                    {/* Date Block */}
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-medium py-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>

                    {/* Total billing Block */}
                    <div className="font-bold py-1 text-gray-800 dark:text-gray-200">
                      Total: <span className="text-brand-600 dark:text-brand-400">${order.totalAmount?.toFixed(2)}</span>
                    </div>

                  </div>

                  {/* Shipment Status Tag */}
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/30'
                        : order.orderStatus === 'Cancelled'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Card Main body: Items purchased + Tracking bar */}
                <div className="p-6 sm:px-8 space-y-6">
                  
                  {/* List of items snap */}
                  <div className="space-y-4">
                    {order.items.map((item, idx) => {
                      const product = item.productId;
                      if (!product) return null;

                      return (
                        <div key={idx} className="flex gap-4 items-center">
                          <Link
                            to={`/product/${product._id}`}
                            className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-darkbg-border flex-shrink-0"
                          >
                            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${product._id}`}
                              className="font-bold text-sm text-gray-900 dark:text-white hover:text-brand-500 truncate block leading-snug"
                            >
                              {product.title}
                            </Link>
                            <span className="text-xs text-gray-400 capitalize">{product.category}</span>
                          </div>
                          <div className="text-right text-xs">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">${item.price?.toFixed(2)}</span>
                            <span className="text-gray-400 block mt-0.5">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Destination Info */}
                  <div className="flex items-start gap-2.5 p-4 bg-gray-50 dark:bg-darkbg/30 border border-gray-100 dark:border-darkbg-border rounded-2xl text-xs text-gray-600 dark:text-gray-400 font-medium">
                    <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Shipping Destination</span>
                      {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                    </div>
                  </div>

                  {/* Visual tracking timeline */}
                  <div className="pt-4 border-t border-gray-50 dark:border-darkbg-border">
                    {isCancelled ? (
                      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-rose-800 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <span>This order was cancelled. Restocked products have been returned to active inventories.</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                          Delivery Tracking Progress
                        </div>

                        {/* Tracker Progress Bar graphics */}
                        <div className="relative flex items-center justify-between w-full px-2 sm:px-12 py-3">
                          
                          {/* Background structural track lines */}
                          <div className="absolute left-[8%] right-[8%] sm:left-[18%] sm:right-[18%] top-1/2 -translate-y-1/2 h-1 bg-gray-100 dark:bg-darkbg-border rounded-full z-0">
                            {/* Lit progress bar */}
                            <div
                              className="h-full bg-brand-500 transition-all duration-500 rounded-full"
                              style={{
                                width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%',
                              }}
                            ></div>
                          </div>

                          {/* Node Step 1: Pending */}
                          <div className="relative z-10 flex flex-col items-center gap-1.5">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${
                                activeStep >= 1
                                  ? 'bg-brand-500 border-brand-500 text-white shadow-premium'
                                  : 'bg-white dark:bg-darkbg border-gray-200 dark:border-gray-800 text-gray-400'
                              }`}
                            >
                              <Clock className="w-4.5 h-4.5" />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeStep >= 1 ? 'text-brand-500 font-semibold' : 'text-gray-400'}`}>
                              Placed
                            </span>
                          </div>

                          {/* Node Step 2: Shipped */}
                          <div className="relative z-10 flex flex-col items-center gap-1.5">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${
                                activeStep >= 2
                                  ? 'bg-brand-500 border-brand-500 text-white shadow-premium'
                                  : 'bg-white dark:bg-darkbg border-gray-200 dark:border-gray-800 text-gray-400'
                              }`}
                            >
                              <Truck className="w-4.5 h-4.5" />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeStep >= 2 ? 'text-brand-500 font-semibold' : 'text-gray-400'}`}>
                              Shipped
                            </span>
                          </div>

                          {/* Node Step 3: Delivered */}
                          <div className="relative z-10 flex flex-col items-center gap-1.5">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${
                                activeStep >= 3
                                  ? 'bg-brand-500 border-brand-500 text-white shadow-premium'
                                  : 'bg-white dark:bg-darkbg border-gray-200 dark:border-gray-800 text-gray-400'
                              }`}
                            >
                              <CheckCircle2 className="w-4.5 h-4.5" />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeStep >= 3 ? 'text-brand-500 font-semibold' : 'text-gray-400'}`}>
                              Delivered
                            </span>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default OrderHistory;
