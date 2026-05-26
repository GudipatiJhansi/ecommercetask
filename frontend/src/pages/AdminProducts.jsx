import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Sliders,
  ArrowLeft,
  X,
  Package,
  Layers,
  Image as ImageIcon,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

const CATEGORIES = ['Electronics', 'Wearables', 'Accessories', 'Home Decor'];

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // If null, we are creating a new product
  const { showToast } = useToast();

  // Modal Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products?limit=100');
      setProducts(data.products);
    } catch (err) {
      console.error('Failed to fetch admin product list:', err);
      showToast('Error loading catalog items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open modal in CREATE mode
  const handleOpenCreate = () => {
    setEditProduct(null);
    setTitle('');
    setCategory('Electronics');
    setPrice('');
    setStock('');
    setImageUrl(MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)]); // Prefill with nice mock image!
    setDescription('');
    setModalOpen(true);
  };

  // Open modal in EDIT mode
  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setTitle(product.title);
    setCategory(product.category);
    setPrice(product.price);
    setStock(product.stock);
    setImageUrl(product.imageUrl);
    setDescription(product.description);
    setModalOpen(true);
  };

  // Delete product action
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast('Product successfully removed from catalog', 'success');
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  };

  // Form Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || price === '' || stock === '' || !imageUrl || !description) {
      showToast('Please fill out all product form fields.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title,
        category,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        description,
      };

      if (editProduct) {
        // UPDATE MODE
        const { data } = await axios.put(`/api/products/${editProduct._id}`, payload);
        setProducts((prev) =>
          prev.map((p) => (p._id === editProduct._id ? data : p))
        );
        showToast('Product updated successfully!', 'success');
      } else {
        // CREATE MODE
        const { data } = await axios.post('/api/products', payload);
        setProducts((prev) => [data, ...prev]);
        showToast('New product added to catalog!', 'success');
      }

      setModalOpen(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to save product details';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !modalOpen) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white transition-colors duration-300 py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation / Header */}
        <section className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-10 border-b border-gray-150 dark:border-darkbg-border pb-6">
          <div className="space-y-1">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-brand-500 transition-colors uppercase tracking-wider mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Admin Panel
            </Link>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
              Inventory Catalog Manager
            </h1>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-premium hover:shadow-premium-hover transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </section>

        {/* Product Catalog Grid list */}
        {products.length === 0 ? (
          <div className="bg-white dark:bg-darkbg-surface p-12 text-center rounded-3xl border border-gray-100 dark:border-darkbg-border">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-gray-800 dark:text-white">Catalog is empty</h3>
            <p className="text-xs text-gray-400 mt-1 mb-6">Start building your shopping pipeline by adding products.</p>
            <button onClick={handleOpenCreate} className="px-6 py-2.5 bg-brand-500 text-white font-bold rounded-xl text-xs uppercase shadow-premium">
              Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod._id}
                className="bg-white dark:bg-darkbg-surface rounded-2xl border border-gray-100 dark:border-darkbg-border overflow-hidden p-4 flex gap-4 transition-all hover:border-gray-250 relative shadow-sm hover:shadow"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-darkbg-border flex-shrink-0">
                  <img src={prod.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Details info */}
                <div className="flex-1 min-w-0 text-xs">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {prod.category}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate block mt-0.5 mb-1 leading-snug">
                    {prod.title}
                  </h4>
                  <div className="flex gap-4 items-center text-gray-500 dark:text-gray-400">
                    <div>Price: <span className="font-bold text-gray-900 dark:text-white">${prod.price?.toFixed(2)}</span></div>
                    <div>Stock: <span className={`font-bold ${prod.stock === 0 ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>{prod.stock}</span></div>
                  </div>
                </div>

                {/* Row actions */}
                <div className="flex flex-col gap-2 justify-center border-l border-gray-50 dark:border-darkbg-border pl-3 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEdit(prod)}
                    className="p-2 rounded-lg text-brand-600 hover:text-brand-800 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors"
                    title="Edit details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(prod._id)}
                    className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* CREATE / EDIT SLIDEOVER MODAL OVERLAY */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in text-left">
          
          <div className="bg-white dark:bg-darkbg-surface w-full max-w-xl rounded-3xl border border-gray-100 dark:border-darkbg-border shadow-premium overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-gray-50/50 dark:bg-darkbg/40 border-b border-gray-50 dark:border-darkbg-border p-5 sm:px-6">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-500" />
                {editProduct ? 'Edit Product Details' : 'Add New Catalog Product'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-darkbg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Product Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Product Title
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AeroSound Headphones"
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              {/* Category & Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Category Group
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-500 transition-all"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Product Price ($ USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="199.99"
                      required
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Stock and Image URL Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stock count */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Inventory Stock Count
                  </label>
                  <div className="relative">
                    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="25"
                      required
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                {/* Image URL string */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Thumbnail Image URL
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      required
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Product Description details
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about specifications, features, dimensions..."
                  rows="4"
                  required
                  className="w-full p-3 text-xs rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 transition-all resize-none"
                ></textarea>
              </div>

              {/* Modal actions footer */}
              <div className="pt-4 border-t border-gray-50 dark:border-darkbg-border flex gap-3 justify-end text-xs font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkbg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-premium disabled:opacity-50"
                >
                  {submitting ? 'Saving changes...' : 'Save Product Details'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
