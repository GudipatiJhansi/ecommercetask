import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, RefreshCw, ArrowRight } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Wearables', 'Accessories', 'Home Decor'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounced/delayed search state
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch products from database API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page,
          limit: 8,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (category && category !== 'All') params.category = category;
        if (sort) params.sort = sort;

        const { data } = await axios.get('/api/products', { params });
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err.response?.data?.message || err.message || 'Connection to backend failed');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [debouncedSearch, category, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-brand-600 to-indigo-800 text-white rounded-b-[2rem] shadow-premium mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)]"></div>
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/20 backdrop-blur-md mb-6 animate-pulse">
              ⚡ Exclusive Launch Season
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
              Elevate Your Daily Digital Space
            </h1>
            <p className="text-base sm:text-lg text-indigo-100 mb-8 leading-relaxed">
              Discover our carefully curated line of high-fidelity wireless audio gears, intelligent biometrics wearables, and designer office lighting.
            </p>
            <a
              href="#store-front"
              className="inline-flex items-center gap-2 bg-white text-brand-700 hover:bg-indigo-50 font-bold px-6 py-3 rounded-xl shadow-premium transition-all hover:scale-105"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Primary Storefront Interface */}
      <main id="store-front" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <p className="text-sm font-semibold">API Error: {error}. Check if your backend server is running and database is connected.</p>
            </div>
            <button onClick={() => setError(null)} className="text-xs hover:underline font-bold uppercase">Dismiss</button>
          </div>
        )}

        {/* Filtering & Search Controllers */}
        <section className="bg-white dark:bg-darkbg-surface p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-darkbg-border shadow-sm mb-8">
          <div className="flex flex-col gap-4">
            
            {/* Search Input and Sort Dropdown */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
              {/* Search Bar Input */}
              <div className="relative w-full lg:max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products by title or keywords..."
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>

              {/* Sorting Filter */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Sort By</span>
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-500 transition-colors"
                >
                  <option value="">Featured (Newest)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Category selection Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-gray-50 dark:border-darkbg-border">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setPage(1); // Reset to page 1 on category change
                  }}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex-shrink-0 ${
                    category === cat
                      ? 'bg-brand-500 text-white shadow-premium'
                      : 'bg-gray-100 dark:bg-darkbg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-darkbg-border hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* Catalog count & Reset shortcut */}
        <div className="flex justify-between items-center mb-6 px-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Showing {products.length} of {total} products
          </p>
          {(search || category !== 'All' || sort) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Loading Spinner or Grid feed */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-darkbg-surface rounded-2xl border border-gray-100 dark:border-darkbg-border p-4 flex flex-col gap-4 animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-darkbg-border rounded-xl"></div>
                <div className="h-4 bg-gray-200 dark:bg-darkbg-border rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-darkbg-border rounded w-full"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-6 bg-gray-200 dark:bg-darkbg-border rounded w-1/3"></div>
                  <div className="h-8 bg-gray-200 dark:bg-darkbg-border rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <section className="bg-white dark:bg-darkbg-surface p-12 rounded-2xl border border-gray-100 dark:border-darkbg-border text-center">
            <span className="text-5xl">🔍</span>
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mt-4">
              No matching products found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
              We couldn't find anything matching your current filters. Try refining your keyword search or category filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-premium text-sm font-semibold"
            >
              Reset Filters
            </button>
          </section>
        ) : (
          <>
            {/* Products Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkbg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {Array.from({ length: pages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                      page === idx + 1
                        ? 'bg-brand-500 text-white shadow-premium'
                        : 'border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkbg-surface'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={page === pages}
                  onClick={() => setPage((p) => Math.min(p + 1, pages))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkbg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
