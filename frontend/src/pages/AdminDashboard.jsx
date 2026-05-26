import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Sliders,
  Calendar,
  Layers,
  MapPin,
  CheckCircle,
  Hash,
} from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all orders in system (Admin role guaranteed by routing guard)
      const { data: allOrders } = await axios.get('/api/orders');
      setOrders(allOrders);

      // Fetch products to count catalog size
      const { data: prodData } = await axios.get('/api/products?limit=100');
      setProductsCount(prodData.products?.length || 0);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showToast('Unauthorized or database lookup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update shipment status on change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(`/api/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });

      // Update state local order item
      setOrders((prevOrders) =>
        prevOrders.map((ord) => (ord._id === orderId ? data : ord))
      );

      showToast(`Order status updated to "${newStatus}"`, 'success');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update order status';
      showToast(errMsg, 'error');
    }
  };

  // Derive high-level analytics
  const totalSales = orders
    .filter((ord) => ord.orderStatus !== 'Cancelled')
    .reduce((sum, ord) => sum + ord.totalAmount, 0);

  const totalOrders = orders.length;

  const uniqueCustomersCount = new Set(orders.map((ord) => ord.userId?._id || ord.userId)).size;

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white transition-colors duration-300 py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <section className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-10 border-b border-gray-150 dark:border-darkbg-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-brand-500 font-bold uppercase tracking-widest text-xs mb-1">
              <Sliders className="w-4 h-4" />
              <span>Administrative Gateway</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Management Portal
            </h1>
          </div>

          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-premium hover:shadow-premium-hover transition-all"
          >
            <Package className="w-4 h-4" />
            Manage Inventory Catalog
          </Link>
        </section>

        {/* Analytics Statistics Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Gross Sales */}
          <div className="bg-white dark:bg-darkbg-surface p-6 rounded-3xl border border-gray-100 dark:border-darkbg-border shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">
                Gross Revenue
              </span>
              <h3 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white">
                ${totalSales.toFixed(2)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center shadow-sm">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Orders count */}
          <div className="bg-white dark:bg-darkbg-surface p-6 rounded-3xl border border-gray-100 dark:border-darkbg-border shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">
                Total Orders
              </span>
              <h3 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white">
                {totalOrders}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Products Catalog count */}
          <div className="bg-white dark:bg-darkbg-surface p-6 rounded-3xl border border-gray-100 dark:border-darkbg-border shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">
                Catalog Size
              </span>
              <h3 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white">
                {productsCount} items
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/20 text-brand-500 flex items-center justify-center shadow-sm">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Customers count */}
          <div className="bg-white dark:bg-darkbg-surface p-6 rounded-3xl border border-gray-100 dark:border-darkbg-border shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">
                Active Clientele
              </span>
              <h3 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white">
                {uniqueCustomersCount} clients
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/20 text-violet-500 flex items-center justify-center shadow-sm">
              <Users className="w-6 h-6" />
            </div>
          </div>

        </section>

        {/* Orders Log Title */}
        <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-500" />
          Shipment Transactions Registry
        </h2>

        {/* Orders List Container */}
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-darkbg-surface p-12 text-center rounded-3xl border border-gray-100 dark:border-darkbg-border">
            <span className="text-4xl">📦</span>
            <h3 className="font-display font-bold mt-3 text-lg text-gray-800 dark:text-white">No transactions recorded</h3>
            <p className="text-xs text-gray-400 mt-1">Once standard users place checkout orders, they will show up in this panel.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-darkbg-surface rounded-3xl border border-gray-100 dark:border-darkbg-border shadow-sm p-6 flex flex-col gap-6"
              >
                
                {/* Transaction top row metadata */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gray-50 dark:border-darkbg-border pb-4">
                  
                  {/* Order ID & Date details */}
                  <div className="flex flex-wrap gap-4 items-center text-xs">
                    <div className="flex items-center gap-1 bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-lg text-brand-700 dark:text-brand-400 font-semibold font-display">
                      <Hash className="w-3.5 h-3.5" />
                      <span>{order.orderId}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>

                    <div className="font-medium text-gray-700 dark:text-gray-300">
                      Total: <span className="font-bold text-brand-500">${order.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Status Dropdown control */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Update status
                    </span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border focus:outline-none ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/30'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-200 dark:border-rose-900/30'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200 dark:border-amber-900/30'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                </div>

                {/* Main section: Customer, Items list, Destination */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  
                  {/* Column 1: Customer details */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Customer Profile
                    </span>
                    <div className="font-bold text-sm text-gray-900 dark:text-white leading-none">
                      {order.userId?.name || 'Jane Doe'}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">{order.userId?.email || 'user@example.com'}</div>
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-2">
                      <CheckCircle className="w-3 h-3" />
                      Payment Paid
                    </span>
                  </div>

                  {/* Column 2: Items Summary */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Line Items ({order.items.length})
                    </span>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => {
                        const product = item.productId;
                        return (
                          <div key={idx} className="flex gap-2 items-center">
                            <div className="w-8 h-8 bg-gray-50 rounded overflow-hidden flex-shrink-0 border border-gray-100 dark:border-darkbg-border">
                              <img src={product?.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold truncate text-gray-900 dark:text-white">
                                {product?.title || 'Seeded Product'}
                              </div>
                              <span className="text-gray-400 block text-[10px]">
                                {item.quantity} units &times; ${item.price?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 3: Shipping Destination details */}
                  <div className="space-y-1.5 p-4 bg-gray-50 dark:bg-darkbg/30 border border-gray-100 dark:border-darkbg-border rounded-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Shipping Details
                    </span>
                    <div className="flex items-start gap-1.5 font-medium text-gray-700 dark:text-gray-400">
                      <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <div>
                        {order.shippingAddress?.street},<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
