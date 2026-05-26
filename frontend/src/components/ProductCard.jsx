import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user, toggleWishlist } = useAuth();

  const isWishlisted = user?.wishlist?.some(
    (item) => (item._id || item) === product._id
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product._id, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col w-full rounded-2xl bg-white dark:bg-darkbg-surface border border-gray-100 dark:border-darkbg-border overflow-hidden transition-all duration-300 hover:shadow-premium hover:-translate-y-1 text-left">
      
      {/* Product Image Section */}
      <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-darkbg">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Category Pill Tag */}
        <span className="absolute top-3 left-3 bg-white/90 dark:bg-darkbg/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 border border-gray-200/25 dark:border-white/5">
          {product.category}
        </span>

        {/* Wishlist Toggle Button Overlay */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all duration-300 border ${
            isWishlisted
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20'
              : 'bg-white/80 dark:bg-darkbg-surface/80 border-gray-200/20 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-rose-500'
          }`}
          aria-label="Add product to wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Inventory sold out overlay banner */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white font-display text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-premium">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Information Section */}
      <div className="flex flex-col flex-1 p-4">
        {/* Rating Stars Details */}
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
            {product.rating?.toFixed(1) || '4.5'}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            ({product.reviewsCount || '15'} reviews)
          </span>
        </div>

        {/* Product Title */}
        <Link to={`/product/${product._id}`} className="group-hover:text-brand-500 transition-colors">
          <h3 className="font-display font-bold text-base text-gray-900 dark:text-white line-clamp-1 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Shortened description snippet */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Purchase Footer Section */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 dark:border-darkbg-border">
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold leading-none mb-0.5">
              Price
            </span>
            <span className="font-display text-lg font-extrabold text-gray-900 dark:text-white">
              ${product.price?.toFixed(2)}
            </span>
          </div>

          {/* Checkout trigger button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-premium transition-all duration-300 ${
              isOutOfStock
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-brand-500 hover:bg-brand-600 text-white hover:shadow-premium-hover hover:-translate-y-0.5'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
