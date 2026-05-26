import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Star, Heart, ShoppingCart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, toggleWishlist } = useAuth();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [recentProducts, setRecentProducts] = useState([]);
  const [adding, setAdding] = useState(false);

  const isWishlisted = user?.wishlist?.some(
    (item) => (item._id || item) === product?._id
  );

  // 1. Fetch Product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setQuantity(1); // Reset quantity selector
        
        // Track recently viewed products in Session Storage
        trackRecentlyViewed(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        showToast('Product not found or unavailable', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  // 2. Track and load recently viewed products
  const trackRecentlyViewed = (currentProd) => {
    let recent = JSON.parse(sessionStorage.getItem('recentViewed')) || [];
    // Remove if already exists to move it to the front
    recent = recent.filter((p) => p._id !== currentProd._id);
    // Add to front
    recent.unshift(currentProd);
    // Slice to max 4 items
    recent = recent.slice(0, 5); // Keep current + 4 alternatives
    sessionStorage.setItem('recentViewed', JSON.stringify(recent));
  };

  useEffect(() => {
    // Load other recently viewed items (excluding current product)
    let recent = JSON.parse(sessionStorage.getItem('recentViewed')) || [];
    const filtered = recent.filter((p) => p._id !== id).slice(0, 4);
    setRecentProducts(filtered);
  }, [id, product]);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAdd = async () => {
    if (!product) return;
    setAdding(true);
    const success = await addToCart(product._id, quantity);
    setAdding(false);
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist(product._id);
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!product) return null;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white transition-colors duration-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        {/* Product Details Sheet Grid */}
        <section className="bg-white dark:bg-darkbg-surface rounded-3xl border border-gray-100 dark:border-darkbg-border p-6 sm:p-8 lg:p-12 shadow-premium mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Product Image Frame */}
            <div className="flex justify-center items-center rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-darkbg-border overflow-hidden aspect-square relative shadow-inner">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              {isOutOfStock && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-premium">
                  Sold Out
                </span>
              )}
            </div>

            {/* Right Column: Descriptions & Actions */}
            <div className="flex flex-col text-left">
              
              {/* Category Pill Tag */}
              <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-200/50 dark:border-brand-900/30 mb-4">
                {product.category}
              </span>

              {/* Product Title */}
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-3">
                {product.title}
              </h1>

              {/* Rating and Review Tally */}
              <div className="flex items-center gap-1.5 mb-6">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {product.rating?.toFixed(1) || '4.5'}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ({product.reviewsCount || '15'} verified customer reviews)
                </span>
              </div>

              {/* Pricing banner */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                  ${product.price?.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400">Custom duties included</span>
              </div>

              <hr className="border-gray-100 dark:border-darkbg-border mb-6" />

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Stock Status Indicator */}
              <div className="mb-6 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {isOutOfStock
                    ? 'Out of Stock'
                    : `In Stock — ${product.stock} units available`}
                </span>
              </div>

              {/* Add to Cart Actions */}
              {!isOutOfStock && (
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {/* Quantity Incrementor */}
                  <div className="flex items-center justify-between border border-gray-200 dark:border-darkbg-border rounded-xl px-4 py-2 bg-gray-50 dark:bg-darkbg sm:w-32">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white font-bold p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                      className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white font-bold p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Action */}
                  <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="flex-1 flex items-center justify-center gap-3 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-premium hover:shadow-premium-hover transition-all duration-300"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {adding ? 'Adding to Cart...' : 'Add to Cart'}
                  </button>

                  {/* Wishlist button */}
                  <button
                    onClick={handleWishlist}
                    className={`p-3.5 border rounded-xl flex items-center justify-center transition-all ${
                      isWishlisted
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                        : 'border-gray-200 dark:border-darkbg-border text-gray-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              )}

              {/* Service/Shipping Bullet points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-darkbg/50 border border-gray-100 dark:border-darkbg-border text-xs text-gray-500 dark:text-gray-400 font-medium mt-auto">
                <div className="flex items-center gap-2">
                  <Truck className="w-4.5 h-4.5 text-brand-500 flex-shrink-0" />
                  <span>Free Global Express</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-brand-500 flex-shrink-0" />
                  <span>2-Year Full Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4.5 h-4.5 text-brand-500 flex-shrink-0" />
                  <span>30-Day Free Return</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Recently Viewed Products Grid section */}
        {recentProducts.length > 0 && (
          <section className="text-left mb-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Recently Viewed Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recentProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
